// ===== איורים מלוטשים: חברות ופרסים =====
let _uid=0;
function friendSVG(f,ch){
 const u='f'+(++_uid);
 const skin=f.skin;
 const hair=ch?['#f3d58a','#eec46a','#f6e0a5','#e3b766','#f8e6b5'][FRIENDS.indexOf(f)%5]:f.hair;
 const hairDark=ch?'#6b4a2a':shade(f.hair,-.35);
 let s=`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs>
 <radialGradient id="${u}s" cx=".45" cy=".4" r=".65"><stop offset="0" stop-color="${shade(skin,.08)}"/><stop offset=".75" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin,-.18)}"/></radialGradient>
 <linearGradient id="${u}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ch?'#5a3a22':shade(hair,.15)}"/><stop offset="${ch?.35:.5}" stop-color="${hair}"/><stop offset="1" stop-color="${ch?shade(hair,.12):hairDark}"/></linearGradient>
 <linearGradient id="${u}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(f.top,.15)}"/><stop offset="1" stop-color="${shade(f.top,-.25)}"/></linearGradient>
 <radialGradient id="${u}b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${ch?'#ff3d8b':'#f08f7a'}" stop-opacity="${ch?.6:.35}"/><stop offset="1" stop-color="#f08f7a" stop-opacity="0"/></radialGradient>
 <linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0569a"/><stop offset="1" stop-color="#b8155a"/></linearGradient>
 <pattern id="${u}p" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#ff4f9a"/><circle cx="5" cy="5" r="2.6" fill="#fff59d"/><circle cx="5" cy="5" r="1" fill="#f97316"/><circle cx="13" cy="12" r="2.2" fill="#fff"/><circle cx="13" cy="12" r=".8" fill="#facc15"/></pattern>
 <clipPath id="${u}c"><circle cx="60" cy="60" r="58"/></clipPath></defs>
 <g clip-path="url(#${u}c)"><circle cx="60" cy="60" r="58" fill="${ch?'#ffe1ef':'#eef2f7'}"/>`;
 // שיער אחורי
 if(ch) s+=`<path d="M24,124 C16,70 22,20 60,17 C98,20 104,70 96,124Z" fill="url(#${u}h)"/>`;
 else if(f.style==='long') s+=`<path d="M26,118 C18,66 26,20 60,18 C94,20 102,66 94,118Z" fill="url(#${u}h)"/>`;
 else if(f.style==='wavy') s+=`<path d="M22,104 C10,84 18,66 16,52 C14,26 36,14 60,15 C84,14 106,26 104,52 C102,66 110,84 98,104 C88,96 32,96 22,104Z" fill="url(#${u}h)"/>`;
 else if(f.style==='pony') s+=`<path d="M82,30 C108,34 110,76 94,94 C100,70 94,50 80,42Z" fill="url(#${u}h)"/>`;
 else if(f.style==='braid') s+=`<g fill="url(#${u}h)"><ellipse cx="88" cy="70" rx="7" ry="8"/><ellipse cx="90" cy="84" rx="6.5" ry="7.5"/><ellipse cx="91" cy="97" rx="6" ry="7"/></g>`;
 else if(f.style==='bob') s+=`<path d="M28,82 C20,40 34,18 60,18 C86,18 100,40 92,82 C80,86 40,86 28,82Z" fill="url(#${u}h)"/>`;
 // כתפיים וחולצה
 s+=`<path d="M10,124 C12,100 34,90 60,90 C86,90 108,100 110,124Z" fill="${ch?`url(#${u}p)`:`url(#${u}t)`}"/><path d="M48,90 Q60,104 72,90" fill="${shade(skin,-.08)}"/>
 <path d="M51,74 L69,74 L70,92 Q60,99 50,92Z" fill="${shade(skin,-.12)}"/>`;
 // אוזניים ופנים
 s+=`<ellipse cx="35" cy="58" rx="4.5" ry="7" fill="${shade(skin,-.1)}"/><ellipse cx="85" cy="58" rx="4.5" ry="7" fill="${shade(skin,-.1)}"/>
 <path d="M36,54 C36,32 46,24 60,24 C74,24 84,32 84,54 C84,72 74,84 60,85 C46,84 36,72 36,54Z" fill="url(#${u}s)"/>
 <ellipse cx="46" cy="64" rx="8" ry="5" fill="url(#${u}b)"/><ellipse cx="74" cy="64" rx="8" ry="5" fill="url(#${u}b)"/>`;
 // עיניים
 for(const x of [49,71]){
  if(ch) s+=`<ellipse cx="${x}" cy="50" rx="8" ry="5" fill="#b05bd6" opacity=".55"/>`;
  s+=`<path d="M${x-6},55 Q${x},49 ${x+6},55 Q${x},58.5 ${x-6},55Z" fill="#fff"/><circle cx="${x}" cy="54.6" r="2.6" fill="#4a2c19"/><circle cx="${x}" cy="54.6" r="1.2" fill="#140b06"/><circle cx="${x+.9}" cy="53.8" r=".7" fill="#fff"/>
  <path d="M${x-6.5},55 Q${x},48.5 ${x+6.5},55" stroke="#1d120c" stroke-width="${ch?1.8:1.1}" fill="none" stroke-linecap="round"/>`;
  if(ch){const d=x<60?-1:1;s+=`<path d="M${x+6.3*d},54.6 l${3.5*d},-2.4" stroke="#000" stroke-width="1.4" stroke-linecap="round"/>`}
  s+=`<path d="M${x-6},${ch?45:46.5} Q${x},${ch?41.5:44} ${x+6},${ch?45.5:47}" stroke="${ch?'#2a160c':shade(f.hair,-.2)}" stroke-width="${ch?1.3:2}" fill="none" stroke-linecap="round"/>`;
 }
 // אף ופה
 s+=`<path d="M60,57 C59,63 57,66 58.5,67.5 C59.8,68.3 61.2,68.3 62.5,67" stroke="${shade(skin,-.22)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
 s+= ch?`<path d="M51.5,73 C55,69 58.5,70.5 60,71.5 C61.5,70.5 65,69 68.5,73 C66,79.5 54,79.5 51.5,73Z" fill="url(#${u}l)"/><ellipse cx="57" cy="76.2" rx="3" ry="1" fill="#fff" opacity=".6"/>`
  :`<path d="M53.5,73.5 Q60,78.5 66.5,73.5 Q60,75.4 53.5,73.5Z" fill="#c4615e"/><path d="M54,73.4 Q60,72 66,73.4" stroke="#b25a57" stroke-width=".8" fill="none"/>`;
 // שיער קדמי
 if(ch) s+=`<path d="M60,22 C44,22 34,32 33,52 L31,108 L40,108 C39,82 39,58 42,42 C45,32 52,27 60,26Z M60,22 C76,22 86,32 87,52 L89,108 L80,108 C81,82 81,58 78,42 C75,32 68,27 60,26Z" fill="url(#${u}h)"/><path d="M36,60 L35,104 M84,60 L85,104" stroke="#fff6d6" stroke-width="1.4" opacity=".5"/>
  <circle cx="35" cy="72" r="5.5" stroke="#f2c14e" stroke-width="1.8" fill="none"/><circle cx="85" cy="72" r="5.5" stroke="#f2c14e" stroke-width="1.8" fill="none"/>`;
 else if(f.style==='bob') s+=`<path d="M34,52 C32,30 44,21 60,21 C76,21 88,30 86,52 C80,40 72,34 60,33 C48,34 40,40 34,52Z" fill="url(#${u}h)"/><path d="M34,52 L32,74 L38,70Z M86,52 L88,74 L82,70Z" fill="url(#${u}h)"/>`;
 else if(f.style==='wavy') s+=`<path d="M34,54 C30,30 46,20 60,21 C74,20 90,30 86,54 C82,42 76,36 70,34 C64,40 52,40 46,34 C40,38 36,44 34,54Z" fill="url(#${u}h)"/>`;
 else s+=`<path d="M35,52 C34,30 46,21 60,21 C74,21 86,30 85,52 C80,38 70,33 60,32 C50,33 40,38 35,52Z" fill="url(#${u}h)"/>`;
 if(!ch) s+=`<path d="M46,28 Q56,24 64,27 M70,29 Q78,32 82,40" stroke="${shade(hair,.3)}" stroke-width="1" fill="none" opacity=".6"/>`;
 return s+`</g><circle cx="60" cy="60" r="57.5" fill="none" stroke="${ch?'#ff4f9a':'#ffffff'}" stroke-width="3"/></svg>`;
}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(amt>0?v+(255-v)*amt:v*(1+amt))));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}

function prizeSVG(p){
 const u='p'+(++_uid);
 const v=`viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"`;
 const shadow=`<ellipse cx="60" cy="108" rx="38" ry="6" fill="#000" opacity=".12"/>`;
 const g=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${u}${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
 switch(p.w){
  case 'lego':{
   const brick=(x,y,c,id)=>`<g transform="translate(${x},${y})"><path d="M0,10 L44,10 L44,30 L0,30Z" fill="url(#${u}${id}f)"/><path d="M44,10 L52,4 L52,24 L44,30Z" fill="${shade(c,-.35)}"/><path d="M0,10 L8,4 L52,4 L44,10Z" fill="${shade(c,.25)}"/>${[10,30].map(sx=>`<g transform="translate(${sx},2)"><ellipse cx="4" cy="6" rx="6" ry="2.6" fill="${shade(c,-.15)}"/><rect x="-2" y="0" width="12" height="6" fill="${shade(c,-.05)}"/><ellipse cx="4" cy="0" rx="6" ry="2.6" fill="${shade(c,.35)}"/></g>`).join('')}</g>`;
   return `<svg ${v}><defs>${g('rf','#ef4444','#b91c1c')}${g('bf','#3b82f6','#1d4ed8')}${g('yf','#facc15','#ca8a04')}${g('gf','#22c55e','#15803d')}</defs>${shadow}${brick(8,74,'#ef4444','r')}${brick(58,74,'#3b82f6','b')}${brick(33,48,'#facc15','y')}${brick(33,22,'#22c55e','g')}</svg>`}
  case 'marvel': return `<svg ${v}><defs>${g('t','#e11d48','#7f1d1d',1,1)}${g('s','#fde68a','#f59e0b')}</defs>${shadow}<g transform="rotate(-8 60 60)"><path d="M10,34 h100 v12 a6,6 0 0 0 0,12 v14 h-100 v-14 a6,6 0 0 0 0,-12z" fill="url(#${u}t)"/><path d="M10,34 h100 v6 h-100z" fill="#fff" opacity=".15"/><line x1="84" y1="36" x2="84" y2="70" stroke="#fff" stroke-dasharray="3 3" opacity=".7"/><text x="47" y="52" font-size="12" text-anchor="middle" fill="#fff" font-weight="800" font-family="Rubik,sans-serif">סרט</text><text x="47" y="65" font-size="10" text-anchor="middle" fill="url(#${u}s)" font-weight="700" font-family="Rubik,sans-serif">מארוול</text><path d="M97,46 l2.6,5.4 5.9,.8 -4.3,4.1 1,5.9 -5.2,-2.8 -5.2,2.8 1,-5.9 -4.3,-4.1 5.9,-.8z" fill="url(#${u}s)"/></g></svg>`;
  case 'series': return `<svg ${v}><defs>${g('sc','#818cf8','#4338ca',1,1)}${g('fr','#374151','#111827')}</defs>${shadow}<rect x="14" y="22" width="92" height="62" rx="8" fill="url(#${u}fr)"/><rect x="20" y="28" width="80" height="50" rx="4" fill="url(#${u}sc)"/><path d="M20,62 Q50,48 100,58 L100,78 L20,78Z" fill="#312e81" opacity=".5"/><circle cx="60" cy="53" r="12" fill="#fff" opacity=".92"/><path d="M56,47 L67,53 L56,59Z" fill="#4338ca"/><rect x="50" y="86" width="20" height="6" fill="#1f2937"/><rect x="38" y="92" width="44" height="5" rx="2.5" fill="#1f2937"/><path d="M22,30 L50,30 L26,50Z" fill="#fff" opacity=".12"/></svg>`;
  case 'bands':
   if(p.kind==='vinyl') return `<svg ${v}><defs><radialGradient id="${u}v"><stop offset=".25" stop-color="#2a2a2a"/><stop offset=".26" stop-color="#111"/><stop offset="1" stop-color="#050505"/></radialGradient>${g('lb','#f472b6','#7c3aed',1,1)}</defs>${shadow}<circle cx="60" cy="56" r="46" fill="url(#${u}v)"/>${[40,34,28,22].map(r=>`<circle cx="60" cy="56" r="${r}" fill="none" stroke="#2b2b2b" stroke-width=".8"/>`).join('')}<path d="M30,30 A42,42 0 0 1 72,16" stroke="#fff" stroke-width="3" opacity=".18" fill="none"/><circle cx="60" cy="56" r="13" fill="url(#${u}lb)"/><circle cx="60" cy="56" r="2" fill="#111"/><text x="60" y="114" font-size="8" text-anchor="middle" fill="#111" font-weight="800" font-family="Rubik,sans-serif">${p.b}</text></svg>`;
   if(p.kind==='ticket') return `<svg ${v}><defs>${p.b==='COLDPLAY'?g('t','#fbbf24','#ea580c',1,1):g('t','#334155','#020617',1,1)}</defs>${shadow}<g transform="rotate(6 60 60)"><path d="M8,36 h104 v12 a6,6 0 0 0 0,12 v14 h-104 v-14 a6,6 0 0 0 0,-12z" fill="url(#${u}t)"/><line x1="88" y1="38" x2="88" y2="72" stroke="#fff" stroke-dasharray="3 3" opacity=".7"/>${bandText(p.b,48,57,10)}<text x="48" y="${p.b.includes(' ')?74:68}" font-size="7.5" text-anchor="middle" fill="#fff" opacity=".9" font-family="Rubik,sans-serif">LIVE · כרטיס להופעה</text><text x="100" y="58" font-size="9" text-anchor="middle" fill="#fff" font-family="Rubik,sans-serif" transform="rotate(90 100 58)">ADMIT 1</text></g></svg>`;
   return `<svg ${v}><defs>${p.b==='COLDPLAY'?g('p','#38bdf8','#6d28d9',.4,1):g('p','#1f2937','#000000',.4,1)}</defs>${shadow}<rect x="24" y="8" width="72" height="96" rx="3" fill="url(#${u}p)"/>${[...Array(18)].map((_,i)=>`<circle cx="${30+((i*37)%60)}" cy="${14+((i*23)%52)}" r="${.8+(i%3)*.6}" fill="#fff" opacity="${.5+(i%3)*.2}"/>`).join('')}<path d="M34,58 L86,58" stroke="#fff" stroke-width="1" opacity=".4"/>${bandText(p.b,60,80,11)}<rect x="24" y="8" width="72" height="96" rx="3" fill="none" stroke="#fff" stroke-width="1.5" opacity=".25"/></svg>`;
  case 'steak': return `<svg ${v}><defs><radialGradient id="${u}pl"><stop offset=".7" stop-color="#ffffff"/><stop offset="1" stop-color="#d1d5db"/></radialGradient><radialGradient id="${u}m" cx=".4" cy=".4"><stop offset="0" stop-color="#9a3412"/><stop offset="1" stop-color="#431407"/></radialGradient>${g('gb','#4ade80','#15803d')}</defs>${shadow}<ellipse cx="60" cy="66" rx="54" ry="36" fill="url(#${u}pl)"/><ellipse cx="60" cy="66" rx="42" ry="27" fill="none" stroke="#e5e7eb" stroke-width="1.5"/><path d="M26,62 C24,44 50,38 64,46 C80,54 78,76 60,80 C42,84 28,76 26,62Z" fill="url(#${u}m)"/><path d="M34,54 L62,74 M42,48 L70,66 M32,64 L52,78" stroke="#1c0a03" stroke-width="3" stroke-linecap="round" opacity=".7"/><path d="M30,58 C34,50 46,46 54,48" stroke="#fdba74" stroke-width="2" fill="none" opacity=".6"/>${[0,1,2,3,4,5].map(i=>`<rect x="${70+i*2}" y="${50+i*4.5}" width="30" height="4.5" rx="2.2" transform="rotate(-24 ${85+i*2} ${52+i*4.5})" fill="url(#${u}gb)"/>`).join('')}</svg>`;
  case 'curls': return `<svg ${v}><defs>${g('b','#fbcfe8','#ec4899',1,0)}${g('c','#a78bfa','#6d28d9')}</defs>${shadow}<rect x="36" y="30" width="48" height="76" rx="14" fill="url(#${u}b)"/><rect x="46" y="12" width="28" height="22" rx="5" fill="url(#${u}c)"/><rect x="42" y="50" width="36" height="34" rx="6" fill="#fff" opacity=".95"/><path d="M48,74 q5,-12 10,0 q5,12 10,0" stroke="#7c3aed" stroke-width="2.6" fill="none" stroke-linecap="round"/><text x="60" y="63" font-size="8" text-anchor="middle" fill="#6d28d9" font-weight="800" font-family="Rubik,sans-serif">CURLS</text><rect x="40" y="34" width="6" height="66" rx="3" fill="#fff" opacity=".35"/></svg>`;
 }
}
