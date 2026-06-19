(function(){
  if(window.__hscSessionFlowPolishLoaded)return;
  window.__hscSessionFlowPolishLoaded=true;
  var steps=["Learn","Worked Example","Your Turn","AI Feedback","Fix","Next Action"];
  addStyles();
  var observer=new MutationObserver(queue);
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  document.addEventListener("input",queue,true);
  document.addEventListener("click",function(event){
    var next=event.target.closest("[data-step-next]"),prev=event.target.closest("[data-step-prev]"),jump=event.target.closest(".session-stepper [data-session-step]");
    var card=event.target.closest("#questionStack .question-card");
    if(card&&(next||prev||jump)){
      var current=Number(card.dataset.activeLearningStep||1);
      var target=jump?Number(jump.dataset.sessionStep):next?current+1:current-1;
      setStep(card,target);
    }
    setTimeout(queue,80);setTimeout(queue,450)
  },true);
  queue();

  function queue(){clearTimeout(queue.t);queue.t=setTimeout(run,80)}
  function run(){if(window.__hscExamSprintRuntimeFixes)return;clean(document.body);polishBrief();document.querySelectorAll("#questionStack .question-card").forEach(polishCard);polishCheatSheet()}
  function polishBrief(){var brief=document.querySelector("#questionEngineBrief");if(brief)brief.textContent="Follow the steps in order: learn the move, see the example, try it, get feedback, fix it, then move on."}
  function polishCard(card){
    if(!card.querySelector(".learning-section"))return;
    card.classList.add("session-flow-card");
    addStepper(card);rename(card);addExample(card);addYourTurnTask(card);addFeedback(card);addFix(card);addNext(card);setActive(card);applyProgressive(card);
  }
  function addStepper(card){
    if(card.querySelector(".session-stepper"))return;
    var ol=document.createElement("ol");ol.className="session-stepper";ol.setAttribute("aria-label","Learning session steps");
    ol.innerHTML=steps.map(function(s,i){return '<li data-session-step="'+(i+1)+'"><span>'+(i+1)+'</span><b>'+esc(s)+'</b></li>'}).join("");
    var head=card.querySelector(".learning-card-head,.question-topline");if(head)head.after(ol);else card.prepend(ol)
  }
  function rename(card){
    title(card,".why-section","Step 1: Learn","Why this mark is worth attacking");
    title(card,".attack-section","Step 2: Worked Example","Use this answer path");
    title(card,".concept-section","Concept Check","MCQ");
    title(card,".short-response-section","Step 3: Your Turn","Write the answer");
    title(card,".exam-application-section","Exam Application","Timed task");
    title(card,".reflection-section","Step 5: Fix","Lock the correction")
  }
  function title(card,sel,strong,badge){var sec=card.querySelector(sel),wrap=sec&&sec.querySelector(".learning-section-title"),first=wrap&&wrap.firstElementChild,s=wrap&&wrap.querySelector("strong"),b=wrap&&wrap.querySelector("span"),m=String(strong||"").match(/step\s*(\d+)/i);if(s)s.textContent=strong;if(b)b.textContent=first===b&&m?m[1]:badge}
  function addExample(card){
    var attack=card.querySelector(".attack-section");if(!attack||attack.querySelector(".sentence-scaffold"))return;
    var sc=scaffold(((val("#subjectsInput")||val("#cheatSubjectInput")||"")+" "+card.textContent).toLowerCase());
    var box=document.createElement("div");box.className="sentence-scaffold";
    box.innerHTML="<b>"+esc(sc.title)+"</b><ol>"+sc.lines.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+"</ol>"+(sc.example?'<p>'+esc(sc.example)+'</p>':"");
    attack.appendChild(box)
  }
  function scaffold(text){
    if(/supply|equilibrium|diagram|shortage/.test(text))return{title:"Worked example: labour supply shift",lines:["Sentence 1: Identify the shock to labour supply.","Sentence 2: State the curve shift.","Sentence 3: Explain the wage effect.","Sentence 4: Explain the employment effect.","Sentence 5: Link back to the question."],example:"Example: If labour supply falls, the supply curve shifts left, causing equilibrium wage to rise and equilibrium employment to fall."};
    if(/unemployment|underemployment|participation/.test(text))return{title:"Worked example: labour force measures",lines:["Sentence 1: Define the exact measure.","Sentence 2: State who is counted.","Sentence 3: Explain the income or consumption effect.","Sentence 4: Link to aggregate demand or growth."],example:"Example: An unemployed person is willing and able to work, actively looking, but unable to find a job. Higher unemployment reduces household income and consumption."};
    if(/productivity|skills mismatch|structural/.test(text))return{title:"Worked example: productivity chain",lines:["Sentence 1: Define the productivity or skills change.","Sentence 2: Link it to firms' labour demand.","Sentence 3: Explain wages or employment.","Sentence 4: Add a judgement or trade-off."],example:"Example: Higher productivity can raise the value of each worker's output, increasing labour demand and supporting employment or wage growth."};
    if(/economics|labour|labor|unemployment|inflation|wage|market/.test(text))return{title:"Worked example: labour demand",lines:["Sentence 1: Define labour demand.","Sentence 2: Explain derived demand.","Sentence 3: Link output demand to firms hiring workers.","Sentence 4: State the wage or employment effect."],example:"Example: Labour demand is the amount of labour firms are willing and able to hire at different wage rates. It is derived from demand for output, so stronger output demand can increase employment."};
    if(/english|module|essay|text|quote|analysis|thesis/.test(text))return{title:"English sentence path",lines:["Sentence 1: Make a thesis or topic-sentence claim.","Sentence 2: Add evidence.","Sentence 3: Name the technique.","Sentence 4: Analyse meaning.","Sentence 5: Explain audience effect.","Sentence 6: Link back to the question."]};
    if(/business|operations|marketing|finance|human resources/.test(text))return{title:"Business Studies sentence path",lines:["Sentence 1: Name the concept.","Sentence 2: Explain how it works.","Sentence 3: Add a case study or realistic example.","Sentence 4: Explain the business impact.","Sentence 5: Make a judgement."]};
    return{title:"Answer sentence path",lines:["Sentence 1: Answer the command word directly.","Sentence 2: Add the key term or method.","Sentence 3: Explain the effect, evidence or working.","Sentence 4: Link back to the question."]}
  }
  function addFeedback(card){
    if(card.querySelector(".feedback-step"))return;
    var actions=card.querySelector(".question-actions");if(!actions)return;
    var sec=document.createElement("section");sec.className="learning-section feedback-step";
    sec.innerHTML='<div class="learning-section-title"><span>Step 4</span><strong>AI Feedback</strong></div><p class="micro-prompt">Submit after a real attempt. Feedback should tell you what mark you protected, what is missing, and what to fix next.</p>';
    actions.before(sec);var btn=actions.querySelector("[data-question-feedback],[data-pack-feedback]");if(btn)btn.textContent="Get AI Feedback"
  }
  function addYourTurnTask(card){
    var short=card.querySelector(".short-response-section");if(!short||short.querySelector(".exam-task-mini"))return;
    var q=(card.querySelector(".exam-application-section .question-text")||card.querySelector(".concept-section .question-text"));
    var box=document.createElement("div");box.className="exam-task-mini";
    box.innerHTML="<b>Exam task</b><span>"+esc(q?q.textContent.trim():"Write the answer now using the worked example.")+"</span>";
    var prompt=short.querySelector(".micro-prompt");if(prompt)prompt.after(box);else short.prepend(box)
  }
  function addFix(card){
    var r=card.querySelector(".reflection-section");if(!r||r.querySelector(".fix-checklist"))return;
    var box=document.createElement("div");box.className="fix-checklist";
    box.innerHTML="<b>Fix before moving on</b><ul><li>Rewrite the weakest sentence or working line.</li><li>Name the trap you will avoid next time.</li><li>Keep the correction short enough to remember tomorrow.</li></ul>";
    r.appendChild(box)
  }
  function addNext(card){
    if(card.querySelector(".next-action-step"))return;
    var sec=document.createElement("section");sec.className="learning-section next-action-step";
    sec.innerHTML='<div class="learning-section-title"><span>Step 6</span><strong>Next Action</strong></div><p class="micro-prompt">If this felt solid, mark it complete and move to the next card. If it felt shaky, fix one sentence or working line first.</p>';
    var fb=card.querySelector(".question-feedback");if(fb)fb.after(sec);else card.appendChild(sec)
  }
  function setActive(card){
    var hasAnswer=[].some.call(card.querySelectorAll("textarea"),function(t){return t.value.trim()});
    var hasFeedback=[].some.call(card.querySelectorAll(".question-feedback"),function(n){return !n.hidden&&n.textContent.trim()});
    var saved=Number(card.dataset.activeLearningStep||0);
    var active=saved||1;if(card.querySelector(".mcq-option.is-selected,.learning-mcq-option.is-selected"))active=Math.max(active,3);if(hasAnswer)active=Math.max(active,3);if(hasFeedback&&!saved)active=4;
    setStep(card,active,true);
  }
  function setStep(card,step,quiet){
    step=Math.max(1,Math.min(6,Number(step)||1));
    card.dataset.activeLearningStep=String(step);
    card.querySelectorAll("[data-session-step]").forEach(function(li){var n=Number(li.dataset.sessionStep);li.classList.toggle("is-active",n===step);li.classList.toggle("is-done",n<step)})
    applyProgressive(card);
    if(!quiet){var shell=document.querySelector(".focus-shell");(shell||card).scrollTo? (shell||card).scrollTo({top:0,behavior:"smooth"}):card.scrollIntoView({block:"start",behavior:"smooth"})}
  }
  function applyProgressive(card){
    var active=Number(card.dataset.activeLearningStep||1);
    card.querySelectorAll(".learning-section").forEach(function(sec){
      var step=sectionStep(sec);
      sec.classList.toggle("is-step-hidden",step!==active);
      sec.setAttribute("aria-hidden",step===active?"false":"true");
    });
    card.querySelectorAll(".question-feedback").forEach(function(sec){
      var show=active===4&&!sec.hidden;
      sec.classList.toggle("is-step-hidden",!show);
      sec.setAttribute("aria-hidden",show?"false":"true");
    });
    card.querySelectorAll(".step-stage-actions").forEach(function(n){n.remove()});
    var actions=card.querySelector(".question-actions");
    if(actions){
      actions.classList.toggle("is-step-hidden",active!==3&&active!==6);
      actions.querySelectorAll("[data-question-feedback],[data-pack-feedback]").forEach(function(btn){btn.hidden=active!==3;btn.textContent="Get feedback"});
      actions.querySelectorAll("[data-question-complete],[data-pack-complete]").forEach(function(btn){btn.hidden=active!==6;btn.textContent=/completed/i.test(btn.textContent)?"Mark locked":"Lock this mark"});
    }
    var controls=document.createElement("div");
    controls.className="step-stage-actions";
    var copy=stepCopy(card,active);
    controls.innerHTML=(active>1?'<button type="button" class="secondary-action step-back" data-step-prev>Back</button>':"")+(active===3||active===6?"":'<button type="button" class="primary-step-action" data-step-next>'+esc(copy)+"</button>");
    var anchor=active===3?actions:active===4?(card.querySelector(".question-feedback:not([hidden])")||card.querySelector(".feedback-step")):card.querySelector(".learning-section:not(.is-step-hidden)");
    if(anchor)anchor.after(controls);
  }
  function sectionStep(sec){
    if(sec.classList.contains("why-section"))return 1;
    if(sec.classList.contains("attack-section"))return 2;
    if(sec.classList.contains("short-response-section"))return 3;
    if(sec.classList.contains("concept-section")||sec.classList.contains("exam-application-section"))return 0;
    if(sec.classList.contains("feedback-step"))return 4;
    if(sec.classList.contains("reflection-section"))return 5;
    if(sec.classList.contains("next-action-step"))return 6;
    return 1;
  }
  function stepCopy(card,active){
    if(active===1)return"Show worked example";
    if(active===2)return"Try it now";
    if(active===3)return"Get feedback";
    if(active===4)return"Fix my answer";
    if(active===5)return"Show next action";
    return"";
  }
  function polishCheatSheet(){
    var copy=document.querySelector("#tomorrow-cheat-sheet .section-copy");if(copy)copy.textContent="A last-minute exam action sheet: what to know, what to practise, what to ignore, and the first practice task to start now.";
    var result=document.querySelector(".cheat-sheet-result");if(!result||result.dataset.actionSheetPolished)return;result.dataset.actionSheetPolished="true";
    var eyebrow=result.querySelector(".cheat-print-head .eyebrow");if(eyebrow)eyebrow.textContent="Last-minute exam action sheet";
    renameCheat(result,"Strategy","Tonight's Strategy");renameCheat(result,"High-Probability Questions","Must Practise");renameCheat(result,"How To Answer","Answer Path");renameCheat(result,"Practice Inside HSC Helper","Start Practice From This Sheet");
    var mistakes=findCheat(result,"Common Mistakes");if(mistakes&&!findCheat(result,"What Not To Waste Time On")){var waste=document.createElement("section");waste.className="cheat-card";waste.innerHTML="<strong>What Not To Waste Time On</strong><ul><li>Do not rewrite full notes before attempting a question.</li><li>Do not start a new low-value topic before fixing the weak point.</li><li>Do not watch explanations without writing an answer.</li><li>Do not make a perfect summary instead of a timed response.</li></ul>";mistakes.before(waste)}
    var grid=result.querySelector(".practice-now .cheat-practice-grid");if(grid){var buttons=[].slice.call(grid.querySelectorAll("button"));buttons.forEach(function(b,i){if(i>1)b.remove()});if(buttons[0])buttons[0].textContent="Start Highest-ROI Practice";if(buttons[1])buttons[1].textContent="Fix My Weakest Point"}
  }
  function renameCheat(root,from,to){var c=findCheat(root,from),s=c&&c.querySelector("strong");if(s)s.textContent=to}
  function findCheat(root,title){return [].slice.call(root.querySelectorAll(".cheat-card")).find(function(c){return((c.querySelector("strong")||{}).textContent||"").trim().toLowerCase()===title.toLowerCase()})}
  function clean(root){
    if(!root)return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
    while(n=w.nextNode()){var t=n.nodeValue;t=t.replace(/\s+([:;,.])/g,"$1").replace(/\bHow To Attack This Question\b/g,"How to Attack This Question").replace(/\bCheck the Concept\b/g,"Concept Check");if(t!==n.nodeValue)n.nodeValue=t}
  }
  function addStyles(){
    if(document.querySelector("#hsc-session-flow-polish-styles"))return;var s=document.createElement("style");s.id="hsc-session-flow-polish-styles";
    s.textContent=".session-flow-card{gap:14px;max-width:100%}.session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}.session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64);cursor:pointer}.session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.session-stepper b{font-size:.72rem;line-height:1.15}.session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.session-stepper li.is-active span{color:#06101f;background:linear-gradient(135deg,var(--cyan),var(--green))}.session-stepper li.is-done{border-color:rgba(71,230,164,.24);color:rgba(71,230,164,.9)}.learning-section.is-step-hidden,.question-feedback.is-step-hidden,.question-actions.is-step-hidden{display:none!important}.step-stage-actions{display:flex;gap:10px;align-items:center;justify-content:flex-end;margin-top:2px}.primary-step-action{border:0;border-radius:999px;padding:12px 16px;min-height:46px;background:linear-gradient(135deg,var(--cyan),var(--green));color:#06101f;font-weight:900;cursor:pointer}.step-back{min-height:46px}.sentence-scaffold,.fix-checklist,.exam-task-mini{display:grid;gap:7px;border:1px solid rgba(143,207,255,.22);border-radius:12px;padding:10px;background:rgba(143,207,255,.07)}.exam-task-mini{margin:8px 0;background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.12)}.sentence-scaffold b,.fix-checklist b,.exam-task-mini b{color:rgba(247,249,255,.9);font-size:.74rem;text-transform:uppercase}.sentence-scaffold ol,.fix-checklist ul{display:grid;gap:5px;margin:0;padding-left:18px}.sentence-scaffold p,.exam-task-mini span{margin:0;color:var(--muted);line-height:1.42}.feedback-step{border-color:rgba(143,207,255,.2);background:rgba(143,207,255,.065)}.next-action-step{border-color:rgba(71,230,164,.22);background:rgba(71,230,164,.07)}.question-actions button,.cheat-practice-grid button{min-height:46px}@media(max-width:820px){.focus-shell{width:min(100%,calc(100vw - 16px));grid-template-columns:1fr;padding:12px;gap:12px}.timer-panel{position:sticky;top:8px;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:16px}.timer-ring,.timer-ring svg,.progress-ring,.progress-ring svg{width:82px;height:82px}.timer-ring strong,.progress-ring strong{font-size:1.15rem}.timer-actions{display:flex;gap:8px}.timer-actions button{min-height:40px;padding:8px 10px}.practice-workflow,.question-engine,.question-stack,.question-card,.learning-section{width:100%;min-width:0}.question-engine-head{display:grid;gap:8px}#questionProgress{width:max-content;max-width:100%}.session-stepper{grid-template-columns:repeat(3,minmax(0,1fr))}.why-grid,.criteria-grid,.question-meta-grid,.card-grid,.essay-guidance-grid{grid-template-columns:1fr!important}.learning-card-head,.learning-section-title,.question-topline,.question-actions,.step-stage-actions{align-items:stretch;flex-direction:column}.question-actions{display:grid;grid-template-columns:1fr;gap:8px}.mcq-option{grid-template-columns:30px minmax(0,1fr);min-height:52px}.question-card{padding:12px;border-radius:16px}.question-text{font-size:1rem!important}textarea{font-size:16px}.execution-card{min-width:0}.action-card-stack{grid-template-columns:1fr}}@media(max-width:460px){.session-stepper{grid-template-columns:1fr 1fr}.focus-shell{width:100%;min-height:100dvh;border-radius:0}.timer-panel{top:0}}";
    s.textContent+=".attempt-warning{display:grid;gap:7px;margin-top:8px;border:1px solid rgba(255,193,7,.24);border-radius:12px;padding:10px;background:rgba(255,193,7,.08)}.attempt-warning strong{color:rgba(247,249,255,.9);font-size:.74rem;text-transform:uppercase}.attempt-warning p{margin:0;color:var(--muted);line-height:1.42}";
    document.head.appendChild(s)
  }
  function val(sel){var n=document.querySelector(sel);return n&&n.value?n.value.trim():""}
  function esc(v){return String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
})();
