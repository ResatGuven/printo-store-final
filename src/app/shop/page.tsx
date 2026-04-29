import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

const categoryLabels: Record<string, string> = {
  ALL: 'Tümü',
  DECORATION: 'Dekorasyon',
  AUTOMOTIVE: 'Otomotiv',
  SPARE_PART: 'Yedek Parça',
  HOME: 'Ev & Yaşam',
  TOY: 'Oyuncak',
  EDUCATION: 'Eğitim',
}

const categoryEmojis: Record<string, string> = {
  DECORATION: '🏺', AUTOMOTIVE: '🚗', SPARE_PART: '⚙️',
  HOME: '🏠', TOY: '🎮', EDUCATION: '📐', OTHER: '📦',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const category = searchParams.category as Category | undefined
  const search = searchParams.search

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAVBAR */}
      <nav style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: '60px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'var(--font-mono)',
            fontWeight: '700', fontSize: '12px', color: '#fff',
          }}>3D</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px', color: 'var(--text)' }}>PRINTO</span>
        </Link>
        <form action="/shop" method="GET" style={{ display: 'flex', gap: '8px' }}>
          <input
            name="search"
            defaultValue={search}
            placeholder="Ürün ara..."
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', width: '240px', outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
          }}>Ara</button>
        </form>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* SIDEBAR FILTERS */}
        <aside style={{
          width: '220px', flexShrink: 0,
          background: 'var(--bg2)', borderRight: '1px solid var(--border)',
          padding: '24px 16px',
        }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            Kategoriler
          </div>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link key={key} href={key === 'ALL' ? '/shop' : `/shop?category=${key}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', marginBottom: '2px',
                background: (key === 'ALL' ? !category : category === key) ? 'rgba(61,156,245,0.12)' : 'transparent',
                color: (key === 'ALL' ? !category : category === key) ? 'var(--accent)' : 'var(--text2)',
                border: `1px solid ${(key === 'ALL' ? !category : category === key) ? 'rgba(61,156,245,0.2)' : 'transparent'}`,
                fontSize: '13px',
              }}>
                <span>{key !== 'ALL' ? categoryEmojis[key] : '🗂️'}</span>
                {label}
              </div>
            </Link>
          ))}
        </aside>

        {/* PRODUCTS GRID */}
        <main style={{ flex: 1, padding: '32px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>
              {category ? categoryLabels[category] : 'Tüm Ürünler'}
              <span style={{ fontSize: '13px', color: 'var(--text3)', fontWeight: '400', marginLeft: '12px' }}>
                ({products.length} ürün)
              </span>
            </h1>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              Ürün bulunamadı
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map((product) => (
                <Link key={product.id} href={`/shop/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '14px', overflow: 'hidden', height: '100%',
                  }}>
                    <div style={{
                      height: '180px', background: 'var(--bg3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '56px', borderBottom: '1px solid var(--border)',
                    }}>
                      {categoryEmojis[product.category] || '📦'}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent2)',
                          background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.15)',
                          padding: '2px 7px', borderRadius: '4px',
                        }}>{product.filament}</span>
                        {product.stock === 0 && (
                          <span style={{
                            fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent3)',
                            background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)',
                            padding: '2px 7px', borderRadius: '4px',
                          }}>Tükendi</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px', lineHeight: '1.3' }}>
                        {product.name}
                      </h3>
                      <p style={{
                        fontSize: '12px', color: 'var(--text2)', lineHeight: '1.6',
                        marginBottom: '14px', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{product.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>
                          ₺{Number(product.price).toLocaleString('tr-TR')}
                        </span>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                          {product.printTimeH ? `${product.printTimeH}s baskı` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
