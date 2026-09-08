import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: true, msg: "Method not allowed" }),
    };
  }

  try {
    const uid = (event.queryStringParameters?.uid || "").trim();

    if (!uid || !/^\d{5,14}$/.test(uid)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: true,
          status: 400,
          msg: "Invalid Free Fire UID. UID must be 5 to 14 numeric digits.",
        }),
      };
    }

    const apiKey =
      process.env.NEFERBYTE_API_KEY ||
      "7e7fd9cae78a542bf3ba679f94a5afa2";
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

    if (
      !response.ok ||
      !data ||
      data.error === true ||
      !data.data?.username
    ) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          error: true,
          status: 404,
          msg: "Player UID not found",
          data: null,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("Error verifying Free Fire UID:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        error: true,
        status: 500,
        msg: err?.message || "Internal server error connecting to game checker",
      }),
    };
  }
};

export { handler };
