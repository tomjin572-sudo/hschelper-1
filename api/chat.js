module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST for chat requests." });
  const body = req.body || {};
  if (isFeedbackRequest(body)) return res.status(200).json({ answer: buildAnswerFeedback(body) });
  return res.status(200).json({ answer: JSON.stringify(buildSprint(body)) });
};

function isFeedbackRequest(body) {
  return /Mark this HSC-style (sentence practice|practice) answer/i.test(String(body.question || ""));
}

function buildAnswerFeedback(body) {
  const prompt = String(body.question || "");
  const subject = String(body.subject || "");
  const question = field(prompt, "Question") || "the practice question";
  const focus = field(prompt, "Focus point") || "the key marking point";
  const mistake = field(prompt, "Common mistake to check") || "missing the mark-winning link";
  const answer = field(prompt, "Student answer") || "";
  const text = `${subject} ${question} ${focus} ${mistake}`.toLowerCase();
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const isEconomics = /economics|labou?r|unemployment|wage|employment|market|aggregate|inflation|policy/.test(text);
  const isEssay = /essay|thesis|paragraph|judgement|assess|discuss|evaluate|extended/.test(text);
  if (!answer.trim() || /no answer written/i.test(answer) || words < 8) {
    return [
      "Coach read: There is not enough written evidence to coach yet.",
      "Mark protected: None yet. The answer needs one complete exam sentence first.",
      `Mark missing: The marker cannot see ${focus.toLowerCase()} because the sentence is not complete.`,
      `Stronger version: ${strongerSentence({ isEconomics, isEssay, focus, question })}`,
      "Band 6 upgrade: Add the cause-effect link, not just the topic word.",
      "Plain English: Write one sentence that says what changes and why it changes.",
      "Rewrite now: Write one complete sentence, then ask for feedback again."
    ].join("\n");
  }
  if (isEconomics) {
    const lower = answer.toLowerCase();
    const hasDefinition = /is|refers to|defined|willing|able|rate|wage|employment|unemployment/.test(lower);
    const hasChainTerm = /income|consumption|aggregate demand|economic growth|growth|demand curve|supply curve|equilibrium|productivity|household spending|welfare|living standards/.test(lower);
    const hasCausalLanguage = /because|therefore|leads to|causes|shift|pressure|reduces|lowers|increase|decrease|rise|fall|slowing|weakening/.test(lower);
    const hasMechanism = hasChainTerm && hasCausalLanguage;
    const hasJudgement = /however|depends|extent|therefore|overall|significant|limited|short run|long run/.test(lower);
    const hasExample = /for example|data|statistic|australia|rba|budget|cyclical|structural|participation|underemployment|fiscal|policy/.test(lower);
    const vagueWord = answer.match(/\b(bad|good|things|stuff|people|money|jobs)\b/i)?.[0] || "";
    const missing = !hasDefinition
      ? "The sentence needs a clearer Economics term before the explanation."
      : !hasMechanism
        ? `The sentence names an outcome but does not show the economic mechanism${vagueWord ? `; \"${vagueWord}\" is too vague for Economics marks` : ""}.`
        : !hasJudgement && isEssay
          ? "The sentence explains the idea but does not make a judgement yet."
          : !hasExample
            ? "The chain is strong, but it needs one example, data point or policy context to feel exam-ready."
            : "This is already a strong sentence; the next gain is precision and a tighter link to the question.";
    return [
      `Coach read: ${!hasDefinition ? "You are circling the idea, but the marker needs a precise Economics term first." : !hasMechanism ? "You have the topic, but not the mark-winning cause-effect chain yet." : isEssay && !hasJudgement ? "Your mechanism is working; now it needs a judgement to become essay-level." : !hasExample ? "This is a solid Economics sentence; it now needs exam specificity." : "This is close to exam-ready. The next improvement is sharper wording, not more length."}`,
      `Mark protected: ${!hasDefinition ? "You identified the general topic." : !hasMechanism ? "You used a relevant Economics term." : "You protected the core analysis marks with a clear mechanism."}`,
      `Mark missing: ${missing}`,
      `Stronger version: ${strongerSentence({ isEconomics, isEssay, focus, question, answer, hasMechanism, hasJudgement, hasExample })}`,
      `Band 6 upgrade: ${!hasMechanism ? "Replace vague wording with a visible income -> consumption -> aggregate demand chain." : isEssay && !hasJudgement ? "Turn the explanation into an argument by weighing significance." : !hasExample ? "Add specificity so the answer does not sound generic." : "Make the final link more deliberate."}`,
      `Plain English: ${!hasMechanism ? "Mechanism means the chain: unemployment rises -> income falls -> spending falls -> growth weakens." : isEssay && !hasJudgement ? "Judgement means saying how important the effect is and what it depends on." : !hasExample ? "Example/data means one real-world detail." : "Answer the exact directive word in the question."}`,
      `Rewrite now: ${!hasMechanism ? "Rewrite using: Rising unemployment reduces household income, which lowers consumption and aggregate demand." : isEssay && !hasJudgement ? "Add one judgement sentence beginning: This effect is significant because..." : !hasExample ? "Add one example/data sentence beginning: For example, in Australia..." : "Write the next sentence that links this impact back to the directive word."}`
    ].join("\n");
  }
  return [
    "Coach read: You made a real attempt and gave the coach something to improve.",
    "Mark protected: You have started answering instead of just rereading notes.",
    `Mark missing: ${mistake}.`,
    `Stronger version: ${strongerSentence({ isEconomics, isEssay, focus, question })}`,
    `Band 6 upgrade: Prove ${focus.toLowerCase()} with a cause-effect link or evidence.`,
    "Plain English: The marker needs to see why your point is true.",
    "Rewrite now: Rewrite your weakest sentence using the stronger version as the pattern."
  ].join("\n");
}

function strongerSentence({ isEconomics, isEssay, focus, question, answer, hasMechanism, hasJudgement, hasExample }) {
  const target = cleanSentence(focus || question || "the question");
  const economicsTarget = `${question || ""} ${focus || ""} ${answer || ""}`.toLowerCase();
  if (isEconomics && /unemployment|jobless|economic growth|aggregate demand|consumption/.test(economicsTarget)) {
    if (!hasMechanism) return "Rising unemployment reduces household income, which lowers consumption and aggregate demand, slowing economic growth.";
    if (!hasExample) return `${cleanSentence(answer)}. For example, higher cyclical unemployment can reduce household spending and place pressure on government welfare payments.`;
    return `${cleanSentence(answer)}. This earns marks because it links unemployment to income, spending, aggregate demand and growth.`;
  }
  if (isEconomics && isEssay) return "Labour market conditions can significantly affect economic performance because changes in unemployment, wages and productivity influence household income, consumption and aggregate demand.";
  if (isEconomics) return "An increase in labour demand shifts the demand curve right, placing upward pressure on equilibrium wages and increasing employment if labour supply is unchanged.";
  if (/business|operations|marketing|finance|human resources|recruitment/i.test(`${focus} ${question}`)) return "This strategy improves business performance because it changes a specific business action and links that action to cost, quality, revenue or efficiency.";
  return `This answer is stronger when it explains how ${target.toLowerCase()} directly causes the result in the question.`;
}

function buildSprint(body) {
  const subject = String(body.subject || "HSC subject");
  const request = String(body.question || "");
  const topic = inferTopic(request, subject);
  const minutes = parseMinutes(request) || 60;
  const timeRequired = `${Math.max(6, Math.round(minutes / 4))} minutes`;
  const template = selectTopicTemplate(subject, topic, request) || genericTemplate(subject, topic);
  return {
    coachCall: "Use the three-card sprint: check the concept, write the short answer, then apply it under exam pressure.",
    cards: topicTemplateCards(template, timeRequired)
  };
}

const TOPIC_TEMPLATES = {
  labourMarket: {
    title: "Economics - Labour Market",
    examPriority: "High: definitions, diagrams and wage/employment effects turn up often in short-answer style practice.",
    keyDefinitions: ["Labour demand: the amount of labour firms are willing and able to hire at different wage rates.", "Labour supply: the amount of labour workers are willing and able to offer at different wage rates.", "Equilibrium wage: the wage where labour demand equals labour supply."],
    coreLogic: "Change in output demand/productivity/costs -> labour demand or supply shifts -> wage and employment change -> economic impact.",
    markingCriteria: ["Correct labour-market term", "Correct demand/supply mechanism", "Wage or employment effect", "Clear final link"],
    commonMistakes: ["Calling labour demand workers looking for jobs.", "Moving the wrong curve.", "Stating wages change without explaining why."],
    miniMasterclass: "Start with the side of the market: firms demand labour, workers supply labour. Then explain the shift before the result.",
    nextSteps: "After this, do one timed past-paper style labour-market response.",
    cards: [
      templateMcq("Concept MCQ", "Which is the best definition of labour demand?", ["Workers looking for jobs", "The amount of labour firms are willing and able to hire at different wage rates", "The total labour force", "The wage workers want"], "B", "Labour demand comes from firms, not workers."),
      templateShort("Short Answer", "Explain how an increase in labour demand may affect wages and employment.", "Labour demand rises -> demand curve shifts right -> firms compete for workers -> equilibrium wage and employment may rise."),
      templateShort("Exam Application", "Assess one effect of a labour market change on wages, employment or economic performance in 4-6 sentences.", "Define the change, explain the demand/supply mechanism, add the wage/employment effect, then make one judgement.", "6 marks")
    ]
  },
  unemployment: {
    title: "Economics - Unemployment",
    examPriority: "High: unemployment links labour markets to economic growth, living standards, fiscal pressure and policy.",
    keyDefinitions: ["Unemployment: people willing and able to work, actively seeking work, but unable to find a job.", "Underemployment: people employed but wanting more hours or better use of their skills.", "Participation rate: the share of the working-age population in the labour force."],
    coreLogic: "Unemployment rises -> household income falls -> consumption falls -> aggregate demand weakens -> growth and living standards may fall.",
    markingCriteria: ["Accurate labour-force definition", "Cause or type classified", "Economic chain shown", "Impact linked to growth/living standards"],
    commonMistakes: ["Counting people outside the labour force as unemployed.", "Only saying unemployment is bad.", "Listing types without explaining the cause."],
    miniMasterclass: "Unemployment answers need an economic chain, not sympathy. Show income, consumption, AD, growth or budget effects.",
    nextSteps: "Next, practise one policy response or one unemployment-type classification.",
    cards: [
      templateMcq("Concept MCQ", "Which statement uses unemployment correctly?", ["Anyone without a job is unemployed", "An unemployed person is willing and able to work, actively looking, but cannot find work", "Retired people are unemployed", "Underemployment means no job"], "B", "The definition requires active job search and willingness/ability to work."),
      templateShort("Short Answer", "Explain one economic impact of rising unemployment on Australian households or the economy.", "Unemployment reduces household income, which can reduce consumption and aggregate demand, slowing economic growth."),
      templateShort("Exam Application", "Assess how rising unemployment may affect economic growth and government budget outcomes.", "Define unemployment, explain lower income and consumption, link to AD/growth, then add welfare spending or tax revenue pressure.", "6 marks")
    ]
  },
  recruitment: {
    title: "Business Studies - Recruitment",
    examPriority: "Medium-high: recruitment is a practical HR process that connects strategy, staffing and business performance.",
    keyDefinitions: ["Recruitment: the process of finding and attracting suitable applicants for a job vacancy.", "Internal recruitment: filling a vacancy from within the existing workforce.", "External recruitment: attracting applicants from outside the business."],
    coreLogic: "Business need -> job analysis -> recruitment method -> applicant pool -> selection quality -> performance effect.",
    markingCriteria: ["Correct HR term", "Specific recruitment method", "Performance impact", "Case/scenario link"],
    commonMistakes: ["Confusing recruitment with selection.", "Listing methods without business impact.", "Saying external is always better."],
    miniMasterclass: "Recruitment answers should move from HR action to business performance: who is hired, why that method, and what it changes.",
    nextSteps: "Next, practise selection or training using the same HR strategy -> performance chain.",
    cards: [
      templateMcq("Concept MCQ", "Which option best defines recruitment?", ["Choosing the final employee after interviews", "Finding and attracting suitable applicants for a vacancy", "Training workers after they are hired", "Paying employees fairly"], "B", "Recruitment is about attracting applicants before selection."),
      templateShort("Short Answer", "Explain one advantage and one disadvantage of internal recruitment.", "Internal recruitment can reduce cost and improve morale, but may limit new skills and ideas entering the business."),
      templateShort("Exam Application", "Recommend a recruitment method for a growing business that needs skilled employees quickly. Justify your answer.", "Define the method, explain why it fits the business need, link to skills/cost/time, then make a judgement.", "6 marks")
    ]
  }
};

function templateMcq(label, question, options, correct, reason) { return { label, type: "Multiple Choice", question, options, correct, reason }; }
function templateShort(label, question, sampleAnswer, markValue = "4 marks") { return { label, type: label === "Short Answer" ? "Short Response / Written Answer" : "Exam Application", question, sampleAnswer, markValue }; }
function selectTopicTemplate(subject, topic, request) {
  const text = `${subject} ${topic} ${request}`.toLowerCase();
  if (/business|human resources|hr/.test(text) && /recruitment/.test(text)) return TOPIC_TEMPLATES.recruitment;
  if (/economics/.test(text) && /unemployment/.test(text) && !/labou?r market/.test(text)) return TOPIC_TEMPLATES.unemployment;
  if (/economics|labou?r|wage|employment/.test(text) && /labou?r market|labou?r demand|wage|minimum wage|participation|underemployment/.test(text)) return TOPIC_TEMPLATES.labourMarket;
  return null;
}
function genericTemplate(subject, topic) {
  const label = topic || subject || "your weak topic";
  return {
    title: `${subject || "HSC"} - ${label}`,
    examPriority: "Medium: this turns the topic into one startable exam task.",
    keyDefinitions: [`${label}: the key idea you must define before answering.`],
    coreLogic: "Key idea -> method/content -> explanation -> final link.",
    markingCriteria: ["Correct term", "Clear method/content", "Specific example or working", "Link to the question"],
    commonMistakes: ["Writing notes instead of an answer.", "Being too general.", "Missing the final link."],
    miniMasterclass: "Answer first, then fix the weakest sentence or working line.",
    nextSteps: "Do one more timed question on the same topic.",
    cards: [
      templateMcq("Concept MCQ", "Which first move is strongest before writing?", ["Write everything remembered", "Identify the key term, method and command word", "Skip the question wording", "Write a conclusion first"], "B", "The first move is to understand exactly what the task wants."),
      templateShort("Short Answer", `Answer one exam-style short response on ${label}.`, "State the key idea, explain it, add a specific example or working step, then link back."),
      templateShort("Exam Application", `Complete one final exam-style answer on ${label}.`, "Use the correction from Card 2 and finish with a direct link to the question.", "5 marks")
    ]
  };
}
function topicTemplateCards(template, timeRequired) {
  return template.cards.map((item, index) => {
    const stage = index + 1;
    const isMcq = item.type === "Multiple Choice";
    const questions = isMcq ? [mcq(item.question, item.options, item.correct, item.reason)] : [short(item.question, item.markValue, item.sampleAnswer, template.keyDefinitions, template.markingCriteria)];
    return card(stage, item.label, item.type, template.title, timeRequired, stage === 1 ? `Answer one concept check on ${template.title}.` : item.question, stage === 1 ? template.keyDefinitions.join(" ") : template.coreLogic, template.commonMistakes[Math.min(index, template.commonMistakes.length - 1)], template.examPriority, "Skip passive note rewriting. Complete the card first.", stage === 1 ? "Start Concept MCQ" : stage === 2 ? "Start Short Answer" : "Start Exam Application", template.miniMasterclass, questions, stage === 3 ? template.nextSteps : "Move to the next card only after feedback and one fix.");
  });
}
function card(stage, label, type, topic, timeRequired, task, focus, mistake, impact, ignore, buttonText, miniLesson, questions, next) {
  return {
    title: `Card ${stage} - ${label}`,
    topic,
    highestRoiTask: task,
    doThisNow: task,
    questionType: type,
    resourceName: /economics/i.test(topic) ? "NESA Economics HSC exam packs + internal HSC-style practice" : /business/i.test(topic) ? "NESA Business Studies HSC exam packs + internal HSC-style practice" : "Internal HSC-style practice",
    resourceUrl: /economics/i.test(topic) ? "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/economics" : /business/i.test(topic) ? "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/business-studies" : "",
    timeRequired,
    difficulty: stage === 1 ? "Easy" : "Core",
    focusPoint: focus,
    howToApproach: stage === 1 ? ["Read the stem.", "Choose A, B, C or D.", "Check the explanation.", "Carry the takeaway into Card 2."] : ["Read the question.", "Use the guided path.", "Write inside the timer.", "Submit for feedback."],
    mostCommonMistake: mistake,
    whatNotToFocusOn: ignore,
    estimatedMarksImpact: impact,
    examRelevance: impact,
    buttonText,
    miniLesson,
    workedExample: miniLesson,
    feedbackCriteria: stage === 1 ? ["selected answer", "correct explanation", "trap avoided", "takeaway"] : ["what worked", "what lost marks", "one exact fix", "next best move"],
    fixDrill: "Rewrite the weakest sentence using the feedback.",
    nextTargetedTask: next,
    questions
  };
}
function mcq(question, options, correct, reason) {
  return {
    question: `Concept check: ${question}\nA. ${options[0]}\nB. ${options[1]}\nC. ${options[2]}\nD. ${options[3]}`,
    markValue: "1 mark",
    difficulty: "Warm-up",
    estimatedTime: "2 min",
    focusPoint: "Choose the strongest exam move.",
    commonMistake: "Choosing the vague option.",
    marksImpact: "Quickly checks understanding before writing.",
    whatToIgnore: "Do not type a paragraph for this stage.",
    sampleAnswer: `Correct answer: ${correct}. ${reason}`,
    guidedAnswerPath: path(["Correct option: only one answer earns the mark.", "Trap option: sounds broad but misses the method."], "Pick the option that would earn the mark.", "Select A, B, C or D.", ["Read the command.", "Eliminate vague options.", "Choose the precise option.", "Read the takeaway."], ["Correct option", "Reason understood", "Trap avoided"], "Do not choose the option that only sounds familiar.")
  };
}
function short(question, markValue, scaffold, terms, checklist) {
  return {
    question,
    markValue,
    difficulty: "Core",
    estimatedTime: "5 min",
    focusPoint: "Write the exact response, not notes.",
    commonMistake: "Being too general.",
    marksImpact: "Builds the written answer that wins marks.",
    whatToIgnore: "Ignore polished wording until the idea is clear.",
    sampleAnswer: scaffold,
    guidedAnswerPath: path(terms || ["Key term: define it in exam wording."], "Produce the exact written move needed for this question.", terms?.[0] || "Start with the key definition, method or claim.", String(scaffold || "State -> Explain -> Link").split(" -> ").slice(0, 4), checklist || ["Key term used", "Cause/method explained", "Effect shown", "Final link"], "Do not write a broad answer with no link to the question.")
  };
}
function path(keyDefinitionsYouNeed, whatThisQuestionIsReallyAsking, firstSentenceYouCanUse, stepByStepAnswerPath, whatToIncludeForFullMarks, commonMistake) { return { keyDefinitionsYouNeed, whatThisQuestionIsReallyAsking, firstSentenceYouCanUse, stepByStepAnswerPath, whatToIncludeForFullMarks, commonMistake }; }
function inferTopic(request, subject) {
  const weak = request.match(/weak topic\s*:\s*([^.;\n]+)/i);
  if (weak) return weak[1].trim();
  const topic = request.match(/topic\s*:\s*([^.;\n]+)/i);
  if (topic) return topic[1].trim();
  if (/labou?r market/i.test(request)) return "labour markets";
  if (/recruitment/i.test(request)) return "recruitment";
  if (/unemployment/i.test(request)) return "unemployment";
  return subject || "your weak topic";
}
function parseMinutes(text) {
  const source = String(text || "").toLowerCase();
  const hours = [...source.matchAll(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/g)].reduce((total, match) => total + Number(match[1]) * 60, 0);
  const minutes = [...source.matchAll(/(\d+)\s*(m|min|mins|minute|minutes)\b/g)].reduce((total, match) => total + Number(match[1]), 0);
  return Math.round(hours + minutes);
}
function field(text, label) { const match = String(text || "").match(new RegExp(`${escapeRegex(label)}:\\s*([\\s\\S]*?)(?=\\n[A-Z][A-Za-z ]{2,40}:|\\n\\n|$)`, "i")); return match?.[1]?.trim() || ""; }
function cleanSentence(value) { return String(value || "").trim().replace(/[.!?]+$/, ""); }
function escapeRegex(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
