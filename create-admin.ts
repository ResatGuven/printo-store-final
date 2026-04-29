import { PrismaClient, Filament, Category } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@3dprinter.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@3dprinter.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  // Filament stokları
  const filaments = [
    { name: 'PLA Beyaz', type: Filament.PLA, color: '#FFFFFF', weightKg: 7.2, maxKg: 10 },
    { name: 'PLA Siyah', type: Filament.PLA, color: '#1a1a1a', weightKg: 5.8, maxKg: 10 },
    { name: 'PETG Şeffaf', type: Filament.PETG, color: '#e0f0ff', weightKg: 3.8, maxKg: 10 },
    { name: 'ABS Gri', type: Filament.ABS, color: '#888888', weightKg: 1.5, maxKg: 10 },
    { name: 'TPU Esnek', type: Filament.TPU, color: '#ff6b6b', weightKg: 5.5, maxKg: 10 },
    { name: 'Resin Şeffaf', type: Filament.RESIN, color: '#c0e0ff', weightKg: 2.0, maxKg: 5 },
  ]

  for (const f of filaments) {
    await prisma.filamentStock.create({ data: f }).catch(() => {})
  }

  // Örnek ürünler
  const products = [
    {
      name: 'Dekoratif Vazo v3',
      description: 'Modern geometrik tasarımlı masa vazosudur. PLA filament ile üretilmiş, su geçirmez iç kaplama uygulanmıştır. Çiçek ve kuru bitki düzenlemeleri için idealdir.',
      price: 280,
      stock: 14,
      sku: 'DKR-003',
      filament: Filament.PLA,
      category: Category.DECORATION,
      printTimeH: 6.5,
      dimensions: '120 x 120 x 180 mm',
      layerHeight: 0.2,
      infill: 20,
      featured: true,
    },
    {
      name: 'Araç Telefon Tutucu Pro',
      description: 'Hava menfezi için mıknatıslı telefon tutucusu. PETG malzeme ile ısıya dayanıklı, titreşim önleyici tasarım. Tüm araç modellerine uyumlu.',
      price: 520,
      stock: 3,
      sku: 'OTV-012',
      filament: Filament.PETG,
      category: Category.AUTOMOTIVE,
      printTimeH: 4.0,
      dimensions: '85 x 65 x 45 mm',
      layerHeight: 0.2,
      infill: 40,
      featured: true,
    },
    {
      name: 'M8 Flanş Dişlisi',
      description: 'Endüstriyel makine yedek parçası. ABS malzeme ile yüksek mukavemet. 100°C ye kadar ısı dayanımı. Özel ölçü taleplerine göre üretim mümkün.',
      price: 180,
      stock: 0,
      sku: 'YDP-088',
      filament: Filament.ABS,
      category: Category.SPARE_PART,
      printTimeH: 2.5,
      dimensions: '45 x 45 x 22 mm',
      layerHeight: 0.15,
      infill: 80,
      featured: false,
    },
    {
      name: 'Saksı Askısı Set (3\'lü)',
      description: 'Balkon ve iç mekan için duvara monte saksı askısı seti. Üç farklı boyutta, PLA malzeme. Maksimum 2kg yük kapasitesi.',
      price: 150,
      stock: 28,
      sku: 'DKR-017',
      filament: Filament.PLA,
      category: Category.DECORATION,
      printTimeH: 8.0,
      dimensions: '200 x 50 x 80 mm',
      layerHeight: 0.2,
      infill: 30,
      featured: false,
    },
    {
      name: 'Esnek Kablo Yönetici',
      description: 'TPU malzeme ile üretilmiş esnek kablo tutucu ve yönetici. Masa üstü ve monitör kenarına takılır. 5 adet kablo kapasiteli.',
      price: 95,
      stock: 22,
      sku: 'EV-033',
      filament: Filament.TPU,
      category: Category.HOME,
      printTimeH: 3.0,
      dimensions: '150 x 30 x 20 mm',
      layerHeight: 0.25,
      infill: 25,
      featured: true,
    },
    {
      name: 'Mini Araba Modeli',
      description: 'Detaylı 1:64 ölçekli spor araba modeli. Koleksiyonluk kalitede baskı, boyama mümkün. Çocuklar ve koleksiyoncular için.',
      price: 120,
      stock: 8,
      sku: 'OYN-005',
      filament: Filament.PLA,
      category: Category.TOY,
      printTimeH: 5.5,
      dimensions: '70 x 30 x 25 mm',
      layerHeight: 0.1,
      infill: 15,
      featured: false,
    },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p }).catch(() => {})
  }

  // Örnek müşteri ve siparişler
  const customer = await prisma.customer.upsert({
    where: { email: 'mehmet@example.com' },
    update: {},
    create: {
      name: 'Mehmet Yılmaz',
      email: 'mehmet@example.com',
      phone: '05551234567',
      address: 'Bursa, Türkiye',
    },
  })

  console.log('✅ Seed tamamlandı!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
