(function(){
  if(window.__hscExamSprintRuntimeFixes)return;
  window.__hscExamSprintRuntimeFixes=true;

  var packs=[
    {id:"demand",match:/labou?r demand|derived demand|demand for labour|economic term|concept check/i,task:"Explain why labour demand is derived demand and outline one factor that can increase labour demand. (4 marks)",must:["Labour demand = the quantity of labour firms are willing and able to hire at different wage rates.","It is derived demand: firms hire workers because consumers demand the goods and services those workers produce.","Diagram memory: wage rate on the vertical axis, quantity of labour on the horizontal axis, labour demand slopes downward.","High-value triggers: output demand, productivity, labour costs, technology and business confidence."],chain:"Higher demand for output -> firms need more workers -> labour demand shifts right -> employment rises and wage pressure increases.",model:["Labour demand is the amount of labour firms are willing and able to hire at different wage rates.","It is derived demand because workers are hired to produce output that consumers demand.","If demand for output rises, firms may increase production and hire more workers.","This shifts labour demand right, increasing employment and putting upward pressure on wages."],scaffold:["Define labour demand.","Explain derived demand using output demand.","Name one factor that shifts labour demand right.","State the wage and employment effect."],trap:"Do not describe workers looking for jobs. That is labour supply, not labour demand.",next:"If your mechanism is correct, move to equilibrium wage. If not, rewrite the cause-effect chain first."},
    {id:"equilibrium",match:/supply|equilibrium|wage rate|shortage|surplus|diagram|minimum wage|cause-effect/i,task:"Using a labour market diagram, explain the likely effect of a decrease in labour supply on wages and employment. (4 marks)",must:["Labour supply = workers willing and able to work at different wage rates.","Equilibrium wage is where labour demand equals labour supply.","If supply shifts left, equilibrium wage rises and employment falls. If demand shifts right, both wage and employment usually rise.","Minimum wage questions test a price floor above equilibrium, not just 'wages go up'."],chain:"Market shock -> curve shifts -> new equilibrium wage -> new employment level -> possible shortage/surplus.",model:["A decrease in labour supply shifts the labour supply curve left.","At the original wage there is excess demand for labour, so employers compete for fewer workers.","The equilibrium wage rises while the equilibrium quantity of labour employed falls.","The answer must link both outcomes to the diagram, not only state that wages increase."],scaffold:["State which curve shifts and direction.","Explain pressure at the old wage.","Give both wage and employment outcomes.","Link back to the diagram/question."],trap:"Do not say every higher wage increases employment. The curve shift decides the employment result.",next:"Now transfer the same diagram logic to unemployment, productivity or minimum wage."},
    {id:"unemployment",match:/unemployment|underemployment|participation|labou?r force|cyclical|structural/i,task:"Explain one economic impact of rising unemployment on the Australian economy. (4 marks)",must:["Unemployment = actively seeking work and unable to find it.","Underemployment = employed but wanting more hours or better use of skills.","Participation rate measures the share of working-age people in the labour force.","Common impacts: lower income, lower consumption, weaker aggregate demand, lost skills and budget pressure."],chain:"Unemployment rises -> household income falls -> consumption falls -> aggregate demand weakens -> economic growth may slow.",model:["Rising unemployment means more people who are willing and able to work cannot find jobs.","This reduces household income for affected workers.","Lower income can reduce consumption spending, weakening aggregate demand.","As a result, economic growth may slow and government welfare spending may increase."],scaffold:["Define unemployment accurately.","Identify the immediate income effect.","Explain the consumption/aggregate demand mechanism.","Link to growth, welfare spending or living standards."],trap:"Do not confuse unemployment with participation rate. A person outside the labour force is not counted as unemployed.",next:"If your answer only named a social effect, add one economic mechanism before moving on."},
    {id:"productivity",match:/productivity|skills mismatch|bargaining|real wage|structural|training|application/i,task:"Explain how improved labour productivity can affect labour demand and economic performance. (4 marks)",must:["Labour productivity = output per worker or output per hour worked.","Higher productivity can increase labour demand when workers generate more output or revenue for firms.","Skills mismatch causes structural unemployment when worker skills do not match available jobs.","Real wage means wage adjusted for inflation; it matters for purchasing power and labour costs."],chain:"Training/technology improves productivity -> workers produce more value -> firms may demand more labour -> output and incomes can rise.",model:["Labour productivity is the amount of output produced per worker or per hour worked.","If productivity rises, each worker can produce more output for the firm.","This can increase the value of hiring workers and shift labour demand to the right.","Higher productivity can support higher output, competitiveness and economic growth."],scaffold:["Define productivity.","Explain what changes for firms.","Link to labour demand or employment.","Add output, competitiveness or growth."],trap:"Do not write that productivity means working harder only. It is output per worker/hour.",next:"Lock the mark only if your answer has definition + mechanism + impact. Otherwise fix the missing link."}
  ];

  injectCss();
  wrapStarter();
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener("click",function(e){
    if(feedbackGuard(e)||lockGuard(e))return;
    if(e.target.closest(".start-session,[data-card-index],[data-evening-card-index],[data-fallback-card-index]"))window.__hscStepCardState={};
    stepClick(e);
    setTimeout(queue,120);
    setTimeout(queue,700);
  },true);
  queue();
  setInterval(run,1000);

  function queue(){clearTimeout(queue.t);queue.t=setTimeout(run,80)}
  function run(){
    var b=document.querySelector("#studySprintForm button[type='submit']");
    if(b&&!b.disabled)b.textContent="Create my mark attack cards";
    dedupePlannerCards();
    Array.from(document.querySelectorAll("#questionStack .question-card")).forEach(function(card,i){
      if(i>0){card.hidden=true;card.style.display="none";return}
      card.classList.add("step-card-flow");
      addStepper(card);
      addShellSections(card);
      enrich(card);
      setStep(card,inferStep(card),true);
    });
  }

  function wrapStarter(){
    var t=setInterval(function(){
      if(typeof window.startPracticeSession!=="function"||window.startPracticeSession.__hscSingleQuestionWrapped)return;
      var old=window.startPracticeSession;
      window.startPracticeSession=function(card){
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
    return packs.find(function(p){return p.match.test(text)})||(/economics|labou?r|wage|employment|market/i.test(text)?packs[0]:null);
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
    a.querySelectorAll(".worked-example-box").forEach(function(x){x.remove()});
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
    s.querySelectorAll(".exam-task-mini").forEach(function(x){x.remove()});
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

  function setStep(card,raw,quiet){
    var step=Math.max(1,Math.min(6,Number(raw)||1));
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
    controls(card,step);
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
  function list(items,type){return"<"+type+">"+items.map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+"</"+type+">"}
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}

  function injectCss(){
    if(document.querySelector("#hsc-exam-sprint-runtime-style"))return;
    var s=document.createElement("style");
    s.id="hsc-exam-sprint-runtime-style";
    s.textContent=".session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64);cursor:pointer}.session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.session-stepper b{font-size:.72rem;line-height:1.15}.session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.session-stepper li.is-active span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green))}.session-stepper li.is-done{border-color:rgba(71,230,164,.24);color:rgba(71,230,164,.9)}.step-card-flow .is-step-hidden{display:none!important}.step-card-controls{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}.primary-step-action{border:0;border-radius:999px;padding:12px 16px;min-height:46px;background:linear-gradient(135deg,var(--cyan),var(--green));color:#06101f;font-weight:900}.sprint-deep-learn{display:grid;gap:8px;margin:8px 0}.sprint-deep-content,.worked-example-box,.exam-task-mini,.sentence-scaffold,.fix-checklist,.attempt-warning{display:grid;gap:7px;border-radius:12px;padding:10px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12)}.worked-example-box,.exam-task-mini{margin-top:8px;background:rgba(143,207,255,.08);border-color:rgba(143,207,255,.24)}.attempt-warning{margin-top:8px;background:rgba(255,193,7,.08);border-color:rgba(255,193,7,.24)}.sprint-deep-content b,.worked-example-box>b,.exam-task-mini>b,.sentence-scaffold b,.fix-checklist b,.attempt-warning strong{color:rgba(247,249,255,.9);font-size:.72rem;text-transform:uppercase}.sprint-deep-content p,.worked-example-box p,.worked-example-box span,.exam-task-mini span,.attempt-warning p{color:var(--muted);font-size:.9rem;line-height:1.42;margin:0}.sprint-deep-content ul,.worked-example-box ol,.sentence-scaffold ol,.fix-checklist ul{display:grid;gap:6px;margin:0;padding-left:18px;color:var(--muted);font-size:.9rem;line-height:1.42}.why-grid{align-items:stretch}.question-answer textarea{min-height:130px}@media(max-width:820px){.session-stepper{grid-template-columns:repeat(3,minmax(0,1fr))}.question-actions,.step-card-controls{display:grid;grid-template-columns:1fr}.question-actions button{min-height:46px}.question-answer textarea{min-height:110px}}";
    document.head.appendChild(s);
  }
})();
