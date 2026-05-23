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

  injectQuestionStyles();
  renderProgressStats();
  wireInputChips();
  watchPlanOutput();
  setTimeout(convertActionLinks, 250);

  nodes.output?.addEventListener("click", (event) => {
    const button = event.target.closest(".action-button, .start-session");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    convertActionLinks();
    const card = state.cards[Number(button.dataset.cardIndex)] || inferCardFromElement(button.closest(".execution-card"));
    startPracticeSession(card);
  }, true);

  nodes.pauseTimerButton?.addEventListener("click", () => {
    state.paused = !state.paused;
    nodes.pauseTimerButton.textContent = state.paused ? "Resume" : "Pause";
  });

  nodes.completeSessionButton?.addEventListener("click", completeActiveSession);
  nodes.closeFocusButton?.addEventListener("click", closeFocusSession);
  nodes.continueButton?.addEventListener("click", closeFocusSession);

  function watchPlanOutput() {
    if (!nodes.output) return;
    new MutationObserver(convertActionLinks).observe(nodes.output, { childList: true, subtree: true });
  }

  function convertActionLinks() {
    const cards = Array.from(document.querySelectorAll(".action-card-stack .execution-card"));
    if (!cards.length) return;
    state.cards = cards.map(inferCardFromElement);
    cards.forEach((cardNode, index) => {
      const action = cardNode.querySelector(".action-button");
      if (!action) return;
      if (action.tagName.toLowerCase() === "button" && action.classList.contains("start-session")) {
        action.dataset.cardIndex = String(index);
        return;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "action-button start-session";
      button.dataset.cardIndex = String(index);
      button.textContent = action.textContent || "Start 25-Minute Practice";
      action.replaceWith(button);
    });
  }

  function inferCardFromElement(cardNode) {
    if (!cardNode) return fallbackCard();
    const labels = Array.from(cardNode.querySelectorAll(".card-grid div, .risk-row p"));
    const read = (label) => {
      const block = labels.find((item) => item.querySelector("strong")?.textContent?.trim().toLowerCase() === label.toLowerCase());
      if (!block) return "";
      const clone = block.cloneNode(true);
      clone.querySelector("strong")?.remove();
      return clone.textContent.trim();
    };
    return {
      title: cardNode.querySelector(".execution-card-top span")?.textContent?.trim() || "Tonight's Highest ROI Task",
      topic: cardNode.querySelector("h3")?.textContent?.trim() || "Priority practice",
      timeRequired: cardNode.querySelector(".execution-card-top em")?.textContent?.split("-")[0]?.trim() || "25 minutes",
      difficulty: cardNode.querySelector(".execution-card-top em")?.textContent?.split("-")[1]?.trim() || "Medium",
      doThisNow: cardNode.querySelector(".do-now")?.textContent?.trim() || "Start one timed exam-style task.",
      highestRoiTask: read("Highest ROI Task") || cardNode.querySelector(".do-now")?.textContent?.trim(),
      questionType: read("Question Type") || "Exam-style question",
      focusPoint: read("Focus Point") || "Show the marker your method clearly.",
      resourceName: cardNode.querySelector(".card-grid a")?.textContent?.trim() || read("Resource") || "NESA exam resource",
      resourceUrl: cardNode.querySelector(".card-grid a")?.href || "",
      mostCommonMistake: read("Most Common Mistake") || "Rushing without checking the marking criteria.",
      whatNotToFocusOn: read("What NOT To Focus On") || "Passive rereading before attempting.",
      estimatedMarksImpact: read("Estimated Marks Impact") || "High because it turns weak areas into feedback.",
      howToApproach: Array.from(cardNode.querySelectorAll(".approach-list li")).map((item) => item.textContent.trim())
    };
  }

  function fallbackCard() {
    return {
      title: "Tonight's Highest ROI Task",
      topic: "Priority practice",
      timeRequired: "25 minutes",
      difficulty: "Medium",
      doThisNow: "Complete 3 HSC-style questions inside the timer.",
      highestRoiTask: "Start solving now, then check the mistake pattern.",
      questionType: "Exam-style practice",
      focusPoint: "Answer the exact question, not the general topic.",
      resourceName: "NESA exam resources",
      resourceUrl: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers",
      mostCommonMistake: "Planning for too long before attempting.",
      whatNotToFocusOn: "Do not rewrite notes first.",
      estimatedMarksImpact: "High start-up value."
    };
  }

  function startPracticeSession(card) {
    const minutes = parseMinutes(card.timeRequired) || 25;
    const questions = normalizeQuestions(card);
    state.activeSession = {
      card,
      questions,
      questionState: questions.map(() => ({ answer: "", complete: false, feedback: "" })),
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

    nodes.focusTaskTitle.textContent = card.title || "Question session";
    nodes.focusTaskText.textContent = card.highestRoiTask || card.doThisNow || "Complete the questions below inside the timer.";
    nodes.focusQuestionType.textContent = card.questionType || "HSC-style questions";
    nodes.focusResourceName.textContent = card.resourceName || "Study resource";

    const resourceUrl = safeUrl(card.resourceUrl);
    if (resourceUrl) {
      nodes.focusResourceLink.hidden = false;
      nodes.focusResourceLink.href = resourceUrl;
    } else {
      nodes.focusResourceLink.hidden = true;
    }

    nodes.focusDoNow.textContent = card.doThisNow || "Start with Question 1. Do not open notes until after your first attempt.";
    nodes.focusMistake.textContent = card.mostCommonMistake || "Rushing without checking the directive verb.";
    nodes.focusApproachList.innerHTML = (Array.isArray(card.howToApproach) && card.howToApproach.length ? card.howToApproach : [
      "Attempt the question from memory first.",
      "Show working, evidence or definitions clearly.",
      "Check the common mistake before moving on."
    ]).slice(0, 3).map((step) => `<li>${escapeHtml(step)}</li>`).join("");

    ensureQuestionEngine();
    renderQuestionEngine();
    nodes.focusOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("focus-active");
    updateTimerDisplay();
    startTimer();
  }

  function ensureQuestionEngine() {
    if (document.querySelector("#questionStack")) return;
    const engine = document.createElement("article");
    engine.className = "question-engine";
    engine.innerHTML = `
      <div class="question-engine-head">
        <div>
          <strong>Question Engine</strong>
          <p id="questionEngineBrief">Solve the questions below inside the timer.</p>
        </div>
        <span id="questionProgress">0/0 complete</span>
      </div>
      <div class="question-stack" id="questionStack"></div>
    `;
    const first = nodes.practiceWorkflow.querySelector("article");
    first?.after(engine);
    engine.addEventListener("click", handleQuestionAction);
    engine.addEventListener("input", handleQuestionInput);
  }

  function renderQuestionEngine() {
    if (!state.activeSession) return;
    const brief = el("#questionEngineBrief");
    const stack = el("#questionStack");
    const questions = state.activeSession.questions;
    brief.textContent = `${questions.length} HSC-style questions generated for ${state.activeSession.card.topic || "your weak topic"}. Solve, submit feedback, then move on.`;
    stack.innerHTML = questions.map(renderQuestionCard).join("");
    updateQuestionProgress();
  }

  function renderQuestionCard(question, index) {
    const item = state.activeSession.questionState[index] || {};
    return `
      <section class="question-card ${item.complete ? "is-complete" : ""}" data-question-index="${index}">
        <div class="question-topline"><span>Question ${index + 1}</span><em>${escapeHtml(question.difficulty)} - ${escapeHtml(question.estimatedTime)}</em></div>
        <p class="question-text">${escapeHtml(question.question)}</p>
        <div class="question-meta-grid">
          <div><strong>Focus</strong><span>${escapeHtml(question.focusPoint)}</span></div>
          <div><strong>Common mistake</strong><span>${escapeHtml(question.commonMistake)}</span></div>
          <div><strong>Marks impact</strong><span>${escapeHtml(question.marksImpact)}</span></div>
          <div><strong>Ignore</strong><span>${escapeHtml(question.whatToIgnore)}</span></div>
        </div>
        <label class="question-answer">Your answer / working<textarea data-question-answer="${index}" placeholder="Solve here. Include working, definitions, paragraph plan, equations or evidence.">${escapeHtml(item.answer || "")}</textarea></label>
        <div class="question-actions">
          <button type="button" class="secondary-action" data-question-complete="${index}">${item.complete ? "Completed" : "Mark Question Complete"}</button>
          <button type="button" class="secondary-action feedback-action" data-question-feedback="${index}">Submit for AI Feedback</button>
        </div>
        <div class="question-feedback" id="questionFeedback${index}" ${item.feedback ? "" : "hidden"}>${item.feedback || ""}</div>
      </section>
    `;
  }

  function handleQuestionInput(event) {
    const field = event.target.closest("[data-question-answer]");
    if (!field || !state.activeSession) return;
    state.activeSession.questionState[Number(field.dataset.questionAnswer)].answer = field.value;
    saveSessionDraft();
  }

  function handleQuestionAction(event) {
    const completeButton = event.target.closest("[data-question-complete]");
    const feedbackButton = event.target.closest("[data-question-feedback]");
    if (!state.activeSession || (!completeButton && !feedbackButton)) return;
    if (completeButton) {
      const index = Number(completeButton.dataset.questionComplete);
      state.activeSession.questionState[index].complete = !state.activeSession.questionState[index].complete;
      renderQuestionEngine();
      saveSessionDraft();
      return;
    }
    submitQuestionFeedback(Number(feedbackButton.dataset.questionFeedback), feedbackButton);
  }

  async function submitQuestionFeedback(index, button) {
    const question = state.activeSession.questions[index];
    const item = state.activeSession.questionState[index];
    button.disabled = true;
    button.textContent = "Checking...";
    const feedbackNode = el(`#questionFeedback${index}`);
    feedbackNode.hidden = false;
    feedbackNode.textContent = "AI coach is checking your working...";
    try {
      item.feedback = await askQuestionFeedback(state.activeSession.card, question, item.answer);
    } catch {
      item.feedback = localQuestionFeedback(question, item.answer);
    }
    item.complete = true;
    renderQuestionEngine();
    saveSessionDraft();
  }

  async function askQuestionFeedback(card, question, answer) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch("/api/chat", {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        subject: card.topic || "HSC subject",
        question: `Mark this HSC-style practice answer like a direct study coach.
Task topic: ${card.topic || "Priority topic"}
Question: ${question.question}
Focus point: ${question.focusPoint}
Common mistake to check: ${question.commonMistake}
Student answer: ${answer || "No answer written"}

Reply in 4 short bullets only:
- Verdict
- Weak point
- Fix now
- Next action`
      })
    });
    clearTimeout(timeout);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.answer) throw new Error("No feedback");
    return escapeHtml(data.answer).replace(/\n/g, "<br>");
  }

  function localQuestionFeedback(question, answer) {
    const wordCount = String(answer || "").trim().split(/\s+/).filter(Boolean).length;
    const verdict = wordCount < 12 ? "Too thin: write the working or evidence before checking marks." : "Good start: now tighten the method against the focus point.";
    return `<strong>AI feedback</strong><p>${escapeHtml(verdict)}</p><p><b>Weak point:</b> ${escapeHtml(question.commonMistake)}</p><p><b>Fix now:</b> Add one line that directly proves ${escapeHtml(question.focusPoint.toLowerCase())}.</p><p><b>Next action:</b> Attempt the next question without opening notes first.</p>`;
  }

  function normalizeQuestions(card) {
    const supplied = Array.isArray(card.questions) ? card.questions : [];
    const clean = supplied.filter((question) => question?.question).slice(0, 5).map((question, index) => ({
      question: question.question,
      difficulty: question.difficulty || card.difficulty || (index < 2 ? "Medium" : "Medium-hard"),
      estimatedTime: question.estimatedTime || estimateQuestionTime(card, index),
      focusPoint: question.focusPoint || card.focusPoint || "Show the marker your method clearly.",
      commonMistake: question.commonMistake || card.mostCommonMistake || "Rushing the final step.",
      marksImpact: question.marksImpact || card.estimatedMarksImpact || "High revision value.",
      whatToIgnore: question.whatToIgnore || card.whatNotToFocusOn || "Do not rewrite notes before attempting.",
      sampleAnswer: question.sampleAnswer || ""
    }));
    return clean.length >= 3 ? clean : generatePracticeQuestions(card);
  }

  function generatePracticeQuestions(card) {
    const topic = String(card.topic || card.highestRoiTask || "exam practice").toLowerCase();
    const subject = String(card.resourceName || card.questionType || card.topic || "").toLowerCase();
    if (topic.includes("quadratic") || topic.includes("algebra")) return mathsQuestions(card);
    if (topic.includes("function") || topic.includes("calculus") || topic.includes("graph")) return functionsQuestions(card);
    if (topic.includes("economics") || subject.includes("economics")) return economicsQuestions(card);
    if (topic.includes("biology") || topic.includes("enzyme") || subject.includes("biology")) return biologyQuestions(card);
    if (topic.includes("essay") || topic.includes("thesis") || topic.includes("module") || subject.includes("english")) return englishQuestions(card);
    return generalHscQuestions(card);
  }

  function baseQuestion(card, question, index, extras = {}) {
    return {
      question,
      difficulty: extras.difficulty || card.difficulty || (index < 2 ? "Medium" : "Medium-hard"),
      estimatedTime: extras.estimatedTime || estimateQuestionTime(card, index),
      focusPoint: extras.focusPoint || card.focusPoint || "Answer exactly what the question asks.",
      commonMistake: extras.commonMistake || card.mostCommonMistake || "Giving a broad answer instead of targeted working.",
      marksImpact: extras.marksImpact || card.estimatedMarksImpact || "High because it builds exam-ready marks.",
      whatToIgnore: extras.whatToIgnore || card.whatNotToFocusOn || "Ignore neat summaries until after you have attempted the question."
    };
  }

  function mathsQuestions(card) {
    return [
      baseQuestion(card, "Solve x^2 - 7x + 10 = 0. Show factorisation and state both solutions.", 0, { focusPoint: "Factorise first, then write both roots.", commonMistake: "Only giving one solution.", marksImpact: "Easy marks if factorisation is automatic." }),
      baseQuestion(card, "Solve 2x^2 + 5x - 3 = 0 using the quadratic formula. Show substitution before simplifying.", 1, { focusPoint: "Correct substitution into the formula.", commonMistake: "Sign errors in b^2 - 4ac.", marksImpact: "High exam probability for algebraic technique." }),
      baseQuestion(card, "A rectangle has area 48 cm^2 and length x + 2 cm, width x - 2 cm. Form an equation and find x.", 2, { difficulty: "Medium-hard", focusPoint: "Translate words into a quadratic equation.", commonMistake: "Solving without rejecting impossible values.", marksImpact: "Good transfer practice for application marks." }),
      baseQuestion(card, "Sketch y = x^2 - 4x - 5 by finding intercepts and the turning point.", 3, { difficulty: "Medium-hard", focusPoint: "Use intercepts plus vertex, not a rough guess.", commonMistake: "Forgetting the y-intercept.", marksImpact: "Improves graph interpretation and algebra marks." })
    ];
  }

  function functionsQuestions(card) {
    return [
      baseQuestion(card, "For f(x) = 2x^2 - 3x + 1, find f(-2) and f(a + 1).", 0, { focusPoint: "Substitute the whole expression carefully.", commonMistake: "Not using brackets around a + 1.", marksImpact: "Fast marks from clean substitution." }),
      baseQuestion(card, "State the domain and range of y = sqrt(x - 3) + 2.", 1, { focusPoint: "Start from the square-root restriction.", commonMistake: "Mixing up domain and range.", marksImpact: "Common short-answer skill." }),
      baseQuestion(card, "Differentiate y = 3x^4 - 2x^2 + 7x - 5 and find the gradient at x = 1.", 2, { focusPoint: "Differentiate first, substitute second.", commonMistake: "Substituting before differentiating.", marksImpact: "High ROI because method is repeatable." })
    ];
  }

  function economicsQuestions(card) {
    return [
      baseQuestion(card, "Explain one cause of inflation and one effect on Australian households. Use one economic term accurately.", 0, { focusPoint: "Cause-effect chain with correct terminology.", commonMistake: "Listing definitions without linking to households.", marksImpact: "Builds short-answer precision." }),
      baseQuestion(card, "Write a 6-mark paragraph explaining how monetary policy can influence aggregate demand.", 1, { focusPoint: "Use cash rate, borrowing, spending, AD.", commonMistake: "Skipping the link between interest rates and spending.", marksImpact: "High because policy questions recur." }),
      baseQuestion(card, "Plan a 12-mark response: Assess the impact of globalisation on the Australian economy. Include two arguments and one statistic placeholder.", 2, { difficulty: "Hard", focusPoint: "Make a judgement, not just description.", commonMistake: "No final judgement or weak evidence.", marksImpact: "Improves extended-response structure." })
    ];
  }

  function biologyQuestions(card) {
    return [
      baseQuestion(card, "Describe how enzymes affect reaction rates and identify one factor that can denature an enzyme.", 0, { focusPoint: "Use active site and substrate correctly.", commonMistake: "Saying enzymes are used up in reactions.", marksImpact: "Core concept with frequent short-answer value." }),
      baseQuestion(card, "Explain how a named adaptation helps an organism maintain homeostasis.", 1, { focusPoint: "Link structure/function to stable internal conditions.", commonMistake: "Naming an adaptation without explaining the mechanism.", marksImpact: "Good syllabus-dot-point retrieval." }),
      baseQuestion(card, "If enzyme activity drops sharply above 45 degrees C, explain why this happens.", 2, { difficulty: "Medium-hard", focusPoint: "Connect data trend to protein shape and active site.", commonMistake: "Repeating the trend without biological explanation.", marksImpact: "Improves data-response marks." })
    ];
  }

  function englishQuestions(card) {
    return [
      baseQuestion(card, "Write one thesis sentence that directly answers your module question. It must include a clear argument, not just the text name.", 0, { focusPoint: "Make a judgement in the thesis.", commonMistake: "Writing a topic sentence instead of an argument.", marksImpact: "High because thesis clarity controls the essay." }),
      baseQuestion(card, "Write one analytical paragraph using: topic sentence, evidence, technique, effect, link to question.", 1, { focusPoint: "Explain effect, do not just identify technique.", commonMistake: "Dropping a quote without analysis.", marksImpact: "Directly improves paragraph marks." }),
      baseQuestion(card, "Create a 4-line essay plan with two arguments and one piece of evidence for each.", 2, { focusPoint: "Prioritise argument sequence.", commonMistake: "Planning by plot instead of ideas.", marksImpact: "Stops rambling under timed conditions." })
    ];
  }

  function generalHscQuestions(card) {
    const topic = card.topic || "your weak topic";
    return [
      baseQuestion(card, `Define the key idea behind ${topic} in two precise sentences.`, 0, { focusPoint: "Use syllabus language where possible.", commonMistake: "Writing a vague definition.", marksImpact: "Builds fast recall." }),
      baseQuestion(card, `Answer one exam-style short response on ${topic}. Include one example and one clear link back to the question.`, 1, { focusPoint: "Example plus explicit link.", commonMistake: "Not answering the directive verb.", marksImpact: "Improves short-answer marks." }),
      baseQuestion(card, `Write a 5-minute error log for ${topic}: one mistake, why it happened, and the correction rule.`, 2, { focusPoint: "Turn the mistake into a rule.", commonMistake: "Writing what went wrong without a fix.", marksImpact: "Prevents repeated lost marks." })
    ];
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
    nodes.timerProgressCircle.style.strokeDashoffset = String(326.73 * (1 - progress));
  }

  function completeActiveSession() {
    if (!state.activeSession) return;
    clearInterval(state.timer);
    state.activeSession.remainingSeconds = 0;
    updateTimerDisplay();
    const card = state.activeSession.card;
    const completed = state.activeSession.questionState.filter((item) => item.complete).length;
    updateStudyProgress(card, state.activeSession.minutes, completed);
    nodes.practiceWorkflow.hidden = true;
    nodes.completionScreen.hidden = false;
    el("#completionMinutes").textContent = String(state.activeSession.minutes);
    el("#completionImpact").textContent = card.estimatedMarksImpact || "High";
    el("#completionNext").textContent = nextCardTitle(card);
    el("#completionFeedback").textContent = completed ? `Good session. You completed ${completed}/${state.activeSession.questions.length} questions and turned advice into real practice.` : "Timer finished. Complete one question or write one mistake before moving on.";
  }

  function closeFocusSession() {
    clearInterval(state.timer);
    state.activeSession = null;
    nodes.focusOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("focus-active");
  }

  function updateStudyProgress(card, minutes, completedQuestions = 0) {
    const progress = loadProgress();
    progress.completedTasks += completedQuestions || 1;
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
      return { completedTasks: 0, studyStreak: 0, focusedMinutes: 0, weakTopics: {}, lastStudyDate: "", ...JSON.parse(localStorage.getItem("hsc-helper-progress") || "{}") };
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

  function updateQuestionProgress() {
    if (!state.activeSession) return;
    const completed = state.activeSession.questionState.filter((item) => item.complete).length;
    setText("#questionProgress", `${completed}/${state.activeSession.questions.length} complete`);
  }

  function saveSessionDraft() {
    if (!state.activeSession) return;
    localStorage.setItem("hsc-helper-session-draft", JSON.stringify({ topic: state.activeSession.card.topic || "", updatedAt: Date.now(), answers: state.activeSession.questionState }));
  }

  function nextCardTitle(card) {
    const index = state.cards.indexOf(card);
    const next = state.cards[index + 1];
    return next?.topic || "Pick the next highest ROI card";
  }

  function estimateQuestionTime(card, index) {
    const total = parseMinutes(card.timeRequired) || 25;
    return `${Math.max(4, Math.round(total / 4)) + index} min`;
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
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function injectQuestionStyles() {
    if (document.querySelector("#questionEngineStyles")) return;
    const style = document.createElement("style");
    style.id = "questionEngineStyles";
    style.textContent = `
      .question-engine{display:grid;gap:14px}.question-engine-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.question-engine-head p{margin:6px 0 0}.question-engine-head span{display:inline-flex;align-items:center;min-height:32px;min-width:max-content;border-radius:999px;padding:0 12px;color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green));font-size:.76rem;font-weight:900}.question-stack{display:grid;gap:12px}.question-card{display:grid;gap:12px;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:14px;background:linear-gradient(145deg,rgba(103,232,249,.08),transparent),rgba(255,255,255,.045);transition:border-color 180ms ease,background 180ms ease,transform 180ms ease}.question-card:hover{transform:translateY(-1px);border-color:rgba(103,232,249,.28)}.question-card.is-complete{border-color:rgba(71,230,164,.36);background:linear-gradient(145deg,rgba(71,230,164,.12),transparent),rgba(255,255,255,.055)}.question-topline{display:flex;align-items:center;justify-content:space-between;gap:10px}.question-topline span,.question-topline em{display:inline-flex;align-items:center;min-height:28px;border-radius:999px;padding:0 10px;font-size:.72rem;font-style:normal;font-weight:900}.question-topline span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--blue))}.question-topline em{color:rgba(247,249,255,.78);background:rgba(255,255,255,.08)}.question-text{margin-bottom:0!important;color:var(--text)!important;font-size:1.05rem!important;font-weight:780;line-height:1.48!important}.question-meta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.question-meta-grid div{border-radius:14px;padding:10px;background:rgba(255,255,255,.055)}.question-meta-grid strong,.question-answer{color:rgba(247,249,255,.84);font-size:.69rem;font-weight:900;text-transform:uppercase}.question-meta-grid span{display:block;margin-top:4px;color:var(--muted);font-size:.84rem;line-height:1.4}.question-answer textarea{min-height:96px;margin-top:8px}.question-actions{display:flex;flex-wrap:wrap;gap:8px}.secondary-action{min-height:38px;padding:0 14px;color:rgba(247,249,255,.88);background:rgba(255,255,255,.09);box-shadow:none;font-size:.78rem}.feedback-action{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--blue))}.question-feedback{border:1px solid rgba(103,232,249,.16);border-radius:16px;padding:12px;background:rgba(103,232,249,.08);color:var(--muted);line-height:1.5}.question-feedback p{margin:6px 0 0}@media(max-width:980px){.question-meta-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }
})();
