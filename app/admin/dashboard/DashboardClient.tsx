'use client'

import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING:       { label: 'Hazırlanıyor', color: '#8891aa' },
  PRINTING:      { label: 'Basılıyor',    color: '#f0c040' },
  QUALITY_CHECK: { label: 'Kalite K.',    color: '#3d9cf5' },
  SHIPPED:       { label: 'Kargoda',      color: '#a78bfa' },
  DELIVERED:     { label: 'Teslim',       color: '#00e5b0' },
  CANCELLED:     { label: 'İptal',        color: '#ff6b6b' },
}

const filamentColors: Record<string, string> = {
  PLA: '#3d9cf5', PETG: '#00e5b0', ABS: '#f0c040',
  TPU: '#ff6b6b', RESIN: '#a78bfa', ASA: '#fb923c', NYLON: '#94a3b8',
}

export default function DashboardClient({ stats }: { stats: any }) {
  const {
    totalProducts, activeOrders, totalRevenue,
    recentOrders, filamentStocks, ordersByStatus,
    lowStockProducts, weeklyData,
  } = stats

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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--text)', letterSpacing: '0.04em' }}>
            DASHBOARD
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            / genel bakış
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <Link href="/admin/products/new" style={{
          background: 'var(--accent)', color: '#fff', padding: '7px 14px',
          borderRadius: '7px', fontSize: '11.5px', fontWeight: '600',
          textDecoration: 'none',
        }}>
          + Ürün Ekle
        </Link>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, trend: '+12%', up: true, accent: '#3d9cf5' },
            { label: 'Aktif Sipariş', value: activeOrders, trend: 'işlemde', up: true, accent: '#00e5b0' },
            { label: 'Toplam Ürün', value: totalProducts, trend: 'aktif', up: true, accent: '#ff6b6b' },
            { label: 'Filament Stok', value: `${filamentStocks.reduce((s: number, f: any) => s + f.weightKg, 0).toFixed(1)}kg`, trend: 'toplam', up: filamentStocks.some((f: any) => f.weightKg < 2) === false, accent: '#f0c040' },
          ].map((card) => (
            <div key={card.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: card.accent }} />
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '22px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text)', lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                marginTop: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                padding: '2px 6px', borderRadius: '4px',
                background: card.up ? 'rgba(0,229,176,0.1)' : 'rgba(255,107,107,0.1)',
                color: card.up ? '#00e5b0' : '#ff6b6b',
              }}>
                {card.up ? '↑' : '↓'} {card.trend}
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Weekly chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Haftalık Sipariş
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Son 7 gün</span>
            </div>
            <div style={{ padding: '16px', height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barSize={22}>
                  <XAxis dataKey="label" tick={{ fill: '#4a5068', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1e2130', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '8px', color: '#e8ecf4', fontSize: '11px' }}
                    cursor={{ fill: 'rgba(61,156,245,0.06)' }}
                    formatter={(v: any) => [v, 'Sipariş']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((_: any, i: number) => (
                      <Cell key={i} fill={i === weeklyData.length - 1 ? '#3d9cf5' : 'rgba(61,156,245,0.35)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order status donut-style list */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Durum Dağılımı
              </span>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ordersByStatus.map((os: any) => {
                const info = statusLabels[os.status] ?? { label: os.status, color: '#4a5068' }
                const total = ordersByStatus.reduce((s: number, o: any) => s + o._count._all, 0)
                const pct = total > 0 ? Math.round((os._count._all / total) * 100) : 0
                return (
                  <div key={os.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{info.label}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{os._count._all} · %{pct}</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: info.color, borderRadius: '2px', transition: 'width 1s' }} />
                    </div>
                  </div>
                )
              })}
              {ordersByStatus.length === 0 && (
                <div style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '20px' }}>
                  Henüz sipariş yok
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Recent Orders */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Son Siparişler
              </span>
              <Link href="/admin/orders" style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
                Tümü →
              </Link>
            </div>
            <div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>Sipariş yok</div>
              ) : recentOrders.map((o: any) => {
                const info = statusLabels[o.status] ?? { label: o.status, color: '#4a5068' }
                return (
                  <div key={o.id} style={{
                    padding: '12px 18px', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', minWidth: '50px' }}>
                      #{o.orderNo}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.customer?.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                        {o.items[0]?.product?.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: '700' }}>
                        ₺{Number(o.total).toLocaleString('tr-TR')}
                      </div>
                      <div style={{
                        fontSize: '9px', fontFamily: 'var(--font-mono)',
                        color: info.color, padding: '1px 6px',
                        background: `${info.color}18`,
                        borderRadius: '4px', marginTop: '2px',
                      }}>
                        {info.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filament + Low Stock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filament Stocks */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Filament Stok
                </span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filamentStocks.length === 0 ? (
                  <div style={{ color: 'var(--text3)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>Stok kaydı yok</div>
                ) : filamentStocks.map((f: any) => {
                  const pct = Math.round((f.weightKg / f.maxKg) * 100)
                  const color = filamentColors[f.type] ?? '#3d9cf5'
                  const isLow = pct < 25
                  return (
                    <div key={f.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: isLow ? '#ff6b6b' : 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                          {isLow ? '⚠ ' : ''}{f.name}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                          {f.weightKg}/{f.maxKg}kg
                        </span>
                      </div>
                      <div style={{ height: '3px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isLow ? '#ff6b6b' : color, borderRadius: '2px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Low Stock Products */}
            {lowStockProducts.length > 0 && (
              <div style={{ background: 'rgba(255,107,107,0.04)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,107,107,0.15)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ⚠ Düşük Stok
                  </span>
                </div>
                {lowStockProducts.map((p: any) => (
                  <div key={p.id} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,107,107,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{p.name}</span>
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)',
                      color: p.stock === 0 ? '#ff6b6b' : '#f0c040',
                      padding: '2px 8px', borderRadius: '4px',
                      background: p.stock === 0 ? 'rgba(255,107,107,0.1)' : 'rgba(240,192,64,0.1)',
                    }}>
                      {p.stock === 0 ? 'Tükendi' : `${p.stock} adet`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
