import { IconArrowDown, IconCoffee, IconStar, IconUsers, IconAward } from './Icons'

export default function HeroSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero-section py-5">
      <div className="hero-bg" />
      <div className="hero-grain" />
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="hero-tag">
              <IconAward size={13} strokeWidth={2} />
              <span>Best Coffee in Town 2024</span>
            </div>
            <h1 className="hero-title">
              Rasa yang<br /><span className="accent">Berbicara</span><br />Sendiri.
            </h1>
            <p className="hero-desc">
              Setiap tegukan membawa cerita — dari biji kopi pilihan petani lokal, diseduh dengan penuh cinta untuk menemani harimu.
            </p>
            <div className="d-flex gap-3 mt-4" style={{ animation: 'fadeInUp 0.6s 0.45s ease both', opacity: 0, animationFillMode: 'both' }}>
              <button className="btn-hero-primary d-flex align-items-center gap-2" onClick={() => scrollTo('menu')}>
                Lihat Menu <IconArrowDown size={16} strokeWidth={2.5} />
              </button>
              <button className="btn-hero-outline" onClick={() => scrollTo('order')}>Pesan Sekarang</button>
            </div>
            <div className="d-flex mt-5" style={{ animation: 'fadeInUp 0.6s 0.6s ease both', opacity: 0, animationFillMode: 'both' }}>
              {[
                { Icon: IconCoffee, num: '12+', label: 'Varian Menu' },
                { Icon: IconUsers,  num: '5K+', label: 'Pelanggan Puas' },
                { Icon: IconStar,   num: '4.9', label: 'Rating Google' },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <s.Icon size={14} color="var(--gold)" strokeWidth={1.8} />
                    <div className="hero-stat-num">{s.num}</div>
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80" alt="Coffee" className="hero-img-main" />
              <div className="hero-img-badge">
                <IconCoffee size={24} color="var(--coffee-900)" strokeWidth={1.8} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 4 }}>Fresh Daily</div>
              </div>
              <div style={{
                position: 'absolute', top: -16, right: -16,
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                borderRadius: 16, padding: '14px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '0.9rem', color: 'var(--coffee-900)' }}>Open Today</div>
                <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                  07:00 – 22:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}