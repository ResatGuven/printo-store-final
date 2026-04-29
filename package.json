import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCartButton from './AddToCartButton'

const categoryEmojis: Record<string, string> = {
  DECORATION: '🏺', AUTOMOTIVE: '🚗', SPARE_PART: '⚙️',
  HOME: '🏠', TOY: '🎮', EDUCATION: '📐', OTHER: '📦',
}

const filamentInfo: Record<string, { temp: string; strength: string; use: string }> = {
  PLA: { temp: '200°C', strength: 'Orta', use: 'Genel kullanım, dekorasyon' },
  PETG: { temp: '240°C', strength: 'Yüksek', use: 'Dayanıklı parçalar, dış mekan' },
  ABS: { temp: '250°C', strength: 'Çok Yüksek', use: 'Isıya dayanıklı, teknik parçalar' },
  TPU: { temp: '225°C', strength: 'Esnek', use: 'Contalar, koruyucu kapaklar' },
  RESIN: { temp: 'UV Kürleme', strength: 'Detaylı', use: 'Figürler, mücevher, prototipler' },
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, active: true },
    include: { images: true },
  })

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id }, active: true },
    take: 3,
    include: { images: { where: { isPrimary: true }, take: 1 } },
  })

  const fi = filamentInfo[product.filament]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAVBAR */}
      <nav style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: '60px', display: 'flex',
        alignItems: 'center', gap: '16px',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '10px', color: '#fff',
          }}>3D</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '13px', color: 'var(--text)' }}>PRINTO</span>
        </Link>
        <span style={{ color: 'var(--text3)', fontSize: '13px' }}>/</span>
        <Link href="/shop" style={{ color: 'var(--text2)', fontSize: '13px', textDecoration: 'none' }}>Ürünler</Link>
        <span style={{ color: 'var(--text3)', fontSize: '13px' }}>/</span>
        <span style={{ color: 'var(--text2)', fontSize: '13px' }}>{product.name}</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '60px' }}>
          {/* LEFT - Image */}
          <div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '20px', height: '400px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '100px', marginBottom: '12px',
            }}>
              {categoryEmojis[product.category] || '📦'}
            </div>
            {/* Specs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {product.printTimeH && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Baskı Süresi</div>
                  <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent)' }}>{product.printTimeH}h</div>
                </div>
              )}
              {product.dimensions && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Boyut</div>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>{product.dimensions}</div>
                </div>
              )}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Katman Kalınlığı</div>
                <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent2)' }}>{product.layerHeight}mm</div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Doluluk</div>
                <div style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent2)' }}>%{product.infill}</div>
              </div>
            </div>
          </div>

          {/* RIGHT - Details */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent2)',
                background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.15)',
                padding: '4px 10px', borderRadius: '5px',
              }}>{product.filament}</span>
              {product.sku && (
                <span style={{
                  fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  padding: '4px 10px', borderRadius: '5px',
                }}>SKU: {product.sku}</span>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)', lineHeight: '1.3', marginBottom: '16px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>
                ₺{Number(product.price).toLocaleString('tr-TR')}
              </span>
              <span style={{
                fontSize: '11px', fontFamily: 'var(--font-mono)',
                color: product.stock > 0 ? 'var(--accent2)' : 'var(--accent3)',
                background: product.stock > 0 ? 'rgba(0,229,176,0.08)' : 'rgba(255,107,107,0.08)',
                border: `1px solid ${product.stock > 0 ? 'rgba(0,229,176,0.2)' : 'rgba(255,107,107,0.2)'}`,
                padding: '4px 10px', borderRadius: '5px',
              }}>
                {product.stock > 5 ? '✓ Stokta' : product.stock > 0 ? `⚠ Son ${product.stock} adet` : '✗ Tükendi'}
              </span>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8', marginBottom: '28px' }}>
              {product.description}
            </p>

            {/* Filament Info */}
            {fi && (
              <div style={{
                background: 'rgba(61,156,245,0.05)', border: '1px solid rgba(61,156,245,0.15)',
                borderRadius: '12px', padding: '16px', marginBottom: '24px',
              }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  Filament: {product.filament}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>Sıcaklık</div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{fi.temp}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>Dayanım</div>
                    <div style={{ fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{fi.strength}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>Kullanım</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{fi.use}</div>
                  </div>
                </div>
              </div>
            )}

            <AddToCartButton product={{ id: product.id, name: product.name, price: Number(product.price) }} disabled={product.stock === 0} />
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '24px' }}>
              Benzer Ürünler
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {related.map((r) => (
                <Link key={r.id} href={`/shop/products/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '16px',
                    display: 'flex', gap: '12px', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '32px' }}>{categoryEmojis[r.category]}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '4px' }}>{r.name}</div>
                      <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent)' }}>₺{Number(r.price).toLocaleString('tr-TR')}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
