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
 {name:'ליאור',skin:'#ecc19f',hair:'#3b2416',eyes:'#4a2c19',style:'wavy',glasses:1,smile:'big',lashes:1,top:'#3b82c4'},
 {name:'מיי',skin:'#e8b892',hair:'#1c1412',eyes:'#3a2416',style:'bangs',piercings:{brow:1,lip:1,nose:1},top:'#8b5cf6'},
 {name:'ליה',skin:'#f0cbae',hair:'#5a3a24',eyes:'#4a2c19',style:'straightLong',thickBrows:1,fullLips:1,top:'#10a37f'},
 {name:'יעל',skin:'#e9bd98',hair:'#4a2e1c',eyes:'#4a2c19',style:'curlsLong',glasses:1,top:'#f59e0b'},
 {name:'הילה',skin:'#8a5a3c',hair:'#0f0b0a',eyes:'#2a1a10',style:'straight',fullLips:1,smallNose:1,noseRing:1,top:'#ef4444'},
 {name:'ליאור ז.',skin:'#efc6a6',hair:'#4b3020',eyes:'#4a2c19',style:'veryLong',roundFace:1,braces:1,smile:'big',top:'#0ea5e9'},
 {name:'כרמל',skin:'#c99372',hair:'#121010',eyes:'#2a1a10',style:'messy',top:'#14b8a6'},
 {name:'מאיה',skin:'#f6d5bd',hair:'#d98a45',eyes:'#3f8f4e',style:'wavyLong',braces:1,smile:'big',top:'#ec4899'},
 {name:'אריאל',skin:'#e6b894',hair:'#5a3a24',eyes:'#4a2c19',style:'wavy',noseHoopBlue:1,top:'#6366f1'}
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
 {w:'friends',n:'ערב כיף עם החברות',kind:'party'},{w:'friends',n:'ללכת לבית של ליאור',kind:'house'},{w:'friends',n:'נסיעה לחולון בסופ״ש',kind:'car'},
 {w:'food',n:'סושי',kind:'sushi'},{w:'food',n:'קפה קר',kind:'coffee'},{w:'food',n:'ליקוק מלואי',kind:'lick'},
 {w:'me',n:'ניקוי אוטומטי של החדר',kind:'clean'},{w:'me',n:'ג׳ינס חדש',kind:'jeans'},{w:'me',n:'מחמאה משירי!',kind:'compliment'},
 {w:'curls',n:'קרם לעיצוב תלתלים'},{w:'curls',n:'ג׳ל לתלתלים מושלמים'},{w:'curls',n:'מסכת לחות לתלתלים'},{w:'curls',n:'מפזר חום לפן לתלתלים'}
];
const WORLD_NAMES={lego:'לגו',marvel:'מארוול',series:'סדרות',bands:'להקות',steak:'סטייק',curls:'תלתלים',friends:'חברות',food:'אוכל',me:'פינוקים'};

