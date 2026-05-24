(() => {
  const STRUGGLES = [
    "I don't know where to start",
    "I keep procrastinating",
    "I understand content but lose marks",
    "I need exam-style practice",
    "I need help writing answers",
    "I am panicking before an exam"
  ];

  const FLOW_STEPS = [
    { id: "learn", label: "Learn" },
    { id: "example", label: "Example" },
    { id: "practice", label: "Practice" },
    { id: "feedback", label: "Feedback" },
    { id: "fix", label: "Fix" },
    { id: "next", label: "Next" }
  ];

  let activeStep = 0;
  let lastPackKey = "";

  injectStudentStateInput();
  interceptStudyCoachRequests();
  watchLearningSessions();
  injectLearningFlowStyles();
  document.addEventListener("click", handleGlobalFlowClick, true);

  function injectStudentStateInput() {
    const form = document.querySelector("#studySprintForm");
    const submit = form?.querySelector(".primary-cta");
    if (!form || !submit || document.querySelector("#studentStateField")) return;

    const saved = localStorage.getItem("hscStudentState") || "";
    const block = document.createElement("fieldset");
    block.className = "student-state-field";
    block.id = "studentStateField";
    block.innerHTML = `
      <legend>What are you struggling with right now?</legend>
      <input type="hidden" id="studentStateInput" value="${escapeHtml(saved)}" />
      <div class="state-chip-row">
        ${STRUGGLES.map((item) => `
          <button type="button" class="state-chip ${saved === item ? "is-active" : ""}" data-student-state="${escapeHtml(item)}">${escapeHtml(item)}</button>
        `).join("")}
      </div>
    `;
    submit.before(block);

    block.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-student-state]");
      if (!chip) return;
      block.querySelectorAll(".state-chip").forEach((node) => node.classList.remove("is-active"));
      chip.classList.add("is-active");
      const value = chip.dataset.studentState;
      document.querySelector("#studentStateInput").value = value;
      localStorage.setItem("hscStudentState", value);
    });
  }

  function interceptStudyCoachRequests() {
    if (window.__hscLearningFlowFetchPatched) return;
    window.__hscLearningFlowFetchPatched = true;
    const originalFetch = window.fetch.bind(window);

    window.fetch = (input, init = {}) => {
      const url = typeof input === "string" ? input : input?.url || "";
      if (url.includes("/api/chat") && init?.body) {
        try {
          const payload = JSON.parse(init.body);
          const studentState = currentStudentState();
          if (payload.question && studentState && !payload.question.includes("Student state:")) {
            payload.question += `\n\nStudent state: ${studentState}\nAdapt the plan and focus session for this state.`;
            payload.studentState = studentState;
            init = { ...init, body: JSON.stringify(payload) };
          }
        } catch {
          return originalFetch(input, init);
        }
      }
      return originalFetch(input, init);
    };
  }

  function watchLearningSessions() {
    new MutationObserver(() => {
      const pack = document.querySelector(".study-pack");
      const overlay = document.querySelector("#focusOverlay");
      if (!pack || overlay?.getAttribute("aria-hidden") !== "false") return;
      if (document.querySelector(".learning-flow-nav")) return;
      const key = pack.className;
      lastPackKey = key;
      activeStep = 0;
      upgradePackToLearningFlow();
    }).observe(document.body, { childList: true, subtree: true });
  }

  function upgradePackToLearningFlow() {
    const pack = document.querySelector(".study-pack");
    const workflow = document.querySelector("#practiceWorkflow");
    const engine = document.querySelector(".question-engine");
    if (!pack || !workflow || !engine) return;

    pack.querySelector(".learning-flow-nav")?.remove();
    const nav = document.createElement("div");
    nav.className = "learning-flow-nav";
    nav.innerHTML = `
      <div class="flow-current" id="flowCurrentStep">Step 1: Mini Lesson</div>
      <div class="flow-step-tabs">
        ${FLOW_STEPS.map((step, index) => `<button type="button" data-flow-step="${index}">${step.label}</button>`).join("")}
      </div>
      <div class="flow-actions">
        <button type="button" class="flow-secondary" data-flow-prev>Back</button>
        <button type="button" class="flow-primary" data-flow-next>Continue</button>
      </div>
    `;
    pack.prepend(nav);

    addResourceBankNote(engine);
    addFixDrillShell(workflow);
    nav.addEventListener("click", handleFlowNav);
    engine.addEventListener("click", rememberWeaknessFromQuestion, true);
    applyLearningStep();
  }

  function handleGlobalFlowClick(event) {
    if (!event.target.closest(".learning-flow-nav [data-flow-step], .learning-flow-nav [data-flow-prev], .learning-flow-nav [data-flow-next]")) return;
    handleFlowNav(event);
  }

  function handleFlowNav(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    const direct = event.target.closest("[data-flow-step]");
    if (direct) activeStep = Number(direct.dataset.flowStep);
    if (event.target.closest("[data-flow-prev]")) activeStep = Math.max(0, activeStep - 1);
    if (event.target.closest("[data-flow-next]")) activeStep = Math.min(FLOW_STEPS.length - 1, activeStep + 1);
    applyLearningStep();
  }

  function applyLearningStep() {
    const step = FLOW_STEPS[activeStep]?.id || "learn";
    const pack = document.querySelector(".study-pack");
    const engine = document.querySelector(".question-engine");
    const fix = document.querySelector("#adaptiveFixDrill");
    if (!pack || !engine || !fix) return;

    pack.dataset.activeFlow = step;
    pack.querySelectorAll("[data-flow-step]").forEach((button, index) => {
      button.classList.toggle("is-active", index === activeStep);
    });
    const current = document.querySelector("#flowCurrentStep");
    if (current) current.textContent = stepTitle(step);

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

    engine.classList.toggle("flow-hidden", step !== "practice");
    fix.classList.toggle("flow-hidden", step !== "fix");
    document.querySelector("#sessionNotes")?.closest(".answer-box")?.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector(".task-check")?.classList.toggle("flow-hidden", step !== "practice");

    const next = pack.querySelector("[data-flow-next]");
    if (next) next.textContent = step === "next" ? "Ready" : nextLabel(step);
    document.querySelector("#questionEngineBrief") && (document.querySelector("#questionEngineBrief").textContent = engineBrief(step));
    scrollActiveLearningStepIntoView(step);
  }

  function addResourceBankNote(engine) {
    if (engine.querySelector(".resource-bank-note")) return;
    const note = document.createElement("div");
    note.className = "resource-bank-note";
    note.innerHTML = `
      <strong>Built-in practice bank</strong>
      <span>These are AI-generated HSC-style practice tasks, not official NESA questions. Use NESA links for official papers and marking guidelines.</span>
    `;
    engine.querySelector(".question-engine-head")?.after(note);
  }

  function addFixDrillShell(workflow) {
    if (document.querySelector("#adaptiveFixDrill")) return;
    const fix = document.createElement("article");
    fix.className = "adaptive-fix-drill flow-hidden";
    fix.id = "adaptiveFixDrill";
    fix.innerHTML = `
      <strong>Fix Drill</strong>
      <p>${escapeHtml(nextFixDrill())}</p>
      <label class="question-answer">Repair answer<textarea id="fixDrillAnswer" placeholder="Redo the weakest step here. Keep it short and specific."></textarea></label>
      <button type="button" class="secondary-action" id="saveFixDrill">Save Fix Drill</button>
    `;
    workflow.appendChild(fix);
    fix.querySelector("#saveFixDrill")?.addEventListener("click", () => {
      const value = fix.querySelector("#fixDrillAnswer")?.value.trim();
      if (!value) return;
      const history = readJson("hscFixDrills", []);
      history.unshift({ value, at: Date.now(), weakness: latestWeakness() });
      localStorage.setItem("hscFixDrills", JSON.stringify(history.slice(0, 20)));
      fix.querySelector("#saveFixDrill").textContent = "Saved";
    });
  }

  function rememberWeaknessFromQuestion(event) {
    if (!event.target.closest("[data-pack-feedback], [data-question-feedback], [data-pack-complete], [data-question-complete]")) return;
    const card = event.target.closest(".question-card");
    const mistake = [...(card?.querySelectorAll(".question-meta-grid div") || [])]
      .find((item) => item.querySelector("strong")?.textContent?.toLowerCase().includes("common mistake"))
      ?.querySelector("span")?.textContent?.trim();
    if (!mistake) return;
    const weaknesses = readJson("hscWeaknesses", []);
    weaknesses.unshift({ mistake, subject: document.querySelector("#focusQuestionType")?.textContent || "", at: Date.now() });
    localStorage.setItem("hscWeaknesses", JSON.stringify(weaknesses.slice(0, 30)));
    refreshFixDrill();
  }

  function refreshFixDrill() {
    const node = document.querySelector("#adaptiveFixDrill p");
    if (node) node.textContent = nextFixDrill();
  }

  function nextFixDrill() {
    const weakness = latestWeakness();
    const state = currentStudentState();
    if (state.includes("procrastinating")) return "Do one tiny repair: rewrite only the line where the mistake happened, then stop. The goal is momentum.";
    if (state.includes("lose marks")) return `Repair the marking issue: ${weakness || "identify the exact mark-losing step"}, then redo one similar task.`;
    if (state.includes("writing")) return "Rewrite the topic sentence and final linking sentence. Make the argument clearer before adding more evidence.";
    if (state.includes("panicking")) return "Do one low-pressure correction. No new content: fix one mistake and breathe for 30 seconds before continuing.";
    return weakness ? `Target this weakness now: ${weakness}. Redo one smaller version of the same task.` : "Pick the question that felt hardest and redo only the weakest step.";
  }

  function latestWeakness() {
    return readJson("hscWeaknesses", [])[0]?.mistake || "";
  }

  function currentStudentState() {
    return document.querySelector("#studentStateInput")?.value || localStorage.getItem("hscStudentState") || "";
  }

  function nextLabel(step) {
    return {
      learn: "Show Example",
      example: "Start Practice",
      practice: "Check Feedback",
      feedback: "Fix Weakness",
      fix: "Next Step"
    }[step] || "Continue";
  }

  function stepTitle(step) {
    return {
      learn: "Step 1: Mini Lesson",
      example: "Step 2: Worked Example",
      practice: "Step 3: Your Turn",
      feedback: "Step 4: AI Feedback",
      fix: "Step 5: Fix Drill",
      next: "Step 6: Next Targeted Step"
    }[step] || "Learning Flow";
  }

  function scrollActiveLearningStepIntoView(step) {
    const target =
      step === "practice" ? document.querySelector(".question-engine") :
      step === "fix" ? document.querySelector("#adaptiveFixDrill") :
      document.querySelector(".study-tabs section:not(.flow-hidden)") || document.querySelector(".study-pack");
    window.setTimeout(() => {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function engineBrief(step) {
    return {
      learn: "Read the mini lesson first. The questions stay hidden so you are not overloaded.",
      example: "Study the worked example, then move into your turn.",
      practice: "Your turn: answer the built-in HSC-style questions inside the timer.",
      feedback: "Submit answers for clear feedback: verdict, mark loss, fix, next task.",
      fix: "Repair the exact weakness before starting anything new.",
      next: "Finish with one targeted next action."
    }[step] || "Follow the guided learning flow.";
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "") || fallback;
    } catch {
      return fallback;
    }
  }

  function injectLearningFlowStyles() {
    if (document.querySelector("#learningFlowStyles")) return;
    const style = document.createElement("style");
    style.id = "learningFlowStyles";
    style.textContent = `
      .student-state-field{border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:14px;background:rgba(255,255,255,.045)}
      .student-state-field legend{padding:0 6px;color:rgba(247,249,255,.9);font-size:.82rem;font-weight:900}
      .state-chip-row{display:flex;flex-wrap:wrap;gap:8px}
      .state-chip{border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:9px 12px;background:rgba(255,255,255,.06);color:var(--muted);font-weight:800;cursor:pointer}
      .state-chip.is-active{border-color:rgba(139,211,255,.7);background:linear-gradient(135deg,rgba(139,211,255,.28),rgba(124,140,255,.18));color:#fff}
      .learning-flow-nav{display:grid;gap:10px;margin-bottom:4px}
      .flow-current{display:flex;align-items:center;min-height:38px;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:0 12px;background:rgba(255,255,255,.055);color:#fff;font-weight:950}
      .flow-step-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}
      .flow-step-tabs button{min-height:34px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(255,255,255,.05);color:var(--muted);font-weight:900;font-size:.72rem}
      .flow-step-tabs button.is-active{background:linear-gradient(135deg,var(--subject-a,#8bd3ff),var(--subject-b,#7c8cff));color:#06101f}
      .flow-actions{display:flex;justify-content:flex-end;gap:8px}
      .flow-primary,.flow-secondary{border:0;border-radius:999px;padding:10px 14px;font-weight:900;cursor:pointer}
      .flow-primary{background:linear-gradient(135deg,var(--subject-a,#8bd3ff),var(--subject-b,#7c8cff));color:#06101f}
      .flow-secondary{background:rgba(255,255,255,.08);color:#fff}
      .flow-hidden{display:none!important}
      .resource-bank-note{display:grid;gap:3px;margin:10px 0;padding:11px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045)}
      .resource-bank-note strong{font-size:.78rem;text-transform:uppercase;color:rgba(247,249,255,.9)}
      .resource-bank-note span{color:var(--muted);font-size:.9rem;line-height:1.42}
      .adaptive-fix-drill{border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:14px;background:linear-gradient(145deg,rgba(248,211,106,.12),rgba(255,255,255,.04))}
      .adaptive-fix-drill>strong{display:block;margin-bottom:6px;color:#fff;font-size:.78rem;text-transform:uppercase}
      .adaptive-fix-drill p{color:var(--muted);line-height:1.45;margin-bottom:10px}
      @media(max-width:780px){.flow-step-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}.flow-actions{justify-content:stretch}.flow-actions button{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
})();
