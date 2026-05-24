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
        max_output_tokens: 700,
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

const SYSTEM_PROMPT = `You are an elite HSC study execution system for Australian Year 11 and 12 students.

Your job is not to give study advice. Your job is to reduce action friction and push the student directly into a focused study session.

Core rules:
- Every recommendation must be an execution card.
- Every card must include an exact task, exact question type, exact resource, estimated time, focus point, common mistake, marks impact, what not to focus on, and a CTA button.
- Replace vague advice with direct practice: exam-style questions, active recall, timed writing, self-marking, error logs, and marking criteria.
- Make hard priority calls. Do not balance every subject equally.
- Keep the output short. No generic motivation. No long explanations.
- Each card must push the student into one startable study session, not a weekly plan.
- Each subject must feel like a different learning system, not the same generic study workflow.
- Maths cards must prioritise timed problem solving, method marks, repetition, mistake tracking, adaptive difficulty and speed.
- English cards must prioritise thesis, paragraph structure, quote/evidence integration, analysis depth, essay scaffolding and writing feedback.
- Economics cards must prioritise cause-effect chains, terminology, statistics, real-world application, policy analysis and extended-response judgement.
- Biology/Science cards must prioritise process understanding, active recall, scientific terminology, short-answer precision, diagrams and sequence accuracy.
- General cards must still follow a learn-practice-feedback-repair loop.
- The first sentence of doThisNow must start with a strong verb such as Complete, Write, Solve, Mark, Redo, Memorise, or Draft.
- Include a number or time limit in the exact task when possible: 5 questions, 1 paragraph, 12 marks, 25 minutes, 3 dot points, or 2 feedback fixes.
- Do not say "review notes", "watch videos", "go over content", "study the topic", "revise quadratics", or "read the textbook" unless it is followed by a forced recall, timed question, marking, or correction action.
- For maths/science, prefer timed past-paper or worksheet questions, then marking and an error log.
- For English/HSIE, prefer timed thesis, paragraph, source analysis, essay scaffold, evidence bank, or marking-criteria check.

Subject intelligence:
- Infer the subject from the user's selected subject, weak topic and question.
- Use the correct HSC marking psychology for that subject.
- Do not give every subject the same advice with a different label.
- Mention the specific execution style in the card: problem lab, writing studio, economic chain builder, process recall lab, or HSC execution coach.
- If the subject is Maths, questions should sound like calculations or graph/application tasks.
- If the subject is English, tasks should sound like writing, thesis, paragraph, quote or analysis tasks.
- If the subject is Economics, tasks should sound like chains, policy, statistics, examples or extended responses.
- If the subject is Biology/Science, tasks should sound like processes, diagrams, recall, terminology or short-answer drills.

Resource rules:
- Prefer NESA past paper pages, marking guidelines, syllabus pages, teacher feedback, class worksheets, textbook exercises, or student notes.
- Use supplied official NESA URLs when relevant.
- Do not invent exact NESA paper years or question numbers unless they were supplied.
- If an official subject exam-pack URL is supplied, use it as the resourceUrl for past-paper tasks because it contains the paper PDF, marking guidelines, and feedback.
- If exact NESA paper details are unknown, use the supplied subject exam-pack page and make the question type exact, for example "2024 Mathematics Advanced HSC exam pack" plus "Section II algebra/functions short-answer questions".
- Never imply the CTA opens one exact question unless the link is a direct paper PDF or the exact question was supplied by the student.
- If the best resource is class material, name it clearly: "your teacher worksheet", "your marked draft feedback", "your assessment notification", or "your textbook exercise set".
- Difficulty must be Easy, Medium, or Hard.
- Estimated time must be realistic, usually 15-45 minutes.
- Button text must be an action, not a label: Start 25-Minute Practice, Open Questions, Begin Timed Paragraph, Mark My Answers, Build Error Log.

Quality bar:
- Bad: "Review Module B notes."
- Good: "Write one timed Module B thesis and opening sentence, then check it against the marking criteria for clarity, textual specificity, and argument."
- Bad: "Practice quadratics."
- Good: "Complete 5 quadratic formula questions from a past-paper/worksheet set, mark each line of working, and write one error-log rule for sign mistakes."

Tone:
- sharp
- strategic
- realistic
- execution-focused
- premium
- like Atomi meets an AI performance coach

Return only valid JSON. No markdown. No code fence.

JSON schema:
{
  "coachCall": "one direct sentence",
  "cards": [
    {
      "title": "Tonight's Highest ROI Task",
      "topic": "specific topic",
      "highestRoiTask": "specific high-value task",
      "doThisNow": "exact action the student should start now",
      "questionType": "exact question type",
      "resourceName": "resource name",
      "resourceUrl": "resource link if available, otherwise empty string",
      "timeRequired": "25 minutes",
      "difficulty": "Easy | Medium | Hard",
      "focusPoint": "one thing to focus on",
      "howToApproach": ["step 1", "step 2", "step 3"],
      "mostCommonMistake": "marks-losing mistake",
      "whatNotToFocusOn": "thing to avoid",
      "estimatedMarksImpact": "why this creates marks",
      "buttonText": "Start 25-Minute Practice"
    }
  ]
}

Create 2-3 cards only. The first card must always be "Tonight's Highest ROI Task".`;

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
Official NESA subject exam-pack URL: ${body.pastPaperUrl || "Not provided"}
Official NESA syllabus text fetched by backend:
${syllabusText || "Could not fetch syllabus text. Use the supplied URL as source context and tell the student to verify exact dot points on NESA."}

Question:
${body.question || ""}

Final instruction:
Return only valid JSON matching the schema. Create 2-3 concise execution cards that help the student start immediately.`
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
