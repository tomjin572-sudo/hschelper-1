(() => {
  const form = document.querySelector("#studySprintForm");
  const output = document.querySelector("#sprintOutput");
  const outputLabel = document.querySelector("#sprintOutputLabel");
  const paperDirectory = document.querySelector("#paperDirectory");
  const focusOverlay = document.querySelector("#focusOverlay");
  const questionStack = document.querySelector("#questionStack");
  const sessionNotes = document.querySelector("#sessionNotes");
  const practiceWorkflow = document.querySelector("#practiceWorkflow");
  const completionScreen = document.querySelector("#completionScreen");
  const timerDisplay = document.querySelector("#timerDisplay");
  const pauseTimerButton = document.querySelector("#pauseTimerButton");
  const completeSessionButton = document.querySelector("#completeSessionButton");
  const closeFocusButton = document.querySelector("#closeFocusButton");
  const continueButton = document.querySelector("#continueButton");

  let currentCards = [];
  let activeCard = null;
  let activeQuestion = null;
  let timerId = null;
  let remainingSeconds = 0;
  let paused = false;

  const paperLinks = [
    ["All HSC papers", "Official NESA exam packs and marking guidelines.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers"],
    ["Economics", "Economics past HSC exam packs.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/economics"],
    ["Business Studies", "Business Studies past HSC exam packs.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/business-studies"],
    ["English", "English past HSC exam packs.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=English"],
    ["Mathematics", "Mathematics past HSC exam packs.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Mathematics"]
  ];

  renderPaperLinks();
  renderProgress();

  if (form) form.addEventListener("submit", generatePlan);
  if (output) output.addEventListener("click", onCardClick);
  if (questionStack) questionStack.addEventListener("click", onQuestionClick);
  if (pauseTimerButton) pauseTimerButton.addEventListener("click", togglePause);
  if (completeSessionButton) completeSessionButton.addEventListener("click", completeSession);
  if (closeFocusButton) closeFocusButton.addEventListener("click", closeSession);
  if (continueButton) continueButton.addEventListener("click", closeSession);
  document.addEventListener("click", onChipClick);

  async function generatePlan(event) {
    event.preventDefault();
    const details = getDetails();
    const submit = form.querySelector("button[type='submit']");
    setLoading(true, submit);
    try {
      const answer = await requestPlan(details);
      const cards = parsePlan(answer);
      currentCards = cards.length ? cards : fallbackCards(details);
      renderCards(currentCards, "Mark attack cards ready");
    } catch (error) {
      console.warn("StudySprint used fallback cards", error);
      currentCards = fallbackCards(details);
      renderCards(currentCards, "Fallback mark attack cards ready");
    } finally {
      setLoading(false, submit);
    }
  }

  function getDetails() {
    const subjects = split(value("#subjectsInput"));
    const topics = split(value("#weakTopicsInput"));
    return {
      subject: subjects[0] || "Economics",
      topic: topics[0] || "Unemployment",
      topics: topics.length ? topics : ["Unemployment"],
      examTiming: value("#examDatesInput") || "tomorrow",
      studyTime: value("#studyTimeInput") || "90 minutes",
      practiceMode: value("#practiceModeInput") || "short-answer"
    };
  }

  async function requestPlan(details) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const question = [
      "Subject: " + details.subject,
      "Practice type: " + (details.practiceMode === "essay" ? "Essay / Extended Response Sprint" : "Short Answer Sprint"),
      "Weak topic: " + details.topics.join(", "),
      "Available time: " + details.studyTime,
      "Exam timing: " + details.examTiming
    ].join("\n");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, subject: details.subject })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Plan failed");
      if (!data.answer) throw new Error("Empty plan");
      return data.answer;
    } finally {
      clearTimeout(timeout);
    }
  }

  function parsePlan(answer) {
    try {
      const cleaned = String(answer || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed.cards)) return [];
      return parsed.cards.slice(0, 5).map(normalizeCard);
    } catch (error) {
      return [];
    }
  }

  function normalizeCard(card, index) {
    const question = Array.isArray(card.questions) && card.questions[0] ? card.questions[0] : {};
    const steps = Array.isArray(card.howToApproach) ? card.howToApproach : ["Read the task.", "Write an answer.", "Get feedback.", "Fix one sentence."];
    return {
      title: card.title || "Card " + (index + 1),
      topic: card.topic || "Priority topic",
      task: card.doThisNow || card.highestRoiTask || question.question || "Complete this timed mark attack.",
      type: card.questionType || "HSC-style practice",
      time: card.timeRequired || question.estimatedTime || "12 minutes",
      difficulty: card.difficulty || question.difficulty || "Core",
      focus: card.focusPoint || question.focusPoint || "Answer the exact question, then fix one weak sentence.",
      trap: card.mostCommonMistake || question.commonMistake || "Writing notes instead of an answer.",
      impact: card.estimatedMarksImpact || question.marksImpact || "Targets marks you can still win today.",
      ignore: card.whatNotToFocusOn || question.whatToIgnore || "Do not rewrite notes before attempting.",
      resourceName: card.resourceName || "Internal HSC-style practice",
      resourceUrl: safeUrl(card.resourceUrl),
      steps,
      question: {
        text: question.question || card.doThisNow || card.highestRoiTask || "Write one exam-style response for this card.",
        marks: question.markValue || "4 marks",
        time: question.estimatedTime || card.timeRequired || "8 min",
        focus: question.focusPoint || card.focusPoint || "Use key term, mechanism and final link.",
        trap: question.commonMistake || card.mostCommonMistake || "Being too general.",
        sample: question.sampleAnswer || card.workedExample || ""
      }
    };
  }

  function fallbackCards(details) {
    const economics = /economics|unemployment|labou?r|wage|market/i.test(details.subject + " " + details.topic);
    if (economics) {
      return [
        fallbackCard("Card 1 - Must know", "Economics - " + details.topic, "Lock the definition and the income to consumption to aggregate demand chain.", "Lecture Sheet", "Define the term, then state the economic chain.", "Only saying it is bad without an economic mechanism."),
        fallbackCard("Card 2 - Trap check", "Economics - " + details.topic, "Answer one concept check that separates the key terms.", "Multiple Choice", "Separate similar terms before writing.", "Choosing the familiar term instead of the accurate one."),
        fallbackCard("Card 3 - Chain builder", "Economics - " + details.topic, "Build a cause-effect chain in the correct order.", "Chain Builder", "Cause, mechanism, impact, link.", "Jumping from cause to final impact with no mechanism."),
        fallbackCard("Card 4 - Exam answer", "Economics - " + details.topic, "Write one timed 4-mark response.", "Short Response", "Definition, cause, mechanism, impact.", "Writing a definition-only answer."),
        fallbackCard("Card 5 - Marker upgrade", "Economics - " + details.topic, "Upgrade one weak answer by adding mechanism and judgement.", "Marker Upgrade", "Find the missing mark and rewrite only that part.", "Making the answer longer but not more precise.")
      ];
    }
    return [
      fallbackCard("Card 1 - Start here", details.subject + " - " + details.topic, "Learn the key move, then attempt one answer.", "Core practice", "Key term, answer, evidence or working, link.", "Reading notes instead of writing."),
      fallbackCard("Card 2 - Apply it", details.subject + " - " + details.topic, "Apply the idea to one exam-style task.", "Application", "Use the command word and subject language.", "Answering the topic, not the question."),
      fallbackCard("Card 3 - Fix it", details.subject + " - " + details.topic, "Fix the weakest sentence or line of working.", "Error repair", "Find one lost mark and rewrite it.", "Moving on without correction.")
    ];
  }

  function fallbackCard(title, topic, task, type, focus, trap) {
    return normalizeCard({
      title,
      topic,
      doThisNow: task,
      questionType: type,
      timeRequired: "12 minutes",
      difficulty: "Core",
      focusPoint: focus,
      mostCommonMistake: trap,
      estimatedMarksImpact: "Targets marks you can still win today.",
      questions: [{ question: task, markValue: type === "Multiple Choice" ? "1 mark" : "4 marks", estimatedTime: "6 min", focusPoint: focus, commonMistake: trap }]
    }, 0);
  }

  function renderCards(cards, label) {
    outputLabel.textContent = label;
    output.innerHTML = '<div class="action-card-stack">' + cards.map(renderCard).join("") + '</div>';
  }

  function renderCard(card, index) {
    return '<article class="execution-card">' +
      '<div class="execution-card-top"><span>Card ' + (index + 1) + '</span><em>' + esc(card.time) + ' - ' + esc(card.difficulty) + '</em></div>' +
      '<p class="card-label">' + esc(card.title) + '</p>' +
      '<h3>' + esc(card.topic) + '</h3>' +
      '<p class="do-now">' + esc(card.task) + '</p>' +
      '<div class="card-grid essay-guidance-grid">' +
      '<div><strong>Mark attack</strong><span>' + esc(card.type) + '</span></div>' +
      '<div><strong>Guided answer path</strong><span>' + esc(card.focus) + '</span></div>' +
      '<div><strong>Trap</strong><span>' + esc(card.trap) + '</span></div>' +
      '<div><strong>Marks impact</strong><span>' + esc(card.impact) + '</span></div>' +
      '<div><strong>Ignore</strong><span>' + esc(card.ignore) + '</span></div>' +
      '</div>' +
      '<div class="card-action-row"><span>This is a marks task, not a note-taking task.</span><button class="action-button start-session" type="button" data-card-index="' + index + '">Start Practice</button></div>' +
      '</article>';
  }

  function onCardClick(event) {
    const button = event.target.closest("[data-card-index]");
    if (!button) return;
    const card = currentCards[Number(button.dataset.cardIndex)];
    if (card) openSession(card);
  }

  function openSession(card) {
    activeCard = card;
    activeQuestion = card.question;
    setText("#focusTaskTitle", card.title);
    setText("#focusTaskText", card.task);
    setText("#focusQuestionType", card.type);
    setText("#focusResourceName", card.resourceName);
    setText("#focusDoNow", card.task);
    setText("#focusMistake", card.trap);
    const link = document.querySelector("#focusResourceLink");
    if (link && card.resourceUrl) { link.hidden = false; link.href = card.resourceUrl; } else if (link) { link.hidden = true; }
    const approach = document.querySelector("#focusApproachList");
    if (approach) approach.innerHTML = card.steps.map((item) => "<li>" + esc(item) + "</li>").join("");
    if (sessionNotes) sessionNotes.value = "";
    renderQuestion(card);
    if (practiceWorkflow) practiceWorkflow.hidden = false;
    if (completionScreen) completionScreen.hidden = true;
    if (focusOverlay) focusOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("focus-active");
    startTimer(card.time);
  }

  function renderQuestion(card) {
    const q = card.question;
    const sample = q.sample ? '<div class="learning-section"><div class="learning-section-title"><strong>Worked Example</strong><span>Pattern</span></div><p>' + esc(q.sample) + '</p></div>' : "";
    questionStack.innerHTML = '<section class="question-card">' +
      '<div class="question-topline"><span>' + esc(q.marks) + '</span><em>' + esc(q.time) + '</em></div>' +
      '<div class="learning-section"><div class="learning-section-title"><strong>Why this matters</strong><span>Exam sprint</span></div><p>' + esc(card.impact) + '</p></div>' +
      '<div class="learning-section"><div class="learning-section-title"><strong>Guided Answer Path</strong><span>Use this</span></div><ol>' + card.steps.map((item) => "<li>" + esc(item) + "</li>").join("") + '</ol></div>' +
      sample +
      '<div class="learning-section short-response-section"><div class="learning-section-title"><strong>Your Turn</strong><span>Write now</span></div><p class="question-text">' + esc(q.text) + '</p><label class="question-answer">Your answer<textarea data-answer placeholder="Write the answer, not notes."></textarea></label></div>' +
      '<div class="learning-section"><div class="learning-section-title"><strong>Trap that costs marks</strong><span>Check</span></div><p>' + esc(q.trap) + '</p></div>' +
      '<div class="question-feedback" id="questionFeedback" hidden></div>' +
      '<div class="question-actions"><button type="button" class="secondary-action" data-feedback>Get feedback</button><button type="button" class="secondary-action" data-complete>Lock this mark</button></div>' +
      '</section>';
  }

  function onQuestionClick(event) {
    if (event.target.closest("[data-feedback]")) submitFeedback(event.target.closest("[data-feedback]"));
    if (event.target.closest("[data-complete]")) completeSession();
  }

  async function submitFeedback(button) {
    const answer = (questionStack.querySelector("[data-answer]")?.value || sessionNotes?.value || "").trim();
    const box = document.querySelector("#questionFeedback");
    if (!box) return;
    box.hidden = false;
    if (answer.split(/\s+/).filter(Boolean).length < 8) {
      box.textContent = "Write one real exam sentence first: key term + mechanism + link to the question.";
      return;
    }
    button.disabled = true;
    box.textContent = "AI coach is checking your answer...";
    try {
      const prompt = ["Mark this HSC-style practice answer.", "Subject: " + activeCard.topic, "Question: " + activeQuestion.text, "Focus point: " + activeQuestion.focus, "Common mistake to check: " + activeQuestion.trap, "Student answer: " + answer].join("\n");
      const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: prompt, subject: activeCard.topic }) });
      const data = await response.json().catch(() => ({}));
      box.textContent = data.answer || "Feedback unavailable. Check definition, mechanism, example and final link.";
    } catch (error) {
      box.textContent = "Feedback unavailable. Check definition, mechanism, example and final link.";
    } finally {
      button.disabled = false;
    }
  }

  function completeSession() {
    if (practiceWorkflow) practiceWorkflow.hidden = true;
    if (completionScreen) completionScreen.hidden = false;
    const minutes = Number(String(activeCard?.time || "12").match(/\d+/)?.[0] || 12);
    setText("#completionFeedback", "Good. Fix one sentence, then move to the next card.");
    setText("#completionMinutes", String(minutes));
    setText("#completionImpact", "High");
    setText("#completionNext", "Next card");
    saveProgress(minutes);
  }

  function closeSession() {
    clearInterval(timerId);
    if (focusOverlay) focusOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("focus-active");
    if (practiceWorkflow) practiceWorkflow.hidden = false;
    if (completionScreen) completionScreen.hidden = true;
  }

  function startTimer(raw) {
    clearInterval(timerId);
    paused = false;
    remainingSeconds = Number(String(raw || "12").match(/\d+/)?.[0] || 12) * 60;
    tick();
    timerId = setInterval(() => {
      if (!paused) remainingSeconds = Math.max(0, remainingSeconds - 1);
      tick();
      if (!remainingSeconds) clearInterval(timerId);
    }, 1000);
  }

  function tick() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    if (timerDisplay) timerDisplay.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function togglePause() {
    paused = !paused;
    if (pauseTimerButton) pauseTimerButton.textContent = paused ? "Resume" : "Pause";
  }

  function setLoading(isLoading, submit) {
    if (submit) {
      submit.disabled = isLoading;
      submit.textContent = isLoading ? "Building cards..." : "Create my mark attack cards";
    }
    if (isLoading) {
      outputLabel.textContent = "Building your mark attack cards...";
      output.innerHTML = '<div class="empty-plan loading-plan"><span class="loader-dot" aria-hidden="true"></span><strong>Building your mark attack cards...</strong><p>Choosing the fastest revision actions for your time left.</p></div>';
    }
  }

  function onChipClick(event) {
    const chip = event.target.closest(".input-chip");
    if (!chip) return;
    const input = document.querySelector(chip.dataset.target);
    if (input) input.value = chip.dataset.value || chip.textContent.trim();
  }

  function renderPaperLinks() {
    if (!paperDirectory) return;
    paperDirectory.innerHTML = paperLinks.map((item) => '<a href="' + esc(item[2]) + '" target="_blank" rel="noreferrer"><span>' + esc(item[0]) + '</span><small>' + esc(item[1]) + '</small><em>nesa.nsw.gov.au</em></a>').join("");
  }

  function renderProgress() {
    const progress = JSON.parse(localStorage.getItem("hsc-helper-progress") || "{}");
    setText("#completedTasksStat", progress.completed || 0);
    setText("#studyStreakStat", progress.completed || 0);
    setText("#focusedMinutesStat", progress.minutes || 0);
    setText("#weakTopicsStat", progress.completed || 0);
  }

  function saveProgress(minutes) {
    const progress = JSON.parse(localStorage.getItem("hsc-helper-progress") || "{}");
    progress.completed = Number(progress.completed || 0) + 1;
    progress.minutes = Number(progress.minutes || 0) + Number(minutes || 0);
    localStorage.setItem("hsc-helper-progress", JSON.stringify(progress));
    renderProgress();
  }

  function value(selector) { return document.querySelector(selector)?.value?.trim() || ""; }
  function split(raw) { return String(raw || "").split(/,|\n/).map((item) => item.trim()).filter(Boolean); }
  function setText(selector, text) { const node = document.querySelector(selector); if (node) node.textContent = text ?? ""; }
  function safeUrl(url) { const text = String(url || "").trim(); return /^https?:\/\//i.test(text) ? text : ""; }
  function esc(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"); }
})();
