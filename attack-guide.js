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
      if (card.querySelector(".guided-answer-path")) return;
      const questionText = card.querySelector(".question-text");
      if (!questionText) return;
      questionText.insertAdjacentHTML("beforebegin", renderPath(buildPath(card)));
    });
  }

  function buildPath(card) {
    const text = card.textContent.toLowerCase();
    const question = card.querySelector(".question-text")?.textContent?.trim() || "";
    const focus = card.querySelector(".question-meta-grid div:first-child span")?.textContent?.trim() || "the tested skill";
    const mistake = card.querySelector(".question-meta-grid div:nth-child(2) span")?.textContent?.trim() || "rushing without checking the question";

    if (/first principles/.test(text)) {
      return {
        knowledge: ["f'(x) = lim h->0 [f(x+h) - f(x)] / h.", "f(x+h) means replace every x in f(x) with x+h.", "You must cancel h before h approaches 0."],
        wants: "Find the derivative using the limit definition, not shortcut differentiation rules.",
        first: "Write: f'(x) = lim h->0 [f(x+h) - f(x)] / h.",
        chain: ["Find f(x+h).", "Subtract f(x).", "Expand and factor out h.", "Cancel h, then take the limit."],
        marks: ["Correct first-principles formula", "Correct f(x+h)", "Algebra that cancels h", "Final derivative"],
        trap: "Substituting h = 0 before cancelling h."
      };
    }

    if (/quadratic|factoris|x\^2|x2|parabola/.test(text)) {
      return {
        knowledge: ["Quadratic form: ax^2 + bx + c = 0.", "Factorising uses two numbers that multiply to c and add to b.", "Quadratic formula: x = (-b +/- sqrt(b^2 - 4ac)) / 2a."],
        wants: "Solve or interpret a quadratic, usually by factorising, using the formula, or finding graph features.",
        first: "Write the equation in ax^2 + bx + c = 0 form, then choose factorising or the quadratic formula.",
        chain: ["Put the equation in standard form.", "Choose the method from the numbers.", "Show factorisation/formula substitution.", "State both solutions or graph features."],
        marks: ["Correct method", "Clear working", "Both roots or labelled graph features", "Rejected invalid values if the context needs it"],
        trap: mistake
      };
    }

    if (/differentiat|derivative|gradient|tangent|normal|stationary/.test(text)) {
      return {
        knowledge: ["Power rule: d/dx(ax^n) = anx^(n-1).", "Tangent gradient is y' at the x-value.", "Normal gradient is -1 divided by the tangent gradient."],
        wants: "Use calculus to find a gradient, tangent/normal equation, rate of change or stationary point.",
        first: "Differentiate the function first, then substitute the required x-value.",
        chain: ["Find y'.", "Substitute the x-value or solve y'=0.", "Find the matching y-value if coordinates are needed.", "Write the line/classification/final interpretation."],
        marks: ["Correct derivative", "Correct substitution", "Coordinates or line equation", "Final answer that matches the question"],
        trap: mistake
      };
    }

    if (/integrat|area under|area between|antiderivative/.test(text)) {
      return {
        knowledge: ["Reverse power rule: integral ax^n dx = ax^(n+1)/(n+1) + C.", "Definite integrals need upper and lower bounds.", "Total area may need splitting if the curve crosses the x-axis."],
        wants: "Find an antiderivative, definite integral, area under a curve, or area between curves.",
        first: "Write the antiderivative before substituting any bounds.",
        chain: ["Find the antiderivative.", "Apply +C if the original function is needed.", "Substitute bounds for definite integrals.", "Check whether the question asks for signed value or area."],
        marks: ["Correct antiderivative", "Correct bounds/constants", "Area sign handled correctly", "Units or exact value if required"],
        trap: mistake
      };
    }

    if (/labour|wage|employment|unemployment|underemployment|participation/.test(text)) {
      return {
        knowledge: ["Labour demand: firms' demand for workers, derived from demand for goods/services.", "Labour supply: workers willing and able to work at each wage rate.", "Equilibrium wage: wage where labour demand equals labour supply.", "Unemployment: actively seeking work but unable to find it.", "Underemployment: employed but wanting more hours."],
        wants: "Explain labour-market relationships using definitions, demand/supply logic, and wage/employment effects.",
        first: "Start: In the labour market, wage rates are determined by the interaction of labour demand and labour supply.",
        chain: ["Define the key labour term.", "Identify whether demand or supply changes.", "Explain the wage and employment effect.", "Link to unemployment, underemployment, participation or productivity if relevant."],
        marks: ["Accurate definitions", "Demand/supply or diagram logic", "Wage and employment effect", "Economic terminology", "Example/data if asked"],
        trap: mistake
      };
    }

    if (/inflation|monetary|fiscal|aggregate|cash rate|economic|policy|globalisation|exchange rate/.test(text)) {
      return {
        knowledge: ["Explain means show cause and effect.", "Assess/evaluate means make a judgement.", "Economic chain: cause -> mechanism -> impact -> example/data -> judgement."],
        wants: "Build economic reasoning, not a list of facts.",
        first: "Start by defining the main economic term, then state the first cause-effect link.",
        chain: ["Define the key term.", "State the policy/change/cause.", "Explain the transmission mechanism.", "Show the economic impact.", "Add example/data and judgement if required."],
        marks: ["Definition", "Cause-effect chain", "Economic terminology", "Example/data or diagram", "Judgement for assess/evaluate"],
        trap: mistake
      };
    }

    if (/business|marketing|operations|finance|human resources|case study/.test(text)) {
      return {
        knowledge: ["Explain means show impact; analyse means show relationships; evaluate means judge effectiveness.", "Business impact chain: function -> strategy/action -> performance effect -> case detail -> judgement."],
        wants: "Apply a business concept to performance, not just define it.",
        first: "Start by naming the business function and strategy, then link it to a performance outcome.",
        chain: ["Define the strategy or term.", "Link it to operations/marketing/finance/HR.", "Explain the performance effect.", "Add a specific case detail or realistic business example.", "Judge effectiveness if asked."],
        marks: ["Syllabus term", "Business function", "Performance impact", "Case/example detail", "Judgement for evaluate/assess"],
        trap: mistake
      };
    }

    if (/english|module|thesis|paragraph|quote|composer|text|essay|analysis|isolation/.test(text)) {
      return {
        knowledge: ["Analyse means explain how meaning is created.", "Paragraph path: Point -> Evidence -> Technique -> Effect -> Link.", "A thesis is a judgement that answers the question."],
        wants: "Answer the command word using text-specific analysis, not plot summary.",
        first: "Start: The composer represents [question idea] as [your judgement] through [technique/form choice].",
        chain: ["Make a point using the question wording.", "Add a quote, moment or textual feature.", "Name the technique/form choice.", "Explain the effect on meaning.", "Link back to the question."],
        marks: ["Clear argument", "Specific evidence", "Technique/form analysis", "Effect on meaning", "Explicit question link"],
        trap: mistake
      };
    }

    if (/validity|reliability|accuracy|precision|variable|sample size|control|method/.test(text)) {
      return {
        knowledge: ["Validity: whether the method tests what it claims to test.", "Reliability: whether repeated trials give consistent results.", "Accuracy: closeness to the true value.", "Controlled variable: kept the same for a fair test."],
        wants: "Evaluate investigation quality using the right method terms.",
        first: "Start by naming the variable or method feature that affects validity, reliability or accuracy.",
        chain: ["Identify independent/dependent/controlled variables.", "Judge validity: was it a fair test?", "Judge reliability: repeats/sample size/consistency.", "Judge accuracy: measurement tool/error.", "Suggest one specific improvement."],
        marks: ["Correct method term", "Specific evidence from the method/data", "Clear improvement", "Effect of the improvement"],
        trap: "Using validity, reliability and accuracy as if they mean the same thing."
      };
    }

    if (/physics|force|motion|wave|electric|magnetic|energy/.test(text)) {
      return {
        knowledge: ["Formula answers need variables and units.", "Newton-style explanations need force -> acceleration/motion effect.", "Wave questions often use v = f lambda."],
        wants: "Apply a physics principle to the scenario with working or a cause-effect explanation.",
        first: "Write the relevant formula/principle and define the variables before substituting.",
        chain: ["Identify the principle.", "Write formula or labelled diagram.", "Substitute values with units or explain mechanism.", "State the final physical meaning."],
        marks: ["Correct formula/principle", "Units and direction", "Working or labelled diagram", "Scenario-specific conclusion"],
        trap: mistake
      };
    }

    if (/chemistry|mole|acid|base|equilibrium|reaction|organic|titration/.test(text)) {
      return {
        knowledge: ["Mole questions need n = m/M or c = n/V.", "Equilibrium answers use disturbance -> shift -> concentration/yield effect.", "Acid-base questions often need balanced equation or pH/concentration logic."],
        wants: "Use chemical particles, equations or calculation logic to explain the result.",
        first: "Write the balanced equation, formula or reaction type before explaining.",
        chain: ["Identify the reaction/calculation type.", "Write equation or formula.", "Substitute/process values or explain particles.", "State product, concentration, pH, yield or conclusion."],
        marks: ["Balanced equation/formula", "Correct units and ratios", "Particle/reaction logic", "Clear final result"],
        trap: mistake
      };
    }

    if (/biology|enzyme|cell|genetic|disease|homeostasis|ecosystem|adaptation/.test(text)) {
      return {
        knowledge: ["Biology explanations need process order and correct terms.", "Structure-function means link the part's feature to what it does.", "Data answers need a trend plus a value."],
        wants: "Explain a biological process, structure-function link, disease/genetics pathway or data trend.",
        first: "Start by naming the biological concept, then outline the first step in the process.",
        chain: ["Define the key term.", "Put the process/pathway in order.", "Link structure to function or cause to effect.", "Use data/diagram evidence if given."],
        marks: ["Correct terminology", "Correct process order", "Structure-function or cause-effect link", "Data/diagram evidence where relevant"],
        trap: mistake
      };
    }

    return {
      knowledge: ["Command words control depth: identify = name, explain = cause/effect, analyse = relationships, evaluate = judgement.", "Use subject terms, evidence or working rather than general statements."],
      wants: `It wants a focused answer on ${focus}, using the command word and topic clue.`,
      first: "Write the key definition, formula, claim or first working line before adding detail.",
      chain: ["Identify the task type.", "Write the key knowledge or first method step.", "Apply it to the question.", "Finish with the evidence, result or link."],
      marks: ["Exact task answered", "Subject terminology", "Evidence/working/example", "Clear final link"],
      trap: mistake || question
    };
  }

  function renderPath(path) {
    return `
      <div class="guided-answer-path">
        <strong>Guided Answer Path</strong>
        <div><b>Key Terms / Key Knowledge You Need</b><ul>${path.knowledge.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><b>What the Question Wants</b><span>${escapeHtml(path.wants)}</span></div>
        <div><b>First Sentence / First Move</b><span>${escapeHtml(path.first)}</span></div>
        <div><b>Answer Chain</b><ol>${path.chain.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div>
        <div><b>What to Include for Full Marks</b><ul>${path.marks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><b>Common Trap</b><span>${escapeHtml(path.trap)}</span></div>
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
