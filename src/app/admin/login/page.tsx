'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      toast.success('Giriş başarılı!')
      router.push('/admin/dashboard')
    } else {
      toast.error('E-posta veya şifre hatalı')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background grid effect */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.4,
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', padding: '20px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #3d9cf5, #00e5b0)',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'var(--font-mono)',
            fontWeight: '700', fontSize: '18px', color: '#fff',
            margin: '0 auto 16px',
          }}>3D</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '18px', color: 'var(--text)', letterSpacing: '0.08em' }}>
            PRINTO ADMIN
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            Yönetim Paneline Giriş
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@3dprinter.com"
                style={{
                  width: '100%', background: 'var(--bg3)',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', background: 'var(--bg3)',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                  outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: 'var(--accent)', color: '#fff',
                border: 'none', padding: '12px', borderRadius: '9px',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)',
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          Şifreyi unutun → ADMIN_PASSWORD env değişkenini kontrol edin
        </div>
      </div>
    </div>
  )
}
