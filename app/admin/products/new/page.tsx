import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
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
            YENİ ÜRÜN
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            / katalog / ürün ekle
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
