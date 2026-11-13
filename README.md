# אני לא צ'אחלה! 💄🌀

משחק תרגול לבגרות בלשון (מערכת הצורות ושם המספר), לנויה.

- אתר סטטי (HTML/JS) + Firebase Firestore לסנכרון בין מכשירים.
- הכניסה עם קוד. מהקוד נגזר (SHA-256) שם המסמך ב-Firestore, ושם נשמרים האיור וההתקדמות.
  האיור לא נמצא בקוד שבמאגר.
- הגדרה ראשונית (פעם אחת): `#setup` – בוחרים קוד ומעלים את הקובץ noya-layers.json.

כללי האבטחה של Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /noya/{key}/{doc=**} {
      allow get, create, update: if key.size() == 64;
    }
  }
}
```
