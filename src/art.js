// ===== ציורים וקטוריים: נויה, החברות והפרסים =====
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}

const CHANGES=[
 {id:'lips',name:'שפתיים בבוטוקס',on:'אוי! השפתיים של נויה קיבלו בוטוקס 💋',off:'השפתיים חזרו לגודל הטבעי!'},
 {id:'hair',name:'החלקה לתלתלים',on:'אוי לא! התלתלים עברו החלקה 😱',off:'התלתלים חזרו! 🌀'},
 {id:'makeup',name:'איפור מוגזם',on:'שלוש שכבות איפור, ריסים עד השמיים 💄',off:'האיפור ירד, חזרנו לפרצוף הטבעי!'},
 {id:'nails',name:'ציפורניים ארוכות',on:'צצו לה ציפורניים באורך של מטר 💅',off:'הציפורניים נגזרו!'},
 {id:'vape',name:'וייפ',on:'מה זה בידיים שלה? וייפ?! 💨',off:'הווייפ הלך לפח!'},
 {id:'floral',name:'ביגוד פרחוני',on:'הגופייה הירוקה הפכה לחולצה פרחונית 🌺',off:'הגופייה הירוקה חזרה!'},
 {id:'bubble',name:'דיבור צ\'אחלה',on:'שומעים? היא התחילה לדבר כמו צ\'אחלה 🗯️',off:'הדיבור חזר לנורמלי!'},
 {id:'hoops',name:'עגילי חישוק ענקיים',on:'עגילי חישוק בגודל של צמיד 🟡',off:'החישוקים הענקיים הוסרו!'},
 {id:'tan',name:'שיזוף בספריי',on:'שיזוף בספריי בגוון כתום 🍊',off:'השיזוף הכתום נשטף!'}
];
const PHRASES=['אין על עומר אדם – חולה עליו!','אה כפרה!','שומעעעת – מה נראה לך!','יא מאמי!','וואלה? אין מצב!','די, אני מתה!','אחותי, תני כבוד!','נשמה שלי!','יאללה ביי!','מה את אומרת?! אמאלה!','תכלס? לא מעניין אותי!','איזה באסה, נשמה'];
const FRIENDS=[
 {name:'ליאור',hair:'#5a3a24',skin:'#eec3a0',top:'#3b82c4',style:'bob'},
 {name:'מיי',hair:'#1c1412',skin:'#e8b892',top:'#8b5cf6',style:'pony'},
 {name:'ליה',hair:'#a2461f',skin:'#f3cfb3',top:'#10a37f',style:'wavy'},
 {name:'יעל',hair:'#7a5233',skin:'#e9bd98',top:'#f59e0b',style:'long'},
 {name:'הילה',hair:'#d9b56a',skin:'#f1c9a8',top:'#ef4444',style:'braid'}
];

// ===== פרסים =====
function bandText(b,x,y,fs){const w=b.split(' ');if(w.length===1)return `<text x="${x}" y="${y}" font-size="${fs+1}" text-anchor="middle" fill="#fff" font-weight="800" font-family="Rubik,sans-serif">${b}</text>`;return w.map((t,i)=>`<text x="${x}" y="${y-6+i*11}" font-size="${fs}" text-anchor="middle" fill="#fff" font-weight="800" font-family="Rubik,sans-serif">${t}</text>`).join('')}
const PRIZES=[
 {w:'lego',n:'סט לגו – חללית'},{w:'lego',n:'סט לגו – בית קפה בעיר'},{w:'lego',n:'סט לגו – זר פרחים'},{w:'lego',n:'דלי ענק של קוביות לגו'},
 {w:'marvel',n:'כרטיסים לסרט מארוול הבא'},{w:'marvel',n:'מרתון מארוול בסלון'},{w:'marvel',n:'דלי פופקורן ענק לסרט מארוול'},
 {w:'series',n:'ערב בינג׳ של סדרת נוער'},{w:'series',n:'עונה חדשה של הסדרה האהובה'},{w:'series',n:'שמיכה, פיג׳מה ופרק חדש'},
 {w:'bands',n:'פוסטר של Coldplay',b:'COLDPLAY',kind:'poster'},{w:'bands',n:'פוסטר של Arctic Monkeys',b:'ARCTIC MONKEYS',kind:'poster'},
 {w:'bands',n:'כרטיס להופעה של Coldplay',b:'COLDPLAY',kind:'ticket'},{w:'bands',n:'כרטיס להופעה של Arctic Monkeys',b:'ARCTIC MONKEYS',kind:'ticket'},
 {w:'bands',n:'תקליט ויניל של Arctic Monkeys',b:'ARCTIC MONKEYS',kind:'vinyl'},
 {w:'steak',n:'סטייק עם שעועית ירוקה'},{w:'steak',n:'אנטריקוט מדיום עם שעועית ירוקה'},{w:'steak',n:'סטייק על הגריל של אבא'},
 {w:'curls',n:'קרם לעיצוב תלתלים'},{w:'curls',n:'ג׳ל לתלתלים מושלמים'},{w:'curls',n:'מסכת לחות לתלתלים'},{w:'curls',n:'מפזר חום לפן לתלתלים'}
];
const WORLD_NAMES={lego:'לגו',marvel:'מארוול',series:'סדרות',bands:'להקות',steak:'סטייק',curls:'תלתלים'};

