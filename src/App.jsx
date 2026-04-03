import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import AboutSection from './components/AboutSection'
import OrderSection from './components/OrderSection'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'
import Toast from './components/Toast'

export default function App() {
  const [page, setPage] = useState('landing')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <CartProvider>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {page === 'landing' ? (
        <>
          <Navbar onNavigate={setPage} />
          <HeroSection />
          <MenuSection onToast={showToast} />
          <AboutSection />
          <OrderSection onToast={showToast} />
          <Footer />
        </>
      ) : (
        <AdminPage onNavigate={setPage} onToast={showToast} />
      )}
    </CartProvider>
  )
}