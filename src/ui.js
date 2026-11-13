// ===== ממשק, מצב ושמירה =====
const KEY='noya-chachla-v1';
const EXAMS=[{n:'מיני מתכונת',d:'2026-11-26'},{n:'מתכונת',d:'2026-12-24'},{n:'בגרות',d:'2027-01-04'}];
function fresh(){return {v:1,changes:[],friends:[],hist:[],streak:0,best:0,answered:0,correct:0,topics:{},kinds:{},days:{},collection:[],reported:[],retry:[],tc:{},updatedAt:0}}
let S=fresh();
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(fresh(),JSON.parse(raw))}catch(e){}
let syncState='local',AKEY=null,LAYERS={};
const LAYER_ORDER=['hair_back','shoulder','BASE','BASE_nohair','floral','tan','makeup','lips','hair_front','hoops','nails','vape'];
function saveLocal(){S.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}scheduleRemote()}
let remoteT=null;
const fbRef=()=>window.FB.doc(window.FB.db,'noya',AKEY);
function scheduleRemote(){if(!AKEY||!window.FB)return;clearTimeout(remoteT);remoteT=setTimeout(pushRemote,1500)}
async function pushRemote(){try{await window.FB.setDoc(fbRef(),{json:JSON.stringify(S),updatedAt:S.updatedAt},{merge:true});syncState='synced'}catch(e){syncState='error'}renderSync()}
async function keyOf(code){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('ani-lo-chachla::'+code.trim()));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function withTimeout(p,ms){return Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),ms))])}
// כניסה עם קוד: טוען את השכבות ואת ההתקדמות מ-Firestore
async function enter(key){
 if(!window.FB)throw new Error('nofb');
 const FB=window.FB;
 const snap=await withTimeout(FB.getDoc(FB.doc(FB.db,'noya',key)),15000);
 if(!snap.exists())return false;
 const data=snap.data();
 const names=data.layers||LAYER_ORDER;
 const docs=await withTimeout(Promise.all(names.map(n=>FB.getDoc(FB.doc(FB.db,'noya',key,'layers',n)))),30000);
 LAYERS={};docs.forEach((d,i)=>{if(d.exists())LAYERS[names[i]]=d.data()});
 AKEY=key;try{localStorage.setItem('noya-key',key)}catch(e){}
 if(data.json&&data.updatedAt>S.updatedAt){S=Object.assign(fresh(),JSON.parse(data.json));try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
 else if(S.updatedAt)scheduleRemote();
 syncState='synced';return true;
}
function logout(){try{localStorage.removeItem('noya-key')}catch(e){}location.reload()}
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

// ---------- בחירת שאלה ----------
let Q=null,answered=false,mode='play',exam=null,lastIds=[];
const reportedSet=()=>new Set(S.reported.map(r=>r.id));
function nextId(){
 const rep=reportedSet();
 // חזרה על טעויות
 const due=S.retry.find(r=>r.due<=S.answered&&!rep.has(r.id)&&!lastIds.includes(r.id));
 if(due&&mode==='play'&&Math.random()<.85){S.retry=S.retry.filter(r=>r!==due);return due.id}
 // נושא: הכי פחות מתורגל ביחס למשקל
 let topic;
 if(mode==='exam'){topic=exam.plan[exam.i]}
 else{const t=Object.keys(TOPICS).map(k=>({k,v:((S.tc[k]||0)+Math.random()*1.2)/TOPIC_W[k]})).sort((a,b)=>a.v-b.v);topic=t[0].k}
 S.tc[topic]=(S.tc[topic]||0)+1;
 const kinds=Object.keys(KIND_TOPIC).filter(k=>KIND_TOPIC[k]===topic);
 for(let t=0;t<40;t++){
  let r=Math.random()*kinds.reduce((a,k)=>a+KIND_W[k],0),k=kinds[0];for(const kk of kinds){r-=KIND_W[kk];if(r<=0){k=kk;break}}
  const id=k+':'+Math.floor(Math.random()*KIND_COUNT[k]);
  if(rep.has(id)||lastIds.includes(id))continue;
  if(build(id))return id;
 }
 return 'num:0';
}
function newQuestion(){
 let id=nextId(),q=build(id),guard=0;while(!q&&guard++<20){id=nextId();q=build(id)}
 Q=q;answered=false;lastIds.push(id);if(lastIds.length>25)lastIds.shift();renderQ();
}

// ---------- מנגנון המשחק ----------
function onWrong(){
 S.streak=0;
 const left=CHANGES.filter(c=>!S.changes.includes(c.id));
 if(left.length){const c=pick(left);S.changes.push(c.id);S.hist.push({t:'c',id:c.id});return {msg:c.on,kind:'bad'}}
 const fl=FRIENDS.filter(f=>!S.friends.includes(f.name));
 if(fl.length){const f=fl[0];S.friends.push(f.name);S.hist.push({t:'f',id:f.name});return {msg:`נויה כבר צ'אחלה לגמרי ואין מה לשנות בה – אז עכשיו גם ${f.name} הופכת לצ'אחלה! 😱`,kind:'bad'}}
 return {msg:'כל החבורה כבר צ\'אחלות... רק שלוש תשובות נכונות ברצף יצילו אותן!',kind:'bad'};
}
function onRight(){
 S.streak++;S.best=Math.max(S.best,S.streak);
 if(S.streak>=3&&S.hist.length){const h=S.hist.pop();S.streak=0;
  if(h.t==='f'){S.friends=S.friends.filter(n=>n!==h.id);return {msg:`3 ברצף! ${h.id} חזרה להיות היא עצמה 🎉`,kind:'good'}}
  S.changes=S.changes.filter(c=>c!==h.id);const c=CHANGES.find(x=>x.id===h.id);return {msg:`3 ברצף! ${c.off} 🎉`,kind:'good'}}
 return null;
}
function record(ok){
 S.answered++;if(ok)S.correct++;
 const t=Q.topic,k=Q.kind;S.topics[t]=S.topics[t]||{a:0,c:0};S.topics[t].a++;if(ok)S.topics[t].c++;
 S.kinds[k]=S.kinds[k]||{a:0,c:0};S.kinds[k].a++;if(ok)S.kinds[k].c++;
 const d=today();S.days[d]=S.days[d]||{a:0,c:0};S.days[d].a++;if(ok)S.days[d].c++;
 if(!ok&&!S.retry.some(r=>r.id===Q.id))S.retry.push({id:Q.id,due:S.answered+5+Math.floor(Math.random()*4)});
 if(S.retry.length>60)S.retry=S.retry.slice(-60);
}

// ---------- תצוגה ----------
const $=s=>document.querySelector(s);
function avatarHTML(){return LAYER_ORDER.map(n=>{const L=LAYERS[n];return `<img class="ly ly-${n}" alt="" src="${L.src}" style="left:${L.x/12}%;top:${L.y/17.32}%;width:${L.w/12}%">`}).join('')}
function renderAvatar(){
 const wrap=$('#avatar');if(!wrap.dataset.built){wrap.innerHTML=avatarHTML();wrap.dataset.built=1}
 const prev=wrap.dataset.sig;const sig=S.changes.join(',');
 wrap.className='avatar '+S.changes.map(c=>'c-'+c).join(' ');
 const stage=$('#stage');stage.style.setProperty('--lvl',S.changes.length/CHANGES.length);
 stage.classList.toggle('chachla',S.changes.length>0);
 if(prev!==undefined&&prev!==sig){stage.classList.remove('pop');void stage.offsetWidth;stage.classList.add('pop')}
 wrap.dataset.sig=sig;
 const b=$('#bubble');if(S.changes.includes('bubble')){b.textContent=pick(PHRASES);b.hidden=false}else b.hidden=true;
 const n=S.changes.length;
 $('#status').innerHTML=n===0?'<b>נויה המקורית</b><span>אין עלייך! ככה ממשיכים 💚</span>':`<b>רמת צ'אחלה ${n}/${CHANGES.length}</b><span>${n<3?'מתחיל להיות מסוכן...':n<6?'זה כבר רציני!':'הצילו!!!'}</span>`;
 $('#meter').innerHTML=`<i style="width:${n/CHANGES.length*100}%"></i>`;
 $('#changes').innerHTML=S.changes.map(id=>`<span class="chip bad">${CHANGES.find(c=>c.id===id).name}</span>`).join('');
 const need=3-S.streak;
 $('#streak').innerHTML=S.hist.length?`<div class="dots">${[0,1,2].map(i=>`<i class="${i<S.streak?'on':''}"></i>`).join('')}</div><span>עוד <b>${need}</b> ${need===1?'תשובה נכונה':'תשובות נכונות'} ברצף כדי לבטל שינוי</span>`:`<div class="dots ok">${[0,1,2].map(i=>`<i class="${i<Math.min(S.streak,3)?'on':''}"></i>`).join('')}</div><span>רצף: <b>${S.streak}</b> · שיא: <b>${S.best}</b></span>`;
 $('#friends').innerHTML=FRIENDS.map(f=>`<div class="fr ${S.friends.includes(f.name)?'ch':''}" title="${f.name}">${friendSVG(f,S.friends.includes(f.name))}<span>${f.name}</span></div>`).join('');
}
function renderCountdown(){
 const now=new Date();now.setHours(0,0,0,0);
 $('#count').innerHTML=EXAMS.map(e=>{const d=new Date(e.d+'T00:00:00');const n=Math.round((d-now)/864e5);if(n<0)return'';return `<span class="cd ${n<=7?'hot':''}">${e.n}: ${n===0?'היום!':n===1?'מחר!':'עוד '+n+' ימים'}</span>`}).join('');
}
function renderSync(){const el=$('#sync');if(!el)return;el.textContent=syncState==='synced'?'☁️ ההתקדמות נשמרת בענן ומסונכרנת בין הטלפון למחשב':syncState==='error'?'⚠️ אין כרגע חיבור לענן – ההתקדמות נשמרת במכשיר ותסונכרן כשהחיבור יחזור':'💾 ההתקדמות נשמרת במכשיר הזה'}
function renderQ(){
 const box=$('#q');if(!Q){box.innerHTML='';return}
 const head=mode==='exam'?`<div class="qhead"><span class="tag">${TOPICS[Q.topic]}</span><span class="tag ghost">מבחן: שאלה ${exam.i+1} מתוך ${exam.plan.length}</span></div>`:`<div class="qhead"><span class="tag">${TOPICS[Q.topic]}</span><span class="tag ghost">${Q.title}</span></div>`;
 let body=`<div class="stem">${Q.stem}</div>`;
 if(Q.typed) body+=`<form id="tf" class="typed"><input id="ti" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="למשל: כ-ת-ב" dir="rtl"><button class="btn">בדיקה</button></form>`;
 else body+=`<div class="opts ${Q.chips?'chips':''} ${Q.big?'big':''}">${Q.options.map((o,i)=>`<button class="opt" data-i="${i}">${o.t}</button>`).join('')}</div>`;
 body+=`<div class="tools"><button class="link" id="hintB">💡 רמז</button><button class="link" id="expB">📖 איך פותרים?</button><button class="link dim" id="repB">🚩 דיווח על טעות בשאלה</button></div><div id="hintBox" class="hint" hidden>${Q.hint}</div><div id="fb"></div>`;
 box.innerHTML=head+body;box.classList.remove('in');void box.offsetWidth;box.classList.add('in');
 box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.i));
 if(Q.typed){$('#tf').onsubmit=e=>{e.preventDefault();answerTyped($('#ti').value)};setTimeout(()=>{if(window.innerWidth>700)$('#ti').focus()},50)}
 $('#hintB').onclick=()=>{$('#hintBox').hidden=!$('#hintBox').hidden};
 $('#expB').onclick=()=>showExplain(true);
 $('#repB').onclick=report;
}
function showExplain(open){let e=$('#exp');if(!e){$('#fb').insertAdjacentHTML('beforeend',`<div id="exp" class="explain"><h4>📖 איך פותרים</h4>${Q.explain}</div>`);e=$('#exp')}if(open)e.scrollIntoView({behavior:'smooth',block:'nearest'})}
function answer(i){
 if(answered)return;const o=Q.options[i];finish(o.ok,i);
}
function answerTyped(val){
 if(answered)return;const want=letters(Q.typed.root),got=letters(val);if(!got){$('#ti').focus();return}
 let ok=got===want,note='';
 if(!ok&&Q.typed.g==='LY'&&got.length===want.length&&got.slice(0,-1)===want.slice(0,-1)&&got.slice(-1)==='ה'){ok=true;note='נכון! רק שימי לב: בפתרונות של משרד החינוך כותבים את השורש עם <b>י</b> בסוף ('+Q.typed.root+').'}
 finish(ok,null,note,got);
}
function finish(ok,i,note,typedVal){
 answered=true;record(ok);
 const ev=ok?onRight():onWrong();
 if(i!==null&&i!==undefined){document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(Q.options[j].ok)b.classList.add('right');else if(j===i)b.classList.add('wrong')})}
 if(Q.typed){$('#ti').disabled=true;$('#tf button').disabled=true;$('#ti').classList.add(ok?'right':'wrong')}
 const praise=['יפה מאוד!','מעולה!','בדיוק!','אלופה!','נכון!','כל הכבוד!','תותחית!'];
 let html=`<div class="verdict ${ok?'ok':'no'}">${ok?'✅ '+pick(praise):'❌ לא נכון'}${!ok&&Q.typed?` – התשובה: <b>${Q.typed.root}</b>`:''}${!ok&&!Q.typed?' – התשובה הנכונה מסומנת בירוק':''}</div>`;
 if(note)html+=`<div class="note">${note}</div>`;
 if(ev)html+=`<div class="event ${ev.kind}">${ev.msg}</div>`;
 if(ok)html+=prizeChoice();
 html+=`<div class="explain" id="exp"><h4>📖 איך פותרים</h4>${Q.explain}</div>`;
 html+=`<button class="btn next" id="nextB">${mode==='exam'&&exam.i+1>=exam.plan.length?'לסיכום המבחן':'לשאלה הבאה ←'}</button>`;
 $('#fb').innerHTML=html;
 $('#fb').querySelectorAll('.prize').forEach(p=>p.onclick=()=>takePrize(p));
 $('#nextB').onclick=next;
 if(mode==='exam'){exam.res.push({topic:Q.topic,ok})}
 saveLocal();renderAvatar();
 if(ev)toast(ev.msg,ev.kind);
 setTimeout(()=>$('#nextB').scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}
function next(){if(mode==='exam'){exam.i++;if(exam.i>=exam.plan.length){examSummary();return}}newQuestion();window.scrollTo({top:Math.max(0,$('#q').offsetTop-80),behavior:'smooth'})}
let curPrizes=[];
function prizeChoice(){
 const worlds=shuffle(Object.keys(WORLD_NAMES)).slice(0,3);
 curPrizes=worlds.map(w=>pick(PRIZES.filter(p=>p.w===w)));
 return `<div class="prizes"><div class="ptitle">🎁 בחרי פרס:</div><div class="prow">${curPrizes.map((p,i)=>`<button class="prize" data-i="${i}">${prizeSVG(p)}<span>${p.n}</span></button>`).join('')}</div></div>`;
}
function takePrize(el){
 const p=curPrizes[+el.dataset.i];if(el.closest('.prizes').classList.contains('done'))return;
 S.collection.push({n:p.n,w:p.w,b:p.b,kind:p.kind,at:Date.now()});el.classList.add('taken');el.closest('.prizes').classList.add('done');
 el.closest('.prizes').querySelector('.ptitle').textContent='✨ נוסף לאוסף שלך: '+p.n;saveLocal();updateNavBadge();
}
function report(){
 if(!Q)return;if(S.reported.some(r=>r.id===Q.id)){toast('השאלה כבר דווחה');return}
 const txt=strip((Q.stem||'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
 S.reported.push({id:Q.id,text:txt,at:Date.now()});saveLocal();toast('תודה! השאלה הוצאה מהמאגר עד שתיבדק 🚩');
 if(!answered)newQuestion();
}
let toastT=null;
function toast(msg,kind){const t=$('#toast');t.innerHTML=msg;t.className='toast show '+(kind||'');clearTimeout(toastT);toastT=setTimeout(()=>t.className='toast',3200)}

// ---------- מבחן ----------
function startExam(){
 const plan=shuffle([...Array(4)].map(()=>'numbers').concat([...Array(5)].map(()=>'gizra'),[...Array(4)].map(()=>'binyan'),[...Array(3)].map(()=>'beinoni'),[...Array(4)].map(()=>'tzura')));
 exam={plan,i:0,res:[],start:Date.now()};mode='exam';show('play');newQuestion();
}
function examSummary(){
 const ok=exam.res.filter(r=>r.ok).length,n=exam.res.length;const mins=Math.round((Date.now()-exam.start)/60000);
 const by={};exam.res.forEach(r=>{by[r.topic]=by[r.topic]||{a:0,c:0};by[r.topic].a++;if(r.ok)by[r.topic].c++});
 $('#q').innerHTML=`<div class="summary"><h3>סיכום מבחן התרגול</h3><div class="big">${Math.round(ok/n*100)}</div><p>${ok} תשובות נכונות מתוך ${n} · ${mins} דקות</p><table>${Object.keys(by).map(t=>`<tr><td>${TOPICS[t]}</td><td>${by[t].c}/${by[t].a}</td></tr>`).join('')}</table><button class="btn" id="backB">חזרה לתרגול</button></div>`;
 $('#backB').onclick=()=>{mode='play';exam=null;newQuestion()};
}

// ---------- אוסף ----------
function renderCollection(){
 const el=$('#coll');if(!S.collection.length){el.innerHTML='<p class="empty">עדיין אין פרסים. כל תשובה נכונה = פרס לבחירה!</p>';return}
 const by={};S.collection.forEach(c=>{const k=c.n;by[k]=by[k]||{...c,cnt:0};by[k].cnt++});
 el.innerHTML=`<p class="muted">${S.collection.length} פרסים נאספו</p><div class="cgrid">${Object.values(by).map(c=>`<div class="citem">${prizeSVG(c)}<span>${c.n}</span>${c.cnt>1?`<b class="cnt">×${c.cnt}</b>`:''}</div>`).join('')}</div>`;
}
function updateNavBadge(){const b=$('#collBadge');if(b)b.textContent=S.collection.length||''}

// ---------- מסך הורה ----------
function renderParent(){
 const el=$('#par');const pct=(c,a)=>a?Math.round(c/a*100)+'%':'—';
 const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;days.push({k,lab:`${d.getDate()}/${d.getMonth()+1}`,...(S.days[k]||{a:0,c:0})})}
 const mx=Math.max(1,...days.map(d=>d.a));
 const kinds=Object.keys(S.kinds).map(k=>({k,...S.kinds[k]})).filter(x=>x.a>=3).sort((a,b)=>a.c/a.a-b.c/b.a);
 el.innerHTML=`<h3>ניתוח מצב אישי</h3><p class="muted" id="sync"></p>
 <div class="kpis"><div><b>${S.answered}</b><span>שאלות</span></div><div><b>${pct(S.correct,S.answered)}</b><span>הצלחה</span></div><div><b>${S.best}</b><span>שיא רצף</span></div><div><b>${S.changes.length}/${CHANGES.length}</b><span>שינויים כרגע</span></div></div>
 <h4>לפי נושא</h4><table class="tbl"><tr><th>נושא</th><th>שאלות</th><th>הצלחה</th><th></th></tr>${Object.keys(TOPICS).map(t=>{const x=S.topics[t]||{a:0,c:0};const p=x.a?x.c/x.a:0;return `<tr><td>${TOPICS[t]}</td><td>${x.a}</td><td>${pct(x.c,x.a)}</td><td><div class="bar"><i style="width:${p*100}%;background:${p>=.8?'#2f9e63':p>=.6?'#e0a526':'#e05656'}"></i></div></td></tr>`}).join('')}</table>
 <h4>14 הימים האחרונים</h4><div class="days">${days.map(d=>`<div title="${d.a} שאלות, ${d.c} נכונות"><i style="height:${d.a/mx*100}%"></i><span>${d.lab}</span></div>`).join('')}</div>
 <h4>סוגי השאלות הקשים ביותר</h4>${kinds.length?`<table class="tbl"><tr><th>סוג שאלה</th><th>שאלות</th><th>הצלחה</th></tr>${kinds.slice(0,6).map(k=>`<tr><td>${KIND_NAME[k.k]}</td><td>${k.a}</td><td>${pct(k.c,k.a)}</td></tr>`).join('')}</table>`:'<p class="muted">עוד אין מספיק נתונים (צריך לפחות 3 שאלות מכל סוג).</p>'}
 <h4>שאלות שדווחו כשגויות (${S.reported.length})</h4>${S.reported.length?`<p class="muted">השאלות האלה לא מוצגות לנויה. אפשר להעביר לי את הרשימה לבדיקה, או להחזיר שאלה למאגר.</p><ul class="rep">${S.reported.map((r,i)=>`<li><span>${r.text}</span><button class="link" data-r="${i}">החזרה למאגר</button></li>`).join('')}</ul>`:'<p class="muted">אין דיווחים.</p>'}
 <h4>יציאה</h4><p class="muted">מנתק את המכשיר הזה. כדי להיכנס שוב צריך את הקוד.</p><button class="btn ghost" id="logoutB">יציאה מהמכשיר</button>
 <h4>איפוס</h4><p class="muted">מוחק את כל ההתקדמות, השינויים והאוסף.</p><button class="btn ghost" id="resetB">איפוס התקדמות</button><div id="resetC" hidden class="confirm">בטוח? אי אפשר לבטל את זה. <button class="btn danger" id="resetY">כן, לאפס</button> <button class="btn ghost" id="resetN">ביטול</button></div>`;
 renderSync();
 $('#logoutB').onclick=logout;
 el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{S.reported.splice(+b.dataset.r,1);saveLocal();renderParent()});
 $('#resetB').onclick=()=>{$('#resetC').hidden=false};$('#resetN').onclick=()=>{$('#resetC').hidden=true};
 $('#resetY').onclick=()=>{S=fresh();saveLocal();renderAll();show('parent');toast('ההתקדמות אופסה')};
}


// ---------- הסבר המשחק ----------
function openGuide(){
 const g=$('#guide');
 const fr=FRIENDS.map(f=>friendSVG(f,false)).join('');
 const frc=FRIENDS.slice(0,2).map(f=>friendSVG(f,true)).join('');
 g.innerHTML=`<div class="guide" role="dialog" aria-label="איך משחקים">
 <div class="ghead"><button class="gclose" id="gX" aria-label="סגירה">✕</button><h2>היי נויה! ככה משחקים 👋</h2><p>עונים על שאלות בלשון לקראת המתכונת והבגרות. כל עוד את עונה נכון – את נשארת את. אבל כל טעות... הופכת אותך לאט לאט לצ'אחלה 😱</p></div>
 <div class="gsteps">
  <div class="gs"><div class="gi">✏️</div><div><h4>עונים על שאלות</h4><p>גזרות ושורשים, בניינים, בינוני, דרכי תצורה ושם המספר – כמו בבגרות. בכל שאלה יש <b>💡 רמז</b> ו<b>📖 איך פותרים</b>. מותר להשתמש בהם כמה שרוצים, זה לא מוריד שום דבר.</p></div></div>
  <div class="gs good"><div class="gi">🎁</div><div><h4>תשובה נכונה = פרס</h4><p>אחרי כל תשובה נכונה בוחרים פרס אחד מתוך שלושה: לגו, מארוול, סדרות, Coldplay ו־Arctic Monkeys, סטייק עם שעועית ירוקה או משהו לתלתלים. כל פרס נכנס ל<b>אוסף</b> שלך.</p></div></div>
  <div class="gs bad"><div class="gi">💋</div><div><h4>טעות = מתחילים להפוך לצ'אחלה</h4><p>כל טעות מוסיפה לך שינוי אחד, בהפתעה: בוטוקס בשפתיים, החלקה לתלתלים, איפור מוגזם, ציפורניים באורך של מטר, וייפ ביד, חולצה פרחונית, דיבור של צ'אחלה, עגילי חישוק ענקיים ושיזוף כתום. אחרי 9 טעויות – צ'אחלה מלאה.</p></div></div>
  <div class="gs bad"><div class="gi">👯</div><div><h4>ואז מגיע תורן של החברות</h4><p>כשכבר אין מה לשנות בך, כל טעות נוספת הופכת לצ'אחלה את אחת החברות – ליאור, מיי, ליה, יעל והילה, לפי הסדר. כלומר: הטעויות שלך עולות גם להן 😬</p><div class="gfr">${fr}<span class="arr">←</span>${frc}</div></div></div>
  <div class="gs back"><div class="gi">🔄</div><div><h4>הדרך חזרה: 3 ברצף</h4><p><span class="gdots"><i></i><i></i><i></i></span> שלוש תשובות נכונות ברצף מבטלות שינוי אחד. קודם מצילים את החברות (מי שהפכה אחרונה חוזרת ראשונה), ואחר כך את התלתלים, השפתיים וכל השאר. טעות באמצע – הרצף מתחיל מחדש. הנקודות הירוקות ליד הדמות מראות כמה נשאר.</p></div></div>
  <div class="gs"><div class="gi">🔁</div><div><h4>טעויות חוזרות</h4><p>שאלה שטעית בה תחזור אלייך אחרי כמה שאלות, כדי שבפעם הבאה זה כבר יהיה שלך.</p></div></div>
  <div class="gs"><div class="gi">⏱️</div><div><h4>עוד בתפריט למטה</h4><p><b>מבחן</b> – 20 שאלות ברצף וציון בסוף. <b>אוסף</b> – כל הפרסים שצברת. <b>המצב שלי</b> – באילו נושאים את חזקה ומה כדאי עוד לתרגל. נראה לך שיש טעות בשאלה? לחצי <b>🚩</b> והיא יוצאת מהמשחק עד שנבדוק.</p></div></div>
 </div>
 <div class="gfoot"><button class="btn" id="gGo">${S.seenGuide?'הבנתי, חוזרים לשחק':'יאללה, מתחילות! 💪'}</button></div></div>`;
 g.hidden=false;
 const close=()=>{g.hidden=true;if(!S.seenGuide){S.seenGuide=true;saveLocal()}};
 $('#gX').onclick=close;$('#gGo').onclick=close;g.onclick=e=>{if(e.target===g)close()};
}

// ---------- ניווט ----------
function show(v){
 document.querySelectorAll('.view').forEach(x=>x.hidden=x.id!=='v-'+v);
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v||(v==='play'&&b.dataset.v==='play')));
 if(v==='coll')renderCollection();if(v==='parent')renderParent();
 if(location.hash!=='#'+v&&v!=='play')history.replaceState(null,'','#'+v);if(v==='play'&&location.hash)history.replaceState(null,'',location.pathname+location.search);
}
function renderAll(){renderAvatar();renderCountdown();updateNavBadge();if(!Q)newQuestion();else renderQ()}
function startGame(){
 document.body.classList.remove('locked');$('#login').hidden=true;
 document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{const v=b.dataset.v;if(v==='exam'){show('exam');return}show(v)});
 $('#examGo').onclick=startExam;$('#helpB').onclick=openGuide;
 renderAll();
 const h=location.hash.slice(1);if(['coll','parent'].includes(h))show(h);else show('play');
 if(!S.seenGuide)setTimeout(openGuide,400);
}
function loginUI(msg){
 const L=$('#login');L.hidden=false;document.body.classList.add('locked');
 $('#lmsg').textContent=msg||'';
 $('#lform').onsubmit=async e=>{e.preventDefault();const code=$('#lcode').value;if(code.trim().length<4){$('#lmsg').textContent='צריך להקליד את הקוד';return}
  $('#lbtn').disabled=true;$('#lmsg').textContent='בודקת...';
  try{const ok=await enter(await keyOf(code));if(ok)startGame();else{$('#lmsg').textContent='הקוד לא נכון. נסי שוב.';$('#lbtn').disabled=false}}
  catch(err){$('#lmsg').textContent='אין חיבור לשרת כרגע. בדקי את האינטרנט ונסי שוב.';$('#lbtn').disabled=false}};
}
document.addEventListener('DOMContentLoaded',async()=>{
 if(location.hash==='#setup'){setupUI();return}
 let k=null;try{k=localStorage.getItem('noya-key')}catch(e){}
 if(k){$('#login').hidden=false;$('#lmsg').textContent='טוענת...';$('#lform').hidden=true;
  try{if(await enter(k)){startGame();return}}catch(e){}
  $('#lform').hidden=false;
 }
 loginUI();
});
// ---------- הגדרה ראשונית (פעם אחת): העלאת השכבות ל-Firestore ----------
function setupUI(){
 const L=$('#login');L.hidden=false;document.body.classList.add('locked');
 $('#lbox').innerHTML=`<h2>הגדרה ראשונית</h2><p class="muted">העלאת האיור של נויה לענן. עושים את זה פעם אחת בלבד.</p>
 <form id="sform" class="sform"><label>קוד כניסה (לפחות 8 תווים)<input id="sc1" type="password" autocomplete="new-password"></label><label>שוב את הקוד, לאימות<input id="sc2" type="password" autocomplete="new-password"></label><label>הקובץ noya-layers.json<input id="sf" type="file" accept=".json,application/json"></label><button class="btn" id="sbtn">העלאה</button></form><p id="smsg" class="lmsg"></p>`;
 $('#sform').onsubmit=async e=>{e.preventDefault();const c1=$('#sc1').value.trim(),c2=$('#sc2').value.trim(),f=$('#sf').files[0],m=$('#smsg');
  if(c1.length<8){m.textContent='הקוד צריך להיות באורך 8 תווים לפחות';return}if(c1!==c2){m.textContent='שני הקודים לא זהים';return}if(!f){m.textContent='צריך לבחור את הקובץ';return}
  if(!window.FB){m.textContent='אין חיבור ל-Firebase';return}
  $('#sbtn').disabled=true;
  try{const data=JSON.parse(await f.text());const key=await keyOf(c1);const FB=window.FB;const names=Object.keys(data);let i=0;
   for(const n of names){m.textContent=`מעלה ${++i} מתוך ${names.length}...`;await FB.setDoc(FB.doc(FB.db,'noya',key,'layers',n),data[n])}
   await FB.setDoc(FB.doc(FB.db,'noya',key),{layers:names,createdAt:Date.now()},{merge:true});
   m.innerHTML='✅ הכול עלה! עכשיו אפשר <a href="./">להיכנס למשחק</a> עם הקוד.';
  }catch(err){m.textContent='משהו נכשל: '+err.message;$('#sbtn').disabled=false}};
}
function confirmLeave(){return true}
