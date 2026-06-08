(function () {
  if (window.__hscSubjectSprintProfilesLoaded) return;
  window.__hscSubjectSprintProfilesLoaded = true;

  const output = document.querySelector("#sprintOutput");
  if (!output) return;

  const profiles = [
    make(/economics|labour|unemployment|inflation|monetary|fiscal|exchange|trade|globalisation|growth/, "economics", "What is the mark-winning economic chain?", "Definition -> Cause-effect -> Diagram/data -> Link", ["Define the economic term.", "Build the cause-effect chain.", "Use a diagram, data or scenario.", "Finish with a linked judgement."], [
      ["Part 1 - Economic term", "Define the key economic idea", "Define {topic} using precise economic language, then state the variable it affects.", "Concept check", "Definition, variable, direction of change.", "Using everyday wording instead of economic terms.", "Definitions and variables create fast short-answer marks."],
      ["Part 2 - Cause-effect chain", "Build the economic logic", "Explain the cause-effect chain for {topic} using one clear change and one consequence.", "Economic reasoning", "Initial change, transmission mechanism, final effect.", "Jumping from cause to conclusion with no chain.", "Cause-effect chains are where most marks are won."],
      ["Part 3 - Diagram or data", "Apply the model", "Use a diagram, statistic or scenario to apply {topic} to an exam-style question.", "Application", "Diagram/data, shift or trend, explained effect.", "Drawing or quoting data without explanation.", "Application makes the answer HSC-ready."],
      ["Part 4 - Judgement", "Add the marker upgrade", "Add one limitation, trade-off or policy judgement for {topic}.", "Marker upgrade", "Judgement, trade-off, final link.", "Writing a perfect-world answer with no limitation.", "Judgement separates basic from stronger responses."]
    ]),
    make(/math|mathematics|calculus|algebra|function|trig|statistics|probability/, "maths", "What is the first mark-winning move?", "Method -> Working -> Check", ["Identify the method trigger.", "Write the first working line.", "Show substitutions clearly.", "Check signs, units or meaning."], [
      ["Part 1 - Method trigger", "Formula or first method line", "Identify the method for {topic}, then write the first working line before solving.", "Method recognition", "Formula, substitution, first working line.", "Starting without naming the method.", "Visible method earns marks even if arithmetic slips."],
      ["Part 2 - Accuracy under pressure", "Substitution and working accuracy", "Complete one {topic} problem with every substitution, bracket and sign shown.", "Core calculation", "Substitution, brackets, signs, units.", "Dropping a sign or skipping a line.", "Most lost marks are small working errors."],
      ["Part 3 - Exam transfer", "Harder application or graph interpretation", "Apply {topic} to a less familiar question and explain what your answer means.", "Transfer question", "Interpretation, final answer, reasonableness check.", "Giving a number without meaning.", "Transfer is what makes the question exam-real."],
      ["Part 4 - Error repair", "Fix the most likely error", "Find and correct one common {topic} mistake, then rewrite the clean solution.", "Marker upgrade", "Error, corrected working, final check.", "Moving on without rewriting the correction.", "Repair stops repeat mark loss."]
    ]),
    make(/english|module|text|essay|quote|analysis|creative/, "english", "What should come before adding quotes?", "Claim -> Evidence -> Effect -> Link", ["Use the question wording.", "Make a direct claim.", "Add evidence and explain effect.", "Link back to the argument."], [
      ["Part 1 - Argument first", "Thesis or topic sentence", "Write one direct argument for {topic} that answers the question, not the plot.", "Argument setup", "Question wording, judgement, text idea.", "Retelling the text.", "A clear argument controls the whole response."],
      ["Part 2 - Evidence chain", "Quote, technique and effect", "Build one quote-technique-effect chain for {topic} and link it back to the question.", "Analysis chain", "Evidence, technique, effect, link.", "Naming technique without meaning.", "This turns memorised quotes into marks."],
      ["Part 3 - Timed paragraph", "One complete analytical paragraph", "Write one timed paragraph for {topic} using argument, evidence, analysis and link.", "Paragraph practice", "Topic sentence, evidence, analysis, link.", "Dropping evidence without analysis.", "Paragraphs are the exam unit that wins marks."],
      ["Part 4 - Marker upgrade", "Improve a weak response", "Upgrade one weak {topic} paragraph with sharper judgement and analysis.", "Band lift", "Specificity, judgement, stronger link.", "Writing more words instead of sharper analysis.", "This teaches the difference between mid and strong responses."]
    ]),
    make(/biology|chemistry|physics|science|investigating science/, "science", "What makes this answer markable first?", "Concept -> Data/process -> Scientific effect", ["Name the concept or formula.", "Apply the data, process or scenario.", "Use units or sequence.", "Finish with the scientific effect."], [
      ["Part 1 - Core process", "Concept or process recall", "Define the key {topic} concept and write the process in the correct order.", "Concept check", "Terms, sequence, units if needed.", "Using everyday wording.", "Precise terms and sequence are quick marks."],
      ["Part 2 - Apply to data", "Calculation, graph or scenario", "Apply {topic} to one data, graph or calculation question and include units where needed.", "Data application", "Formula/process, data value, unit, conclusion.", "Describing data without explaining science.", "Data questions expose weak understanding quickly."],
      ["Part 3 - Practical/evaluation", "Method and reliability check", "Answer one practical or evaluation task for {topic} using variables, reliability or validity.", "Practical reasoning", "Variables, reliability, validity, improvement.", "Giving a generic improvement.", "These marks are often lost but recoverable."],
      ["Part 4 - Misconception repair", "Correct the common misconception", "Fix one common misconception in {topic}, then write the corrected explanation.", "Error repair", "Correct term, corrected cause, evidence.", "Repeating the wrong explanation.", "Repair makes the next response more accurate."]
    ]),
    make(/business|operations|marketing|finance|human resources/, "business", "What is the best first move?", "Strategy -> Action -> Performance effect", ["Define the strategy.", "Apply it to a business action.", "Link to performance.", "Add judgement if required."], [
      ["Part 1 - Syllabus term", "Define the business strategy", "Define the key {topic} term and state the business objective it affects.", "Term control", "Business function, strategy, objective.", "Using everyday business language.", "Clear terms anchor the answer."],
      ["Part 2 - Case link", "Apply one business example", "Apply {topic} to one business case or realistic scenario with a cause-effect link.", "Case application", "Strategy, action, performance effect.", "Name-dropping a case.", "Application beats memorised notes."],
      ["Part 3 - Strategy impact", "Explain performance effect", "Explain how {topic} changes cost, quality, revenue, efficiency or competitiveness.", "Impact chain", "Action, metric, result, link.", "Listing without linking to performance.", "This is where short-answer marks sit."],
      ["Part 4 - Judgement", "Recommend or evaluate", "Make one judgement about whether the {topic} strategy is effective and why.", "Evaluation", "Criteria, trade-off, recommendation.", "Saying it is good with no criterion.", "Judgement lifts the response."]
    ]),
    make(/history|ancient|modern/, "history", "What makes this answer historical?", "Evidence -> Explanation -> Significance", ["Anchor the evidence.", "Explain significance.", "Use evidence as proof.", "Return to the question."], [
      ["Part 1 - Evidence recall", "Key fact and source anchor", "Lock in one key fact, date, source or historian for {topic}.", "Evidence check", "Specific evidence, context, relevance.", "Writing broad context with no evidence.", "Specific evidence makes answers exam-ready."],
      ["Part 2 - Cause and effect", "Explain significance", "Explain why {topic} mattered using a clear cause-effect or significance chain.", "Significance chain", "Cause, effect, historical judgement.", "Narrating without significance.", "Analysis beats storytelling."],
      ["Part 3 - Source/argument", "Apply evidence to a question", "Use one source or evidence point to answer a {topic} exam-style question.", "Evidence application", "Quote/detail, inference, link.", "Describing the source only.", "This converts memory into marks."],
      ["Part 4 - Judgement upgrade", "Sharpen the historical judgement", "Upgrade a basic {topic} answer with clearer judgement and stronger evidence.", "Marker upgrade", "Judgement, evidence, qualification.", "Adding facts without argument.", "Judgement separates stronger responses."]
    ]),
    make(/legal|law|crime|human rights|family|consumer/, "legal", "What makes this legal, not moral?", "Law/example -> Criterion -> Judgement", ["Define the legal concept.", "Use one authority.", "Apply a criterion.", "Make a balanced judgement."], [
      ["Part 1 - Legal term", "Define the law or mechanism", "Define the key legal concept in {topic} and name the relevant mechanism.", "Legal definition", "Law, body, mechanism, right or duty.", "Writing morally instead of legally.", "Precise legal language wins fast marks."],
      ["Part 2 - Apply authority", "Use legislation or case/example", "Apply one law, case, media example or reform to {topic}.", "Authority application", "Authority, issue, effect.", "Name-dropping a case.", "Authority makes the answer markable."],
      ["Part 3 - Effectiveness", "Assess effectiveness", "Assess whether the legal response to {topic} is effective using one criterion.", "Effectiveness", "Accessibility, enforceability, fairness, responsiveness.", "Saying effective without a criterion.", "Effectiveness language is central."],
      ["Part 4 - Balanced judgement", "Improve the final judgement", "Write a balanced judgement on {topic} with one strength and one limitation.", "Marker upgrade", "Strength, limitation, final judgement.", "Only arguing one side.", "Balance lifts the answer."]
    ]),
    make(/geography|ecosystem|urban|megacity|global/, "geography", "What makes this geographic?", "Place/process -> Evidence -> Impact", ["Name place/process/scale.", "Explain the spatial chain.", "Use evidence.", "Judge the response if needed."], [
      ["Part 1 - Concept and place", "Define the geographic concept", "Define {topic} and anchor it to one place, process or scale.", "Concept + place", "Place, process, scale.", "Writing without location or scale.", "Place-specific language improves answers fast."],
      ["Part 2 - Process chain", "Explain the geographic process", "Explain one process in {topic} from cause to spatial impact.", "Process chain", "Cause, process, spatial effect.", "Listing features without process.", "Process explanation wins marks."],
      ["Part 3 - Data or fieldwork", "Use evidence", "Use one data point, map clue, fieldwork detail or case example for {topic}.", "Evidence application", "Data, pattern, interpretation.", "Describing data without meaning.", "Evidence makes it exam-real."],
      ["Part 4 - Management/evaluation", "Judge a response", "Evaluate one management strategy or response for {topic}.", "Evaluation", "Strategy, outcome, limitation.", "No evaluation criteria.", "Evaluation is the higher-mark move."]
    ]),
    make(/pdhpe|health|sport|training|fitness|ottawa|body systems|skill acquisition/, "pdhpe", "What is the exact health or performance link?", "Concept -> Factor -> Impact -> Example", ["Define the concept.", "Name the factor.", "Explain the impact.", "Apply it to the scenario."], [
      ["Part 1 - Key concept", "Define the PDHPE idea", "Define {topic} and identify whether it is about health, performance, training or behaviour.", "Concept check", "Definition, category, relevant factor.", "Giving a general life-advice answer.", "Precise syllabus language wins quick marks."],
      ["Part 2 - Factor impact", "Explain the effect", "Explain how one factor in {topic} changes health status, performance or participation.", "Impact chain", "Factor, mechanism, outcome.", "Listing factors without explaining impact.", "Impact chains turn memorised notes into marks."],
      ["Part 3 - Scenario application", "Apply to a person or group", "Apply {topic} to one athlete, population group or practical scenario.", "Application", "Scenario, relevant factor, specific effect.", "Using an example that is not linked to the question.", "Application is the difference between knowing and answering."],
      ["Part 4 - Strategy judgement", "Recommend or evaluate", "Recommend or evaluate one strategy for {topic} with a clear reason.", "Marker upgrade", "Strategy, reason, limitation or benefit.", "Saying a strategy works without explaining why.", "Judgement lifts the response."]
    ]),
    make(/studies of religion|sor|religion|islam|christianity|judaism|buddhism|hinduism|religious tradition/, "studies of religion", "What belief or practice is being tested?", "Belief/practice -> Evidence -> Significance -> Link", ["Name the tradition and concept.", "Use evidence.", "Explain significance.", "Link back to the question."], [
      ["Part 1 - Belief or practice", "Lock the core idea", "Define the key belief, practice or ethical teaching in {topic}.", "Concept check", "Tradition, belief/practice, meaning.", "Writing a broad description of religion.", "Specific tradition language creates fast marks."],
      ["Part 2 - Evidence link", "Use sacred text or teaching", "Connect {topic} to one teaching, text, authority or example.", "Evidence application", "Teaching, source/example, relevance.", "Name-dropping evidence without explaining it.", "Evidence makes the answer credible."],
      ["Part 3 - Significance", "Explain why it matters", "Explain the significance of {topic} for adherents or the tradition.", "Significance chain", "Belief/practice, behaviour, significance.", "Describing what happens without why it matters.", "Significance is usually where the marks sit."],
      ["Part 4 - Judgement lift", "Upgrade the response", "Add a clearer judgement or comparison for {topic} where the question requires it.", "Marker upgrade", "Judgement, comparison or consequence.", "Writing more content without a clear point.", "This makes the answer feel exam-level."]
    ]),
    make(/visual arts|art|artist|artwork|body of work|frames|conceptual framework|practice/, "visual arts", "What is the artwork relationship being tested?", "Artist/artwork -> Practice/frame -> Evidence -> Interpretation", ["Anchor artist/artwork.", "Use visual evidence.", "Apply frame or framework.", "Make an interpretation."], [
      ["Part 1 - Artist/artwork anchor", "Name the evidence", "Anchor {topic} to one artist, artwork, practice or frame.", "Evidence check", "Artist/artwork, date/context if known, frame/practice.", "Writing vague impressions.", "Specific artwork evidence makes the response markable."],
      ["Part 2 - Visual evidence", "Describe what proves the point", "Use one visual or material detail from {topic} and explain what it communicates.", "Visual analysis", "Material, technique, symbol, meaning.", "Naming a feature without interpretation.", "Visual evidence turns opinion into analysis."],
      ["Part 3 - Conceptual framework", "Connect relationships", "Explain how artist, artwork, world or audience relationships shape {topic}.", "Framework application", "Relationship, context, meaning.", "Using framework words as labels only.", "Relationships are the exam move."],
      ["Part 4 - Interpretation upgrade", "Make the judgement stronger", "Upgrade a basic {topic} response with a sharper interpretation and supporting detail.", "Marker upgrade", "Interpretation, evidence, final judgement.", "Adding description instead of analysis.", "Interpretation lifts the band."]
    ])
  ];

  const fallback = make(/.*/, "general", "What is the best first move?", "Concept -> Application -> Link", ["Name the exact task.", "Use subject-specific terms.", "Apply it to the question.", "Check the trap."], [
    ["Part 1 - Core idea", "Define the tested idea", "Define the key idea in {topic} in exam-ready language.", "Concept check", "Term, condition, example.", "Starting with broad notes.", "Definitions create quick confidence."],
    ["Part 2 - Apply it", "Use it in a question", "Apply {topic} to one short exam-style scenario.", "Application", "Idea, example, direct link.", "Example not linked to the question.", "Application turns knowledge into marks."],
    ["Part 3 - Fix the trap", "Correct the common mistake", "Correct one common mistake in {topic}, then rewrite the answer.", "Error repair", "Mistake, correction, rule.", "Reading the fix without rewriting.", "Repair prevents repeat mark loss."],
    ["Part 4 - Harder transfer", "Attempt the harder version", "Attempt one harder {topic} task and finish with a final link or judgement.", "Transfer", "Harder prompt, structure, final link.", "Stopping before the final answer.", "Transfer builds exam confidence."]
  ]);

  const observer = new MutationObserver(queueApply);
  observer.observe(output, { childList: true, subtree: true });
  document.addEventListener("click", function (event) {
    const card = event.target.closest("[data-subject-sprint-part]");
    if (card) window.__hscActiveSubjectSprintPart = Number(card.dataset.subjectSprintPart || 1);
  }, true);
  queueApply();

  function queueApply() {
    clearTimeout(queueApply.timer);
    queueApply.timer = setTimeout(applyProfiles, 120);
  }

  function applyProfiles() {
    const subject = value("#subjectsInput") || "HSC";
    const topic = value("#weakTopicsInput") || "your weak topic";
    const profile = profileFor(subject, topic);
    const parts = profile.parts.slice(0, visibleCount(value("#studyTimeInput")));
    const cards = Array.from(document.querySelectorAll(".evening-plan .execution-card, .action-card-stack:not(.action-card-source) .execution-card"))
      .filter(function (card) { return card.offsetParent !== null || !card.hidden; });
    if (!cards.length) return;
    cards.forEach(function (card, index) {
      if (index >= parts.length) {
        card.hidden = true;
        card.style.display = "none";
      } else {
        paintOuterCard(card, fillPart(parts[index], topic), index);
      }
    });
    paintOpenQuestion(profile, topic);
  }

  function paintOuterCard(card, part, index) {
    card.hidden = false;
    card.style.display = "";
    card.dataset.subjectSprintPart = String(index + 1);
    set(card, ".execution-card-top span", part.label);
    set(card, "h3", part.title);
    set(card, ".do-now", part.task);
    setGrid(card, "Highest ROI Task", part.task);
    setGrid(card, "Why this first", part.impact);
    setGrid(card, "Question Type", part.type);
    setGrid(card, "Focus Point", part.focus);
    setRisk(card, "Most Common Mistake", part.trap);
    setRisk(card, "Estimated Marks Impact", part.impact);
  }

  function paintOpenQuestion(profile, topic) {
    const cards = Array.from(document.querySelectorAll("#questionStack .question-card"));
    if (!cards.length) return;
    cards.slice(1).forEach(function (card) {
      card.hidden = true;
      card.style.display = "none";
    });
    const part = fillPart(profile.parts[Math.max(0, (window.__hscActiveSubjectSprintPart || 1) - 1)] || profile.parts[0], topic);
    const first = cards[0];
    set(first, ".learning-card-head span", "Card 1 of 1");
    set(first, ".learning-card-head strong", part.title + " - one timed card");
    set(first, ".learning-card-head em", "#");
    setWhy(first, part);
    setList(first, ".attack-section ol", profile.steps);
    set(first, ".concept-section .micro-prompt", profile.firstMove);
    setOptions(first, part);
    set(first, ".short-response-section .micro-prompt", "Write 1-3 sentences applying " + topic + " to this task.");
    setCriteria(first, part);
    setExam(first, part, profile.structure);
  }

  function make(regex, key, firstMove, structure, steps, rows) {
    return { regex, key, firstMove, structure, steps, parts: rows.map(function (row) {
      return { label: row[0], title: row[1], task: row[2], type: row[3], focus: row[4], trap: row[5], impact: row[6] };
    }) };
  }

  function profileFor(subject, topic) {
    const text = (subject + " " + topic).toLowerCase();
    return profiles.find(function (profile) { return profile.regex.test(text); }) || fallback;
  }

  function fillPart(part, topic) {
    const cleanTopic = topic || "your weak topic";
    return Object.assign({}, part, {
      task: String(part.task).replace(/\{topic\}/g, cleanTopic),
      focus: String(part.focus).replace(/\{topic\}/g, cleanTopic),
      trap: String(part.trap).replace(/\{topic\}/g, cleanTopic),
      impact: String(part.impact).replace(/\{topic\}/g, cleanTopic)
    });
  }

  function visibleCount(raw) {
    const minutes = parseMinutes(raw);
    if (minutes <= 60) return 2;
    if (minutes <= 105) return 3;
    return 4;
  }

  function parseMinutes(raw) {
    const text = String(raw || "").toLowerCase();
    const hour = text.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/);
    const minute = text.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/);
    if (hour) return Math.round(Number(hour[1]) * 60) + (minute ? Number(minute[1]) : 0);
    if (minute) return Number(minute[1]);
    const number = text.match(/\d+(?:\.\d+)?/);
    if (!number) return 90;
    const value = Number(number[0]);
    return value <= 6 ? Math.round(value * 60) : Math.round(value);
  }

  function setWhy(card, part) {
    const grid = card.querySelector(".why-grid");
    if (!grid) return;
    grid.innerHTML = [
      ["Learning job", part.type],
      ["Priority", "HIGH"],
      ["Focus", part.focus],
      ["Marks Impact", part.impact],
      ["Trap that costs marks", part.trap],
      ["Ignore", "Skip passive note rewriting until this card is finished."]
    ].map(function (row) { return "<div><b>" + escapeHtml(row[0]) + "</b><span>" + escapeHtml(row[1]) + "</span></div>"; }).join("");
  }

  function setOptions(card, part) {
    const options = card.querySelector(".learning-mcq-options");
    if (!options) return;
    options.innerHTML = [["A", part.type], ["B", "Rewrite all notes before attempting."], ["C", "Skip to a different topic."], ["D", "Write everything remembered, even if it misses the question."]]
      .map(function (row) { return '<button type="button" class="mcq-option learning-mcq-option" data-learning-choice="' + row[0] + '" data-learning-correct="A"><span>' + row[0] + '</span><b>' + escapeHtml(row[1]) + '</b></button>'; })
      .join("");
  }

  function setCriteria(card, part) {
    const grid = card.querySelector(".criteria-grid");
    if (!grid) return;
    grid.innerHTML = "<div><b>Success criteria</b><span>Direct answer + subject-specific term + clear link to the task.</span></div>" +
      "<div><b>Key points expected</b><span>" + escapeHtml(part.focus) + "</span></div>" +
      "<div><b>Warning</b><span>" + escapeHtml(part.trap) + "</span></div>";
  }

  function setExam(card, part, structure) {
    const meta = card.querySelector(".exam-meta-row");
    if (meta) meta.innerHTML = "<span>4 Marks</span><span>Recommended Time: 6 min</span><span>Structure: " + escapeHtml(structure) + "</span>";
    set(card, ".exam-application-section .question-text", part.task);
  }

  function setGrid(card, label, text) {
    const block = Array.from(card.querySelectorAll(".card-grid div")).find(function (item) {
      return item.querySelector("strong") && item.querySelector("strong").textContent.trim() === label;
    });
    const node = block && block.querySelector("span");
    if (node) node.textContent = text;
  }

  function setRisk(card, label, text) {
    const block = Array.from(card.querySelectorAll(".risk-row p")).find(function (item) {
      return item.querySelector("strong") && item.querySelector("strong").textContent.trim() === label;
    });
    if (!block) return;
    const strong = block.querySelector("strong");
    block.textContent = "";
    if (strong) block.appendChild(strong);
    block.append(text);
  }

  function setList(card, selector, items) {
    const list = card.querySelector(selector);
    if (list) list.innerHTML = items.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("");
  }

  function set(root, selector, text) {
    const node = root.querySelector(selector);
    if (node) node.textContent = text;
  }

  function value(selector) {
    const node = document.querySelector(selector);
    return node && node.value ? node.value.trim() : "";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
})();
