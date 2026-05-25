(function () {
  if (window.__hscCardsFallbackLoaded) return;
  window.__hscCardsFallbackLoaded = true;

  const output = document.querySelector("#sprintOutput");
  if (!output) return;

  let fallbackCards = [];
  let queued = false;

  const observer = new MutationObserver(queueInject);
  observer.observe(output, { childList: true, subtree: true });
  document.addEventListener("submit", () => setTimeout(queueInject, 900), true);
  output.addEventListener("click", handleFallbackClick, true);
  queueInject();

  function queueInject() {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      injectCardsIfMissing();
    }, 350);
  }

  function injectCardsIfMissing() {
    if (output.querySelector(".action-card-stack")) return;
    if (output.querySelector(".empty-plan") || output.querySelector(".loading-plan")) return;

    const hasPlanText = output.querySelector(".ai-plan-text") || /plan|study|revision|practice|exam/i.test(output.textContent || "");
    if (!hasPlanText) return;

    const details = readDetails();
    fallbackCards = buildFallbackCards(details);
    const stack = document.createElement("div");
    stack.className = "action-card-stack fallback-action-cards";
    stack.innerHTML = fallbackCards.map(renderFallbackCard).join("");

    const heading = document.createElement("div");
    heading.className = "start-now-heading";
    heading.innerHTML = "<strong>Start Now Cards</strong><span>The plan stays above. These buttons open the question session.</span>";

    output.appendChild(heading);
    output.appendChild(stack);
  }

  function handleFallbackClick(event) {
    const button = event.target.closest("[data-fallback-card-index]");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const card = fallbackCards[Number(button.dataset.fallbackCardIndex)];
    if (card && typeof window.startPracticeSession === "function") {
      window.startPracticeSession(card);
    }
  }

  function readDetails() {
    return {
      subjects: split("#subjectsInput"),
      topics: split("#weakTopicsInput"),
      studyTime: value("#studyTimeInput") || "90 minutes tonight"
    };
  }

  function split(selector) {
    return value(selector)
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function value(selector) {
    const node = document.querySelector(selector);
    return node ? node.value.trim() : "";
  }

  function buildFallbackCards(details) {
    const subjects = details.subjects.length ? details.subjects : ["HSC"];
    const topics = details.topics.length ? details.topics : ["weakest topic"];
    return [0, 1, 2].map((index) => makeCard(subjects[index] || subjects[0], topics[index] || topics[0], index));
  }

  function makeCard(subject, topic, index) {
    const subjectText = `${subject} ${topic}`.toLowerCase();
    const type = subjectType(subjectText);
    const templates = {
      maths: {
        questionType: "Timed problem set",
        task: `Complete 5 exam-style questions on ${topic}. Show every line of working and check signs.`,
        focus: "Correct method, full working, final answer check.",
        mistake: "Skipping working or making sign errors.",
        ignore: "Pretty notes before attempting questions."
      },
      english: {
        questionType: "Timed paragraph",
        task: `Write one analytical paragraph on ${topic}. Include thesis link, evidence, technique, effect and final link.`,
        focus: "Argument depth and evidence integration.",
        mistake: "Dropping quotes without explaining the effect.",
        ignore: "Rewriting the whole essay plan."
      },
      economics: {
        questionType: "Cause-effect chain + paragraph",
        task: `Build one cause-effect chain for ${topic}, then turn it into a 6-mark economics paragraph.`,
        focus: "Definition, chain logic, terminology, example/statistic.",
        mistake: "Writing English-style technique instead of economic cause and effect.",
        ignore: "Long theory summaries without an exam paragraph."
      },
      science: {
        questionType: "Short-answer drill",
        task: `Answer 3 short-response questions on ${topic}. Use precise scientific terms and process order.`,
        focus: "Accuracy, process sequence and key terminology.",
        mistake: "Describing the result without explaining the mechanism.",
        ignore: "Copying textbook paragraphs."
      },
      general: {
        questionType: "HSC-style practice",
        task: `Complete one timed HSC-style response on ${topic}, then mark and fix one weak point.`,
        focus: "Answer the directive verb and produce assessable work.",
        mistake: "Reading about the topic without attempting a response.",
        ignore: "Passive revision."
      }
    };
    const template = templates[type];

    return {
      title: index === 0 ? "Tonight's Highest ROI Task" : index === 1 ? "Second Practice Rep" : "Final Fix Drill",
      topic,
      highestRoiTask: template.task,
      doThisNow: template.task,
      questionType: template.questionType,
      resourceName: "Internal HSC-style practice",
      resourceUrl: "",
      timeRequired: index === 0 ? "25 minutes" : "15 minutes",
      difficulty: index === 2 ? "Medium-hard" : "Medium",
      focusPoint: template.focus,
      howToApproach: approachFor(type, topic),
      mostCommonMistake: template.mistake,
      whatNotToFocusOn: template.ignore,
      estimatedMarksImpact: "High ROI because it turns weak content into an exam-style attempt.",
      buttonText: "Start Practice",
      questions: questionsFor(type, topic)
    };
  }

  function subjectType(text) {
    if (/math|quadratic|algebra|calculus|function|graph/.test(text)) return "maths";
    if (/english|module|thesis|quote|essay|paragraph|textual/.test(text)) return "english";
    if (/economic|labour|labor|market|wage|inflation|unemployment|policy|aggregate|rba|cash rate/.test(text)) return "economics";
    if (/biology|science|enzyme|cell|homeostasis|genetic|chemical/.test(text)) return "science";
    return "general";
  }

  function approachFor(type, topic) {
    if (type === "economics") return ["Define the key term first.", `Build a cause-effect chain for ${topic}.`, "Turn the chain into a paragraph with one example."];
    if (type === "english") return ["Write the argument before the quote.", "Add evidence and technique.", "Explain effect and link to the question."];
    if (type === "maths") return ["Write the formula or method first.", "Show each working step.", "Check the final answer against the question."];
    if (type === "science") return ["Name the process.", "Explain the steps in order.", "Use the exact scientific terms."];
    return ["Attempt first.", "Mark one weakness.", "Redo the weakest part immediately."];
  }

  function questionsFor(type, topic) {
    if (type === "economics") {
      return [
        q(`Define ${topic} in an economics context and identify one key indicator linked to it.`, "Warm-up", "Definition and terminology", "Vague everyday language."),
        q(`Construct a cause-effect chain showing how a change in ${topic} affects households, firms or the Australian economy.`, "Core", "Logical links", "Skipping the transmission mechanism."),
        q(`Write a 6-mark paragraph explaining one policy response related to ${topic}.`, "Core", "Policy, effect and judgement", "No economic judgement."),
        q(`Create a 12-mark plan for an extended response on ${topic}. Include two arguments and one statistic/example placeholder.`, "Challenge", "Structure and evidence", "Listing points without argument.")
      ];
    }
    if (type === "english") {
      return [
        q(`Write one thesis sentence for ${topic}.`, "Warm-up", "Clear argument", "Topic sentence instead of thesis."),
        q(`Write one analytical paragraph using evidence, technique, effect and link.`, "Core", "Analysis depth", "Quote dumping."),
        q(`Rewrite the weakest sentence to make the analysis more specific.`, "Fix", "Precision", "Generic wording.")
      ];
    }
    if (type === "maths") {
      return [
        q(`Complete two warm-up questions on ${topic}. Show full working.`, "Warm-up", "Method accuracy", "Mental steps not shown."),
        q(`Complete three medium exam-style questions on ${topic}.`, "Core", "Speed and accuracy", "Sign or substitution errors."),
        q(`Attempt one harder application question on ${topic}.`, "Challenge", "Transfer", "Using the wrong method.")
      ];
    }
    if (type === "science") {
      return [
        q(`Explain the key process in ${topic} in 4 ordered steps.`, "Warm-up", "Process order", "Missing terminology."),
        q(`Answer two short-answer questions on ${topic} using scientific terms.`, "Core", "Accuracy", "Describing without explaining."),
        q(`Create one diagram/process prompt for ${topic} and label the key parts.`, "Challenge", "Visual logic", "Unlabelled relationships.")
      ];
    }
    return [
      q(`Define the key idea in ${topic} in two precise sentences.`, "Warm-up", "Recall", "Vague definition."),
      q(`Complete one exam-style short response on ${topic}.`, "Core", "Answering the question", "Passive notes."),
      q(`Write one error log entry for ${topic}: mistake, cause, fix.`, "Fix", "Repair", "No correction rule.")
    ];
  }

  function q(question, difficulty, focusPoint, commonMistake) {
    return {
      question,
      difficulty,
      estimatedTime: difficulty === "Challenge" ? "8 min" : "5 min",
      focusPoint,
      commonMistake,
      marksImpact: "High because it builds exam-ready output.",
      whatToIgnore: "Do not rewrite notes before attempting.",
      sampleAnswer: ""
    };
  }

  function renderFallbackCard(card, index) {
    return `
      <article class="execution-card generated-card">
        <div class="execution-card-top">
          <span>${escapeHtml(card.title)}</span>
          <em>${escapeHtml(card.timeRequired)} - ${escapeHtml(card.difficulty)}</em>
        </div>
        <h3>${escapeHtml(card.topic)}</h3>
        <p class="do-now">${escapeHtml(card.doThisNow)}</p>
        <div class="card-grid">
          <div><strong>Highest ROI Task</strong><span>${escapeHtml(card.highestRoiTask)}</span></div>
          <div><strong>Question Type</strong><span>${escapeHtml(card.questionType)}</span></div>
          <div><strong>Focus Point</strong><span>${escapeHtml(card.focusPoint)}</span></div>
          <div><strong>Resource</strong><span>${escapeHtml(card.resourceName)}</span></div>
        </div>
        <div class="risk-row">
          <p><strong>Most Common Mistake</strong>${escapeHtml(card.mostCommonMistake)}</p>
          <p><strong>What NOT To Focus On</strong>${escapeHtml(card.whatNotToFocusOn)}</p>
          <p><strong>Estimated Marks Impact</strong>${escapeHtml(card.estimatedMarksImpact)}</p>
        </div>
        <button class="action-button" type="button" data-fallback-card-index="${index}">${escapeHtml(card.buttonText)}</button>
      </article>
    `;
  }

  function escapeHtml(valueToEscape) {
    return String(valueToEscape || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
