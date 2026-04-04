import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AdminPage({ onNavigate, onToast }) {
  const { user, profile, isAdmin, loading: authLoading, logout } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      onNavigate('landing')
    }
  }, [user, isAdmin, authLoading])

  useEffect(() => {
    fetchPending()
    const sub = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchPending()
      })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [])

  const fetchPending = async () => {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    setPendingCount(count || 0)
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--coffee-900)' }}>
      <div className="spinner-coffee" />
    </div>
  )

  if (!isAdmin) return null

  const PAGES = {
    dashboard: <AdminDashboard />,
    products: <AdminProducts onToast={onToast} />,
    orders: <AdminOrders onToast={onToast} />,
  }

  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    products: 'Produk',
    orders: 'Pesanan',
  }

  const initial = profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <AdminSidebar
        active={active}
        setActive={(page) => { setActive(page); setSidebarOpen(false) }}
        pendingCount={pendingCount}
        onNavigate={onNavigate}
        sidebarOpen={sidebarOpen}
      />

      {/* Overlay backdrop mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 199,
          }}
        />
      )}

      {/* Main content */}
      <div className="admin-main">

        {/* ===== TOP BAR ===== */}
        <div className="admin-topbar">

          {/* Kiri: hamburger + judul */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* Hamburger — hanya mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                background: 'var(--coffee-100)',
                border: 'none',
                borderRadius: 8,
                width: 36, height: 36,
                fontSize: '1.1rem',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              className="hamburger-btn"
            >
              ☰
            </button>
            <div className="admin-topbar-title">{PAGE_TITLES[active]}</div>
          </div>

          {/* Kanan: pending badge + avatar + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* Pending badge — sembunyikan teks di mobile kecil */}
            {pendingCount > 0 && (
              <div
                onClick={() => setActive('orders')}
                style={{
                  background: '#fff3cd', color: '#856404',
                  padding: '5px 10px', borderRadius: 100,
                  fontSize: '0.72rem', fontWeight: 700,
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 5,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>⏳</span>
                <span className="d-none d-sm-inline">{pendingCount} menunggu</span>
                <span className="d-sm-none">{pendingCount}</span>
              </div>
            )}

            {/* Avatar + nama (nama disembunyikan di mobile) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'var(--coffee-900)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', fontWeight: 800, fontSize: '0.85rem',
                flexShrink: 0,
              }}>
                {initial}
              </div>
              <div className="d-none d-md-block" style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{profile?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>

            {/* Logout — ikon saja di mobile */}
            <button
              onClick={async () => { await logout(); onNavigate('landing') }}
              title="Keluar"
              style={{
                background: '#f8d7da', color: '#58151c',
                border: 'none', borderRadius: 8,
                padding: '7px 10px',
                fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span>🚪</span>
              <span className="d-none d-sm-inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* ===== PAGE CONTENT ===== */}
        <div className="admin-content">
          {PAGES[active]}
        </div>
      </div>

      {/* Inline style untuk hamburger visible di mobile */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}