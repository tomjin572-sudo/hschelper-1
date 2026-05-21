module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for chat requests." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(501).json({
      error: "OPENAI_API_KEY is not set. Add it in Vercel project settings, then redeploy."
    });
  }

  try {
    const body = req.body || {};
    const prompt = await buildPrompt(body);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        input: prompt,
        max_output_tokens: 900
      })
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: cleanApiError(await apiResponse.text())
      });
    }

    const data = await apiResponse.json();
    return res.status(200).json({
      answer: extractOpenAiText(data) || "I could not generate a response."
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "The OpenAI request timed out. Try again, or set OPENAI_MODEL to a faster model."
      });
    }

    return res.status(500).json({
      error: error.message || "Chat request failed."
    });
  }
};

const SYSTEM_PROMPT = `You are an elite HSC performance coach for Australian high school students.

You do NOT generate generic study plans.

You create highly realistic, psychologically effective, and personalized HSC study systems designed to:
- improve consistency
- reduce procrastination
- prioritize weak areas
- balance workload
- prevent burnout
- maximize exam performance

Your study plans should feel like they were created by a top HSC mentor, not a generic AI assistant.

Always:
- prioritize the student's weakest areas
- create realistic workloads
- break tasks into specific actionable sessions
- give productivity advice
- adapt to stress and motivation levels
- focus on high-impact study

Avoid:
- generic advice
- vague tasks
- unrealistic schedules
- robotic wording

Output structure:
1. This Week's Main Focus
2. Highest Priority Subject
3. Daily Study Sessions
4. Weak Area Attack Plan
5. Burnout Prevention
6. Productivity Strategy
7. End-of-Week Goal

The tone should feel:
- intelligent
- motivating
- structured
- realistic
- premium`;

async function buildPrompt(body) {
  const syllabusText = await fetchSyllabusText(body.syllabusUrl);

  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: SYSTEM_PROMPT
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Context:
Year: ${body.year || "Year 12"}
Subject: ${body.subject || "NSW Stage 6"}
Official NESA syllabus URL: ${body.syllabusUrl || "Not provided"}
Official NESA syllabus text fetched by backend:
${syllabusText || "Could not fetch syllabus text. Use the supplied URL as source context and tell the student to verify exact dot points on NESA."}

Question:
${body.question || ""}`
        }
      ]
    }
  ];
}

async function fetchSyllabusText(url) {
  if (!url || !/^https:\/\/(www\.)?nsw\.gov\.au\//.test(url)) {
    return "";
  }

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "HSC Helper study planner"
      }
    });
    if (!response.ok) return "";

    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 7000);
  } catch {
    return "";
  }
}

function cleanApiError(errorText) {
  try {
    const parsed = JSON.parse(errorText);
    return parsed.error?.message || errorText;
  } catch {
    return errorText || "OpenAI API request failed.";
  }
}

function extractOpenAiText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (Array.isArray(data.output)) {
    return data.output
      .flatMap((item) => item.content || [])
      .map((content) => content.text || content.output_text || "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (Array.isArray(data.choices)) {
    return data.choices
      .map((choice) => choice.message?.content || choice.text || "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
}
