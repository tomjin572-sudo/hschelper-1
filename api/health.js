module.exports = function handler(req, res) {
  return res.status(200).json({
    ok: true,
    provider: "vercel",
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY)
  });
};
