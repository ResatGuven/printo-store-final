import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    totalProducts,
    activeOrders,
    totalRevenue,
    recentOrders,
    filamentStocks,
    ordersByStatus,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'PRINTING', 'QUALITY_CHECK'] } } }),
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } },
        items: { include: { product: { select: { name: true' } } }, take: 1 },
      },
    }),
    prisma.filamentStock.findMany(),
    prisma.order.groupBy({ by: ['status'], _count: true }),
  ])

  // Son 7 günün satışları
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const weeklySales = await prisma.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo }, status: 'DELIVERED' },
    select: { createdAt: true, total: true },
  })

  return NextResponse.json({
    totalProducts,
    activeOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
    filamentStocks,
    ordersByStatus,
    weeklySales,
  })
}
