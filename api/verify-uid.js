// Free Fire UID Verification API using Neferbyte Game ID Checker

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: true, msg: "Method not allowed" });
  }

  try {
    // Safely extract uid from req.query or req.url
    let uid = "";
    if (req.query && req.query.uid) {
      uid = String(req.query.uid).trim();
    } else if (req.url) {
      try {
        const parsedUrl = new URL(req.url, "http://localhost");
        uid = (parsedUrl.searchParams.get("uid") || "").trim();
      } catch (e) {}
    }

    if (!uid || !/^\d{5,14}$/.test(uid)) {
      return res.status(400).json({
        error: true,
        status: 400,
        msg: "Invalid Free Fire UID. UID must be 5 to 14 numeric digits.",
      });
    }

    const apiKey = process.env.NEFERBYTE_API_KEY || "7e7fd9cae78a542bf3ba679f94a5afa2";
    const targetUrl = `https://api.neferbyte.com/game-id-checker/ff-global/${encodeURIComponent(uid)}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error verifying Free Fire UID:", err);
    return res.status(200).json({
      error: true,
      status: 500,
      msg: err?.message || "Internal server error connecting to game checker",
    });
  }
}
