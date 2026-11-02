import crypto from "crypto";

function verifyDivinePayWebhook(body, secret) {
  if (!body || !body.sign) return false;
  const str = Object.keys(body)
    .filter((k) => k !== "sign" && body[k] !== "" && body[k] !== null && body[k] !== undefined)
    .sort()
    .map((k) => `${k}=${body[k]}`)
    .join("&");
  const expected = crypto.createHmac("sha256", secret).update(str, "utf8").digest("hex");
  return expected === body.sign;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "OK", message: "Payment webhook endpoint is active" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    console.log("Payment Webhook received:", JSON.stringify(body, null, 2));

    const webhookSecret = process.env.DIVINEPAY_WEBHOOK_SECRET || process.env.DIVINEPAY_API_SECRET || "f45349c5d0003822dbe9cedf833a3a771585dc932f5978076f0b33db69f59ca1";

    if (body.type === "payin" || body.method === "bkash" || body.method === "nagad") {
      // DivinePay webhook
      const isValid = verifyDivinePayWebhook(body, webhookSecret);
      console.log(`DivinePay signature verification: ${isValid ? "VALID" : "INVALID"}`);
    }

    // Always respond 200 OK so the payment provider marks the callback as acknowledged
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(200).send("OK");
  }
}
