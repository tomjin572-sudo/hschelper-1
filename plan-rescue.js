(function () {
  if (window.__hscPlanRescueLoaded) return;
  window.__hscPlanRescueLoaded = true;

  const output = document.querySelector("#sprintOutput");
  if (!output) return;

  let queued = false;
  const observer = new MutationObserver(queueRescue);
  observer.observe(output, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "class", "style"]
  });

  document.addEventListener("submit", () => {
    setTimeout(queueRescue, 1200);
    setTimeout(queueRescue, 5000);
    setTimeout(queueRescue, 12000);
  }, true);

  queueRescue();

  function queueRescue() {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      rescueBlankPlan();
    }, 250);
  }

  function rescueBlankPlan() {
    if (output.querySelector(".loading-plan")) return;

    const stack = output.querySelector(".action-card-stack");
    const visibleTimelineCard = output.querySelector(".evening-plan .execution-card");

    if (stack && stack.hidden && !visibleTimelineCard) {
      stack.hidden = false;
      stack.classList.remove("action-card-source");
      return;
    }

    if (stack || visibleTimelineCard || output.querySelector(".empty-plan")) return;
    if ((output.textContent || "").trim()) return;

    output.innerHTML = `
      <div class="action-card-stack fallback-action-cards">
        ${fallbackCard("Highest ROI Practice", "Start with the weakest topic", "Complete one timed HSC-style question, then mark one mistake and fix it.", 0)}
        ${fallbackCard("Second Practice Rep", "Build confidence", "Complete one shorter follow-up question and explain the key cause-effect chain.", 1)}
      </div>
    `;
  }

  function fallbackCard(title, topic, task, index) {
    return `
      <article class="execution-card generated-card">
        <div class="execution-card-top">
          <span>${title}</span>
          <em>${index === 0 ? "25" : "15"} minutes - Medium</em>
        </div>
        <h3>${topic}</h3>
        <p class="do-now">${task}</p>
        <div class="card-grid">
          <div><strong>Highest ROI Task</strong><span>${task}</span></div>
          <div><strong>Question Type</strong><span>Timed exam-style practice</span></div>
          <div><strong>Focus Point</strong><span>Produce an answer, then fix one weak point.</span></div>
          <div><strong>Resource</strong><span>Internal HSC-style practice</span></div>
        </div>
        <div class="risk-row">
          <p><strong>Most Common Mistake</strong>Reading notes without writing an answer.</p>
          <p><strong>What NOT To Focus On</strong>Making a perfect plan before starting.</p>
          <p><strong>Estimated Marks Impact</strong>High because it creates immediate exam output.</p>
        </div>
        <button class="action-button" type="button">Start Practice</button>
      </article>
    `;
  }
})();
