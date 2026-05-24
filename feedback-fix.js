(() => {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const bodyText = typeof init.body === "string" ? init.body : "";
    const isFeedbackRequest = url.includes("/api/chat") && bodyText.includes("Mark this HSC-style practice answer");

    if (!isFeedbackRequest) return originalFetch(input, init);

    let requestBody = {};
    try {
      requestBody = JSON.parse(bodyText);
    } catch {
      requestBody = {};
    }

    try {
      const response = await originalFetch(input, init);
      const data = await response.clone().json().catch(() => ({}));
      const cleaned = cleanFeedback(data.answer, requestBody.question);
      return new Response(JSON.stringify({ answer: cleaned }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    } catch {
      return new Response(JSON.stringify({ answer: buildLocalFeedback(requestBody.question) }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
  };

  function cleanFeedback(answer, prompt) {
    const parsed = parsePossibleJson(answer);
    if (parsed?.cards?.length) return feedbackFromPlannerJson(parsed, prompt);
    if (looksLikeJson(answer)) return buildLocalFeedback(prompt);
    if (String(answer || "").trim()) return formatPlainFeedback(answer, prompt);
    return buildLocalFeedback(prompt);
  }

  function feedbackFromPlannerJson(parsed, prompt) {
    const card = parsed.cards[0] || {};
    const context = parsePrompt(prompt);
    return [
      "Verdict: This needs a clearer answer before it would earn full marks.",
      `What went wrong: ${context.commonMistake || card.mostCommonMistake || "The working does not clearly prove the final answer."}`,
      `Fix now: ${fixLine(context, card)}`,
      `Next action: ${nextAction(context, card)}`
    ].join("\n");
  }

  function formatPlainFeedback(answer, prompt) {
    const text = String(answer).replace(/```/g, "").trim();
    if (/Verdict:/i.test(text) && /Next action:/i.test(text)) return text;
    const context = parsePrompt(prompt);
    return [
      "Verdict: Good attempt, but check the method before moving on.",
      `What went wrong: ${context.commonMistake || "The answer may be missing a clear marking step."}`,
      `Fix now: ${text.split("\n").find(Boolean)?.slice(0, 160) || "Rewrite the solution with full working."}`,
      "Next action: Redo the same question once without looking at your first attempt."
    ].join("\n");
  }

  function buildLocalFeedback(prompt) {
    const context = parsePrompt(prompt);
    const answer = context.studentAnswer || "";
    const isMaths = /quadratic|equation|factor|solve|x\^|x2/i.test(context.question);
    const isThin = answer.trim().split(/\s+/).filter(Boolean).length < 10;

    if (isMaths) {
      return [
        `Verdict: ${isThin ? "Not enough working yet." : "Good start, but the marker needs cleaner working."}`,
        `What went wrong: ${context.commonMistake || "You may have skipped the factorisation or final roots."}`,
        "Fix now: Write the factorised form first, then state both solutions clearly: x = __ and x = __.",
        "Next action: Redo this question in 3 minutes, then check signs and both roots."
      ].join("\n");
    }

    return [
      `Verdict: ${isThin ? "Too short to mark properly." : "Solid attempt, but make the marking point more obvious."}`,
      `What went wrong: ${context.commonMistake || "The answer does not directly hit the focus point yet."}`,
      `Fix now: Add one sentence that directly proves: ${context.focusPoint || "the main point of the question"}.",`,
      "Next action: Rewrite only the weakest part, then mark the question complete."
    ].join("\n").replace('",', "");
  }

  function parsePrompt(prompt = "") {
    return {
      question: matchLine(prompt, "Question"),
      focusPoint: matchLine(prompt, "Focus point"),
      commonMistake: matchLine(prompt, "Common mistake to check"),
      studentAnswer: prompt.split("Student answer:")[1]?.split("Reply in")[0]?.trim() || ""
    };
  }

  function matchLine(text, label) {
    const regex = new RegExp(`${escapeRegExp(label)}:\\s*([^\\n]+)`, "i");
    return text.match(regex)?.[1]?.trim() || "";
  }

  function parsePossibleJson(value) {
    try {
      return JSON.parse(String(value || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, ""));
    } catch {
      return null;
    }
  }

  function looksLikeJson(value) {
    return /^\s*\{[\s\S]*\}\s*$/.test(String(value || ""));
  }

  function fixLine(context, card) {
    if (/quadratic|factor|solve|x\^|equation/i.test(context.question)) {
      return "Show the factorised form, then write both roots on a separate final line.";
    }
    return card.focusPoint ? `Rewrite the answer so it directly proves: ${card.focusPoint}.` : "Add one clear marking point and one correction before moving on.";
  }

  function nextAction(context, card) {
    if (/quadratic|factor|solve|x\^|equation/i.test(context.question)) {
      return "Try one more similar question immediately and check for sign errors.";
    }
    return card.buttonText || "Redo the weakest part in a 5-minute correction sprint.";
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
})();

(() => {
  const STEP_ORDER = ["learn", "example", "practice", "feedback", "fix", "next"];
  const STEP_TITLES = {
    learn: "Step 1: Mini Lesson",
    example: "Step 2: Worked Example",
    practice: "Step 3: Your Turn",
    feedback: "Step 4: AI Feedback",
    fix: "Step 5: Fix Drill",
    next: "Step 6: Next Targeted Step"
  };
  const STEP_BUTTONS = {
    learn: "Show Example",
    example: "Start Practice",
    practice: "Check Feedback",
    feedback: "Fix Weakness",
    fix: "Next Step",
    next: "Ready"
  };
  let desiredStep = 0;

  document.addEventListener("click", (event) => {
    const control = event.target.closest(".learning-flow-nav [data-flow-step], .learning-flow-nav [data-flow-prev], .learning-flow-nav [data-flow-next]");
    if (!control) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (control.matches("[data-flow-step]")) desiredStep = Number(control.dataset.flowStep || 0);
    if (control.matches("[data-flow-prev]")) desiredStep = Math.max(0, desiredStep - 1);
    if (control.matches("[data-flow-next]")) desiredStep = Math.min(STEP_ORDER.length - 1, desiredStep + 1);

    applyPremiumFlowStep();
    window.setTimeout(applyPremiumFlowStep, 80);
    window.setTimeout(applyPremiumFlowStep, 220);
  }, true);

  new MutationObserver(() => {
    cleanBadStudyText();
    if (document.querySelector(".learning-flow-nav")) window.setTimeout(applyPremiumFlowStep, 40);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });

  function applyPremiumFlowStep() {
    const pack = document.querySelector(".study-pack");
    const engine = document.querySelector(".question-engine");
    if (!pack) return;

    const step = STEP_ORDER[desiredStep] || "learn";
    pack.dataset.activeFlow = step;

    pack.querySelectorAll("[data-flow-step]").forEach((button, index) => {
      button.classList.toggle("is-active", index === desiredStep);
    });

    const current = document.querySelector("#flowCurrentStep");
    if (current) current.textContent = STEP_TITLES[step];

    const next = pack.querySelector("[data-flow-next]");
    if (next) next.textContent = STEP_BUTTONS[step];

    pack.querySelectorAll(".study-tabs section").forEach((section) => {
      const title = section.querySelector("strong")?.textContent?.toLowerCase() || "";
      const visible =
        (step === "learn" && title.includes("learn")) ||
        (step === "example" && (title.includes("worked") || title.includes("approach") || title.includes("concept"))) ||
        (step === "feedback" && title.includes("feedback")) ||
        (step === "fix" && title.includes("weakness")) ||
        (step === "next" && title.includes("next"));
      section.classList.toggle("flow-hidden", !visible);
    });

    document.querySelectorAll("#practiceWorkflow > article:not(.study-pack):not(.question-engine):not(#adaptiveFixDrill)").forEach((card) => {
      card.classList.toggle("flow-hidden", step !== "practice");
    });

    engine?.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector("#adaptiveFixDrill")?.classList.toggle("flow-hidden", step !== "fix");
    document.querySelector("#sessionNotes")?.closest(".answer-box")?.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector(".task-check")?.classList.toggle("flow-hidden", step !== "practice");

    const visible = step === "practice"
      ? engine
      : step === "fix"
        ? document.querySelector("#adaptiveFixDrill")
        : pack.querySelector(".study-tabs section:not(.flow-hidden)");
    visible?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cleanBadStudyText() {
    document.querySelectorAll(".study-pack p, #focusTaskText, #focusTaskTitle").forEach((node) => {
      const text = node.textContent || "";
      if (!/\bturn\b/i.test(text)) return;
      const cleaned = text
        .replace(/\b(Turn)(\s+Turn\b){2,}/gi, "Priority topic")
        .replace(/Priority topic needs a simple execution loop:/i, "This session uses a simple execution loop:")
        .replace(/Turn Priority topic into/i, "Run");
      if (cleaned !== text) node.textContent = cleaned;
    });
  }
})();
