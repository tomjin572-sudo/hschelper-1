(() => {
  const SECTION_ID = "tomorrow-cheat-sheet";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    if (document.querySelector(`#${SECTION_ID}`)) return;
    const planner = document.querySelector("#study-sprint");
    const papers = document.querySelector("#past-papers");
    const main = document.querySelector("main");
    if (!main) return;

    addNavLink();

    const section = document.createElement("section");
    section.className = "tomorrow-cheat panel";
    section.id = SECTION_ID;
    section.innerHTML = `
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Exam tomorrow</p>
          <h2>Tomorrow Cheat Sheet</h2>
        </div>
        <span class="mode-pill">Exam survival mode</span>
      </div>
      <p class="section-copy">A compact last-night revision sheet: what to revise, what to ignore, common traps, and the practice to start inside HSC Helper.</p>
      <div class="cheat-builder">
        <form class="cheat-form" id="cheatSheetForm">
          <label>Subject<input id="cheatSubjectInput" type="text" placeholder="Economics, Maths Advanced, English Advanced, Biology" /></label>
          <label>Exam date<input id="cheatExamDateInput" type="text" placeholder="Tomorrow, Friday, 28 May" /></label>
          <label>Exam topics<input id="cheatTopicsInput" type="text" placeholder="Labour markets, unemployment, wage determination" /></label>
          <label>Weakest areas<input id="cheatWeakAreasInput" type="text" placeholder="Cause/effect chains, diagrams, definitions, calculations" /></label>
          <label>Available study time tonight<input id="cheatStudyTimeInput" type="text" placeholder="45 minutes, 90 minutes, 2 hours" /></label>
          <label class="cheat-notes">Optional class content<textarea id="cheatNotesInput" placeholder="Paste assessment notice, syllabus points, teacher notes, or class reminders here..."></textarea></label>
          <button class="primary-cta" type="submit">Generate Tomorrow Cheat Sheet</button>
        </form>
        <article class="cheat-output-wrap" aria-live="polite">
          <span id="cheatSheetStatus">Your printable survival sheet will appear here</span>
          <div id="cheatSheetOutput">
            <div class="empty-plan">
              <strong>Built for the night before.</strong>
              <p>Enter the exam details and HSC Helper will turn them into a focused revision order, must-know content, and a practice session.</p>
            </div>
          </div>
        </article>
      </div>
    `;

    if (papers) papers.before(section);
    else if (planner) planner.after(section);
    else main.appendChild(section);

    section.querySelector("#cheatSheetForm").addEventListener("submit", (event) => {
      event.preventDefault();
      renderSheet();
    });
    section.addEventListener("click", handleClick);
    addStyles();
  }

  function addNavLink() {
    const nav = document.querySelector("nav");
    if (!nav || nav.querySelector(`a[href="#${SECTION_ID}"]`)) return;
    const link = document.createElement("a");
    link.href = `#${SECTION_ID}`;
    link.textContent = "Cheat Sheet";
    nav.insertBefore(link, nav.querySelector('a[href="#past-papers"]') || null);
  }

  function renderSheet() {
    const subject = val("#cheatSubjectInput") || "HSC subject";
    const examDate = val("#cheatExamDateInput") || "tomorrow";
    const topics = val("#cheatTopicsInput") || "your weakest exam topics";
    const weak = val("#cheatWeakAreasInput") || "the areas losing the most marks";
    const time = val("#cheatStudyTimeInput") || "90 minutes";
    const notes = val("#cheatNotesInput");
    const profile = getProfile(subject, topics, weak, notes);
    const questions = getQuestions(profile, topics, weak);
    const output = document.querySelector("#cheatSheetOutput");
    const status = document.querySelector("#cheatSheetStatus");

    if (status) status.textContent = `${profile.name} cheat sheet for ${examDate}`;
    if (!output) return;

    output.innerHTML = `
      <article class="cheat-sheet-result">
        <div class="cheat-print-head">
          <div>
            <p class="eyebrow">Tomorrow Cheat Sheet</p>
            <h3>${esc(profile.name)}: ${esc(topics)}</h3>
            <p>Exam: ${esc(examDate)} | Tonight: ${esc(time)}</p>
          </div>
          <div class="cheat-actions">
            <button type="button" data-copy-sheet>Download PDF</button>
            <button type="button" data-copy-text>Copy Text</button>
            <button type="button" data-start-sheet>Start Revision From This Sheet</button>
          </div>
        </div>
        ${card("Strategy", profile.strategy(topics, weak, time))}
        ${list("Must Know", profile.mustKnow(topics))}
        ${list("High-Probability Questions", questions)}
        ${list("Common Mistakes", profile.mistakes(weak))}
        ${card("How To Answer", profile.answer(topics))}
        ${list("Tonight's Revision Order", revisionOrder(time))}
        <section class="cheat-card practice-now">
          <strong>Practice Inside HSC Helper</strong>
          <div class="cheat-practice-grid">
            ${practiceButton("Start Practice Session", profile.start(topics, weak))}
            ${practiceButton("Test Me On This", `Answer 3 short exam-style questions on ${topics}.`)}
            ${practiceButton("Generate Questions", `Generate 2 warm-up, 3 core, and 1 challenge question for ${topics}.`)}
            ${practiceButton("Fix My Weakest Topic", `Repair this weakness first: ${weak}.`)}
          </div>
        </section>
        ${list("Final 10-Minute Review", profile.final(topics, weak))}
      </article>
    `;
  }

  function handleClick(event) {
    const copy = event.target.closest("[data-copy-sheet]");
    if (copy) {
      downloadPdfSheet();
      return;
    }
    const copyText = event.target.closest("[data-copy-text]");
    if (copyText) {
      copySheetText();
      return;
    }
    const start = event.target.closest("[data-start-sheet], [data-cheat-practice]");
    if (start) startRevision(start.dataset.cheatPractice || "");
  }

  function startRevision(customTask) {
    const subject = val("#cheatSubjectInput") || "HSC";
    const topics = val("#cheatTopicsInput") || "exam topics";
    const weak = val("#cheatWeakAreasInput") || "weakest area";
    const profile = getProfile(subject, topics, weak, val("#cheatNotesInput"));
    const questions = getQuestions(profile, topics, weak).slice(0, 5);
    const overlay = document.querySelector("#focusOverlay");
    if (!overlay) return;

    setText("#focusTaskTitle", `${profile.name} revision sprint`);
    setText("#focusTaskText", customTask || profile.start(topics, weak));
    setText("#focusQuestionType", "AI-generated HSC-style practice");
    setText("#focusResourceName", "Tomorrow Cheat Sheet");
    setText("#focusDoNow", profile.start(topics, weak));
    setText("#focusMistake", profile.mistakes(weak)[0]);
    setText("#questionEngineBrief", `Complete these now. Focus on ${weak}.`);

    const resource = document.querySelector("#focusResourceLink");
    if (resource) {
      resource.href = `#${SECTION_ID}`;
      resource.textContent = "Open cheat sheet";
    }

    const approach = document.querySelector("#focusApproachList");
    if (approach) approach.innerHTML = profile.steps.map((step) => `<li>${esc(step)}</li>`).join("");

    const stack = document.querySelector("#questionStack");
    if (stack) {
      stack.innerHTML = questions.map((question, index) => {
        const level = index < 2 ? "Warm-up" : index === questions.length - 1 ? "Challenge" : "Core";
        const mins = index < 2 ? 4 : 7;
        return `
          <article class="question-card">
            <div class="question-topline"><span>Question ${index + 1}</span><span>${level} - ${mins} min</span></div>
            <p class="question-text">${esc(question)}</p>
            <div class="question-meta-grid">
              <div><strong>Focus</strong><span>${esc(profile.focus)}</span></div>
              <div><strong>Common mistake</strong><span>${esc(profile.mistakes(weak)[0])}</span></div>
              <div><strong>Marks impact</strong><span>High if corrected tonight</span></div>
              <div><strong>Ignore</strong><span>${esc(profile.ignore)}</span></div>
            </div>
            <label>Your answer / working<textarea data-question-answer="${index}" placeholder="Write the attempt here, then submit for feedback..."></textarea></label>
            <div class="question-actions">
              <button type="button" data-question-complete>Completed</button>
              <button type="button" data-question-feedback>Submit for AI Feedback</button>
            </div>
          </article>
        `;
      }).join("");
      setText("#questionProgress", `0/${questions.length} complete`);
    }

    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("focus-active");
  }

  function getProfile(subject, topics, weak, notes) {
    const text = `${subject} ${topics} ${weak} ${notes || ""}`.toLowerCase();
    if (/economics|labou?r|unemployment|inflation|monetary|fiscal|wage|market failure|exchange rate/.test(text)) return economics();
    if (/math|quadratic|calculus|function|trig|algebra|probability|derivative|integral/.test(text)) return maths();
    if (/english|module|essay|thesis|quote|textual|paragraph|hamlet|common module/.test(text)) return english();
    if (/biology|science|chemistry|physics|cells|genetics|disease|homeostasis|evolution|ecosystem/.test(text)) return science();
    return general();
  }

  function economics() {
    return {
      name: "Economics",
      focus: "definition, cause-effect chain, example/data, judgement",
      ignore: "long background history or unsupported opinions",
      steps: ["Define the key term", "Build the cause-effect chain", "Add one data/example placeholder", "Finish with a judgement"],
      strategy: (topics, weak, time) => `Tonight is not for rewriting notes. Spend ${time} turning ${topics} into cause-effect chains, one diagram or example, and timed paragraphs. Prioritise ${weak} because Economics marks come from clear mechanisms, not memory dumps.`,
      mustKnow: (topics) => [`Definitions for ${topics}`, "Cause -> mechanism -> impact -> judgement chain", "One data/example placeholder: [unemployment rate], [inflation rate], [cash rate], [GDP growth], [minimum wage]", "Short response: define, explain, apply, judge", "Extended response: issue, chain, policy/example, effect, limitation, judgement"],
      mistakes: (weak) => ["Listing effects without explaining the economic mechanism.", "Using statistics without linking them to the argument.", `Over-explaining theory while avoiding the weak area: ${weak}.`, "Forgetting a judgement sentence in extended responses."],
      answer: (topics) => `For ${topics}, start with a precise definition, then write a 4-link chain. Example: cause changes incentive/condition -> behaviour changes -> market outcome changes -> macro/micro impact. Add one statistic or policy example, then finish with a judgement about size, time lag, or trade-off.`,
      start: (topics, weak) => `Write one timed 6-mark Economics paragraph on ${topics}. Include a definition, a 4-link chain, one example/data placeholder, and a judgement. Main weakness to fix: ${weak}.`,
      final: (topics, weak) => [`Say the definition for ${topics} out loud.`, "Write one cause-effect chain from memory.", "List one data/example placeholder you can use tomorrow.", `Check the one mistake you keep making: ${weak}.`, "Sleep after the recall check. Do not start a new topic."]
    };
  }

  function maths() {
    return {
      name: "Mathematics",
      focus: "method, working, checking, final answer",
      ignore: "copying solutions before attempting",
      steps: ["Identify the question type", "Write the formula or first method line", "Solve with full working", "Check by substitution or reasonableness"],
      strategy: (topics, weak, time) => `Use ${time} for timed attempts, not passive revision. For ${topics}, do a small set, mark immediately, then redo the questions affected by ${weak}. Easy marks come from clean method and fewer careless errors.`,
      mustKnow: (topics) => [`Core formulas and methods for ${topics}`, "First line setup for each question type", "Domain/range or units where relevant", "Checking strategy: substitute, estimate, or compare with graph", "Error rule: circle sign changes and final answer"],
      mistakes: (weak) => ["Skipping working and losing method marks.", "Sign errors during substitution or expansion.", `Repeating the same weak process: ${weak}.`, "Not checking whether the answer makes sense."],
      answer: (topics) => `For ${topics}, write the method line first. Then solve slowly enough that every algebra move is visible. Finish by checking the final answer against the original question.`,
      start: (topics, weak) => `Complete 5 HSC-style ${topics} questions in 25 minutes. Show full working and mark the exact line where ${weak} usually happens.`,
      final: (topics, weak) => [`Write the formulas/methods for ${topics} from memory.`, "Redo one question you previously got wrong.", "Check sign errors, units, domains, and final answers.", `Write one rule to prevent ${weak}.`, "Stop when accuracy drops."]
    };
  }

  function english() {
    return {
      name: "English",
      focus: "thesis, evidence, analysis, judgement",
      ignore: "memorising whole essays word-for-word",
      steps: ["Decide the argument", "Choose one quote", "Explain technique and meaning", "Link to the question"],
      strategy: (topics, weak, time) => `Tonight is for flexible paragraphs. Use ${time} to sharpen thesis, evidence, and analysis for ${topics}. Prioritise ${weak}; HSC English rewards control of argument, not memorised decoration.`,
      mustKnow: (topics) => [`One adaptable thesis for ${topics}`, "3-4 strong pieces of evidence", "Technique -> meaning -> effect -> question link", "Paragraph frame: judgement, evidence, analysis, link", "One sentence that shows conceptual understanding"],
      mistakes: (weak) => ["Retelling the text instead of analysing it.", "Dropping quotes without explaining the technique/effect.", `Avoiding the weak skill: ${weak}.`, "Writing a thesis that does not answer the question."],
      answer: (topics) => `For ${topics}, write a thesis that makes a clear judgement. Each paragraph should prove one part of that judgement with evidence, technique analysis, and a final sentence that links directly to the question.`,
      start: (topics, weak) => `Write one timed body paragraph for ${topics}. Include a sharp topic sentence, one quote, technique analysis, and a final link. Fix this weakness: ${weak}.`,
      final: (topics, weak) => ["Say your thesis in one sentence.", "Recall 3 pieces of evidence without notes.", "Write one analysis sentence from memory.", `Check your weak point: ${weak}.`, "Do not memorise a full essay now."]
    };
  }

  function science() {
    return {
      name: "Biology / Science",
      focus: "process, terminology, sequence, marking words",
      ignore: "beautiful diagrams without labelled logic",
      steps: ["Name the process", "Explain the sequence", "Use precise terms", "Link to the question verb"],
      strategy: (topics, weak, time) => `Use ${time} to practise recall and short answers for ${topics}. Prioritise ${weak}; science marks are lost when the process is out of order or terminology is too loose.`,
      mustKnow: (topics) => [`Key terms for ${topics}`, "Process sequence in correct order", "One diagram/process map if relevant", "Verb rules: identify, outline, explain, compare, assess", "Short answer pattern: term, process, effect, example"],
      mistakes: (weak) => ["Using vague everyday language instead of scientific terminology.", "Explaining steps in the wrong order.", `Skipping the weak process: ${weak}.`, "Not answering the verb in the question."],
      answer: (topics) => `For ${topics}, answer in ordered steps. Use the exact scientific term first, explain the mechanism, then connect it to the outcome asked in the question.`,
      start: (topics, weak) => `Complete 5 short-answer questions on ${topics}. Underline every scientific term and fix this weakness: ${weak}.`,
      final: (topics, weak) => [`Draw or list the process for ${topics} from memory.`, "Define 5 key terms out loud.", "Answer one 4-mark question in dot points.", `Repair this weak point: ${weak}.`, "Stop before you start mixing processes."]
    };
  }

  function general() {
    return {
      name: "HSC",
      focus: "specific marking point and timed execution",
      ignore: "perfect notes that never become answers",
      steps: ["Recall the core idea", "Attempt an exam-style task", "Mark one weakness", "Redo the weak part"],
      strategy: (topics, weak, time) => `Use ${time} to convert ${topics} into attempts. Prioritise ${weak}, because tomorrow's biggest gain comes from fixing the mark-losing pattern, not covering everything equally.`,
      mustKnow: (topics) => [`Core concepts for ${topics}`, "Definitions or structures", "Likely question types", "Marking language", "One example you can use"],
      mistakes: (weak) => ["Doing passive revision only.", "Not answering the question verb.", `Avoiding the weak area: ${weak}.`, "Spending too long on low-value details."],
      answer: (topics) => `For ${topics}, write the answer the marker can reward: clear point, specific evidence/method, direct link to the question, and a short check at the end.`,
      start: (topics, weak) => `Complete one timed task on ${topics}. Focus only on improving ${weak}.`,
      final: (topics, weak) => [`Recall ${topics} without notes.`, "Attempt one short task.", `Fix ${weak}.`, "Write tomorrow's first action.", "Stop with a clear head."]
    };
  }

  function getQuestions(profile, topics, weak) {
    if (profile.name === "Economics") return [`Define one key term from ${topics} in one sentence.`, `Create a 4-link cause-effect chain for ${topics}.`, `Explain how a change in conditions affects one stakeholder in ${topics}.`, `Write a 6-mark paragraph on ${topics} using one data/example placeholder.`, `Assess one policy response or limitation linked to ${topics}.`, `Challenge: write a mini extended-response judgement that addresses ${weak}.`];
    if (profile.name === "Mathematics") return [`Identify the method needed for a basic ${topics} question.`, `Complete one easy ${topics} question with full working.`, `Complete one medium ${topics} question and check the answer.`, `Complete one multi-step ${topics} question under timed conditions.`, `Redo a question where ${weak} usually appears.`, `Challenge: solve a harder ${topics} question and explain the checking step.`];
    if (profile.name === "English") return [`Write one thesis sentence for ${topics}.`, `Choose one quote and explain its technique and effect.`, `Write one topic sentence that answers the question.`, `Write one body paragraph using evidence and analysis.`, `Rewrite the paragraph to fix ${weak}.`, `Challenge: adapt the same paragraph to a different question angle.`];
    if (profile.name === "Biology / Science") return [`Define two key terms from ${topics}.`, `List the process steps for ${topics} in order.`, `Answer one 3-mark short-answer question on ${topics}.`, `Explain one diagram/process using scientific terminology.`, `Answer one 5-mark question that targets ${weak}.`, `Challenge: compare two processes or outcomes linked to ${topics}.`];
    return [`Recall the main idea for ${topics}.`, `Answer one warm-up question on ${topics}.`, `Complete one exam-style question on ${topics}.`, `Redo the answer focusing on ${weak}.`, "Mark one improvement and one remaining weakness.", "Challenge: complete one harder question under time pressure."];
  }

  function revisionOrder(time) {
    const minutes = Number(String(time).match(/\d+/)?.[0] || 90);
    if (minutes <= 45) return ["8 min: recall must-know content from memory.", "20 min: complete the highest ROI practice task.", "10 min: fix the biggest mistake.", "5 min: final recall check before stopping."];
    if (minutes <= 90) return ["15 min: must-know formulas, definitions, or structures.", "30 min: complete 3-5 exam-style questions.", "20 min: mark mistakes and redo the weakest part.", "10 min: final memory check.", "5 min: choose tomorrow's first question strategy."];
    return ["20 min: must-know content from memory.", "40 min: targeted practice set.", "25 min: mark and repair weak areas.", "25 min: timed exam-style response.", "10 min: final recall check and stop."];
  }

  function card(title, body) {
    return `<section class="cheat-card"><strong>${esc(title)}</strong><p>${esc(body)}</p></section>`;
  }

  function list(title, items) {
    return `<section class="cheat-card"><strong>${esc(title)}</strong><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`;
  }

  function practiceButton(label, task) {
    return `<button type="button" data-cheat-practice="${esc(task)}">${esc(label)}</button>`;
  }

  function copySheetText() {
    const result = document.querySelector(".cheat-sheet-result");
    if (!result) return;
    const text = result.innerText.trim();
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function downloadPdfSheet() {
    const result = document.querySelector(".cheat-sheet-result");
    if (!result) return;
    const title = result.querySelector("h3")?.textContent || "Tomorrow Cheat Sheet";
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${esc(title)}</title>
          <style>
            @page { size: A4; margin: 14mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #f4f7fb;
              color: #101828;
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              line-height: 1.45;
            }
            .pdf-shell {
              width: min(800px, 100%);
              margin: 0 auto;
              padding: 24px;
              background: #ffffff;
            }
            .cheat-print-head {
              display: block;
              border: 1px solid #d0d5dd;
              border-radius: 18px;
              padding: 22px;
              margin-bottom: 14px;
              background: linear-gradient(135deg, #eef7ff, #f7fbff);
            }
            .eyebrow {
              margin: 0 0 6px;
              color: #2563eb;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: .08em;
              text-transform: uppercase;
            }
            h3 {
              margin: 0;
              font-size: 28px;
              line-height: 1.08;
              letter-spacing: 0;
            }
            .cheat-print-head p {
              margin: 8px 0 0;
              color: #475467;
              font-weight: 700;
            }
            .cheat-actions { display: none; }
            .cheat-card {
              break-inside: avoid;
              border: 1px solid #d9e2ec;
              border-radius: 16px;
              padding: 14px 16px;
              margin: 10px 0;
              background: #ffffff;
            }
            .cheat-card strong {
              display: block;
              margin-bottom: 7px;
              color: #111827;
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: .06em;
            }
            .cheat-card p {
              margin: 0;
              color: #344054;
              font-size: 13.5px;
            }
            .cheat-card ul {
              margin: 0;
              padding-left: 18px;
            }
            .cheat-card li {
              margin: 3px 0;
              color: #344054;
              font-size: 13.5px;
            }
            .practice-now {
              background: #eef8ff;
              border-color: #b9e6fe;
            }
            .cheat-practice-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px;
            }
            .cheat-practice-grid button {
              min-height: 0;
              border: 1px solid #bfdbfe;
              border-radius: 999px;
              padding: 8px 10px;
              background: #ffffff;
              color: #1d4ed8;
              font: inherit;
              font-size: 12px;
              font-weight: 850;
              text-align: left;
            }
            .pdf-footer {
              margin-top: 16px;
              padding-top: 10px;
              border-top: 1px solid #e4e7ec;
              color: #667085;
              font-size: 11px;
              font-weight: 700;
            }
            @media print {
              body { background: #ffffff; }
              .pdf-shell { width: 100%; padding: 0; }
            }
          </style>
        </head>
        <body>
          <main class="pdf-shell">
            ${result.outerHTML}
            <div class="pdf-footer">Generated by HSC Helper - Use this as a focused revision sheet, then complete the practice inside the app.</div>
          </main>
          <script>
            window.addEventListener("load", () => {
              setTimeout(() => window.print(), 250);
            });
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function val(selector) {
    return document.querySelector(selector)?.value?.trim() || "";
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value || "";
  }

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }

  function addStyles() {
    if (document.querySelector("#tomorrowCheatStyles")) return;
    const style = document.createElement("style");
    style.id = "tomorrowCheatStyles";
    style.textContent = `
      .tomorrow-cheat{scroll-margin-top:110px}
      .cheat-builder{display:grid;grid-template-columns:minmax(280px,.86fr) minmax(0,1.14fr);gap:18px;margin-top:18px}
      .cheat-form,.cheat-output-wrap{border:1px solid rgba(255,255,255,.1);border-radius:28px;background:rgba(255,255,255,.055);box-shadow:inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(18px)}
      .cheat-form{display:grid;gap:13px;padding:18px}
      .cheat-notes textarea{min-height:96px}
      .cheat-output-wrap{padding:18px;min-height:420px}
      #cheatSheetStatus{display:block;margin-bottom:12px;color:rgba(229,234,247,.66);font-weight:850;font-size:.82rem}
      .cheat-sheet-result{display:grid;gap:12px}
      .cheat-print-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border:1px solid rgba(255,255,255,.09);border-radius:24px;padding:16px;background:linear-gradient(135deg,rgba(103,232,249,.12),rgba(102,168,255,.08))}
      .cheat-print-head h3{margin:0;font-size:clamp(1.35rem,3vw,2rem);letter-spacing:0}
      .cheat-print-head p{margin:6px 0 0;color:rgba(229,234,247,.76)}
      .cheat-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
      .cheat-actions button,.cheat-practice-grid button{min-height:44px;padding:0 15px;font-size:.84rem;box-shadow:none}
      .cheat-actions button[data-copy-text]{background:rgba(255,255,255,.09);color:rgba(247,249,255,.88)}
      .cheat-card{border:1px solid rgba(255,255,255,.09);border-radius:22px;padding:15px;background:rgba(255,255,255,.058)}
      .cheat-card strong{display:block;margin-bottom:8px;text-transform:uppercase;font-size:.78rem;color:rgba(247,249,255,.9)}
      .cheat-card p,.cheat-card li{color:rgba(229,234,247,.82);line-height:1.5}
      .cheat-card p{margin:0}
      .cheat-card ul{margin:0;padding-left:20px}
      .practice-now{background:rgba(103,232,249,.08);border-color:rgba(103,232,249,.18)}
      .cheat-practice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      @media (max-width:820px){.cheat-builder{grid-template-columns:1fr}.cheat-print-head{display:grid}.cheat-actions{justify-content:flex-start}.cheat-practice-grid{grid-template-columns:1fr}}
      @media print{body *{visibility:hidden}.cheat-sheet-result,.cheat-sheet-result *{visibility:visible}.cheat-sheet-result{position:absolute;inset:0;color:#101828;background:#fff}.cheat-actions{display:none}.cheat-card,.cheat-print-head{border:1px solid #d0d5dd;background:#fff;color:#101828;box-shadow:none}.cheat-card p,.cheat-card li,.cheat-print-head p{color:#344054}}
    `;
    document.head.appendChild(style);
  }
})();
