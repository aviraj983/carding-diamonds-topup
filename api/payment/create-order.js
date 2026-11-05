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

function generateDivinePaySignature(params, secret) {
  const str = Object.keys(params)
    .filter((k) => k !== "sign" && params[k] !== "" && params[k] !== null && params[k] !== undefined)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHmac("sha256", secret).update(str, "utf8").digest("hex");
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
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { amount, playerUid, diamonds, country, currency, paymentMethod } = body;

    if (!amount) {
      return res.status(400).json({ success: false, error: "Amount is required" });
    }

    const host = req.headers.host || "localhost:3000";
    const isHttps = !host.includes("localhost") && (req.headers["x-forwarded-proto"] === "https" || req.connection?.encrypted);
    const appBaseUrl = isHttps ? `https://${host}` : (process.env.APP_URL || "https://carding-diamonds-topup.vercel.app");
    const callbackUrl = `${appBaseUrl}/api/payment/callback`;

    const isBangladesh = country === "BD" || currency === "BDT" || paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "bank";

    // ============================================
    // Bangladesh Gateway: DivinePay (bKash / Nagad / Bank)
    // ============================================
    if (isBangladesh) {
      const bdMerchantId = process.env.DIVINEPAY_MERCHANT_ID || "bd_e51bd686f430172b";
      const bdApiSecret = process.env.DIVINEPAY_API_SECRET || "f45349c5d0003822dbe9cedf833a3a771585dc932f5978076f0b33db69f59ca1";
      const formattedAmount = Number(amount).toFixed(2);
      const orderId = `FFBD_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
      const returnUrl = `${appBaseUrl}/?status=success&orderId=${orderId}`;

      const divinePayBody = {
        merchantId: bdMerchantId,
        orderId: orderId,
        amount: formattedAmount,
        method: paymentMethod === "nagad" ? "nagad" : paymentMethod === "bank" ? "bank" : "bkash",
        timestamp: String(Date.now()),
        notifyUrl: callbackUrl,
        returnUrl: returnUrl,
      };

      if (playerUid) {
        divinePayBody.customerName = `FF_${playerUid}`;
      }

      divinePayBody.sign = generateDivinePaySignature(divinePayBody, bdApiSecret);

      console.log("Sending DivinePay BD Pay-in request:", JSON.stringify(divinePayBody, null, 2));

      let responseData = null;
      let paymentUrl = null;

      try {
        const response = await fetch("https://bd.divinepay.top/api/v1/payin/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(divinePayBody),
        });

        const rawText = await response.text();
        console.log("DivinePay raw response:", rawText);
        try {
          responseData = JSON.parse(rawText);
        } catch (e) {}

        if (responseData && (responseData.code === 200 || responseData.status === "success") && responseData.data?.payUrl) {
          paymentUrl = responseData.data.payUrl;
        }
      } catch (e) {
        console.error("DivinePay API exception:", e);
      }

      if (paymentUrl) {
        return res.status(200).json({
          success: true,
          paymentUrl: paymentUrl,
          checkoutUrl: paymentUrl,
          orderId: responseData?.data?.orderId || orderId,
          orderNo: responseData?.data?.orderNo,
          amount: responseData?.data?.amount || formattedAmount,
        });
      } else {
        return res.status(200).json({
          success: false,
          error: responseData?.msg || responseData?.message || "DivinePay payment gateway error. Please try again.",
        });
      }
    }

    // ============================================
    // India Gateway: WatchPays (UPI)
    // ============================================
    const merchantId = process.env.WATCHPAYS_MERCHANT_ID || "100666060";
    const apiKey = process.env.WATCHPAYS_API_KEY || "c76ec04f7b270339aaa05d66c71aed94";
    const gatewayApiUrl = "https://api.watchpays.com/v1/create";

    const formattedAmount = Number(amount).toFixed(2);
    const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
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
        checkoutUrl: paymentUrl,
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
    console.error("Order creation exception:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error creating payment order",
    });
  }
}
