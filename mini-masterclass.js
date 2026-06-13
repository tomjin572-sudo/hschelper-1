(function () {
  if (window.__hscExamSprintRuntimeFixes) return;
  window.__hscExamSprintRuntimeFixes = true;

  const examPackResource = "NESA Economics HSC exam packs + syllabus-grounded internal practice";
  const parts = [
    {
      label: "Part 1 - Labour demand",
      title: "Labour demand",
      task: "Define labour demand and explain why firms demand workers because output is demanded.",
      type: "Concept + derived demand",
      focus: "Firms demand labour, wage rate, derived demand.",
      trap: "Calling labour demand workers looking for jobs.",
      impact: "This is the base concept that unlocks easy marks.",
      exam: "Exam relevance: NESA Economics Stage 6 (2009) includes Labour Markets. Past-paper style short answers often reward definition + derived demand + wage/employment effect."
    },
    {
      label: "Part 2 - Supply and equilibrium",
      title: "Labour supply and equilibrium wage",
      task: "Use a labour market diagram to explain how a supply change affects equilibrium wage and employment.",
      type: "Diagram logic",
      focus: "Labour supply shift, equilibrium wage, employment.",
      trap: "Moving the wrong curve or forgetting the new equilibrium.",
      impact: "Diagram logic lifts short-answer marks quickly.",
      exam: "Exam relevance: Labour market diagrams are high-value because HSC-style tasks can test demand/supply, equilibrium wage and employment effects together."
    },
    {
      label: "Part 3 - Unemployment measures",
      title: "Unemployment, underemployment and participation",
      task: "Distinguish labour force measures, then link unemployment to income, consumption and aggregate demand.",
      type: "Measure + application",
      focus: "Unemployment, underemployment, participation rate, consumption.",
      trap: "Counting people outside the labour force as unemployed.",
      impact: "These definitions are common traps with fast mark payoff.",
      exam: "Exam relevance: Employment and unemployment connect Labour Markets to HSC Economic Issues. Past-paper style questions often test indicators and aggregate demand effects."
    },
    {
      label: "Part 4 - Productivity upgrade",
      title: "Productivity and skills mismatch",
      task: "Explain how productivity or skills mismatch can shift labour demand and create structural unemployment.",
      type: "Marker upgrade",
      focus: "Productivity, skills mismatch, labour demand, structural unemployment.",
      trap: "Saying productivity automatically raises wages without the demand link.",
      impact: "This builds the stronger economic chain for higher marks.",
      exam: "Exam relevance: Productivity, skills mismatch and structural unemployment connect labour-market theory to policy and economic issue responses."
    }
  ];
  const steps = [
    "Define the labour-market term.",
    "Show the labour demand or supply mechanism.",
    "Explain the wage, employment or unemployment effect.",
    "Add a short judgement or link back."
  ];

  injectStyle();
  loadCheatSheet();
  new MutationObserver(queueRun).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("click", (event) => {
    handleCheatPractice(event);
    setTimeout(queueRun, 120);
    setTimeout(queueRun, 700);
  }, true);
  queueRun();

  function queueRun() {
    clearTimeout(queueRun.timer);
    queueRun.timer = setTimeout(run, 80);
  }

  function run() {
    document.querySelectorAll(".action-card-source").forEach((node) => {
      node.hidden = true;
      node.style.display = "none";
    });
    applyLabourJourney();
    polishQuestionCard();
    polishCheatCopy();
  }

  function applyLabourJourney() {
    const subject = value("#subjectsInput");
    const topic = value("#weakTopicsInput");
    if (!/economics|labour|labor|wage|employment|unemployment|minimum wage/i.test(`${subject} ${topic}`)) return;
    const visible = visibleCount(value("#studyTimeInput"));
    const cards = Array.from(document.querySelectorAll(".evening-plan .execution-card, .action-card-stack:not(.action-card-source) .execution-card"));
    cards.forEach((card, index) => {
      const part = parts[index];
      if (!part || index >= visible) {
        card.hidden = true;
        card.style.display = "none";
        return;
      }
      card.hidden = false;
      card.style.display = "";
      set(card, ".execution-card-top span", part.label);
      set(card, "h3", part.title);
      set(card, ".do-now", part.task);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Highest ROI Task", part.task);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Why this matters", part.exam);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Exam relevance", part.exam);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Quick steps", steps);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Key terms / structure", part.focus);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Full marks checklist", part.impact);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Question Type", part.type);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Focus Point", part.focus);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Resource", examPackResource);
      setByLabel(card, ".card-grid div, .essay-guidance-grid div", "Trap", part.trap);
      setRisk(card, "Most Common Mistake", part.trap);
      setRisk(card, "Estimated Marks Impact", part.impact);
    });
  }

  function polishQuestionCard() {
    const cards = Array.from(document.querySelectorAll("#questionStack .question-card"));
    cards.forEach((card, index) => {
      if (index > 0) {
        card.hidden = true;
        card.style.display = "none";
        return;
      }
      card.querySelectorAll(".mini-masterclass").forEach((node) => node.remove());
      ensureStepper(card);
      addQuestionExamRelevance(card);
    });
  }

  function addQuestionExamRelevance(card) {
    const text = card.textContent || "";
    if (!/labour|labor|wage|employment|unemployment|participation|productivity|minimum wage/i.test(text)) return;
    if (card.querySelector(".exam-relevance-note")) return;
    const target = card.querySelector(".why-section .why-grid, .learning-section");
    if (!target) return;
    const note = document.createElement("div");
    note.className = "exam-relevance-note";
    note.innerHTML = "<b>Exam relevance</b><span>Syllabus-grounded labour market practice, shaped like NESA Economics exam-pack short-answer and marking-guideline patterns. Use official past papers for final timed practice.</span>";
    target.prepend(note);
  }

  function ensureStepper(card) {
    if (!card || card.querySelector(".session-stepper")) return;
    const labels = ["Learn", "Worked Example", "Your Turn", "AI Feedback", "Fix", "Next Action"];
    let active = 1;
    if ((card.querySelector("[data-question-answer]")?.value || "").trim()) active = 4;
    if ((card.querySelector(".question-feedback")?.textContent || "").trim()) active = 5;
    if (/Completed/i.test(card.querySelector("[data-question-complete]")?.textContent || "")) active = 6;
    const stepper = document.createElement("ol");
    stepper.className = "session-stepper";
    stepper.setAttribute("aria-label", "Learning session steps");
    stepper.innerHTML = labels.map((label, index) => {
      const step = index + 1;
      const className = step === active ? "is-active" : step < active ? "is-done" : "";
      return `<li class="${className}" data-session-step="${step}"><span>${step}</span><b>${escapeHtml(label)}</b></li>`;
    }).join("");
    card.querySelector(".learning-card-head, .question-topline")?.after(stepper);
  }

  function handleCheatPractice(event) {
    const trigger = event.target.closest("[data-start-sheet], [data-cheat-practice]");
    if (!trigger || typeof window.startPracticeSession !== "function") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const subject = value("#cheatSubjectInput") || value("#subjectsInput") || "HSC";
    const topic = value("#cheatTopicsInput") || value("#weakTopicsInput") || "your weak topic";
    const weak = value("#cheatWeakAreasInput") || topic;
    const economics = /economics|labour|labor|wage|unemployment|market/i.test(`${subject} ${topic} ${weak}`);
    const task = trigger.dataset.cheatPractice || (economics
      ? "Write one labour-market response using definition, mechanism, impact and judgement."
      : `Answer one exam-style question on ${topic}.`);
    window.startPracticeSession({
      title: "Cheat Sheet - Start Here",
      topic,
      highestRoiTask: task,
      doThisNow: task,
      questionType: "Last-minute exam application",
      resourceName: economics ? examPackResource : "Tomorrow action sheet",
      resourceUrl: economics ? "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/economics" : "#tomorrow-cheat-sheet",
      timeRequired: "12 minutes",
      difficulty: "Core",
      focusPoint: economics ? "Definition, mechanism, impact and judgement." : "Direct answer, subject term and link to the question.",
      mostCommonMistake: economics ? "Using everyday wording instead of economic terms." : "Writing notes instead of an answer.",
      whatNotToFocusOn: "Skip passive note rewriting until this timed answer is done.",
      estimatedMarksImpact: "High if corrected before tomorrow's exam.",
      examRelevance: economics ? "Exam relevance: Labour market answer practice aligned to Economics syllabus areas and NESA exam-pack style marking patterns." : "",
      howToApproach: economics ? steps : ["Answer the command word.", "Use one subject term.", "Add evidence, working or example.", "Link back."],
      questions: [{
        question: task,
        markValue: "4 marks",
        difficulty: "Core",
        estimatedTime: "6 min",
        focusPoint: economics ? "Definition, mechanism, impact and judgement." : "Direct answer, subject term and link to the question.",
        commonMistake: economics ? "Using everyday wording instead of economic terms." : "Writing notes instead of an answer.",
        marksImpact: "This is the first mark attack from your action sheet.",
        whatToIgnore: "Skip passive note rewriting until after feedback.",
        sampleAnswer: economics ? "Definition -> Cause -> Mechanism -> Impact -> Example/Data -> Judgement" : "Point -> Explain -> Example -> Link"
      }]
    });
  }

  function polishCheatCopy() {
    const copy = document.querySelector("#tomorrow-cheat-sheet .section-copy");
    if (copy) copy.textContent = "A last-minute exam action sheet: what to know, what to practise, what to ignore, and the first task to start now.";
  }

  function loadCheatSheet() {
    if (document.querySelector("script[src*=cheat-sheet]")) return;
    const script = document.createElement("script");
    script.src = "./cheat-sheet.js?v=20260611-action-sheet";
    script.defer = true;
    document.head.appendChild(script);
  }

  function visibleCount(raw) {
    const text = String(raw || "").toLowerCase();
    const minute = text.match(/([0-9]+)\s*(m|min|mins|minute|minutes)/);
    const hour = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(h|hr|hrs|hour|hours)/);
    const minutes = hour ? Math.round(Number(hour[1]) * 60) + (minute ? Number(minute[1]) : 0) : minute ? Number(minute[1]) : 90;
    if (minutes <= 60) return 2;
    if (minutes <= 105) return 3;
    return 4;
  }

  function set(root, selector, text) {
    const node = root.querySelector(selector);
    if (node) node.textContent = text;
  }

  function setByLabel(root, selector, label, value) {
    const block = Array.from(root.querySelectorAll(selector)).find((item) => {
      return (item.querySelector("strong")?.textContent || "").trim().toLowerCase() === label.toLowerCase();
    });
    if (!block) return;
    const list = block.querySelector("ul, ol");
    const span = block.querySelector("span");
    if (Array.isArray(value) && list) list.innerHTML = value.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    else if (span) span.textContent = Array.isArray(value) ? value.join(" ") : value;
  }

  function setRisk(root, label, text) {
    const block = Array.from(root.querySelectorAll(".risk-row p")).find((item) => {
      return (item.querySelector("strong")?.textContent || "").trim() === label;
    });
    if (!block) return;
    const strong = block.querySelector("strong");
    block.textContent = "";
    if (strong) block.appendChild(strong);
    block.append(text);
  }

  function value(selector) {
    return document.querySelector(selector)?.value?.trim() || "";
  }

  function injectStyle() {
    if (document.querySelector("#hsc-exam-sprint-runtime-style")) return;
    const style = document.createElement("style");
    style.id = "hsc-exam-sprint-runtime-style";
    style.textContent = ".action-card-stack.action-card-source{display:none!important}.session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64)}.session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.session-stepper b{font-size:.72rem;line-height:1.15}.session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.session-stepper li.is-active span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green))}.session-stepper li.is-done{border-color:rgba(71,230,164,.24);color:rgba(71,230,164,.9)}.exam-relevance-note{display:grid;gap:4px;border-radius:10px;padding:9px;background:rgba(71,230,164,.08);border:1px solid rgba(71,230,164,.22)}.exam-relevance-note b{color:rgba(247,249,255,.82);font-size:.68rem;text-transform:uppercase}.exam-relevance-note span{color:var(--muted);font-size:.84rem;line-height:1.35}@media(max-width:820px){.session-stepper{grid-template-columns:repeat(3,minmax(0,1fr))}.focus-shell{width:min(100%,calc(100vw - 16px));grid-template-columns:1fr;padding:12px}.question-actions{display:grid;grid-template-columns:1fr}.question-actions button{min-height:46px}.action-card-stack{grid-template-columns:1fr}}";
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
