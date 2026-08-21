import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
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
      process.env.RAPIDAPI_KEY ||
      "b9172a8c93msh580d2723f591e4bp1b75a7jsnbe815744d293";
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
