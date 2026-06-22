(function(){
  if(window.__hscTopicPackRuntimeGuard)return;
  window.__hscTopicPackRuntimeGuard=true;

  var activeTopicPack=null;
  var timerId=null;

  document.addEventListener("click",function(event){
    var button=event.target.closest(".execution-card .start-session");
    if(!button)return;
    var cardEl=button.closest(".execution-card");
    if(!isTopicPackCard(cardEl))return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    activeTopicPack=cardFromElement(cardEl,Number(button.dataset.cardIndex||0));
    openTopicPackSession(activeTopicPack);
  },true);

  document.addEventListener("click",function(event){
    var feedback=event.target.closest("[data-topic-pack-feedback]");
    if(feedback){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      submitTopicPackFeedback(Number(feedback.dataset.topicPackFeedback||0),feedback);
      return;
    }
    var complete=event.target.closest("[data-topic-pack-complete]");
    if(complete){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      var card=document.querySelector('.topic-pack-question-card[data-topic-pack-index="'+complete.dataset.topicPackComplete+'"]');
      if(card){
        card.classList.add("is-complete");
        complete.textContent="Mark locked";
        updateTopicPackProgress();
      }
    }
  },true);

  watchSprintOutput(cleanTopicPackPlanner);
  setTimeout(cleanTopicPackPlanner,250);
  setTimeout(cleanTopicPackPlanner,1200);
  injectCss();

  function cleanTopicPackPlanner(){
    var output=document.querySelector("#sprintOutput");
    var stack=output&&output.querySelector(".action-card-stack");
    if(!stack||!isTopicPackStack(stack))return;
    var alreadyClean=stack.dataset.topicPackClean==="true"&&!output.querySelector(".evening-plan");
    if(alreadyClean)return;
    output.querySelectorAll(".evening-plan").forEach(function(node){node.remove()});
    if(stack.hidden)stack.hidden=false;
    if(stack.style.display)stack.style.display="";
    if(stack.classList.contains("action-card-source"))stack.classList.remove("action-card-source");
    Array.from(stack.querySelectorAll(".execution-card")).forEach(function(card){
      if(card.hidden)card.hidden=false;
      if(card.style.display)card.style.display="";
    });
    stack.dataset.topicPackClean="true";
  }

  function watchSprintOutput(callback){
    var attempts=0;
    var timer=setInterval(function(){
      var target=document.querySelector("#sprintOutput");
      attempts+=1;
      if(!target&&attempts<25)return;
      clearInterval(timer);
      if(!target)return;
      new MutationObserver(callback).observe(target,{childList:true,subtree:true});
    },120);
  }

  function isTopicPackStack(stack){
    var text=(stack&&stack.innerText||"").toLowerCase();
    var signals=["last-minute sheet","trap check","chain builder","impact matcher","marker upgrade","lecture sheet","multiple choice"];
    return signals.filter(function(signal){return text.includes(signal)}).length>=3;
  }

  function isTopicPackCard(card){
    if(!card)return false;
    var text=(card.innerText||"").toLowerCase();
    return /last-minute sheet|trap check|chain builder|impact matcher|marker upgrade|lecture sheet|multiple choice|economics - unemployment|business studies - recruitment/.test(text);
  }

  function cardFromElement(card,index){
    var title=text(card,".card-label")||"Card "+(index+1);
    var topic=text(card,"h3")||"Topic Pack";
    var task=text(card,".do-now")||labelValue(card,/highest roi task|exam relevance/i)||"Complete this topic pack task.";
    var qType=labelValue(card,/mark attack|question type/i)||"Exam task";
    var focus=labelValue(card,/guided answer path|focus point/i)||task;
    var trap=labelValue(card,/trap|most common mistake/i)||"Being too general.";
    var impact=labelValue(card,/marks impact|estimated marks impact/i)||"Builds marks quickly.";
    var resourceName=labelValue(card,/resource/i)||"Internal HSC-style practice";
    var resource=card.querySelector("a[href]")&&card.querySelector("a[href]").href||"";
    var minutes=(text(card,".execution-card-top em").match(/\d+\s*(?:minutes|min)/i)||["12 minutes"])[0];
    return {
      title:title,
      topic:topic,
      highestRoiTask:task,
      doThisNow:task,
      questionType:qType,
      focusPoint:focus,
      mostCommonMistake:trap,
      estimatedMarksImpact:impact,
      resourceName:resourceName,
      resourceUrl:resource,
      timeRequired:minutes,
      howToApproach:["Read the card.","Use Mini Coach before writing.","Get feedback, then fix one sentence."],
      questions:[{
        question:task,
        markValue:/multiple choice/i.test(qType)?"1 mark":/lecture sheet/i.test(qType)?"Study sheet":"4 marks",
        difficulty:"Core",
        estimatedTime:"5 min",
        focusPoint:focus,
        commonMistake:trap,
        marksImpact:impact,
        whatToIgnore:"Do not rewrite notes before attempting.",
        sampleAnswer:""
      }]
    };
  }

  function openTopicPackSession(card){
    var overlay=document.querySelector("#focusOverlay");
    var shell=document.querySelector(".focus-shell");
    set("#focusTaskTitle",card.title);
    set("#focusTaskText",card.highestRoiTask);
    set("#focusQuestionType",card.questionType);
    set("#focusResourceName",card.resourceName);
    set("#focusDoNow",card.doThisNow);
    set("#focusMistake",card.mostCommonMistake);
    var link=document.querySelector("#focusResourceLink");
    if(link&&card.resourceUrl){link.hidden=false;link.href=card.resourceUrl}else if(link){link.hidden=true}
    var approach=document.querySelector("#focusApproachList");
    if(approach)approach.innerHTML=(card.howToApproach||[]).map(function(item){return"<li>"+esc(item)+"</li>"}).join("");
    var notes=document.querySelector("#sessionNotes");
    if(notes)notes.value="";
    var workflow=document.querySelector("#practiceWorkflow");
    var complete=document.querySelector("#completionScreen");
    if(workflow)workflow.hidden=false;
    if(complete)complete.hidden=true;
    renderTopicPackQuestions(card);
    if(overlay)overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("focus-active");
    shell&&shell.scrollTo({top:0,behavior:"auto"});
    startTopicPackTimer(card.timeRequired);
  }

  function renderTopicPackQuestions(card){
    var stack=document.querySelector("#questionStack");
    if(!stack)return;
    stack.innerHTML=(card.questions||[]).map(function(q,index){
      var coach=miniCoachFor(card,q);
      return '<section class="question-card topic-pack-question-card step-card-flow" data-topic-pack-index="'+index+'">'+
        '<div class="question-topline"><span>Card '+(index+1)+' of '+(card.questions.length||1)+'</span><em>'+esc(q.difficulty||"Core")+' - '+esc(q.estimatedTime||"5 min")+'</em></div>'+
        '<ol class="session-stepper" aria-label="Learning session steps">'+["Learn","Mini Coach","Your Turn","AI Feedback","Fix","Next Action"].map(function(label,i){return'<li class="'+(i===0?"is-active":"")+'" data-session-step="'+(i+1)+'"><span>'+(i+1)+'</span><b>'+esc(label)+'</b></li>'}).join("")+'</ol>'+
        '<div class="learning-section why-section"><div class="learning-section-title"><strong>Why this matters</strong><span>Exam sprint</span></div><p>'+esc(q.marksImpact||card.estimatedMarksImpact)+'</p></div>'+
        '<div class="learning-section attack-section"><div class="learning-section-title"><strong>Guided Answer Path</strong><span>How to attack it</span></div><p>'+esc(q.focusPoint||card.focusPoint)+'</p></div>'+
        '<div class="learning-section topic-pack-mini-coach"><div class="learning-section-title"><strong>Mini Coach</strong><span>Use this before answering</span></div><div class="mini-coach-grid"><div><b>Answer move</b><p>'+esc(coach.move)+'</p></div><div><b>Example line</b><p>'+esc(coach.example)+'</p></div><div><b>Trap</b><p>'+esc(q.commonMistake||card.mostCommonMistake)+'</p></div></div></div>'+
        '<div class="learning-section short-response-section"><div class="learning-section-title"><strong>Your Turn</strong><span>Write now</span></div><p class="question-text">'+esc(q.question)+'</p><label class="question-answer">Your answer / working<textarea data-topic-pack-answer="'+index+'" placeholder="Write the answer, not notes."></textarea></label></div>'+
        '<div class="learning-section feedback-step-card"><div class="learning-section-title"><strong>AI Feedback</strong><span>Coach check</span></div><div class="question-feedback" id="topicPackFeedback'+index+'" hidden></div></div>'+
        '<div class="question-actions"><button type="button" class="secondary-action" data-topic-pack-feedback="'+index+'">Get feedback</button><button type="button" class="secondary-action" data-topic-pack-complete="'+index+'">Lock this mark</button></div>'+
        '<div class="learning-section next-action-step-card"><div class="learning-section-title"><strong>Next Action</strong><span>Keep moving</span></div><p class="micro-prompt">Fix one sentence, then go back to the cards and start the next task.</p></div>'+
      '</section>';
    }).join("");
    updateTopicPackProgress();
  }

  function miniCoachFor(card,q){
    var raw=((card&&card.topic)||"")+" "+((card&&card.questionType)||"")+" "+((q&&q.question)||"")+" "+((q&&q.focusPoint)||"");
    var source=raw.toLowerCase();
    if(/unemployment|aggregate demand|consumption|household income/.test(source)){
      return {move:"Use the Economics chain: define unemployment, then link income -> consumption -> aggregate demand -> growth.",example:"Rising unemployment reduces household income, which lowers consumption and weakens aggregate demand."};
    }
    if(/recruitment|internal|external|applicant/.test(source)){
      return {move:"Use the Business chain: HR action -> applicant quality -> cost, skills or culture -> performance.",example:"Internal recruitment can reduce hiring costs and improve morale, but may limit new skills entering the business."};
    }
    if(/multiple choice|which statement|option|a\.|b\.|c\.|d\./.test(source)){
      return {move:"Eliminate vague options first, then choose the option with the exact syllabus meaning.",example:"The correct option must define the term precisely, not just sound familiar."};
    }
    if(/upgrade|weak answer|marker/.test(source)){
      return {move:"Find the missing mark: definition, mechanism, example, or judgement. Rewrite only that part.",example:"A stronger answer adds the mechanism before the final impact."};
    }
    return {move:"Answer in one clear chain: key term -> cause or action -> mechanism -> final impact.",example:"This earns marks because it shows what changes, why it changes, and why it matters."};
  }

  async function submitTopicPackFeedback(index,button){
    if(!activeTopicPack)return;
    var q=activeTopicPack.questions[index]||activeTopicPack.questions[0];
    var answer=(document.querySelector('[data-topic-pack-answer="'+index+'"]')&&document.querySelector('[data-topic-pack-answer="'+index+'"]').value)||document.querySelector("#sessionNotes")&&document.querySelector("#sessionNotes").value||"";
    var box=document.querySelector("#topicPackFeedback"+index);
    if(!box)return;
    if(answer.trim().split(/\s+/).filter(Boolean).length<8){
      box.hidden=false;
      box.textContent="Write one real exam sentence first: key term + mechanism + link to the question.";
      return;
    }
    button.disabled=true;
    box.hidden=false;
    box.textContent="AI coach is checking your answer...";
    try{
      var prompt=["Mark this HSC-style practice answer.","Subject: "+activeTopicPack.topic,"Question: "+q.question,"Focus point: "+(q.focusPoint||activeTopicPack.focusPoint),"Common mistake to check: "+(q.commonMistake||activeTopicPack.mostCommonMistake),"Student answer: "+answer].join("\n");
      var response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:prompt,subject:activeTopicPack.topic})});
      var data=await response.json();
      box.textContent=data.answer||"Feedback unavailable. Fix the weakest sentence and move on.";
    }catch(error){
      box.textContent="Feedback unavailable. Check: definition, mechanism, example, final link.";
    }finally{
      button.disabled=false;
    }
  }

  function updateTopicPackProgress(){
    var cards=Array.from(document.querySelectorAll(".topic-pack-question-card"));
    var complete=cards.filter(function(card){return card.classList.contains("is-complete")}).length;
    set("#questionProgress",complete+"/"+cards.length+" complete");
  }

  function startTopicPackTimer(raw){
    clearInterval(timerId);
    var match=String(raw||"12").match(/\d+/);
    var remaining=(match?Number(match[0]):12)*60;
    tick();
    timerId=setInterval(function(){remaining=Math.max(0,remaining-1);tick();if(!remaining)clearInterval(timerId)},1000);
    function tick(){
      var m=Math.floor(remaining/60),s=remaining%60;
      set("#timerDisplay",String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"));
    }
  }

  function labelValue(root,regex){
    var blocks=Array.from(root.querySelectorAll(".card-grid div,.essay-guidance-grid div,.risk-row p"));
    var block=blocks.find(function(node){return regex.test((node.querySelector("strong")&&node.querySelector("strong").textContent||"").trim())});
    return block?(block.querySelector("span")&&block.querySelector("span").textContent||block.textContent.replace(block.querySelector("strong")&&block.querySelector("strong").textContent||"","")).trim():"";
  }
  function text(root,selector){return root.querySelector(selector)&&root.querySelector(selector).textContent.trim()||""}
  function set(selector,value){var node=document.querySelector(selector);if(node)node.textContent=value||""}
  function esc(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}

  function injectCss(){
    if(document.querySelector("#hsc-topic-pack-runtime-style"))return;
    var style=document.createElement("style");
    style.id="hsc-topic-pack-runtime-style";
    style.textContent=".topic-pack-question-card .session-stepper{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:8px 0 10px;padding:0;list-style:none}.topic-pack-question-card .session-stepper li{display:grid;gap:4px;min-width:0;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:8px;background:rgba(255,255,255,.045);color:rgba(247,249,255,.64)}.topic-pack-question-card .session-stepper span{display:grid;place-items:center;width:22px;height:22px;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:900}.topic-pack-question-card .session-stepper b{font-size:.72rem;line-height:1.15}.topic-pack-question-card .session-stepper li.is-active{border-color:rgba(103,232,249,.44);background:rgba(103,232,249,.12);color:rgba(247,249,255,.96)}.topic-pack-question-card .learning-section{margin-top:10px}.topic-pack-question-card textarea{min-height:130px}.topic-pack-mini-coach{border-color:rgba(103,232,249,.24);background:rgba(103,232,249,.075)}.mini-coach-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.mini-coach-grid div{border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px;background:rgba(255,255,255,.045)}.mini-coach-grid b{display:block;margin-bottom:5px;color:rgba(247,249,255,.92);font-size:.72rem;text-transform:uppercase}.mini-coach-grid p{margin:0;color:var(--muted);font-size:.9rem;line-height:1.42}@media(max-width:820px){.topic-pack-question-card .session-stepper{grid-template-columns:repeat(2,minmax(0,1fr))}.topic-pack-question-card .question-actions{display:grid;grid-template-columns:1fr}.topic-pack-question-card .question-actions button{min-height:46px}.mini-coach-grid{grid-template-columns:1fr}}";
    document.head.appendChild(style);
  }
})();