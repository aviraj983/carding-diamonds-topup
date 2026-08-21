import crypto from "crypto";

function generateWatchPaysSignature(params, apiKey) {
  const filtered = {};
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
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

    const merchantId = process.env.WATCHPAYS_MERCHANT_ID || "100555238";
    const apiKey = process.env.WATCHPAYS_API_KEY || "8f0b68cd9c73c0db0131d86da6def792";
    const gatewayApiUrl = "https://api.watchpays.com/v1/create";

    if (!amount) {
      return res.status(400).json({ success: false, error: "Amount is required" });
    }

    const formattedAmount = Number(amount).toFixed(2);
    const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const host = req.headers.host || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/api/payment/callback`;

    const extraData = playerUid ? `UID_${playerUid}` : `Diamonds_${diamonds || ""}`;

    const signParams = {
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

    let responseData = null;
    let paymentUrl = null;

    try {
      const response = await fetch(gatewayApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const rawText = await response.text();
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {}

      if (responseData && responseData.success && responseData.payment_url) {
        paymentUrl = responseData.payment_url;
      }
    } catch (e) {
      console.error("WatchPays API exception:", e);
    }

    if (paymentUrl) {
      return res.status(200).json({
        success: true,
        paymentUrl: paymentUrl,
        merchantOrderNo: responseData?.merchant_order_no || merchantOrderNo,
        amount: responseData?.amount || formattedAmount,
      });
    } else {
      return res.status(200).json({
        success: false,
        error: responseData?.message || "Payment gateway error. Please try again.",
      });
    }
  } catch (error) {
    console.error("WatchPays order creation exception:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error creating payment order",
    });
  }
}
