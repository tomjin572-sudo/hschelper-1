(() => {
  const STEPS = ["learn", "example", "practice", "feedback", "fix", "next"];
  const TITLES = {
    learn: "Step 1: Mini Lesson",
    example: "Step 2: Worked Example",
    practice: "Step 3: Your Turn",
    feedback: "Step 4: AI Feedback",
    fix: "Step 5: Fix Drill",
    next: "Step 6: Next Targeted Step"
  };
  const NEXT = {
    learn: "Show Example",
    example: "Start Practice",
    practice: "Check Feedback",
    feedback: "Fix Weakness",
    fix: "Next Step",
    next: "Ready"
  };
  let active = 0;
  let observerQueued = false;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const body = typeof init.body === "string" ? init.body : "";
    const isFeedback = url.includes("/api/chat") && /Mark this HSC/i.test(body);
    if (!isFeedback) return originalFetch(input, init);

    let payload = {};
    try {
      payload = JSON.parse(body);
      payload.question = upgradeFeedbackPrompt(payload.question || "");
      init = { ...init, body: JSON.stringify(payload) };
    } catch {
      payload = {};
    }

    try {
      const response = await originalFetch(input, init);
      const data = await response.clone().json().catch(() => ({}));
      return jsonResponse(cleanFeedback(data.answer, payload.question));
    } catch {
      return jsonResponse(localFeedback(payload.question));
    }
  };

  document.addEventListener("click", (event) => {
    const control = event.target.closest(".learning-flow-nav [data-flow-step], .learning-flow-nav [data-flow-prev], .learning-flow-nav [data-flow-next]");
    if (control) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (control.matches("[data-flow-step]")) active = Number(control.dataset.flowStep || 0);
      if (control.matches("[data-flow-prev]")) active = Math.max(0, active - 1);
      if (control.matches("[data-flow-next]")) active = Math.min(STEPS.length - 1, active + 1);
      applyStep();
      setTimeout(applyStep, 80);
      return;
    }

    const feedback = event.target.closest("[data-pack-feedback], [data-question-feedback]");
    if (feedback) {
      const card = feedback.closest(".question-card");
      storeWeakness(card);
      setTimeout(updateFixDrill, 700);
    }
  }, true);

  new MutationObserver(() => {
    if (observerQueued) return;
    observerQueued = true;
    setTimeout(() => {
      observerQueued = false;
      cleanBadText();
      tuneForStudentState();
      upgradePracticeExperience();
      restoreSavedAnswers();
      if (document.querySelector(".learning-flow-nav")) applyStep();
    }, 80);
  }).observe(document.body, { childList: true, subtree: true });

  function applyStep() {
    const pack = document.querySelector(".study-pack");
    const engine = document.querySelector(".question-engine");
    if (!pack) return;
    const step = STEPS[active] || "learn";

    pack.dataset.activeFlow = step;
    pack.querySelectorAll("[data-flow-step]").forEach((button, index) => {
      button.classList.toggle("is-active", index === active);
    });

    const current = document.querySelector("#flowCurrentStep");
    if (current && current.textContent !== TITLES[step]) current.textContent = TITLES[step];
    const next = pack.querySelector("[data-flow-next]");
    if (next && next.textContent !== NEXT[step]) next.textContent = NEXT[step];

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
  }

  function tuneForStudentState() {
    const state = document.querySelector("#studentStateInput")?.value || localStorage.getItem("hscStudentState") || "";
    const brief = document.querySelector(".subject-brief");
    if (!brief || !state || brief.querySelector(".state-tuning")) return;
    const note = document.createElement("small");
    note.className = "state-tuning";
    note.textContent = `Tuned for: ${state}`;
    brief.appendChild(note);

    const doNow = document.querySelector("#focusDoNow");
    if (!doNow) return;
    if (state.includes("procrastinating") || state.includes("where to start")) {
      doNow.textContent = "Start with one warm-up only. The goal is momentum, not a perfect session.";
    } else if (state.includes("lose marks")) {
      doNow.textContent = "Answer normally, then underline the exact line that would earn the mark.";
    } else if (state.includes("panicking")) {
      doNow.textContent = "Do the easiest warm-up first. One calm attempt is enough to restart.";
    } else if (state.includes("writing")) {
      doNow.textContent = "Write in structure: claim, evidence, explanation, link.";
    }
  }

  function upgradePracticeExperience() {
    const engine = document.querySelector(".question-engine");
    if (engine && !engine.querySelector(".practice-bank-note")) {
      const note = document.createElement("div");
      note.className = "practice-bank-note";
      note.innerHTML = [
        "<strong>AI-generated HSC practice</strong>",
        "<span>Use these when exact official NESA questions are not available. For official papers, use the NESA links in Past Papers.</span>"
      ].join("");
      engine.querySelector(".question-engine-head")?.after(note);
    }

    document.querySelectorAll("textarea[data-pack-answer], textarea[data-question-answer]").forEach((textarea) => {
      if (textarea.dataset.autosaveReady) return;
      textarea.dataset.autosaveReady = "true";
      textarea.addEventListener("input", () => saveAnswer(textarea));
      restoreOneAnswer(textarea);
    });
  }

  function answerKey(textarea) {
    const card = textarea.closest(".question-card");
    const question = card?.querySelector(".question-text")?.textContent?.trim() || "";
    const index = textarea.dataset.packAnswer || textarea.dataset.questionAnswer || "0";
    return `hsc-answer:${index}:${question.slice(0, 70)}`;
  }

  function saveAnswer(textarea) {
    try {
      localStorage.setItem(answerKey(textarea), textarea.value);
      const card = textarea.closest(".question-card");
      let saved = card?.querySelector(".answer-saved");
      if (!saved && card) {
        saved = document.createElement("small");
        saved.className = "answer-saved";
        textarea.closest("label")?.appendChild(saved);
      }
      if (saved) saved.textContent = textarea.value.trim() ? "Saved" : "";
    } catch {}
  }

  function restoreSavedAnswers() {
    document.querySelectorAll("textarea[data-pack-answer], textarea[data-question-answer]").forEach(restoreOneAnswer);
  }

  function restoreOneAnswer(textarea) {
    if (textarea.value) return;
    try {
      const saved = localStorage.getItem(answerKey(textarea));
      if (saved) textarea.value = saved;
    } catch {}
  }

  function updateFixDrill() {
    const fix = document.querySelector("#adaptiveFixDrill");
    if (!fix) return;
    const weakness = latestWeakness();
    const p = fix.querySelector("p");
    if (p && weakness.mistake) {
      const text = `Repair this mark-losing issue: ${weakness.mistake}. Do one smaller version before moving on.`;
      if (p.textContent !== text) p.textContent = text;
    }
    let card = fix.querySelector("#fixDrillQuestion");
    if (!card) {
      card = document.createElement("div");
      card.id = "fixDrillQuestion";
      card.className = "fix-drill-card";
      fix.querySelector("label")?.before(card);
    }
    const text = targetedFixQuestion(weakness);
    if (card.textContent !== text) card.textContent = text;
  }

  function storeWeakness(card) {
    if (!card) return;
    const mistake = [...card.querySelectorAll(".question-meta-grid div")]
      .find((item) => item.querySelector("strong")?.textContent?.toLowerCase().includes("common mistake"))
      ?.querySelector("span")?.textContent?.trim();
    const focus = [...card.querySelectorAll(".question-meta-grid div")]
      .find((item) => item.querySelector("strong")?.textContent?.toLowerCase().includes("focus"))
      ?.querySelector("span")?.textContent?.trim();
    if (!mistake && !focus) return;
    const weakness = {
      mistake: mistake || "unclear marking point",
      focus: focus || "",
      question: card.querySelector(".question-text")?.textContent?.trim() || "",
      at: Date.now()
    };
    const history = read("hscWeaknesses", []);
    history.unshift(weakness);
    localStorage.setItem("hscWeaknesses", JSON.stringify(history.slice(0, 30)));
  }

  function targetedFixQuestion(weakness) {
    const text = `${weakness.question || ""} ${weakness.focus || ""} ${weakness.mistake || ""}`;
    if (/quadratic|factor|solve|root|sign|equation/i.test(text)) return "Targeted follow-up: solve one similar equation and show every line. Finish by checking both roots.";
    if (/thesis|quote|analysis|paragraph|evidence/i.test(text)) return "Targeted follow-up: rewrite one topic sentence and one analysis sentence so the judgement is sharper.";
    if (/economic|chain|policy|mechanism|impact|definition/i.test(text)) return "Targeted follow-up: build a 4-link cause-effect chain, then add one judgement sentence.";
    if (/process|diagram|scientific|term|mechanism/i.test(text)) return "Targeted follow-up: explain the process in 4 ordered steps using two precise scientific terms.";
    return "Targeted follow-up: answer a smaller version of the task, focusing only on the marking point.";
  }

  function cleanBadText() {
    document.querySelectorAll(".study-pack p, #focusTaskText, #focusTaskTitle").forEach((node) => {
      const before = node.textContent || "";
      const after = before
        .replace(/\b(Turn)(\s+Turn\b){2,}/gi, "Priority topic")
        .replace(/Priority topic needs a simple execution loop:/i, "This session uses a simple execution loop:")
        .replace(/Turn Priority topic into/i, "Run");
      if (before !== after) node.textContent = after;
    });
  }

  function upgradeFeedbackPrompt(prompt) {
    const state = document.querySelector("#studentStateInput")?.value || localStorage.getItem("hscStudentState") || "not selected";
    return `${prompt}

Student state: ${state}
Give concise premium feedback with exactly:
Verdict
What went wrong
Why marks were lost
Fix this now
Next targeted task
Do not return JSON.`;
  }

  function cleanFeedback(answer, prompt) {
    if (looksJson(answer)) return localFeedback(prompt);
    const text = String(answer || "").replace(/```/g, "").trim();
    if (/Verdict/i.test(text) && /Fix/i.test(text)) return text;
    return localFeedback(prompt);
  }

  function localFeedback(prompt = "") {
    const question = line(prompt, "Question");
    const mistake = line(prompt, "Common mistake to check") || "the answer does not make the marking point obvious";
    const focus = line(prompt, "Focus point") || "the key marking point";
    const maths = /quadratic|factor|solve|equation|x\^/i.test(question);
    return [
      "Verdict: Good start, but it needs a cleaner mark-winning step.",
      `What went wrong: ${mistake}.`,
      `Why marks were lost: the marker cannot clearly see ${focus}.`,
      `Fix this now: ${maths ? "show the method line-by-line and state the final answer clearly" : `add one sentence that directly proves ${focus}`}.`,
      "Next targeted task: redo a smaller version of this question in 5 minutes."
    ].join("\n");
  }

  function line(text, label) {
    const match = String(text || "").match(new RegExp(`${escape(label)}:\\s*([^\\n]+)`, "i"));
    return match?.[1]?.trim() || "";
  }

  function latestWeakness() {
    return read("hscWeaknesses", [])[0] || {};
  }

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "") || fallback;
    } catch {
      return fallback;
    }
  }

  function looksJson(value) {
    return /^\s*\{[\s\S]*\}\s*$/.test(String(value || ""));
  }

  function jsonResponse(answer) {
    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  function escape(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const style = document.createElement("style");
  style.textContent = `
    .state-tuning{display:inline-flex;margin-top:10px;border-radius:999px;padding:6px 9px;background:rgba(255,255,255,.07);color:rgba(247,249,255,.82);font-weight:850}
    .fix-drill-card{border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:12px;margin:8px 0 12px;background:rgba(255,255,255,.06);color:rgba(247,249,255,.92);font-weight:850;line-height:1.42}
    .practice-bank-note{display:grid;gap:3px;margin:10px 0;padding:11px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045)}
    .practice-bank-note strong{font-size:.78rem;text-transform:uppercase;color:rgba(247,249,255,.9)}
    .practice-bank-note span{color:rgba(229,234,247,.72);font-size:.9rem;line-height:1.42}
    .answer-saved{display:block;margin-top:6px;color:rgba(143,240,197,.9);font-weight:850}
  `;
  document.head.appendChild(style);
})();
