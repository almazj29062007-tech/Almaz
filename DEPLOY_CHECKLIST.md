# DreamDrive — tekshiruv va ishga tushirish

## Tuzatildi
- `app/admin/page.tsx` da `use client` direktivasi birinchi qatorga ko‘chirildi.
- Tasdiqlanmagan raqamli ko‘rsatkichlar vaqtincha yashirildi.

## Hali bajarilishi kerak
- Sayt avval tasdiqlangan animatsiyali bir sahifali dizayn bilan moslashtirilmagan.
- Mobil animatsiyalar, accessibility va scroll reveal qo‘shilmagan.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` va `SUPABASE_SERVICE_ROLE_KEY` Vercel Environment Variables bo‘limida sozlanishi kerak. Secret key hech qachon GitHub'ga yuklanmasin.
- Supabase'dagi jadvallar aynan `supabase/schema.sql` bilan mosligini tekshirish kerak; oldingi SQL ishlatilgan bo‘lsa, mavjud sxemani ustidan ko‘r-ko‘rona qayta ishga tushirmang.
- Narxlar, filiallar, o‘quvchilar soni va Express muddati e’lon qilishdan oldin tasdiqlanishi kerak.
- Real ariza yuborish, admin huquqi, kirish/chiqish, mobil ekranlar va production build sinovdan o‘tkazilishi kerak.
- Public ariza endpointiga rate limit va bot himoyasi qo‘shilishi kerak.
- `.env.example` ommaviy publishable key saqlaydi; `SUPABASE_SERVICE_ROLE_KEY` bo‘sh qolishi kerak.

## GitHub
Arxivni ochib, ichidagi `DreamDrive_Supabase_Configured` papkasining FAYLLARINI repository ildiziga yuklang (papkaning o‘zini emas). `.env.local`, `node_modules`, `.next` fayllarini yuklamang.
