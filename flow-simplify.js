(() => {
  const FLOW = ["learn", "example", "practice"];
  let active = 0;

  window.addEventListener("click", handleFlowClick, true);
  new MutationObserver(queueApply).observe(document.body, { childList: true, subtree: true });
  queueApply();

  function handleFlowClick(event) {
    const control = event.target.closest(".learning-flow-nav [data-flow-step], .learning-flow-nav [data-flow-prev], .learning-flow-nav [data-flow-next]");
    if (!control) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (control.matches("[data-flow-step]")) active = Math.min(2, Number(control.dataset.flowStep || 0));
    if (control.matches("[data-flow-prev]")) active = Math.max(0, active - 1);
    if (control.matches("[data-flow-next]")) active = Math.min(2, active + 1);

    applySimpleFlow();
  }

  function queueApply() {
    clearTimeout(queueApply.timer);
    queueApply.timer = setTimeout(applySimpleFlow, 60);
  }

  function applySimpleFlow() {
    const nav = document.querySelector(".learning-flow-nav");
    const pack = document.querySelector(".study-pack");
    const engine = document.querySelector(".question-engine");
    if (!nav || !pack || !engine) return;

    const buttons = [...nav.querySelectorAll("[data-flow-step]")];
    buttons.forEach((button, index) => {
      const keep = index < FLOW.length;
      button.hidden = !keep;
      button.classList.toggle("is-active", keep && index === active);
    });

    const step = FLOW[active] || "learn";
    pack.dataset.activeFlow = step;

    const current = nav.querySelector("#flowCurrentStep");
    if (current) current.textContent = {
      learn: "Step 1: Mini Lesson",
      example: "Step 2: Worked Example",
      practice: "Step 3: Practice"
    }[step];

    pack.querySelectorAll(".study-tabs section").forEach((section) => {
      const title = section.querySelector("strong")?.textContent?.toLowerCase() || "";
      const visible =
        (step === "learn" && title.includes("learn")) ||
        (step === "example" && (title.includes("worked") || title.includes("approach") || title.includes("concept")));
      section.classList.toggle("flow-hidden", !visible);
    });

    engine.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector("#sessionNotes")?.closest(".answer-box")?.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector(".task-check")?.classList.toggle("flow-hidden", step !== "practice");
    document.querySelector("#adaptiveFixDrill")?.classList.add("flow-hidden");
    document.querySelectorAll("#practiceWorkflow > article:not(.study-pack):not(.question-engine):not(#adaptiveFixDrill)").forEach((card) => {
      card.classList.toggle("flow-hidden", step !== "practice");
    });

    const next = nav.querySelector("[data-flow-next]");
    if (next) {
      next.hidden = step === "practice";
      next.textContent = step === "learn" ? "Show Example" : "Start Practice";
    }

    const brief = document.querySelector("#questionEngineBrief");
    if (brief) {
      brief.textContent = step === "practice"
        ? "Your turn: answer the built-in HSC-style questions inside the timer. Use feedback only if you want a quick check after answering."
        : "Learn the idea, see one example, then start practice.";
    }
  }

  let rescueQueued = false;
  const output = document.querySelector("#sprintOutput");
  if (output) {
    new MutationObserver(queuePlanRescue).observe(output, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "class", "style"]
    });
    document.addEventListener("submit", () => {
      setTimeout(queuePlanRescue, 1200);
      setTimeout(queuePlanRescue, 5000);
      setTimeout(queuePlanRescue, 12000);
    }, true);
    queuePlanRescue();
  }

  function queuePlanRescue() {
    if (rescueQueued) return;
    rescueQueued = true;
    setTimeout(() => {
      rescueQueued = false;
      rescueBlankPlan();
    }, 250);
  }

  function rescueBlankPlan() {
    if (!output || output.querySelector(".loading-plan")) return;
    const stack = output.querySelector(".action-card-stack");
    const visibleTimelineCard = output.querySelector(".evening-plan .execution-card");
    if (stack && stack.hidden && !visibleTimelineCard) {
      stack.hidden = false;
      stack.classList.remove("action-card-source");
      return;
    }
    if (stack || visibleTimelineCard || output.querySelector(".empty-plan")) return;
    if ((output.textContent || "").trim()) return;

    const topic = readValue("#weakTopicsInput") || "your weakest topic";
    output.innerHTML = `
      <div class="action-card-stack fallback-action-cards">
        <article class="execution-card generated-card">
          <div class="execution-card-top">
            <span>Highest ROI Practice</span>
            <em>25 minutes - Medium</em>
          </div>
          <h3>${escapeHtml(topic)}</h3>
          <p class="do-now">Complete one timed HSC-style response, then mark one mistake and fix it.</p>
          <div class="card-grid">
            <div><strong>Highest ROI Task</strong><span>Produce an answer now instead of rereading notes.</span></div>
            <div><strong>Question Type</strong><span>Timed exam-style practice</span></div>
            <div><strong>Focus Point</strong><span>Definitions, cause-effect logic and one clear exam response.</span></div>
            <div><strong>Resource</strong><span>Internal HSC-style practice</span></div>
          </div>
          <div class="risk-row">
            <p><strong>Most Common Mistake</strong>Reading passively without writing an answer.</p>
            <p><strong>What NOT To Focus On</strong>Making a perfect plan before starting.</p>
            <p><strong>Estimated Marks Impact</strong>High because it creates immediate exam output.</p>
          </div>
          <button class="action-button" type="button">Start Practice</button>
        </article>
      </div>
    `;
  }

  function readValue(selector) {
    return document.querySelector(selector)?.value?.trim() || "";
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
