import { IconLeaf, IconChefHat, IconRecycle } from './Icons'

export default function AboutSection() {
  const features = [
    { Icon: IconLeaf,    title: 'Bahan Premium Lokal',   desc: 'Biji kopi dipilih langsung dari petani Aceh, Toraja, dan Flores.' },
    { Icon: IconChefHat, title: 'Barista Berpengalaman', desc: 'Tim kami berlatih di World Barista Championship, siap menyajikan yang terbaik.' },
    { Icon: IconRecycle, title: 'Ramah Lingkungan',      desc: 'Kemasan biodegradable & komitmen zero waste dalam operasional kami.' },
  ]
  return (
    <section id="about" className="about-section py-5">
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80" alt="About"
                style={{ width: '100%', borderRadius: 24, height: 480, objectFit: 'cover', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', bottom: 24, right: -24, background: 'var(--gold)', borderRadius: 20, padding: '1.5rem', color: 'var(--coffee-900)', width: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                <div style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontSize: '2.2rem', lineHeight: 1 }}>10+</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>Tahun Meracik Cinta dalam Secangkir Kopi</div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="section-tag" style={{ color: 'var(--gold)' }}>Tentang Kami</div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Lebih dari Sekadar<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Secangkir Kopi</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, marginBottom: '2rem', fontSize: '0.95rem' }}>
              KOPI.KO lahir dari passion yang mendalam terhadap kopi Indonesia. Kami percaya setiap cangkir adalah sebuah pengalaman — tempat di mana aroma, rasa, dan momen bertemu menjadi kenangan yang tak terlupakan.
            </p>
            <div>
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="about-feature-item">
                  <div className="about-feature-icon"><Icon size={20} strokeWidth={1.8} /></div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}