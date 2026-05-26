const SUBJECTS = [
  "English Advanced",
  "English Standard",
  "Mathematics Advanced",
  "Mathematics Standard",
  "Mathematics Extension 1",
  "Mathematics Extension 2",
  "Biology",
  "Chemistry",
  "Physics",
  "Ancient History",
  "Modern History",
  "Business Studies",
  "Economics",
  "Geography",
  "Legal Studies",
  "PDHPE",
  "Studies of Religion",
  "Visual Arts",
  "Other NESA Stage 6 subject"
];

const SYLLABUS_LINKS = {
  "English Advanced": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/english/english-advanced-stage-6-2017",
  "English Standard": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/english/english-standard-stage-6-2017",
  "Mathematics Advanced": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/mathematics/mathematics-advanced-stage-6-2017",
  "Mathematics Standard": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/mathematics/mathematics-standard-stage-6-2017",
  "Mathematics Extension 1": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/mathematics/mathematics-extension-1-stage-6-2017",
  "Mathematics Extension 2": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/mathematics/mathematics-extension-2-stage-6-2017",
  Biology: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/science/biology-stage-6-2017",
  Chemistry: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/science/chemistry-stage-6-2017",
  Physics: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/science/physics-stage-6-2017",
  "Ancient History": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/ancient-history-stage-6-2017",
  "Modern History": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/modern-history-stage-6-2017",
  "Business Studies": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/business-studies-stage-6-2010",
  Economics: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/economics-stage-6-2009",
  Geography: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/geography-stage-6-2024",
  "Legal Studies": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/legal-studies-stage-6-2009",
  PDHPE: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/pdhpe/pdhpe-stage-6-2009",
  "Studies of Religion": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/studies-of-religion-stage-6-2005",
  "Visual Arts": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/creative-arts/visual-arts-stage-6-2016",
  "Other NESA Stage 6 subject": "https://www.nsw.gov.au/education-and-training/nesa/curriculum"
};

const PAPER_LINKS = [
  ["All HSC papers", "Main NESA page for exam papers, marking guidelines and feedback.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers"],
  ["English", "Standard, Advanced, EAL/D, Extension and related courses.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=English&resource_types=Archive%2520HSC%2520exam%2520pack%2CHSC%2520exam%2520pack"],
  ["Mathematics", "Standard, Advanced, Extension 1 and Extension 2.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Mathematics&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["Science", "Biology, Chemistry, Physics and Investigating Science.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Science&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["HSIE", "History, Business Studies, Economics, Geography and Legal Studies.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Human%20Society%20and%20its%20Environment&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["PDHPE", "Personal Development, Health and Physical Education papers.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Personal%20Development%2C%20Health%20and%20Physical%20Education&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["Creative Arts", "Dance, Drama, Music, Visual Arts and related courses.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Creative%20Arts&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["Languages", "Continuers, Beginners, Extension and Literature courses.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Languages&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["TAS", "Design, Engineering, Food and Industrial Technology.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Technological%20and%20Applied%20Studies&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"],
  ["VET", "Vocational Education and Training HSC exam packs.", "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Vocational%20Education%20and%20Training&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"]
];

const NESA_PAST_PAPER_URL = "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers";

const LATEST_EXAM_PACK_LINKS = {
  "English Advanced": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/english-advanced/2024",
  "English Standard": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/english-standard/2024",
  "Mathematics Advanced": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/mathematics-advanced/2024",
  "Mathematics Standard": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/mathematics-standard/2024",
  "Mathematics Extension 1": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/mathematics-extension-1/2024",
  "Mathematics Extension 2": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/mathematics-extension-2/2024",
  Biology: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/biology/2024",
  Chemistry: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/chemistry/2024",
  Physics: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/physics/2024",
  "Ancient History": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/ancient-history/2024",
  "Modern History": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/modern-history/2024",
  "Business Studies": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/business-studies/2024",
  Economics: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/economics/2024",
  Geography: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/geography-archive/2024",
  "Legal Studies": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/legal-studies/2024",
  PDHPE: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/pdhpe/2024",
  "Studies of Religion": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/studies-of-religion-ii/2024",
  "Visual Arts": "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/visual-arts/2024"
};

const form = document.querySelector("#studySprintForm");
const submitButton = form.querySelector("button[type='submit']");
const outputLabel = document.querySelector("#sprintOutputLabel");
const output = document.querySelector("#sprintOutput");
const paperDirectory = document.querySelector("#paperDirectory");
const focusOverlay = document.querySelector("#focusOverlay");
const focusTaskTitle = document.querySelector("#focusTaskTitle");
const focusTaskText = document.querySelector("#focusTaskText");
const focusQuestionType = document.querySelector("#focusQuestionType");
const focusResourceName = document.querySelector("#focusResourceName");
const focusResourceLink = document.querySelector("#focusResourceLink");
const focusDoNow = document.querySelector("#focusDoNow");
const focusApproachList = document.querySelector("#focusApproachList");
const focusMistake = document.querySelector("#focusMistake");
const questionEngineBrief = document.querySelector("#questionEngineBrief");
const questionProgress = document.querySelector("#questionProgress");
const questionStack = document.querySelector("#questionStack");
const timerDisplay = document.querySelector("#timerDisplay");
const timerProgressCircle = document.querySelector("#timerProgressCircle");
const pauseTimerButton = document.querySelector("#pauseTimerButton");
const completeSessionButton = document.querySelector("#completeSessionButton");
const closeFocusButton = document.querySelector("#closeFocusButton");
const continueButton = document.querySelector("#continueButton");
const practiceWorkflow = document.querySelector("#practiceWorkflow");
const completionScreen = document.querySelector("#completionScreen");
const sessionNotes = document.querySelector("#sessionNotes");
const taskCheck = document.querySelector("#taskCheck");

let loadingStatusTimer = null;
let currentCards = [];
let activeSession = null;
let timerInterval = null;
let timerPaused = false;

renderProgressStats();
renderPaperLinks();
form.addEventListener("submit", generatePlan);
output.addEventListener("click", handlePlanAction);
questionStack.addEventListener("click", handleQuestionAction);
questionStack.addEventListener("input", handleQuestionInput);
document.addEventListener("click", handleInputChip);
pauseTimerButton.addEventListener("click", toggleTimer);
completeSessionButton.addEventListener("click", completeActiveSession);
closeFocusButton.addEventListener("click", closeFocusSession);
continueButton.addEventListener("click", closeFocusSession);

async function generatePlan(event) {
  event.preventDefault();

  const details = {
    subjects: splitTopics(value("#subjectsInput")),
    examDates: value("#examDatesInput"),
    topics: splitTopics(value("#weakTopicsInput")),
    studyTime: value("#studyTimeInput")
  };
  details.subjects = details.subjects.length ? details.subjects : ["English Advanced"];
  details.primarySubject = details.subjects[0];
  details.syllabusUrl = SYLLABUS_LINKS[details.primarySubject] || SYLLABUS_LINKS["Other NESA Stage 6 subject"];
  details.pastPaperUrl = LATEST_EXAM_PACK_LINKS[details.primarySubject] || NESA_PAST_PAPER_URL;
  details.topics = details.topics.length ? details.topics : defaultTopics(details.primarySubject);
  details.studyTime = details.studyTime || "1 hour after school, 2 hours on weekends";

  startLoadingState();
  output.innerHTML = `
    <div class="empty-plan loading-plan">
      <span class="loader-dot" aria-hidden="true"></span>
      <strong>Building your personalized HSC study plan...</strong>
      <p id="loadingStatus">Prioritising weak topics, exam timing and realistic workload.</p>
    </div>
  `;

  try {
    const answer = await askChatGpt(details);
    stopLoadingState();
    renderAiPlan(details, answer);
  } catch (error) {
    stopLoadingState();
    renderFriendlyError(details, error.message);
  }
}

async function askChatGpt(details) {
  const question = `Create a simple HSC study plan for a NSW Year 11 or Year 12 student.
Subjects: ${details.subjects.join(", ")}
Exam dates: ${details.examDates || "not provided"}
Weak topics: ${details.topics.join(", ")}
Available study time: ${details.studyTime}

Use the official NESA syllabus content fetched by the backend from this URL:
${details.syllabusUrl}
Use this official NESA past paper directory where useful:
${NESA_PAST_PAPER_URL}
Use this latest subject exam-pack page when the task needs a paper, marking guidelines, or feedback:
${details.pastPaperUrl}

Output:
Valid JSON only, with coachCall and 2-3 execution cards.
The first card must be called Tonight's Highest ROI Task.
Each card must include title, topic, highestRoiTask, doThisNow, questionType, resourceName, resourceUrl, timeRequired, difficulty, focusPoint, howToApproach, mostCommonMistake, whatNotToFocusOn, estimatedMarksImpact, and buttonText.
If possible, include a questions array with 3-5 objects. Each question object should include question, difficulty, estimatedTime, focusPoint, commonMistake, marksImpact, whatToIgnore, sampleAnswer.

Rules:
- Make strong strategic decisions instead of balancing everything equally
- Prioritise weak topics, closest exams, and tasks that create marks fastest
- Use active recall, timed exam-style practice, self-marking, error logs, and teacher feedback
- Avoid passive advice like "watch videos" or "review notes"
- Make every task a specific action card with time, difficulty, mistake, marks impact, and button text
- Make each card launchable as an in-app question session, not just a link
- Include 3-5 concise HSC-style practice questions when the topic is clear
- Make doThisNow start with a direct verb and include a number or time limit where possible
- For unknown exact past-paper question numbers, give the exact question type and link to the official NESA HSC exam resources page
- The button should use the subject exam-pack page if available, because it contains the paper PDF, marking guidelines, and feedback
- Do not claim the button opens one exact question unless the resourceUrl is a direct paper PDF or exact supplied question link
- Tell the student exactly what to do next
- Keep the response short, sharp, realistic, and execution-focused`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 24000);

  const response = await fetch("/api/chat", {
    method: "POST",
    signal: controller.signal,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question,
      year: "Year 11 or Year 12",
      subject: details.primarySubject,
      syllabusUrl: details.syllabusUrl,
      pastPaperUrl: details.pastPaperUrl
    })
  }).catch((error) => {
    if (error.name === "AbortError") {
      throw new Error("The plan is taking longer than expected. Try fewer subjects or weak topics.");
    }
    throw new Error("The study coach could not be reached. Check your connection and try again.");
  });
  clearTimeout(timeout);

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The study coach could not generate a plan right now.");
  if (!data.answer) throw new Error("The study coach returned an empty plan. Try again with clearer weak topics.");
  return data.answer;
}

function renderAiPlan(details, answer) {
  const plan = parseExecutionPlan(answer);
  if (plan) {
    renderExecutionPlan(details, plan);
    return;
  }

  outputLabel.textContent = "Your HSC study plan";
  output.innerHTML = `
    ${summary(details, "ChatGPT + NESA")}
    <section><h3>Your exam plan</h3><p class="ai-plan-text">${escapeHtml(answer)}</p></section>
    ${sourceLink(details.syllabusUrl)}
  `;
}

function renderExecutionPlan(details, plan) {
  currentCards = plan.cards;
  outputLabel.textContent = "Execution plan ready";
  output.innerHTML = `
    ${summary(details, "AI execution system")}
    <div class="coach-call">${escapeHtml(plan.coachCall || "Start with the highest ROI task first.")}</div>
    <div class="action-card-stack">
      ${plan.cards.map(renderActionCard).join("")}
    </div>
    ${sourceLink(details.syllabusUrl)}
  `;
}

function renderActionCard(card) {
  const resourceUrl = safeUrl(card.resourceUrl);
  const steps = Array.isArray(card.howToApproach) ? card.howToApproach.slice(0, 3) : [];
  const cardIndex = currentCards.indexOf(card);

  return `
    <article class="execution-card">
      <div class="execution-card-top">
        <span>${escapeHtml(card.title || "Highest ROI Task")}</span>
        <em>${escapeHtml(card.timeRequired || "25 minutes")} - ${escapeHtml(card.difficulty || "Medium")}</em>
      </div>
      <h3>${escapeHtml(card.topic || "Priority practice")}</h3>
      <p class="do-now">${escapeHtml(card.doThisNow || card.highestRoiTask || "Start one timed exam-style question.")}</p>
      <div class="card-grid">
        <div><strong>Highest ROI Task</strong><span>${escapeHtml(card.highestRoiTask || "")}</span></div>
        <div><strong>Question Type</strong><span>${escapeHtml(card.questionType || "Exam-style question")}</span></div>
        <div><strong>Focus Point</strong><span>${escapeHtml(card.focusPoint || "Show working clearly")}</span></div>
        <div><strong>Resource</strong><span>${resourceLink(card.resourceName, resourceUrl)}</span></div>
      </div>
      ${steps.length ? `<ol class="approach-list">${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>` : ""}
      <div class="risk-row">
        <p><strong>Most Common Mistake</strong>${escapeHtml(card.mostCommonMistake || "Rushing without checking marking criteria.")}</p>
        <p><strong>What NOT To Focus On</strong>${escapeHtml(card.whatNotToFocusOn || "Passive rereading.")}</p>
        <p><strong>Estimated Marks Impact</strong>${escapeHtml(card.estimatedMarksImpact || "High exam probability and fast feedback.")}</p>
      </div>
      <button class="action-button start-session" type="button" data-card-index="${cardIndex}">${escapeHtml(card.buttonText || "Start Practice")}</button>
    </article>
  `;
}

function handlePlanAction(event) {
  const button = event.target.closest(".start-session");
  if (!button) return;

  const card = currentCards[Number(button.dataset.cardIndex)];
  if (card) startPracticeSession(card);
}

function startPracticeSession(card) {
  const minutes = parseMinutes(card.timeRequired) || 25;
  const questions = normalizeQuestions(card);
  activeSession = {
    card,
    questions,
    questionState: questions.map(() => ({ answer: "", complete: false, feedback: "" })),
    totalSeconds: minutes * 60,
    remainingSeconds: minutes * 60,
    minutes
  };
  timerPaused = false;
  pauseTimerButton.textContent = "Pause";
  practiceWorkflow.hidden = false;
  completionScreen.hidden = true;
  sessionNotes.value = "";
  taskCheck.checked = false;

  focusTaskTitle.textContent = card.title || "Focus practice";
  focusTaskText.textContent = card.highestRoiTask || card.doThisNow || "Complete one focused practice task.";
  focusQuestionType.textContent = card.questionType || "Exam-style task";
  focusResourceName.textContent = card.resourceName || "Study resource";

  const resourceUrl = safeUrl(card.resourceUrl);
  if (resourceUrl) {
    focusResourceLink.hidden = false;
    focusResourceLink.href = resourceUrl;
  } else {
    focusResourceLink.hidden = true;
  }

  focusDoNow.textContent = card.doThisNow || card.highestRoiTask || "Start the task now.";
  focusMistake.textContent = card.mostCommonMistake || "Rushing without checking the marking criteria.";
  renderQuestionEngine();
  focusApproachList.innerHTML = (Array.isArray(card.howToApproach) ? card.howToApproach : [])
    .slice(0, 3)
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  focusOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("focus-active");
  updateTimerDisplay();
  startTimer();
}

window.startPracticeSession = startPracticeSession;

function renderQuestionEngine() {
  if (!activeSession) return;
  const questions = activeSession.questions;
  questionEngineBrief.textContent = `${questions.length} HSC-style questions generated for ${activeSession.card.topic || "your weak topic"}. Solve inside the timer, then submit for feedback.`;
  questionStack.innerHTML = questions.map(renderQuestionCard).join("");
  updateQuestionProgress();
}

function renderQuestionCard(question, index) {
  const state = activeSession.questionState[index] || {};
  return `
    <section class="question-card ${state.complete ? "is-complete" : ""}" data-question-index="${index}">
      <div class="question-topline">
        <span>Question ${index + 1}</span>
        <em>${escapeHtml(question.difficulty)} - ${escapeHtml(question.estimatedTime)}</em>
      </div>
      <p class="question-text">${escapeHtml(question.question)}</p>
      <div class="question-meta-grid">
        <div><strong>Focus</strong><span>${escapeHtml(question.focusPoint)}</span></div>
        <div><strong>Common mistake</strong><span>${escapeHtml(question.commonMistake)}</span></div>
        <div><strong>Marks impact</strong><span>${escapeHtml(question.marksImpact)}</span></div>
        <div><strong>Ignore</strong><span>${escapeHtml(question.whatToIgnore)}</span></div>
      </div>
      <label class="question-answer">
        Your answer / working
        <textarea data-question-answer="${index}" placeholder="Solve here. Include working, definitions, paragraph plan, equations or key evidence.">${escapeHtml(state.answer || "")}</textarea>
      </label>
      <div class="question-actions">
        <button type="button" class="secondary-action" data-question-complete="${index}">${state.complete ? "Completed" : "Mark Question Complete"}</button>
        <button type="button" class="secondary-action feedback-action" data-question-feedback="${index}">Submit for AI Feedback</button>
      </div>
      <div class="question-feedback" id="questionFeedback${index}" ${state.feedback ? "" : "hidden"}>${state.feedback || ""}</div>
    </section>
  `;
}

function handleQuestionInput(event) {
  const answer = event.target.closest("[data-question-answer]");
  if (!answer || !activeSession) return;
  const index = Number(answer.dataset.questionAnswer);
  activeSession.questionState[index].answer = answer.value;
  saveSessionDraft();
}

function handleQuestionAction(event) {
  const completeButton = event.target.closest("[data-question-complete]");
  const feedbackButton = event.target.closest("[data-question-feedback]");
  if (!activeSession || (!completeButton && !feedbackButton)) return;

  if (completeButton) {
    const index = Number(completeButton.dataset.questionComplete);
    activeSession.questionState[index].complete = !activeSession.questionState[index].complete;
    renderQuestionEngine();
    saveSessionDraft();
    return;
  }

  const index = Number(feedbackButton.dataset.questionFeedback);
  submitQuestionFeedback(index, feedbackButton);
}

async function submitQuestionFeedback(index, button) {
  const question = activeSession.questions[index];
  const state = activeSession.questionState[index];
  button.disabled = true;
  button.textContent = "Checking...";
  const feedbackNode = document.querySelector(`#questionFeedback${index}`);
  feedbackNode.hidden = false;
  feedbackNode.textContent = "AI coach is checking your working...";

  try {
    state.feedback = await askQuestionFeedback(activeSession.card, question, state.answer);
  } catch {
    state.feedback = localQuestionFeedback(question, state.answer);
  }

  state.complete = true;
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
  return `
    <strong>AI feedback</strong>
    <p>${escapeHtml(verdict)}</p>
    <p><b>Weak point:</b> ${escapeHtml(question.commonMistake)}</p>
    <p><b>Fix now:</b> Add one line that directly proves ${escapeHtml(question.focusPoint.toLowerCase())}.</p>
    <p><b>Next action:</b> Attempt the next question without opening notes first.</p>
  `;
}

function updateQuestionProgress() {
  if (!activeSession) return;
  const completed = activeSession.questionState.filter((item) => item.complete).length;
  questionProgress.textContent = `${completed}/${activeSession.questions.length} complete`;
}

function saveSessionDraft() {
  if (!activeSession) return;
  localStorage.setItem("hsc-helper-session-draft", JSON.stringify({
    topic: activeSession.card.topic || "",
    updatedAt: Date.now(),
    answers: activeSession.questionState
  }));
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!activeSession || timerPaused) return;
    activeSession.remainingSeconds -= 1;
    updateTimerDisplay();
    if (activeSession.remainingSeconds <= 0) {
      completeActiveSession();
    }
  }, 1000);
}

function toggleTimer() {
  timerPaused = !timerPaused;
  pauseTimerButton.textContent = timerPaused ? "Resume" : "Pause";
}

function updateTimerDisplay() {
  if (!activeSession) return;
  const remaining = Math.max(activeSession.remainingSeconds, 0);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress = 1 - remaining / activeSession.totalSeconds;
  const circumference = 326.73;
  timerProgressCircle.style.strokeDashoffset = String(circumference * (1 - progress));
}

function completeActiveSession() {
  if (!activeSession) return;
  clearInterval(timerInterval);
  activeSession.remainingSeconds = 0;
  updateTimerDisplay();

  const card = activeSession.card;
  const completedQuestions = activeSession.questionState.filter((item) => item.complete).length;
  updateStudyProgress(card, activeSession.minutes);
  practiceWorkflow.hidden = true;
  completionScreen.hidden = false;
  document.querySelector("#completionMinutes").textContent = String(activeSession.minutes);
  document.querySelector("#completionImpact").textContent = card.estimatedMarksImpact || "High";
  document.querySelector("#completionNext").textContent = nextCardTitle(card);
  document.querySelector("#completionFeedback").textContent =
    completedQuestions
      ? `Good session. You completed ${completedQuestions}/${activeSession.questions.length} questions and turned planning into real retrieval practice.`
      : "Timer finished. Complete one question or write one mistake before moving on.";
}

function closeFocusSession() {
  clearInterval(timerInterval);
  activeSession = null;
  focusOverlay.setAttribute("aria-hidden", "true");
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
  document.querySelector("#completedTasksStat").textContent = String(progress.completedTasks);
  document.querySelector("#studyStreakStat").textContent = String(progress.studyStreak);
  document.querySelector("#focusedMinutesStat").textContent = String(progress.focusedMinutes);
  document.querySelector("#weakTopicsStat").textContent = String(Object.keys(progress.weakTopics).length);
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

function nextCardTitle(card) {
  const index = currentCards.indexOf(card);
  const next = currentCards[index + 1];
  return next?.topic || "Pick the next highest ROI card";
}

function parseMinutes(valueToParse) {
  const match = String(valueToParse || "").match(/\d+/);
  return match ? Math.max(1, Math.min(Number(match[0]), 60)) : 25;
}

function handleInputChip(event) {
  const chip = event.target.closest(".input-chip");
  if (!chip) return;
  const input = document.querySelector(chip.dataset.target);
  const valueToAdd = chip.dataset.value;
  if (!input || !valueToAdd) return;

  const current = splitTopics(input.value);
  if (!current.includes(valueToAdd)) current.push(valueToAdd);
  input.value = current.join(", ");
}

function parseExecutionPlan(answer) {
  try {
    const cleaned = String(answer)
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed || !Array.isArray(parsed.cards) || !parsed.cards.length) return null;
    return {
      coachCall: parsed.coachCall || "",
      cards: parsed.cards.slice(0, 3).map(normalizeCardQuestions)
    };
  } catch {
    return null;
  }
}

function normalizeCardQuestions(card) {
  return {
    ...card,
    questions: Array.isArray(card.questions) ? card.questions.slice(0, 5) : []
  };
}

function normalizeQuestions(card) {
  const supplied = Array.isArray(card.questions) ? card.questions : [];
  const cleanSupplied = supplied
    .filter((question) => question && question.question)
    .slice(0, 5)
    .map((question, index) => ({
      question: question.question,
      difficulty: question.difficulty || card.difficulty || (index === 0 ? "Medium" : "Medium-hard"),
      estimatedTime: question.estimatedTime || estimateQuestionTime(card, index),
      focusPoint: question.focusPoint || card.focusPoint || "Show the marker your method clearly.",
      commonMistake: question.commonMistake || card.mostCommonMistake || "Rushing the final step.",
      marksImpact: question.marksImpact || card.estimatedMarksImpact || "High revision value.",
      whatToIgnore: question.whatToIgnore || card.whatNotToFocusOn || "Do not rewrite notes before attempting.",
      sampleAnswer: question.sampleAnswer || ""
    }));

  return cleanSupplied.length >= 3 ? cleanSupplied : generatePracticeQuestions(card);
}

function generatePracticeQuestions(card) {
  const topic = String(card.topic || card.highestRoiTask || "exam practice").toLowerCase();
  const subjectText = String(card.resourceName || card.questionType || card.topic || "").toLowerCase();

  if (topic.includes("quadratic") || topic.includes("algebra")) return mathsQuestions(card, topic);
  if (topic.includes("function") || topic.includes("calculus") || topic.includes("graph")) return functionsQuestions(card, topic);
  if (isEconomicsCard(topic, subjectText)) return economicsQuestions(card);
  if (topic.includes("biology") || topic.includes("enzyme") || topic.includes("cell") || subjectText.includes("biology")) return biologyQuestions(card);
  if (isEnglishCard(topic, subjectText)) return englishQuestions(card);
  return generalHscQuestions(card);
}

function isEconomicsCard(topic, subjectText) {
  const text = `${topic} ${subjectText}`;
  return /economics|inflation|globalisation|monetary|fiscal|aggregate|exchange rate|unemployment|tariff|budget|labour market|labor market|labour markets|labor markets|minimum wage|wage|employment|participation rate|underemployment|labour force|labor force|productivity|economic growth|cash rate|rba|market failure/.test(text);
}

function isEnglishCard(topic, subjectText) {
  const text = `${topic} ${subjectText}`;
  return /english|module [abc]|module a|module b|module c|common module|thesis|quote|textual|shakespeare|poem|poetry|novel|composer|audience|comparative study/.test(text);
}

function baseQuestion(card, question, index, extras = {}) {
  return {
    question,
    difficulty: extras.difficulty || card.difficulty || (index < 2 ? "Medium" : "Medium-hard"),
    estimatedTime: extras.estimatedTime || estimateQuestionTime(card, index),
    focusPoint: extras.focusPoint || card.focusPoint || "Answer exactly what the question asks.",
    commonMistake: extras.commonMistake || card.mostCommonMistake || "Giving a broad answer instead of targeted working.",
    marksImpact: extras.marksImpact || card.estimatedMarksImpact || "High because it builds exam-ready marks.",
    whatToIgnore: extras.whatToIgnore || card.whatNotToFocusOn || "Ignore neat summaries until after you have attempted the question.",
    sampleAnswer: extras.sampleAnswer || ""
  };
}

function mathsQuestions(card, topic) {
  return [
    baseQuestion(card, "Solve x^2 - 7x + 10 = 0. Show factorisation and state both solutions.", 0, {
      focusPoint: "Factorise first, then write both roots.",
      commonMistake: "Only giving one solution.",
      marksImpact: "Easy marks if the factorisation method is automatic."
    }),
    baseQuestion(card, "Solve 2x^2 + 5x - 3 = 0 using the quadratic formula. Show substitution before simplifying.", 1, {
      focusPoint: "Correct substitution into the formula.",
      commonMistake: "Sign errors in b^2 - 4ac.",
      marksImpact: "High exam probability for algebraic technique."
    }),
    baseQuestion(card, "A rectangle has area 48 cm^2 and length x + 2 cm, width x - 2 cm. Form an equation and find x.", 2, {
      difficulty: "Medium-hard",
      focusPoint: "Translate the words into a quadratic equation.",
      commonMistake: "Solving without rejecting impossible values.",
      marksImpact: "Good transfer practice for application marks."
    }),
    baseQuestion(card, "Sketch y = x^2 - 4x - 5 by finding intercepts and the turning point.", 3, {
      difficulty: "Medium-hard",
      focusPoint: "Use intercepts plus vertex, not a rough guess.",
      commonMistake: "Forgetting the y-intercept.",
      marksImpact: "Improves graph interpretation and algebra marks."
    })
  ];
}

function functionsQuestions(card) {
  return [
    baseQuestion(card, "For f(x) = 2x^2 - 3x + 1, find f(-2) and f(a + 1).", 0, {
      focusPoint: "Substitute the whole expression carefully.",
      commonMistake: "Not using brackets around a + 1.",
      marksImpact: "Fast marks from clean substitution."
    }),
    baseQuestion(card, "State the domain and range of y = sqrt(x - 3) + 2.", 1, {
      focusPoint: "Start from the restriction inside the square root.",
      commonMistake: "Mixing up domain and range.",
      marksImpact: "Common short-answer skill."
    }),
    baseQuestion(card, "Differentiate y = 3x^4 - 2x^2 + 7x - 5 and find the gradient at x = 1.", 2, {
      focusPoint: "Differentiate first, substitute second.",
      commonMistake: "Substituting before differentiating.",
      marksImpact: "High ROI because method is repeatable."
    })
  ];
}

function economicsQuestions(card) {
  return [
    baseQuestion(card, "Explain one cause of inflation and one effect on Australian households. Use one economic term accurately.", 0, {
      focusPoint: "Cause-effect chain with correct terminology.",
      commonMistake: "Listing definitions without linking to households.",
      marksImpact: "Builds short-answer precision."
    }),
    baseQuestion(card, "Write a 6-mark paragraph explaining how monetary policy can influence aggregate demand.", 1, {
      focusPoint: "Use transmission mechanism: cash rate, borrowing, spending, AD.",
      commonMistake: "Skipping the link between interest rates and spending.",
      marksImpact: "High because policy questions recur."
    }),
    baseQuestion(card, "Plan a 12-mark response: Assess the impact of globalisation on the Australian economy. Include two arguments and one statistic placeholder.", 2, {
      difficulty: "Hard",
      focusPoint: "Make a judgement, not just description.",
      commonMistake: "No final judgement or weak evidence.",
      marksImpact: "Improves extended-response structure."
    })
  ];
}

function biologyQuestions(card) {
  return [
    baseQuestion(card, "Describe how enzymes affect reaction rates and identify one factor that can denature an enzyme.", 0, {
      focusPoint: "Use active site and substrate correctly.",
      commonMistake: "Saying enzymes are used up in reactions.",
      marksImpact: "Core concept with frequent short-answer value."
    }),
    baseQuestion(card, "Explain how a named adaptation helps an organism maintain homeostasis.", 1, {
      focusPoint: "Link structure/function to stable internal conditions.",
      commonMistake: "Naming an adaptation without explaining the mechanism.",
      marksImpact: "Good syllabus-dot-point retrieval."
    }),
    baseQuestion(card, "Interpret a simple experimental result: if enzyme activity drops sharply above 45°C, explain why this happens.", 2, {
      difficulty: "Medium-hard",
      focusPoint: "Connect data trend to protein shape and active site.",
      commonMistake: "Repeating the trend without biological explanation.",
      marksImpact: "Improves data-response marks."
    })
  ];
}

function englishQuestions(card) {
  return [
    baseQuestion(card, "Write one thesis sentence that directly answers your module question. It must include a clear argument, not just the text name.", 0, {
      focusPoint: "Make a judgement in the thesis.",
      commonMistake: "Writing a topic sentence instead of an argument.",
      marksImpact: "High because thesis clarity controls the essay."
    }),
    baseQuestion(card, "Write one analytical paragraph using: topic sentence, evidence, technique, effect, link to question.", 1, {
      focusPoint: "Explain effect, do not just identify technique.",
      commonMistake: "Dropping a quote without analysis.",
      marksImpact: "Directly improves paragraph marks."
    }),
    baseQuestion(card, "Create a 4-line essay plan with two arguments and one piece of evidence for each.", 2, {
      focusPoint: "Prioritise argument sequence.",
      commonMistake: "Planning by plot instead of ideas.",
      marksImpact: "Stops rambling under timed conditions."
    })
  ];
}

function generalHscQuestions(card) {
  const topic = card.topic || "your weak topic";
  return [
    baseQuestion(card, `Define the key idea behind ${topic} in two precise sentences.`, 0, {
      focusPoint: "Use syllabus language where possible.",
      commonMistake: "Writing a vague definition.",
      marksImpact: "Builds fast recall."
    }),
    baseQuestion(card, `Answer one exam-style short response on ${topic}. Include one example and one clear link back to the question.`, 1, {
      focusPoint: "Example plus explicit link.",
      commonMistake: "Not answering the directive verb.",
      marksImpact: "Improves short-answer marks."
    }),
    baseQuestion(card, `Write a 5-minute error log for ${topic}: one mistake, why it happened, and the correction rule.`, 2, {
      focusPoint: "Turn the mistake into a rule.",
      commonMistake: "Writing what went wrong without a fix.",
      marksImpact: "Prevents repeating the same lost marks."
    })
  ];
}

function estimateQuestionTime(card, index) {
  const total = parseMinutes(card.timeRequired) || 25;
  const estimated = Math.max(4, Math.round(total / 4));
  return index === 0 ? `${estimated} min` : `${estimated + index} min`;
}

function resourceLink(name, url) {
  const label = escapeHtml(name || "NESA past papers");
  if (!url) return label;
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${label}</a>`;
}

function safeUrl(url) {
  const valueToCheck = String(url || "").trim();
  return /^https?:\/\//i.test(valueToCheck) ? valueToCheck : "";
}

function renderFallbackPlan(details, note) {
  const days = studyDays(details);
  outputLabel.textContent = "Your fallback study plan";
  output.innerHTML = `
    ${summary(details, "Local fallback")}
    <section><h3>ChatGPT note</h3><p>${escapeHtml(note)}</p></section>
    <section><h3>Daily study tasks</h3>
      <ol>${days.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.task)}</span></li>`).join("")}</ol>
    </section>
    <section><h3>Priority topics</h3><ul>${details.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul></section>
    <section><h3>Past paper practice</h3><p>Open the official NESA past paper page, complete one question on your weakest topic, then mark it straight away.</p></section>
    ${sourceLink(details.syllabusUrl)}
  `;
}

function renderFriendlyError(details, note) {
  const days = studyDays(details);
  outputLabel.textContent = "Plan fallback ready";
  output.innerHTML = `
    ${summary(details, "Offline fallback")}
    <section>
      <h3>Quick recovery plan</h3>
      <p>${escapeHtml(note)}</p>
      <p>You can still start with this smaller plan while the AI coach is busy.</p>
    </section>
    <section><h3>Next best study sessions</h3>
      <ol>${days.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.task)}</span></li>`).join("")}</ol>
    </section>
    <section><h3>Try again faster</h3><p>Use 1-2 subjects and 2-4 weak topics for the fastest response.</p></section>
  `;
}

function startLoadingState() {
  const messages = [
    "Building your personalized HSC study plan...",
    "Prioritising weak areas and closest exam dates...",
    "Turning your weak topics into timed study sessions...",
    "Adding active recall, past-paper practice and burnout protection..."
  ];
  let index = 0;
  outputLabel.textContent = messages[index];
  submitButton.disabled = true;
  submitButton.textContent = "Building plan...";
  clearInterval(loadingStatusTimer);
  loadingStatusTimer = setInterval(() => {
    index = (index + 1) % messages.length;
    outputLabel.textContent = messages[index];
    const status = document.querySelector("#loadingStatus");
    if (status) status.textContent = messages[index];
  }, 2400);
}

function stopLoadingState() {
  clearInterval(loadingStatusTimer);
  loadingStatusTimer = null;
  submitButton.disabled = false;
  submitButton.textContent = "Create my study plan";
}

function summary(details, mode) {
  return `<div class="sprint-summary"><strong>${escapeHtml(details.subjects.length)} subject${details.subjects.length === 1 ? "" : "s"}</strong><span>${escapeHtml(details.studyTime)}</span><span>${escapeHtml(mode)}</span></div>`;
}

function studyDays(details) {
  const base = [
    ["Today: Start tiny", "Pick the weakest topic and make a 10-minute checklist from class notes or the syllabus."],
    ["Next session: Relearn", "Make short notes, then test yourself without looking."],
    ["Practice block", "Complete one exam-style question and mark it with the criteria."],
    ["Fix block", "Redo the questions you lost marks on and write why each mistake happened."]
  ];
  return base.map((item, index) => ({
    title: item[0],
    task: `${item[1]} Focus: ${details.topics[index % details.topics.length]}.`
  }));
}

function renderPaperLinks() {
  paperDirectory.innerHTML = PAPER_LINKS.map(([name, description, url]) => `
    <a href="${url}" target="_blank" rel="noreferrer">
      <span>${escapeHtml(name)}</span>
      <small>${escapeHtml(description)}</small>
      <em>${new URL(url).hostname.replace("www.", "")}</em>
    </a>
  `).join("");
}

function sourceLink(url) {
  return `<section><h3>NESA syllabus source</h3><p><a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a></p></section>`;
}

function value(selector) {
  return document.querySelector(selector).value.trim();
}

function splitTopics(raw) {
  return raw.split(/\n|,/).map((topic) => topic.trim()).filter(Boolean);
}

function defaultTopics(subject) {
  if (subject.includes("English")) return ["thesis writing", "quote selection", "module ideas", "timed paragraph practice"];
  if (subject.includes("Mathematics")) return ["formula recall", "common errors", "worked examples", "timed exam questions"];
  if (["Biology", "Chemistry", "Physics"].some((name) => subject.includes(name))) return ["core concepts", "practical investigations", "data analysis", "scientific terminology"];
  return ["syllabus dot points", "class notes", "evidence/examples", "past-paper questions"];
}

function escapeHtml(valueToEscape) {
  return String(valueToEscape)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
