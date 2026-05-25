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

    const title = document.querySelector("#focusTaskTitle")?.textContent?.trim() || "";
    const task = document.querySelector("#focusTaskText")?.textContent?.trim() || "";
    const type = document.querySelector("#focusQuestionType")?.textContent?.trim() || "";
    const resource = document.querySelector("#focusResourceName")?.textContent?.trim() || "";
    const key = `${title}|${task}|${type}|${resource}`;
    if (activePackKey === key && document.querySelector(".study-pack")) return;
    activePackKey = key;

    const studentState = currentStudentState();
    const pack = adaptPackForStudentState(buildSubjectSystem({ title, task, type, resource }), studentState);
    document.querySelector("#focusTaskTitle").textContent = pack.sessionTitle;
    document.querySelector("#focusTaskText").textContent = pack.sessionTask;
    document.querySelector("#focusQuestionType").textContent = pack.questionType;
    document.querySelector("#focusDoNow").textContent = pack.doNow;
    document.querySelector("#focusMistake").textContent = pack.commonMistake;
    renderApproach(pack.executionSteps);
    renderLearnSection(workflow, pack);
    renderPractice(stack, pack);
    wirePackInteractions(stack, pack);
    setText("#questionEngineBrief", `${pack.questions.length} subject-specific tasks: mini teaching, worked example, guided practice, feedback, weakness repair.`);
    updatePackProgress(stack);
  }

  function renderLearnSection(workflow, pack) {
    document.querySelector(".study-pack")?.remove();
    const section = document.createElement("article");
    section.className = `study-pack subject-${pack.id}`;
    section.innerHTML = `
      <div class="study-pack-top">
        <span>${escapeHtml(pack.mode)}</span>
        <em>${escapeHtml(pack.subjectLabel)}</em>
      </div>
      <div class="subject-brief">
        <strong>${escapeHtml(pack.tutorLine)}</strong>
        <p>${escapeHtml(pack.psychology)}</p>
        ${pack.studentState ? `<small class="state-tuning">Tuned for: ${escapeHtml(pack.studentState)}</small>` : ""}
      </div>
      <div class="study-tabs">
        <section class="study-learn">
          <strong>Learn</strong>
          <p>${escapeHtml(pack.miniTeaching)}</p>
        </section>
        <section>
          <strong>Worked Example</strong>
          <p>${escapeHtml(pack.workedExample)}</p>
        </section>
        <section>
          <strong>Key Concepts</strong>
          <ul>${pack.keyConcepts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section>
          <strong>How To Approach</strong>
          <ol>${pack.executionSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </section>
        <section>
          <strong>Feedback Flow</strong>
          <p>${escapeHtml(pack.feedbackFlow)}</p>
        </section>
        <section>
          <strong>Weakness Repair</strong>
          <p>${escapeHtml(pack.weaknessRepair)}</p>
        </section>
        <section class="study-next">
          <strong>Next Targeted Step</strong>
          <p>${escapeHtml(pack.nextStep)}</p>
        </section>
      </div>
    `;
    workflow.querySelector(".question-engine")?.before(section);
    injectStudyPackStyles();
  }

  function renderPractice(stack, pack) {
    stack.innerHTML = pack.questions.map((question, index) => `
      <section class="question-card study-pack-question subject-${pack.id}" data-pack-index="${index}">
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
        <label class="question-answer">${escapeHtml(pack.answerLabel)}<textarea data-pack-answer="${index}" placeholder="${escapeHtml(question.placeholder)}"></textarea></label>
        <div class="question-actions">
          <button type="button" class="secondary-action" data-pack-complete="${index}">Mark Complete</button>
          <button type="button" class="secondary-action feedback-action" data-pack-feedback="${index}">${escapeHtml(pack.feedbackButton)}</button>
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
          question: `Mark this HSC ${pack.subjectLabel} response as a ${pack.tutorLine}.
Question: ${question.question}
Focus point: ${question.focus}
Common mistake to check: ${question.mistake}
Subject feedback criteria: ${pack.feedbackCriteria.join("; ")}
Student state: ${pack.studentState || "not selected"}
Student answer: ${answer || "No answer written"}

Return clear feedback in four short sections:
Verdict
What is costing marks
Why marks were lost
Fix this now
Next targeted task
Do not return JSON.`
        })
      });
      const data = await response.json();
      node.innerHTML = formatFeedback(data.answer || localFeedback(pack, question, answer));
    } catch {
      node.innerHTML = formatFeedback(localFeedback(pack, question, answer));
    }

    button.disabled = false;
    button.textContent = pack.feedbackButton;
    button.closest(".question-card")?.classList.add("is-complete");
    rememberPackMistake(pack, question, answer);
    updatePackProgress(document.querySelector("#questionStack"));
  }

  function currentStudentState() {
    return document.querySelector("#studentStateInput")?.value || localStorage.getItem("hscStudentState") || "";
  }

  function adaptPackForStudentState(pack, state) {
    if (!state) return pack;
    const tuned = {
      ...pack,
      studentState: state,
      questions: pack.questions.map((question) => ({ ...question }))
    };

    if (state.includes("procrastinating") || state.includes("where to start")) {
      tuned.psychology = "This session is built for fast momentum: one tiny start, then one correction. No huge plan, no overthinking.";
      tuned.doNow = "Start with the first warm-up only. Your job is to begin, not to finish everything perfectly.";
      tuned.nextStep = "Complete one warm-up question, then stop and mark it. That is the win.";
      tuned.questions = tuned.questions.map((question, index) => ({
        ...question,
        time: index < 2 ? "3 min" : question.time,
        difficulty: index === 5 ? "Medium" : question.difficulty,
        focus: index < 2 ? "Start fast and show one clear step" : question.focus
      }));
    }

    if (state.includes("lose marks")) {
      tuned.psychology = "You already have some content. This session is about mark conversion: clearer working, stronger links and fewer avoidable errors.";
      tuned.doNow = "Answer normally, then underline the exact line that would earn the mark.";
      tuned.nextStep = "Redo the weakest response with the marking point made obvious.";
      tuned.questions = tuned.questions.map((question) => ({
        ...question,
        focus: `${question.focus}; make the marking point obvious`,
        impact: `${question.impact}; improves mark conversion`
      }));
    }

    if (state.includes("exam-style practice")) {
      tuned.psychology = "This session is exam-mode: timed attempts, clear answer structure and quick marking decisions.";
      tuned.doNow = "Use the timer. Attempt first, then check. Treat each question like marks are attached.";
      tuned.nextStep = "Repeat the highest-value question under time without notes.";
    }

    if (state.includes("writing answers")) {
      tuned.psychology = "This session prioritises answer construction: claim, evidence, explanation, link. Clear structure beats more content.";
      tuned.doNow = "Write the answer in a marked structure, not loose notes.";
      tuned.nextStep = "Rewrite the weakest sentence so it directly answers the question.";
    }

    if (state.includes("panicking")) {
      tuned.psychology = "This session is deliberately calm and narrow. One concept, one attempt, one fix. That is enough to regain control.";
      tuned.doNow = "Do the easiest warm-up first and breathe before checking. Do not jump to the challenge question.";
      tuned.nextStep = "Finish with one corrected answer, not a perfect study plan.";
      tuned.questions = tuned.questions.map((question, index) => ({
        ...question,
        time: index < 2 ? "4 min" : question.time,
        difficulty: index === 5 ? "Medium-Hard" : question.difficulty
      }));
    }

    return tuned;
  }

  function rememberPackMistake(pack, question, answer) {
    const weakness = {
      mistake: question.mistake,
      focus: question.focus,
      question: question.question,
      subject: pack.subjectLabel,
      studentState: pack.studentState || "",
      answerLength: String(answer || "").trim().split(/\s+/).filter(Boolean).length,
      at: Date.now()
    };
    try {
      const history = JSON.parse(localStorage.getItem("hscWeaknesses") || "[]");
      history.unshift(weakness);
      localStorage.setItem("hscWeaknesses", JSON.stringify(history.slice(0, 30)));
      window.dispatchEvent(new CustomEvent("hsc-weakness-updated", { detail: weakness }));
    } catch {
      localStorage.setItem("hscWeaknesses", JSON.stringify([weakness]));
    }
  }

  function buildSubjectSystem(context) {
    const text = `${context.title} ${context.task} ${context.type} ${context.resource}`.toLowerCase();
    const topic = detectTopic(text, context);
    if (isEconomicsContext(text)) return economicsSystem(topic);
    if (/biology|enzyme|homeostasis|cell|dna|genetic|ecosystem|evolution|science|chemistry|physics|acid|force|energy/.test(text)) return scienceSystem(topic);
    if (/quadratic|algebra|function|calculus|graph|math|equation|solve|differentiate|integrate|trig|probability/.test(text)) return mathematicsSystem(topic);
    if (isEnglishContext(text)) return englishSystem(topic);
    return generalSystem(topic);
  }

  function isEconomicsContext(text) {
    return /economics|inflation|globalisation|monetary|fiscal|aggregate|exchange rate|unemployment|tariff|budget|labour market|labor market|labour markets|labor markets|minimum wage|wage|employment|participation rate|underemployment|labour force|labor force|productivity|economic growth|current account|cash rate|rba|market failure/.test(text);
  }

  function isEnglishContext(text) {
    return /english|module [abc]|module a|module b|module c|common module|thesis|quote|textual|shakespeare|poem|poetry|novel|film technique|composer|audience|comparative study/.test(text);
  }

  function mathematicsSystem(topic) {
    return {
      id: "maths",
      mode: "Timed Problem Lab",
      subjectLabel: "Mathematics Tutor",
      tutorLine: "Maths speed-and-accuracy coach",
      psychology: "Maths confidence comes from repeated correct attempts, not reading solutions. This session drills method, timing and mistake control.",
      sessionTitle: "Maths Problem Lab",
      sessionTask: `Complete a focused ${topic} drill, then repair the exact mistake pattern.`,
      questionType: "Timed HSC calculation and reasoning questions",
      doNow: "Attempt each question before looking anything up. Show enough working to earn method marks.",
      commonMistake: "Moving too fast and losing signs, substitutions or final answer marks.",
      miniTeaching: `${topic} questions are won by a repeatable method: identify the form, choose the rule, substitute carefully, then check whether the answer fits the question.`,
      workedExample: "Example workflow: write the equation, label known values, perform the method line-by-line, circle the final answer, then do one quick substitution/check.",
      keyConcepts: ["Method marks beat mental shortcuts", "Timed repetition builds exam speed", "Every wrong answer needs an error-log rule"],
      executionSteps: ["Start with the easiest warm-up to lock the method", "Do the core questions under time", "Mark the exact line where the error started", "Redo one similar question immediately"],
      feedbackFlow: "AI checks method clarity, accuracy, final answer and repeatable mistake pattern.",
      feedbackCriteria: ["method shown", "correct algebra/calculation", "final answer stated", "error pattern identified"],
      weaknessRepair: "If you miss a question, rewrite the failed step as a rule, then solve one near-identical question without notes.",
      nextStep: "Redo the hardest missed question in under 4 minutes.",
      answerLabel: "Your working",
      feedbackButton: "Check My Method",
      questions: [
        q("Warm-up", "Solve x^2 - 7x + 10 = 0 by factorising. State both roots.", "Easy", "4 min", "Factor pairs and both solutions", "Only giving one root", "Fast foundation marks", "Ignore graphing", "Show factorisation and roots."),
        q("Warm-up", "Expand and simplify (x - 3)(x + 5), then identify the coefficient of x.", "Easy", "3 min", "Clean expansion", "Dropping the negative sign", "Algebra control", "Ignore calculators", "Write each expansion line."),
        q("Core", "Solve 2x^2 + 5x - 3 = 0 using the quadratic formula. Show substitution.", "Medium", "6 min", "Substitute a, b and c accurately", "Sign error in the discriminant", "Common exam skill", "Ignore shortcuts", "Show formula, substitution and final values."),
        q("Core", "A rectangle has area 48 cm^2, length x + 2 and width x - 2. Form an equation and find x.", "Medium", "7 min", "Translate words into algebra", "Keeping an impossible negative value", "Application marks", "Ignore perfect wording", "Form equation, solve, reject impossible value."),
        q("Core", "Sketch y = x^2 - 4x - 5 using intercepts and turning point.", "Medium", "7 min", "Intercepts plus vertex", "Forgetting the y-intercept", "Graph interpretation marks", "Ignore perfect scale", "List intercepts and turning point before sketching."),
        q("Challenge", "Create one quadratic equation with roots -2 and 6, then expand it into standard form.", "Hard", "6 min", "Work backwards from roots", "Wrong sign in factors", "Deep understanding", "Ignore memorising", "Start from factors, then expand.")
      ]
    };
  }

  function englishSystem(topic) {
    return {
      id: "english",
      mode: "Essay Craft Studio",
      subjectLabel: "English Tutor",
      tutorLine: "Thesis, paragraph and analysis coach",
      psychology: "English improves when you make sharper arguments and rewrite specific sentences, not when you collect more quotes.",
      sessionTitle: "English Writing Studio",
      sessionTask: `Build a stronger ${topic} argument, then test it in one timed paragraph.`,
      questionType: "Thesis, paragraph and textual analysis tasks",
      doNow: "Write the argument first. Then use evidence to prove it.",
      commonMistake: "Retelling the text instead of explaining how meaning is shaped.",
      miniTeaching: `For ${topic}, your job is to make a judgement. A strong response connects idea, technique, evidence and effect back to the question.`,
      workedExample: "Strong sentence pattern: The composer presents [idea] as [judgement] through [technique/evidence], positioning the audience to understand [effect].",
      keyConcepts: ["Thesis is a judgement, not a topic", "Evidence must prove the claim", "Analysis explains effect and meaning"],
      executionSteps: ["Write a one-sentence thesis", "Choose one precise quote or moment", "Build a paragraph around one idea", "Rewrite the weakest sentence for clarity"],
      feedbackFlow: "AI checks argument clarity, quote integration, analysis depth, structure and question link.",
      feedbackCriteria: ["clear thesis", "textual evidence", "technique and effect", "analysis depth", "question link"],
      weaknessRepair: "If the paragraph is vague, rewrite only the topic sentence and the final linking sentence.",
      nextStep: "Turn the best paragraph into a two-paragraph essay scaffold.",
      answerLabel: "Your thesis, scaffold or paragraph",
      feedbackButton: "Improve My Paragraph",
      questions: [
        q("Warm-up", `Write one thesis sentence for ${topic} that makes a clear judgement.`, "Easy", "4 min", "Argument, not topic", "Naming the text without a judgement", "Controls the whole essay", "Ignore memorised intros", "Write one sharp thesis."),
        q("Warm-up", "Write one topic sentence that directly answers a likely HSC question.", "Easy", "4 min", "Clear paragraph claim", "Starting with plot summary", "Improves paragraph direction", "Ignore quote hunting", "Write a claim that could start a body paragraph."),
        q("Core", "Write one analytical paragraph using claim, evidence, technique, effect and link.", "Medium", "10 min", "Depth of analysis", "Dropping a quote without explaining effect", "Direct paragraph marks", "Ignore fancy vocabulary", "Write a complete paragraph."),
        q("Core", "Create a two-argument essay scaffold with one quote or textual moment for each argument.", "Medium", "8 min", "Argument sequence", "Planning by plot order", "Essay control", "Ignore full sentences", "Use dot points only."),
        q("Core", "Rewrite one weak sentence so it links more clearly to the question wording.", "Medium", "5 min", "Question link", "Ending with a vague statement", "Clarity marks", "Ignore new evidence", "Paste the before and after sentence."),
        q("Challenge", "Write a 12-minute mini response with thesis, one paragraph and a final judgement sentence.", "Hard", "12 min", "Timed structure", "No final judgement", "Exam realism", "Ignore word count", "Write under time.")
      ]
    };
  }

  function economicsSystem(topic) {
    const isLabour = /labou?r market|employment|unemployment|wage|participation|labou?r force/i.test(topic);
    const economicsQuestions = isLabour ? [
      q("Warm-up", "Define the labour market and explain why labour demand is a derived demand.", "Easy", "4 min", "Precise definition plus mechanism", "Defining labour market as just jobs", "Easy short-answer marks", "Ignore long policy history", "Write definition plus one cause-effect sentence."),
      q("Warm-up", "Create a 4-link chain showing how a fall in aggregate demand can increase cyclical unemployment.", "Easy", "5 min", "Cause-effect chain", "Jumping from weak demand straight to unemployment", "Core HSC economics logic", "Ignore statistics first", "Use arrows."),
      q("Core", "Explain how a minimum wage above equilibrium can affect employment and income distribution.", "Medium", "8 min", "Diagram logic plus trade-off", "Only saying wages rise", "Common labour market application", "Ignore perfect diagram art", "Explain wage, quantity demanded, quantity supplied and trade-off."),
      q("Core", "Write a 6-mark paragraph on one cause of unemployment in Australia and one policy response.", "Medium", "10 min", "Cause, policy and judgement", "Listing policies without explaining transmission", "Extended response marks", "Ignore memorised slabs", "Use one cause-effect-policy chain."),
      q("Core", "Build a scaffold for a labour market essay: two causes, one diagram/example, one policy, one judgement.", "Medium", "10 min", "Economic essay structure", "Writing like an English essay with no economic chain", "High essay value", "Ignore fancy wording", "Use economic headings and arrows."),
      q("Challenge", "Write a timed mini extended response: analyse how labour market changes can affect unemployment and economic growth.", "Hard", "12 min", "Analysis plus judgement", "No final judgement on impact", "High exam relevance", "Ignore perfect stats", "Write intro and one body paragraph.")
    ] : [
      q("Warm-up", `Define ${topic} in two precise economic sentences.`, "Easy", "4 min", "Terminology", "Vague everyday definition", "Easy short-answer marks", "Ignore long examples", "Write a definition plus one context sentence."),
      q("Warm-up", `Create a 4-link cause-effect chain for ${topic}.`, "Easy", "4 min", "Mechanism clarity", "Skipping the middle link", "Improves explanation", "Ignore essay wording", "Use arrows."),
      q("Core", "Answer a 4-mark explain question: outline one cause and one effect on the Australian economy.", "Medium", "8 min", "Cause plus effect", "Listing without explaining", "Common HSC style", "Ignore broad history", "Write 4-5 sharp sentences."),
      q("Core", "Write a 6-mark paragraph using one statistic placeholder and one real-world example.", "Medium", "10 min", "Evidence supports argument", "No data/example", "Boosts credibility", "Ignore perfect stats", "Use [statistic] if you do not know the number."),
      q("Core", "Build a 12-mark response scaffold with two arguments, one policy and one judgement.", "Medium", "10 min", "Judgement", "Balancing everything equally", "Essay structure", "Ignore full essay writing", "Use headings or dot points."),
      q("Challenge", "Write a 10-minute mini extended response intro and first body paragraph.", "Hard", "10 min", "Argument under time", "No thesis direction", "Exam performance", "Ignore memorised wording", "Write the intro and first paragraph.")
    ];
    return {
      id: "economics",
      mode: "Economic Chain Builder",
      subjectLabel: "Economics Tutor",
      tutorLine: "Cause-effect and policy reasoning coach",
      psychology: "Economics marks come from explaining relationships. Definitions are only useful when they start a chain of impact.",
      sessionTitle: "Economics Analysis Lab",
      sessionTask: `Build a cause-effect chain for ${topic}, then turn it into an extended-response paragraph.`,
      questionType: "Economic chains, data prompts and extended responses",
      doNow: "Define the term, build the chain, then add one example or statistic placeholder.",
      commonMistake: "Listing impacts without explaining the transmission mechanism.",
      miniTeaching: isLabour ? "Labour market responses need economic chains, not English-style technique. Start with demand/supply for labour, explain the transmission to wages/employment, then judge the effect on unemployment, equity or growth." : `${topic} answers need a chain: concept -> cause -> mechanism -> effect -> judgement. That chain is what makes the response sound economic.`,
      workedExample: isLabour ? "Worked chain: weaker aggregate demand -> firms sell less output -> demand for labour falls because labour is derived demand -> employment falls and cyclical unemployment rises -> government may use stimulus/training, but budget and inflation trade-offs matter." : "Chain pattern: higher interest rates -> increased borrowing costs -> lower consumption/investment -> reduced aggregate demand -> lower inflationary pressure, with trade-offs.",
      keyConcepts: ["Definitions must lead to analysis", "Statistics support, they do not replace explanation", "Judgement separates strong responses from descriptive ones"],
      executionSteps: ["Define the key term in one sentence", "Draw a 4-link cause-effect chain", "Add one Australian example or statistic placeholder", "Write the paragraph with a judgement"],
      feedbackFlow: "AI checks terminology, chain logic, example/data use, policy awareness and judgement.",
      feedbackCriteria: ["economic terminology", "cause-effect chain", "data/example integration", "policy impact", "judgement"],
      weaknessRepair: "If the chain jumps steps, add the missing mechanism between cause and effect.",
      nextStep: "Convert the chain into one 6-mark paragraph with a statistic placeholder.",
      answerLabel: "Your chain, scaffold or response",
      feedbackButton: "Check My Economic Logic",
      questions: economicsQuestions
    };
  }

  function scienceSystem(topic) {
    return {
      id: "science",
      mode: "Process Recall Lab",
      subjectLabel: "Biology/Science Tutor",
      tutorLine: "Process, diagram and terminology coach",
      psychology: "Science improves when you can explain processes in order and use precise terminology under pressure.",
      sessionTitle: "Science Process Lab",
      sessionTask: `Learn the ${topic} process, then prove it with recall, diagram and short-answer practice.`,
      questionType: "Active recall, process diagrams and short answers",
      doNow: "Recall the process first, then check accuracy after your attempt.",
      commonMistake: "Using vague words like affects or helps without explaining the mechanism.",
      miniTeaching: `For ${topic}, think in sequence: structure, process, mechanism, result. HSC science marks reward accurate terms and clear order.`,
      workedExample: "Process answer pattern: name the structure/process, describe step 1 -> step 2 -> step 3, then link the process to the final result or stimulus.",
      keyConcepts: ["Terminology must be precise", "Processes need correct order", "Diagrams should explain, not decorate"],
      executionSteps: ["Define the process", "List the steps in order", "Draw or describe the diagram/flow", "Answer a short-response question using the terms"],
      feedbackFlow: "AI checks scientific accuracy, sequence, terminology, stimulus link and missing mechanism.",
      feedbackCriteria: ["scientific terminology", "process order", "mechanism explanation", "diagram/flow clarity", "stimulus link"],
      weaknessRepair: "If you miss a term, make one memory cue and use it in a new sentence immediately.",
      nextStep: "Redo the weakest short answer using the corrected term twice.",
      answerLabel: "Your recall, diagram notes or short answer",
      feedbackButton: "Check Scientific Accuracy",
      questions: [
        q("Warm-up", `Define ${topic} using two accurate scientific terms.`, "Easy", "4 min", "Terminology", "Using everyday wording", "Easy recall marks", "Ignore extra detail", "Write a concise definition."),
        q("Warm-up", `List the steps of ${topic} in correct order as dot points.`, "Easy", "4 min", "Sequence", "Missing a middle step", "Builds process accuracy", "Ignore full sentences", "Use numbered steps."),
        q("Core", "Answer a 4-mark explain question about how this process causes an outcome.", "Medium", "8 min", "Cause and mechanism", "Repeating the question", "Short-answer marks", "Ignore diagrams first", "Write a full short answer."),
        q("Core", "Create a labelled diagram or flow chart for the process, then explain one label.", "Medium", "8 min", "Visual process link", "Unlabelled arrows", "Diagram confidence", "Ignore artistic quality", "Describe your diagram if typing."),
        q("Core", "Interpret a trend or result related to this topic and explain the science behind it.", "Medium", "8 min", "Data plus explanation", "Describing trend only", "Data-response marks", "Ignore unrelated theory", "Write trend then reason."),
        q("Challenge", "Write a 6-mark response that includes term, process, example and final effect.", "Hard", "10 min", "Complete scientific answer", "No final link", "High exam value", "Ignore memorised slabs", "Write under timed conditions.")
      ]
    };
  }

  function generalSystem(topic) {
    const focus = topic === "Priority Topic" ? "your weakest topic" : topic;
    return {
      id: "general",
      mode: "HSC Execution Coach",
      subjectLabel: "HSC Tutor",
      tutorLine: "Adaptive study execution coach",
      psychology: "The fastest improvement comes from recall, practice, feedback and one correction. Organisation is useful only if it leads to an attempt.",
      sessionTitle: "HSC Study Pack",
      sessionTask: `Run a focused learn-practice-feedback session for ${focus}.`,
      questionType: "HSC-style recall and response tasks",
      doNow: "Attempt the first task from memory before checking notes.",
      commonMistake: "Preparing for too long instead of producing an answer.",
      miniTeaching: `Start with one clean idea, then prove it through practice. A strong HSC session is not more reading: it is one attempt, one correction and one targeted redo.`,
      workedExample: "Premium execution pattern: write the core idea in one sentence, attempt one exam-style task, identify the mark-losing point, then redo only that weak part immediately.",
      keyConcepts: ["Recall before checking", "Practice beats rereading", "Feedback must create a correction"],
      executionSteps: ["Write what you know", "Attempt a timed task", "Mark one weakness", "Redo the weak section"],
      feedbackFlow: "AI checks whether the answer directly targets the question and creates one next action.",
      feedbackCriteria: ["question focus", "specific detail", "structure", "correction action"],
      weaknessRepair: "Rewrite only the weakest part, then move to a similar task.",
      nextStep: "Redo one focused task in 10 minutes.",
      answerLabel: "Your answer or working",
      feedbackButton: "Get Clear AI Feedback",
      questions: [
        q("Warm-up", `Define ${focus} in two clear sentences.`, "Easy", "4 min", "Precise definition", "Being vague", "Fast recall", "Ignore formatting", "Write without notes first."),
        q("Warm-up", `List three syllabus-style points connected to ${focus}.`, "Easy", "4 min", "Key points", "Writing full notes", "Builds recall", "Ignore decoration", "Use dot points."),
        q("Core", `Answer one short HSC-style question on ${focus} using one example.`, "Medium", "8 min", "Example plus link", "Not answering the directive verb", "Short-answer marks", "Ignore extra context", "Write a direct response."),
        q("Core", `Create a response scaffold for ${focus}: claim, evidence/example, explanation, link.`, "Medium", "8 min", "Structure", "No link back", "Response control", "Ignore full essay", "Use a scaffold."),
        q("Core", "Write an error log: one mistake, why it happened, and the correction rule.", "Medium", "5 min", "Correction", "Only naming the mistake", "Prevents repeat errors", "Ignore blame", "Write one rule."),
        q("Challenge", `Write a timed 10-minute response on ${focus}, then mark the weakest sentence.`, "Hard", "10 min", "Timed execution", "Trying to be perfect", "Exam realism", "Ignore perfect wording", "Write and self-mark.")
      ]
    };
  }

  function detectTopic(text, context) {
    const known = [
      "quadratic equations", "calculus", "functions", "algebraic techniques", "trigonometry", "probability",
      "module b", "textual analysis", "thesis", "essay writing", "quote integration",
      "labour markets", "labor markets", "labour market", "labor market", "inflation", "monetary policy", "fiscal policy", "globalisation", "unemployment",
      "homeostasis", "enzymes", "genetics", "ecosystems", "cell division", "evolution"
    ];
    const found = known.find((item) => text.includes(item));
    if (found) return toTitle(found);
    const raw = context.task || context.title || "Priority Topic";
    return cleanTopic(raw);
  }

  function cleanTopic(raw) {
    const cleaned = String(raw || "")
      .replace(/^(complete|write|solve|mark|redo|build|start|attempt)\s+/i, "")
      .replace(/\b(\w+)(\s+\1\b){2,}/gi, "$1")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 58);
    if (!cleaned || /^turn$/i.test(cleaned) || /^(turn\s*){2,}$/i.test(cleaned)) return "Priority Topic";
    if (isLowQualityTopic(cleaned)) return "Priority Topic";
    return cleaned;
  }

  function isLowQualityTopic(value) {
    const words = value.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length >= 4 && new Set(words).size <= 2) return true;
    if (/^(turn|continue|ready|next|learn|example|practice)$/i.test(value)) return true;
    return false;
  }

  function q(stage, question, difficulty, time, focus, mistake, impact, ignore, placeholder) {
    return { stage, question, difficulty, time, focus, mistake, impact, ignore, placeholder };
  }

  function renderApproach(steps) {
    const list = document.querySelector("#focusApproachList");
    if (!list) return;
    list.innerHTML = steps.slice(0, 4).map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function updatePackProgress(stack) {
    if (!stack) return;
    const total = stack.querySelectorAll(".study-pack-question").length;
    const done = stack.querySelectorAll(".study-pack-question.is-complete").length;
    setText("#questionProgress", `${done}/${total} complete`);
  }

  function localFeedback(pack, question, answer) {
    const wordCount = String(answer || "").trim().split(/\s+/).filter(Boolean).length;
    const verdict = wordCount < 12 ? "Too short to mark properly." : "Good attempt. Now tighten the mark-winning part.";
    return [
      `Verdict: ${verdict}`,
      `What is costing marks: ${question.mistake}`,
      `Fix this now: Add one clear line that proves ${question.focus}.`,
      `Next targeted task: ${pack.weaknessRepair}`
    ].join("\n");
  }

  function formatFeedback(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

  function toTitle(value) {
    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function injectStudyPackStyles() {
    if (document.querySelector("#studyPackStyles")) return;
    const style = document.createElement("style");
    style.id = "studyPackStyles";
    style.textContent = `
      .study-pack{display:grid;gap:14px;border:1px solid rgba(103,232,249,.2)!important;background:linear-gradient(145deg,rgba(103,232,249,.105),rgba(255,255,255,.045))!important}
      .study-pack-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .study-pack-top span{display:inline-flex;min-height:30px;align-items:center;border-radius:999px;padding:0 11px;color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green));font-size:.74rem;font-weight:900}
      .study-pack-top em{font-style:normal;color:var(--muted);font-size:.78rem;font-weight:850}
      .subject-brief{border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:14px;background:rgba(255,255,255,.055)}
      .subject-brief strong{display:block;color:rgba(247,249,255,.95);font-size:1rem;margin-bottom:5px}
      .subject-brief p{color:var(--muted);line-height:1.45}
      .state-tuning{display:inline-flex;margin-top:10px;border-radius:999px;padding:6px 9px;background:rgba(255,255,255,.07);color:rgba(247,249,255,.82);font-weight:850}
      .study-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .study-tabs section{border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px;background:rgba(255,255,255,.052)}
      .study-tabs .study-learn,.study-tabs .study-next{grid-column:1/-1}
      .study-tabs strong{display:block;margin-bottom:6px;color:rgba(247,249,255,.9);font-size:.72rem;font-weight:900;text-transform:uppercase}
      .study-tabs p,.study-tabs li{color:var(--muted);line-height:1.48}
      .study-tabs ul,.study-tabs ol{margin:0;padding-left:18px}
      .subject-maths{--subject-a:#8bd3ff;--subject-b:#7c8cff}.subject-english{--subject-a:#f8d36a;--subject-b:#ff8db3}.subject-economics{--subject-a:#8ff0c5;--subject-b:#63b3ff}.subject-science{--subject-a:#a7f3d0;--subject-b:#67e8f9}.subject-general{--subject-a:#c4b5fd;--subject-b:#93c5fd}
      .study-pack[class*="subject-"],.study-pack-question[class*="subject-"]{border-color:color-mix(in srgb,var(--subject-a) 38%,transparent)!important}
      .study-pack[class*="subject-"] .study-pack-top span,.study-pack-question[class*="subject-"] .question-topline span{background:linear-gradient(135deg,var(--subject-a),var(--subject-b))}
      .study-pack-question{background:linear-gradient(145deg,color-mix(in srgb,var(--subject-a) 14%,transparent),rgba(255,255,255,.04))!important}
      .premium-feedback{font-size:.95rem}.premium-feedback br{display:block;margin:5px 0}
      @media(max-width:780px){.study-tabs{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function loadLearningFlowLayer() {
    if (window.__hscLearningFlowLoader || document.querySelector('script[src="./learning-flow.js"]')) return;
    window.__hscLearningFlowLoader = true;
    const script = document.createElement("script");
    script.src = "./learning-flow.js";
    script.defer = true;
    document.body.appendChild(script);
  }

  loadLearningFlowLayer();
})();
