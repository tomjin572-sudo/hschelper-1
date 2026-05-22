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
    const timeout = setTimeout(() => controller.abort(), 24000);

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
        max_output_tokens: 550,
        temperature: 0.45
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
        error: "The study plan took too long to generate. Try again with fewer subjects or weaker topics."
      });
    }

    return res.status(500).json({
      error: error.message || "Chat request failed."
    });
  }
};

const SYSTEM_PROMPT = `You are an elite HSC execution coach for Australian Year 11 and 12 students.

You are not a study advice chatbot. You are a performance system that turns weak topics, exam dates, and study time into immediate practice actions.

Core rule:
Every recommendation must include a real action layer. No vague advice. No passive revision. No long explanations.

Tone:
- direct
- strategic
- short
- coach-like
- realistic for tired high school students
- opinionated about what creates marks fastest

Always prioritise:
- closest exam date
- weakest topic
- highest exam probability
- easiest marks to recover
- active recall
- timed exam-style practice
- marking criteria
- error correction

Avoid:
- "review notes"
- "watch videos"
- "study topic"
- perfect schedules
- unrealistic workloads
- generic motivational talk
- balancing every subject equally

Output format:
Start with one short line called Coach Call.
Then create 2-4 action cards. The first card must be called Tonight's Highest ROI Task.

Each action card must use this exact format:

### Card Title
Topic: ...
Highest ROI Task: ...
Exact Practice Action: ...
Resource: source name | link if available | question type | difficulty | estimated time
How To Approach This:
1. ...
2. ...
3. ...
Most Common Mistake: ...
Estimated ROI: ...
Button: ...

Resource rules:
- Prefer official NESA past papers, marking guidelines, syllabus pages, teacher feedback, class worksheet, textbook exercise, or student notes.
- If no exact link is available, say "Use your class worksheet or NESA past paper page" and include the NESA source URL when supplied.
- Difficulty must be Easy, Medium, or Hard.
- Estimated time must be realistic, usually 15-45 minutes.

Quality rules:
- The Exact Practice Action must be something the student can start immediately.
- The Button must be a short CTA such as "Start 25-Minute Practice", "Open Past Paper", "Try 5 Questions", or "Review Marking Criteria".
- Keep the whole response compact.
- If syllabus context is supplied, use it for direction without inventing exact outcome codes.`;

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
${body.question || ""}

Final instruction:
Return only the Coach Call plus 2-4 execution action cards. Make every card specific, practical, HSC-focused, and ready to start immediately.`
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "HSC Helper study planner"
      }
    });
    clearTimeout(timeout);
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
      .slice(0, 1800);
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
