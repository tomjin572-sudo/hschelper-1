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
    return stems.size >= 3 && focuses.size >= 3;
  }

  function variedQuestionsFor(card, slot) {
    const text = `${card.title || ""} ${card.topic || ""} ${card.questionType || ""} ${card.doThisNow || ""}`.toLowerCase();
    if (/economic/.test(text) && /labour|labor|wage|employment|unemployment|underemployment|participation|productivity|minimum wage|skills mismatch/.test(text)) {
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
        q("Define unemployment and underemployment. Explain one difference using a labour force example.", "4 marks", "Warm-up", "Labour force measures", "Confusing underemployment with unemployment."),
        q("Explain how the participation rate can rise even if unemployment also rises.", "4 marks", "Core", "Participation vs unemployment", "Treating all labour market measures as the same."),
        q("Rewrite this as an exam definition: 'unemployment just means not having a job.'", "3 marks", "Warm-up", "Precise definitions", "Forgetting willingness and ability to work.")
      ],
      [
        q("Draw or describe a fall in labour demand. Explain the effect on equilibrium wage and employment.", "5 marks", "Core", "Demand-supply diagram shift", "Shifting labour supply instead of labour demand."),
        q("Explain why labour demand is derived demand, using one goods or services example.", "4 marks", "Core", "Derived demand", "Saying firms hire workers just because wages are low."),
        q("Identify whether a skills shortage affects labour demand or labour supply, then explain the wage effect.", "4 marks", "Core", "Curve choice", "Calling every shortage unemployment.")
      ],
      [
        q("Explain how higher labour productivity can increase labour demand in one industry.", "5 marks", "Core", "Productivity chain", "Saying productivity automatically raises wages."),
        q("Explain how a skills mismatch can contribute to structural unemployment.", "4 marks", "Core", "Structural unemployment", "Naming the type without explaining the mismatch."),
        q("Build this chain: training improves skills -> productivity changes -> labour demand changes -> employment changes.", "4 marks", "Core", "Linked economic chain", "Skipping the labour demand link.")
      ],
      [
        q("Explain one benefit and one cost of a minimum wage above equilibrium.", "6 marks", "Challenge", "Minimum wage trade-off", "Only arguing one side."),
        q("Assess whether a higher minimum wage improves living standards for all workers.", "6 marks", "Challenge", "Judgement and trade-off", "Ignoring possible employment effects."),
        q("Use a labour market diagram to explain how a wage floor can create excess labour supply.", "5 marks", "Challenge", "Wage floor diagram", "Not linking excess supply to unemployment risk.")
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

  function q(question, markValue, difficulty, focusPoint, commonMistake) {
    return {
      question,
      markValue,
      difficulty,
      estimatedTime: difficulty === "Challenge" ? "8 min" : "5 min",
      focusPoint,
      commonMistake,
      marksImpact: "Targets a different exam skill inside this sprint.",
      whatToIgnore: "Do not rewrite notes before attempting.",
      sampleAnswer: ""
    };
  }

  function clean(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }
})();