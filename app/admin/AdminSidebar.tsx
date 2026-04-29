'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/admin/products', label: 'Ürünler', icon: '◆' },
  { href: '/admin/products/new', label: 'Ürün Ekle', icon: '⊕' },
  { href: '/admin/orders', label: 'Siparişler', icon: '◉', badge: true },
]

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '220px', minHeight: '100vh',
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'var(--font-mono)',
            fontWeight: '700', fontSize: '12px', color: '#fff',
          }}>3D</div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '13px', color: 'var(--text)' }}>PRINTO</div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 8px 8px' }}>
          Yönetim
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href) && item.href !== '/admin/products/new')
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '8px',
                marginBottom: '2px',
                background: isActive ? 'rgba(61,156,245,0.12)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                border: `1px solid ${isActive ? 'rgba(61,156,245,0.2)' : 'transparent'}`,
                fontSize: '12.5px', fontFamily: 'var(--font-sans)',
              }}>
                <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}

        <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0', paddingTop: '12px' }}>
          <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 8px 8px' }}>
            Uygulama
          </div>
          <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '8px',
              color: 'var(--text2)', fontSize: '12.5px', marginBottom: '2px',
            }}>
              <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>↗</span>
              Siteyi Gör
            </div>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: '9px', color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Superadmin</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            width: '100%', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--text3)',
            padding: '7px', borderRadius: '7px', fontSize: '11px',
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
