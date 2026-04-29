import { prisma } from '@/lib/prisma'
import ProductsClient from './ProductsClient'

const categoryLabels: Record<string, string> = {
  DECORATION: 'Dekorasyon', AUTOMOTIVE: 'Otomotiv',
  SPARE_PART: 'Yedek Parça', HOME: 'Ev & Yaşam',
  TOY: 'Oyuncak', EDUCATION: 'Eğitim', OTHER: 'Diğer',
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  const serializable = products.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <ProductsClient products={serializable} categoryLabels={categoryLabels} />
}
