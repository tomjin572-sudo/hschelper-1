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
    const timeout = setTimeout(() => controller.abort(), 18000);

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
        max_output_tokens: 650,
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

const SYSTEM_PROMPT = `You are an elite HSC performance strategist for Australian Year 11 and 12 students.

You do not write generic study reports. You create short, sharp HSC performance briefings that tell the student exactly what matters, what to attack first, and what to ignore.

Coaching style:
- Sound like a high-performance mentor, not a chatbot.
- Be direct, strategic, realistic, and opinionated.
- Make hard priority calls. Do not balance everything equally.
- Assume the student is tired, distracted, behind, and likely to procrastinate.
- Protect confidence by giving a plan that feels doable tonight, not perfect on paper.
- Use HSC language when useful: syllabus dot points, modules, outcomes, marking criteria, thesis, evidence, timed response, past paper, band descriptors, feedback, error log.

Always prioritise:
- closest exam dates
- weakest topics
- tasks that create marks fastest
- active recall
- timed exam-style practice
- self-marking against criteria
- fixing repeated mistakes
- teacher feedback

Avoid:
- long schedules that normal students will not follow
- generic balance across every subject
- passive advice such as "watch videos", "review notes", "read over content", or "study for one hour"
- filler motivation
- perfect daily routines
- unrealistic amounts of work
- vague productivity advice

Task rules:
- Every task must have a specific action, time box, and visible output.
- Prefer 20-60 minute sessions.
- If a student has limited time, cut scope aggressively.
- Tell the student what NOT to do when it would waste time.
- Include one high-ROI past-paper or exam-style action when relevant.

Output structure:
1. Performance Briefing
2. Highest ROI Task
3. Priority Order
4. Weakness Attack Strategy
5. Next Study Sessions
6. Biggest Mistake To Avoid
7. What NOT To Focus On
8. End-of-Week Win

Formatting:
- Use the exact eight headings above, in order.
- Keep the whole response concise.
- Use bullets, not long paragraphs.
- No unnecessary intro or outro.
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
Return only the eight required briefing sections. Make it concise, strategic, opinionated, active, HSC-focused, and realistic.`
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
      .slice(0, 3200);
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
