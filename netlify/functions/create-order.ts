import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";

function generateWatchPaysSignature(
  params: Record<string, string>,
  apiKey: string
): string {
  const filtered: Record<string, string> = {};
  for (const key of Object.keys(params)) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      filtered[key] = String(params[key]);
    }
  }

  const sortedKeys = Object.keys(filtered).sort();

  let signStr = "";
  for (const k of sortedKeys) {
    signStr += `${k}=${filtered[k]}&`;
  }

  signStr += `key=${apiKey}`;

  return crypto.createHash("md5").update(signStr).digest("hex");
}

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { amount, playerUid, diamonds } = body;

    const merchantId =
      process.env.WATCHPAYS_MERCHANT_ID || "100555238";
    const apiKey =
      process.env.WATCHPAYS_API_KEY || "8f0b68cd9c73c0db0131d86da6def792";
    const gatewayApiUrl = "https://api.watchpays.com/v1/create";

    if (!amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Amount is required" }),
      };
    }

    const formattedAmount = Number(amount).toFixed(2);
    const merchantOrderNo = `ORD${Date.now()}${Math.floor(
      100 + Math.random() * 900
    )}`;

    // Use the site URL from Netlify env or fallback
    const siteUrl = process.env.URL || process.env.DEPLOY_URL || "https://your-site.netlify.app";
    const callbackUrl = `${siteUrl}/.netlify/functions/payment-callback`;

    const extraData = playerUid
      ? `UID_${playerUid}`
      : `Diamonds_${diamonds || ""}`;

    // Only 4 params in signature per WatchPays PHP spec
    // Do NOT include extra or api_key
    const signParams: Record<string, string> = {
      amount: formattedAmount,
      callback_url: callbackUrl,
      merchant_id: merchantId,
      merchant_order_no: merchantOrderNo,
    };

    const signature = generateWatchPaysSignature(signParams, apiKey);

    const requestPayload = {
      merchant_id: merchantId,
      api_key: apiKey,
      amount: formattedAmount,
      merchant_order_no: merchantOrderNo,
      callback_url: callbackUrl,
      extra: extraData,
      signature: signature,
    };

    console.log("Sending WatchPays Pay-in order request:", JSON.stringify(requestPayload, null, 2));

    let responseData: any = null;
    let paymentUrl: string | null = null;

    try {
      const response = await fetch(gatewayApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const rawText = await response.text();
      console.log("WatchPays raw response:", rawText);
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {}

      if (responseData && responseData.success && responseData.payment_url) {
        paymentUrl = responseData.payment_url;
      }
    } catch (e: any) {
      console.error("WatchPays API exception:", e?.message || e);
    }

    if (paymentUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          paymentUrl: paymentUrl,
          merchantOrderNo: responseData?.merchant_order_no || merchantOrderNo,
          amount: responseData?.amount || formattedAmount,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: responseData?.message || "Payment gateway error. Please try again.",
        }),
      };
    }
  } catch (error: any) {
    console.error("WatchPays order creation exception:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error:
          error?.message || "Internal server error creating payment order",
      }),
    };
  }
};

export { handler };
