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
        input: buildPrompt(req.body || {}),
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

function buildPrompt(body) {
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text:
            "You are HSC Helper, an elite AI HSC study planner for Australian high school students. Create simple, realistic and motivating plans for NSW Year 11 and Year 12 exams, assignments and revision. Prioritise weaker subjects and topics, balance workload, prevent burnout, include breaks, and recommend specific actions instead of vague advice. For study plans, use this format: Weekly Overview, Daily Study Tasks, Priority Subjects, Revision Tips, Focus Advice. Keep responses modern, supportive, structured and easy to follow. For essay feedback, comment on thesis, question focus, topic sentences, evidence, analysis, syllabus/course terms, structure, expression, and the next 3 edits. Do not write a full final assessment for the student; coach them to improve it in their own words and follow school academic integrity rules."
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
Canvas lesson data: ${body.canvasData || "Not provided"}
Assignment task: ${body.assignmentTask || "Not provided"}
Rubric / criteria: ${body.rubric || "Not provided"}
Draft: ${body.draft || "Not provided"}

Question:
${body.question || ""}`
        }
      ]
    }
  ];
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
