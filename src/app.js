// ===== לוגיקת המשחק =====
const BIN={Q:'פעל (קל)',N:'נפעל',P:'פיעל',PU:'פועל',H:'הפעיל',HU:'הופעל',T:'התפעל'};
const BIN_ORDER=['Q','N','P','PU','H','HU','T'];
const GIZ={S:'השלמים',M:'המרובעים',PN:'חפ"ן',PY:'נפי"ו',AY:'נעו"י',LY:'נל"י',LA:'נל"א'};
const GIZ_ORDER=['S','M','PN','PY','AY','LY','LA'];
const GIZ_TIP={
 S:'שלוש אותיות שורש שנשמרות בכל הצורות. אחרי שמורידים תחיליות וסיומות נשארות שלוש אותיות. זהירות: גם ה, נ, מ, ת, י יכולות להיות אותיות שורש (נִכְנַס, מַתְחִיל).',
 M:'ארבע אותיות שורש. פעלים מרובעים נוטים רק בבניינים פיעל, פועל והתפעל. סוגים נפוצים: שורש עם הכפלה (גִּלְגֵּל, צִלְצֵל), אות מאש"ת + שלוש אותיות (שִׁכְפֵּל, תִּרְגֵּל, אִבְחֵן), הכפלת האות האחרונה, ושורש שנגזר משם (טִלְפֵּן מ"טלפון", תִּכְנֵת מ"תוכנה").',
 PN:'השורש מתחיל ב־נ. ה־נ נבלעת כשהיא אמורה לבוא בלי תנועה אחרי תחילית – ובמקומה יש דגש באות הבאה (הִפִּיל, יִפֹּל, נִצַּל, הֻכַּר). בצורות אחרות ה־נ נשמרת (נָפַל, נוֹפֵל, הִתְנַצֵּל).',
 PY:'השורש מתחיל ב־י. בנפעל, בהפעיל ובהופעל ה־י הופכת ל־ו (נוֹלַד, הוֹשִׁיב, הוּרַד). בבניין קל, בעתיד ובשם הפועל, היא לפעמים נשמטת (יֵשֵׁב, לָשֶׁבֶת, לָדַעַת). בפיעל ובהתפעל היא נשמרת (מְיַשֵּׁב, הִתְיַשֵּׁב).',
 AY:'אות השורש האמצעית היא ו או י. בעבר בבניין קל היא לא נראית (קַמְתִּי, רַצְתִּי), ובעתיד ובשם הפועל היא מופיעה (יָקוּם, לָשִׁיר). בהפעיל: הֵקִים / מֵקִים, בהופעל: הוּקַם. במקום פיעל והתפעל מופיעות התבניות פּוֹלֵל / הִתְפּוֹלֵל (מְעוֹרֵר, הִתְעוֹרֵר).',
 LY:'האות האחרונה של השורש היא י. בכתב היא מופיעה כ־ה בסוף המילה (בָּנָה), כ־י (בָּנִיתִי), כ־ת (בָּנְתָה, לִבְנוֹת) – או נעלמת לגמרי (בָּנוּ, יִבְנוּ).',
 LA:'השורש מסתיים ב־א. ה־א נשמרת בכתב בכל הצורות, גם כשלא שומעים אותה (מָצָאתִי, נִקְרָא, מִלְּאוּ).'
};
const GIZ_FIND='שלבי זיהוי הגזרה: (1) מוצאים את השורש. (2) שורש של 4 אותיות ← מרובעים. מתחיל ב־נ ← חפ"ן. מתחיל ב־י ← נפי"ו. האמצעית ו/י ← נעו"י. האחרונה י ← נל"י. האחרונה א ← נל"א. אחרת ← שלמים.';
const BIN_TIP={
 Q:'פעל (קל): בעבר אין תוספת (כָּתַב), בהווה תבנית קוֹטֵל (כּוֹתֵב), בעתיד יִקְטֹל (יִכְתֹּב), שם הפועל לִקְטֹל.',
 N:'נפעל: נ בתחילת העבר וההווה (נִכְתַּב). בעתיד ובשם הפועל יש במקומה דגש באות השורש הראשונה (יִכָּתֵב, לְהִכָּתֵב).',
 P:'פיעל: דגש באות השורש השנייה. עבר קִטֵּל (סִפֵּר), הווה מְקַטֵּל, עתיד יְקַטֵּל, שם הפועל לְקַטֵּל.',
 PU:'פועל: קובוץ ודגש באות השנייה – קֻטַּל (סֻפַּר), הווה מְקֻטָּל. זה הבניין הסביל של פיעל, ואין לו שם פועל.',
 H:'הפעיל: ה בעבר (הִקְטִיל), מ בהווה (מַקְטִיל), ולרוב י לפני האות האחרונה. שם הפועל לְהַקְטִיל.',
 HU:'הופעל: ה עם קובוץ בעבר (הֻקְטַל), מ עם קובוץ בהווה (מֻקְטָל). זה הבניין הסביל של הפעיל, ואין לו שם פועל.',
 T:'התפעל: הִתְ־ בעבר, מִתְ־ בהווה, יִתְ־/תִּתְ־ בעתיד, לְהִתְ־ בשם הפועל, ודגש באות השורש השנייה.'
};
function binNote(b,g){
 if(g==='PY'&&['N','H','HU'].includes(b))return 'בגזרת נפי"ו הבניין נראה כך: נוֹ־ (נפעל), הוֹ־ / מוֹ־ (הפעיל), הוּ־ / מוּ־ (הופעל) – ה־י של השורש הפכה ל־ו.';
 if(g==='AY'&&b==='H')return 'בגזרת נעו"י הפעיל נראה כך: הֵקִים, מֵקִים, יָקִים.';
 if(g==='AY'&&b==='HU')return 'בגזרת נעו"י הופעל נראה כך: הוּקַם, מוּקָם.';
 if(g==='AY'&&b==='P')return 'בגזרת נעו"י במקום פיעל רגיל מופיעה תבנית פּוֹלֵל (מְעוֹרֵר) – והיא שייכת לבניין פיעל.';
 if(g==='AY'&&b==='T')return 'בגזרת נעו"י במקום התפעל רגיל מופיעה תבנית הִתְפּוֹלֵל (הִתְעוֹרֵר) – והיא שייכת לבניין התפעל.';
 if(g==='PN'&&['N','H','HU'].includes(b))return 'בגזרת חפ"ן ה־נ של השורש נבלעת ובמקומה יש דגש: נִפַּל, הִפִּיל, הֻפַּל.';
 if(g==='M')return 'פעלים מרובעים נוטים רק בפיעל, בפועל ובהתפעל.';
 return '';
}
const ACTIVE={Q:1,P:1,H:1,PU:0,HU:0,N:0};
const N_PASSIVE=['נִכְתְּבוּ','נִשְׁלְחוּ','נִבְנָה','נַעֲשָׂה','נִתַּן','נִקְרָא','נוֹסְפוּ','יִשָּׁמֵר'];
const POS={verb:'פועל',noun:'שם עצם',adj:'שם תואר'};
const WAYS={root:'שורש ומשקל',suf:'בסיס וצורן',blend:'הלחם בסיסים',acr:'ראשי תיבות',loan:'שאילה מלעז'};
const WAY_TIP='חמש דרכי התצורה: <b>שורש ומשקל</b> – אותיות השורש בתבנית קבועה (מִכְתָּב = מִקְטָל). <b>בסיס וצורן</b> – מילה שלמה + סיומת (סִפְרוֹן = סֵפֶר + וֹן). <b>הלחם בסיסים</b> – שתי מילים שהתחברו למילה אחת (רַמְזוֹר = רֶמֶז + אוֹר). <b>ראשי תיבות</b> – האותיות הראשונות של כמה מילים (צה"ל). <b>שאילה מלעז</b> – מילה שנלקחה משפה אחרת (טֶלֶפוֹן).';
const TOPICS={gizra:'גזרות ושורשים',binyan:'בניינים',beinoni:'בינוני',tzura:'דרכי תצורה',numbers:'שם המספר'};
const TOPIC_W={gizra:1.5,binyan:1,beinoni:1,tzura:1,numbers:1};

// ---------- עזרים ----------
const strip=s=>s.replace(/[֑-ׇ]/g,'');
const FIN={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
const nf=s=>s.replace(/[ךםןףץ]/g,c=>FIN[c]);
const letters=s=>nf(strip(s)).replace(/[^א-ת]/g,'');
const toFinal={'כ':'ך','מ':'ם','נ':'ן','פ':'ף','צ':'ץ'};
const fmtRoot=arr=>arr.map((c,i)=>i===arr.length-1&&toFinal[c]?toFinal[c]:c).join('-');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const hw=t=>`<span class="hw">${t}</span>`;
const lines=s=>s.trim().split('\n').filter(Boolean);

// ---------- פירוק הנתונים ----------
const D={};
D.verbs=lines(VERBS).map(l=>{const f=l.split('|');return {form:f[0],root:f[1],b:f[2],g:f[3],tense:f[4],person:f[5],note:f[6]||''}});
D.bein=lines(BEINONI).map(l=>{const f=l.split('|');return {sent:f[0],word:f[1],pos:f[2],b:f[3],root:f[4]}});
D.action=lines(ACTION_NOUNS).map(l=>{const f=l.split('|');return {word:f[0],root:f[1],b:f[2],g:f[3]}});
D.mishkal=lines(MISHKAL).map(l=>{const f=l.split('|');return {word:f[0],root:f[1],m:f[2]}});
D.suffix=lines(SUFFIX).map(l=>{const f=l.split('|');return {word:f[0],base:f[1],suf:f[2],mean:f[3],type:f[4]}});
D.blends=lines(BLENDS).map(l=>{const f=l.split('|');return {word:f[0],a:f[1],b:f[2]}});
D.acr=lines(ACRONYMS).map(l=>{const f=l.split('|');return {word:f[0],full:f[1]}});
D.loans=LOANS.split(',');
D.nums=lines(NUMBERS).map(l=>{const f=l.split('|');return {sent:f[0],ans:f[1],wrong:f[2].split(';'),rule:f[3]}});
D.numw=lines(NUMWORDS).map(l=>{const f=l.split('|');return {sent:f[0],dig:f[1],ans:f[2],wrong:f[3].split(';'),rule:f[4]}});
D.pairs=lines(PAIRS).map(l=>{const f=l.split('|');const st=f[4].split(';;');return {s1:f[0],w1:f[1],s2:f[2],w2:f[3],ok:st[0],bad:st.slice(1),ex:f[5]}});
D.odd=lines(ODD).map(l=>l.split(',').map(x=>{const [w,r,g]=x.split(':');return {w,r,g}}));
D.mishkalNames=[...new Set(D.mishkal.map(m=>m.m))];
D.meanings=[...new Set(D.suffix.map(s=>s.mean))];

// ---------- מסיחים לשורש ----------
function rootDistractors(form,root){
 const R=letters(root).split('');const n=R.length;
 const sk=letters(form).split('');
 const cands=new Map();
 const add=(arr,score)=>{const k=arr.join('');if(k===R.join('')||arr.length!==n)return;cands.set(k,Math.max(cands.get(k)||0,score))};
 const idx=[...Array(sk.length).keys()];
 const combos=(start,k,acc)=>{if(acc.length===k){add(acc.map(i=>sk[i]),acc.map(i=>sk[i]).filter(c=>R.includes(c)).length);return}for(let i=start;i<sk.length;i++)combos(i+1,k,[...acc,i])};
 if(sk.length<=9)combos(0,n,[]);
 const sw={'נ':['י','ו'],'י':['נ','ו','ה'],'ו':['ה'],'א':['ה']};
 R.forEach((c,i)=>{(sw[c]||[]).forEach(r=>{if(i===1&&'וי'.includes(c)&&'וי'.includes(r))return;if(i===n-1&&c==='י'&&r==='ה')return;const a=R.slice();a[i]=r;add(a,n)})});
 // סדר
 const list=[...cands.entries()].sort((a,b)=>b[1]-a[1]+(Math.random()-.5)*.8).map(e=>e[0]);
 const out=[];for(const k of list){if(out.length>=3)break;out.push(fmtRoot(k.split('')))}
 while(out.length<3){const v=pick(D.verbs);const r=fmtRoot(letters(v.root).split(''));if(r!==fmtRoot(R)&&!out.includes(r))out.push(r)}
 return out;
}

// ---------- מחוללי שאלות ----------
const G={};
const opt=(t,ok)=>({t,ok:!!ok});
const verbSummary=v=>`${hw(v.form)} – השורש <b>${v.root}</b>, בניין <b>${BIN[v.b]}</b>, גזרת <b>${GIZ[v.g]}</b>, ${v.tense}${v.person&&v.person!=='—'?', '+v.person:''}${v.tense==='עתיד'&&['נוכח','נסתרת'].includes(v.person)?' (בעתיד צורת הנוכח וצורת הנסתרת זהות)':''}${v.tense==='עבר'&&v.person==='מדבר'?' (בעבר הצורה זהה למדבר ולמדברת)':''}.`;
const rootHint=v=>`הורידי תחיליות (ה, נ, מ, ת, י, א, הת־, ל־) וסיומות (־תי, ־ת, ־נו, ־תם, ־ו, ־ה, ־ים, ־ות). אם נשארו פחות משלוש אותיות – חסרה אות שורש: חפשי דגש שבא במקום נ, ו שבאה במקום י, או צורה אחרת של אותו פועל שבה האות מופיעה. (הפועל בבניין ${BIN[v.b]}, ${v.tense}.)`;

G.vroot=i=>{const v=D.verbs[i];return {topic:'gizra',title:'מצאי את השורש',stem:`מהו השורש של הפועל ${hw(v.form)}?`,
 options:shuffle([opt(v.root,1),...rootDistractors(v.form,v.root).map(r=>opt(r))]),
 explain:`${verbSummary(v)}${v.note?'<br>'+v.note:''}<div class="tip"><b>גזרת ${GIZ[v.g]}:</b> ${GIZ_TIP[v.g]}</div>`,hint:rootHint(v)}};
G.vtype=i=>{const v=D.verbs[i];return {topic:'gizra',title:'כתבי את השורש',stem:`הקלידי את השורש של הפועל ${hw(v.form)}`,typed:{root:v.root,g:v.g},
 explain:`${verbSummary(v)}${v.note?'<br>'+v.note:''}<div class="tip"><b>גזרת ${GIZ[v.g]}:</b> ${GIZ_TIP[v.g]}</div>`,hint:rootHint(v)}};
G.vgiz=i=>{const v=D.verbs[i];return {topic:'gizra',title:'זיהוי גזרה',stem:`לאיזו גזרה שייך הפועל ${hw(v.form)}?`,
 options:GIZ_ORDER.map(g=>opt(GIZ[g],g===v.g)),chips:true,
 explain:`${verbSummary(v)}${v.note?'<br>'+v.note:''}<div class="tip"><b>גזרת ${GIZ[v.g]}:</b> ${GIZ_TIP[v.g]}</div>`,hint:GIZ_FIND}};
G.odd=i=>{const set=D.odd[i];const cnt={};set.forEach(x=>cnt[x.g]=(cnt[x.g]||0)+1);const odd=set.find(x=>cnt[x.g]===1);const other=set.find(x=>cnt[x.g]>1);
 return {topic:'gizra',title:'יוצא דופן',stem:`איזו מילה <b>יוצאת דופן בגזרתה</b>?`,options:shuffle(set.map(x=>opt(x.w,x===odd))),big:true,
 explain:set.map(x=>`${hw(x.w)} – ${x.r}, גזרת ${GIZ[x.g]}${x===odd?' ← <b>יוצאת דופן</b>':''}`).join('<br>')+`<div class="tip">${GIZ_FIND}</div>`,
 hint:`מצאי לכל מילה את השורש. שלוש מהמילים מגזרת ${GIZ[other.g]}.`}};
const TENSES=['עבר','הווה','עתיד'];const PERS_PAST=['מדבר','נוכח','נוכחת','נסתר','נסתרת','מדברים','נוכחים','נוכחות','נסתרים'];
G.combo=i=>{const v=D.verbs[i];if(v.tense==='שם הפועל')return null;
 const fmt=(t,p,b,r)=>`${t} · ${p} · ${BIN[b]} · ${r}`;const right=fmt(v.tense,v.person,v.b,v.root);
 const ambT=(v.b==='N'&&v.tense==='עבר'&&v.person==='נסתר')||(v.g==='AY'&&v.b==='Q'&&v.tense==='עבר'&&v.person.startsWith('נסתר'));
 const outs=new Set();const tries=[];
 const rd=rootDistractors(v.form,v.root);
 tries.push(()=>fmt(v.tense,v.person,v.b,rd[0]));tries.push(()=>fmt(v.tense,v.person,v.b,rd[1]));
 const binAlt=BIN_ORDER.filter(b=>b!==v.b);tries.push(()=>fmt(v.tense,v.person,pick(binAlt),v.root));tries.push(()=>fmt(v.tense,v.person,pick(binAlt),rd[0]));
 if(!ambT&&v.tense!=='הווה')tries.push(()=>fmt(pick(TENSES.filter(t=>t!==v.tense&&t!=='הווה')),v.person,v.b,v.root));
 if(v.tense==='עבר')tries.push(()=>fmt(v.tense,pick(PERS_PAST.filter(p=>p!==v.person)),v.b,v.root));
 for(const f of shuffle(tries)){if(outs.size>=3)break;const x=f();if(x!==right)outs.add(x)}
 return {topic:'gizra',title:'ניתוח מלא',stem:`קבעי את <b>הזמן, הגוף, הבניין והשורש</b> של הפועל ${hw(v.form)}`,options:shuffle([opt(right,1),...[...outs].map(x=>opt(x))]),
 explain:verbSummary(v)+(v.note?'<br>'+v.note:'')+`<div class="tip">${BIN_TIP[v.b]} ${binNote(v.b,v.g)}</div>`,hint:'ציירי לעצמך טבלה: זמן | גוף | בניין | שורש, ונתחי כל פרט בנפרד. '+rootHint(v)}};
G.vbin=i=>{const v=D.verbs[i];return {topic:'binyan',title:'זיהוי בניין',stem:`באיזה בניין נוטה הפועל ${hw(v.form)}?`,options:BIN_ORDER.map(b=>opt(BIN[b],b===v.b)),chips:true,
 explain:`${verbSummary(v)}<div class="tip">${BIN_TIP[v.b]} ${binNote(v.b,v.g)}</div>`,hint:'חפשי את סימני הבניין: תחילית (נִ־, הִ־/הֻ־/הוֹ־, הִתְ־, מְ־/מַ־/מֻ־/מִתְ־), תנועות, ודגש באות השורש השנייה (פיעל, פועל, התפעל).'}};
G.vact=i=>{const v=D.verbs[i];if(v.b==='T'||(v.b==='N'&&!N_PASSIVE.includes(v.form)))return null;const act=ACTIVE[v.b]===1;
 return {topic:'binyan',title:'פעיל או סביל',stem:`האם הפועל ${hw(v.form)} הוא פועל <b>פעיל</b> או <b>סביל</b>?`,options:[opt('פעיל',act),opt('סביל',!act)],
 explain:`${hw(v.form)} בבניין <b>${BIN[v.b]}</b> – בניין ${act?'פעיל':'סביל'}.<div class="tip">בניינים פעילים: פעל, פיעל, הפעיל. בניינים סבילים: נפעל (הסביל של פעל), פועל (הסביל של פיעל), הופעל (הסביל של הפעיל). התפעל מציין לרוב פעולה חוזרת או הדדית.</div>`,
 hint:'קבעי קודם את הבניין. בפועל סביל הנושא לא עושה את הפעולה – הפעולה נעשית לו (הספר נִכְתַּב).'}};
const PASS=[['Q','N'],['P','PU'],['H','HU']];
G.pass=i=>{const [a,p]=PASS[i%3];const rev=i>=3;const ask=rev?p:a,ans=rev?a:p;
 return {topic:'binyan',title:'פעיל וסביל',stem:rev?`בניין <b>${BIN[ask]}</b> הוא בניין סביל. מהו הבניין הפעיל שהוא מקביל לו?`:`מהו הבניין הסביל של בניין <b>${BIN[ask]}</b>?`,
 options:BIN_ORDER.filter(b=>b!==ask).map(b=>opt(BIN[b],b===ans)),chips:true,
 explain:'הזוגות: פעל ↔ נפעל, פיעל ↔ פועל, הפעיל ↔ הופעל. התפעל לרוב לא סביל – הוא מציין פעולה חוזרת או הדדית.',hint:'שימי לב לדמיון בצורה: פִּיעֵל–פּוּעַל, הִפְעִיל–הוּפְעַל.'}};
G.abin=i=>{const a=D.action[i];return {topic:'binyan',title:'שם פעולה',stem:`באיזה בניין נוטה שם הפעולה ${hw(a.word)}?`,options:BIN_ORDER.map(b=>opt(BIN[b],b===a.b)),chips:true,
 explain:`${hw(a.word)} – השורש ${a.root}, גזרת ${GIZ[a.g]}, שם פעולה של בניין <b>${BIN[a.b]}</b>.<div class="tip">משקלי שמות הפעולה: פעל – קְטִילָה (כְּתִיבָה). נפעל – הִקָּטְלוּת (הִכָּנְסוּת). פיעל – קִטּוּל (סִפּוּר), ולפעמים קַטָּלָה (קַבָּלָה). הפעיל – הַקְטָלָה (הַזְמָנָה; בנפי"ו: הוֹדָעָה; בנעו"י: הֲקָמָה; בחפ"ן: הַגָּעָה). התפעל – הִתְקַטְּלוּת (הִתְרַגְּשׁוּת). לבניינים הסבילים פועל והופעל אין שם פעולה.</div>`,
 hint:'זהי את התבנית: הַ־...ָה ← הפעיל, הִתְ־...וּת ← התפעל, הִ־...וּת עם דגש ← נפעל, קִטּוּל ← פיעל, קְטִילָה ← פעל.'}};
G.pairs=i=>{const p=D.pairs[i];return {topic:'binyan',title:'פעלים דומים',stem:`<div class="pair"><div>1. ${p.s1.replace(p.w1,hw(p.w1))}</div><div>2. ${p.s2.replace(p.w2,hw(p.w2))}</div></div>איזה היגד <b>נכון</b>?`,
 options:shuffle([opt(p.ok,1),...p.bad.map(b=>opt(b))]),explain:p.ex,hint:'נתחי כל פועל בנפרד: זמן, גוף, בניין, שורש – ורק אז השווי. שימי לב אם האות הראשונה (ת / מ / נ) היא תחילית או אות שורש.'}};
G.mact=i=>{const m=D.action.filter(a=>a.g==='M');const a=m[i%m.length];const others=shuffle(D.action.filter(x=>x.g!=='M')).slice(0,3);
 return {topic:'binyan',title:'שם פעולה מרובע',stem:'איזה שם פעולה גזור <b>משורש מרובע</b>?',options:shuffle([opt(a.word,1),...others.map(o=>opt(o.word))]),big:true,
 explain:[a,...others].map(x=>`${hw(x.word)} – ${x.root}${x===a?' (מרובע)':''}`).join('<br>'),hint:'מצאי את השורש של כל שם. בשם מרובע נשארות ארבע אותיות שורש (כמו תִּרְגּוּם: ת-ר-ג-ם).'}};
G.bpos=i=>{const b=D.bein[i];return {topic:'beinoni',title:'בינוני',stem:`${b.sent.replace(b.word,hw(b.word))}<br>לאיזה <b>חלק דיבר</b> שייכת המילה המודגשת?`,options:['verb','noun','adj'].map(p=>opt(POS[p],p===b.pos)),
 explain:`${hw(b.word)} היא צורת בינוני (צורת הווה) – ובמשפט הזה היא <b>${POS[b.pos]}</b>. ${b.pos==='verb'?'היא מתארת פעולה שקורית עכשיו (אפשר להעביר את המשפט לעבר).':b.pos==='noun'?'היא שם של מי שעושה את הפעולה ומשמשת כמו שם עצם (נושא או מושא; אפשר להוסיף לה ה הידיעה).':'היא מתארת את שם העצם שלפניה ומתאימה לו במין, במספר וביידוע.'}<div class="tip">הבחנה: <b>פועל</b> – אומר מה קורה (אפשר להחליף בעבר). <b>שם עצם</b> – מישהו/משהו (הַשּׁוֹמֵר, הַמְּנַהֵל). <b>שם תואר</b> – מתאר שם עצם (תַּלְמִיד מְנֻמָּס).</div>`,
 hint:'נסי להעביר את המשפט לזמן עבר. אם המילה משתנה לפועל עבר והמשפט נשאר הגיוני – זה פועל. אם היא באה אחרי שם עצם ומתארת אותו – שם תואר.'}};
G.bbin=i=>{const b=D.bein[i];return {topic:'beinoni',title:'בניין הבינוני',stem:`${b.sent.replace(b.word,hw(b.word))}<br>באיזה <b>בניין</b> המילה המודגשת?`,options:BIN_ORDER.map(x=>opt(BIN[x],x===b.b)),chips:true,
 explain:`${hw(b.word)} – השורש ${b.root}, בניין <b>${BIN[b.b]}</b>.<div class="tip">תבניות הבינוני: פעל – קוֹטֵל (שׁוֹמֵר). נפעל – נִקְטָל (נֶאֱמָן). פיעל – מְקַטֵּל (מְנַהֵל). פועל – מְקֻטָּל (מְסֻדָּר). הפעיל – מַקְטִיל (מַזְכִּיר). הופעל – מֻקְטָל (מֻכָּר). התפעל – מִתְקַטֵּל (מִצְטַיֵּן).</div>`,
 hint:'הסירי את ה הידיעה (אם יש), והשווי לתבניות הבינוני: קוֹטֵל, נִקְטָל, מְקַטֵּל, מְקֻטָּל, מַקְטִיל, מֻקְטָל, מִתְקַטֵּל.'}};
// דרכי תצורה
function wayItems(){const a=[];D.mishkal.forEach(m=>a.push({w:m.word,way:'root',d:`השורש ${m.root} במשקל ${m.m}`}));D.suffix.filter(s=>s.type==='g').forEach(s=>a.push({w:s.word,way:'suf',d:`${s.base} + הצורן ־${s.suf} (${s.mean})`}));D.blends.forEach(b=>a.push({w:b.word,way:'blend',d:`${b.a} + ${b.b}`}));D.acr.forEach(x=>a.push({w:x.word,way:'acr',d:x.full}));D.loans.forEach(l=>a.push({w:l,way:'loan',d:'מילה שנשאלה משפה זרה'}));return a}
D.ways=wayItems();
G.way=i=>{const it=D.ways[i];return {topic:'tzura',title:'דרך התצורה',stem:`באיזו דרך נוצרה המילה ${hw(it.w)}?`,options:Object.keys(WAYS).map(k=>opt(WAYS[k],k===it.way)),chips:true,
 explain:`${hw(it.w)} – <b>${WAYS[it.way]}</b>: ${it.d}.<div class="tip">${WAY_TIP}</div>`,hint:'נסי לפרק את המילה: יש בה שורש בתבנית? מילה שלמה + סיומת? שתי מילים מחוברות? גרשיים? או שהיא נשמעת לועזית?'}};
G.oddway=i=>{const ways=Object.keys(WAYS);const w1=ways[i%5];const w2=pick(ways.filter(w=>w!==w1));const same=shuffle(D.ways.filter(x=>x.way===w1)).slice(0,3);const odd=pick(D.ways.filter(x=>x.way===w2));
 return {topic:'tzura',title:'יוצא דופן',stem:'איזו מילה נוצרה <b>בדרך תצורה שונה</b> משלוש האחרות?',options:shuffle([...same.map(x=>opt(x.w)),opt(odd.w,1)]),big:true,
 explain:[...same,odd].map(x=>`${hw(x.w)} – ${WAYS[x.way]} (${x.d})`).join('<br>'),hint:'קבעי לכל מילה את דרך התצורה שלה, ומצאי את זו שלא מתאימה.'}};
G.msh=i=>{const m=D.mishkal[i];const others=shuffle(D.mishkalNames.filter(x=>x!==m.m)).slice(0,3);
 return {topic:'tzura',title:'משקל',stem:`באיזה <b>משקל</b> השם ${hw(m.word)}?`,options:shuffle([opt(m.m,1),...others.map(o=>opt(o))]),big:true,
 explain:`${hw(m.word)} – השורש ${m.root}. מציבים את אותיות השורש במקום ק-ט-ל ומקבלים את המשקל <b>${m.m}</b>.`,hint:'מצאי את השורש, ואז החליפי את אותיות השורש באותיות ק, ט, ל – ושמרי על התנועות ועל האותיות הנוספות.'}};
G.nroot=i=>{const m=D.mishkal[i];return {topic:'tzura',title:'שורש של שם',stem:`מהו השורש של השם ${hw(m.word)}?`,options:shuffle([opt(m.root,1),...rootDistractors(m.word,m.root).map(r=>opt(r))]),
 explain:`${hw(m.word)} – השורש <b>${m.root}</b>, המשקל ${m.m}.`,hint:'הורידי את האותיות של המשקל (מ, ת, ה בסוף, ו...) וחפשי שלוש אותיות שורש. אם חסרה אות – חשבי על פועל מאותו שורש.'}};
G.suf=i=>{const s=D.suffix[i];const others=shuffle(D.meanings.filter(m=>m!==s.mean)).slice(0,3);
 return {topic:'tzura',title:'משמעות הצורן',stem:`מה <b>משמעות הצורן הסופי</b> בשם ${hw(s.word)}?`,options:shuffle([opt(s.mean,1),...others.map(o=>opt(o))]),
 explain:`${hw(s.word)} = ${s.base} + הצורן ־${s.suf} ← <b>${s.mean}</b>.`,hint:'הפרידי בין הבסיס לסיומת. מה הסיומת מוסיפה למשמעות של הבסיס? (קטן? מופשט? מקום? שפה? בעל מקצוע?)'}};
G.suft=i=>{const s=D.suffix[i];return {topic:'tzura',title:'סוג הצורן',stem:`הסיומת ־${s.suf} במילה ${hw(s.word)} היא:`,options:[opt('צורן גזירה',s.type==='g'),opt('צורן נטייה',s.type==='n')],
 explain:`${hw(s.word)} = ${s.base} + ־${s.suf}. ${s.type==='g'?'נוצרה <b>מילה חדשה</b> עם משמעות חדשה – לכן זה <b>צורן גזירה</b>.':'לא נוצרה מילה חדשה – רק צורת הרבים של אותה מילה – לכן זה <b>צורן נטייה</b>.'}<div class="tip">צורן גזירה יוצר מילה חדשה (ספר ← ספרון). צורן נטייה משנה רק את הצורה של אותה מילה: מין, מספר, גוף (שמלה ← שמלות).</div>`,hint:'שאלי: האם נוצרה מילה חדשה שתופיע במילון בנפרד, או רק צורה אחרת (למשל רבים) של אותה מילה?'}};
G.blend=i=>{const b=D.blends[i];const right=`${b.a} + ${b.b}`;const real=new Set(D.blends.map(x=>`${x.a} + ${x.b}`));const outs=new Set();
 for(const o of shuffle(D.blends.filter(x=>x!==b))){if(outs.size>=3)break;const c=Math.random()<.5?`${b.a} + ${o.b}`:`${o.a} + ${b.b}`;if(c!==right&&!real.has(c))outs.add(c)}
 return {topic:'tzura',title:'הלחם בסיסים',stem:`מאילו שני בסיסים נוצרה המילה ${hw(b.word)}?`,options:shuffle([opt(right,1),...[...outs].map(o=>opt(o))]),
 explain:`${hw(b.word)} = ${b.a} + ${b.b} – <b>הלחם בסיסים</b>: שתי מילים שהתחברו למילה אחת (לפעמים חלק מהאותיות נשמטות).`,hint:'חפשי שתי מילים מוכרות שמסתתרות בתוך המילה, ושמשמעותן יחד יוצרת את המשמעות שלה.'}};
G.acr=i=>{const a=D.acr[i];const others=shuffle(D.acr.filter(x=>x!==a)).slice(0,3);
 return {topic:'tzura',title:'ראשי תיבות',stem:`מה פירוש ראשי התיבות ${hw(a.word)}?`,options:shuffle([opt(a.full,1),...others.map(o=>opt(o.full))]),
 explain:`${hw(a.word)} = ${a.full}. בראשי תיבות לוקחים את האות הראשונה של כל מילה (לפעמים יותר) ומסמנים גרשיים לפני האות האחרונה.`,hint:'התאימי כל אות בקיצור למילה שמתחילה בה.'}};
G.loan=i=>{const l=D.loans[i];const others=shuffle(D.ways.filter(x=>x.way==='root'||x.way==='suf'||x.way==='blend')).slice(0,3);
 return {topic:'tzura',title:'שאילה מלעז',stem:'איזו מילה <b>שאולה מלעז</b>?',options:shuffle([opt(l,1),...others.map(o=>opt(o.w))]),big:true,
 explain:`${hw(l)} – מילה שנשאלה משפה זרה. ${others.map(o=>`${hw(o.w)} – ${WAYS[o.way]}`).join(' · ')}`,hint:'איזו מילה לא בנויה משורש עברי, ונשמעת דומה בהרבה שפות?'}};
// שם המספר
G.num=i=>{const n=D.nums[i];return {topic:'numbers',title:'שם המספר',stem:`בחרי את הצורה הנכונה:<br><div class="sent">${n.sent.replace('[[]]','<span class="blank">____</span>')}</div>`,options:shuffle([opt(n.ans,1),...n.wrong.map(w=>opt(w))]),big:true,
 explain:`<div class="sent">${n.sent.replace('[[]]',`<b class="ans">${n.ans}</b>`)}</div><div class="tip">${NUMRULES[n.rule]}</div>`,
 hint:'(1) קבעי את מין שם העצם לפי היחיד: "חלון אחד" (זכר), "שנה אחת" (נקבה). (2) זכר ← 3–10 עם ה בסוף (שלושה), נקבה ← בלי ה (שלוש). (3) שם עצם מיודע ← סמיכות (שלושת הספרים). (4) שנה, מספור או גיל ← נקבה. תאריך ← זכר.'}};
G.numw=i=>{const n=D.numw[i];return {topic:'numbers',title:'כתיבה במילים',stem:`איך כותבים במילים את המספר <b dir="ltr">${n.dig}</b>?<br><div class="sent">${n.sent.replace('{{}}',`<b dir="ltr">${n.dig}</b>`)}</div>`,options:shuffle([opt(n.ans,1),...n.wrong.map(w=>opt(w))]),big:true,
 explain:`<div class="sent">${n.sent.replace('{{}}',`<b class="ans">${n.ans}</b>`)}</div><div class="tip">${NUMRULES[n.rule]}</div>`,hint:'קבעי למה המספר מתייחס ומה מינו. זכרי: אֶלֶף בזכר (שלושת אלפים), מֵאָה בנקבה (שלוש מאות).'}};

const KIND_COUNT={vroot:D.verbs.length,vtype:D.verbs.length,vgiz:D.verbs.length,odd:D.odd.length,combo:D.verbs.length,vbin:D.verbs.length,vact:D.verbs.length,pass:6,abin:D.action.length,pairs:D.pairs.length,mact:6,bpos:D.bein.length,bbin:D.bein.length,way:D.ways.length,oddway:10,msh:D.mishkal.length,nroot:D.mishkal.length,suf:D.suffix.length,suft:D.suffix.length,blend:D.blends.length,acr:D.acr.length,loan:D.loans.length,num:D.nums.length,numw:D.numw.length};
const KIND_TOPIC={vroot:'gizra',vtype:'gizra',vgiz:'gizra',odd:'gizra',combo:'gizra',vbin:'binyan',vact:'binyan',pass:'binyan',abin:'binyan',pairs:'binyan',mact:'binyan',bpos:'beinoni',bbin:'beinoni',way:'tzura',oddway:'tzura',msh:'tzura',nroot:'tzura',suf:'tzura',suft:'tzura',blend:'tzura',acr:'tzura',loan:'tzura',num:'numbers',numw:'numbers'};
const KIND_W={vroot:3,vtype:2,vgiz:3,odd:2,combo:2,vbin:3,vact:1,pass:.5,abin:2,pairs:2,mact:.7,bpos:3,bbin:2,way:3,oddway:1.5,msh:2,nroot:1.5,suf:2,suft:.8,blend:1,acr:.8,loan:.8,num:4,numw:1.5};
const KIND_NAME={vroot:'שורש של פועל',vtype:'הקלדת שורש',vgiz:'זיהוי גזרה',odd:'יוצא דופן בגזרה',combo:'זמן·גוף·בניין·שורש',vbin:'בניין של פועל',vact:'פעיל/סביל',pass:'זוגות פעיל-סביל',abin:'בניין של שם פעולה',pairs:'פעלים דומים',mact:'שם פעולה מרובע',bpos:'בינוני – חלק דיבר',bbin:'בינוני – בניין',way:'דרך תצורה',oddway:'יוצא דופן בתצורה',msh:'משקל',nroot:'שורש של שם',suf:'משמעות צורן',suft:'צורן גזירה/נטייה',blend:'הלחם בסיסים',acr:'ראשי תיבות',loan:'שאילה מלעז',num:'שם המספר במשפט',numw:'מספר במילים'};

function build(id){const [k,i]=id.split(':');const q=G[k](+i);if(!q)return null;q.id=id;q.kind=k;return q}
