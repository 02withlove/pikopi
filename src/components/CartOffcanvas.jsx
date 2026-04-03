import { useCart } from '../context/CartContext'

export default function CartOffcanvas({ show, onHide }) {
  const { cart, dispatch, total } = useCart()

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  const scrollToOrder = () => {
    onHide()
    setTimeout(() => {
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div
          onClick={onHide}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1040, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, height: '100vh',
          width: 'min(400px, 100vw)',
          background: '#faf8f8',
          zIndex: 1050,
          transform: show ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--coffee-900)',
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>
              🛒 Keranjang
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              {cart.items.length} item
            </div>
          </div>
          <button
            onClick={onHide}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none', color: '#fff',
              width: 36, height: 36,
              borderRadius: 8,
              cursor: 'pointer', fontSize: '1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
              <p style={{ fontFamily: 'Playfair Display', fontSize: '1.1rem' }}>Keranjang kosong</p>
              <p style={{ fontSize: '0.85rem' }}>Tambah menu favoritmu!</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.image_url || 'https://placehold.co/56x56?text=☕'}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/56x56?text=☕' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ color: 'var(--coffee-600)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {formatRp(item.price)}
                  </div>
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      item.qty === 1
                        ? dispatch({ type: 'REMOVE_ITEM', id: item.id })
                        : dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })
                    }
                  >−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--coffee-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'Playfair Display', fontWeight: 900, fontSize: '1.2rem', color: 'var(--coffee-700)' }}>
                {formatRp(total)}
              </span>
            </div>
            <button className="btn-order-submit" onClick={scrollToOrder}>
              Lanjut ke Pemesanan →
            </button>
            <button
              style={{
                width: '100%', marginTop: '0.75rem', background: 'none',
                border: '1px solid var(--coffee-200)', borderRadius: 12,
                padding: '10px', fontSize: '0.85rem', color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </>
  )
}