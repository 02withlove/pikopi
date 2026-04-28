import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { IconCoffee, IconLeaf, IconUtensils, IconGrid, IconPlus } from './Icons'

const categories = [
  { key: 'all',    label: 'Semua',  Icon: IconGrid },
  { key: 'coffee', label: 'Coffee', Icon: IconCoffee },
  { key: 'matcha', label: 'Matcha', Icon: IconLeaf },
  { key: 'food',   label: 'Food',   Icon: IconUtensils },
]

export default function MenuSection({ onToast }) {
  const [products, setProducts] = useState([])
  const [active, setActive] = useState('all')
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').eq('is_available', true).order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const filtered = active === 'all' ? products : products.filter(p => p.category === active)
  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
  const handleAdd = (product) => { dispatch({ type: 'ADD_ITEM', product }); onToast(`${product.name} ditambahkan!`, 'success') }

  const getCatIcon = (cat) => {
    if (cat === 'coffee') return <IconCoffee size={10} />
    if (cat === 'matcha') return <IconLeaf size={10} />
    return <IconUtensils size={10} />
  }

  return (
    <section id="menu" className="menu-section py-5">
      <div className="container py-4">
        <div className="row justify-content-between align-items-end mb-4">
          <div className="col-md-6">
            <div className="section-tag">Menu Kami</div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1 }}>
              Pilihan yang Selalu<br /><span style={{ color: 'var(--coffee-600)', fontStyle: 'italic' }}>Bikin Rindu</span>
            </h2>
          </div>
          <div className="col-md-auto mt-3 mt-md-0">
            <div className="d-flex gap-2 flex-wrap">
              {categories.map(({ key, label, Icon }) => (
                <button key={key} className={`menu-filter-btn ${active === key ? 'active' : ''}`}
                  onClick={() => setActive(key)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={14} strokeWidth={2} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center py-5"><div className="spinner-coffee" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
            <IconCoffee size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>Belum ada produk di kategori ini</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((product, i) => (
              <div key={product.id} className="col-sm-6 col-lg-4" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="product-card fade-in-up">
                  <div className="product-img-wrap">
                    <img src={product.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'} alt={product.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' }} />
                    <span className="product-category-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {getCatIcon(product.category)} {product.category}
                    </span>
                  </div>
                  <div className="product-body">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description || 'Menu pilihan terbaik kami'}</p>
                    <div className="product-footer">
                      <span className="product-price">{formatRp(product.price)}</span>
                      <button className="btn-add-cart" onClick={() => handleAdd(product)}>
                        <IconPlus size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}