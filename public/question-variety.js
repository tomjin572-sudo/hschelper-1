(function () {
  if (window.__hscQuestionVarietyLoaded) return;
  window.__hscQuestionVarietyLoaded = true;

  let pendingSlot = 0;
  const originalFetch = window.fetch && window.fetch.bind(window);

  if (originalFetch) {
    window.fetch = function patchedQuestionVarietyFetch(input, init) {
      try {
        const url = typeof input === "string" ? input : input && input.url;
        const isChat = typeof url === "string" && url.includes("/api/chat");
        const body = init && typeof init.body === "string" ? JSON.parse(init.body) : null;

        if (isChat && body && typeof body.question === "string" && body.question.includes("Create a simple HSC study plan")) {
          body.question += `

Question variety requirement:
- If study time is 120+ minutes, create 4 distinct execution cards.
- Do not repeat the same question stem, command term, answer path, or tested skill.
- If only one weak topic is supplied, split it into different exam moves.
- Use: definitions/recall -> method/diagram/calculation -> application/explanation -> judgement/error repair.
- For Economics labour markets, split across: labour force measures, demand-supply diagrams, productivity/skills mismatch, minimum wage trade-offs.`;
          init.body = JSON.stringify(body);
        }
      } catch (error) {
        // Keep the original request moving if another helper already changed it.
      }

      return originalFetch(input, init);
    };
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-evening-card-index], [data-card-index]");
    if (!button) return;
    pendingSlot = Number(button.dataset.eveningCardIndex ?? button.dataset.cardIndex ?? 0) || 0;
  }, true);

  const install = setInterval(() => {
    if (typeof window.startPracticeSession !== "function" || window.startPracticeSession.__hscVarietyWrapped) return;
    const originalStart = window.startPracticeSession;
    window.startPracticeSession = function startPracticeWithVariety(card) {
      return originalStart(enrichCard(card, pendingSlot));
    };
    window.startPracticeSession.__hscVarietyWrapped = true;
    clearInterval(install);
  }, 100);

  setTimeout(() => clearInterval(install), 10000);

  function enrichCard(card, slot) {
    if (!card || typeof card !== "object") return card;
    const current = Array.isArray(card.questions) ? card.questions : [];
    const varied = variedQuestionsFor(card, slot);
    if (hasEnoughVariety(current)) return card;
    return { ...card, questions: varied };
  }

  function hasEnoughVariety(questions) {
    if (!Array.isArray(questions) || questions.length < 3) return false;
    const stems = new Set(questions.map((item) => clean(item.question)).filter(Boolean));
    const focuses = new Set(questions.map((item) => clean(item.focusPoint || item.question)).filter(Boolean));
    const examCommands = /^(define|explain|assess|analyse|evaluate|describe|calculate|compare|justify|discuss|outline|solve|sketch|draw)/i;
    const realQuestions = questions.filter((item) =>
      examCommands.test(String(item.question || "").trim()) &&
      item.markValue &&
      item.estimatedTime &&
      item.focusPoint
    );
    return stems.size >= 3 && focuses.size >= 3 && realQuestions.length >= 3;
  }

  function variedQuestionsFor(card, slot) {
    const text = `${card.title || ""} ${card.topic || ""} ${card.questionType || ""} ${card.doThisNow || ""}`.toLowerCase();
    if (/labour|labor|wage|employment|unemployment|underemployment|participation|productivity|minimum wage|skills mismatch/.test(text)) {
      return labourMarketQuestions(slot);
    }
    if (/math|quadratic|calculus|function|algebra|graph/.test(text)) return mathsQuestions(slot, card.topic);
    if (/english|module|quote|thesis|paragraph|essay|textual/.test(text)) return englishQuestions(slot, card.topic);
    if (/biology|chemistry|physics|science|experiment|reaction|force|enzyme|cell/.test(text)) return scienceQuestions(slot, card.topic);
    return generalQuestions(slot, card.topic);
  }

  function labourMarketQuestions(slot) {
    const sets = [
      [
        q("Define the labour market and explain why labour demand is a derived demand.", "3 marks", "Warm-up", "Labour market + derived demand", "Calling labour markets just jobs.", "5 min", "Definitions = quick marks.", "Skip long examples."),
        q("Define unemployment and underemployment, then state one difference between them.", "3 marks", "Warm-up", "Unemployment vs underemployment", "Mixing up unemployment and underemployment.", "5 min", "Precise terms win definition marks.", "Skip policy discussion."),
        q("Outline how the participation rate measures labour force involvement.", "2 marks", "Warm-up", "Participation rate meaning", "Counting all non-workers as unemployed.", "4 min", "Correct measure = easy marks.", "Skip unemployment causes.")
      ],
      [
        q("Explain how an increase in labour demand can affect wages and employment.", "4 marks", "Core", "Demand shift -> wage/employment", "Saying wages rise without the demand shift.", "7 min", "Cause-effect chain = easy marks.", "Skip broad job-market commentary."),
        q("Explain how a fall in demand for goods and services can reduce demand for labour.", "4 marks", "Core", "Goods demand -> labour demand", "Skipping the goods/services link.", "7 min", "Derived demand link wins marks.", "Skip unemployment types."),
        q("Draw a labour market diagram showing higher labour demand and explain the new equilibrium.", "4 marks", "Core", "Demand curve shift right", "Shifting labour supply instead of demand.", "7 min", "Diagram + effect wins marks.", "Skip long definitions.")
      ],
      [
        q("Explain how higher labour productivity can increase labour demand in one industry.", "4 marks", "Core", "Productivity -> labour demand", "Saying productivity automatically raises wages.", "7 min", "Productivity chain wins marks.", "Skip wage claims without cause."),
        q("Explain how a skills mismatch can contribute to structural unemployment.", "4 marks", "Core", "Skills mismatch -> unemployment", "Naming structural unemployment without the mismatch.", "7 min", "Specific cause = stronger marks.", "Skip cyclical unemployment."),
        q("Analyse how training programs may affect productivity, labour demand and employment.", "5 marks", "Core", "Training -> productivity -> employment", "Skipping the labour demand link.", "8 min", "Linked policy chain wins marks.", "Skip generic benefits.")
      ],
      [
        q("Assess the impact of rising unemployment on households and the Australian economy.", "5 marks", "Challenge", "Household impact + macro link", "Not linking income loss to spending and AD.", "8 min", "Judgement adds top marks.", "Skip definitions-only answers."),
        q("Assess whether a minimum wage above equilibrium improves outcomes for workers.", "6 marks", "Challenge", "Minimum wage trade-off", "Only arguing one side.", "9 min", "Balanced trade-off wins marks.", "Skip moral opinion only."),
        q("Discuss how a wage floor can create both equity benefits and employment risks.", "5 marks", "Challenge", "Equity benefit + employment risk", "Forgetting the employment trade-off.", "8 min", "Two-sided answer wins marks.", "Skip one-sided policy claims.")
      ]
    ];
    return sets[slot] || sets[slot % sets.length];
  }

  function mathsQuestions(slot, topic) {
    const label = topic || "the topic";
    const sets = [
      [q(`Write the formula or first method line for ${label}, then solve one basic example.`, "3 marks", "Warm-up", "Method trigger", "Starting without the formula.")],
      [q(`Complete one substitution question on ${label}. Use brackets and show every line.`, "4 marks", "Core", "Substitution accuracy", "Dropping brackets or signs.")],
      [q(`Interpret a graph, table or result linked to ${label}. State what the answer means.`, "4 marks", "Core", "Interpretation", "Giving a number without meaning.")],
      [q(`Attempt one harder application question on ${label}. Identify the method before solving.`, "5 marks", "Challenge", "Transfer", "Using the first method that comes to mind.")]
    ];
    return sets[slot] || sets[slot % sets.length];
  }

  function englishQuestions(slot, topic) {
    const label = topic || "your module";
    const sets = [
      [q(`Write one thesis sentence for ${label} that makes a clear judgement.`, "3 marks", "Warm-up", "Thesis direction", "Retelling the text.")],
      [q(`Build one quote-technique-effect link for ${label}. Explain the idea created by the technique.`, "4 marks", "Core", "Analysis chain", "Naming a technique without effect.")],
      [q(`Write one timed analytical paragraph for ${label} using Point, Evidence, Technique, Effect, Link.`, "6 marks", "Core", "Paragraph execution", "Dropping evidence without analysis.")],
      [q(`Plan a mini response for ${label}: two arguments, two evidence points, one final judgement.`, "6 marks", "Challenge", "Argument structure", "Planning by plot order.")]
    ];
    return sets[slot] || sets[slot % sets.length];
  }

  function scienceQuestions(slot, topic) {
    const label = topic || "the topic";
    const sets = [
      [q(`Define the key process or principle in ${label}, then list the steps in order.`, "3 marks", "Warm-up", "Concept recall", "Using vague everyday wording.")],
      [q(`Complete one calculation or process question on ${label}. Include units or ordered stages.`, "4 marks", "Core", "Method accuracy", "Skipping units or sequence.")],
      [q(`Answer one data or practical question on ${label}. Refer to variables, reliability or validity where relevant.`, "5 marks", "Core", "Data/practical link", "Describing data without explaining it.")],
      [q(`Evaluate one method or explanation for ${label}, then suggest one specific improvement.`, "6 marks", "Challenge", "Evaluation", "Giving a generic improvement.")]
    ];
    return sets[slot] || sets[slot % sets.length];
  }

  function generalQuestions(slot, topic) {
    const label = topic || "your weak topic";
    const sets = [
      [q(`Define the key idea in ${label} in two exam-ready sentences.`, "3 marks", "Warm-up", "Definition precision", "Writing vague notes.")],
      [q(`Answer one short-response question on ${label} using one example.`, "4 marks", "Core", "Application", "Example not linked to the question.")],
      [q(`Correct one common mistake in ${label}, then redo the answer.`, "4 marks", "Core", "Error repair", "Not writing the fix rule.")],
      [q(`Attempt one harder question on ${label} and finish with a judgement or final link.`, "6 marks", "Challenge", "Harder transfer", "Stopping before the final link.")]
    ];
    return sets[slot] || sets[slot % sets.length];
  }

  function q(question, markValue, difficulty, focusPoint, commonMistake, estimatedTime, marksImpact, whatToIgnore) {
    return {
      question,
      markValue,
      difficulty,
      estimatedTime: estimatedTime || (difficulty === "Challenge" ? "8 min" : "5 min"),
      focusPoint,
      commonMistake,
      marksImpact: marksImpact || "Specific exam move = marks.",
      whatToIgnore: whatToIgnore || "Skip passive notes.",
      sampleAnswer: ""
    };
  }

  function clean(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }
})();
