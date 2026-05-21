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
const outputLabel = document.querySelector("#sprintOutputLabel");
const output = document.querySelector("#sprintOutput");
const paperDirectory = document.querySelector("#paperDirectory");

renderPaperLinks();
form.addEventListener("submit", generatePlan);

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
  details.topics = details.topics.length ? details.topics : defaultTopics(details.primarySubject);
  details.studyTime = details.studyTime || "1 hour after school, 2 hours on weekends";

  outputLabel.textContent = "Creating your study plan...";
  output.innerHTML = `
    <div class="empty-plan loading-plan">
      <strong>Reading your priorities.</strong>
      <p>ChatGPT is using the selected NESA syllabus context to build a calm, realistic plan.</p>
    </div>
  `;

  try {
    const answer = await askChatGpt(details);
    renderAiPlan(details, answer);
  } catch (error) {
    renderFallbackPlan(details, error.message);
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

Output:
1. This Week's Main Focus
2. Highest Priority Subject
3. Daily Study Sessions
4. Weak Area Attack Plan
5. Burnout Prevention
6. Productivity Strategy
7. End-of-Week Goal

Rules:
- Make strong strategic decisions instead of balancing everything equally
- Prioritise weak topics and closer exams
- Use active recall, timed exam-style practice, self-marking, error logs, and teacher feedback
- Avoid passive advice like "watch videos" or "review notes"
- Make every session specific, time-boxed, and output-based
- Include breaks, procrastination management, and burnout prevention
- Use HSC-specific terminology and one past-paper practice suggestion`;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question,
      year: "Year 11 or Year 12",
      subject: details.primarySubject,
      syllabusUrl: details.syllabusUrl
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `ChatGPT failed with status ${response.status}.`);
  if (!data.answer) throw new Error("ChatGPT did not return an answer.");
  return data.answer;
}

function renderAiPlan(details, answer) {
  outputLabel.textContent = "Your HSC study plan";
  output.innerHTML = `
    ${summary(details, "ChatGPT + NESA")}
    <section><h3>Your exam plan</h3><p class="ai-plan-text">${escapeHtml(answer)}</p></section>
    ${sourceLink(details.syllabusUrl)}
  `;
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
