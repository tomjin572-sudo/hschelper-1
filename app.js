const STORAGE_KEY = "neurodesk-state-v1";
const FOCUS_LENGTH = 25 * 60;
const BREAK_LENGTH = 5 * 60;
const STAGE_6_SUBJECTS = [
  "Aboriginal Studies",
  "Agriculture",
  "Ancient History",
  "Biology",
  "Business Studies",
  "Chemistry",
  "Community and Family Studies",
  "Dance",
  "Design and Technology",
  "Drama",
  "Earth and Environmental Science",
  "Economics",
  "Engineering Studies",
  "English Advanced",
  "English EAL/D",
  "English Extension",
  "English Life Skills",
  "English Standard",
  "English Studies",
  "Food Technology",
  "Geography",
  "History Extension",
  "Industrial Technology",
  "Investigating Science",
  "Languages",
  "Legal Studies",
  "Mathematics Advanced",
  "Mathematics Extension 1",
  "Mathematics Extension 2",
  "Mathematics Life Skills",
  "Mathematics Standard",
  "Modern History",
  "Music 1",
  "Music 2",
  "Personal Development, Health and Physical Education",
  "Physics",
  "Science Extension",
  "Society and Culture",
  "Software Engineering",
  "Studies of Religion",
  "Textiles and Design",
  "Visual Arts",
  "Work and the Community Life Skills",
  "VET / Board Endorsed Course",
  "Other NESA Stage 6 subject"
];
const AI_TOOL_DIRECTORY = [
  {
    category: "Study + Homework",
    tools: [
      ["ChatGPT", "Best all-rounder for explanations, essays, coding, brainstorming", "https://chatgpt.com/"],
      ["Claude AI", "Strong for long documents and writing", "https://claude.ai/"],
      ["Google Gemini", "Useful for Google Docs and Drive users", "https://gemini.google.com/"],
      ["Perplexity AI", "Research with sources", "https://www.perplexity.ai/"],
      ["NotebookLM", "Upload PDFs/slides and ask questions", "https://notebooklm.google.com/"],
      ["SciSpace", "Understand research papers", "https://scispace.com/"],
      ["MathGPT", "Step-by-step AI math solver and calculator", "https://mathgpt.chat/"],
      ["Wolfram Alpha", "Maths and science solving", "https://www.wolframalpha.com/"]
    ]
  },
  {
    category: "Writing + Essays",
    tools: [
      ["Grammarly", "Grammar and clarity", "https://www.grammarly.com/"],
      ["QuillBot", "Paraphrasing and summarising", "https://quillbot.com/"],
      ["Hemingway Editor", "Cleaner, easier-to-read writing", "https://hemingwayapp.com/"],
      ["Turnitin AI Checker", "AI writing detection info for schools and institutions", "https://www.turnitin.com/solutions/ai-writing"],
      ["Sudowrite", "Creative writing and stories", "https://www.sudowrite.com/"]
    ]
  },
  {
    category: "Notes + Productivity",
    tools: [
      ["Notion AI", "Notes, tasks, study systems", "https://www.notion.com/product/ai"],
      ["Otter.ai", "Records and summarizes classes", "https://otter.ai/"],
      ["Fireflies AI", "Meeting and class notes", "https://fireflies.ai/"],
      ["Mem AI", "AI memory and smart notes", "https://get.mem.ai/"]
    ]
  },
  {
    category: "Presentations + Design",
    tools: [
      ["Canva AI", "Presentations, posters, social posts", "https://www.canva.com/ai/"],
      ["Gamma", "AI presentations and web pages", "https://gamma.app/"],
      ["Tome", "Storytelling presentations", "https://tome.app/"],
      ["Adobe Firefly", "AI image generation and editing", "https://firefly.adobe.com/"]
    ]
  },
  {
    category: "Coding + Building Projects",
    tools: [
      ["GitHub Copilot", "Coding assistant", "https://github.com/features/copilot"],
      ["Cursor", "AI coding IDE", "https://cursor.com/"],
      ["OpenAI Codex", "Build apps and projects from prompts", "https://openai.com/codex/"],
      ["Replit AI", "Code and deploy in browser", "https://replit.com/ai"],
      ["Bolt.new", "Generate websites and apps fast", "https://bolt.new/"],
      ["Lovable", "Build startup-style apps with prompts", "https://lovable.dev/"]
    ]
  },
  {
    category: "Video + Content Creation",
    tools: [
      ["CapCut AI", "TikTok and Reels editing", "https://www.capcut.com/"],
      ["Runway ML", "AI video generation and editing", "https://runwayml.com/"],
      ["ElevenLabs", "AI voices", "https://elevenlabs.io/"],
      ["Suno", "AI music generation", "https://suno.com/"]
    ]
  }
];
const HSC_PAPER_LINKS = [
  [
    "All HSC exam papers",
    "NESA main page for past HSC papers, marking guidelines and feedback.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers"
  ],
  [
    "Creative Arts",
    "Dance, Drama, Music, Visual Arts and related courses.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Creative%20Arts&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "English",
    "English Standard, Advanced, EAL/D, Studies, Extension and related courses.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=English&resource_types=Archive%2520HSC%2520exam%2520pack%2CHSC%2520exam%2520pack"
  ],
  [
    "HSIE",
    "Ancient History, Business Studies, Economics, Geography, Legal Studies, Modern History and more.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Human%20Society%20and%20its%20Environment&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "Languages",
    "Continuers, Beginners, Extension, Literature and background speaker courses.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Languages&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "Mathematics",
    "Mathematics Standard, Advanced, Extension 1 and Extension 2.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Mathematics&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "PDHPE",
    "Personal Development, Health and Physical Education.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Personal%20Development%2C%20Health%20and%20Physical%20Education&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "Science",
    "Biology, Chemistry, Physics, Investigating Science, Earth and Environmental Science and more.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Science&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "TAS",
    "Design and Technology, Engineering Studies, Food Technology, Industrial Technology and more.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Technological%20and%20Applied%20Studies&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "VET",
    "Vocational Education and Training HSC exam packs.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-resources?category=Vocational%20Education%20and%20Training&resource_types=HSC%2520exam%2520pack%2CArchive%2520HSC%2520exam%2520pack"
  ],
  [
    "Student exam glossary",
    "Key HSC directive terms such as analyse, evaluate, explain and justify.",
    "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers"
  ]
];

const state = loadState();
let timer = {
  mode: "focus",
  remaining: FOCUS_LENGTH,
  total: FOCUS_LENGTH,
  active: false,
  intervalId: null
};

const elements = {
  taskForm: document.querySelector("#taskForm"),
  taskInput: document.querySelector("#taskInput"),
  priorityInput: document.querySelector("#priorityInput"),
  courseInput: document.querySelector("#courseInput"),
  taskList: document.querySelector("#taskList"),
  goalForm: document.querySelector("#goalForm"),
  goalInput: document.querySelector("#goalInput"),
  goalProgressInput: document.querySelector("#goalProgressInput"),
  goalList: document.querySelector("#goalList"),
  openTaskCount: document.querySelector("#openTaskCount"),
  focusMinutes: document.querySelector("#focusMinutes"),
  goalAverage: document.querySelector("#goalAverage"),
  priorityLabel: document.querySelector("#priorityLabel"),
  focusScore: document.querySelector("#focusScore"),
  timerMode: document.querySelector("#timerMode"),
  timerTime: document.querySelector("#timerTime"),
  timerProgress: document.querySelector("#timerProgress"),
  startPauseButton: document.querySelector("#startPauseButton"),
  resetTimerButton: document.querySelector("#resetTimerButton"),
  switchModeButton: document.querySelector("#switchModeButton"),
  sortTasksButton: document.querySelector("#sortTasksButton"),
  mentorAdvice: document.querySelector("#mentorAdvice"),
  mentorStatus: document.querySelector("#mentorStatus"),
  generateAdviceButton: document.querySelector("#generateAdviceButton"),
  studySprintForm: document.querySelector("#studySprintForm"),
  sprintYearInput: document.querySelector("#sprintYearInput"),
  sprintSubjectInput: document.querySelector("#sprintSubjectInput"),
  sprintExamDateInput: document.querySelector("#sprintExamDateInput"),
  sprintLengthInput: document.querySelector("#sprintLengthInput"),
  sprintConfidenceInput: document.querySelector("#sprintConfidenceInput"),
  sprintTopicsInput: document.querySelector("#sprintTopicsInput"),
  sprintOutputLabel: document.querySelector("#sprintOutputLabel"),
  sprintOutput: document.querySelector("#sprintOutput"),
  yearInput: document.querySelector("#yearInput"),
  subjectInput: document.querySelector("#subjectInput"),
  customSubjectInput: document.querySelector("#customSubjectInput"),
  studioTaskInput: document.querySelector("#studioTaskInput"),
  studioRubricInput: document.querySelector("#studioRubricInput"),
  studioDraftInput: document.querySelector("#studioDraftInput"),
  studioOutputLabel: document.querySelector("#studioOutputLabel"),
  studioOutput: document.querySelector("#studioOutput"),
  studioSteps: document.querySelectorAll("[data-studio-step]"),
  canvasDataInput: document.querySelector("#canvasDataInput"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  chatMessages: document.querySelector("#chatMessages"),
  quickChatButtons: document.querySelectorAll("[data-chat-prompt]"),
  aiPromptInput: document.querySelector("#aiPromptInput"),
  aiToolLabel: document.querySelector("#aiToolLabel"),
  aiToolOutput: document.querySelector("#aiToolOutput"),
  aiToolButtons: document.querySelectorAll("[data-ai-tool]"),
  paperDirectory: document.querySelector("#paperDirectory"),
  toolDirectory: document.querySelector("#toolDirectory")
};

populateSubjects();
populateStudySprintSubjects();
renderPaperDirectory();
renderToolDirectory();

elements.studySprintForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateStudySprintPlan();
});

elements.studioSteps.forEach((button) => {
  button.addEventListener("click", () => {
    elements.studioSteps.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    runStudioStep(button.dataset.studioStep);
  });
});

[elements.studioTaskInput, elements.studioRubricInput, elements.studioDraftInput].forEach((input) => {
  input.addEventListener("input", () => {
    const activeStep = document.querySelector("[data-studio-step].active")?.dataset.studioStep || "intake";
    runStudioStep(activeStep);
  });
});

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = elements.taskInput.value.trim();
  if (!title) return;

  state.tasks.unshift({
    id: crypto.randomUUID(),
    title,
    priority: elements.priorityInput.value,
    course: elements.courseInput.value.trim() || "General",
    completed: false,
    createdAt: Date.now()
  });

  elements.taskForm.reset();
  elements.priorityInput.value = "medium";
  saveAndRender();
});

elements.goalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = elements.goalInput.value.trim();
  if (!title) return;

  state.goals.unshift({
    id: crypto.randomUUID(),
    title,
    progress: clamp(Number(elements.goalProgressInput.value), 0, 100)
  });

  elements.goalForm.reset();
  elements.goalProgressInput.value = 25;
  saveAndRender();
});

elements.taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-task-check]");
  if (!checkbox) return;

  const task = state.tasks.find((item) => item.id === checkbox.dataset.taskCheck);
  if (task) {
    task.completed = checkbox.checked;
    saveAndRender();
  }
});

elements.taskList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-task]");
  if (!button) return;

  state.tasks = state.tasks.filter((task) => task.id !== button.dataset.deleteTask);
  saveAndRender();
});

elements.goalList.addEventListener("input", (event) => {
  const input = event.target.closest("[data-goal-progress]");
  if (!input) return;

  const goal = state.goals.find((item) => item.id === input.dataset.goalProgress);
  if (goal) {
    goal.progress = clamp(Number(input.value), 0, 100);
    saveAndRender();
  }
});

elements.goalList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-goal]");
  if (!button) return;

  state.goals = state.goals.filter((goal) => goal.id !== button.dataset.deleteGoal);
  saveAndRender();
});

elements.sortTasksButton.addEventListener("click", () => {
  state.tasks.sort((a, b) => {
    const priorityScore = { high: 3, medium: 2, low: 1 };
    return (
      Number(a.completed) - Number(b.completed) ||
      priorityScore[b.priority] - priorityScore[a.priority] ||
      b.createdAt - a.createdAt
    );
  });
  saveAndRender();
});

elements.startPauseButton.addEventListener("click", () => {
  timer.active ? pauseTimer() : startTimer();
});

elements.resetTimerButton.addEventListener("click", () => {
  pauseTimer();
  timer.remaining = timer.total;
  renderTimer();
});

elements.switchModeButton.addEventListener("click", () => {
  pauseTimer();
  timer.mode = timer.mode === "focus" ? "break" : "focus";
  timer.total = timer.mode === "focus" ? FOCUS_LENGTH : BREAK_LENGTH;
  timer.remaining = timer.total;
  renderTimer();
});

elements.generateAdviceButton.addEventListener("click", () => {
  updateMentorAdvice(true);
});

elements.aiToolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    elements.aiToolButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    runAiTool(button.dataset.aiTool);
  });
});

elements.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitChatQuestion(elements.chatInput.value);
});

elements.quickChatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    submitChatQuestion(button.dataset.chatPrompt);
  });
});

elements.aiPromptInput.addEventListener("input", () => {
  const activeTool = document.querySelector("[data-ai-tool].active")?.dataset.aiTool || "taskBreakdown";
  runAiTool(activeTool);
});

[elements.yearInput, elements.subjectInput, elements.customSubjectInput].forEach((input) => {
  input.addEventListener("input", () => {
    const activeTool = document.querySelector("[data-ai-tool].active")?.dataset.aiTool || "taskBreakdown";
    runAiTool(activeTool);
  });
});

function startTimer() {
  timer.active = true;
  elements.startPauseButton.textContent = "Pause";
  timer.intervalId = window.setInterval(() => {
    timer.remaining -= 1;

    if (timer.remaining <= 0) {
      if (timer.mode === "focus") {
        state.focusSeconds += timer.total;
      }
      pauseTimer();
      timer.mode = timer.mode === "focus" ? "break" : "focus";
      timer.total = timer.mode === "focus" ? FOCUS_LENGTH : BREAK_LENGTH;
      timer.remaining = timer.total;
      saveAndRender();
    } else {
      renderTimer();
    }
  }, 1000);
}

function pauseTimer() {
  timer.active = false;
  elements.startPauseButton.textContent = "Start";
  window.clearInterval(timer.intervalId);
}

function render() {
  renderTasks();
  renderGoals();
  renderMetrics();
  renderTimer();
  updateMentorAdvice(false);
  saveState();
}

function renderTasks() {
  if (!state.tasks.length) {
    elements.taskList.innerHTML = `<li class="empty-state">Add your first task to activate the smart queue.</li>`;
    return;
  }

  elements.taskList.innerHTML = state.tasks.map((task) => `
    <li class="task-item ${task.completed ? "completed" : ""}">
      <input
        class="task-check"
        type="checkbox"
        aria-label="Mark ${escapeHtml(task.title)} complete"
        data-task-check="${task.id}"
        ${task.completed ? "checked" : ""}
      />
      <div>
        <span class="task-title">${escapeHtml(task.title)}</span>
        <span class="task-meta">
          <span class="chip ${task.priority}">${task.priority}</span>
          <span class="chip">${escapeHtml(task.course)}</span>
        </span>
      </div>
      <button class="delete-task" type="button" aria-label="Delete ${escapeHtml(task.title)}" data-delete-task="${task.id}">x</button>
    </li>
  `).join("");
}

function renderGoals() {
  if (!state.goals.length) {
    elements.goalList.innerHTML = `<div class="empty-state">Track a weekly outcome and adjust progress as you move.</div>`;
    return;
  }

  elements.goalList.innerHTML = state.goals.map((goal) => `
    <article class="goal-item">
      <div class="goal-top">
        <span class="goal-title">${escapeHtml(goal.title)}</span>
        <div class="goal-actions">
          <input
            type="number"
            min="0"
            max="100"
            aria-label="Progress for ${escapeHtml(goal.title)}"
            value="${goal.progress}"
            data-goal-progress="${goal.id}"
          />
          <button class="delete-goal" type="button" aria-label="Delete ${escapeHtml(goal.title)}" data-delete-goal="${goal.id}">x</button>
        </div>
      </div>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width: ${goal.progress}%"></div>
      </div>
    </article>
  `).join("");
}

function renderMetrics() {
  const openTasks = state.tasks.filter((task) => !task.completed);
  const highPriority = openTasks.find((task) => task.priority === "high") || openTasks[0];
  const goalAverage = state.goals.length
    ? Math.round(state.goals.reduce((sum, goal) => sum + Number(goal.progress), 0) / state.goals.length)
    : 0;
  const focusMinutes = Math.round(state.focusSeconds / 60);
  const flowScore = clamp(58 + Math.min(focusMinutes, 30) + Math.round(goalAverage / 6) - openTasks.length * 2, 40, 99);

  elements.openTaskCount.textContent = openTasks.length;
  elements.focusMinutes.textContent = focusMinutes;
  elements.goalAverage.textContent = `${goalAverage}%`;
  elements.priorityLabel.textContent = highPriority ? highPriority.title : "Add task";
  elements.focusScore.textContent = flowScore;
  elements.mentorStatus.textContent = highPriority
    ? `${highPriority.priority.toUpperCase()} priority: ${highPriority.title}`
    : "Ready to prioritize your next study block.";
}

function renderTimer() {
  const minutes = Math.floor(timer.remaining / 60).toString().padStart(2, "0");
  const seconds = (timer.remaining % 60).toString().padStart(2, "0");
  const offset = 590.62 * (1 - timer.remaining / timer.total);

  elements.timerTime.textContent = `${minutes}:${seconds}`;
  elements.timerMode.textContent = timer.mode === "focus" ? "Focus" : "Break";
  elements.switchModeButton.textContent = timer.mode === "focus" ? "Break" : "Focus";
  elements.timerProgress.style.strokeDashoffset = offset;
  elements.timerProgress.style.stroke = timer.mode === "focus" ? "var(--blue)" : "var(--green)";
}

function updateMentorAdvice(forceNew) {
  const openTasks = state.tasks.filter((task) => !task.completed);
  const highPriority = openTasks.find((task) => task.priority === "high") || openTasks[0];
  const lowGoal = [...state.goals].sort((a, b) => a.progress - b.progress)[0];
  const focusMinutes = Math.round(state.focusSeconds / 60);

  if (!highPriority && !lowGoal) {
    elements.mentorAdvice.textContent =
      "Add a task and a weekly goal. I will surface a sharper next action once your queue has signal.";
    return;
  }

  const advice = [
    highPriority
      ? `Start with ${highPriority.title}. Give it one clean 25-minute focus cycle before checking messages.`
      : "Your task queue is clear. Use the next focus block for review, recall, or planning.",
    lowGoal
      ? `Your weakest goal is ${lowGoal.title} at ${lowGoal.progress}%. Convert it into one tiny next action today.`
      : "Your goals are moving. Keep the streak visible by logging one progress update after each study block.",
    focusMinutes >= 50
      ? "You have banked solid focus time. A short break will protect the next session."
      : "Aim for two focused starts today. Momentum usually arrives after the first timer completes."
  ];

  elements.mentorAdvice.textContent = forceNew ? rotateAdvice(advice).join(" ") : advice.join(" ");
}

function runAiTool(tool) {
  const input = elements.aiPromptInput.value.trim();
  const cleanInput = input || "your current assignment";
  const shortInput = cleanInput.length > 96 ? `${cleanInput.slice(0, 96)}...` : cleanInput;
  const context = getAssignmentContext();
  const toolCopy = {
    taskBreakdown: {
      label: "Task Breakdown",
      output: input
        ? `${context}\n1. Identify the task verb: analyse, evaluate, explain, compare, justify, or create.\n2. Underline the content area or module in the notification.\n3. Turn the marking criteria into a checklist.\n4. Build the response in evidence paragraphs.\n5. Leave one session for editing against the criteria.\nTask focus: ${shortInput}`
        : `${context}\nPaste your assessment notification and I will break it into steps, evidence, and checkpoints.`
    },
    structureGenerator: {
      label: "Assignment Structure",
      output: input
        ? `${context}\n\nINTRODUCTION\n- Define the topic and key terms.\n- Answer the question directly in one clear thesis.\n- Preview your main arguments.\n\nBODY PARAGRAPH 1\n- Topic sentence linked to the question.\n- Evidence: quote, data, case study, example, source, method or calculation.\n- Analysis: explain how the evidence proves your point.\n- Link back to the syllabus/criteria.\n\nBODY PARAGRAPH 2\n- Second argument or factor.\n- Evidence and explanation.\n- Connect to the key verb: analyse, evaluate, explain, justify or compare.\n\nBODY PARAGRAPH 3\n- Complexity, counterpoint, limitation, second example or deeper judgement.\n- Explain why this improves your answer.\n\nCONCLUSION\n- Restate the judgement.\n- Summarise the strongest reasons.\n- Finish with the significance for the question.\n\nTask focus: ${shortInput}`
        : `${context}\nPaste the assignment question and I will create an intro, body paragraph and conclusion scaffold.`
    },
    researchHelper: {
      label: "Auto Research Helper",
      output: input
        ? `${context}\n\nResearch pack to find:\nSOURCES\n- NESA syllabus or support document\n- Class text, textbook, case study, experiment, artwork, business, legal case, historical source or scientific article\n- One credible government, university, museum, journal or official organisation source\n\nQUOTES\n- Find 2-3 short quotes that directly prove your claim.\n- Record author/source, page or URL, and date accessed.\n\nSTATISTICS\n- Find one relevant number, trend, rate, date, result or measurement.\n- Explain what it proves, not just what it says.\n\nEXAMPLES\n- Use one class example and one wider example.\n- Connect each example to the marking criteria.\n\nSearch prompts:\n- ${shortInput} NSW HSC source\n- ${shortInput} statistics Australia\n- ${shortInput} case study\n- ${shortInput} NESA syllabus`
        : `${context}\nPaste your topic and I will generate source, quote, statistic and example search targets.`
    },
    criteriaCheck: {
      label: "Criteria Check",
      output: input
        ? `${context}\nCheck your work against:\n- Directly answers the question\n- Uses syllabus language and course concepts\n- Includes specific evidence, data, examples, quotes, calculations, or case studies\n- Explains the significance of evidence\n- Matches the required format and word/time limit\n- Proofreads expression and referencing`
        : `${context}\nPaste your marking criteria or draft and I will turn it into a checklist.`
    },
    syllabusLinks: {
      label: "Syllabus Links",
      output: input
        ? `${context}\nLikely syllabus links to check:\n- Course outcomes for knowledge, understanding, skills, and communication\n- Module or topic dot points connected to the task\n- Inquiry, analysis, problem-solving, or practical skills where relevant\n- NESA glossary verbs in the question\nUse your official syllabus or teacher notification to confirm exact outcome codes.`
        : `${context}\nChoose a subject and paste the task. I will suggest which syllabus areas to verify.`
    },
    essayPlan: {
      label: "Essay / Response Plan",
      output: input
        ? `${context}\nThesis or main claim: answer the task in one sentence.\nParagraph 1: strongest argument + evidence.\nParagraph 2: second argument + evidence.\nParagraph 3: complexity, limitation, counterpoint, or deeper analysis.\nConclusion: return to the task language and final judgement.\nPrompt: ${shortInput}`
        : `${context}\nPaste the question and I will build an essay, report, or extended-response structure.`
    },
    essayFeedback: {
      label: "HSC Essay Feedback",
      output: input
        ? buildEssayFeedback(context, cleanInput)
        : `${context}\nPaste your essay, introduction, or body paragraph and I will give HSC-style feedback on thesis, structure, evidence, analysis, expression, and next edits.`
    },
    sourceCheck: {
      label: "Source Check",
      output: input
        ? `${context}\nSource quality checklist:\n- Is the source current enough for the topic?\n- Is the author, organisation, or data source credible?\n- Does it directly support your claim?\n- Have you paraphrased accurately and referenced it?\n- Can you explain why this evidence matters?`
        : `${context}\nPaste source notes or links and I will help check credibility and usefulness.`
    },
    draftFeedback: {
      label: "Draft Feedback",
      output: input
        ? `${context}\nDraft feedback:\n- Make the first sentence answer the question more directly.\n- Add one subject-specific term from the syllabus.\n- Add or strengthen evidence after each claim.\n- Explain impact, significance, or method instead of just describing.\n- Finish by linking back to the marking criteria.`
        : `${context}\nPaste a paragraph or draft and I will give assignment-focused feedback.`
    },
    humanize: {
      label: "Student Voice",
      output: input
        ? `${context}\nMore natural version: ${humanizeText(cleanInput)}\nTip: add one example from class, your experiment, prescribed text, case study, or source pack.`
        : `${context}\nPaste stiff writing and I will make it clearer while keeping it appropriate for senior assessment.`
    },
    studyQuiz: {
      label: "Syllabus Quiz",
      output: input
        ? `${context}\n1. What syllabus concept does this task assess?\n2. Which evidence would best support your answer?\n3. What does the key verb require you to do?\n4. What would move this from a mid-band response to a high-band response?\nTopic: ${shortInput}`
        : `${context}\nPaste notes or an assessment task and I will create syllabus-focused recall questions.`
    }
  };

  elements.aiToolLabel.textContent = toolCopy[tool].label;
  elements.aiToolOutput.textContent = toolCopy[tool].output;
}

function buildEssayFeedback(context, text) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasQuestionLanguage = /\b(analyse|evaluate|explain|assess|compare|discuss|justify|to what extent|how|why)\b/i.test(text);
  const hasEvidence = /"|'|\bquote\b|\bcase study\b|\bsource\b|\bdata\b|\bstatistic\b|\bexample\b|\btechnique\b/i.test(text);
  const hasLinking = /\btherefore|thus|this shows|this demonstrates|as a result|significance|impact|effect\b/i.test(text);
  const hasParagraphing = text.split(/\n\s*\n/).filter(Boolean).length > 1;

  return `${context}
HSC essay feedback:

Quick read:
- Approx. length: ${wordCount} words.
- Question focus: ${hasQuestionLanguage ? "Some task/key-verb language is visible." : "Make the question and key verb more obvious in the thesis and topic sentences."}
- Evidence: ${hasEvidence ? "There are signs of evidence/examples." : "Add specific quotes, techniques, case studies, statistics, or class examples."}
- Analysis: ${hasLinking ? "There are some linking/analysis signals." : "Add more explanation of why the evidence proves your argument."}
- Structure: ${hasParagraphing ? "Paragraphing is visible." : "Use clear paragraphs: intro, body paragraphs, conclusion."}

High-band improvement plan:
1. Thesis: answer the question directly in one sentence and include a clear judgement.
2. Topic sentences: make each paragraph prove one part of the thesis.
3. Evidence: use precise evidence, not general description.
4. Analysis: after every quote/example, explain the effect, significance, or implication.
5. Syllabus link: include 1-2 subject-specific terms from your NESA topic/module.
6. Final polish: remove vague words like "things", "good", "bad", "shows a lot", and replace them with exact academic language.

Next edit:
Rewrite your weakest body paragraph using this pattern:
Claim -> Evidence -> Technique/detail -> Analysis -> Link back to the question.`;
}

function populateSubjects() {
  elements.subjectInput.innerHTML = STAGE_6_SUBJECTS
    .map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
    .join("");
  elements.subjectInput.value = "English Advanced";
}

function populateStudySprintSubjects() {
  elements.sprintSubjectInput.innerHTML = STAGE_6_SUBJECTS
    .map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
    .join("");
  elements.sprintSubjectInput.value = "English Advanced";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  elements.sprintExamDateInput.value = tomorrow.toISOString().slice(0, 10);
}

function generateStudySprintPlan() {
  const year = elements.sprintYearInput.value;
  const subject = elements.sprintSubjectInput.value;
  const examDate = elements.sprintExamDateInput.value;
  const length = Number(elements.sprintLengthInput.value);
  const confidence = elements.sprintConfidenceInput.value;
  const topics = splitTopics(elements.sprintTopicsInput.value);
  const focusTopics = topics.length ? topics : defaultTopicsForSubject(subject);
  const todayTask = buildQuickStartTask(subject, focusTopics, confidence);
  const planDays = buildSprintDays(length, subject, focusTopics, confidence);
  const daysUntilExam = getDaysUntil(examDate);

  elements.sprintOutputLabel.textContent = `${year} ${subject} - ${length}-day sprint`;
  elements.sprintOutput.innerHTML = `
    <div class="sprint-summary">
      <strong>${daysUntilExam >= 0 ? `${daysUntilExam} day${daysUntilExam === 1 ? "" : "s"} until exam` : "Exam date is in the past"}</strong>
      <span>${confidenceLabel(confidence)} confidence</span>
    </div>

    <section>
      <h3>Today&apos;s 30-minute quick start</h3>
      <p>${escapeHtml(todayTask)}</p>
    </section>

    <section>
      <h3>Key topics to focus on</h3>
      <ul>${focusTopics.slice(0, 5).map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>
    </section>

    <section>
      <h3>${length}-day study plan</h3>
      <ol class="sprint-days">
        ${planDays.map((day) => `
          <li>
            <strong>Day ${day.day}: ${escapeHtml(day.title)}</strong>
            <span>${escapeHtml(day.task)}</span>
          </li>
        `).join("")}
      </ol>
    </section>

    <section>
      <h3>Simple explanation</h3>
      <p>${escapeHtml(buildSprintExplanation(length, confidence))}</p>
    </section>

    <section>
      <h3>Past paper practice</h3>
      <p>${escapeHtml(buildPastPaperSuggestion(subject, confidence))}</p>
    </section>
  `;
}

function splitTopics(value) {
  return value
    .split(/\n|,/)
    .map((topic) => topic.trim())
    .filter(Boolean);
}

function defaultTopicsForSubject(subject) {
  if (subject.includes("English")) {
    return ["Thesis writing", "Quote selection", "Technique analysis", "Module links", "Timed paragraph practice"];
  }
  if (subject.includes("Mathematics")) {
    return ["Formula recall", "Worked examples", "Common errors", "Calculator fluency", "Timed exam questions"];
  }
  if (["Biology", "Chemistry", "Physics", "Investigating Science"].some((science) => subject.includes(science))) {
    return ["Core concepts", "Practical investigations", "Data analysis", "Scientific terminology", "Past-paper short answers"];
  }
  if (["Ancient History", "Modern History", "Legal Studies", "Business Studies", "Economics", "Geography"].some((hsie) => subject.includes(hsie))) {
    return ["Key syllabus terms", "Case studies", "Evidence bank", "Short-answer structure", "Extended response plan"];
  }
  return ["Syllabus dot points", "Class notes", "Evidence/examples", "Weak areas", "Past-paper questions"];
}

function buildQuickStartTask(subject, topics, confidence) {
  const firstTopic = topics[0] || "your weakest topic";
  if (confidence === "low") {
    return `Spend 10 minutes rewriting the basics for ${firstTopic}, 10 minutes making 5 recall questions, then 10 minutes answering one easy ${subject} question without notes.`;
  }
  if (confidence === "high") {
    return `Choose one timed past-paper question on ${firstTopic}. Spend 20 minutes answering it, then 10 minutes marking it against the criteria or sample answer.`;
  }
  return `Review ${firstTopic} for 10 minutes, write a one-page summary for 10 minutes, then complete one exam-style question for 10 minutes.`;
}

function buildSprintDays(length, subject, topics, confidence) {
  const cycle = [
    ["Map weak areas", "Create a checklist from your syllabus, class notes and last feedback."],
    ["Relearn core content", "Make short notes for the hardest topic, then test yourself without looking."],
    ["Practise exam response", "Attempt one timed question and mark it with a different colour."],
    ["Build evidence bank", "Collect quotes, formulas, case studies, examples or statistics for the main topics."],
    ["Fix mistakes", "Redo the questions you got wrong and write the reason for each mistake."],
    ["Timed set", "Complete a mini past-paper set under timed conditions."],
    ["Final polish", "Review summaries, memorise key evidence and plan your exam timing."]
  ];

  return Array.from({ length }, (_, index) => {
    const topic = topics[index % topics.length] || subject;
    const item = cycle[index % cycle.length];
    const confidenceTail =
      confidence === "low"
        ? " Keep it simple and aim for accuracy first."
        : confidence === "high"
          ? " Push for speed, precision and marking-criteria language."
          : " Balance content review with exam practice.";

    return {
      day: index + 1,
      title: item[0],
      task: `${item[1]} Focus topic: ${topic}.${confidenceTail}`
    };
  });
}

function buildSprintExplanation(length, confidence) {
  const base = `This plan uses a short ${length}-day loop: understand the content, practise under exam conditions, then fix mistakes.`;
  if (confidence === "low") {
    return `${base} Because your confidence is low, the plan starts with basics and recall before timed work.`;
  }
  if (confidence === "high") {
    return `${base} Because your confidence is high, the plan puts more pressure on timing, precision and high-band wording.`;
  }
  return `${base} Because your confidence is medium, the plan mixes revision and exam practice each day.`;
}

function buildPastPaperSuggestion(subject, confidence) {
  const questionType = confidence === "low" ? "one short, accessible question" : confidence === "high" ? "a timed extended-response or full section" : "one medium-length question";
  if (subject.includes("English")) {
    return `Use a NESA English paper or trial-style question. Start with ${questionType}, then annotate where your thesis, evidence and analysis could be sharper.`;
  }
  if (subject.includes("Mathematics")) {
    return `Use a NESA Mathematics paper. Complete ${questionType}, mark every lost mark, and write the exact skill you need to revise.`;
  }
  if (["Biology", "Chemistry", "Physics", "Investigating Science"].some((science) => subject.includes(science))) {
    return `Use a NESA Science paper. Complete ${questionType}, then check if your answer uses correct terminology, units, data and reasoning.`;
  }
  return `Use the NESA past paper section for ${subject}. Complete ${questionType}, then turn mistakes into tomorrow's first revision task.`;
}

function getDaysUntil(dateValue) {
  if (!dateValue) return 0;
  const today = new Date();
  const target = new Date(`${dateValue}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86_400_000);
}

function confidenceLabel(value) {
  return value === "low" ? "Low" : value === "high" ? "High" : "Medium";
}

function renderToolDirectory() {
  elements.toolDirectory.innerHTML = AI_TOOL_DIRECTORY.map((group) => `
    <article class="directory-group">
      <h3>${escapeHtml(group.category)}</h3>
      <div class="directory-links">
        ${group.tools.map(([name, description, url]) => `
          <a href="${url}">
            <span>${escapeHtml(name)}</span>
            <small>${escapeHtml(description)}</small>
            <em>${escapeHtml(getDomain(url))}</em>
          </a>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderPaperDirectory() {
  elements.paperDirectory.innerHTML = HSC_PAPER_LINKS.map(([name, description, url]) => `
    <a href="${url}">
      <span>${escapeHtml(name)}</span>
      <small>${escapeHtml(description)}</small>
      <em>${escapeHtml(getDomain(url))}</em>
    </a>
  `).join("");
}

function runStudioStep(step) {
  const context = getAssignmentContext();
  const task = elements.studioTaskInput.value.trim();
  const rubric = elements.studioRubricInput.value.trim();
  const draft = elements.studioDraftInput.value.trim();
  const taskPreview = previewText(task, "No task pasted yet.");
  const rubricPreview = previewText(rubric, "No rubric pasted yet.");
  const draftPreview = previewText(draft, "No draft pasted yet.");
  const steps = {
    intake: {
      label: "Upload task",
      output: `${context}\nTask intake:\n- Subject and year: ${context}\n- Task signal: ${taskPreview}\n- Missing info to add: due date, word count, format, task verb, topic/module and submission rules.\n- Next action: paste the rubric or marking criteria.`
    },
    rubric: {
      label: "Read rubric",
      output: `${context}\nRubric reader:\n- Criteria signal: ${rubricPreview}\n- Turn each criterion into a checkbox.\n- Highlight the top-band language.\n- Match each criterion to evidence you need.\n- Next action: generate the response structure.`
    },
    structure: {
      label: "Generate structure",
      output: `${context}\nStructure:\nINTRO: define the topic, answer the question, preview arguments.\nBODY 1: strongest claim + evidence + analysis + link to rubric.\nBODY 2: second claim + evidence + analysis + link to syllabus.\nBODY 3: complexity, counterpoint, comparison or deeper judgement.\nCONCLUSION: final judgement + why it matters.\n\nTask: ${taskPreview}`
    },
    checklist: {
      label: "Create checklist",
      output: `${context}\nSubmission checklist:\n[ ] Directly answers the task question\n[ ] Uses the correct NESA/course language\n[ ] Uses evidence in every body paragraph\n[ ] Explains evidence instead of dropping it in\n[ ] Meets word count, format and due-date requirements\n[ ] References sources correctly\n[ ] Proofread for clarity and sentence control\n\nRubric: ${rubricPreview}`
    },
    paragraphs: {
      label: "Paragraph coach",
      output: `${context}\nParagraph coach:\nDraft signal: ${draftPreview}\n\nUse this paragraph pattern:\n1. Topic sentence: answer one part of the question.\n2. Evidence: quote, statistic, source, example, case study or calculation.\n3. Explanation: show how the evidence proves the point.\n4. Link: connect to criteria, syllabus or judgement.\n\nNext: paste one paragraph and improve it line-by-line.`
    },
    final: {
      label: "Final submission check",
      output: `${context}\nFinal check:\n- Task answered: ${task ? "Ready to check against task." : "Paste the task first."}\n- Rubric matched: ${rubric ? "Ready to check against criteria." : "Paste the rubric first."}\n- Draft present: ${draft ? "Draft ready for final review." : "Paste your draft first."}\n\nBefore submitting:\n[ ] Read the question one last time\n[ ] Check all paragraphs link back to the task\n[ ] Verify references and formatting\n[ ] Remove vague sentences\n[ ] Confirm file name and submission format`
    }
  };

  elements.studioOutputLabel.textContent = steps[step].label;
  elements.studioOutput.textContent = steps[step].output;
}

function previewText(text, fallback) {
  if (!text) return fallback;
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 130 ? `${clean.slice(0, 130)}...` : clean;
}

function addChatMessage(type, label, text) {
  const message = document.createElement("article");
  message.className = `chat-message ${type}`;
  message.innerHTML = `<strong>${escapeHtml(label)}</strong><p>${escapeHtml(text)}</p>`;
  elements.chatMessages.appendChild(message);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return message;
}

async function submitChatQuestion(rawQuestion) {
  const question = rawQuestion.trim();
  if (!question) return;

  elements.chatInput.value = "";
  addChatMessage("user", "You", question);
  const assistantMessage = addChatMessage("assistant", "HSC Helper", "Thinking...");

  try {
    const answer = await getChatGptAnswer(question);
    assistantMessage.querySelector("p").textContent = answer;
  } catch (error) {
    assistantMessage.querySelector("p").textContent = `${buildChatAnswer(question)}\n\nChatGPT setup note: ${error.message}`;
  }
}

async function getChatGptAnswer(question) {
  const payload = {
    question,
    year: elements.yearInput.value,
    subject: elements.customSubjectInput.value.trim() || elements.subjectInput.value,
    canvasData: elements.canvasDataInput.value.trim(),
    assignmentTask: elements.studioTaskInput.value.trim() || elements.aiPromptInput.value.trim(),
    rubric: elements.studioRubricInput.value.trim(),
    draft: elements.studioDraftInput.value.trim()
  };
  const endpoints = ["/api/chat", "/.netlify/functions/chat"];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      return await requestChatEndpoint(endpoint, payload);
    } catch (error) {
      lastError = error;
      if (!String(error.message).includes("status 404")) {
        break;
      }
    }
  }

  throw lastError || new Error("ChatGPT API request failed.");
}

async function requestChatEndpoint(endpoint, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  const response = await fetch(endpoint, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  }).catch((error) => {
    if (error.name === "AbortError") {
      throw new Error("The ChatGPT request timed out. Check your Netlify function logs and try again.");
    }
    throw new Error(`The ChatGPT server could not be reached at ${endpoint}. Make sure the Netlify Function deployed correctly.`);
  });

  clearTimeout(timeout);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        `ChatGPT API request failed with status ${response.status} at ${endpoint}. Check that the Netlify Function deployed.`
    );
  }

  if (!data.answer) {
    throw new Error("No answer returned.");
  }
  return data.answer;
}

function buildChatAnswer(question) {
  const context = getAssignmentContext();
  const canvasData = elements.canvasDataInput.value.trim();
  const sourceStatus = canvasData
    ? `I found pasted Canvas lesson data to use as your class source.`
    : `No Canvas lesson data is pasted yet, so I am using your selected subject, NSW Stage 6 structure, and NESA past-paper links.`;
  const questionLower = question.toLowerCase();

  if (questionLower.includes("essay") || questionLower.includes("extended response")) {
    return `${context}\n${sourceStatus}\n\nEssay structure:\n1. Write a direct thesis that answers the question.\n2. Use syllabus language and the key verb.\n3. Build 2-3 body paragraphs with evidence from class notes, texts, data, case studies or sources.\n4. Explain how each piece of evidence proves the argument.\n5. Finish by linking back to the marking criteria.\n\nBest next step: paste your draft or marking criteria and ask me to check it.`;
  }

  if (questionLower.includes("past paper") || questionLower.includes("exam")) {
    return `${context}\nUse the Past Papers section for official NESA exam packs and marking guidelines.\n\nHow to study with them:\n1. Pick one recent paper for your subject area.\n2. Attempt one question under timed conditions.\n3. Compare your answer to the marking guidelines.\n4. Turn the gaps into tasks in the dashboard.\n5. Ask me to convert a question into a plan or checklist.`;
  }

  if (questionLower.includes("syllabus") || questionLower.includes("outcome")) {
    return `${context}\nFor exact outcome codes, check the official NESA syllabus for your course. I can help translate the syllabus into plain English once you paste the relevant section.\n\nWhat to look for:\n- Knowledge and understanding outcomes\n- Skills outcomes\n- Module or topic dot points\n- Directive verbs like analyse, evaluate, explain or justify\n- Assessment criteria from your teacher`;
  }

  if (questionLower.includes("canvas") || questionLower.includes("lesson")) {
    return `${context}\n${sourceStatus}\n\nIf you paste Canvas lesson text, I can:\n- Summarise the lesson\n- Extract key syllabus concepts\n- Make flashcards\n- Build a study checklist\n- Connect lesson notes to an assignment question\n\nCurrent lesson signal: ${canvasData ? summarizeSource(canvasData) : "Paste your Canvas lesson content in the left box first."}`;
  }

  return `${context}\n${sourceStatus}\n\nHere is a strong way to approach it:\n1. Identify the subject, topic/module and key verb.\n2. Decide what the marker is asking you to prove, solve or create.\n3. Pull evidence from class notes, NESA syllabus language and past-paper marking guidelines.\n4. Draft a clear response, then check it against criteria.\n\nQuestion focus: ${question}`;
}

function summarizeSource(text) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed.length > 180 ? `${trimmed.slice(0, 180)}...` : trimmed;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getAssignmentContext() {
  const custom = elements.customSubjectInput.value.trim();
  const subject = custom || elements.subjectInput.value;
  return `${elements.yearInput.value} NSW Stage 6 - ${subject}`;
}

function rotateAdvice(items) {
  return items.slice(1).concat(items[0]);
}

function humanizeText(text) {
  const sentence = text
    .replace(/\butilize\b/gi, "use")
    .replace(/\bfurthermore\b/gi, "also")
    .replace(/\bin conclusion\b/gi, "overall")
    .replace(/\btherefore\b/gi, "so")
    .replace(/\bdemonstrates\b/gi, "shows");
  return sentence.length > 150 ? `${sentence.slice(0, 150)}...` : sentence;
}

function scoreClarity(text) {
  const averageWordLength = text.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean).join("").length / Math.max(text.split(/\s+/).filter(Boolean).length, 1);
  return averageWordLength > 6 ? "Medium - simplify long words and split dense sentences." : "Strong - the wording is easy to scan.";
}

function scoreHumanTone(text) {
  const formalWords = ["utilize", "moreover", "therefore", "hence", "overall", "significant", "demonstrates"];
  const matches = formalWords.filter((word) => text.toLowerCase().includes(word)).length;
  return matches > 2 ? "Medium - reduce formal filler and add a specific class example." : "Strong - the tone feels direct and natural.";
}

function needsEvidence(text) {
  const hasEvidenceCue = /\b(because|for example|according to|data|quote|study|source|evidence)\b/i.test(text);
  return hasEvidenceCue ? "Low - it includes evidence language." : "High - add one source, example, or reason.";
}

function saveAndRender() {
  saveState();
  render();
}

function loadState() {
  const fallback = {
    focusSeconds: 0,
    tasks: [
      {
        id: crypto.randomUUID(),
        title: "Review AI ethics lecture notes",
        priority: "high",
        course: "Computer Science",
        completed: false,
        createdAt: Date.now() - 3000
      },
      {
        id: crypto.randomUUID(),
        title: "Draft thesis outline",
        priority: "medium",
        course: "Writing",
        completed: false,
        createdAt: Date.now() - 2000
      },
      {
        id: crypto.randomUUID(),
        title: "Upload lab reflection",
        priority: "low",
        course: "Biology",
        completed: true,
        createdAt: Date.now() - 1000
      }
    ],
    goals: [
      { id: crypto.randomUUID(), title: "Complete exam prep sprint", progress: 64 },
      { id: crypto.randomUUID(), title: "Publish portfolio case study", progress: 38 }
    ]
  };

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
