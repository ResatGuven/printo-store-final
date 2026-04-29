'use client'
import { toast } from 'sonner'

export default function AddToCartButton({
  product,
  disabled,
}: {
  product: { id: string; name: string; price: number }
  disabled: boolean
}) {
  const handleAdd = () => {
    // localStorage cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((i: any) => i.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success(`"${product.name}" sepete eklendi!`)
  }

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <button
        onClick={handleAdd}
        disabled={disabled}
        style={{
          flex: 1,
          background: disabled ? 'var(--surface2)' : 'var(--accent)',
          color: disabled ? 'var(--text3)' : '#fff',
          border: 'none',
          padding: '14px 24px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {disabled ? 'Stok Yok' : 'Sepete Ekle'}
      </button>
      {!disabled && (
        <a
          href="/checkout"
          onClick={handleAdd}
          style={{
            background: 'var(--accent2)',
            color: '#0d1a15',
            padding: '14px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Hemen Al
        </a>
      )}
    </div>
  )
}
