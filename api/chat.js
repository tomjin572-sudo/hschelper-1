module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for chat requests." });
  }

  const body = req.body || {};
  const answer = JSON.stringify(buildSprint(body));
  return res.status(200).json({ answer });
};

function buildSprint(body) {
  const subject = String(body.subject || "HSC subject");
  const request = String(body.question || "");
  const topic = inferTopic(request, subject);
  const minutes = parseMinutes(request) || 60;
  const timeRequired = `${Math.max(6, Math.round(minutes / 4))} minutes`;
  const text = `${subject} ${topic} ${request}`.toLowerCase();

  let cards;
  if (/economics|labou?r|unemployment|inflation|wage|aggregate|cash rate|market/.test(text)) {
    cards = economicsCards(topic, timeRequired);
  } else if (/business|marketing|operations|finance|human resources|case study/.test(text)) {
    cards = businessCards(topic, timeRequired);
  } else if (/english|module|essay|paragraph|quote|thesis|text|composer|analysis/.test(text)) {
    cards = englishCards(topic, timeRequired);
  } else if (/math|mathematics|quadratic|calculus|function|algebra|graph|trig/.test(text)) {
    cards = mathsCards(topic, timeRequired);
  } else if (/physics|chemistry|biology|science|validity|reliability|experiment|mole|force|enzyme/.test(text)) {
    cards = scienceCards(topic, timeRequired);
  } else {
    cards = generalCards(topic, timeRequired);
  }

  return {
    coachCall: "Use the four-stage sprint: check the concept, build the response, fix the mistake, then prove it under exam conditions.",
    cards
  };
}

function inferTopic(request, subject) {
  const weak = request.match(/weak topic\s*:\s*([^.;\n]+)/i);
  if (weak) return weak[1].trim();
  const topic = request.match(/topic\s*:\s*([^.;\n]+)/i);
  if (topic) return topic[1].trim();
  if (/labou?r market/i.test(request)) return "labour markets";
  if (/essay/i.test(request)) return `${subject} essay`;
  return subject || "your weak topic";
}

function parseMinutes(text) {
  const source = String(text || "").toLowerCase();
  const hours = [...source.matchAll(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/g)]
    .reduce((total, match) => total + Number(match[1]) * 60, 0);
  const minutes = [...source.matchAll(/(\d+)\s*(m|min|mins|minute|minutes)\b/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  return Math.round(hours + minutes);
}

function economicsCards(topic, timeRequired) {
  const labour = /labou?r|wage|employment|unemployment|underemployment|participation|minimum wage/i.test(topic);
  if (!labour) return genericEconomicsCards(topic || "Economics", timeRequired);
  return [
    card(1, "Check the Concept", "Multiple Choice", topic, timeRequired, "Answer 3 MCQs on labour demand, unemployment and diagram logic.", "Recognise the correct labour-market concept.", "Choosing broad wording with no economic mechanism.", "Concept checks protect later written marks.", "Do not write paragraphs yet.", "Start Concept Check", "Choose exact economics: definition, curve shift, wage/employment effect.", [
      mcq("Which is the best definition of labour demand?", ["The number of people looking for work", "The amount of labour firms are willing and able to hire at different wage rates", "The total number of people in the labour force", "The wage workers want to receive"], "B", "Labour demand is from firms and changes at different wage rates."),
      mcq("Which answer best explains derived demand for labour?", ["Workers want higher wages, so firms hire more", "Demand for goods/services rises, so firms need more workers", "Population rises, so labour demand rises automatically", "Unemployment rises, so labour demand rises"], "B", "Firms demand labour because workers help produce goods and services."),
      mcq("If labour demand shifts right while supply is unchanged, what is the likely effect?", ["Equilibrium wage and employment rise", "Equilibrium wage falls and employment rises", "Only unemployment rises", "Labour supply shifts left"], "A", "Higher demand creates upward pressure on wages and increases employment at the new equilibrium.")
    ], "Use the concept in a written response."),
    card(2, "Build the Response", "Short Response / Written Answer", topic, timeRequired, "Write one 4-mark response using definition -> cause -> mechanism -> effect.", "Build a complete labour-market cause-effect chain.", "Saying wages rise without explaining the demand shift.", "Cause-effect chains are easy Economics marks.", "Skip long policy evaluation.", "Build Written Response", "Start with the exact term, then explain the movement.", [
      short("Explain how an increase in labour demand may affect wages and employment.", "4 marks", "Labour demand rises -> demand curve shifts right -> firms compete for workers -> equilibrium wage and employment may rise.", ["Labour demand: labour firms are willing and able to hire at each wage.", "Equilibrium wage: wage where labour demand equals labour supply."], ["Define labour demand.", "Explain rightward demand shift.", "Link to wage and employment rise.", "Use economic terms."])
    ], "Repair the common missing-link mistake."),
    card(3, "Fix the Mistake", "Error Repair", topic, timeRequired, "Fix a weak answer that skips the economic mechanism.", "Identify the missing link and rewrite it.", "Listing an outcome without the curve shift.", "Error repair prevents repeated lost explanation marks.", "Do not rewrite the whole answer.", "Fix the Mistake", "A marker needs to see why the outcome happens.", [
      repair("Weak answer: 'When labour demand increases, wages rise and people get more jobs.' Identify what is missing and rewrite the answer in 3 improved sentences.", "4 marks", "Missing mechanism: it must explain stronger demand shifts labour demand right and firms compete for workers.")
    ], "Finish with one exam-ready answer."),
    card(4, "Prove You Can Do It", "Final Exam Task / Exit Ticket", topic, timeRequired, "Write a 4-6 sentence final answer using definition, chain, example and judgement.", "Combine definition, cause-effect chain and judgement.", "Writing a definition-only answer.", "This proves the skill transfers into exam conditions.", "Do not add a long introduction.", "Complete Exit Ticket", "Final answer formula: define -> explain chain -> example/diagram -> judge impact.", [
      short("Assess the impact of rising unemployment on households and the Australian economy in 4-6 sentences.", "6 marks", "Define unemployment; explain income falls; link to consumption/aggregate demand; add example/data placeholder; judge severity by duration and scale.", ["Unemployment: willing and able to work but unable to find a job.", "Aggregate demand: total spending in the economy."], ["Define unemployment.", "Explain household income effect.", "Link to consumption/AD.", "Add judgement on severity."])
    ], "Sprint Summary: skill improved = labour-market chains; mistake fixed = missing mechanism; best move = define then explain the curve/effect; next = one timed past-paper labour-market response.")
  ];
}

function genericEconomicsCards(topic, timeRequired) {
  return genericSubjectCards(topic, timeRequired, {
    subjectMove: "Economics chain = definition -> cause -> mechanism -> impact -> judgement.",
    mcqFocus: "economic definitions and cause-effect chains",
    shortQuestion: `Explain one cause and one effect of ${topic}.`,
    weakAnswer: `Weak answer: '${topic} affects the economy because it changes things for people.' Identify the vague wording and rewrite it with one economic mechanism.`,
    finalQuestion: `Write a 4-6 sentence response assessing the impact of ${topic}.`
  });
}

function businessCards(topic, timeRequired) {
  return genericSubjectCards(topic || "Business Studies", timeRequired, {
    subjectMove: "Business chain = function -> strategy/action -> performance impact -> case detail.",
    mcqFocus: "business functions, case use and performance impact",
    shortQuestion: `Explain how one strategy in ${topic} can improve business performance.`,
    weakAnswer: "Weak answer: 'Operations is about producing goods and services. Businesses use operations strategies.' Identify what is missing and rewrite it with a performance impact.",
    finalQuestion: `Assess how one strategy in ${topic} can improve business performance.`
  });
}

function englishCards(topic, timeRequired) {
  return genericSubjectCards(topic || "English paragraph", timeRequired, {
    subjectMove: "English paragraph = Point -> Evidence -> Technique -> Effect -> Link.",
    mcqFocus: "thesis, technique and analysis vs retelling",
    shortQuestion: `Write one thesis and one topic sentence for ${topic}.`,
    weakAnswer: "Weak answer: 'The character is isolated because they are alone in the scene.' Identify why this is retelling and rewrite it with a technique and effect.",
    finalQuestion: `Write one analytical paragraph for ${topic} using Point -> Evidence -> Technique -> Effect -> Link.`
  });
}

function mathsCards(topic, timeRequired) {
  return genericSubjectCards(topic || "Maths method", timeRequired, {
    subjectMove: "Maths answer = method/formula -> substitution -> working -> final check.",
    mcqFocus: "method choice, formula choice and common traps",
    shortQuestion: `Complete one exam-style ${topic} question. Show the formula/method line, substitution and final answer.`,
    weakAnswer: "Flawed working: x^2 - 7x + 10 = 0, so (x - 5)(x + 2)=0, x=5 or -2. Identify the error and correct the solutions.",
    finalQuestion: `Solve one complete ${topic} exam-style question and include a final check line.`
  });
}

function scienceCards(topic, timeRequired) {
  return genericSubjectCards(topic || "Science concept", timeRequired, {
    subjectMove: "Science answer = concept/formula/process -> evidence/working -> result -> scientific conclusion.",
    mcqFocus: "concept recognition, variables, units and practical traps",
    shortQuestion: `Answer one HSC-style ${topic} question using correct scientific terminology.`,
    weakAnswer: "Weak answer: 'The result changed because the experiment was not accurate.' Identify the missing method detail and rewrite the line using validity, reliability or accuracy correctly.",
    finalQuestion: `Complete one final ${topic} exam task. Include terminology, working/process order and a final conclusion.`
  });
}

function generalCards(topic, timeRequired) {
  return genericSubjectCards(topic || "your weak topic", timeRequired, {
    subjectMove: "Answer path = key concept -> method/content -> explanation -> final link.",
    mcqFocus: "core concept, task recognition and common traps",
    shortQuestion: `Answer one exam-style question on ${topic}.`,
    weakAnswer: "Weak answer: 'This topic is important and affects the result.' Identify why this is too vague and rewrite it with exact subject content.",
    finalQuestion: `Complete one final exam-style answer on ${topic}.`
  });
}

function genericSubjectCards(topic, timeRequired, config) {
  return [
    card(1, "Check the Concept", "Multiple Choice", topic, timeRequired, `Answer 3 MCQs on ${config.mcqFocus}.`, "Check understanding before writing.", "Choosing vague wording.", "Concept checks stop weak answers early.", "Do not write long notes.", "Start Concept Check", config.subjectMove, [
      mcq("Which first move is strongest before writing?", ["Start with everything you remember", "Identify the key term, method and command word", "Skip the question wording", "Write a conclusion first"], "B", "The first move is to understand exactly what the task wants."),
      mcq("What usually loses marks fastest?", ["Specific evidence or working", "A clear method", "A vague explanation with no link", "Answering the command term"], "C", "Vague responses are hard to mark."),
      mcq("What should happen after a mistake?", ["Ignore it", "Write the correction rule and redo the step", "Read more notes only", "Change topic immediately"], "B", "Mistake repair improves transfer.")
    ], "Use the concept in a written answer."),
    card(2, "Build the Response", "Short Response / Written Answer", topic, timeRequired, "Write one specific HSC-style answer.", "Produce a real answer, not notes.", "Writing notes instead of an answer.", "Turns knowledge into marks.", "Skip passive revision.", "Build Written Response", config.subjectMove, [
      short(config.shortQuestion, "4 marks", config.subjectMove)
    ], "Repair the weakest mark-losing mistake."),
    card(3, "Fix the Mistake", "Error Repair", topic, timeRequired, "Fix a weak answer or flawed working.", "Mistake detection and correction.", "Naming the mistake without rewriting it.", "Prevents repeat errors.", "Do not restart everything.", "Fix the Mistake", "Find the first mark-losing line, then rewrite it.", [
      repair(config.weakAnswer, "3 marks", "The answer needs exact content, not broad wording.")
    ], "Finish with an exam-ready answer."),
    card(4, "Prove You Can Do It", "Final Exam Task / Exit Ticket", topic, timeRequired, "Complete one final answer under exam conditions.", "Combine concept, response and fix.", "Repeating the same vague wording.", "Confirms the sprint worked.", "No extra notes.", "Complete Exit Ticket", "Use the correction from Stage 3 in the final answer.", [
      short(config.finalQuestion, "5 marks", "Clear concept, specific steps, evidence/working, final answer.")
    ], "Sprint Summary: skill improved = focused answering; mistake fixed = vague response; next = one timed past-paper question.")
  ];
}

function card(stage, label, type, topic, timeRequired, task, focus, mistake, impact, ignore, buttonText, miniLesson, questions, next) {
  return {
    title: `Stage ${stage} - ${label}`,
    topic,
    highestRoiTask: task,
    doThisNow: task,
    questionType: type,
    resourceName: "Internal HSC-style practice",
    resourceUrl: "",
    timeRequired,
    difficulty: stage === 1 ? "Easy" : stage === 4 ? "Challenge" : "Core",
    focusPoint: focus,
    howToApproach: stage === 1
      ? ["Read the stem.", "Choose A, B, C or D.", "Check the explanation.", "Carry the takeaway into Stage 2."]
      : stage === 3
        ? ["Read the weak answer.", "Find the mark-losing line.", "Explain why it loses marks.", "Rewrite only the fix."]
        : ["Read the question.", "Use the guided path.", "Write inside the timer.", "Submit for feedback."],
    mostCommonMistake: mistake,
    whatNotToFocusOn: ignore,
    estimatedMarksImpact: impact,
    buttonText,
    miniLesson,
    workedExample: stage === 3 ? "Bad answer -> missing mechanism -> rewrite with exact subject content." : "Use the stage's guided path before answering.",
    feedbackCriteria: stage === 1
      ? ["selected answer", "correct answer explanation", "trap option", "takeaway"]
      : stage === 3
        ? ["mistake identified", "why it loses marks", "corrected line", "next move"]
        : ["what worked", "what lost marks", "one exact fix", "next best move"],
    fixDrill: stage === 3 ? "Rewrite the weak line correctly." : "Redo the weakest sentence or working line.",
    nextTargetedTask: next,
    questions
  };
}

function mcq(question, options, correct, reason) {
  const labelled = labelMcq(question);
  return {
    question: `${labelled}\nA. ${options[0]}\nB. ${options[1]}\nC. ${options[2]}\nD. ${options[3]}`,
    markValue: "1 mark",
    difficulty: "Warm-up",
    estimatedTime: "2 min",
    focusPoint: "Choose the strongest exam move.",
    commonMistake: "Choosing the vague option.",
    marksImpact: "Quickly checks understanding before writing.",
    whatToIgnore: "Do not type a written response for this stage.",
    sampleAnswer: `Correct answer: ${correct}. ${reason} Key takeaway: use the answer that explains the exact method, concept or marking move.`,
    guidedAnswerPath: path(["Correct option: only one answer earns the mark.", "Trap option: sounds broad but misses the method."], "Pick the option that would earn the mark.", "Select A, B, C or D.", ["Read the command.", "Eliminate vague options.", "Choose the precise option.", "Read the takeaway."], ["Correct option", "Reason understood", "Trap avoided"], "Do not choose the option that only sounds familiar.")
  };
}

function labelMcq(question) {
  if (/define|definition/i.test(question)) return `Define term: ${question}`;
  if (/derived|chain|explains/i.test(question)) return `Explain chain: ${question}`;
  if (/effect|impact|likely/i.test(question)) return `Apply concept: ${question}`;
  if (/method|formula|first move/i.test(question)) return `Method check: ${question}`;
  return `Concept check: ${question}`;
}

function short(question, markValue, scaffold, terms = ["Key term: define it in exam wording.", "Link: connect back to the question."], checklist = ["Key term used", "Cause/method explained", "Effect shown", "Final link"]) {
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
    guidedAnswerPath: path(terms, "Produce the exact written move needed for this question.", "Start with the key definition, method or claim.", ["State the key term or method.", "Explain the cause/method.", "Show the effect or working.", "Link back to the question."], checklist, "Do not write a broad answer with no link to the question.")
  };
}

function repair(question, markValue, scaffold) {
  return {
    ...short(question, markValue, scaffold, ["Error repair: identify, explain, correct.", "Fix line: improved sentence or working step."], ["Exact mistake", "Why it loses marks", "Corrected version", "Question link"]),
    focusPoint: "Find the mistake, explain why it loses marks, then rewrite the fix.",
    commonMistake: "Only saying it is wrong without correcting it.",
    marksImpact: "Mistake repair prevents losing the same marks again.",
    whatToIgnore: "Do not rewrite the whole response unless needed."
  };
}

function path(keyDefinitionsYouNeed, whatThisQuestionIsReallyAsking, firstSentenceYouCanUse, stepByStepAnswerPath, whatToIncludeForFullMarks, commonMistake) {
  return {
    keyDefinitionsYouNeed,
    whatThisQuestionIsReallyAsking,
    firstSentenceYouCanUse,
    stepByStepAnswerPath,
    whatToIncludeForFullMarks,
    commonMistake
  };
}
