import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_OPTIONS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: '⏳ Pending' },
  { key: 'processing', label: '🔄 Diproses' },
  { key: 'done', label: '✅ Selesai' },
  { key: 'cancelled', label: '❌ Dibatalkan' },
]

const STATUS_CLASS = {
  pending: 'status-pending',
  processing: 'status-processing',
  done: 'status-done',
  cancelled: 'status-cancelled',
}

const STATUS_LABEL = {
  pending: 'Pending',
  processing: 'Diproses',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}

export default function AdminOrders({ onToast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [detailOrder, setDetailOrder] = useState(null)
  const [detailItems, setDetailItems] = useState([])

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const openDetail = async (order) => {
    setDetailOrder(order)
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
    setDetailItems(data || [])
  }

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) { onToast('Gagal update status', 'error'); return }
    onToast(`Status diupdate ke "${STATUS_LABEL[status]}"`, 'success')
    fetchOrders()
    if (detailOrder?.id === orderId) {
      setDetailOrder(prev => ({ ...prev, status }))
    }
  }

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const formatDate = (d) =>
    new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const counts = STATUS_OPTIONS.slice(1).reduce((acc, s) => {
    acc[s.key] = orders.filter(o => o.status === s.key).length
    return acc
  }, {})

  return (
    <div>
      {/* Status Filter Tabs */}
      <div
        style={{
          background: '#fff', borderRadius: 16, padding: '1rem 1.25rem',
          marginBottom: '1.5rem', border: '1px solid #ede9e5',
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
        }}
      >
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            style={{
              padding: '8px 16px', borderRadius: 100, border: 'none',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s',
              background: filter === s.key ? 'var(--coffee-900)' : 'var(--coffee-100)',
              color: filter === s.key ? 'var(--gold)' : 'var(--coffee-600)',
            }}
          >
            {s.label}
            {s.key !== 'all' && counts[s.key] > 0 && (
              <span
                style={{
                  marginLeft: 6, background: s.key === 'pending' ? 'var(--danger)' : 'rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: 100, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 800,
                }}
              >
                {counts[s.key]}
              </span>
            )}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {filtered.length} pesanan
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div className="admin-table-title">📋 Daftar Pesanan</div>
        </div>
        <div className="table-responsive">
          <table className="table table-coffee">
            <thead>
              <tr>
                <th>#</th>
                <th>Pelanggan</th>
                <th>No. HP</th>
                <th>Total</th>
                <th>Waktu</th>
                <th>Status</th>
                <th>Aksi Cepat</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5">
                    <div className="spinner-coffee mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem' }}>📋</div>
                    Tidak ada pesanan
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{order.customer_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.customer_phone || '-'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>{formatRp(order.total_price)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_CLASS[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(order.id, 'processing')}
                          style={{
                            background: '#cff4fc', color: '#0c5460', border: 'none',
                            padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem',
                            fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                          title="Kerjakan"
                        >
                          🔄 Kerjakan
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateStatus(order.id, 'done')}
                          style={{
                            background: '#d1e7dd', color: '#0a3622', border: 'none',
                            padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem',
                            fontWeight: 700, cursor: 'pointer',
                          }}
                          title="Selesai"
                        >
                          ✅ Selesai
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          style={{
                            background: '#f8d7da', color: '#58151c', border: 'none',
                            padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem',
                            fontWeight: 700, cursor: 'pointer',
                          }}
                          title="Batalkan"
                        >
                          ✕
                        </button>
                      )}
                      {(order.status === 'done' || order.status === 'cancelled') && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      style={{ background: 'var(--coffee-100)', color: 'var(--coffee-700)' }}
                      onClick={() => openDetail(order)}
                      title="Lihat detail"
                    >
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detailOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div
            onClick={() => setDetailOrder(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <div
            style={{
              position: 'relative', background: '#fff', borderRadius: 20,
              width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ background: 'var(--coffee-900)', padding: '1.25rem 1.5rem', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)' }}>
                📋 Detail Pesanan
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: 8, cursor: 'pointer' }}
              >✕</button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Customer Info */}
              <div style={{ background: 'var(--cream)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                  {[
                    { label: 'Nama', value: detailOrder.customer_name },
                    { label: 'HP', value: detailOrder.customer_phone || '-' },
                    { label: 'Waktu', value: formatDate(detailOrder.created_at) },
                    { label: 'Status', value: STATUS_LABEL[detailOrder.status] },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontWeight: 600 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
                {detailOrder.customer_note && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--coffee-200)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 2 }}>Catatan</div>
                    <div style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>"{detailOrder.customer_note}"</div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Item Pesanan</div>
              {detailItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid var(--coffee-100)', fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {item.quantity}x {formatRp(item.product_price)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>
                    {formatRp(item.product_price * item.quantity)}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--coffee-200)' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontSize: '1.3rem', color: 'var(--coffee-700)' }}>
                  {formatRp(detailOrder.total_price)}
                </span>
              </div>

              {/* Status Actions */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                {detailOrder.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(detailOrder.id, 'processing')}
                    style={{
                      flex: 1, background: '#cff4fc', color: '#0c5460', border: 'none',
                      padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    🔄 Mulai Kerjakan
                  </button>
                )}
                {detailOrder.status === 'processing' && (
                  <button
                    onClick={() => updateStatus(detailOrder.id, 'done')}
                    style={{
                      flex: 1, background: '#d1e7dd', color: '#0a3622', border: 'none',
                      padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    ✅ Tandai Selesai
                  </button>
                )}
                {(detailOrder.status === 'pending' || detailOrder.status === 'processing') && (
                  <button
                    onClick={() => updateStatus(detailOrder.id, 'cancelled')}
                    style={{
                      flex: 1, background: '#f8d7da', color: '#58151c', border: 'none',
                      padding: '12px', borderRadius: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    ✕ Batalkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}