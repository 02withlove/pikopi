export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-brand mb-2">☕ KOPI.KO</div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8, maxWidth: 300 }}>
              Tempat di mana setiap cangkir adalah cerita. Hadir untuk menemani
              momen terbaikmu setiap hari.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['📸', '🐦', '💬', '🎵'].map((icon, i) => (
                <div
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Menu
            </div>
            {['Espresso', 'Latte', 'Matcha', 'Cold Brew', 'Makanan'].map(l => (
              <a key={l} className="footer-link">{l}</a>
            ))}
          </div>

          <div className="col-6 col-lg-2">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Info
            </div>
            {['Tentang Kami', 'Karir', 'Blog', 'Press'].map(l => (
              <a key={l} className="footer-link">{l}</a>
            ))}
          </div>

          <div className="col-lg-4">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Hubungi Kami
            </div>
            {[
              { icon: '📍', text: 'Jl. Kopi Aroma No. 17, Bandung' },
              { icon: '📞', text: '+62 812-3456-7890' },
              { icon: '✉️', text: 'hello@kopiko.id' },
              { icon: '🕐', text: 'Setiap hari, 07:00 – 22:00' },
            ].map((c) => (
              <div key={c.text} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '0.875rem' }}>
                <span>{c.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          <span>© 2026 KOPI.KO. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}