import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ onNavigate }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const { login, register } = useAuth()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'register') {
      if (form.password !== form.confirmPassword) { setError('Password tidak cocok!'); return }
      if (form.password.length < 6) { setError('Password minimal 6 karakter'); return }
      if (!form.name.trim()) { setError('Nama tidak boleh kosong'); return }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
        onNavigate('landing')
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
        setSuccess('Registrasi berhasil! Silakan login.')
        setMode('login')
        setForm({ name: '', email: '', password: '', confirmPassword: '' })
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Invalid login')) setError('Email atau password salah')
      else if (msg.includes('already registered')) setError('Email sudah terdaftar')
      else setError(msg || 'Terjadi kesalahan, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--coffee-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(107,58,31,0.4) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(212,168,67,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Big decorative letter */}
      <div style={{
        position: 'absolute', top: -60, left: -40,
        fontFamily: 'Playfair Display', fontSize: '32rem',
        color: 'rgba(255,255,255,0.02)', fontWeight: 900,
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>☕</div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', fontWeight: 900, color: 'var(--gold)', cursor: 'pointer' }}
            onClick={() => onNavigate('landing')}
          >
            ☕ KOPI.KO
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>
            {mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Tab Toggle */}
          <div style={{ display: 'flex', background: 'var(--coffee-100)' }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '1rem',
                  background: mode === m ? '#fff' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans', fontWeight: 700,
                  fontSize: '0.9rem',
                  color: mode === m ? 'var(--coffee-900)' : 'var(--text-muted)',
                  borderBottom: mode === m ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {m === 'login' ? '🔑 Masuk' : '✨ Daftar'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {/* Error / Success */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 14px',
                color: '#991b1b', fontSize: '0.85rem', fontWeight: 500,
                marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 10, padding: '10px 14px',
                color: '#166534', fontSize: '0.85rem', fontWeight: 500,
                marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>✅</span> {success}
              </div>
            )}

            {/* Name — register only */}
            {mode === 'register' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: 'var(--coffee-700)', marginBottom: 6 }}>
                  Nama Lengkap
                </label>
                <input
                  type="text" name="name" required
                  value={form.name} onChange={handleChange}
                  placeholder="Nama kamu"
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: 'var(--coffee-700)', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="kamu@email.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: mode === 'register' ? '1rem' : '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: 'var(--coffee-700)', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                placeholder="Minimal 6 karakter"
                style={inputStyle}
              />
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: 'var(--coffee-700)', marginBottom: 6 }}>
                  Konfirmasi Password
                </label>
                <input
                  type="password" name="confirmPassword" required
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Ulangi password"
                  style={inputStyle}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--coffee-400)' : 'var(--coffee-900)',
                color: 'var(--gold)',
                border: 'none', padding: '14px',
                borderRadius: 12, fontWeight: 700,
                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans',
              }}
            >
              {loading
                ? '⏳ Memproses...'
                : mode === 'login' ? '→ Masuk' : '✨ Buat Akun'}
            </button>

            {/* Back to home */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: '0.82rem',
                  cursor: 'pointer', textDecoration: 'underline',
                }}
              >
                ← Kembali ke website
              </button>
            </div>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
          © 2024 KOPI.KO. All rights reserved.
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  border: '1.5px solid var(--coffee-200)',
  borderRadius: 12,
  padding: '11px 14px',
  fontSize: '0.9rem',
  background: 'var(--cream)',
  fontFamily: 'DM Sans',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}