'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const FILAMENTS = ['PLA', 'PETG', 'ABS', 'TPU', 'RESIN', 'ASA', 'NYLON']
const CATEGORIES = [
  { value: 'DECORATION', label: 'Dekorasyon' },
  { value: 'AUTOMOTIVE', label: 'Otomotiv' },
  { value: 'SPARE_PART', label: 'Yedek Parça' },
  { value: 'HOME', label: 'Ev & Yaşam' },
  { value: 'TOY', label: 'Oyuncak' },
  { value: 'EDUCATION', label: 'Eğitim' },
  { value: 'OTHER', label: 'Diğer' },
]

type Props = {
  mode: 'create' | 'edit'
  product?: any
}

export default function ProductForm({ mode, product }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    sku: product?.sku || '',
    filament: product?.filament || '',
    category: product?.category || '',
    printTimeH: product?.printTimeH?.toString() || '',
    dimensions: product?.dimensions || '',
    layerHeight: product?.layerHeight?.toString() || '0.2',
    infill: product?.infill?.toString() || '20',
    featured: product?.featured || false,
    active: product?.active ?? true,
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const newPreviews = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 6 - previews.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 6))
    if (newPreviews.length > 0) toast.success(`${newPreviews.length} fotoğraf eklendi`)
  }, [previews.length])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const removePreview = (i: number) => {
    URL.revokeObjectURL(previews[i].url)
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.filament || !form.category) {
      toast.error('Zorunlu alanları doldurunuz')
      return
    }
    setLoading(true)
    try {
      const url = mode === 'edit' ? `/api/products/${product.id}` : '/api/products'
      const method = mode === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          printTimeH: form.printTimeH ? parseFloat(form.printTimeH) : null,
          layerHeight: parseFloat(form.layerHeight),
          infill: parseInt(form.infill),
        }),
      })
      if (res.ok) {
        toast.success(mode === 'edit' ? 'Ürün güncellendi!' : 'Ürün eklendi!')
        router.push('/admin/products')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg3)',
    border: '1px solid var(--border)', color: 'var(--text)',
    padding: '9px 12px', borderRadius: '8px', fontSize: '13px',
    outline: 'none', fontFamily: 'var(--font-sans)',
  }

  const labelStyle = {
    display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)',
    color: 'var(--text3)', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', marginBottom: '7px',
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '860px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: '20px' }}>

        {/* Name */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Ürün Adı *</label>
          <input value={form.name} onChange={set('name')} required placeholder="örn: Dekoratif Vazo v3" style={inputStyle} />
        </div>

        {/* Category & Filament */}
        <div>
          <label style={labelStyle}>Kategori *</label>
          <select value={form.category} onChange={set('category')} required style={{ ...inputStyle, appearance: 'none' }}>
            <option value="">Seçiniz...</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Filament Tipi *</label>
          <select value={form.filament} onChange={set('filament')} required style={{ ...inputStyle, appearance: 'none' }}>
            <option value="">Seçiniz...</option>
            {FILAMENTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Price & Stock */}
        <div>
          <label style={labelStyle}>Fiyat (₺) *</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required placeholder="0.00" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Stok Adedi</label>
          <input type="number" min="0" value={form.stock} onChange={set('stock')} style={inputStyle} />
        </div>

        {/* SKU */}
        <div>
          <label style={labelStyle}>SKU Kodu</label>
          <input value={form.sku} onChange={set('sku')} placeholder="örn: DKR-003" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Baskı Süresi (saat)</label>
          <input type="number" min="0" step="0.5" value={form.printTimeH} onChange={set('printTimeH')} placeholder="örn: 4.5" style={inputStyle} />
        </div>

        {/* Dimensions */}
        <div>
          <label style={labelStyle}>Boyutlar (mm)</label>
          <input value={form.dimensions} onChange={set('dimensions')} placeholder="120 x 80 x 60" style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Katman (mm)</label>
            <input type="number" min="0.05" max="0.5" step="0.05" value={form.layerHeight} onChange={set('layerHeight')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Doluluk (%)</label>
            <input type="number" min="5" max="100" step="5" value={form.infill} onChange={set('infill')} style={inputStyle} />
          </div>
        </div>

        {/* Description */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Açıklama</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Ürün hakkında detaylı açıklama yazın..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Toggles */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px' }}>
          {[
            { key: 'featured', label: 'Öne Çıkan Ürün' },
            { key: 'active', label: 'Aktif (Sitede Görünür)' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{
                width: '38px', height: '20px',
                background: (form as any)[key] ? 'var(--accent)' : 'var(--surface2)',
                borderRadius: '10px', position: 'relative',
                transition: 'background 0.2s', flexShrink: 0,
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: '#fff', position: 'absolute',
                  top: '2px',
                  left: (form as any)[key] ? '21px' : '2px',
                  transition: 'left 0.2s',
                }} />
              </div>
              <input
                type="checkbox"
                checked={(form as any)[key]}
                onChange={set(key)}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PHOTO UPLOAD */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Ürün Fotoğrafları</label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: dragOver ? 'rgba(61,156,245,0.06)' : 'var(--bg3)',
            border: `2px dashed ${dragOver ? 'var(--accent)' : 'rgba(99,179,237,0.22)'}`,
            borderRadius: '12px', padding: '32px',
            textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>
            Fotoğrafları sürükle & bırak veya tıkla
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            PNG, JPG, WEBP — Maks. 6 fotoğraf, 10MB/dosya
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Existing images (edit mode) */}
        {mode === 'edit' && product?.images?.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginBottom: '8px' }}>Mevcut Fotoğraflar</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.images.map((img: any) => (
                <div key={img.id} style={{
                  width: '64px', height: '64px', background: 'var(--bg3)',
                  borderRadius: '8px', border: `1px solid ${img.isPrimary ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)',
                  overflow: 'hidden',
                }}>
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as any).style.display = 'none' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New previews */}
        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {previews.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={p.url} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'var(--accent3)', border: 'none',
                    color: '#fff', fontSize: '10px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700',
                  }}
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent2)', color: '#0d1a15',
            border: 'none', padding: '11px 28px', borderRadius: '9px',
            fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)',
          }}
        >
          {loading ? 'Kaydediliyor...' : mode === 'edit' ? 'Güncelle' : 'Ürünü Kaydet'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text2)', padding: '11px 20px', borderRadius: '9px',
            fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          İptal
        </button>
      </div>
    </form>
  )
}
