(function(){
  if(window.__hscExamSprintRuntimeFixes)return;
  window.__hscExamSprintRuntimeFixes=true;

  var packs=[
    {id:"demand",match:/labou?r demand|derived demand|demand for labour|economic term|concept check/i,task:"Explain why labour demand is derived demand and outline one factor that can increase labour demand. (4 marks)",must:["Labour demand = the quantity of labour firms are willing and able to hire at different wage rates.","It is derived demand: firms hire workers because consumers demand the goods and services those workers produce.","Diagram memory: wage rate on the vertical axis, quantity of labour on the horizontal axis, labour demand slopes downward.","High-value triggers: output demand, productivity, labour costs, technology and business confidence."],chain:"Higher demand for output -> firms need more workers -> labour demand shifts right -> employment rises and wage pressure increases.",model:["Labour demand is the amount of labour firms are willing and able to hire at different wage rates.","It is derived demand because workers are hired to produce output that consumers demand.","If demand for output rises, firms may increase production and hire more workers.","This shifts labour demand right, increasing employment and putting upward pressure on wages."],scaffold:["Define labour demand.","Explain derived demand using output demand.","Name one factor that shifts labour demand right.","State the wage and employment effect."],trap:"Do not describe workers looking for jobs. That is labour supply, not labour demand.",next:"If your mechanism is correct, move to equilibrium wage. If not, rewrite the cause-effect chain first."},
    {id:"equilibrium",match:/supply|equilibrium|wage rate|shortage|surplus|diagram|minimum wage|cause-effect/i,task:"Using a labour market diagram, explain the likely effect of a decrease in labour supply on wages and employment. (4 marks)",must:["Labour supply = workers willing and able to work at different wage rates.","Equilibrium wage is where labour demand equals labour supply.","If supply shifts left, equilibrium wage rises and employment falls. If demand shifts right, both wage and employment usually rise.","Minimum wage questions test a price floor above equilibrium, not just 'wages go up'."],chain:"Market shock -> curve shifts -> new equilibrium wage -> new employment level -> possible shortage/surplus.",model:["A decrease in labour supply shifts the labour supply curve left.","At the original wage there is excess demand for labour, so employers compete for fewer workers.","The equilibrium wage rises while the equilibrium quantity of labour employed falls.","The answer must link both outcomes to the diagram, not only state that wages increase."],scaffold:["State which curve shifts and direction.","Explain pressure at the old wage.","Give both wage and employment outcomes.","Link back to the diagram/question."],trap:"Do not say every higher wage increases employment. The curve shift decides the employment result.",next:"Now transfer the same diagram logic to unemployment, productivity or minimum wage."},
    {id:"unemployment",match:/unemployment|underemployment|participation|labou?r force|cyclical|structural/i,task:"Explain one economic impact of rising unemployment on the Australian economy. (4 marks)",must:["Unemployment = actively seeking work and unable to find it.","Underemployment = employed but wanting more hours or better use of skills.","Participation rate measures the share of working-age people in the labour force.","Common impacts: lower income, lower consumption, weaker aggregate demand, lost skills and budget pressure."],chain:"Unemployment rises -> household income falls -> consumption falls -> aggregate demand weakens -> economic growth may slow.",model:["Rising unemployment means more people who are willing and able to work cannot find jobs.","This reduces household income for affected workers.","Lower income can reduce consumption spending, weakening aggregate demand.","As a result, economic growth may slow and government welfare spending may increase."],scaffold:["Define unemployment accurately.","Identify the immediate income effect.","Explain the consumption/aggregate demand mechanism.","Link to growth, welfare spending or living standards."],trap:"Do not confuse unemployment with participation rate. A person outside the labour force is not counted as unemployed.",next:"If your answer only named a social effect, add one economic mechanism before moving on."},
    {id:"productivity",match:/productivity|skills mismatch|bargaining|real wage|structural|training|application/i,task:"Explain how improved labour productivity can affect labour demand and economic performance. (4 marks)",must:["Labour productivity = output per worker or output per hour worked.","Higher productivity can increase labour demand when workers generate more output or revenue for firms.","Skills mismatch causes structural unemployment when worker skills do not match available jobs.","Real wage means wage adjusted for inflation; it matters for purchasing power and labour costs."],chain:"Training/technology improves productivity -> workers produce more value -> firms may demand more labour -> output and incomes can rise.",model:["Labour productivity is the amount of output produced per worker or per hour worked.","If productivity rises, each worker can produce more output for the firm.","This can increase the value of hiring workers and shift labour demand to the right.","Higher productivity can support higher output, competitiveness and economic growth."],scaffold:["Define productivity.","Explain what changes for firms.","Link to labour demand or employment.","Add output, competitiveness or growth."],trap:"Do not write that productivity means working harder only. It is output per worker/hour.",next:"Lock the mark only if your answer has definition + mechanism + impact. Otherwise fix the missing link."}
  ];
  var shortParts=[
    {label:"Card 1 - Teach the Core Idea",title:"Labour demand is derived demand",task:"Learn why firms demand labour because output is demanded, then write the definition in exam language.",type:"Tony-style concept teaching",focus:"Labour demand, derived demand, wage rate.",trap:"Writing about workers looking for jobs instead of firms hiring labour.",impact:"This fixes the base confusion before any harder question."},
    {label:"Card 2 - Spot the Trap",title:"Find the mark-losing mistake",task:"Compare a weak answer with the correct economic idea and identify exactly where the mark is lost.",type:"Misconception repair",focus:"Labour demand vs labour supply.",trap:"Choosing the sentence that sounds right but names the wrong side of the market.",impact:"Stops repeated AI-looking practice by teaching one real error."},
    {label:"Card 3 - Build the Chain",title:"Cause -> mechanism -> impact",task:"Build the chain: output demand changes -> labour demand shifts -> wage and employment effects.",type:"Economic reasoning",focus:"Shift, mechanism, wage, employment.",trap:"Jumping from cause to conclusion with no mechanism.",impact:"This is where most short-answer marks are won."},
    {label:"Card 4 - Write the Exam Answer",title:"4-mark labour market response",task:"Write one timed answer using definition, mechanism, diagram language and a direct link back.",type:"Exam writing",focus:"Definition -> mechanism -> impact -> link.",trap:"Writing notes instead of an answer.",impact:"Turns understanding into marks."},
    {label:"Card 5 - Upgrade the Answer",title:"Band upgrade",task:"Upgrade a basic answer by adding diagram language, precise terms and a stronger final effect.",type:"Marker upgrade",focus:"Precision, diagram language, final impact.",trap:"Stopping at a Band 3 explanation.",impact:"Shows how to gain the extra mark."}
  ];
  var essayParts=[
    {label:"Card 1 - Decode the Essay",title:"What is the essay really asking?",task:"Unpack the directive, topic and judgement needed before writing anything.",type:"Essay question decoding",focus:"Directive verb, topic boundaries, required judgement.",trap:"Writing everything you know instead of answering the question.",impact:"Prevents the whole essay going off-task."},
    {label:"Card 2 - Build the Argument",title:"Create the thesis and judgement",task:"Write a clear thesis: definition, position and two economic arguments.",type:"Argument planning",focus:"Thesis, judgement, two argument lines.",trap:"Writing a topic instead of a position.",impact:"Gives the essay a direction before paragraphs start."},
    {label:"Card 3 - Plan the Paragraphs",title:"Three paragraph skeleton",task:"Plan three body paragraphs with topic sentence, mechanism, example/data and link.",type:"Paragraph planning",focus:"Argument order and evidence placement.",trap:"Making every paragraph say the same thing.",impact:"Makes the essay feel controlled, not panicked."},
    {label:"Card 4 - Write One High-Value Paragraph",title:"Write the best paragraph first",task:"Write one full body paragraph using Definition -> Cause -> Mechanism -> Impact -> Example/Data -> Judgement.",type:"Timed paragraph writing",focus:"One complete paragraph, not a full essay.",trap:"Trying to write the entire essay before one strong paragraph works.",impact:"Creates a real exam paragraph the student can reuse."},
    {label:"Card 5 - Upgrade to Band 5/6",title:"Add judgement and evidence",task:"Upgrade the paragraph with data/example, economic terminology and a final judgement sentence.",type:"Essay marker upgrade",focus:"Evidence, specificity, judgement.",trap:"Ending with summary instead of judgement.",impact:"Teaches the difference between a basic and strong essay response."}
  ];

  injectCss();
  wrapStarter();
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",function(e){
    if(feedbackGuard(e)||lockGuard(e))return;
    handlePracticeMode(e);
    var starter=e.target.closest(".start-session,[data-card-index],[data-evening-card-index],[data-fallback-card-index]");
    if(starter){window.__hscStepCardState={};window.__hscActiveJourneyIndex=Number(starter.dataset.cardIndex||starter.dataset.eveningCardIndex||starter.dataset.fallbackCardIndex||0)}
    stepClick(e);
    setTimeout(queue,120);
    setTimeout(queue,700);
  },true);
  queue();
  var settle=setInterval(run,1000);
  setTimeout(function(){clearInterval(settle)},5000);

  function queue(){clearTimeout(queue.t);queue.t=setTimeout(run,80)}
  function run(){
    var b=document.querySelector("#studySprintForm button[type='submit']");
    if(b&&!b.disabled)b.textContent="Create my mark attack cards";
    injectPracticeModeUi();
    dedupePlannerCards();
    applyLearningJourneyCards();
    Array.from(document.querySelectorAll("#questionStack .question-card")).forEach(function(card,i){
      if(i>0){card.hidden=true;card.style.display="none";return}
      card.classList.add("step-card-flow");
      addStepper(card);
      addShellSections(card);
      enrich(card);
      setStep(card,inferStep(card),true,true);
    });
  }

  function wrapStarter(){
    var t=setInterval(function(){
      if(typeof window.startPracticeSession!=="function"||window.startPracticeSession.__hscSingleQuestionWrapped)return;
      var old=window.startPracticeSession;
      window.startPracticeSession=function(card){
        card=prepareSessionCard(card);
        return old(card&&Array.isArray(card.questions)?Object.assign({},card,{questions:card.questions.slice(0,1)}):card);
      };
      window.startPracticeSession.__hscSingleQuestionWrapped=true;
      clearInterval(t);
    },80);
    setTimeout(function(){clearInterval(t)},10000);
  }

  function dedupePlannerCards(){
    var cards=Array.from(document.querySelectorAll(".execution-card,.action-card,.timed-question-card"));
    var hasPart=cards.some(function(c){return /^Part\s+\d/i.test((c.innerText||"").trim())});
    if(!hasPart)return;
    document.querySelectorAll(".action-card-source").forEach(function(stack){
      if(/Stage\s+\d/i.test(stack.innerText||"")){stack.hidden=true;stack.style.display="none"}
    });
  }

  function handlePracticeMode(e){
    var button=e.target.closest("[data-practice-mode]");
    if(!button)return;
    var input=document.querySelector("#practiceModeInput");
    if(input)input.value=button.dataset.practiceMode||"short-answer";
    document.querySelectorAll("[data-practice-mode]").forEach(function(node){node.classList.toggle("is-active",node===button)});
    setTimeout(queue,0);
  }

  function injectPracticeModeUi(){
    if(document.querySelector("#practiceModeInput"))return;
    var timeInput=document.querySelector("#studyTimeInput");
    var form=document.querySelector("#studySprintForm");
    if(!timeInput||!form)return;
    var block=document.createElement("div");
    block.className="practice-mode-field";
    block.setAttribute("aria-label","Practice type");
    block.innerHTML='<span>Practice type</span><div class="practice-mode-toggle"><button type="button" class="practice-mode-option is-active" data-practice-mode="short-answer">Short Answer Sprint</button><button type="button" class="practice-mode-option" data-practice-mode="essay">Essay / Extended Response</button></div><input id="practiceModeInput" type="hidden" value="short-answer"><p>Choose short answers for 2-6 mark drills, or essay for thesis, paragraph and judgement practice.</p>';
    var label=timeInput.closest("label");
    if(label)label.before(block);else form.insertBefore(block,form.querySelector("button[type='submit']"));
  }

  function practiceMode(){return document.querySelector("#practiceModeInput")?.value==="essay"?"essay":"short-answer"}
  function selectedParts(){return practiceMode()==="essay"?essayParts:shortParts}
  function visibleCount(){
    var raw=document.querySelector("#studyTimeInput")?.value||"";
    var match=raw.match(/\d+/);
    var minutes=match?Number(match[0]):90;
    if(/hour|hr/i.test(raw))minutes*=60;
    return minutes>=120?4:3;
  }

  function applyLearningJourneyCards(){
    var subject=document.querySelector("#subjectsInput")?.value||"";
    var topic=document.querySelector("#weakTopicsInput")?.value||"";
    if(!/economics|labou?r|wage|employment|unemployment|market|essay|extended/i.test(subject+" "+topic))return;
    var parts=selectedParts(),count=visibleCount();
    var cards=Array.from(document.querySelectorAll(".evening-plan .execution-card, .action-card-stack:not(.action-card-source) .execution-card"));
    cards.forEach(function(card,index){
      var part=parts[index];
      if(!part||index>=count){card.hidden=true;card.style.display="none";return}
      card.hidden=false;card.style.display="";
      card.dataset.hscJourneyIndex=String(index);
      card.dataset.hscJourneyMode=practiceMode();
      setText(card,".execution-card-top span",part.label);
      setText(card,"h3",part.title);
      setText(card,".do-now",part.task);
      setLabel(card,"Question Type",part.type);
      setLabel(card,"Focus Point",part.focus);
      setLabel(card,"Most Common Mistake",part.trap);
      setLabel(card,"Estimated Marks Impact",part.impact);
      setLabel(card,"What NOT To Focus On",practiceMode()==="essay"?"Do not write the whole essay yet. Build one strong paragraph first.":"Do not do more same-looking questions. Learn the move, then answer.");
      var action=card.querySelector(".start-session");
      if(action)setNodeText(action,practiceMode()==="essay"?"Start Essay Sprint":"Start Learning Card");
    });
  }

  function prepareSessionCard(card){
    if(!card)return card;
    var essay=practiceMode()==="essay";
    var topic=document.querySelector("#weakTopicsInput")?.value||card.topic||"labour markets";
    var partIndex=Number(card.__hscJourneyIndex||window.__hscActiveJourneyIndex||0);
    var part=selectedParts()[partIndex]||selectedParts()[0];
    var task=essay?essaySessionTask(part,topic):shortSessionTask(part,topic,card);
    return Object.assign({},card,{
      title:essay?"Essay Sprint - Write one high-value paragraph":"Short Answer Sprint - Learn then answer",
      questionType:essay?"Essay / Extended response":"Tony-style short answer learning card",
      highestRoiTask:task,
      doThisNow:task,
      mostCommonMistake:essay?"Trying to write the whole essay before the argument and paragraph logic are clear.":card.mostCommonMistake,
      questions:[Object.assign({},(card.questions&&card.questions[0])||{}, {
        question:task,
        markValue:essay?"12 marks":"4 marks",
        estimatedTime:essay?"10 min":"6 min",
        focusPoint:part.focus||(essay?"Thesis, mechanism, evidence/data and judgement.":"Definition, mechanism, impact and link."),
        commonMistake:part.trap||(essay?"Retelling content without a judgement.":"Repeating notes without the economic mechanism."),
        marksImpact:part.impact||(essay?"One strong paragraph gives the essay something real to build from.":"One clear mechanism wins short-answer marks."),
        whatToIgnore:essay?"Do not polish the full essay yet. Finish this learning move first.":"Do not do another similar question before fixing the learning move."
      })]
    });
  }

  function essaySessionTask(part,topic){
    var title=(part&&part.title)||"Essay paragraph";
    if(/really asking/i.test(title))return "Decode this essay question for "+topic+": identify the directive, define the key issue, and write the judgement the essay must prove.";
    if(/thesis|argument/i.test(title))return "Write one thesis for "+topic+" with a clear position and two economic arguments.";
    if(/paragraph skeleton/i.test(title))return "Plan three body paragraphs for "+topic+": topic sentence, mechanism, example/data, and link for each.";
    if(/best paragraph|high-value/i.test(title))return "Write one full body paragraph on "+topic+" using Definition -> Cause -> Mechanism -> Impact -> Example/Data -> Judgement.";
    return "Upgrade one essay paragraph on "+topic+" by adding data/example, economic terminology and a final judgement sentence.";
  }

  function shortSessionTask(part,topic,card){
    var title=(part&&part.title)||"Short answer";
    if(/derived demand|core idea/i.test(title))return "Explain labour demand as derived demand in four exam-ready sentences.";
    if(/trap|mistake/i.test(title))return "Read a weak labour-market answer, identify the mark-losing mistake, and rewrite the corrected sentence.";
    if(/chain/i.test(title))return "Build the chain for "+topic+": output demand change -> labour demand shift -> wage/employment effect.";
    if(/4-mark|exam answer/i.test(title))return "Write one timed 4-mark labour market response using definition, mechanism, diagram language and link.";
    if(/upgrade/i.test(title))return "Upgrade a basic labour market answer by adding precise terms, diagram language and a stronger final effect.";
    return card.highestRoiTask||card.doThisNow||"Complete one focused learning card.";
  }

  function addStepper(card){
    if(card.querySelector(".session-stepper"))return;
    var labels=["Learn","Worked Example","Your Turn","AI Feedback","Fix","Next Action"];
    var ol=document.createElement("ol");
    ol.className="session-stepper";
    ol.innerHTML=labels.map(function(x,i){return'<li data-session-step="'+(i+1)+'"><span>'+(i+1)+'</span><b>'+esc(x)+'</b></li>'}).join("");
    (card.querySelector(".learning-card-head,.question-topline")||card).after(ol);
  }

  function addShellSections(card){
    if(!card.querySelector(".feedback-step-card")){
      var f=document.createElement("div");
      f.className="learning-section feedback-step-card";
      f.innerHTML='<div class="learning-section-title"><strong>AI Feedback</strong><span>Coach check</span></div><p class="micro-prompt">Submit after a real attempt. Feedback should tell you what worked, what lost marks, and what to fix.</p>';
      card.querySelector(".question-actions")?.before(f);
    }
    if(!card.querySelector(".next-action-step-card")){
      var n=document.createElement("div");
      n.className="learning-section next-action-step-card";
      n.innerHTML='<div class="learning-section-title"><strong>Next Action</strong><span>Keep moving</span></div><p class="micro-prompt">Lock this mark, then move to the next sprint card. Do not open notes yet; answer first, fix after.</p>';
      (card.querySelector(".question-feedback")||card).after(n);
    }
  }

  function packFor(card){
    var text=card.textContent||"";
    if(practiceMode()==="essay")return essayPack();
    return packs.find(function(p){return p.match.test(text)})||(/economics|labou?r|wage|employment|market/i.test(text)?packs[0]:null);
  }

  function essayPack(){
    return {id:"essay",task:"Write one Economics body paragraph using Definition -> Cause -> Mechanism -> Impact -> Example/Data -> Judgement.",must:["Essay marks come from answering the directive, not dumping notes.","A thesis needs a position: what matters most and why.","Each paragraph needs one argument, one mechanism, one example/data point and one link back.","For Economics, judgement means weighing impact, significance or limitation."],chain:"Decode the question -> choose a judgement -> plan arguments -> write one paragraph -> upgrade with data and evaluation.",model:["Labour market outcomes affect economic performance through employment, income and productivity.","For example, higher unemployment reduces household income and consumption, weakening aggregate demand.","This can slow economic growth and increase pressure on government welfare spending.","Therefore, a strong essay must link labour market change to broader economic objectives, not just describe the labour market."],scaffold:["Define the key term or issue.","State the cause or policy/change.","Explain the mechanism step by step.","Explain the economic impact.","Add example/data placeholder.","Make a judgement that answers the question."],trap:"Do not write three paragraphs that all describe the topic. Each paragraph needs a different argument.",next:"If the paragraph has mechanism + evidence + judgement, move to the next argument. If not, upgrade one sentence first."};
  }

  function enrich(card){
    var p=packFor(card);
    if(!p)return;
    deepLearn(card,p);
    deepExample(card,p);
    deepTurn(card,p);
    deepFix(card,p);
    var next=card.querySelector(".next-action-step-card .micro-prompt");
    if(next)next.textContent=p.next;
  }

  function deepLearn(card,p){
    var sec=card.querySelector(".why-section"),target=card.querySelector(".why-section .why-grid");
    if(!sec||sec.querySelector(".sprint-deep-learn"))return;
    var block=document.createElement("div");
    block.className="sprint-deep-learn";
    block.innerHTML='<div class="sprint-deep-content"><b>Must know</b>'+list(p.must,"ul")+'</div><div class="sprint-deep-content"><b>Cause-effect chain</b><p>'+esc(p.chain)+'</p></div><div class="sprint-deep-content"><b>Trap that costs marks</b><p>'+esc(p.trap)+'</p></div><div class="sprint-deep-content"><b>What to ignore tonight</b><p>Do not rewrite notes. Build the mechanism, answer once, then fix the missing link.</p></div>';
    if(target)target.before(block);else sec.appendChild(block);
  }

  function deepExample(card,p){
    var a=card.querySelector(".attack-section");
    if(!a)return;
    if(a.querySelector(".deep-example"))return;
    var box=document.createElement("div");
    box.className="worked-example-box deep-example";
    box.innerHTML='<b>Model 4-mark answer</b><p class="deep-question">'+esc(p.task)+'</p>'+list(p.model.map(function(x,i){return "Mark "+(i+1)+": "+x}),"ol")+'<span>Why it works: each sentence earns a separate mark - definition, mechanism, effect, and link.</span>';
    a.appendChild(box);
  }

  function deepTurn(card,p){
    var s=card.querySelector(".short-response-section");
    if(!s)return;
    var prompt=s.querySelector(".micro-prompt");
    if(prompt)prompt.textContent="Write this now. Aim for 4 sentences, not a paragraph of notes.";
    if(s.querySelector(".deep-task"))return;
    var box=document.createElement("div");
    box.className="exam-task-mini deep-task";
    box.innerHTML='<b>Your timed answer</b><span>'+esc(p.task)+'</span><div class="sentence-scaffold"><b>Sentence scaffold</b>'+list(p.scaffold.map(function(x,i){return "Sentence "+(i+1)+": "+x}),"ol")+'</div>';
    (prompt||s).after(box);
  }

  function deepFix(card,p){
    var r=card.querySelector(".reflection-section");
    if(!r||r.querySelector(".fix-checklist"))return;
    var box=document.createElement("div");
    box.className="fix-checklist";
    box.innerHTML='<b>Fix before you move</b>'+list(["Did I define the key term using Economics wording?","Did I explain the mechanism instead of just naming the topic?","Did I include the wage/employment/growth impact?","Did I avoid this trap: "+p.trap],"ul");
    r.prepend(box);
  }

  function inferStep(card){
    var saved=window.__hscStepCardState&&window.__hscStepCardState[key(card)];
    var fb=card.querySelector(".question-feedback:not([hidden])");
    if(fb&&fb.textContent.trim())return Math.max(Number(saved||0),4);
    return Number(saved||1);
  }

  function setStep(card,raw,quiet,passive){
    var step=Math.max(1,Math.min(6,Number(raw)||1));
    var sameStep=card.dataset.stepCard===String(step);
    window.__hscStepCardState=window.__hscStepCardState||{};
    window.__hscStepCardState[key(card)]=step;
    card.dataset.stepCard=String(step);
    card.querySelectorAll(".session-stepper [data-session-step]").forEach(function(li){
      var n=Number(li.dataset.sessionStep);
      li.classList.toggle("is-active",n===step);
      li.classList.toggle("is-done",n<step);
    });
    [[card.querySelector(".why-section"),1],[card.querySelector(".attack-section"),2],[card.querySelector(".short-response-section"),3],[card.querySelector(".concept-section"),0],[card.querySelector(".exam-application-section"),0],[card.querySelector(".feedback-step-card"),4],[card.querySelector(".reflection-section"),5],[card.querySelector(".next-action-step-card"),6]].forEach(function(x){
      if(!x[0])return;
      var show=x[1]===step;
      x[0].classList.toggle("is-step-hidden",!show);
      x[0].setAttribute("aria-hidden",show?"false":"true");
    });
    var fb=card.querySelector(".question-feedback");
    if(fb)fb.classList.toggle("is-step-hidden",!(step===4&&!fb.hidden&&fb.textContent.trim()));
    var actions=card.querySelector(".question-actions");
    if(actions){
      actions.classList.toggle("is-step-hidden",step!==3&&step!==6);
      actions.querySelectorAll("[data-question-feedback],[data-pack-feedback]").forEach(function(b){b.hidden=step!==3;b.textContent="Get feedback"});
      actions.querySelectorAll("[data-question-complete],[data-pack-complete]").forEach(function(b){b.hidden=step!==6;b.textContent=/completed/i.test(b.textContent||"")?"Mark locked":"Lock this mark"});
    }
    if(!passive||!sameStep||!card.querySelector(".step-card-controls"))controls(card,step);
    if(!quiet)document.querySelector(".focus-shell")?.scrollTo({top:0,behavior:"smooth"});
  }

  function controls(card,step){
    card.querySelectorAll(".step-card-controls").forEach(function(n){n.remove()});
    if(step===3||step===6)return;
    var c=document.createElement("div");
    c.className="step-card-controls";
    c.innerHTML=(step>1?'<button type="button" class="secondary-action" data-step-card-prev>Back</button>':"")+'<button type="button" class="primary-step-action" data-step-card-next>'+["","Show worked example","Try it now","","Fix my answer","Show next action"][step]+"</button>";
    var a=step===4?(card.querySelector(".question-feedback:not([hidden])")||card.querySelector(".feedback-step-card")):card.querySelector(".learning-section:not(.is-step-hidden)");
    if(a)a.after(c);
  }

  function stepClick(e){
    var b=e.target.closest("[data-step-card-next],[data-step-card-prev],.step-card-flow .session-stepper [data-session-step]");
    if(!b)return;
    var card=b.closest(".step-card-flow");
    if(!card)return;
    e.preventDefault();
    e.stopPropagation();
    var cur=Number(card.dataset.stepCard||1);
    var n=b.hasAttribute("data-session-step")?Number(b.dataset.sessionStep):b.hasAttribute("data-step-card-prev")?cur-1:cur+1;
    setStep(card,n);
  }

  function feedbackGuard(e){
    var b=e.target.closest("[data-question-feedback],[data-pack-feedback]");
    if(!b)return false;
    var card=b.closest(".step-card-flow,.question-card");
    if(!card)return false;
    var box=card.querySelector("[data-question-answer]"),shared=document.querySelector("#sessionNotes");
    var ans=(box?.value||shared?.value||"").trim();
    if(box&&!box.value&&shared?.value){box.value=shared.value;box.dispatchEvent(new Event("input",{bubbles:true}))}
    if(ans.split(/\s+/).filter(Boolean).length>=8)return false;
    e.preventDefault();
    e.stopImmediatePropagation();
    warn(card);
    setStep(card,3);
    return true;
  }

  function warn(card){
    var sec=card.querySelector(".short-response-section")||card;
    var w=sec.querySelector(".attempt-warning");
    if(!w){w=document.createElement("div");w.className="attempt-warning";sec.appendChild(w)}
    w.innerHTML="<strong>Write the attempt first</strong><p>Do one real sentence before asking for feedback. Minimum target: define the term, explain the mechanism, and link it to the question.</p>";
  }

  function lockGuard(e){
    var b=e.target.closest("[data-question-complete],[data-pack-complete]");
    var card=b&&b.closest(".step-card-flow");
    if(!b||!card||Number(card.dataset.stepCard||1)!==6)return false;
    e.preventDefault();
    e.stopImmediatePropagation();
    document.querySelector("#completeSessionButton")?.click();
    return true;
  }

  function key(card){return card.dataset.questionIndex||"0"}
  function setText(root,sel,text){var node=root.querySelector(sel);if(node)setNodeText(node,text)}
  function setNodeText(node,text){text=String(text||"");if(node.textContent!==text)node.textContent=text}
  function setLabel(root,label,value){Array.from(root.querySelectorAll(".card-grid div,.essay-guidance-grid div,p")).forEach(function(node){var strong=node.querySelector("strong");if(strong&&strong.textContent.trim().toLowerCase()===label.toLowerCase()){var span=node.querySelector("span");if(span)setNodeText(span,value);else if(node.lastChild&&node.lastChild.textContent!==String(value||""))node.lastChild.textContent=value}})}
  function list(items,type){return"<"+type+">"+items.map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+"</"+type+">"}
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}

  function injectCss(){
    if(document.querySelector("#hsc-exam-sprint-runtime-style"))return;
    var s=document.createElement("style");
    s.id="hsc-exam-sprint-runtime-style";
    s.textContent=".practice-mode-field{display:grid;gap:8px}.practice-mode-field>span{color:rgba(247,249,255,.82);font-size:.82rem;font-weight:850}.practice-mode-field p{margin:0;color:var(--muted);font-size:.82rem;line-height:1.35}.practice-mode-toggle{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.practice-mode-option{min-height:44px;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px;background:rgba(255,255,255,.055);color:rgba(247,249,255,.78);font-weight:850;text-align:center;cursor:pointer}.practice-mode-option.is-active{border-color:rgba(103,232,249,.46);background:rgba(103,232,249,.13);color:rgba(247,249,255,.96)}.session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64);cursor:pointer}.session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.session-stepper b{font-size:.72rem;line-height:1.15}.session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.session-stepper li.is-active span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green))}.session-stepper li.is-done{border-color:rgba(71,230,164,.24);color:rgba(71,230,164,.9)}.step-card-flow .is-step-hidden{display:none!important}.step-card-controls{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}.primary-step-action{border:0;border-radius:999px;padding:12px 16px;min-height:46px;background:linear-gradient(135deg,var(--cyan),var(--green));color:#06101f;font-weight:900}.sprint-deep-content,.worked-example-box,.exam-task-mini,.sentence-scaffold,.fix-checklist,.attempt-warning{display:grid;gap:7px;border-radius:12px;padding:10px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12)}.worked-example-box,.exam-task-mini{margin-top:8px;background:rgba(143,207,255,.08);border-color:rgba(143,207,255,.24)}.attempt-warning{margin-top:8px;background:rgba(255,193,7,.08);border-color:rgba(255,193,7,.24)}.sprint-deep-content b,.worked-example-box>b,.exam-task-mini>b,.sentence-scaffold b,.fix-checklist b,.attempt-warning strong{color:rgba(247,249,255,.9);font-size:.72rem;text-transform:uppercase}.sprint-deep-content p,.worked-example-box p,.worked-example-box span,.exam-task-mini span,.attempt-warning p{color:var(--muted);font-size:.9rem;line-height:1.42;margin:0}.sprint-deep-content ul,.worked-example-box ol,.sentence-scaffold ol,.fix-checklist ul{display:grid;gap:6px;margin:0;padding-left:18px;color:var(--muted);font-size:.9rem;line-height:1.42}.why-grid{align-items:stretch}.question-answer textarea{min-height:130px}@media(max-width:820px){.practice-mode-toggle,.session-stepper{grid-template-columns:repeat(2,minmax(0,1fr))}.question-actions,.step-card-controls{display:grid;grid-template-columns:1fr}.question-actions button{min-height:46px}.question-answer textarea{min-height:110px}}";
    document.head.appendChild(s);
  }
})();
