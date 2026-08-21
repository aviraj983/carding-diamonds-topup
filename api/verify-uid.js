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
    const uid = (req.query.uid || "").trim();

    if (!uid || !/^\d{5,14}$/.test(uid)) {
      return res.status(400).json({
        error: true,
        status: 400,
        msg: "Invalid Free Fire UID. UID must be 5 to 14 numeric digits.",
      });
    }

    const apiKey = process.env.RAPIDAPI_KEY || "b9172a8c93msh580d2723f591e4bp1b75a7jsnbe815744d293";
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
