(() => {
  const state = {
    cards: [],
    activeSession: null,
    timer: null,
    paused: false
  };

  const el = (selector) => document.querySelector(selector);

  const nodes = {
    output: el("#sprintOutput"),
    focusOverlay: el("#focusOverlay"),
    focusTaskTitle: el("#focusTaskTitle"),
    focusTaskText: el("#focusTaskText"),
    focusQuestionType: el("#focusQuestionType"),
    focusResourceName: el("#focusResourceName"),
    focusResourceLink: el("#focusResourceLink"),
    focusDoNow: el("#focusDoNow"),
    focusApproachList: el("#focusApproachList"),
    focusMistake: el("#focusMistake"),
    timerDisplay: el("#timerDisplay"),
    timerProgressCircle: el("#timerProgressCircle"),
    pauseTimerButton: el("#pauseTimerButton"),
    completeSessionButton: el("#completeSessionButton"),
    closeFocusButton: el("#closeFocusButton"),
    continueButton: el("#continueButton"),
    practiceWorkflow: el("#practiceWorkflow"),
    completionScreen: el("#completionScreen"),
    sessionNotes: el("#sessionNotes"),
    taskCheck: el("#taskCheck")
  };

  renderProgressStats();
  wireInputChips();
  wrapPlanRenderer();

  nodes.output?.addEventListener("click", (event) => {
    const button = event.target.closest(".start-session");
    if (!button) return;
    const card = state.cards[Number(button.dataset.cardIndex)];
    if (card) startPracticeSession(card);
  });

  nodes.pauseTimerButton?.addEventListener("click", () => {
    state.paused = !state.paused;
    nodes.pauseTimerButton.textContent = state.paused ? "Resume" : "Pause";
  });

  nodes.completeSessionButton?.addEventListener("click", completeActiveSession);
  nodes.closeFocusButton?.addEventListener("click", closeFocusSession);
  nodes.continueButton?.addEventListener("click", closeFocusSession);

  function wrapPlanRenderer() {
    if (typeof window.renderExecutionPlan !== "function") return;
    const originalRenderExecutionPlan = window.renderExecutionPlan;
    window.renderExecutionPlan = function patchedRenderExecutionPlan(details, plan) {
      state.cards = Array.isArray(plan?.cards) ? plan.cards : [];
      originalRenderExecutionPlan(details, plan);
      convertActionLinks();
    };
  }

  function convertActionLinks() {
    document.querySelectorAll(".action-card-stack .action-button").forEach((element, index) => {
      if (element.classList.contains("start-session")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "action-button start-session";
      button.dataset.cardIndex = String(index);
      button.textContent = element.textContent || "Start 25-Minute Practice";
      element.replaceWith(button);
    });
  }

  function startPracticeSession(card) {
    const minutes = parseMinutes(card.timeRequired) || 25;
    state.activeSession = {
      card,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      minutes
    };
    state.paused = false;
    nodes.pauseTimerButton.textContent = "Pause";
    nodes.practiceWorkflow.hidden = false;
    nodes.completionScreen.hidden = true;
    nodes.sessionNotes.value = "";
    nodes.taskCheck.checked = false;

    nodes.focusTaskTitle.textContent = card.title || "Focus practice";
    nodes.focusTaskText.textContent = card.highestRoiTask || card.doThisNow || "Complete one focused practice task.";
    nodes.focusQuestionType.textContent = card.questionType || "Exam-style task";
    nodes.focusResourceName.textContent = card.resourceName || "Study resource";

    const resourceUrl = safeUrl(card.resourceUrl);
    if (resourceUrl) {
      nodes.focusResourceLink.hidden = false;
      nodes.focusResourceLink.href = resourceUrl;
    } else {
      nodes.focusResourceLink.hidden = true;
    }

    nodes.focusDoNow.textContent = card.doThisNow || card.highestRoiTask || "Start the task now.";
    nodes.focusMistake.textContent = card.mostCommonMistake || "Rushing without checking the marking criteria.";
    nodes.focusApproachList.innerHTML = (Array.isArray(card.howToApproach) ? card.howToApproach : [])
      .slice(0, 3)
      .map((step) => `<li>${escapeHtml(step)}</li>`)
      .join("");

    nodes.focusOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("focus-active");
    updateTimerDisplay();
    startTimer();
  }

  function startTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(() => {
      if (!state.activeSession || state.paused) return;
      state.activeSession.remainingSeconds -= 1;
      updateTimerDisplay();
      if (state.activeSession.remainingSeconds <= 0) completeActiveSession();
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!state.activeSession) return;
    const remaining = Math.max(state.activeSession.remainingSeconds, 0);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    nodes.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const progress = 1 - remaining / state.activeSession.totalSeconds;
    const circumference = 326.73;
    nodes.timerProgressCircle.style.strokeDashoffset = String(circumference * (1 - progress));
  }

  function completeActiveSession() {
    if (!state.activeSession) return;
    clearInterval(state.timer);
    state.activeSession.remainingSeconds = 0;
    updateTimerDisplay();

    const card = state.activeSession.card;
    updateStudyProgress(card, state.activeSession.minutes);
    nodes.practiceWorkflow.hidden = true;
    nodes.completionScreen.hidden = false;
    el("#completionMinutes").textContent = String(state.activeSession.minutes);
    el("#completionImpact").textContent = card.estimatedMarksImpact || "High";
    el("#completionNext").textContent = nextCardTitle(card);
    el("#completionFeedback").textContent =
      nodes.taskCheck.checked || nodes.sessionNotes.value.trim()
        ? "Good session. You reduced friction by doing the actual task, not just planning it."
        : "Timer finished. Quickly add one mistake or one takeaway before moving on.";
  }

  function closeFocusSession() {
    clearInterval(state.timer);
    state.activeSession = null;
    nodes.focusOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("focus-active");
  }

  function updateStudyProgress(card, minutes) {
    const progress = loadProgress();
    progress.completedTasks += 1;
    progress.focusedMinutes += minutes;
    progress.weakTopics[card.topic || "Priority topic"] = true;

    const today = new Date().toISOString().slice(0, 10);
    if (progress.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      progress.studyStreak = progress.lastStudyDate === yesterday ? progress.studyStreak + 1 : 1;
      progress.lastStudyDate = today;
    }

    localStorage.setItem("hsc-helper-progress", JSON.stringify(progress));
    renderProgressStats();
  }

  function renderProgressStats() {
    const progress = loadProgress();
    setText("#completedTasksStat", progress.completedTasks);
    setText("#studyStreakStat", progress.studyStreak);
    setText("#focusedMinutesStat", progress.focusedMinutes);
    setText("#weakTopicsStat", Object.keys(progress.weakTopics).length);
  }

  function loadProgress() {
    try {
      return {
        completedTasks: 0,
        studyStreak: 0,
        focusedMinutes: 0,
        weakTopics: {},
        lastStudyDate: "",
        ...JSON.parse(localStorage.getItem("hsc-helper-progress") || "{}")
      };
    } catch {
      return { completedTasks: 0, studyStreak: 0, focusedMinutes: 0, weakTopics: {}, lastStudyDate: "" };
    }
  }

  function wireInputChips() {
    document.addEventListener("click", (event) => {
      const chip = event.target.closest(".input-chip");
      if (!chip) return;
      const input = document.querySelector(chip.dataset.target);
      const valueToAdd = chip.dataset.value;
      if (!input || !valueToAdd) return;
      const current = input.value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
      if (!current.includes(valueToAdd)) current.push(valueToAdd);
      input.value = current.join(", ");
    });
  }

  function nextCardTitle(card) {
    const index = state.cards.indexOf(card);
    const next = state.cards[index + 1];
    return next?.topic || "Pick the next highest ROI card";
  }

  function parseMinutes(value) {
    const match = String(value || "").match(/\d+/);
    return match ? Math.max(1, Math.min(Number(match[0]), 60)) : 25;
  }

  function safeUrl(url) {
    const value = String(url || "").trim();
    return /^https?:\/\//i.test(value) ? value : "";
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
