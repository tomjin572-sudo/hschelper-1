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
      sectionItems(guide, /trap|mistake/i, [fallback.trap]).slice(0, 1)[0] || fallback.trap,
      fallback.matters
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
    const mistake = card.querySelector(".question-meta-grid div:nth-child(2) span")?.textContent?.trim() || "Missing the exact exam move.";

    if (/derived demand/.test(text)) return path(
      ["Labour market: where workers supply labour and firms demand labour.", "Labour demand: amount of labour firms are willing and able to hire at different wage rates.", "Derived demand: labour demand comes from demand for goods/services."],
      "Define the labour market and explain why firms hire workers.",
      "Start: The labour market is where workers supply labour and firms demand labour.",
      ["Labour market = workers supply, firms demand.", "Labour demand = firms willing and able to hire.", "Demand is derived from goods/services demand.", "More consumer demand can make firms hire more workers."],
      ["Define labour market.", "Define labour demand.", "Explain derived demand.", "Link to goods/services demand.", "Mention hiring/employment."],
      "Do not define the labour market as just jobs.",
      "Labour market definitions are easy marks. Vague wording makes the whole answer sound less economic."
    );

    if (/increase in labour demand|rise in labour demand|higher labour demand|labour demand shifts right/.test(text)) return path(
      ["Labour demand: amount of labour firms are willing and able to hire at different wage rates.", "Equilibrium wage: wage where labour demand equals labour supply.", "Employment: number of workers hired in the labour market."],
      "Explain the wage and employment effect of stronger demand.",
      "Start: An increase in demand for goods and services can increase firms' demand for labour.",
      ["Goods demand rises.", "Labour demand shifts right.", "Firms compete for workers.", "Wages and employment may rise."],
      ["State labour demand increases.", "Rightward demand shift.", "Higher equilibrium wage.", "Higher employment if firms hire more workers."],
      "Do not say wages rise without explaining the demand shift.",
      "This is the main cause-effect chain behind labour market diagram marks."
    );

    if (/rising unemployment|rise in unemployment|higher unemployment|impact of unemployment/.test(text)) return path(
      ["Unemployment: people willing and able to work who cannot find a job.", "Household disposable income: income available for spending after tax.", "Aggregate demand: total spending on goods and services in the economy."],
      "Assess effects on households and the wider economy.",
      "Start: Rising unemployment reduces household income because more people are unable to earn wages.",
      ["Define unemployment.", "Household income falls.", "Consumption and AD fall.", "Judge severity by duration/scale."],
      ["Define unemployment.", "Explain lower household income.", "Link lower consumption to AD/economic growth.", "Make a judgement about severity."],
      "Do not stop at 'people lose jobs'; explain spending and AD.",
      "Unemployment questions reward cause-effect links from households to the wider economy."
    );

    if (/minimum wage|wage floor/.test(text)) return path(
      ["Minimum wage: legal minimum wage employers must pay workers.", "Equilibrium wage: wage where labour demand equals labour supply.", "Excess labour supply: workers supplied exceed workers demanded."],
      "Explain both the benefit and trade-off of a wage floor.",
      "Start: A minimum wage can raise incomes for low-paid workers if set above the market wage.",
      ["Define minimum wage.", "Explain income/equity benefit.", "Explain higher labour cost.", "Judge employment risk."],
      ["Define minimum wage.", "Explain income/equity benefit.", "Explain higher business labour costs.", "Mention possible lower employment.", "Give balanced judgement."],
      "Do not argue only one side of the policy.",
      "Minimum wage questions are policy trade-off marks, not one-sided opinion marks."
    );

    if (/labour|wage|employment|unemployment|underemployment|participation/.test(text)) return path(
      ["Labour demand: amount of labour firms are willing and able to hire at different wage rates.", "Labour supply: amount of labour workers are willing and able to offer at different wage rates.", "Equilibrium wage: wage where labour demand equals labour supply.", "Unemployment: willing and able to work but unable to find a job."],
      "Use labour terms, then wage/employment effects.",
      "Start: Workers supply labour; firms demand labour.",
      ["Use the exact labour-market definition.", "Identify demand/supply change.", "State wage and employment effect.", "Link to the question's outcome."],
      ["Exam-ready definition.", "Correct labour market concept.", "Wage/employment link.", "Specific answer to the question."],
      "Do not define labour markets as just jobs.",
      "Precise labour-market language makes the answer sound economic, not like everyday job talk."
    );

    if (/first principles/.test(text)) return path(["Formula: f'(x)=lim h->0 [f(x+h)-f(x)]/h.", "f(x+h): replace x with x+h.", "Key move: cancel h first."], "Use the limit definition, not shortcut rules.", "Start: f'(x)=lim h->0 [f(x+h)-f(x)]/h.", ["Find f(x+h).", "Subtract f(x).", "Factor and cancel h.", "Let h approach 0."], ["Correct formula", "Correct f(x+h)", "h cancels before limit", "Final derivative"], "Substituting h=0 too early.");
    if (/quadratic|factoris|x\^2|x2|parabola/.test(text)) return path(["Quadratic: ax^2 + bx + c = 0.", "Factorising: multiply to c, add to b.", "Formula: x=(-b +/- sqrt(b^2-4ac))/2a."], "Solve or interpret the quadratic.", "First: write ax^2 + bx + c = 0.", ["Put in standard form.", "Choose factorising or formula.", "Show substitution/working.", "State both solutions."], ["Correct method", "Clear working", "Both roots", "Context checked"], mistake);
    if (/differentiat|derivative|gradient|tangent|normal|stationary/.test(text)) return path(["Derivative: d/dx(ax^n)=anx^(n-1).", "Tangent gradient: y' at x.", "Normal gradient: negative reciprocal."], "Find gradient, line equation, rate or stationary point.", "First: differentiate, then substitute x.", ["Find y'.", "Substitute x or solve y'=0.", "Find y-value if needed.", "Write final meaning."], ["Correct derivative", "Correct substitution", "Coordinates/line if needed", "Question answered"], mistake);
    if (/integrat|area under|area between|antiderivative/.test(text)) return path(["Integral: add 1 to power, divide.", "+C: needed for indefinite integrals.", "Area: split if curve crosses axis."], "Find antiderivative, integral value or area.", "First: write the antiderivative.", ["Integrate the expression.", "Add +C if needed.", "Substitute bounds.", "Check area vs signed value."], ["Correct antiderivative", "Correct bounds", "Area sign handled", "Exact value/units"], mistake);
    if (/inflation|monetary|fiscal|aggregate|cash rate|economic|policy|globalisation|exchange rate/.test(text)) return path(["Inflation: sustained rise in prices.", "Cash rate: RBA's key rate.", "Aggregate demand: C+I+G+X-M."], "Build the economic cause-effect chain.", "Start: Inflation reduces purchasing power.", ["Define the term.", "State first economic change.", "Show household/firm response.", "Link to macro impact.", "Judge if required."], ["Actual definition", "3 linked steps", "Diagram/data/example", "Economic objective", "Judgement if required"], mistake);

    return path(["Explain: show cause and effect.", "Analyse: show connections.", "Evaluate: judge using evidence."], "Answer the command word with exact subject content.", "Start with the key definition, formula or claim.", ["State the exact content.", "Apply it to the question.", "Show the cause-effect link.", "Finish with the mark-winning link."], ["Exact task answered", "Actual content", "Evidence/working/example", "Clear final link"], mistake, "This card should produce a markable answer, not just notes.");
  }

  function path(knowledge, wants, first, chain, marks, trap, matters = "") {
    return { knowledge, wants, first, chain, marks, trap, matters };
  }

  function renderPath(pathData) {
    return `
      <div class="guided-answer-path" data-compact-guide="true">
        ${pathData.matters ? `<div class="path-matters"><b>Why this card matters:</b> ${escapeHtml(pathData.matters)}</div>` : ""}
        <strong>Quick Answer Path</strong>
        <div class="answer-path-grid">
          <div class="path-card path-card-primary"><b>Steps</b>${renderList(pathData.chain.slice(0, 4), "ol")}</div>
          <div class="path-card"><b>Key Terms</b>${renderList(pathData.knowledge.slice(0, 3), "ul")}</div>
          <div class="path-card"><b>Full Marks</b>${renderList(pathData.marks.slice(0, 4), "ul")}</div>
          <div class="path-card path-card-trap"><b>Trap</b>${renderList([pathData.trap], "ul")}</div>
        </div>
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
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
})();