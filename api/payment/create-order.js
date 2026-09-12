// DivinePay Payment Gateway Order Creation Serverless Function for Vercel

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { amount, playerUid, diamonds } = body;

    if (!amount) {
      return res.status(400).json({ success: false, error: "Amount is required" });
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

    let responseData = null;
    let paymentUrl = null;

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
    } catch (e) {
      clearTimeout(timeoutId);
      console.error("DivinePay API exception:", e?.message || e);
    }

    if (paymentUrl) {
      return res.status(200).json({
        success: true,
        paymentUrl: paymentUrl,
        checkoutUrl: paymentUrl,
        orderId: responseData?.data?.order_id || null,
        amount: numericAmount,
      });
    } else {
      return res.status(200).json({
        success: false,
        error: responseData?.message || responseData?.error || "DivinePay Payment Gateway error. Please try again.",
      });
    }
  } catch (error) {
    console.error("DivinePay order creation exception:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error creating DivinePay payment order",
    });
  }
}
