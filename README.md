# 🖨️ PRINTO — 3D Yazıcı Mağazası

Next.js 15 + Prisma + PostgreSQL + NextAuth ile tam-stack 3D yazıcı mağazası ve admin paneli.

---

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── page.tsx                  # Ana sayfa (storefront)
│   ├── shop/
│   │   ├── page.tsx              # Ürün listeleme + filtre
│   │   └── products/[id]/        # Ürün detay sayfası
│   ├── admin/
│   │   ├── login/page.tsx        # Admin giriş
│   │   ├── dashboard/page.tsx    # İstatistikler
│   │   ├── products/             # Ürün CRUD
│   │   └── orders/page.tsx       # Sipariş yönetimi
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth
│       ├── products/             # Ürün API
│       ├── orders/               # Sipariş API
│       └── stats/                # Dashboard istatistikleri
├── components/
│   └── admin/ProductForm.tsx     # Ürün ekleme/düzenleme formu
└── lib/
    ├── prisma.ts                 # Prisma client
    └── api-routes.ts             # API helpers
```

---

## 🚀 Kurulum (Adım Adım)

### 1. Bağımlılıkları kur
```bash
npm install
```

### 2. Veritabanı kur (Vercel Postgres)
1. [vercel.com](https://vercel.com) → projenin dashboardu → **Storage** sekmesi
2. **Create Database** → **Postgres** seç
3. Oluştuktan sonra **Connect** butonuna tıkla → "Connecting to your project" kısmında **.env.local** değerlerini kopyala
4. Projenin kök dizinine `.env.local` dosyası oluştur:

```bash
cp .env.example .env.local
# Sonra .env.local dosyasını Vercel'den aldığın değerlerle doldur
```

### 3. NEXTAUTH_SECRET oluştur
```bash
openssl rand -base64 32
# Çıktıyı .env.local içindeki NEXTAUTH_SECRET değerine yapıştır
```

### 4. Veritabanı tablolarını oluştur
```bash
npx prisma db push
```

### 5. İlk admin kullanıcısını oluştur
```bash
npx tsx scripts/create-admin.ts
```

### 6. Örnek veri yükle (opsiyonel)
```bash
npm run db:seed
```

### 7. Geliştirme sunucusunu başlat
```bash
npm run dev
```

Tarayıcıda aç: [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🌍 Vercel'e Deploy

```bash
git add .
git commit -m "feat: complete 3d printer store"
git push origin main
```

Vercel otomatik build eder. Dashboard → Settings → Environment Variables bölümünden `.env.local` değerlerini Vercel'e de ekle.

---

## 📱 Sayfalar

| Sayfa | URL |
|-------|-----|
| Ana Sayfa | `/` |
| Ürün Listesi | `/shop` |
| Ürün Detay | `/shop/products/[id]` |
| Admin Giriş | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |
| Ürün Yönetimi | `/admin/products` |
| Sipariş Yönetimi | `/admin/orders` |

---

## 🔒 Admin Panel

- NextAuth.js ile e-posta/şifre koruması
- Middleware ile `/admin/dashboard`, `/admin/products`, `/admin/orders` korumalı
- Şifre bcrypt ile hashlenerek saklanır

---

## 🛠️ Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Veritabanı**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Auth**: NextAuth.js v4
- **Stil**: Tailwind CSS (custom dark theme)
- **Grafikler**: Recharts
- **Bildirimler**: Sonner (toast)
- **Fotoğraf**: UploadThing (opsiyonel entegrasyon)
