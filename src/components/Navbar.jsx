import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartOffcanvas from './CartOffcanvas'
import { ShoppingCart, Settings, ChevronDown, LayoutDashboard, ClipboardList, LogOut, Coffee } from 'lucide-react'

export default function Navbar({ onNavigate }) {
  const { count } = useCart()
  const { user, profile, isAdmin, logout } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const handleLogout = async () => { setShowUserMenu(false); await logout() }
  const initial = profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className="navbar-coffee">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">

            {/* Brand */}
            <a className="navbar-brand-text text-decoration-none d-flex align-items-center gap-2"
              onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
              <Coffee size={22} color="var(--gold)" strokeWidth={1.8} />
              KOPI.KO
            </a>

            {/* Nav Links desktop */}
            <div className="d-none d-md-flex align-items-center gap-1">
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('menu')}>Menu</button>
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('about')}>Tentang Kami</button>
              <button className="nav-link-custom btn btn-link text-decoration-none" onClick={() => scrollTo('order')}>Pesan</button>
            </div>

            {/* Right */}
            <div className="d-flex align-items-center gap-2">

              {/* Cart */}
              <button className="btn btn-link text-decoration-none position-relative p-2"
                onClick={() => setShowCart(true)} style={{ color: 'rgba(255,255,255,0.8)' }}>
                <ShoppingCart size={20} strokeWidth={1.8} />
                {count > 0 && (
                  <span className="cart-badge position-absolute" style={{ top: 0, right: -2 }}>{count}</span>
                )}
              </button>

              {/* Admin button */}
              {isAdmin && (
                <button onClick={() => onNavigate('admin')} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(212,168,67,0.15)',
                  border: '1px solid rgba(212,168,67,0.4)',
                  color: 'var(--gold)', borderRadius: 8,
                  padding: '6px 14px', fontSize: '0.8rem',
                  fontWeight: 700, cursor: 'pointer',
                }}>
                  <Settings size={14} strokeWidth={2} />
                  Admin
                </button>
              )}

              {/* Auth */}
              {!user ? (
                <button onClick={() => onNavigate('auth')} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--gold)', border: 'none',
                  color: 'var(--coffee-900)', borderRadius: 8,
                  padding: '7px 16px', fontSize: '0.82rem',
                  fontWeight: 700, cursor: 'pointer',
                }}>
                  Masuk
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowUserMenu(v => !v)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 100, padding: '5px 10px 5px 5px',
                    cursor: 'pointer', color: '#fff',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--gold)', color: 'var(--coffee-900)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    }}>
                      {initial}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile?.name || user.email}
                    </span>
                    <ChevronDown size={13} strokeWidth={2.5} style={{ opacity: 0.6, flexShrink: 0 }} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: '#fff', borderRadius: 14, minWidth: 210,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        zIndex: 1000, overflow: 'hidden',
                        border: '1px solid var(--coffee-100)',
                      }}>
                        {/* User info */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--coffee-100)', background: 'var(--cream)' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--coffee-900)' }}>
                            {profile?.name || 'Pengguna'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</div>
                          {isAdmin && (
                            <div style={{
                              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)',
                              color: 'var(--coffee-600)', padding: '2px 8px',
                              borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
                            }}>
                              <Settings size={10} /> Admin
                            </div>
                          )}
                        </div>

                        {isAdmin && (
                          <button onClick={() => { setShowUserMenu(false); onNavigate('admin') }} style={dropdownItemStyle}>
                            <LayoutDashboard size={15} color="var(--coffee-600)" /> Dashboard Admin
                          </button>
                        )}
                        <button onClick={() => { setShowUserMenu(false); scrollTo('order') }} style={dropdownItemStyle}>
                          <ClipboardList size={15} color="var(--coffee-600)" /> Buat Pesanan
                        </button>
                        <div style={{ borderTop: '1px solid var(--coffee-100)' }}>
                          <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#c1121f' }}>
                            <LogOut size={15} color="#c1121f" /> Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartOffcanvas show={showCart} onHide={() => setShowCart(false)} />
    </>
  )
}

const dropdownItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '10px 16px',
  background: 'none', border: 'none',
  textAlign: 'left', cursor: 'pointer',
  fontSize: '0.85rem', fontWeight: 500,
  color: 'var(--coffee-800)', fontFamily: 'DM Sans',
}