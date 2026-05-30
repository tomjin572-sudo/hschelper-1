(function () {
  if (window.__hscGuidedAnswerPathLoaded) return;
  window.__hscGuidedAnswerPathLoaded = true;

  const observer = new MutationObserver(addGuidedPaths);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  addGuidedPaths();

  function addGuidedPaths() {
    document.querySelectorAll(".question-card").forEach((card) => {
      card.querySelector(".mini-masterclass")?.remove();
      card.querySelector(".attack-guide")?.remove();
      const questionText = card.querySelector(".question-text");
      if (!questionText) return;
      const existingGuide = card.querySelector(".guided-answer-path");
      if (existingGuide?.dataset.compactGuide === "true" && questionText.nextElementSibling === existingGuide) return;
      const pathData = existingGuide ? compactExistingPath(existingGuide, buildPath(card)) : buildPath(card);
      existingGuide?.remove();
      questionText.insertAdjacentHTML("afterend", renderPath(pathData));
    });
  }

  function compactExistingPath(guide, fallback) {
    return path(
      sectionItems(guide, /key|term|knowledge/i, fallback.knowledge).slice(0, 3),
      "",
      "",
      sectionItems(guide, /step|answer|chain|move/i, fallback.chain).slice(0, 4),
      sectionItems(guide, /full|mark|checklist/i, fallback.marks).slice(0, 4),
      sectionItems(guide, /trap|mistake/i, [fallback.trap]).slice(0, 1)[0] || fallback.trap
    );
  }

  function sectionItems(guide, labelPattern, fallback) {
    const sections = Array.from(guide.querySelectorAll("div"));
    const section = sections.find((item) => labelPattern.test(item.querySelector("b")?.textContent || ""));
    if (!section) return fallback;
    const items = Array.from(section.querySelectorAll("li")).map((item) => item.textContent.trim()).filter(Boolean);
    const span = section.querySelector("span")?.textContent?.trim();
    return items.length ? items : span ? [span] : fallback;
  }

  function buildPath(card) {
    const text = card.textContent.toLowerCase();
    const focus = card.querySelector(".question-meta-grid div:first-child span")?.textContent?.trim() || "the tested skill";
    const mistake = card.querySelector(".question-meta-grid div:nth-child(2) span")?.textContent?.trim() || "Missing the exact exam move.";

    if (/first principles/.test(text)) return path(
      ["Formula: f'(x)=lim h->0 [f(x+h)-f(x)]/h.", "f(x+h): replace x with x+h.", "Key move: cancel h first."],
      "Use the limit definition, not shortcut rules.",
      "Start: f'(x)=lim h->0 [f(x+h)-f(x)]/h.",
      ["Find f(x+h).", "Subtract f(x).", "Factor and cancel h.", "Let h approach 0."],
      ["Correct formula", "Correct f(x+h)", "h cancels before limit", "Final derivative"],
      "Substituting h=0 too early."
    );

    if (/quadratic|factoris|x\^2|x2|parabola/.test(text)) return path(
      ["Quadratic: ax^2 + bx + c = 0.", "Factorising: multiply to c, add to b.", "Formula: x=(-b +/- sqrt(b^2-4ac))/2a."],
      "Solve or interpret the quadratic.",
      "First: write ax^2 + bx + c = 0.",
      ["Put in standard form.", "Choose factorising or formula.", "Show substitution/working.", "State both solutions."],
      ["Correct method", "Clear working", "Both roots", "Context checked"],
      mistake
    );

    if (/differentiat|derivative|gradient|tangent|normal|stationary/.test(text)) return path(
      ["Derivative: d/dx(ax^n)=anx^(n-1).", "Tangent gradient: y' at x.", "Normal gradient: negative reciprocal."],
      "Find gradient, line equation, rate or stationary point.",
      "First: differentiate, then substitute x.",
      ["Find y'.", "Substitute x or solve y'=0.", "Find y-value if needed.", "Write final meaning."],
      ["Correct derivative", "Correct substitution", "Coordinates/line if needed", "Question answered"],
      mistake
    );

    if (/integrat|area under|area between|antiderivative/.test(text)) return path(
      ["Integral: add 1 to power, divide.", "+C: needed for indefinite integrals.", "Area: split if curve crosses axis."],
      "Find antiderivative, integral value or area.",
      "First: write the antiderivative.",
      ["Integrate the expression.", "Add +C if needed.", "Substitute bounds.", "Check area vs signed value."],
      ["Correct antiderivative", "Correct bounds", "Area sign handled", "Exact value/units"],
      mistake
    );

    if (/labour|wage|employment|unemployment|underemployment|participation/.test(text)) return path(
      ["Labour demand: employers wanting workers.", "Labour supply: workers willing to work.", "Equilibrium wage: demand equals supply.", "Unemployment: seeking work, no job.", "Underemployment: working, wanting more hours."],
      "Use labour terms, then wage/employment effects.",
      "Start: Workers supply labour; employers demand labour.",
      ["Define the key term.", "Show demand or supply shift.", "State wage/employment effect.", "Link to unemployment/productivity."],
      ["Clear definitions", "Diagram logic", "Wage/employment effect", "Economic terms", "Example if needed"],
      "Do not define labour markets as just jobs."
    );

    if (/inflation|monetary|fiscal|aggregate|cash rate|economic|policy|globalisation|exchange rate/.test(text)) return path(
      ["Inflation: sustained rise in prices.", "Cash rate: RBA's key rate.", "Aggregate demand: C+I+G+X-M."],
      "Build the economic cause-effect chain.",
      "Start: Inflation reduces purchasing power.",
      ["Define the term.", "State first economic change.", "Show household/firm response.", "Link to macro impact.", "Judge if required."],
      ["Actual definition", "3 linked steps", "Diagram/data/example", "Economic objective", "Judgement if required"],
      mistake
    );

    if (/business|marketing|operations|finance|human resources|case study/.test(text)) return path(
      ["Operations: turning inputs into outputs.", "Marketing: satisfying customers profitably.", "Finance: managing cash and profit.", "HR: managing employees."],
      "Show how the strategy changes performance.",
      "Start: [Strategy] improves performance by affecting [function].",
      ["Define the strategy.", "Name the function.", "Show the action.", "Link to performance.", "Add case detail."],
      ["Correct business term", "Relevant function", "Action -> impact link", "Specific case detail", "Judgement if required"],
      "Do not only define the term."
    );

    if (/english|module|thesis|paragraph|quote|composer|text|essay|analysis|isolation/.test(text)) return path(
      ["Analyse: explain how meaning is made.", "Paragraph: Point -> Evidence -> Technique -> Effect -> Link.", "Thesis: judgement answering the question."],
      "Make a text-specific argument.",
      "Start: The composer represents [idea] as [judgement].",
      ["Use question wording.", "Add quote or moment.", "Name technique/form.", "Explain effect and link."],
      ["Clear argument", "Specific evidence", "Technique analysis", "Effect on meaning", "Question link"],
      "Do not retell the plot."
    );

    if (/validity|reliability|accuracy|precision|variable|sample size|control|method/.test(text)) return path(
      ["Validity: tests the intended variable.", "Reliability: repeatable, consistent results.", "Accuracy: close to true value.", "Control: kept the same."],
      "Evaluate method quality using correct terms.",
      "Start: This affects [validity/reliability/accuracy] because...",
      ["Identify variables.", "Judge validity.", "Judge reliability.", "Judge accuracy.", "Suggest one improvement."],
      ["Correct method term", "Evidence from method/data", "Specific improvement", "Effect of improvement"],
      "Do not mix up validity and reliability."
    );

    if (/physics|force|motion|wave|electric|magnetic|energy/.test(text)) return path(
      ["Net force: vector sum of forces.", "F=ma: force equals mass times acceleration.", "v=f lambda: wave speed formula."],
      "Apply the principle with working or cause-effect.",
      "First: write F=ma or v=f lambda.",
      ["Identify the principle.", "Write formula or diagram.", "Substitute values with units.", "State physical meaning."],
      ["Correct formula", "Units", "Working/diagram", "Scenario conclusion"],
      mistake
    );

    if (/chemistry|mole|acid|base|equilibrium|reaction|organic|titration/.test(text)) return path(
      ["Moles: n=m/M.", "Concentration: c=n/V.", "Equilibrium: system opposes disturbance."],
      "Use particles, equations or calculation logic.",
      "First: write equation, n=m/M, or c=n/V.",
      ["Identify reaction/calculation type.", "Write equation/formula.", "Use ratios or particles.", "State chemical result.", "Check units."],
      ["Balanced equation/formula", "Correct ratios", "Units", "Clear result"],
      mistake
    );

    if (/biology|enzyme|cell|genetic|disease|homeostasis|ecosystem|adaptation/.test(text)) return path(
      ["Homeostasis: stable internal conditions.", "Enzymes: catalysts with active sites.", "Structure-function: feature helps role."],
      "Explain process, structure-function link or data trend.",
      "Start: [Process] begins when [first stage].",
      ["Define the key term.", "Sequence the process.", "Link cause to function.", "Use data/diagram if given.", "State biological effect."],
      ["Correct terms", "Correct order", "Cause-effect link", "Data/diagram if relevant"],
      mistake
    );

    return path(
      ["Explain: show cause and effect.", "Analyse: show connections.", "Evaluate: judge using evidence."],
      `Answer ${focus} using the command word.`,
      "Start with the key definition, formula or claim.",
      ["Name key content.", "Write first step.", "Apply to question.", "Finish with result/link."],
      ["Exact task answered", "Actual content", "Evidence/working/example", "Clear final link"],
      mistake
    );
  }

  function path(knowledge, wants, first, chain, marks, trap) {
    return { knowledge, wants, first, chain, marks, trap };
  }

  function renderPath(pathData) {
    return `
      <div class="guided-answer-path" data-compact-guide="true">
        <strong>Quick Answer Path</strong>
        <div><b>Steps</b>${renderList(pathData.chain.slice(0, 4), "ol")}</div>
        <div><b>Key Terms</b>${renderList(pathData.knowledge.slice(0, 3), "ul")}</div>
        <div><b>Full Marks</b>${renderList(pathData.marks.slice(0, 4), "ul")}</div>
        <div><b>Trap</b>${renderList([pathData.trap], "ul")}</div>
      </div>
    `;
  }

  function renderList(items, tagName) {
    const safeTag = tagName === "ol" ? "ol" : "ul";
    return `<${safeTag}>${items.slice(0, 5).map(renderItem).join("")}</${safeTag}>`;
  }

  function renderItem(item) {
    const text = String(item || "").trim();
    const match = text.match(/^([^:]{2,34}):\s*(.+)$/);
    if (!match) return `<li>${escapeHtml(text)}</li>`;
    return `<li><strong>${escapeHtml(match[1])}:</strong> ${escapeHtml(match[2])}</li>`;
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
