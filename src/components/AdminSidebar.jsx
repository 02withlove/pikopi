export default function AdminSidebar({ active, setActive, pendingCount, onNavigate, sidebarOpen }) {
  const navItems = [
    {
      section: 'Overview',
      items: [
        { key: 'dashboard', icon: '📊', label: 'Dashboard' },
      ],
    },
    {
      section: 'Management',
      items: [
        { key: 'products', icon: '☕', label: 'Produk' },
        { key: 'orders', icon: '📋', label: 'Pesanan', badge: pendingCount },
      ],
    },
  ]

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">☕ KOPI.KO</div>
        <div className="sidebar-logo-sub">Admin Dashboard</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map((item) => (
              <div
                key={item.key}
                className={`sidebar-item ${active === item.key ? 'active' : ''}`}
                onClick={() => setActive(item.key)}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            borderRadius: 10, padding: '10px',
            fontSize: '0.85rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          ← Kembali ke Website
        </button>
      </div>
    </aside>
  )
}