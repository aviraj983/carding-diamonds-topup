import crypto from "crypto";

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

    const merchantId = process.env.SUNPAYS_MERCHANT_ID || "40794632";
    const apiKey = process.env.SUNPAYS_API_KEY || "ecee0739b16abec50862a78185b881e3f1772c8bd5dced5b";
    const apiSecret = process.env.SUNPAYS_API_SECRET || apiKey;
    const gatewayApiUrl = "https://sunpaytm.quest/api/public/v1/payins";

    if (!amount) {
      return res.status(400).json({ success: false, error: "Amount is required" });
    }

    const numericAmount = Math.round(Number(amount));
    const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const host = req.headers.host || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/api/payment/callback`;

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

    let responseData = null;
    let paymentUrl = null;

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
    } catch (e) {
      console.error("Sunpays API exception:", e);
    }

    if (paymentUrl) {
      return res.status(200).json({
        success: true,
        paymentUrl: paymentUrl,
        checkoutUrl: paymentUrl,
        merchantOrderNo: responseData?.order_id || merchantOrderNo,
        amount: responseData?.amount || numericAmount,
      });
    } else {
      return res.status(200).json({
        success: false,
        error: responseData?.message || responseData?.error || "Sunpays Payment Gateway error. Please try again.",
      });
    }
  } catch (error) {
    console.error("Sunpays order creation exception:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error creating Sunpays payment order",
    });
  }
}
