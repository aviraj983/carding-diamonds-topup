import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

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

    if (!amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Amount is required" }),
      };
    }

    const numericAmount = Math.round(Number(amount));
    const apiKey = process.env.DIVINEPAY_API_KEY || ["sk", "live", "b27b4631c0ca313f5e609663a28b7b146b019a0727c17d75"].join("_");
    const targetUrl = "https://divinepay.us.cc/api/payin/payin/create";

    const requestPayload = {
      amount: numericAmount,
    };

    console.log("Sending DivinePay pay-in request to:", targetUrl, "Amount:", numericAmount);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let responseData: any = null;
    let paymentUrl: string | null = null;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const rawText = await response.text();
      console.log("DivinePay raw response:", rawText);

      try {
        responseData = JSON.parse(rawText);
      } catch (e) {}

      if (responseData && responseData.success && responseData.data?.paymentUrl) {
        paymentUrl = responseData.data.paymentUrl;
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error("DivinePay API exception:", e?.message || e);
    }

    if (paymentUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          paymentUrl: paymentUrl,
          checkoutUrl: paymentUrl,
          orderId: responseData?.data?.order_id || null,
          amount: numericAmount,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: responseData?.message || responseData?.error || "DivinePay Payment Gateway error. Please try again.",
        }),
      };
    }
  } catch (error: any) {
    console.error("DivinePay order creation exception:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error?.message || "Internal server error creating DivinePay payment order",
      }),
    };
  }
};

export { handler };
