import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Cek sudah diinstall belum
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    // Tangkap event install dari browser
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Tunda 3 detik baru tampil biar ga ganggu
      setTimeout(() => setShowBanner(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Jangan tampilkan lagi dalam sesi ini
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  // Sudah install atau sudah dismiss → tidak tampil
  if (installed || !showBanner || sessionStorage.getItem('pwa-dismissed')) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 2rem)',
      maxWidth: 420,
      background: 'var(--coffee-900)',
      border: '1px solid rgba(212,168,67,0.3)',
      borderRadius: 20,
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      zIndex: 9999,
      animation: 'slideInUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(212,168,67,0.15)',
        border: '1px solid rgba(212,168,67,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', flexShrink: 0,
      }}>
        ☕
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700, color: '#fff',
          fontSize: '0.9rem', marginBottom: 2,
        }}>
          Pasang KOPI.KO
        </div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', lineHeight: 1.4 }}>
          Akses lebih cepat, bisa offline
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none', color: 'rgba(255,255,255,0.5)',
            borderRadius: 8, padding: '6px 10px',
            fontSize: '0.75rem', cursor: 'pointer',
          }}
        >
          Nanti
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: 'var(--gold)',
            border: 'none', color: 'var(--coffee-900)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Pasang
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}