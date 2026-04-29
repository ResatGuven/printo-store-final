'use client'
import { useState } from 'react'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:       { label: 'Hazırlanıyor',  color: '#8891aa', bg: 'rgba(136,145,170,0.1)' },
  PRINTING:      { label: 'Basılıyor',     color: '#f0c040', bg: 'rgba(240,192,64,0.1)' },
  QUALITY_CHECK: { label: 'Kalite Kont.', color: '#3d9cf5', bg: 'rgba(61,156,245,0.1)' },
  SHIPPED:       { label: 'Kargolandı',   color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  DELIVERED:     { label: 'Teslim',       color: '#00e5b0', bg: 'rgba(0,229,176,0.1)' },
  CANCELLED:     { label: 'İptal',        color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
}

export default function OrdersClient({ orders: initialOrders }: { orders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o))
        toast.success('Sipariş durumu güncellendi')
      } else {
        toast.error('Güncelleme başarısız')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setUpdating(null)
    }
  }

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, k) => {
    acc[k] = orders.filter((o) => o.status === k).length
    return acc
  }, {} as Record<string, number>)

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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--text)' }}>SİPARİŞLER</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>/ operasyon / sipariş yönetimi</div>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
          Toplam: {orders.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('ALL')}
            style={{
              padding: '6px 14px', borderRadius: '7px', fontSize: '11px',
              fontFamily: 'var(--font-mono)', cursor: 'pointer', border: 'none',
              background: filter === 'ALL' ? 'var(--accent)' : 'var(--surface)',
              color: filter === 'ALL' ? '#fff' : 'var(--text2)',
            }}
          >
            Tümü ({orders.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '6px 14px', borderRadius: '7px', fontSize: '11px',
                fontFamily: 'var(--font-mono)', cursor: 'pointer',
                border: `1px solid ${filter === key ? cfg.color : 'var(--border)'}`,
                background: filter === key ? cfg.bg : 'transparent',
                color: filter === key ? cfg.color : 'var(--text3)',
              }}
            >
              {cfg.label} {counts[key] > 0 && `(${counts[key]})`}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)' }}>
                {['Sipariş', 'Müşteri', 'Ürünler', 'Tutar', 'Tarih', 'Durum', 'Güncelle'].map((h) => (
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
                    Bu durumda sipariş yok
                  </td>
                </tr>
              ) : filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: '#4a5068', bg: 'var(--surface2)' }
                const isExpanded = expanded === order.id
                return (
                  <>
                    <tr
                      key={order.id}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', fontWeight: '700' }}>
                          #{order.orderNo}
                        </span>
                        <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          {isExpanded ? '▲' : '▼'} Detay
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>{order.customer?.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{order.customer?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                          {order.items[0]?.product?.name}
                          {order.items.length > 1 && (
                            <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginLeft: '6px' }}>
                              +{order.items.length - 1} daha
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text)', fontWeight: '700' }}>
                        ₺{order.total.toLocaleString('tr-TR')}
                      </td>
                      <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text3)' }}>
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{
                          fontSize: '10px', fontFamily: 'var(--font-mono)',
                          color: cfg.color, background: cfg.bg,
                          border: `1px solid ${cfg.color}40`,
                          padding: '3px 9px', borderRadius: '5px',
                        }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }} onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{
                            background: 'var(--surface2)', border: '1px solid var(--border)',
                            color: 'var(--text)', padding: '5px 8px', borderRadius: '6px',
                            fontSize: '10px', fontFamily: 'var(--font-mono)', cursor: 'pointer',
                            outline: 'none', appearance: 'none',
                          }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-detail`} style={{ background: 'var(--bg3)' }}>
                        <td colSpan={7} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '10px' }}>
                                Ürünler
                              </div>
                              {order.items.map((item: any) => (
                                <div key={item.id} style={{
                                  display: 'flex', justifyContent: 'space-between',
                                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                                  fontSize: '12px',
                                }}>
                                  <span style={{ color: 'var(--text)' }}>{item.product?.name}</span>
                                  <span style={{ color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                                    {item.quantity}x ₺{item.price.toLocaleString('tr-TR')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '10px' }}>
                                Müşteri Bilgisi
                              </div>
                              {[
                                ['İsim', order.customer?.name],
                                ['E-posta', order.customer?.email],
                                ['Telefon', order.customer?.phone || '—'],
                                ['Adres', order.customer?.address || '—'],
                                ['Not', order.notes || '—'],
                              ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', gap: '12px', marginBottom: '6px', fontSize: '12px' }}>
                                  <span style={{ color: 'var(--text3)', minWidth: '60px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{k}</span>
                                  <span style={{ color: 'var(--text2)' }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
