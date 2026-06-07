(function () {
  if (window.__hscLearningJourneyLoaded) return;
  window.__hscLearningJourneyLoaded = true;

  const observer = new MutationObserver(queueApplyJourney);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  queueApplyJourney();

  function queueApplyJourney() {
    clearTimeout(queueApplyJourney.timer);
    queueApplyJourney.timer = setTimeout(applyJourney, 90);
  }

  function applyJourney() {
    const cards = Array.from(document.querySelectorAll("#questionStack .question-card"));
    if (!cards.length || !cards.some((card) => card.querySelector(".learning-card-head"))) return;
    const topic = readTopic(cards);
    const journeyTotal = 1;

    cards.slice(1).forEach((card) => {
      card.hidden = true;
      card.dataset.learningJourneyStage = "extra-hidden";
    });

    cards.slice(0, journeyTotal).forEach((card, index) => {
      const stage = buildStage(card, topic);
      applyStage(card, stage, index, journeyTotal);
    });
  }

  function applyStage(card, stage, index, total) {
    card.dataset.learningJourneyStage = stage.key;

    setText(card, ".learning-card-head span", `Card ${index + 1} of ${total}`);
    setText(card, ".learning-card-head strong", stage.title);
    setText(card, ".learning-card-head em", "#".repeat(index + 1) + "-".repeat(Math.max(0, total - index - 1)));

    setWhyGrid(card, stage);
    setList(card, ".attack-section ol", stage.attack);
    setConcept(card, stage);
    setText(card, ".short-response-section .micro-prompt", stage.shortPrompt);
    setCriteria(card, stage);
    setExam(card, stage);

    const reflection = card.querySelector(".reflection-section .question-answer");
    if (reflection && reflection.firstChild) {
      reflection.firstChild.textContent = stage.reflection;
    }
  }

  function buildStage(card, topic) {
    const text = `${topic} ${card.textContent || ""}`;
    const labour = /labour|labor|wage|employment|unemployment|participation|productivity|minimum wage|skills mismatch/i.test(text);
    return labour ? labourSingleStage(text) : generalSingleStage(topic || "this topic", text);
  }

  function labourSingleStage(text) {
    if (/minimum wage|wage floor|equity|employment risk/i.test(text)) return labourTopicStages().minimumWage;
    if (/productivity|skills mismatch|training|structural/i.test(text)) return labourTopicStages().productivity;
    if (/unemployment|underemployment|participation|labour force|labor force/i.test(text)) return labourTopicStages().measures;
    if (/supply|equilibrium wage|shortage|surplus/i.test(text)) return labourTopicStages().supply;
    return labourTopicStages().demand;
  }

  function labourTopicStages() {
    return {
      demand: {
        key: "single-card",
        title: "Labour Demand - one timed card",
        job: "Knowledge check",
        focus: "Define labour demand as firms' demand for workers, derived from demand for goods and services.",
        impact: "Easy marks: this is the base idea behind most labour market questions.",
        mistake: "Calling labour demand 'people wanting jobs'. That is labour supply.",
        ignore: "Skip policy evaluation until the core term is clear.",
        attack: ["Define labour demand.", "State who demands labour.", "Link it to demand for output.", "Keep it to one clean idea."],
        stem: "What is labour demand?",
        options: [
          ["A", "Workers looking for jobs."],
          ["B", "Firms' willingness and ability to hire workers at different wage rates."],
          ["C", "The number of people counted as unemployed."],
          ["D", "The government setting a minimum wage."]
        ],
        correct: "B",
        shortPrompt: "In one sentence, define labour demand without using the word jobs as your main explanation.",
        criteria: "Firm perspective + wage rate + derived demand idea.",
        keyPoints: "Firms demand labour because workers help produce goods and services.",
        examQuestion: "Define labour demand and explain why it is called derived demand.",
        marks: "3 Marks",
        time: "4 min",
        structure: "Definition -> Firm perspective -> Derived demand link",
        reflection: "What word or phrase would make your definition more economic?"
      },
      supply: {
        key: "single-card",
        title: "Labour Supply and Equilibrium Wage - one timed card",
        job: "Diagram and market logic",
        focus: "Show how labour supply and labour demand interact to create an equilibrium wage and employment level.",
        impact: "High value because diagrams and equilibrium language lift short-answer marks quickly.",
        mistake: "Moving the wrong curve or saying wages change without naming the new equilibrium.",
        ignore: "Skip policy judgement until the diagram logic is correct.",
        attack: ["Name the curve that shifts.", "State the effect on equilibrium wage.", "State the effect on employment.", "Link the diagram back to the question."],
        stem: "If labour supply increases while labour demand is unchanged, what is the likely market effect?",
        options: [
          ["A", "Equilibrium wage tends to fall and employment may rise."],
          ["B", "Equilibrium wage must rise because more workers want jobs."],
          ["C", "Labour demand shifts right automatically."],
          ["D", "The participation rate becomes zero."]
        ],
        correct: "A",
        shortPrompt: "In 1-2 sentences, explain the new equilibrium after labour supply increases.",
        criteria: "Shift identified + wage effect + employment effect.",
        keyPoints: "More labour supply can place downward pressure on wages if demand is unchanged.",
        examQuestion: "Use a labour market diagram to explain how an increase in labour supply may affect wage rates and employment.",
        marks: "4 Marks",
        time: "6 min",
        structure: "Curve shift -> New equilibrium -> Wage/employment effect",
        reflection: "Which curve are you most likely to shift incorrectly?"
      },
      measures: {
        key: "single-card",
        title: "Unemployment and Participation - one timed card",
        job: "Measure and apply",
        focus: "Distinguish unemployment, underemployment and participation rate before explaining an economic effect.",
        impact: "Fast marks because labour force measures are often tested in short answers.",
        mistake: "Counting everyone without a job as unemployed, including people not in the labour force.",
        ignore: "Do not jump to policy before the measure is correct.",
        attack: ["Define the measure.", "State who is included or excluded.", "Apply it to the scenario.", "Link to consumption, AD or growth."],
        stem: "Which person is counted as unemployed?",
        options: [
          ["A", "A person not working, actively seeking work, and available to start."],
          ["B", "A retired person not seeking work."],
          ["C", "A full-time student not looking for work."],
          ["D", "A part-time worker who wants more hours."]
        ],
        correct: "A",
        shortPrompt: "In 1-2 sentences, explain the difference between unemployment and underemployment.",
        criteria: "Correct measure + inclusion rule + economic effect.",
        keyPoints: "Unemployment excludes people not actively looking for work; underemployment involves insufficient hours.",
        examQuestion: "Explain how a rise in unemployment can affect household consumption and aggregate demand.",
        marks: "4 Marks",
        time: "6 min",
        structure: "Measure -> Income effect -> Consumption -> AD link",
        reflection: "Which labour force measure are you most likely to confuse?"
      },
      productivity: {
        key: "single-card",
        title: "Productivity and Skills Mismatch - one timed card",
        job: "Cause-effect chain",
        focus: "Link productivity or skills mismatch to labour demand, wages and structural unemployment.",
        impact: "High ROI because this turns definitions into strong economic reasoning.",
        mistake: "Saying productivity automatically raises wages without explaining labour demand.",
        ignore: "Skip generic 'training is good' claims.",
        attack: ["Name the productivity or skills change.", "Explain the effect on firms' demand for labour.", "Link to wage/employment outcomes.", "Use one industry example if possible."],
        stem: "How can a skills mismatch contribute to structural unemployment?",
        options: [
          ["A", "Workers may lack the skills demanded by available jobs."],
          ["B", "All unemployment is caused by low wages."],
          ["C", "Workers are automatically more productive after losing jobs."],
          ["D", "Labour demand and skills are unrelated."]
        ],
        correct: "A",
        shortPrompt: "In 1-2 sentences, link productivity or skills mismatch to labour demand.",
        criteria: "Cause + labour demand link + wage/employment effect.",
        keyPoints: "Skills mismatch can leave vacancies unfilled while some workers remain unemployed.",
        examQuestion: "Explain how higher labour productivity or skills mismatch may affect labour demand and employment.",
        marks: "4 Marks",
        time: "7 min",
        structure: "Cause -> Labour demand -> Wage/employment effect -> Example",
        reflection: "Where does your productivity chain usually need one more link?"
      },
      minimumWage: {
        key: "single-card",
        title: "Minimum Wage Trade-off - one timed card",
        job: "Marker upgrade",
        focus: "Assess both equity benefits and employment risks of a minimum wage above equilibrium.",
        impact: "This is a higher-mark card because it teaches balance and judgement.",
        mistake: "Only arguing one side of the minimum wage effect.",
        ignore: "Do not make a moral claim without labour market logic.",
        attack: ["Define the wage floor.", "Explain the equity benefit.", "Explain the possible employment risk.", "Make a balanced judgement."],
        stem: "Why can a minimum wage create both benefits and risks?",
        options: [
          ["A", "It can raise incomes for some workers but may increase costs and reduce employment demand."],
          ["B", "It always increases employment."],
          ["C", "It has no effect on business costs."],
          ["D", "It only affects exports."]
        ],
        correct: "A",
        shortPrompt: "Upgrade this basic answer: 'Minimum wages help workers.'",
        criteria: "Equity benefit + cost/employment risk + balanced judgement.",
        keyPoints: "Strong answers explain the trade-off, not just one side.",
        examQuestion: "Assess the impact of a minimum wage above equilibrium on workers and firms.",
        marks: "6 Marks",
        time: "7 min",
        structure: "Benefit -> Risk -> Diagram logic -> Judgement",
        reflection: "What would make your answer balanced enough for higher marks?"
      }
    };
  }

  function generalSingleStage(topic, text) {
    const isUpgrade = /upgrade|compare|evaluate|assess|marker/i.test(text);
    const key = isUpgrade ? "upgrade" : "single-card";
    return {
      key,
      title: `${topic} - one timed card`,
      job: isUpgrade ? "Marker upgrade" : "Single-card learning sprint",
      focus: `Answer one specific ${topic} task from concept to exam application.`,
      impact: "High because this card turns one weak area into one complete attempt.",
      mistake: "Opening too many related questions instead of completing one properly.",
      ignore: "Skip extra question variants until this card is finished.",
      attack: ["Define the tested idea.", "Check the common trap.", "Apply it to the scenario.", "Write the exam response."],
      stem: `What is the first move for this ${topic} card?`,
      options: [["A", "Answer the exact skill being tested."], ["B", "Rewrite all your notes first."], ["C", "Skip to a different topic."], ["D", "Write every fact you remember."]],
      correct: "A",
      shortPrompt: `Write 1-3 sentences applying ${topic} to the current question.`,
      criteria: "Direct answer + clear reason + link to the task.",
      keyPoints: `Use the specific ${topic} idea, not a generic study paragraph.`,
      examQuestion: `Complete one exam-style response on ${topic}.`,
      marks: isUpgrade ? "5 Marks" : "4 Marks",
      time: "6 min",
      structure: isUpgrade ? "Compare -> Upgrade -> Marker reason" : "Concept -> Trap -> Application -> Exam answer",
      reflection: "What is the one rule you will carry into the next card?"
    };
  }

  function setWhyGrid(card, stage) {
    const values = [
      ["Learning job", stage.job],
      ["Priority", "HIGH"],
      ["Focus", stage.focus],
      ["Marks Impact", stage.impact],
      ["Trap that costs marks", stage.mistake],
      ["Ignore", stage.ignore]
    ];
    const grid = card.querySelector(".why-grid");
    if (!grid) return;
    grid.innerHTML = values.map(([label, value]) => `<div><b>${escapeHtml(label)}</b><span>${escapeHtml(value)}</span></div>`).join("");
  }

  function setConcept(card, stage) {
    setText(card, ".concept-section .micro-prompt", stage.stem);
    const options = card.querySelector(".learning-mcq-options");
    const result = card.querySelector("[data-learning-result]");
    if (options) {
      options.innerHTML = stage.options.map(([letter, text]) => `
        <button type="button" class="mcq-option learning-mcq-option" data-learning-choice="${escapeHtml(letter)}" data-learning-correct="${escapeHtml(stage.correct)}">
          <span>${escapeHtml(letter)}</span><b>${escapeHtml(text)}</b>
        </button>
      `).join("");
    }
    if (result) result.hidden = true;
  }

  function setCriteria(card, stage) {
    const grid = card.querySelector(".criteria-grid");
    if (!grid) return;
    grid.innerHTML = `
      <div><b>Success criteria</b><span>${escapeHtml(stage.criteria)}</span></div>
      <div><b>Key points expected</b><span>${escapeHtml(stage.keyPoints)}</span></div>
      <div><b>Warning</b><span>${escapeHtml(stage.mistake)}</span></div>
    `;
  }

  function setExam(card, stage) {
    const meta = card.querySelector(".exam-meta-row");
    if (meta) {
      meta.innerHTML = `
        <span>${escapeHtml(stage.marks)}</span>
        <span>Recommended Time: ${escapeHtml(stage.time)}</span>
        <span>Structure: ${escapeHtml(stage.structure)}</span>
      `;
    }
    setText(card, ".exam-application-section .question-text", stage.examQuestion);
  }

  function setList(card, selector, items) {
    const list = card.querySelector(selector);
    if (!list) return;
    list.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function setText(root, selector, value) {
    const node = root.querySelector ? root.querySelector(selector) : document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function readTopic(cards) {
    const input = document.querySelector("#weakTopicsInput")?.value?.trim();
    if (input) return input;
    return cards.map((card) => card.textContent || "").join(" ").slice(0, 500);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
