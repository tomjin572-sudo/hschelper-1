module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST for chat requests." });
  const body = req.body || {};
  if (isEssayRequest(body)) return res.status(200).json({ answer: JSON.stringify(buildEssayPlan(body)) });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(501).json({ error: "OPENAI_API_KEY is not set. Add it in Vercel project settings, then redeploy." });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", input: buildPrompt(body), max_output_tokens: 1900, temperature: 0.45 })
    });
    clearTimeout(timeout);
    if (!apiResponse.ok) return res.status(apiResponse.status).json({ error: cleanApiError(await apiResponse.text()) });
    const data = await apiResponse.json();
    return res.status(200).json({ answer: extractOpenAiText(data) || "I could not generate a response." });
  } catch (error) {
    if (error.name === "AbortError") return res.status(504).json({ error: "The study plan took too long to generate. Try again with fewer subjects or weaker topics." });
    return res.status(500).json({ error: error.message || "Chat request failed." });
  }
};

function isEssayRequest(body) {
  const text = `${body.subject || ""} ${body.question || ""}`.toLowerCase();
  return /essay|extended response|paragraph|thesis|judgement|judgment|introduction|body paragraph|conclusion/.test(text);
}

function buildEssayPlan(body) {
  const subject = String(body.subject || "");
  const question = String(body.question || "");
  const topic = inferTopic(question, subject);
  const economics = /economics|labou?r|unemployment|inflation|market|wage|aggregate|monetary|fiscal/i.test(`${subject} ${topic}`);
  const minutes = parseMinutes(question) || 60;
  const timeRequired = `${Math.max(6, Math.round(minutes / 4))} minutes`;
  return {
    coachCall: "Here are the four essay cards: MCQ learning, short answer, paragraph practice, then conclusion judgement.",
    cards: economics ? economicsCards(topic, timeRequired) : generalEssayCards(topic, timeRequired)
  };
}

function inferTopic(question, subject) {
  const weak = question.match(/weak topic\s*:\s*([^.;\n]+)/i);
  if (weak) return weak[1].trim();
  const topic = question.match(/topic\s*:\s*([^.;\n]+)/i);
  if (topic) return topic[1].trim();
  if (/labou?r market/i.test(question)) return "labour market";
  return subject || "essay response";
}

function parseMinutes(text) {
  const source = String(text || "").toLowerCase();
  const hours = [...source.matchAll(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/g)].reduce((sum, match) => sum + Number(match[1]) * 60, 0);
  const mins = [...source.matchAll(/(\d+)\s*(m|min|mins|minute|minutes)\b/g)].reduce((sum, match) => sum + Number(match[1]), 0);
  return Math.round(hours + mins);
}

function economicsCards(topic, timeRequired) {
  return [
    card({ title: "Multiple Choice Learning Check", topic, questionType: "Multiple Choice Learning Check", timeRequired, difficulty: "Easy", highestRoiTask: "Learn the essay structure by choosing the strongest economics moves.", doThisNow: "Answer 4 MCQs: directive term, labour demand definition, strongest cause-effect chain, and best final judgement.", focusPoint: "Choose economic reasoning, not vague opinion.", mistake: "Picking the broad answer that sounds smart but has no mechanism.", impact: "Builds the decision-making needed before writing.", ignore: "Do not write the essay yet.", buttonText: "Start MCQ Check", steps: ["Read the command term.", "Choose the most economic answer.", "Explain why one trap option is weak."], questions: [mcq("Assess command: Which answer best explains what 'assess' requires in an Economics essay?", ["Define the topic only", "Make a judgement using evidence and reasoning", "List every syllabus point", "Write a balanced summary with no position"], "B", "Assess requires a judgement, not just description."), mcq("Define term: Which is the best definition of labour demand?", ["The number of people looking for jobs", "The amount of labour firms are willing and able to hire at different wage rates", "The total population aged over 15", "The amount workers want to earn"], "B", "Labour demand comes from firms hiring workers."), mcq("Explain chain: Which chain best explains derived demand for labour?", ["Higher wages -> more workers -> higher prices", "Higher goods demand -> more output needed -> firms hire more labour", "More unemployment -> more jobs are created", "Lower participation -> higher productivity"], "B", "Labour demand is derived from demand for goods and services."), mcq("Judge impact: Which final judgement is strongest?", ["Labour markets are important", "Unemployment is bad for everyone", "The impact depends on duration, scale and policy response", "The government should always intervene"], "C", "It weighs conditions and gives a judgement.")] }),
    card({ title: "Short Answer Learning Drill", topic, questionType: "Short Answer Learning Drill", timeRequired, difficulty: "Easy", highestRoiTask: "Build definitions and thesis before paragraph writing.", doThisNow: "Write two definitions, then one thesis: labour market + labour demand + your judgement on the essay question.", focusPoint: "Definitions plus judgement sentence.", mistake: "Starting with opinion before economic terms.", impact: "Definitions and thesis make the whole essay sound economic.", ignore: "Do not search for statistics first.", buttonText: "Start Short Answer Drill", steps: ["Define labour market.", "Define labour demand.", "Write one judgement sentence."], questions: [written("Define the labour market and explain why labour demand is a derived demand.", "3 marks", "Labour market = workers supply labour and firms demand labour; derived demand comes from demand for goods/services."), written("Write one thesis sentence for a labour market essay about unemployment and economic performance.", "2 marks", "Make a position, not a topic statement.")] }),
    card({ title: "SA Paragraph Practice", topic, questionType: "SA Paragraph Practice", timeRequired, difficulty: "Medium", highestRoiTask: "Write one paragraph using the exact Economics formula.", doThisNow: "Write one paragraph: Point -> definition -> cause-effect chain -> example/data placeholder -> judgement.", focusPoint: "Cause-effect chain inside a paragraph.", mistake: "Skipping the mechanism between cause and impact.", impact: "This is where most essay marks are earned.", ignore: "Do not write the full essay.", buttonText: "Write Paragraph", steps: ["Start with a point.", "Define the key term.", "Explain the chain.", "End with a judgement."], questions: [written("Write one body paragraph explaining how rising unemployment can affect households and the Australian economy.", "6 marks", "Use: point, definition, chain, example/data placeholder, judgement.")] }),
    card({ title: "Conclusion / Final Judgement", topic, questionType: "Conclusion / Final Judgement", timeRequired, difficulty: "Medium", highestRoiTask: "Finish the essay with a judgement, not a summary.", doThisNow: "Write a 4-sentence conclusion: restate judgement, weigh strongest factor, mention trade-off, answer the directive.", focusPoint: "Final judgement and weighing language.", mistake: "Repeating the introduction without making a judgement.", impact: "A clear judgement helps push an extended response upward.", ignore: "Do not introduce a new policy or diagram.", buttonText: "Write Conclusion", steps: ["Restate your position.", "Weigh the strongest factor.", "Mention a trade-off.", "Do not add new content."], questions: [written("Write a conclusion for a labour market essay assessing the impact of unemployment on households and the economy.", "4 marks", "Restate judgement, weigh severity, mention conditions, no new evidence.")] })
  ];
}

function generalEssayCards(topic, timeRequired) {
  return [
    card({ title: "Multiple Choice Learning Check", topic, questionType: "Multiple Choice Learning Check", timeRequired, difficulty: "Easy", highestRoiTask: "Learn the essay structure before writing.", doThisNow: "Answer 4 MCQs: directive term, best thesis, paragraph order, and best linking sentence.", focusPoint: "Choose the answer that directly answers the question.", mistake: "Choosing broad wording instead of a clear argument.", impact: "Prevents off-question writing.", ignore: "Do not write the full essay yet.", buttonText: "Start MCQ Check", steps: ["Read the directive.", "Choose the strongest answer.", "Name the trap."], questions: [mcq("Thesis check: Which thesis is strongest?", ["The topic is important", "This essay will discuss the topic", "The composer/evidence shows the idea through specific choices", "There are many examples"], "C", "A thesis needs an argument and direction."), mcq("Topic sentence: What should a topic sentence do?", ["Retell the plot", "Answer the question with one argument", "Introduce a quote only", "Summarise the conclusion"], "B", "A topic sentence makes a point."), mcq("Paragraph order: Which paragraph order is strongest?", ["Quote -> plot -> point -> link", "Point -> evidence -> technique/example -> effect/explanation -> link", "Conclusion -> quote -> point", "Definition only"], "B", "This order builds analysis."), mcq("Judge impact: What should a conclusion avoid?", ["Final judgement", "Answering the question", "New evidence", "Weighing the strongest point"], "C", "No new evidence in the conclusion.")] }),
    card({ title: "Short Answer Learning Drill", topic, questionType: "Short Answer Learning Drill", timeRequired, difficulty: "Easy", highestRoiTask: "Build thesis and topic sentences.", doThisNow: "Write one thesis and two topic sentences that directly answer the question.", focusPoint: "Point-making.", mistake: "Writing a topic instead of an argument.", impact: "Creates the essay skeleton.", ignore: "Do not polish wording yet.", buttonText: "Start Short Answer Drill", steps: ["Unpack the question.", "Write a thesis.", "Write two topic sentences."], questions: [written(`Write one thesis and two topic sentences for a ${topic} essay.`, "4 marks", "Point = answer + idea + position.")] }),
    card({ title: "SA Paragraph Practice", topic, questionType: "SA Paragraph Practice", timeRequired, difficulty: "Medium", highestRoiTask: "Write one structured paragraph.", doThisNow: "Write one paragraph using Point -> Evidence/example -> Technique/detail -> Effect/explanation -> Link.", focusPoint: "Paragraph execution.", mistake: "Evidence with no explanation.", impact: "This turns planning into marks.", ignore: "Do not write the full essay.", buttonText: "Write Paragraph", steps: ["Point.", "Evidence/example.", "Explain effect.", "Link."], questions: [written(`Write one body paragraph for a ${topic} essay.`, "6 marks", "Use point, evidence/example, explanation and link.")] }),
    card({ title: "Conclusion / Final Judgement", topic, questionType: "Conclusion / Final Judgement", timeRequired, difficulty: "Medium", highestRoiTask: "Write the final judgement.", doThisNow: "Write a 4-sentence conclusion: restate judgement, weigh strongest point, answer directive, no new evidence.", focusPoint: "Conclusion control.", mistake: "Adding new evidence at the end.", impact: "Makes the response feel complete.", ignore: "Do not start a new paragraph idea.", buttonText: "Write Conclusion", steps: ["Restate judgement.", "Weigh strongest point.", "Answer question.", "No new content."], questions: [written(`Write a conclusion for a ${topic} essay.`, "4 marks", "Restate, weigh, answer, no new evidence.")] })
  ];
}

function card(input) {
  return { title: input.title, topic: input.topic, highestRoiTask: input.highestRoiTask, doThisNow: input.doThisNow, questionType: input.questionType, resourceName: "Internal HSC-style essay practice", resourceUrl: "", timeRequired: input.timeRequired, difficulty: input.difficulty, focusPoint: input.focusPoint, howToApproach: input.steps, mostCommonMistake: input.mistake, whatNotToFocusOn: input.ignore, estimatedMarksImpact: input.impact, buttonText: input.buttonText, miniLesson: input.highestRoiTask, workedExample: input.doThisNow, feedbackCriteria: ["answers the directive", "uses structure", "uses specific content", "links to the question"], fixDrill: "Rewrite the weakest sentence so it directly answers the question.", nextTargetedTask: "Submit the answer for feedback, then fix one sentence.", essayPlan: { cardFormatSequence: ["Multiple Choice Learning Check", "Short Answer Learning Drill", "SA Paragraph Practice", "Conclusion / Final Judgement"] }, questions: input.questions };
}

function mcq(question, options, correct, reason) {
  return { question: `${question}\nA. ${options[0]}\nB. ${options[1]}\nC. ${options[2]}\nD. ${options[3]}`, markValue: "1 mark", difficulty: "Warm-up", estimatedTime: "2 min", focusPoint: "Choose the best exam move.", commonMistake: "Choosing the vague option.", marksImpact: "Quickly teaches the structure before writing.", whatToIgnore: "Ignore full essay writing for this card.", sampleAnswer: `${correct}: ${reason}`, guidedAnswerPath: guide("Pick the answer that would earn marks in an essay.", ["Read the directive.", "Eliminate vague options.", "Choose the option with reasoning.", "Explain the trap."]) };
}

function written(question, markValue, scaffold) {
  return { question, markValue, difficulty: "Core", estimatedTime: "5 min", focusPoint: "Write the exact response, not notes.", commonMistake: "Being too general.", marksImpact: "Builds the part of the essay that wins marks.", whatToIgnore: "Ignore polished wording until the idea is clear.", sampleAnswer: scaffold, guidedAnswerPath: guide("Produce the exact writing move needed for the essay.", ["State the point.", "Add evidence/example.", "Explain the effect.", "Link to the question."]) };
}

function guide(wants, steps) {
  return { keyDefinitionsYouNeed: ["Point: answer + idea + position.", "Link: sentence returning to the question."], whatThisQuestionIsReallyAsking: wants, firstSentenceYouCanUse: "This matters because ...", stepByStepAnswerPath: steps, whatToIncludeForFullMarks: ["Clear point", "Specific content", "Explanation", "Question link"], commonMistake: "Writing a broad statement with no link to the question." };
}

function buildPrompt(body) {
  return [
    { role: "system", content: [{ type: "input_text", text: "You are HSC Helper. Return valid JSON with 2-4 concise timed StudySprint execution cards. Every card must be specific, practice-based, marks-focused, and include questions when possible. No generic advice." }] },
    { role: "user", content: [{ type: "input_text", text: `Year: ${body.year || "Year 12"}\nSubject: ${body.subject || "NSW Stage 6"}\nQuestion: ${body.question || ""}\nReturn only valid JSON.` }] }
  ];
}

function cleanApiError(errorText) { try { return JSON.parse(errorText).error?.message || errorText; } catch { return errorText || "OpenAI API request failed."; } }

function extractOpenAiText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  if (Array.isArray(data.output)) return data.output.flatMap((item) => item.content || []).map((content) => content.text || content.output_text || "").filter(Boolean).join("\n").trim();
  if (Array.isArray(data.choices)) return data.choices.map((choice) => choice.message?.content || choice.text || "").filter(Boolean).join("\n").trim();
  return "";
}
