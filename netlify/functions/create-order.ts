import type { Handler, HandlerEvent } from "@netlify/functions";
import crypto from "crypto";

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

    const merchantId = process.env.SUNPAYS_MERCHANT_ID || "40794632";
    const apiKey = process.env.SUNPAYS_API_KEY || "ecee0739b16abec50862a78185b881e3f1772c8bd5dced5b";
    const apiSecret = process.env.SUNPAYS_API_SECRET || apiKey;
    const gatewayApiUrl = "https://sunpaytm.quest/api/public/v1/payins";

    if (!amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Amount is required" }),
      };
    }

    const numericAmount = Math.round(Number(amount));
    const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const siteUrl = process.env.URL || process.env.DEPLOY_URL || "https://your-site.netlify.app";
    const callbackUrl = `${siteUrl}/.netlify/functions/payment-callback`;

    const requestPayload = {
      order_id: merchantOrderNo,
      amount: numericAmount,
      currency: "INR",
      method: "upi",
      notify_url: callbackUrl,
      metadata: {
        merchant_id: merchantId,
        player_uid: playerUid || "",
        diamonds: String(diamonds || "")
      }
    };

    const rawBody = JSON.stringify(requestPayload);
    const signature = crypto.createHmac("sha256", apiSecret).update(rawBody).digest("hex");

    console.log("Sending Sunpays Pay-in order request to:", gatewayApiUrl);
    console.log("Payload:", rawBody);
    console.log("Signature:", signature);

    let responseData: any = null;
    let paymentUrl: string | null = null;

    try {
      const response = await fetch(gatewayApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-signature": signature
        },
        body: rawBody,
      });

      const rawText = await response.text();
      console.log("Sunpays raw response:", rawText);
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {}

      if (responseData && (responseData.checkout_url || responseData.payment_url || responseData.redirect_url)) {
        paymentUrl = responseData.checkout_url || responseData.payment_url || responseData.redirect_url;
      }
    } catch (e: any) {
      console.error("Sunpays API exception:", e?.message || e);
    }

    if (paymentUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          paymentUrl: paymentUrl,
          checkoutUrl: paymentUrl,
          merchantOrderNo: responseData?.order_id || merchantOrderNo,
          amount: responseData?.amount || numericAmount,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: responseData?.message || responseData?.error || "Sunpays Payment Gateway error. Please try again.",
        }),
      };
    }
  } catch (error: any) {
    console.error("Sunpays order creation exception:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error?.message || "Internal server error creating Sunpays payment order",
      }),
    };
  }
};

export { handler };
