import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/orders - Admin: tüm siparişler
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: { include: { product: { select: { name: true, filament: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

// POST /api/orders - Yeni sipariş oluştur (public - checkout)
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Müşteri bul veya oluştur
  const customer = await prisma.customer.upsert({
    where: { email: body.email },
    update: { name: body.name, phone: body.phone, address: body.address },
    create: { name: body.name, email: body.email, phone: body.phone, address: body.address },
  })

  // Ürün fiyatlarını doğrula
  const productIds = body.items.map((i: any) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const total = body.items.reduce((sum: number, item: any) => {
    const p = products.find((p) => p.id === item.productId)
    return sum + (p ? Number(p.price) * item.quantity : 0)
  }, 0)

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      total,
      address: body.address,
      notes: body.notes,
      items: {
        create: body.items.map((item: any) => {
          const p = products.find((p) => p.id === item.productId)!
          return { productId: item.productId, quantity: item.quantity, price: p.price }
        }),
      },
    },
    include: { items: true, customer: true },
  })

  return NextResponse.json(order, { status: 201 })
}
