exports.handler = async function handler() {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return jsonResponse(200, {
      ok: false,
      keyLoaded: false,
      model,
      message: "Netlify cannot see OPENAI_API_KEY yet. Add it, then redeploy."
    });
  }

  return jsonResponse(200, {
    ok: true,
    keyLoaded: true,
    keyLooksLikeOpenAI: apiKey.startsWith("sk-"),
    keyLength: apiKey.length,
    model,
    message:
      "Netlify can see OPENAI_API_KEY. If chat still fails, check that the key is a real OpenAI Platform API key with billing/credits."
  });
};

function jsonResponse(status, data) {
  return {
    statusCode: status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  };
}
