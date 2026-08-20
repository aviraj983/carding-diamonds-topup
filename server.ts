import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Helper to generate WatchPays MD5 signature according to official specification
function generateWatchPaysSignature(
  params: Record<string, string>,
  apiKey: string
): string {
  // 1. Filter out empty/null values
  const filtered: Record<string, string> = {};
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      filtered[key] = String(params[key]);
    }
  }

  // 2. Sort keys alphabetically
  const sortedKeys = Object.keys(filtered).sort();

  // 3. Build query string: k1=v1&k2=v2&...&
  let signStr = "";
  for (const k of sortedKeys) {
    signStr += `${k}=${filtered[k]}&`;
  }

  // 4. Append API key: key=API_KEY
  signStr += `key=${apiKey}`;

  // 5. MD5 hash
  return crypto.createHash("md5").update(signStr).digest("hex");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Free Fire UID Checker Proxy
  app.get("/api/verify-uid", async (req, res) => {
    try {
      const uid = (req.query.uid as string || "").trim();
      if (!uid || !/^\d{5,14}$/.test(uid)) {
        return res.status(400).json({
          error: true,
          status: 400,
          msg: "Invalid Free Fire UID. UID must be 5 to 14 numeric digits.",
        });
      }

      const apiKey =
        process.env.RAPIDAPI_KEY || "b9172a8c93msh580d2723f591e4bp1b75a7jsnbe815744d293";
      const rapidApiHost = "id-game-checker.p.rapidapi.com";
      const targetUrl = `https://${rapidApiHost}/ff-global/${encodeURIComponent(uid)}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": rapidApiHost,
          "content-type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.error === true || !data.data?.username) {
        return res.status(200).json({
          error: true,
          status: 404,
          msg: "Player UID not found",
          data: null,
        });
      }

      return res.json(data);
    } catch (err: any) {
      console.error("Error verifying Free Fire UID:", err);
      return res.status(500).json({
        error: true,
        status: 500,
        msg: err?.message || "Internal server error connecting to game checker",
      });
    }
  });

  // WatchPays Create Order Endpoint
  app.post("/api/payment/create-order", async (req, res) => {
    try {
      const { amount, playerUid, diamonds } = req.body;

      const merchantId = process.env.WATCHPAYS_MERCHANT_ID || "100555238";
      const apiKey = process.env.WATCHPAYS_API_KEY || "8f0b68cd9c73c0db0131d86da6def792";
      const gatewayApiUrl = "https://api.watchpays.com/v1/create";

      if (!amount) {
        return res.status(400).json({ success: false, error: "Amount is required" });
      }

      // Format amount strictly with 2 decimals as required
      const formattedAmount = Number(amount).toFixed(2);
      const merchantOrderNo = `ORD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

      // Construct host callback URL
      const host = req.get("host") || "ais-dev-274tg4ympafflhmne7icjw-794323121532.asia-east1.run.app";
      const protocol = req.protocol === "http" && !host.includes("localhost") ? "https" : req.protocol;
      const callbackUrl = `${protocol}://${host}/api/payment/callback`;

      const extraData = playerUid ? `UID_${playerUid}` : `Diamonds_${diamonds || ""}`;

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

      console.log("Sending WatchPays Pay-in order request:", {
        merchant_id: merchantId,
        amount: formattedAmount,
        merchant_order_no: merchantOrderNo,
        signature,
      });

      const response = await fetch(gatewayApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const rawText = await response.text();
      let responseData: any = null;

      try {
        responseData = JSON.parse(rawText);
      } catch (e) {
        console.warn("WatchPays response is not JSON:", rawText);
      }

      if (responseData && responseData.payment_url) {
        return res.json({
          success: true,
          paymentUrl: responseData.payment_url,
          merchantOrderNo: responseData.merchant_order_no || merchantOrderNo,
          orderNo: responseData.order_no,
          amount: responseData.amount || formattedAmount,
        });
      }

      if (responseData && responseData.success === false) {
        return res.status(400).json({
          success: false,
          error: responseData.message || responseData.error || "WatchPays payment creation failed",
        });
      }

      // If text error or specific message
      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: rawText || "WatchPays Gateway returned an error",
        });
      }

      return res.json({
        success: true,
        data: responseData || rawText,
        paymentUrl: responseData?.payment_url || null,
      });
    } catch (error: any) {
      console.error("WatchPays order creation exception:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Internal server error creating payment order",
      });
    }
  });

  // WatchPays Callback / Webhook Endpoint
  app.post("/api/payment/callback", (req, res) => {
    console.log("WatchPays Webhook Callback received:", req.body);
    // Return success acknowledgement to WatchPays
    res.json({ success: true, status: "OK" });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Free Fire Store server running on port ${PORT}`);
  });
}

startServer();