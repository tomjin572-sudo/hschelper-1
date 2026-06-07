(function () {
  if (window.__hscMiniMasterclassLoaded) return;
  window.__hscMiniMasterclassLoaded = true;

  const observer = new MutationObserver(addMasterclasses);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addMasterclasses();

  function addMasterclasses() {
    document.querySelectorAll(".question-card").forEach((card) => {
      if (card.querySelector(".guided-answer-path")) return;
      if (card.querySelector(".attack-guide")) return;
      if (card.querySelector(".mini-masterclass")) return;
      const questionText = card.querySelector(".question-text");
      if (!questionText) return;
      const guide = buildGuide(card);
      questionText.insertAdjacentHTML("beforebegin", renderGuide(guide));
    });
  }

  function buildGuide(card) {
    const text = card.textContent.toLowerCase();
    const focus = card.querySelector(".question-meta-grid div:first-child span")?.textContent?.trim() || "the tested skill";
    const mistake = card.querySelector(".question-meta-grid div:nth-child(2) span")?.textContent?.trim() || "rushing without checking the question";

    if (/math|quadratic|calculus|differentiat|integrat|function|graph|trig|algebra/.test(text)) {
      return {
        skill: focus,
        why: "Maths marks come from visible method lines, not just the final answer.",
        steps: ["Write the formula or rule first.", "Substitute carefully and show each line.", "Check the final answer against the question."],
        example: "For a tangent question: find y', substitute x, find y, then write the line equation.",
        mistake
      };
    }

    if (/physics|chemistry|biology|science|enzyme|cell|reaction|force|wave|mole|acid|data|experiment/.test(text)) {
      return {
        skill: focus,
        why: "Science answers gain marks for correct terms, process order and evidence.",
        steps: ["Name the concept or formula.", "Apply it to the scenario or data.", "Finish with the effect, unit or conclusion."],
        example: "For data: quote the trend, include one value, then explain the scientific reason.",
        mistake
      };
    }

    if (/english|module|thesis|paragraph|quote|text|essay|analysis/.test(text)) {
      return {
        skill: focus,
        why: "English marks come from answering the question with text-specific analysis.",
        steps: ["Make a direct claim.", "Add evidence and technique.", "Explain effect and link back to the question."],
        example: "Claim -> quote/feature -> effect -> why it proves the question wording.",
        mistake
      };
    }

    if (/economic|labour|unemployment|inflation|policy|market|wage|business|marketing|operations|finance|human resources/.test(text)) {
      return {
        skill: focus,
        why: "HSIE marks reward command-term control, terms and cause-effect logic.",
        steps: ["Define the key term or strategy.", "Build the cause-effect chain.", "Apply an example and answer the command term."],
        example: "Explain: lower cash rate -> cheaper borrowing -> higher spending -> higher aggregate demand.",
        mistake
      };
    }

    return {
      skill: focus,
      why: "This matters because it turns revision into a marked exam action.",
      steps: ["Identify what the question asks.", "Answer using the required evidence or working.", "Check one likely mistake before submitting."],
      example: "Use one clear point, one piece of evidence or working, and one final link.",
      mistake
    };
  }

  function renderGuide(guide) {
    return `
      <div class="mini-masterclass">
        <strong>Marks mini-brief</strong>
        <div class="masterclass-grid">
          <div><b>Skill</b><span>${escapeHtml(guide.skill)}</span></div>
          <div><b>Why it wins marks</b><span>${escapeHtml(guide.why)}</span></div>
        </div>
        <ol>${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <p><b>Tiny example:</b> ${escapeHtml(guide.example)}</p>
        <p><b>Trap that costs marks:</b> ${escapeHtml(guide.mistake)}</p>
      </div>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();

(() => {
  if (window.__hscLearningCardLoader) return;
  window.__hscLearningCardLoader = true;
  const script = document.createElement("script");
  script.src = "./study-sprint-learning-cards.js?v=20260607-single-card-flow";
  script.defer = true;
  document.head.appendChild(script);
  script.addEventListener("load", () => {
    const journeyScript = document.createElement("script");
    journeyScript.src = "./study-sprint-journey.js?v=20260607-force-one-visible";
    journeyScript.defer = true;
    document.head.appendChild(journeyScript);
  });
})();
