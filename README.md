# Apple Nukus E‑Commerce Platform

**Next.js 16 + React 19 + Zustand + Prisma 7 (SQLite) asosida yaratilgan premium e-commerce platforma.**

## 📋 Loyiha haqida

Bu loyiha Apple mahsulotlarini onlayn sotish uchun to'liq funksional do'kon hisoblanadi:
- 🔐 **Autentifikatsiya** — 30 kunlik sessiya bilan `useAuthStore` (Zustand persist)
- 🛒 **Savatcha** — `useCartStore` orqali mahsulot qo'shish, miqdor boshqarish, badge
- 🗄️ **Ma'lumotlar bazasi** — Prisma 7 + SQLite (LibSQL adapter) orqali haqiqiy DB
- 🎨 **Premium dizayn** — Dark mode, glassmorphism, Framer Motion animatsiyalar
- 👨‍💼 **Admin panel** — Mahsulot qo'shish, tahrirlash, o'chirish (tasdiqlash modali bilan)

## 🚀 O'rnatish va ishga tushirish

### 1. Bog'lamalarni o'rnatish
```bash
npm install
```

### 2. Prisma bazasini sozlash
```bash
npx prisma db push        # SQLite jadvallarni yaratadi
npx prisma generate       # Prisma clientni generatsiya qiladi
```

### 3. Ishga tushirish
```bash
npm run dev
```
Brauzerda: [http://localhost:3000](http://localhost:3000)

## 🛠️ Texnologiyalar

| Texnologiya | Versiya | Vazifasi |
|-------------|---------|----------|
| Next.js | 16.2.6 (Turbopack) | Framework |
| React | 19 | UI kutubxona |
| Zustand | latest | State management |
| Prisma | 7.8.0 | ORM (SQLite) |
| LibSQL | latest | SQLite driver adapter |
| Framer Motion | latest | Animatsiyalar |
| Lucide React | latest | Ikonalar |

## 📂 Loyiha tuzilishi

```
src/
├─ app/
│  ├─ api/
│  │  ├─ products/
│  │  │  ├─ route.ts              # GET (ro'yxat), POST (qo'shish)
│  │  │  └─ [id]/route.ts         # PUT (tahrirlash), DELETE (o'chirish)
│  │  └─ demo/route.ts            # Demo mahsulot qo'shish
│  ├─ shop/page.tsx               # Do'kon sahifasi
│  ├─ cart/page.tsx                # Savatcha sahifasi
│  ├─ admin/
│  │  ├─ page.tsx                  # Admin boshqaruv paneli
│  │  └─ products/page.tsx         # Mahsulotlar boshqaruvi
│  ├─ about/page.tsx               # Haqida
│  ├─ contact/page.tsx             # Aloqa
│  └─ filials/page.tsx             # Filiallar
├─ components/
│  ├─ admin/
│  │  ├─ AddProductModal.tsx       # Yangi mahsulot qo'shish modali
│  │  └─ EditProductModal.tsx      # Mahsulot tahrirlash modali
│  ├─ layout/
│  │  ├─ ClientLayout.tsx          # Asosiy layout (sidebar, navbar)
│  │  └─ Sidebar.tsx               # Admin sidebar
│  └─ auth/AuthModal.tsx           # Login/Register modali
├─ store/
│  ├─ useAuthStore.ts              # Autentifikatsiya holati
│  ├─ useCartStore.ts              # Savatcha holati
│  ├─ useProductStore.ts           # Mahsulotlar holati (API orqali)
│  └─ useSettingsStore.ts          # To'lov sozlamalari
├─ lib/
│  └─ prisma.ts                    # Prisma client (LibSQL adapter)
prisma/
├─ schema.prisma                   # DB schema (Product modeli)
├─ dev.db                          # SQLite baza fayli
└─ prisma.config.ts                # Prisma konfiguratsiya
```

## 🔄 So'nggi yangilanishlar

### ✅ SQLite bazaga o'tish (Prisma 7)
- Barcha mahsulotlar endi **SQLite** bazasida saqlanadi (oldingi mock data o'rniga)
- **Prisma 7** ning yangi `LibSQL adapter` usuli qo'llanildi:
  ```ts
  import { PrismaClient } from '@prisma/client';
  import { PrismaLibSQL } from '@prisma/adapter-libsql';
  import { createClient } from '@libsql/client';
  
  const libsql = createClient({ url: `file:${dbPath}` });
  const adapter = new PrismaLibSQL(libsql);
  export const prisma = new PrismaClient({ adapter });
  ```

### ✅ RESTful API yaratildi
| Endpoint | Metod | Vazifasi |
|----------|-------|----------|
| `/api/products` | GET | Barcha mahsulotlarni olish |
| `/api/products` | POST | Yangi mahsulot qo'shish |
| `/api/products/:id` | PUT | Mahsulotni tahrirlash |
| `/api/products/:id` | DELETE | Mahsulotni o'chirish |

### ✅ Admin paneli yangilandi
- **Tahrirlash** va **O'chirish** tugmalari yangi dizaynda (kulrang fon, yumaloq burchak)
- **O'chirish tugmasi** bosilganda — tasdiqlash modali chiqadi
- Tasdiqlash modalida "Bekor qilish" va "O'chirish" tugmalari

### ✅ Savatcha va to'lov tizimi
- `/cart` sahifasi — mahsulot miqdorini o'zgartirish, o'chirish, jami summa
- **CheckoutModal** — Naqd yoki Karta orqali to'lov tanlash
- Admin panelda karta raqamini sozlash imkoniyati

### ✅ Real-time sinxronizatsiya
- Admin qo'shgan mahsulot → **Shop** sahifasida darhol ko'rinadi
- Admin o'chirgan mahsulot → **Shop** sahifasidan darhol yo'qoladi
- Barcha o'zgarishlar bazada saqlanadi

### ✅ Yangi funksiyalar va UI yangilanishlari
- **Mahsulot tavsifi (description)**: `Product` modeliga `description` maydoni qo'shildi; admin paneldagi "Add" va "Edit" modallarida tavsif textarea qo'shildi; shop va cart sahifalarida tavsif ko'rsatiladi.
- **Savatga qo'shish tugmasi**: mahsulot kartasida aniq "Savatga qo'shish" tugmasi qo'shildi.
- **Qo'shish tasdiqlash modali**: "Savatga qo'shish" tugmasi bosilganda mahsulot ma'lumoti (rasm, nom, narx, tavsif) bilan tasdiqlash modal (Yo'q / Ha, qo'shish) chiqadi.
- **Savatdagi miqdor boshqaruvi**: savatga qo'shilgandan so'ng `- 1 ta +` tugmalar bilan mahsulot miqdori boshqariladi.
- **Sidebar ikonkasi**: "Savatcha" menyusi uchun `ShoppingCart` ikonkasi ishlatilgan.
- **UI qo'shimchalari**: tugma hover effektlari, rangli badge va mikroanimatsiyalar qo'shildi.

## 🐞 Xatoliklarni bartaraf etish

| Muammo | Sababi | Yechimi |
|--------|--------|---------|
| `PrismaClientInitializationError` | Prisma 7 yangi adapter talab qiladi | `@prisma/adapter-libsql` va `@libsql/client` o'rnating |
| Mahsulot qo'shilmayapti | API 500 xato beradi | `npx prisma generate` bajaring, serverni qayta ishga tushiring |
| Port 3000 band | Oldingi server ishlayapti | `taskkill /PID <pid> /F` bilan to'xtating |
| `Cannot find module '.prisma/client/default'` | Prisma client generatsiya qilinmagan | `npx prisma generate` bajaring |

## 📌 Muhim buyruqlar

```bash
npm run dev                    # Dev server ishga tushirish
npm run build                  # Production build
npx prisma db push             # Schema → DB sinxronizatsiya
npx prisma generate            # Prisma client yaratish
npx prisma studio              # DB ni vizual ko'rish
```

---
*Apple Nukus © 2024 — Antigravity AI coding assistant yordamida yaratildi.*
