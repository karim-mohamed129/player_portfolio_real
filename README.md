# Player Portfolio Dashboard - Next.js + Vercel + MongoDB + Cloudinary

مشروع كامل لبورتفوليو لاعب كرة قدم مع لوحة تحكم Admin Dashboard للتحكم في كل أقسام الموقع بدون سيرفر خارجي.

## التقنيات

- Next.js App Router
- Tailwind CSS
- API Route Handlers داخل `app/api`
- MongoDB Atlas لتخزين المحتوى والرسائل وحسابات الأدمن
- Cloudinary لرفع الصور وتخزين روابطها
- Cookie JWT Auth لحماية لوحة التحكم

## الصفحات المهمة

- `/` الموقع العام
- `/admin/login` تسجيل دخول الأدمن
- `/admin` لوحة التحكم
- `/api/contact` حفظ رسائل التواصل
- `/api/admin/upload` رفع الصور على Cloudinary
- `/api/admin/content` قراءة وتحديث محتوى الموقع
- `/api/health` فحص حالة إعدادات المشروع

## التشغيل المحلي

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

افتح:

```text
http://localhost:3000
http://localhost:3000/admin/login
```

## بيانات الدخول

ضع الإيميل والباسورد في ملف `.env.local`:

```env
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMe123!StrongPassword"
```

أول مرة تسجل دخول، لو قاعدة البيانات مفيهاش Admin، النظام هيعمل حساب أدمن تلقائياً في MongoDB بالباسورد المشفّر.
بعدها الأفضل تغيّر قيم الباسورد من الـ env أو تضيف آلية إدارة مستخدمين لاحقاً.

## تجهيز MongoDB Atlas

1. اعمل Free Cluster.
2. من Database Access اعمل user/password.
3. من Network Access اسمح بـ `0.0.0.0/0` لو هترفع على Vercel.
4. انسخ Connection String وحطها في:

```env
MONGODB_URI="mongodb+srv://..."
```

## تجهيز Cloudinary

من Dashboard في Cloudinary هتحتاج:

```env
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CLOUDINARY_FOLDER="player-portfolio"
```

## الرفع على Vercel

1. ارفع المشروع على GitHub.
2. افتح Vercel واعمل Import للمشروع.
3. ضيف كل Environment Variables الموجودة في `.env.local.example`.
4. Deploy.

## التحكم في الموقع

من `/admin` تقدر تعدل:

- إعدادات عامة واسم الموقع واللوجو النصي
- Hero section
- بيانات اللاعب
- الإحصائيات
- المهارات
- المسيرة
- الإنجازات
- معرض الصور
- بيانات التواصل
- رسائل التواصل الواردة
- Advanced JSON لتعديل أي جزء غير موجود في الواجهة مباشرة

## ملاحظات أمنية مهمة

- لا ترفع `.env.local` على GitHub.
- لا تضع Cloudinary API Secret أو MongoDB URI داخل ملفات Client Components.
- كل الأسرار هنا مستخدمة Server-side فقط داخل API Routes.
- الصور لا تُخزن على Vercel؛ يتم رفعها إلى Cloudinary ثم حفظ الرابط في MongoDB.
