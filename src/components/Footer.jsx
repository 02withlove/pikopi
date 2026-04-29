import { IconMapPin, IconPhone, IconMail, IconClock, IconInstagram, IconTwitter, IconYoutube, IconMusic } from './Icons'

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-brand mb-2">KOPI.KO</div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.8, maxWidth: 300 }}>Tempat di mana setiap cangkir adalah cerita. Hadir untuk menemani momen terbaikmu setiap hari.</p>
            <div className="d-flex gap-2 mt-3">
              {[IconInstagram, IconTwitter, IconYoutube, IconMusic].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Icon size={15} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Menu</div>
            {['Espresso', 'Latte', 'Matcha', 'Cold Brew', 'Makanan'].map(l => <a key={l} className="footer-link">{l}</a>)}
          </div>
          <div className="col-6 col-lg-2">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Info</div>
            {['Tentang Kami', 'Karir', 'Blog', 'Press'].map(l => <a key={l} className="footer-link">{l}</a>)}
          </div>
          <div className="col-lg-4">
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Hubungi Kami</div>
            {[
              { Icon: IconMapPin, text: 'Jl. Kopi Aroma No. 17, Bandung' },
              { Icon: IconPhone,  text: '+62 812-3456-7890' },
              { Icon: IconMail,   text: 'hello@kopiko.id' },
              { Icon: IconClock,  text: 'Setiap hari, 07:00 – 22:00' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '0.875rem', alignItems: 'flex-start' }}>
                <Icon size={14} color="var(--gold)" strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          <span>© 2024 KOPI.KO. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}