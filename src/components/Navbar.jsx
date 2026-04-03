import { useState } from 'react'
import { useCart } from '../context/CartContext'
import CartOffcanvas from './CartOffcanvas'

export default function Navbar({ onNavigate }) {
  const { count } = useCart()
  const [showCart, setShowCart] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className="navbar-coffee">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">
            {/* Brand */}
            <a
              className="navbar-brand-text text-decoration-none"
              onClick={() => scrollTo('hero')}
              style={{ cursor: 'pointer' }}
            >
              ☕ KOPI.KO
            </a>

            {/* Nav Links — desktop */}
            <div className="d-none d-md-flex align-items-center gap-1">
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('menu')}>Menu</button>
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('about')}>Tentang Kami</button>
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('order')}>Pesan</button>
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-link text-decoration-none position-relative p-2"
                onClick={() => setShowCart(true)}
                style={{ color: '#fff' }}
              >
                <span style={{ fontSize: '1.3rem' }}>🛒</span>
                {count > 0 && (
                  <span className="cart-badge position-absolute" style={{ top: 2, right: 0 }}>
                    {count}
                  </span>
                )}
              </button>
              <button
                className="btn btn-sm px-3 py-2"
                style={{
                  background: 'rgba(212,168,67,0.15)',
                  border: '1px solid rgba(212,168,67,0.4)',
                  color: 'var(--gold)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
                onClick={() => onNavigate('admin')}
              >
                Admin ↗
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartOffcanvas show={showCart} onHide={() => setShowCart(false)} />
    </>
  )
}