# شروط وقوانين الجروب

موقع ثابت (Static) لعرض لائحة شروط وقوانين جروب الكورة في 6 أقسام.
بدون أي مكتبات خارجية — الخطوط مستضافة داخل المجلد، فالموقع يشتغل على GitHub Pages مباشرة.

## هيكل المجلد

```
index.html                الصفحة الرئيسية
assets/css/style.css      التصميم
assets/js/app.js          العارض (التنقل، التكبير، التحميل، المشاركة)
assets/fonts/             خطوط IBM Plex Sans Arabic و Noto Kufi Arabic
images/web/               صور WebP مضغوطة للعرض
images/full/              صور PNG بالجودة الكاملة للتحميل والمشاركة
images/thumbs/            صور مصغرة لقائمة الأقسام
images/og-cover.jpg       صورة المعاينة عند مشاركة الرابط
rules-images.zip          كل الصور في ملف واحد
.nojekyll                 لتشغيل الموقع على GitHub Pages بدون Jekyll
```

## النشر على GitHub Pages

1. أنشئ Repository جديد (مثلًا `football-rules`).
2. ارفع **محتويات** هذا المجلد في جذر الـ repo (يكون `index.html` في الجذر مباشرة).
3. من **Settings → Pages**: اختر `Deploy from a branch` ← الفرع `main` ← المجلد `/ (root)` ← Save.
4. بعد دقيقة تقريبًا يظهر الرابط: `https://<username>.github.io/football-rules/`

> لكي تظهر صورة المعاينة عند مشاركة الرابط في واتساب، غيّر قيمة `og:image` في `index.html` للرابط الكامل:
> `https://<username>.github.io/football-rules/images/og-cover.jpg`

## التعديل

- عناوين الأقسام: مصفوفة `SLIDES` في `assets/js/app.js`.
- الأرقام في أعلى الصفحة (25 / 10 / 18 / 2): داخل `index.html` في قسم `stats`.
- لاستبدال صورة: ضع النسخة الجديدة بنفس الاسم في `images/web` و `images/full` و `images/thumbs`.
- رابط مباشر لأي قسم: أضف `#s3` مثلًا في آخر الرابط لفتح قسم الغرامات.
