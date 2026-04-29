import { prisma } from '@/lib/prisma'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: {
        include: { product: { select: { name: true, filament: true } } },
      },
    },
  })

  const serializable = orders.map((o) => ({
    ...o,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map((i) => ({ ...i, price: Number(i.price) })),
  }))

  return <OrdersClient orders={serializable} />
}
