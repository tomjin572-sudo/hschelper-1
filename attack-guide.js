(function () {
  if (window.__hscMcqPracticeLoaded) return;
  window.__hscMcqPracticeLoaded = true;

  compressStudySprintRequests();
  installMcqSessionGuard();
  injectStyles();
  const observer = new MutationObserver(convertCards);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  convertCards();

  function convertCards() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const questionText = card.querySelector(".question-text");
      if (!questionText || card.dataset.mcqConverted === "true") return;
      const parsed = parseMcq(questionText.textContent);
      if (!parsed) return;

      card.dataset.mcqConverted = "true";
      questionText.textContent = parsed.stem;

      const answerBox = card.querySelector("[data-question-answer]");
      const answerLabel = answerBox && answerBox.closest(".question-answer");
      if (answerLabel) answerLabel.hidden = true;
      const feedbackButton = card.querySelector("[data-question-feedback]");
      if (feedbackButton) feedbackButton.hidden = true;

      const sample = findSampleAnswer(card);
      const correct = sample.match(/correct answer:\s*([A-D])/i)?.[1] || "";
      const explanation = sample || "Check the key takeaway, then carry it into the next stage.";
      const group = document.createElement("div");
      group.className = "mcq-answer";
      group.innerHTML = `
        <strong>Choose one answer</strong>
        <div class="mcq-options">
          ${parsed.options.map((option) => `
            <button type="button" class="mcq-option" data-letter="${escapeHtml(option.letter)}" data-value="${escapeHtml(option.value)}" aria-pressed="false">
              <span>${escapeHtml(option.letter)}</span>
              <b>${escapeHtml(option.text)}</b>
            </button>
          `).join("")}
        </div>
        <div class="mcq-result" hidden></div>
      `;

      (answerLabel || card.querySelector(".question-actions"))?.insertAdjacentElement("beforebegin", group);
      group.addEventListener("click", (event) => {
        const option = event.target.closest(".mcq-option");
        if (!option) return;
        group.querySelectorAll(".mcq-option").forEach((button) => {
          const selected = button === option;
          button.classList.toggle("is-selected", selected);
          button.setAttribute("aria-pressed", selected ? "true" : "false");
        });
        if (answerBox) {
          answerBox.value = option.dataset.value || "";
          answerBox.dispatchEvent(new Event("input", { bubbles: true }));
        }
        const picked = option.dataset.letter || "";
        const result = group.querySelector(".mcq-result");
        result.hidden = false;
        result.innerHTML = renderMcqResult(picked, correct, explanation);
        const complete = card.querySelector("[data-question-complete]");
        if (complete && !/completed/i.test(complete.textContent || "")) complete.click();
      });
    });
  }

  function parseMcq(text) {
    const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const firstOption = lines.findIndex((line) => /^[A-D][.)]\s+/.test(line));
    if (firstOption < 0) return null;
    const options = lines.slice(firstOption).map((line) => {
      const match = line.match(/^([A-D])[.)]\s+(.+)$/);
      return match ? { letter: match[1], text: match[2], value: `${match[1]}. ${match[2]}` } : null;
    }).filter(Boolean);
    if (options.length < 2) return null;
    return { stem: lines.slice(0, firstOption).join(" "), options };
  }

  function findSampleAnswer(card) {
    const text = card.textContent || "";
    const match = text.match(/Correct answer:\s*[A-D][\s\S]{0,220}/i);
    return match ? match[0].replace(/\s+/g, " ").trim() : "";
  }

  function renderMcqResult(picked, correct, explanation) {
    const isCorrect = correct && picked === correct;
    const clean = simplifyExplanation(explanation);
    return `
      <b>${isCorrect ? "Correct" : correct ? "Not quite" : "Answer selected"}</b>
      <span>${correct ? `Correct answer: ${escapeHtml(correct)}.` : ""} ${escapeHtml(clean)}</span>
      <em>Next: use this idea in the written response stage.</em>
    `;
  }

  function simplifyExplanation(explanation) {
    return String(explanation || "")
      .replace(/^correct answer:\s*[A-D][.)]?\s*/i, "")
      .replace(/\bkey takeaway:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(" ");
  }

  function injectStyles() {
    if (document.querySelector("#hsc-mcq-choice-styles")) return;
    const style = document.createElement("style");
    style.id = "hsc-mcq-choice-styles";
    style.textContent = `
      .mcq-answer { display: grid; gap: 8px; }
      .mcq-answer > strong { color: rgba(247,249,255,.84); font-size: .69rem; font-weight: 900; text-transform: uppercase; }
      .mcq-options { display: grid; gap: 8px; }
      .mcq-option { display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 10px; width: 100%; min-height: 48px; padding: 8px 12px; color: rgba(247,249,255,.88); text-align: left; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; box-shadow: none; }
      .mcq-option:hover, .mcq-option.is-selected { border-color: rgba(143,207,255,.5); background: rgba(143,207,255,.14); }
      .mcq-option span { display: inline-grid; place-items: center; width: 30px; height: 30px; color: #06101f; font-size: .78rem; font-weight: 900; background: linear-gradient(135deg, var(--cyan), var(--blue)); border-radius: 999px; }
      .mcq-option b { color: rgba(247,249,255,.9); font-size: .92rem; line-height: 1.3; }
      .mcq-result { border: 1px solid rgba(71,230,164,.24); border-radius: 12px; padding: 10px; background: rgba(71,230,164,.08); color: rgba(247,249,255,.88); }
      .mcq-result b { display: block; margin-bottom: 4px; color: rgba(247,249,255,.94); }
      .mcq-result span { color: rgba(210,218,235,.9); font-size: .9rem; line-height: 1.4; }
      .mcq-result em { display: block; margin-top: 6px; color: rgba(143,207,255,.92); font-size: .82rem; font-style: normal; font-weight: 800; }
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function compressStudySprintRequests() {
    if (window.__hscFastStudySprintFetch) return;
    window.__hscFastStudySprintFetch = true;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      const url = typeof input === "string" ? input : input && input.url;
      if (url === "/api/chat" && init && typeof init.body === "string") {
        try {
          const payload = JSON.parse(init.body);
          const question = String(payload.question || "");
          if (question.length > 800 && /Weak topics:/i.test(question)) {
            const subject = question.match(/Subjects:\s*([^\n]+)/i)?.[1] || payload.subject || "HSC subject";
            const topics = question.match(/Weak topics:\s*([^\n]+)/i)?.[1] || "";
            const time = question.match(/Available study time:\s*([^\n]+)/i)?.[1] || "";
            const exam = question.match(/Exam dates:\s*([^\n]+)/i)?.[1] || "";
            init.body = JSON.stringify({
              ...payload,
              subject,
              question: `Subject: ${subject}\nWeak topic: ${topics}\nAvailable time: ${time}\nExam timing: ${exam}`
            });
          }
        } catch {}
      }
      return nativeFetch(input, init);
    };
  }

  function installMcqSessionGuard() {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (typeof window.startPracticeSession === "function" && !window.startPracticeSession.__hscMcqGuard) {
        const start = window.startPracticeSession;
        window.startPracticeSession = (card) => start(forceMcqCard(card));
        window.startPracticeSession.__hscMcqGuard = true;
      }
      if (attempts > 40) clearInterval(timer);
    }, 100);
  }

  function forceMcqCard(card) {
    if (!card || !isMultipleChoiceCard(card)) return card;
    return {
      ...card,
      questionType: "Multiple Choice",
      buttonText: "Start Concept Check",
      questions: buildMcqQuestions(card)
    };
  }

  function isMultipleChoiceCard(card) {
    const text = `${card.title || ""} ${card.questionType || ""} ${card.doThisNow || ""}`.toLowerCase();
    return /stage 1|check the concept|multiple choice|mcq|concept check|learning check/.test(text);
  }

  function buildMcqQuestions(card) {
    const supplied = Array.isArray(card.questions) ? card.questions : [];
    const realMcqs = supplied.filter((question) => /(^|\n)A[.)]\s+.+\nB[.)]\s+.+\nC[.)]\s+.+\nD[.)]\s+/i.test(String(question.question || "")));
    if (realMcqs.length) return realMcqs.slice(0, 3);

    const topic = `${card.topic || ""} ${card.focusPoint || ""} ${card.doThisNow || ""}`.toLowerCase();
    if (/labou?r|wage|employment|unemployment|market/.test(topic)) {
      return [
        mcqQuestion("Define term: Which is the best definition of labour demand?", ["The number of people looking for work", "The amount of labour firms are willing and able to hire at different wage rates", "The total number of people in the labour force", "The wage workers want to receive"], "B", "Labour demand is from firms and changes at different wage rates."),
        mcqQuestion("Explain chain: Which answer best explains derived demand for labour?", ["Workers want higher wages, so firms hire more", "Demand for goods/services rises, so firms need more workers", "Population rises, so labour demand rises automatically", "Unemployment rises, so labour demand rises"], "B", "Firms demand labour because workers help produce goods and services."),
        mcqQuestion("Apply concept: If labour demand shifts right while supply is unchanged, what is the likely effect?", ["Equilibrium wage and employment rise", "Equilibrium wage falls and employment rises", "Only unemployment rises", "Labour supply shifts left"], "A", "Higher demand creates upward pressure on wages and increases employment at the new equilibrium.")
      ];
    }

    return [
      mcqQuestion("Concept check: Which first move is strongest before answering?", ["Start with everything you remember", "Identify the key term, method and command word", "Skip the question wording", "Write a conclusion first"], "B", "The first move is to understand exactly what the task wants."),
      mcqQuestion("Concept check: What usually loses marks fastest?", ["Specific evidence or working", "A clear method", "A vague explanation with no link", "Answering the command term"], "C", "Vague responses are hard to mark."),
      mcqQuestion("Concept check: What should happen after a mistake?", ["Ignore it", "Write the correction rule and redo the step", "Read more notes only", "Change topic immediately"], "B", "Mistake repair improves transfer.")
    ];
  }

  function mcqQuestion(stem, options, correct, reason) {
    return {
      question: `${stem}\nA. ${options[0]}\nB. ${options[1]}\nC. ${options[2]}\nD. ${options[3]}`,
      markValue: "1 mark",
      difficulty: "Warm-up",
      estimatedTime: "2 min",
      focusPoint: "Choose one answer.",
      commonMistake: "Choosing the vague option.",
      marksImpact: "Checks the concept before written work.",
      whatToIgnore: "Do not type an answer for this question.",
      sampleAnswer: `Correct answer: ${correct}. ${reason}`,
      guidedAnswerPath: {
        keyDefinitionsYouNeed: ["Only one option is correct.", "Choose the most precise exam answer."],
        stepByStepAnswerPath: ["Read the stem.", "Eliminate vague options.", "Choose A, B, C or D.", "Read the feedback."],
        whatToIncludeForFullMarks: ["Correct option", "Trap avoided"],
        commonMistake: "Picking the option that only sounds familiar."
      }
    };
  }
})();