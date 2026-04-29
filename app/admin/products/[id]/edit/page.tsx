import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

// 1. params tipini Promise olarak güncelledik
export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 2. id'yi await ederek alıyoruz
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id }, // params.id yerine sadece id
    include: { images: true },
  })

  if (!product) notFound()

  const serializable = {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{
        height: '52px', background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--text)' }}>
            ÜRÜN DÜZENLE
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            / katalog / {product.name}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <ProductForm mode="edit" product={serializable} />
      </div>
    </div>
  )
}