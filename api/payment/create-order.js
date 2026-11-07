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
    const isPakistan = country === "PK" || currency === "PKR" || paymentMethod === "easypaisa" || paymentMethod === "jazzcash";

    // ============================================
    // Pakistan Gateway: EDPay (Easypaisa / JazzCash)
    // ============================================
    if (isPakistan) {
      const edPayBaseUrl = process.env.EDPAY_BASE_URL || "https://ed-pay.space";
      const edPayKeyId = process.env.EDPAY_KEY_ID || "pk_in_96a38eb305e2f97e";
      const edPaySecret = process.env.EDPAY_SECRET || "sk_045cd192007c299d1e9f00e34cc4cc3323b70face12a41b4";
      const formattedAmount = String(Math.round(amount));
      const merOrderNo = `FFPK_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const returnUrl = `${appBaseUrl}/?status=success&orderId=${merOrderNo}`;

      // Format customer mobile (clean digits, ensure standard 03XXXXXXXXX format)
      let cleanMobile = (body.mobile || "").replace(/[^\d]/g, "");
      if (cleanMobile.length === 10 && cleanMobile.startsWith("3")) {
        cleanMobile = "0" + cleanMobile;
      }
      if (!cleanMobile || cleanMobile.length !== 11 || !cleanMobile.startsWith("03")) {
        cleanMobile = "03001234567";
      }

      // Pakistan Gateway: EasyPaisa (PK_WALLET_EASYPAISA) or JazzCash (PK_WALLET_JAZZCASH)
      const isJazzCash = paymentMethod === "jazzcash" || paymentMethod === "PK_WALLET_JAZZCASH" || paymentMethod === "EDJC";
      const payMethod = isJazzCash ? "PK_WALLET_JAZZCASH" : "PK_WALLET_EASYPAISA";

      const edPayPayload = {
        merOrderNo: merOrderNo,
        amount: formattedAmount,
        payMethod: payMethod,
        mobile: cleanMobile,
        returnUrl: returnUrl,
        notifyUrl: callbackUrl,
      };

      if (playerUid) {
        edPayPayload.accountName = `FF_${playerUid}`;
      }
      if (body.cnic) {
        edPayPayload.cnic = String(body.cnic).replace(/[^\d]/g, "");
      } else if (isJazzCash) {
        edPayPayload.cnic = "3520112345671";
      }

      console.log("Sending EDPay PK Pay-in request:", JSON.stringify(edPayPayload, null, 2));

      let responseData = null;
      let paymentUrl = null;
      let lastError = "";

      // Retry up to 3 times with 2s delay (EDPay upstream can be intermittent)
      for (let attempt = 1; attempt <= 3; attempt++) {
        // Generate a fresh merOrderNo for each attempt to avoid duplicate rejections
        const attemptOrderNo = `FFPK_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        edPayPayload.merOrderNo = attemptOrderNo;

        try {
          console.log(`EDPay attempt ${attempt}/3 (orderNo: ${attemptOrderNo})...`);
          const response = await fetch(`${edPayBaseUrl}/api/public/payment/order/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-EDPay-Key-Id": edPayKeyId,
              "X-EDPay-Secret": edPaySecret,
            },
            body: JSON.stringify(edPayPayload),
          });

          const rawText = await response.text();
          console.log(`EDPay attempt ${attempt} response:`, response.status, rawText.substring(0, 300));

          if (response.status === 502 || rawText.includes("error code: 502")) {
            lastError = "upstream_502";
            if (attempt < 3) {
              await new Promise((r) => setTimeout(r, 2000));
              continue;
            }
            break;
          }

          try {
            responseData = JSON.parse(rawText);
          } catch (e) {}

          if (responseData && responseData.code === 0 && responseData.data?.paymentLink) {
            paymentUrl = responseData.data.paymentLink;
          } else {
            lastError = responseData?.msg || "Unknown gateway error";
          }
          break;
        } catch (e) {
          console.error(`EDPay attempt ${attempt} exception:`, e);
          lastError = "network";
          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
      }

      if (paymentUrl) {
        return res.status(200).json({
          success: true,
          paymentUrl: paymentUrl,
          checkoutUrl: paymentUrl,
          orderId: responseData.data.merOrderNo || merOrderNo,
          orderNo: responseData.data.orderNo,
          amount: responseData.data.amount || formattedAmount,
        });
      }

      const errorMsg =
        lastError === "upstream_502"
          ? "EDPay upstream payment provider is temporarily down (502). This is an issue on EDPay/Rinvexpay side — please try again in a few minutes or contact your EDPay account manager."
          : lastError === "network"
          ? "Network error connecting to Pakistan payment gateway. Please check your internet and try again."
          : lastError || "Failed to initialize Pakistan payment gateway. Please try again.";
      return res.status(200).json({ success: false, error: errorMsg });
    }

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
