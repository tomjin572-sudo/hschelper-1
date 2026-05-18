exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Use POST for chat requests." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse(501, {
      error: "OPENAI_API_KEY is not set. Add it in Netlify site settings, then redeploy."
    });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
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
        input: buildPrompt(body),
        max_output_tokens: 900
      })
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      return jsonResponse(apiResponse.status, {
        error: cleanApiError(await apiResponse.text())
      });
    }

    const data = await apiResponse.json();
    return jsonResponse(200, {
      answer: data.output_text || "I could not generate a response."
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return jsonResponse(504, {
        error: "The OpenAI request timed out. Try again, or set OPENAI_MODEL to a faster model."
      });
    }

    return jsonResponse(500, {
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
            "You are HSC Helper, a clear NSW Year 11 and Year 12 study assistant for students in NSW, Australia. Help with assignments, HSC-style responses, NESA Stage 6 syllabus language, rubrics, draft feedback, study planning, and past-paper practice. Be practical, structured, age-appropriate, and concise. Do not claim exact syllabus outcome codes unless the user provides them. Encourage students to use their own words, cite sources, and follow school academic integrity rules."
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

function jsonResponse(status, data) {
  return {
    statusCode: status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  };
}

function cleanApiError(errorText) {
  try {
    const parsed = JSON.parse(errorText);
    return parsed.error?.message || errorText;
  } catch {
    return errorText || "OpenAI API request failed.";
  }
}
