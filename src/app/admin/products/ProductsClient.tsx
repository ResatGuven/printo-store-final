'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const categoryEmojis: Record<string, string> = {
  DECORATION: '🏺', AUTOMOTIVE: '🚗', SPARE_PART: '⚙️',
  HOME: '🏠', TOY: '🎮', EDUCATION: '📐', OTHER: '📦',
}

export default function ProductsClient({ products, categoryLabels }: { products: any[]; categoryLabels: Record<string, string> }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('ALL')

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'ALL' || p.category === filterCat
    return matchSearch && matchCat
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success(`"${name}" silindi`)
        router.refresh()
      } else {
        toast.error('Silme işlemi başarısız')
      }
    } catch {
      toast.error('Bir hata oluştu')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar */}
      <div style={{
        height: '52px', background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '16px', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--text)' }}>ÜRÜNLER</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>/ katalog / ürün listesi</div>
        </div>
        <div style={{ flex: 1 }} />
        <Link href="/admin/products/new" style={{
          background: 'var(--accent)', color: '#fff', padding: '7px 14px',
          borderRadius: '7px', fontSize: '11.5px', fontWeight: '600', textDecoration: 'none',
        }}>
          + Yeni Ürün
        </Link>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', width: '220px', outline: 'none', fontFamily: 'var(--font-sans)',
            }}
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="ALL">Tüm Kategoriler</option>
            {Object.entries(categoryLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
            {filtered.length} ürün
          </span>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)' }}>
                {['Ürün', 'Filament', 'Kategori', 'Fiyat', 'Stok', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px',
                    fontSize: '9.5px', fontFamily: 'var(--font-mono)',
                    color: 'var(--text3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', borderBottom: '1px solid var(--border)', fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', background: 'var(--bg3)',
                        borderRadius: '8px', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', flexShrink: 0,
                      }}>
                        {categoryEmojis[p.category] || '📦'}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>{p.name}</div>
                        {p.sku && <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{p.sku}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#00e5b0' }}>{p.filament}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      background: 'var(--surface2)', color: 'var(--text2)',
                      border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '5px',
                    }}>
                      {categoryLabels[p.category] || p.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', fontWeight: 700 }}>
                    ₺{p.price.toLocaleString('tr-TR')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      color: p.stock === 0 ? '#ff6b6b' : p.stock <= 3 ? '#f0c040' : '#00e5b0',
                      background: p.stock === 0 ? 'rgba(255,107,107,0.1)' : p.stock <= 3 ? 'rgba(240,192,64,0.1)' : 'rgba(0,229,176,0.1)',
                      border: `1px solid ${p.stock === 0 ? 'rgba(255,107,107,0.2)' : p.stock <= 3 ? 'rgba(240,192,64,0.2)' : 'rgba(0,229,176,0.2)'}`,
                      padding: '3px 8px', borderRadius: '5px',
                    }}>
                      {p.stock === 0 ? 'Tükendi' : `${p.stock} adet`}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      color: p.active ? '#00e5b0' : 'var(--text3)',
                    }}>
                      {p.active ? '● Aktif' : '○ Pasif'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link href={`/admin/products/${p.id}/edit`} style={{
                        background: 'transparent', border: '1px solid var(--border)',
                        color: 'var(--text2)', padding: '4px 10px', borderRadius: '5px',
                        fontSize: '10px', fontFamily: 'var(--font-mono)', textDecoration: 'none',
                        cursor: 'pointer',
                      }}>
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        style={{
                          background: 'transparent', border: '1px solid rgba(255,107,107,0.3)',
                          color: '#ff6b6b', padding: '4px 10px', borderRadius: '5px',
                          fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                          opacity: deleting === p.id ? 0.5 : 1,
                        }}
                      >
                        {deleting === p.id ? '...' : 'Sil'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
