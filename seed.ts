generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String         @id @default(cuid())
  name        String
  description String?
  price       Decimal        @db.Decimal(10, 2)
  stock       Int            @default(0)
  sku         String?        @unique
  filament    Filament
  category    Category
  printTimeH  Float?
  dimensions  String?
  layerHeight Float?         @default(0.2)
  infill      Int?           @default(20)
  images      ProductImage[]
  orderItems  OrderItem[]
  featured    Boolean        @default(false)
  active      Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  publicId  String?
  isPrimary Boolean @default(false)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
}

model Order {
  id         String      @id @default(cuid())
  orderNo    Int         @unique @default(autoincrement())
  customer   Customer    @relation(fields: [customerId], references: [id])
  customerId String
  items      OrderItem[]
  status     OrderStatus @default(PENDING)
  total      Decimal     @db.Decimal(10, 2)
  address    String?
  notes      String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  address   String?
  orders    Order[]
  createdAt DateTime @default(now())
}

model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model FilamentStock {
  id        String   @id @default(cuid())
  name      String
  type      Filament
  color     String
  weightKg  Float
  maxKg     Float    @default(10)
  updatedAt DateTime @updatedAt
}

enum OrderStatus {
  PENDING
  PRINTING
  QUALITY_CHECK
  SHIPPED
  DELIVERED
  CANCELLED
}

enum Filament {
  PLA
  PETG
  ABS
  TPU
  RESIN
  ASA
  NYLON
}

enum Category {
  DECORATION
  AUTOMOTIVE
  SPARE_PART
  EDUCATION
  TOY
  HOME
  OTHER
}
