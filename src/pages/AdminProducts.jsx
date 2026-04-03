import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['coffee', 'matcha', 'food', 'drink', 'snack']

const emptyForm = {
  name: '', description: '', price: '', category: 'coffee',
  image_url: '', is_available: true,
}

export default function AdminProducts({ onToast }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const fileRef = useRef()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setImagePreview('')
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || 'coffee',
      image_url: product.image_url || '',
      is_available: product.is_available,
    })
    setImagePreview(product.image_url || '')
    setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('products').upload(fileName, file, { upsert: true })

    if (error) {
      onToast('Gagal upload gambar: ' + error.message, 'error')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)
    setForm(f => ({ ...f, image_url: urlData.publicUrl }))
    setImagePreview(urlData.publicUrl)
    setUploading(false)
    onToast('Gambar berhasil diupload!', 'success')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price) }

    let error
    if (editProduct) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editProduct.id))
    } else {
      ({ error } = await supabase.from('products').insert([payload]))
    }

    if (error) { onToast('Gagal menyimpan: ' + error.message, 'error'); return }

    onToast(editProduct ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!', 'success')
    setShowModal(false)
    fetchProducts()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { onToast('Gagal menghapus', 'error'); return }
    onToast('Produk dihapus', 'success')
    setDeleteConfirm(null)
    fetchProducts()
  }

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  return (
    <div>
      {/* Header */}
      <div className="admin-table-wrap mb-0">
        <div className="admin-table-header">
          <div>
            <div className="admin-table-title">☕ Manajemen Produk</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {products.length} produk terdaftar
            </div>
          </div>
          <button
            onClick={openAdd}
            style={{
              background: 'var(--coffee-900)', color: 'var(--gold)',
              border: 'none', padding: '10px 20px', borderRadius: 12,
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            + Tambah Produk
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-coffee">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="spinner-coffee mx-auto" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem' }}>☕</div>
                    Belum ada produk. Tambah yang pertama!
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image_url || 'https://placehold.co/48x48?text=☕'}
                      alt={p.name}
                      className="product-thumb"
                      onError={e => { e.target.src = 'https://placehold.co/48x48?text=☕' }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.description || '-'}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: 'var(--coffee-100)', color: 'var(--coffee-700)',
                      padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--coffee-700)' }}>{formatRp(p.price)}</td>
                  <td>
                    <span className={`status-badge ${p.is_available ? 'status-done' : 'status-cancelled'}`}>
                      {p.is_available ? 'Tersedia' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn-icon"
                        style={{ background: '#e8f4f8', color: '#0c5460' }}
                        onClick={() => openEdit(p)}
                        title="Edit"
                      >✏️</button>
                      <button
                        className="btn-icon"
                        style={{ background: '#f8d7da', color: '#58151c' }}
                        onClick={() => setDeleteConfirm(p)}
                        title="Hapus"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div
            onClick={() => setShowModal(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <div
            style={{
              position: 'relative', background: '#fff', borderRadius: 20,
              width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Modal Header */}
            <div style={{ background: 'var(--coffee-900)', padding: '1.25rem 1.5rem', borderRadius: '20px 20px 0 0' }}>
              <div style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)' }}>
                {editProduct ? '✏️ Edit Produk' : '+ Tambah Produk Baru'}
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label-coffee">Foto Produk</label>
                <div
                  className="img-upload-area"
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ maxHeight: 160, borderRadius: 12, objectFit: 'cover', width: '100%' }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {uploading ? '⏳ Mengupload...' : 'Klik untuk upload foto'}
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Atau masukkan URL gambar:
                </div>
                <input
                  type="url"
                  name="image_url"
                  className="form-control-coffee form-control mt-1"
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => { handleChange(e); setImagePreview(e.target.value) }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label-coffee">Nama Produk *</label>
                <input
                  type="text" name="name" required
                  className="form-control-coffee form-control"
                  placeholder="Contoh: Caramel Latte"
                  value={form.name} onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label-coffee">Deskripsi</label>
                <textarea
                  name="description" rows={2}
                  className="form-control-coffee form-control"
                  placeholder="Deskripsi singkat produk"
                  value={form.description} onChange={handleChange}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label-coffee">Harga (Rp) *</label>
                  <input
                    type="number" name="price" required min={0}
                    className="form-control-coffee form-control"
                    placeholder="35000"
                    value={form.price} onChange={handleChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label-coffee">Kategori</label>
                  <select name="category" className="form-control-coffee form-control form-select" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox" name="is_available" id="is_available"
                    className="form-check-input"
                    checked={form.is_available} onChange={handleChange}
                  />
                  <label htmlFor="is_available" className="form-check-label" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Produk tersedia untuk dijual
                  </label>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  style={{
                    flex: 1, background: 'var(--coffee-900)', color: 'var(--gold)',
                    border: 'none', padding: '12px', borderRadius: 12,
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  }}
                >
                  {editProduct ? '✓ Simpan Perubahan' : '+ Tambahkan Produk'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#f0ece8', border: 'none', padding: '12px 20px',
                    borderRadius: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)',
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div
            onClick={() => setDeleteConfirm(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
          />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: 20, padding: '2rem',
            maxWidth: 380, width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h5 style={{ fontFamily: 'Playfair Display', fontWeight: 700, marginBottom: '0.5rem' }}>
              Hapus Produk?
            </h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Produk <strong>{deleteConfirm.name}</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="d-flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                style={{
                  flex: 1, background: 'var(--danger)', color: '#fff',
                  border: 'none', padding: '11px', borderRadius: 10,
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, background: '#f0ece8', border: 'none', padding: '11px',
                  borderRadius: 10, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}