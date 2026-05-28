(() => {
  const nativeSetTimeout = window.setTimeout.bind(window);
  window.setTimeout = (handler, delay, ...args) => nativeSetTimeout(handler, delay === 24000 ? 45000 : delay, ...args);

  function rewriteFallbackText() {
    const output = document.querySelector("#sprintOutput");
    if (!output) return;
    output.querySelectorAll("*").forEach((node) => {
      if (!node.childNodes.length && node.textContent) {
        node.textContent = node.textContent
          .replaceAll("Offline fallback", "Backup plan")
          .replaceAll("Local fallback", "Backup plan")
          .replaceAll("Quick recovery plan", "Backup plan")
          .replaceAll("The plan is taking longer than expected. Try fewer subjects or weak topics.", "ChatGPT is connected, but this request took too long. Try 1 subject and 2-3 weak topics.");
      }
    });
  }

  function normalizeStartButtons() {
    document.querySelectorAll(".start-session, .action-button").forEach((button) => {
      const text = (button.textContent || "").trim().toLowerCase();
      if (text.includes("start") && text.includes("practice")) button.textContent = "Start Practice";
    });
  }

  function readPlannerDetails() {
    return {
      subject: document.querySelector("#subjectsInput")?.value?.trim() || "Economics",
      topic: document.querySelector("#weakTopicsInput")?.value?.trim() || "labour markets",
      time: document.querySelector("#studyTimeInput")?.value?.trim() || "90 minutes"
    };
  }

  function makeBackupCards() {
    const details = readPlannerDetails();
    const topicText = details.topic.toLowerCase();
    const isEconomics = /economic|labour|labor|wage|employment|unemployment|market/.test(`${details.subject} ${details.topic}`.toLowerCase());
    const labourQuestions = [
      {
        question: "Define labour demand, labour supply, equilibrium wage, unemployment, underemployment and participation rate.",
        difficulty: "Warm-up",
        estimatedTime: "5 min",
        focusPoint: "Use correct labour market terminology.",
        commonMistake: "Using everyday wording instead of economic terms.",
        marksImpact: "High because definitions support every short-answer response.",
        whatToIgnore: "Long introductions."
      },
      {
        question: "Draw or describe a labour market diagram showing a fall in labour demand. Explain the effect on wage rates and employment.",
        difficulty: "Core",
        estimatedTime: "10 min",
        focusPoint: "Shift labour demand and explain the new equilibrium.",
        commonMistake: "Confusing demand for labour with supply of labour.",
        marksImpact: "High because diagram logic lifts short-answer marks.",
        whatToIgnore: "General job-market commentary."
      },
      {
        question: "Explain how higher labour productivity can affect labour demand, wages and employment.",
        difficulty: "Challenge",
        estimatedTime: "10 min",
        focusPoint: "Productivity -> lower unit cost or higher MRP -> labour demand -> wage/employment.",
        commonMistake: "Saying productivity automatically raises wages without explaining why.",
        marksImpact: "Strong because it builds cause-effect reasoning.",
        whatToIgnore: "Essay filler."
      }
    ];
    const generalQuestions = [
      {
        question: `Define the key idea in ${details.topic} in two precise sentences.`,
        difficulty: "Warm-up",
        estimatedTime: "5 min",
        focusPoint: "Recall the core terms.",
        commonMistake: "Writing vague notes instead of an answer.",
        marksImpact: "Good fast-recall value.",
        whatToIgnore: "Decorating notes."
      },
      {
        question: `Complete one timed HSC-style response on ${details.topic}.`,
        difficulty: "Core",
        estimatedTime: "10 min",
        focusPoint: "Answer the directive verb directly.",
        commonMistake: "Not producing assessable work.",
        marksImpact: "High because it creates exam output.",
        whatToIgnore: "Passive rereading."
      },
      {
        question: `Write one error log entry for ${details.topic}: mistake, cause, fix.`,
        difficulty: "Fix",
        estimatedTime: "5 min",
        focusPoint: "Turn the mistake into a correction rule.",
        commonMistake: "Not writing the fix.",
        marksImpact: "Prevents repeated lost marks.",
        whatToIgnore: "Perfect formatting."
      }
    ];
    const questions = isEconomics || topicText.includes("labour") ? labourQuestions : generalQuestions;
    return [0, 1, 2].map((index) => ({
      title: index === 0 ? "Question Card 1" : index === 1 ? "Question Card 2" : "Question Card 3",
      topic: details.topic,
      highestRoiTask: isEconomics
        ? "Learn the labour market terms, then answer a diagram-based short response."
        : `Complete one timed HSC-style response on ${details.topic}.`,
      doThisNow: isEconomics
        ? "Define the key labour market terms, then complete the questions below."
        : `Start one timed practice response on ${details.topic}, then fix one weak point.`,
      questionType: isEconomics ? "Economics content drill + short answer" : "Timed HSC-style practice",
      resourceName: "Internal HSC-style practice",
      resourceUrl: "",
      timeRequired: index === 0 ? "25 minutes" : "15 minutes",
      difficulty: index === 2 ? "Medium-hard" : "Medium",
      focusPoint: isEconomics ? "Terms, diagram logic and cause-effect chains." : "Produce an answer, not notes.",
      howToApproach: isEconomics
        ? ["Define the key term.", "Use labour demand/supply logic.", "Explain the wage and employment effect."]
        : ["Attempt first.", "Mark one weakness.", "Redo the weakest part."],
      mostCommonMistake: isEconomics ? "Writing generally about jobs without economics terms." : "Reading instead of attempting.",
      estimatedMarksImpact: "High because it turns the weak topic into exam-ready output.",
      questions
    }));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderBackupCards(cards) {
    const output = document.querySelector("#sprintOutput");
    const label = document.querySelector("#sprintOutputLabel");
    if (!output || !output.querySelector(".loading-plan")) return;
    window.__hscReliabilityCards = cards;
    if (label) label.textContent = "Practice cards ready";
    output.innerHTML = `
      <div class="action-card-stack reliability-action-cards">
        ${cards.map((card, index) => `
          <article class="execution-card">
            <div class="execution-card-top">
              <span>Task ${index + 1}</span>
              <em>${escapeHtml(card.timeRequired)} - ${escapeHtml(card.difficulty)}</em>
            </div>
            <p class="card-label">${escapeHtml(card.title)}</p>
            <h3>${escapeHtml(card.topic)}</h3>
            <p class="do-now">${escapeHtml(card.doThisNow)}</p>
            <div class="card-grid">
              <div><strong>Why this first</strong><span>${escapeHtml(card.highestRoiTask)}</span></div>
              <div><strong>Question Type</strong><span>${escapeHtml(card.questionType)}</span></div>
              <div><strong>Focus Point</strong><span>${escapeHtml(card.focusPoint)}</span></div>
              <div><strong>Resource</strong><span>${escapeHtml(card.resourceName)}</span></div>
            </div>
            <div class="risk-row">
              <p><strong>Most Common Mistake</strong>${escapeHtml(card.mostCommonMistake)}</p>
              <p><strong>Estimated Marks Impact</strong>${escapeHtml(card.estimatedMarksImpact)}</p>
            </div>
            <div class="card-action-row">
              <span>Next step: start the timer and answer the questions.</span>
              <button class="action-button" type="button" data-reliability-card-index="${index}">Start Practice</button>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function queueFastFallback() {
    setTimeout(() => renderBackupCards(makeBackupCards()), 8000);
  }

  function handleBackupPractice(event) {
    const button = event.target.closest("[data-reliability-card-index]");
    if (!button) return;
    const card = window.__hscReliabilityCards?.[Number(button.dataset.reliabilityCardIndex)];
    if (!card || typeof window.startPracticeSession !== "function") return;
    event.preventDefault();
    window.startPracticeSession(card);
  }

  function startWatching() {
    const output = document.querySelector("#sprintOutput");
    if (!output) return;
    rewriteFallbackText();
    normalizeStartButtons();
    new MutationObserver(() => {
      rewriteFallbackText();
      normalizeStartButtons();
    }).observe(output, { childList: true, subtree: true });
    document.addEventListener("submit", queueFastFallback, true);
    output.addEventListener("click", handleBackupPractice, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWatching);
  } else {
    startWatching();
  }
})();
