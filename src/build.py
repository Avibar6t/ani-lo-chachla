# בונה את index.html מתוך התבנית והקבצים שבתיקייה (מריצים מתיקיית src)
import os
here=os.path.dirname(os.path.abspath(__file__))
js='\n'.join(open(os.path.join(here,f),encoding='utf-8').read() for f in ['data.js','art.js','art2.js','app.js','ui.js'])
t=open(os.path.join(here,'template.html'),encoding='utf-8').read().replace('/*__SCRIPTS__*/',js)
open(os.path.join(here,'..','index.html'),'w',encoding='utf-8').write(t)
