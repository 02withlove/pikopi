import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Coffee, ClipboardList, Clock, DollarSign, Users, RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    setLoading(true)
    const [prodRes, orderRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    const orders = orderRes.data || []
    const pending = orders.filter(o => o.status === 'pending').length
    const revenue = orders.filter(o => o.status === 'done').reduce((s, o) => s + Number(o.total_price), 0)
    setStats({ products: prodRes.count || 0, orders: orders.length, pending, revenue })
    setRecentOrders(orders.slice(0, 6))
    setLoading(false)
  }

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const formatDate = (d) =>
    new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  const statusClass = { pending: 'status-pending', processing: 'status-processing', done: 'status-done', cancelled: 'status-cancelled' }
  const statusLabel = { pending: 'Pending', processing: 'Diproses', done: 'Selesai', cancelled: 'Dibatalkan' }

  const statCards = [
    { icon: Coffee,        label: 'Total Produk',   value: stats.products,       bg: 'linear-gradient(135deg,#3d1a00,#6b3a1f)', accent: '#d4a843', desc: 'menu tersedia' },
    { icon: ClipboardList, label: 'Total Pesanan',  value: stats.orders,         bg: 'linear-gradient(135deg,#0c2340,#1a4a7a)', accent: '#60adf5', desc: 'semua waktu' },
    { icon: Clock,         label: 'Menunggu',       value: stats.pending,        bg: 'linear-gradient(135deg,#3d2800,#7a5200)', accent: '#f0c96a', desc: 'perlu diproses', alert: stats.pending > 0 },
    { icon: DollarSign,    label: 'Pendapatan',     value: formatRp(stats.revenue), bg: 'linear-gradient(135deg,#0a2d1e,#1a5c3a)', accent: '#4ade80', desc: 'pesanan selesai', small: true },
  ]

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-coffee" />
    </div>
  )

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--coffee-900)', borderRadius: 20, padding: '1.5rem 2rem',
        marginBottom: '1.5rem', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundImage: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(107,58,31,0.6) 0%, transparent 70%)',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display', fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>
            Selamat Datang, Admin!
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Coffee size={13} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button onClick={fetchStats} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '8px 14px',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="col-6 col-xl-3">
              <div style={{
                background: s.bg, borderRadius: 18, padding: '1.25rem', height: '100%',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                border: s.alert ? `1px solid ${s.accent}40` : '1px solid rgba(255,255,255,0.06)',
              }}>
                {/* Decorative circle bg */}
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 90, height: 90, borderRadius: '50%',
                  background: `${s.accent}15`,
                }}/>
                {/* Icon box */}
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${s.accent}20`, border: `1px solid ${s.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.9rem', color: s.accent,
                }}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                {/* Value */}
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 900,
                  fontSize: s.small ? '1.05rem' : '1.8rem',
                  color: '#fff', lineHeight: 1, marginBottom: 4,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: '0.68rem', color: `${s.accent}99`, marginTop: 2 }}>{s.desc}</div>
                {/* Alert pulse dot */}
                {s.alert && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 8, height: 8, borderRadius: '50%',
                    background: s.accent, boxShadow: `0 0 6px ${s.accent}`,
                  }}/>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--coffee-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coffee-700)',
            }}>
              <ClipboardList size={16} />
            </div>
            <div className="admin-table-title">Pesanan Terbaru</div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{recentOrders.length} terakhir</div>
        </div>
        <div className="table-responsive">
          <table className="table table-coffee">
            <thead>
              <tr>
                <th><span style={{ display:'flex', alignItems:'center', gap:5 }}><Users size={12}/>Pelanggan</span></th>
                <th>No. HP</th>
                <th>Total</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                    <Coffee size={28} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                    Belum ada pesanan
                  </td>
                </tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.customer_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.customer_phone || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>{formatRp(order.total_price)}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</td>
                  <td><span className={`status-badge ${statusClass[order.status]}`}>{statusLabel[order.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}