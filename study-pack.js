(() => {
  let activePackKey = "";

  document.addEventListener("click", (event) => {
    if (event.target.closest(".action-button, .start-session")) {
      setTimeout(enhanceStudyPack, 700);
    }
  }, true);

  new MutationObserver(() => {
    const overlay = document.querySelector("#focusOverlay");
    if (overlay?.getAttribute("aria-hidden") === "false") setTimeout(enhanceStudyPack, 250);
  }).observe(document.body, { attributes: true, childList: true, subtree: true });

  function enhanceStudyPack() {
    const overlay = document.querySelector("#focusOverlay");
    const stack = document.querySelector("#questionStack");
    const workflow = document.querySelector("#practiceWorkflow");
    if (!overlay || overlay.getAttribute("aria-hidden") !== "false" || !stack || !workflow) return;

    const topic = document.querySelector("#focusTaskTitle")?.textContent?.trim() || document.querySelector("#focusTaskText")?.textContent?.trim() || "Priority topic";
    const detail = document.querySelector("#focusTaskText")?.textContent?.trim() || "";
    const key = `${topic}|${detail}`;
    if (activePackKey === key && document.querySelector(".study-pack")) return;
    activePackKey = key;

    const pack = buildStudyPack(topic, detail);
    renderLearnSection(workflow, pack);
    renderPractice(stack, pack);
    wirePackInteractions(stack, pack);
    setText("#questionEngineBrief", `${pack.questions.length} tasks: 2 warm-up, 3 core, 1 challenge. Learn first, then answer inside the timer.`);
    updatePackProgress(stack);
  }

  function renderLearnSection(workflow, pack) {
    document.querySelector(".study-pack")?.remove();
    const section = document.createElement("article");
    section.className = "study-pack";
    section.innerHTML = `
      <div class="study-pack-top">
        <span>Study Pack</span>
        <em>${escapeHtml(pack.subjectLabel)}</em>
      </div>
      <div class="study-tabs">
        <section><strong>Learn</strong><p>${escapeHtml(pack.lesson)}</p></section>
        <section><strong>Key Concepts</strong><ul>${pack.keyConcepts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section><strong>Approach</strong><ol>${pack.approach.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></section>
        <section><strong>Answer Guidance</strong><p>${escapeHtml(pack.guidance)}</p></section>
        <section><strong>Next Step</strong><p>${escapeHtml(pack.nextStep)}</p></section>
      </div>
    `;
    workflow.querySelector(".question-engine")?.before(section);
    injectStudyPackStyles();
  }

  function renderPractice(stack, pack) {
    stack.innerHTML = pack.questions.map((question, index) => `
      <section class="question-card study-pack-question" data-pack-index="${index}">
        <div class="question-topline">
          <span>${escapeHtml(question.stage)} ${index + 1}</span>
          <em>${escapeHtml(question.difficulty)} - ${escapeHtml(question.time)}</em>
        </div>
        <p class="question-text">${escapeHtml(question.question)}</p>
        <div class="question-meta-grid">
          <div><strong>Focus</strong><span>${escapeHtml(question.focus)}</span></div>
          <div><strong>Common mistake</strong><span>${escapeHtml(question.mistake)}</span></div>
          <div><strong>Marks impact</strong><span>${escapeHtml(question.impact)}</span></div>
          <div><strong>Ignore</strong><span>${escapeHtml(question.ignore)}</span></div>
        </div>
        <label class="question-answer">Your answer / working<textarea data-pack-answer="${index}" placeholder="Write your working, paragraph, scaffold, evidence, definitions, or response here."></textarea></label>
        <div class="question-actions">
          <button type="button" class="secondary-action" data-pack-complete="${index}">Mark Complete</button>
          <button type="button" class="secondary-action feedback-action" data-pack-feedback="${index}">Get Clear AI Feedback</button>
        </div>
        <div class="question-feedback premium-feedback" id="packFeedback${index}" hidden></div>
      </section>
    `).join("");
  }

  function wirePackInteractions(stack, pack) {
    stack.onclick = async (event) => {
      const complete = event.target.closest("[data-pack-complete]");
      const feedback = event.target.closest("[data-pack-feedback]");
      if (complete) {
        const card = complete.closest(".question-card");
        card.classList.toggle("is-complete");
        complete.textContent = card.classList.contains("is-complete") ? "Completed" : "Mark Complete";
        updatePackProgress(stack);
        return;
      }
      if (feedback) {
        const index = Number(feedback.dataset.packFeedback);
        await markPackAnswer(pack, index, feedback);
      }
    };
  }

  async function markPackAnswer(pack, index, button) {
    const question = pack.questions[index];
    const answer = document.querySelector(`[data-pack-answer="${index}"]`)?.value || "";
    const node = document.querySelector(`#packFeedback${index}`);
    button.disabled = true;
    button.textContent = "Checking...";
    node.hidden = false;
    node.innerHTML = "Checking your response...";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subject: pack.subjectLabel,
          question: `Mark this HSC-style practice answer like a direct study coach.
Question: ${question.question}
Focus point: ${question.focus}
Common mistake to check: ${question.mistake}
Student answer: ${answer || "No answer written"}

Return clear feedback, not JSON.`
        })
      });
      const data = await response.json();
      node.innerHTML = formatFeedback(data.answer || localFeedback(question, answer));
    } catch {
      node.innerHTML = formatFeedback(localFeedback(question, answer));
    }

    button.disabled = false;
    button.textContent = "Get Clear AI Feedback";
    button.closest(".question-card")?.classList.add("is-complete");
    updatePackProgress(document.querySelector("#questionStack"));
  }

  function buildStudyPack(topic, detail) {
    const text = `${topic} ${detail}`.toLowerCase();
    if (/english|thesis|module|essay|paragraph|quote|analysis/.test(text)) return englishPack(topic);
    if (/economics|inflation|globalisation|monetary|fiscal|aggregate|demand|supply/.test(text)) return economicsPack(topic);
    if (/biology|enzyme|homeostasis|cell|dna|genetic|ecosystem|science|chemistry|physics/.test(text)) return sciencePack(topic);
    if (/quadratic|algebra|function|calculus|graph|math|equation|solve|differentiate/.test(text)) return mathsPack(topic);
    return generalPack(topic);
  }

  function mathsPack(topic) {
    return {
      subjectLabel: "Maths Study Pack",
      lesson: "For maths, marks come from method. Start with the rule, show substitution, keep signs clean, then state the final answer clearly. Do not hide working in your head.",
      keyConcepts: ["Method marks matter", "Correct substitution prevents sign errors", "Final answers need both solution and context"],
      approach: ["Identify the question type", "Write the formula or factorisation step", "Check signs and final answer"],
      guidance: "Use full working. A marker should see every step without guessing what you did.",
      nextStep: "After feedback, redo the weakest question once under 4 minutes.",
      questions: [
        q("Warm-up", "Solve x^2 - 7x + 10 = 0 by factorising. State both solutions.", "Easy", "4 min", "Factor pairs and both roots", "Only giving one solution", "Fast accuracy marks", "Ignore graphing for now"),
        q("Warm-up", "Expand and simplify (x - 3)(x + 5), then identify the coefficient of x.", "Easy", "3 min", "Clean expansion", "Dropping the negative sign", "Builds algebra control", "Ignore calculators"),
        q("Core", "Solve 2x^2 + 5x - 3 = 0 using the quadratic formula. Show substitution.", "Medium", "6 min", "Substitute a, b and c correctly", "Sign error in the discriminant", "Common exam skill", "Ignore shortcuts"),
        q("Core", "A rectangle has area 48 cm^2, length x + 2 and width x - 2. Form an equation and find x.", "Medium", "7 min", "Translate words into algebra", "Keeping an impossible negative value", "Application marks", "Ignore neat wording"),
        q("Core", "Sketch y = x^2 - 4x - 5 using intercepts and turning point.", "Medium", "7 min", "Use intercepts plus vertex", "Forgetting y-intercept", "Graph marks", "Ignore perfect scale"),
        q("Challenge", "Create one quadratic equation with roots -2 and 6, then expand it into standard form.", "Hard", "6 min", "Work backwards from roots", "Wrong sign in factors", "Deepens understanding", "Ignore memorising")
      ]
    };
  }

  function englishPack(topic) {
    return {
      subjectLabel: "English Study Pack",
      lesson: "For English, the marker rewards argument. Your paragraph needs a claim, evidence, technique, effect and a link to the question. Do not retell the plot.",
      keyConcepts: ["Thesis = arguable judgement", "Evidence must prove an idea", "Analysis explains effect, not just technique"],
      approach: ["Write the argument first", "Choose one precise quote or moment", "Explain how meaning is shaped"],
      guidance: "Aim for clarity over fancy wording. Every sentence should help answer the question.",
      nextStep: "Send one paragraph for feedback, then rewrite only the weakest sentence.",
      questions: [
        q("Warm-up", "Write one thesis sentence for your module that makes a clear judgement.", "Easy", "4 min", "Argument, not topic", "Listing the text name only", "Controls the whole essay", "Ignore memorised intros"),
        q("Warm-up", "Write one topic sentence that directly answers a likely HSC question.", "Easy", "4 min", "Clear claim", "Starting with plot summary", "Improves paragraph direction", "Ignore quote hunting"),
        q("Core", "Write one analytical paragraph using: claim, evidence, technique, effect, link.", "Medium", "10 min", "Explain effect", "Dropping a quote without analysis", "Direct paragraph marks", "Ignore perfect vocabulary"),
        q("Core", "Create a two-argument essay scaffold with one quote/evidence point for each argument.", "Medium", "8 min", "Argument sequence", "Planning by plot", "Essay control", "Ignore full sentences"),
        q("Core", "Rewrite a weak sentence so it links back to the question more clearly.", "Medium", "5 min", "Question link", "Ending with a vague statement", "Clarity marks", "Ignore new evidence"),
        q("Challenge", "Write a 12-minute mini response that includes thesis, one paragraph and a final judgement sentence.", "Hard", "12 min", "Timed structure", "No judgement", "Exam realism", "Ignore word count")
      ]
    };
  }

  function economicsPack(topic) {
    return {
      subjectLabel: "Economics Study Pack",
      lesson: "Economics answers need chains of cause and effect. Define the concept, explain the mechanism, add an example or statistic placeholder, then make a judgement.",
      keyConcepts: ["Use economic terminology", "Explain transmission mechanisms", "Support arguments with examples/data"],
      approach: ["Define the key term", "Explain cause and effect", "Add example, data or judgement"],
      guidance: "Do not write a list of definitions. Make the marker see the economic relationship.",
      nextStep: "Turn your weakest answer into one sharper paragraph with a statistic placeholder.",
      questions: [
        q("Warm-up", "Define the key economic concept in two precise sentences.", "Easy", "4 min", "Correct terminology", "Vague definition", "Easy short-answer marks", "Ignore long examples"),
        q("Warm-up", "Write one cause-and-effect chain using arrows for this topic.", "Easy", "4 min", "Mechanism clarity", "Skipping the middle link", "Improves explanation", "Ignore essay wording"),
        q("Core", "Answer a 4-mark question: explain one cause and one effect of this issue on Australia.", "Medium", "8 min", "Cause + effect", "Listing without explaining", "Common HSC style", "Ignore broad history"),
        q("Core", "Write a 6-mark paragraph using one statistic placeholder and one real-world example.", "Medium", "10 min", "Evidence supports argument", "No data/example", "Boosts credibility", "Ignore perfect stats"),
        q("Core", "Build a 12-mark extended response scaffold with two arguments and one judgement.", "Medium", "10 min", "Judgement", "Describing both sides equally", "Essay structure", "Ignore full essay writing"),
        q("Challenge", "Write a 10-minute mini extended response intro and first body paragraph.", "Hard", "10 min", "Argument under time", "No thesis direction", "Exam performance", "Ignore memorised wording")
      ]
    };
  }

  function sciencePack(topic) {
    return {
      subjectLabel: "Science Study Pack",
      lesson: "Science marks come from accurate processes. Name the structure/process, describe what happens in order, then link it to the result shown in the question.",
      keyConcepts: ["Use scientific terms accurately", "Explain process order", "Link data/trends to biology or science content"],
      approach: ["Define the process", "Sequence the steps", "Connect to the result or stimulus"],
      guidance: "Short answers need precision. Avoid vague words like affects or helps unless you explain how.",
      nextStep: "After feedback, write one error-log rule for the scientific term you misused.",
      questions: [
        q("Warm-up", "Define the key process in this topic using two scientific terms.", "Easy", "4 min", "Accurate terminology", "Using everyday wording", "Easy recall marks", "Ignore extra detail"),
        q("Warm-up", "List the process steps in correct order as dot points.", "Easy", "4 min", "Sequence", "Missing a middle step", "Builds process accuracy", "Ignore full sentences"),
        q("Core", "Answer a 4-mark explain question about how this process causes an outcome.", "Medium", "8 min", "Cause and mechanism", "Repeating the question", "Short-answer marks", "Ignore diagrams first"),
        q("Core", "Create a labelled diagram or flow chart for the process, then explain one label.", "Medium", "8 min", "Visual process link", "Unlabelled arrows", "Diagram confidence", "Ignore artistic quality"),
        q("Core", "Interpret a trend or result related to this topic and explain the science behind it.", "Medium", "8 min", "Data + explanation", "Describing trend only", "Data-response marks", "Ignore unrelated theory"),
        q("Challenge", "Write a 6-mark response that includes term, process, example and final effect.", "Hard", "10 min", "Complete scientific answer", "No final link", "High exam value", "Ignore memorised slabs")
      ]
    };
  }

  function generalPack(topic) {
    return {
      subjectLabel: "HSC Study Pack",
      lesson: "Start with the core idea, then test it. A useful study session has recall, practice, feedback and one correction. Do not spend the session organising notes.",
      keyConcepts: ["Recall before checking", "Practice beats rereading", "Feedback must create a correction"],
      approach: ["Write what you know", "Attempt exam-style tasks", "Mark one weakness and fix it"],
      guidance: "Keep each answer short, direct and tied to the question wording.",
      nextStep: "Pick the weakest answer and redo only that part.",
      questions: [
        q("Warm-up", `Define ${topic} in two clear sentences.`, "Easy", "4 min", "Precise definition", "Being vague", "Fast recall", "Ignore formatting"),
        q("Warm-up", `List three syllabus-style points connected to ${topic}.`, "Easy", "4 min", "Key points", "Writing full notes", "Builds recall", "Ignore decoration"),
        q("Core", `Answer one short HSC-style question on ${topic} using one example.`, "Medium", "8 min", "Example + link", "Not answering directive verb", "Short-answer marks", "Ignore extra context"),
        q("Core", `Create a response scaffold for ${topic}: claim, evidence/example, explanation, link.`, "Medium", "8 min", "Structure", "No link back", "Response control", "Ignore full essay"),
        q("Core", `Write an error log: one mistake, why it happened, and the correction rule.`, "Medium", "5 min", "Correction", "Only naming mistake", "Prevents repeat errors", "Ignore blame"),
        q("Challenge", `Write a timed 10-minute response on ${topic}, then mark the weakest sentence.`, "Hard", "10 min", "Timed execution", "Trying to be perfect", "Exam realism", "Ignore perfect wording")
      ]
    };
  }

  function q(stage, question, difficulty, time, focus, mistake, impact, ignore) {
    return { stage, question, difficulty, time, focus, mistake, impact, ignore };
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function updatePackProgress(stack) {
    const total = stack.querySelectorAll(".study-pack-question").length;
    const done = stack.querySelectorAll(".study-pack-question.is-complete").length;
    setText("#questionProgress", `${done}/${total} complete`);
  }

  function localFeedback(question, answer) {
    const short = String(answer || "").trim().split(/\s+/).filter(Boolean).length < 12;
    return [
      `Verdict: ${short ? "Too short to mark properly." : "Good start, but make the marking point clearer."}`,
      `What went wrong: ${question.mistake}`,
      `Fix now: Add one line that directly targets: ${question.focus}.`,
      `Next action: ${question.stage === "Challenge" ? "Rewrite the weakest part once." : "Move to the next question and keep the same focus."}`
    ].join("\n");
  }

  function formatFeedback(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function injectStudyPackStyles() {
    if (document.querySelector("#studyPackStyles")) return;
    const style = document.createElement("style");
    style.id = "studyPackStyles";
    style.textContent = `
      .study-pack{display:grid;gap:14px;border:1px solid rgba(103,232,249,.18)!important;background:linear-gradient(145deg,rgba(103,232,249,.105),rgba(255,255,255,.045))!important}.study-pack-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.study-pack-top span{display:inline-flex;min-height:30px;align-items:center;border-radius:999px;padding:0 11px;color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green));font-size:.74rem;font-weight:900}.study-pack-top em{font-style:normal;color:var(--muted);font-size:.78rem;font-weight:850}.study-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.study-tabs section{border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px;background:rgba(255,255,255,.052)}.study-tabs section:first-child{grid-column:1/-1}.study-tabs strong{display:block;margin-bottom:6px;color:rgba(247,249,255,.9);font-size:.72rem;font-weight:900;text-transform:uppercase}.study-tabs p,.study-tabs li{color:var(--muted);line-height:1.48}.study-tabs ul,.study-tabs ol{margin:0;padding-left:18px}.study-pack-question .question-topline span{background:linear-gradient(135deg,var(--cyan),var(--green))}.premium-feedback{font-size:.95rem}.premium-feedback br{display:block;margin:5px 0}@media(max-width:780px){.study-tabs{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }
})();
