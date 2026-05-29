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
        knowledge: ["Inflation: a sustained increase in the general price level.", "Cash rate: the interest rate set by the RBA that influences borrowing and saving rates.", "Aggregate demand: total spending in the economy, made up of C + I + G + X - M."],
        wants: "Explain how the economic change in the question flows through households, firms, prices, output or employment.",
        first: "Start: Inflation is a sustained increase in the general price level, which reduces purchasing power when incomes do not rise at the same pace.",
        chain: ["Name and define the main economic term.", "Identify the first change: prices, rates, demand, supply, currency or policy.", "Trace the effect on households/firms: spending, costs, investment, exports or employment.", "Finish with the macro result: growth, inflation, unemployment, living standards or external stability.", "If asked to assess/evaluate, add a short judgement about strength or limitation."],
        marks: ["Actual definition of the economic term", "Cause-effect chain with at least 3 linked steps", "One relevant diagram/data/example type, such as AD/AS shift, exchange-rate movement or recent Australian policy", "Clear final impact on an economic objective", "Judgement if the command term requires it"],
        trap: mistake
      };
    }

    if (/business|marketing|operations|finance|human resources|case study/.test(text)) {
      return {
        knowledge: ["Operations: the business function that transforms inputs into goods or services.", "Marketing: identifying customer needs and satisfying them profitably.", "Finance: managing funds, cash flow, profitability and solvency.", "Human resources: managing employees, skills, motivation and workplace relations."],
        wants: "Show how the strategy or business term in the question changes business performance.",
        first: "Start: The business can improve performance by using [strategy], which affects [operations/marketing/finance/HR] through [cost, revenue, quality, productivity or customer demand].",
        chain: ["Define the business term or strategy named in the question.", "Name the business function it belongs to.", "Show the action: what the business actually does.", "Explain the performance impact: lower costs, higher sales, better quality, improved cash flow, productivity or customer satisfaction.", "Add a case detail: a named business, product, market, campaign, supply chain, finance decision or HR practice.", "Judge effectiveness if the question says assess/evaluate."],
        marks: ["Correct business definition", "Relevant business function", "Action -> performance impact chain", "Specific case/example detail, not a generic company mention", "Judgement when required"],
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
        knowledge: ["Net force: the vector sum of forces on an object.", "Newton's second law: F = ma, where F is net force in newtons, m is mass in kilograms and a is acceleration in m s^-2.", "Wave speed: v = f lambda, where v is speed, f is frequency and lambda is wavelength."],
        wants: "Apply a physics principle to the scenario with working or a cause-effect explanation.",
        first: "Write the relevant formula first, for example F = ma or v = f lambda, then substitute the values with units.",
        chain: ["Identify the principle: force/motion, energy, waves, electricity or fields.", "Write the actual formula or draw a labelled diagram.", "Substitute the values with units and direction if relevant.", "Solve or explain the physical effect in the scenario.", "State the final answer with unit and meaning."],
        marks: ["Correct formula/principle with variables", "Substitution with units", "Working or labelled diagram", "Scenario-specific conclusion"],
        trap: mistake
      };
    }

    if (/chemistry|mole|acid|base|equilibrium|reaction|organic|titration/.test(text)) {
      return {
        knowledge: ["Amount of substance: n = m/M, where n is moles, m is mass and M is molar mass.", "Concentration: c = n/V, with volume in litres.", "Equilibrium shift: a system changes direction to partly oppose the disturbance."],
        wants: "Use chemical particles, equations or calculation logic to explain the result.",
        first: "Write the balanced equation or the formula n = m/M or c = n/V before doing any explanation.",
        chain: ["Identify the reaction or calculation type: mole, titration, equilibrium, acid-base, redox or organic.", "Write the balanced equation, formula or relevant particles.", "Use mole ratios, concentration logic or equilibrium shift direction.", "State the product, concentration, pH, yield or chemical conclusion.", "Use units and significant figures if calculating."],
        marks: ["Balanced equation/formula", "Correct mole ratio or particle logic", "Correct units and values", "Clear final result linked to the question"],
        trap: mistake
      };
    }

    if (/biology|enzyme|cell|genetic|disease|homeostasis|ecosystem|adaptation/.test(text)) {
      return {
        knowledge: ["Homeostasis: maintaining a stable internal environment through feedback mechanisms.", "Enzymes: biological catalysts with active sites that speed up reactions.", "Structure-function link: explain how a feature helps a part perform its role."],
        wants: "Explain a biological process, structure-function link, disease/genetics pathway or data trend.",
        first: "Start: [Key biological process] occurs when [first stage], leading to [main effect on the organism/cell/system].",
        chain: ["Define the key biological term in the question.", "Put the process/pathway in the correct order.", "Link each stage to the next cause or function.", "Use a diagram label, data trend and value if provided.", "Finish with the effect on survival, function, disease response or ecosystem change."],
        marks: ["Correct biological definition", "Correct process order", "Structure-function or cause-effect link", "Data/diagram evidence where relevant"],
        trap: mistake
      };
    }

    return {
      knowledge: ["Explain: show cause and effect.", "Analyse: show how parts connect and why that matters.", "Evaluate: make a judgement using evidence or criteria."],
      wants: `It wants a focused answer on ${focus}, using the command word and topic clue.`,
      first: "Start with the actual definition, formula, claim or first working line from the question topic, then apply it immediately.",
      chain: ["Name the exact term, formula, concept or text idea in the question.", "Write the first content step, not a general introduction.", "Apply that content to the given scenario, data, text or numbers.", "Finish with the result, effect, judgement or link back to the question."],
      marks: ["Exact task answered", "Actual subject content", "Evidence, working, example or diagram detail", "Clear final link"],
      trap: mistake || question
    };
  }

  function renderPath(path) {
    return `
      <div class="guided-answer-path">
        <strong>Guided Answer Path</strong>
        <div><b>Key Definitions You Need</b><ul>${path.knowledge.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><b>What This Question Is Really Asking</b><span>${escapeHtml(path.wants)}</span></div>
        <div><b>First Sentence You Can Use</b><span>${escapeHtml(path.first)}</span></div>
        <div><b>Step-by-Step Answer Path</b><ol>${path.chain.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div>
        <div><b>What To Include For Full Marks</b><ul>${path.marks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        <div><b>Common Mistake</b><span>${escapeHtml(path.trap)}</span></div>
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
