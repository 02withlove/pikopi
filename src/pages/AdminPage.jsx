import { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'
import { supabase } from '../lib/supabase'

export default function AdminPage({ onNavigate, onToast }) {
  const [active, setActive] = useState('dashboard')
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchPending()
    // Real-time subscription
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

  const PAGES = {
    dashboard: <AdminDashboard />,
    products: <AdminProducts onToast={onToast} />,
    orders: <AdminOrders onToast={onToast} />,
  }

  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    products: 'Manajemen Produk',
    orders: 'Manajemen Pesanan',
  }

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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none',
          }}
          className="d-md-none"
        />
      )}

      {/* Main */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="d-md-none btn btn-link p-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ fontSize: '1.4rem', color: 'var(--coffee-900)' }}
            >
              ☰
            </button>
            <div className="admin-topbar-title">{PAGE_TITLES[active]}</div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {pendingCount > 0 && (
              <div
                onClick={() => setActive('orders')}
                style={{
                  background: '#fff3cd', color: '#856404',
                  padding: '6px 14px', borderRadius: 100,
                  fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                ⏳ {pendingCount} pesanan menunggu
              </div>
            )}
            <div
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--coffee-900)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {PAGES[active]}
        </div>
      </div>
    </div>
  )
}