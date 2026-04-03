import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

export default function OrderSection({ onToast }) {
  const { cart, dispatch, total } = useCart()
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_note: '' })
  const [loading, setLoading] = useState(false)

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.items.length === 0) {
      onToast('Keranjang masih kosong!', 'error')
      return
    }

    setLoading(true)
    try {
      // Insert order
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{ ...form, total_price: total, status: 'pending' }])
        .select()
        .single()

      if (error) throw error

      // Insert order items
      const items = cart.items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        product_price: i.price,
        quantity: i.qty,
      }))

      await supabase.from('order_items').insert(items)

      dispatch({ type: 'CLEAR_CART' })
      setForm({ customer_name: '', customer_phone: '', customer_note: '' })
      onToast('Pesanan berhasil! Segera kami proses ☕', 'success')
    } catch (err) {
      onToast('Gagal mengirim pesanan. Coba lagi.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="order" className="order-section py-5">
      <div className="container py-4">
        <div className="text-center mb-5">
          <div className="section-tag" style={{ justifyContent: 'center' }}>Pemesanan</div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', fontWeight: 900 }}>
            Pesan Sekarang,<br />
            <span style={{ color: 'var(--coffee-600)', fontStyle: 'italic' }}>Nikmati Segera</span>
          </h2>
        </div>

        <div className="row justify-content-center g-4">
          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="order-card h-100">
              <h5 style={{ fontFamily: 'Playfair Display', fontWeight: 700, marginBottom: '1.5rem' }}>
                🛒 Ringkasan Pesanan
              </h5>

              {cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☕</div>
                  <p style={{ fontSize: '0.9rem' }}>Belum ada item. Tambah dari menu!</p>
                  <button
                    style={{
                      background: 'var(--coffee-900)', color: 'var(--gold)',
                      border: 'none', padding: '10px 24px', borderRadius: 10,
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Lihat Menu →
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 0', borderBottom: '1px solid var(--coffee-100)',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {item.qty}x {formatRp(item.price)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>
                          {formatRp(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginTop: '1rem', paddingTop: '1rem',
                      borderTop: '2px solid var(--coffee-200)',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontSize: '1.3rem', color: 'var(--coffee-700)' }}>
                      {formatRp(total)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-5">
            <div className="order-card">
              <h5 style={{ fontFamily: 'Playfair Display', fontWeight: 700, marginBottom: '1.5rem' }}>
                📋 Detail Pemesan
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-coffee">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="customer_name"
                    className="form-control-coffee form-control"
                    placeholder="Masukkan nama kamu"
                    value={form.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-coffee">Nomor HP</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    className="form-control-coffee form-control"
                    placeholder="08xxxxxxxxxx"
                    value={form.customer_phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label-coffee">Catatan Khusus</label>
                  <textarea
                    name="customer_note"
                    className="form-control-coffee form-control"
                    rows={3}
                    placeholder="Less sugar, oat milk, extra shot, dll..."
                    value={form.customer_note}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-order-submit"
                  disabled={loading || cart.items.length === 0}
                >
                  {loading ? '⏳ Mengirim...' : '✓ Kirim Pesanan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}