import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import AboutSection from './components/AboutSection'
import OrderSection from './components/OrderSection'
import Footer from './components/Footer'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'

import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const [page, setPage] = useState('landing')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <AuthProvider>
      <CartProvider>
        {toast && (
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Banner install PWA — muncul otomatis kalau belum install */}
        <PWAInstallPrompt />

        {page === 'landing' && (
          <>
            <Navbar onNavigate={setPage} />
            <HeroSection />
            <MenuSection onToast={showToast} />
            <AboutSection />
            <OrderSection onToast={showToast} />
            <Footer />
          </>
        )}

        {page === 'auth' && (
          <AuthPage onNavigate={setPage} />
        )}

        {page === 'admin' && (
          <AdminPage onNavigate={setPage} onToast={showToast} />
        )}
      </CartProvider>
    </AuthProvider>
  )
}