# DreamDrive — sayt va kontent boshqaruvi

## Nimalar tayyor?
- Next.js sayt va ro‘yxatdan o‘tish API
- Supabase orqali admin login va arizalar
- Admin orqali A, B, Express narxlarini va tavsiflarini tahrirlash
- Yangilik va natijalarni e’lon qilish, yashirish va o‘chirish
- Asosiy matnlarni tahrirlash
- `/api/content` orqali ochiq, e’lon qilingan kontent
- Telegram xabarnomasi (ixtiyoriy)

## Ishga tushirish (hali internetga chiqarilmagan)
1. Node.js 20+ o‘rnating; terminalda `npm install` bajaring.
2. Supabase'da loyiha yarating. SQL Editor'ga `supabase/schema.sql` faylini kiriting va Run bosing.
3. `.env.example` faylidan `.env.local` yarating va URL, anon key, service role key'ni kiriting. **Service role key faqat serverda qolishi kerak.**
4. Supabase Authentication > Users orqali admin email/parolini yarating; foydalanuvchi UUID sini SQL Editor'da `insert into public.admin_users(user_id) values ('UUID');` bilan qo‘shing.
5. `npm run dev` bajaring; `http://localhost:3000` sayt, `http://localhost:3000/admin` admin panel.
6. Keyin Vercel orqali hostingga joylash mumkin.

## Eslatma
- Admin demo HTML alohida; u hali ushbu Next.js backendga ulanmagan. Next.js versiyada CMS funksiyalari qo‘shilgan, lekin tasdiqlangan HTML animatsiyalari bilan to‘liq vizual moslashtirish alohida ish.
- Hozircha rasmlar va videolarni admin paneldan yuklash qo‘shilmagan.
- Taxminiy narxlar faqat namuna, e’lon qilishdan oldin tasdiqlang.
- Production oldidan rate limiting, bot himoyasi, maxfiylik siyosati va sinovlar zarur.
