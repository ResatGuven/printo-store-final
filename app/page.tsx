import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 3,
  })
}

const categoryEmojis: Record<string, string> = {
  DECORATION: '🏺',
  AUTOMOTIVE: '🚗',
  SPARE_PART: '⚙️',
  HOME: '🏠',
  TOY: '🎮',
  EDUCATION: '📐',
  OTHER: '📦',
}

const categoryLabels: Record<string, string> = {
  DECORATION: 'Dekorasyon',
  AUTOMOTIVE: 'Otomotiv',
  SPARE_PART: 'Yedek Parça',
  HOME: 'Ev & Yaşam',
  TOY: 'Oyuncak',
  EDUCATION: 'Eğitim',
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAVBAR */}
      <nav style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px', color: '#fff',
          }}>3D</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '14px', letterSpacing: '0.05em' }}>
            PRINTO
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link key={key} href={`/shop?category=${key}`} style={{
              color: 'var(--text2)', fontSize: '13px', textDecoration: 'none',
              transition: 'color 0.15s',
            }}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/shop" style={{
          background: 'var(--accent)',
          color: '#fff',
          padding: '7px 16px',
          borderRadius: '7px',
          fontSize: '12px',
          fontWeight: '600',
          textDecoration: 'none',
        }}>
          Tüm Ürünler
        </Link>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(61,156,245,0.08)',
          border: '1px solid rgba(61,156,245,0.2)',
          borderRadius: '20px',
          padding: '5px 14px',
          marginBottom: '24px',
          fontSize: '11px', fontFamily: 'var(--font-mono)',
          color: 'var(--accent)',
        }}>
          <span>●</span> Sipariş üzerine üretim — 3-5 iş günü
        </div>

        <h1 style={{
          fontSize: '52px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700',
          color: 'var(--text)',
          lineHeight: '1.15',
          marginBottom: '20px',
          maxWidth: '700px',
          margin: '0 auto 20px',
        }}>
          Her şeyi{' '}
          <span style={{ color: 'var(--accent)' }}>3D baskıyla</span>{' '}
          üretiyoruz
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--text2)',
          maxWidth: '500px',
          margin: '0 auto 36px',
          lineHeight: '1.7',
        }}>
          Dekorasyon, otomotiv aksesuarları ve yedek parçalar. Kaliteli filament, hassas baskı.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/shop" style={{
            background: 'var(--accent)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Alışverişe Başla
          </Link>
          <Link href="/shop?category=DECORATION" style={{
            background: 'transparent',
            color: 'var(--text2)',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '14px',
            border: '1px solid var(--border2)',
            textDecoration: 'none',
          }}>
            Öne Çıkanlar
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '48px', justifyContent: 'center',
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid var(--border)',
        }}>
          {[['500+', 'Teslim Edilen Ürün'], ['4', 'Filament Tipi'], ['48h', 'Ort. Üretim Süresi'], ['%99', 'Müşteri Memnuniyeti']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>— Öne Çıkanlar</div>
            <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>Popüler Ürünler</h2>
          </div>
          <Link href="/shop" style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
            Tümünü Gör →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {featured.map((product) => (
            <Link key={product.id} href={`/shop/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}>
                {/* Product Image Placeholder */}
                <div style={{
                  height: '200px',
                  background: 'var(--bg3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {categoryEmojis[product.category] || '📦'}
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent2)',
                      background: 'rgba(0,229,176,0.08)',
                      border: '1px solid rgba(0,229,176,0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      {product.filament}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      color: product.stock > 0 ? 'var(--accent2)' : 'var(--accent3)',
                    }}>
                      {product.stock > 0 ? `${product.stock} stokta` : 'Tükendi'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px', lineHeight: '1.3' }}>
                    {product.name}
                  </h3>

                  <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>
                      ₺{Number(product.price).toLocaleString('tr-TR')}
                    </span>
                    <span style={{
                      background: 'var(--accent)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '7px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      İncele
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '20px 40px 60px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>— Kategoriler</div>
          <h2 style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)' }}>Ne arıyorsun?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link key={key} href={`/shop?category=${key}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'border-color 0.15s',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '32px' }}>{categoryEmojis[key]}</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '700', color: 'var(--text)' }}>
          PRINTO
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          © 2025 · Bursa, Türkiye
        </div>
        <Link href="/admin/login" style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
          Admin Panel →
        </Link>
      </footer>
    </div>
  )
}
