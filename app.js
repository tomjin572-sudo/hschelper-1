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

const form = document.querySelector("#studySprintForm");
const subjectInput = document.querySelector("#sprintSubjectInput");
const outputLabel = document.querySelector("#sprintOutputLabel");
const output = document.querySelector("#sprintOutput");
const paperDirectory = document.querySelector("#paperDirectory");

subjectInput.innerHTML = SUBJECTS.map((subject) => `<option>${escapeHtml(subject)}</option>`).join("");
setDefaultExamDate();
renderPaperLinks();
form.addEventListener("submit", generatePlan);

async function generatePlan(event) {
  event.preventDefault();

  const details = {
    year: value("#sprintYearInput"),
    subject: value("#sprintSubjectInput"),
    examDate: value("#sprintExamDateInput"),
    planMode: value("#sprintLengthInput"),
    confidence: value("#sprintConfidenceInput"),
    topics: splitTopics(value("#sprintTopicsInput"))
  };
  details.syllabusUrl = SYLLABUS_LINKS[details.subject] || SYLLABUS_LINKS["Other NESA Stage 6 subject"];
  details.daysUntilExam = daysUntil(details.examDate);
  details.topics = details.topics.length ? details.topics : defaultTopics(details.subject);

  outputLabel.textContent = "Building your plan...";
  output.innerHTML = `<p>ChatGPT is reading the selected NESA syllabus context and turning it into a clear exam plan.</p>`;

  try {
    const answer = await askChatGpt(details);
    renderAiPlan(details, answer);
  } catch (error) {
    renderFallbackPlan(details, error.message);
  }
}

async function askChatGpt(details) {
  const lengthLabel = details.planMode === "last-night" ? "last night before exam" : `${details.planMode}-day`;
  const question = `Create a simple ${lengthLabel} HSC study plan.
Year: ${details.year}
Subject: ${details.subject}
Exam date: ${details.examDate || "not provided"}
Days until exam: ${details.daysUntilExam}
Weak topics: ${details.topics.join(", ")}
Confidence: ${details.confidence}

Use the official NESA syllabus content fetched by the backend from this URL:
${details.syllabusUrl}

Output:
Weekly Overview
Daily Study Tasks
Priority Subjects
Revision Tips
Focus Advice

Keep it simple, realistic, motivating, and specific. Include one past-paper practice suggestion.`;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question,
      year: details.year,
      subject: details.subject,
      syllabusUrl: details.syllabusUrl
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `ChatGPT failed with status ${response.status}.`);
  if (!data.answer) throw new Error("ChatGPT did not return an answer.");
  return data.answer;
}

function renderAiPlan(details, answer) {
  outputLabel.textContent = `${details.subject} plan`;
  output.innerHTML = `
    ${summary(details, "ChatGPT + NESA")}
    <section><h3>Your exam plan</h3><p class="ai-plan-text">${escapeHtml(answer)}</p></section>
    ${sourceLink(details.syllabusUrl)}
  `;
}

function renderFallbackPlan(details, note) {
  const lastNight = details.planMode === "last-night";
  const days = lastNight ? lastNightTasks(details) : studyDays(details);
  outputLabel.textContent = `${details.subject} fallback plan`;
  output.innerHTML = `
    ${summary(details, "Local fallback")}
    <section><h3>ChatGPT note</h3><p>${escapeHtml(note)}</p></section>
    <section><h3>${lastNight ? "Last night plan" : "Daily study tasks"}</h3>
      <ol>${days.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.task)}</span></li>`).join("")}</ol>
    </section>
    <section><h3>Priority topics</h3><ul>${details.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul></section>
    <section><h3>Past paper practice</h3><p>Open the official NESA past paper page, complete one question on your weakest topic, then mark it straight away.</p></section>
    ${sourceLink(details.syllabusUrl)}
  `;
}

function summary(details, mode) {
  const dateText = details.daysUntilExam >= 0 ? `${details.daysUntilExam} days until exam` : "Exam date has passed";
  return `<div class="sprint-summary"><strong>${escapeHtml(dateText)}</strong><span>${escapeHtml(details.year)}</span><span>${escapeHtml(details.confidence)} confidence</span><span>${escapeHtml(mode)}</span></div>`;
}

function studyDays(details) {
  const length = Number(details.planMode);
  const base = [
    ["Day 1: Map weak areas", "Turn the syllabus and your class notes into a short checklist. Start with your weakest topic."],
    ["Day 2: Relearn core content", "Make one-page notes, then test yourself without looking."],
    ["Day 3: Timed practice", "Complete one exam-style question and mark it with the criteria."],
    ["Day 4: Evidence bank", "Collect quotes, formulas, case studies, examples or statistics."],
    ["Day 5: Fix mistakes", "Redo questions you lost marks on and write why each mistake happened."],
    ["Day 6: Past paper set", "Complete a timed section from an official NESA paper."],
    ["Day 7: Final polish", "Review summaries, memorise key evidence, and plan exam timing."]
  ];
  return base.slice(0, length).map((item, index) => ({
    title: item[0],
    task: `${item[1]} Focus: ${details.topics[index % details.topics.length]}.`
  }));
}

function lastNightTasks(details) {
  const topic = details.topics[0];
  return [
    { title: "25 min: Core recall", task: `Write the key ideas for ${topic} from memory.` },
    { title: "35 min: Targeted practice", task: "Complete one past-paper question and mark it immediately." },
    { title: "20 min: Mistake fix", task: "Rewrite only what you got wrong. Keep a short do-not-repeat list." },
    { title: "10 min: Exam setup", task: "Pack equipment, check exam time, set alarms, and choose your first question strategy." },
    { title: "Sleep rule", task: "Stop heavy study. A rested brain is more useful than one more panicked hour." }
  ];
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

function daysUntil(dateValue) {
  if (!dateValue) return 0;
  const today = new Date();
  const target = new Date(`${dateValue}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function setDefaultExamDate() {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  document.querySelector("#sprintExamDateInput").value = nextWeek.toISOString().slice(0, 10);
}

function escapeHtml(valueToEscape) {
  return String(valueToEscape)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
