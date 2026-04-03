import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [prodRes, orderRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])

    const orders = orderRes.data || []
    const pending = orders.filter(o => o.status === 'pending').length
    const revenue = orders.filter(o => o.status === 'done').reduce((s, o) => s + Number(o.total_price), 0)

    setStats({
      products: prodRes.count || 0,
      orders: orders.length,
      pending,
      revenue,
    })
    setRecentOrders(orders.slice(0, 5))
    setLoading(false)
  }

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const formatDate = (d) =>
    new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  const statusClass = { pending: 'status-pending', processing: 'status-processing', done: 'status-done', cancelled: 'status-cancelled' }
  const statusLabel = { pending: 'Pending', processing: 'Diproses', done: 'Selesai', cancelled: 'Dibatalkan' }

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-coffee" />
    </div>
  )

  return (
    <div>
      {/* Welcome */}
      <div
        style={{
          background: 'var(--coffee-900)', borderRadius: 20, padding: '1.5rem 2rem',
          marginBottom: '1.5rem', color: '#fff',
          backgroundImage: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(107,58,31,0.5) 0%, transparent 70%)',
        }}
      >
        <div style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>
          Selamat Datang, Admin! ☕
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: 4 }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { icon: '☕', label: 'Total Produk', value: stats.products, bg: '#fef3e2', color: '#8b5e3c' },
          { icon: '📋', label: 'Total Pesanan', value: stats.orders, bg: '#e8f4f8', color: '#0c5460' },
          { icon: '⏳', label: 'Pesanan Pending', value: stats.pending, bg: '#fff3cd', color: '#856404' },
          { icon: '💰', label: 'Total Pendapatan', value: formatRp(stats.revenue), bg: '#d1e7dd', color: '#0a3622' },
        ].map((s) => (
          <div key={s.label} className="col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div className="admin-table-title">📋 Pesanan Terbaru</div>
        </div>
        <div className="table-responsive">
          <table className="table table-coffee">
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>No. HP</th>
                <th>Total</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                    Belum ada pesanan
                  </td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.customer_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.customer_phone || '-'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>{formatRp(order.total_price)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</td>
                  <td>
                    <span className={`status-badge ${statusClass[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}