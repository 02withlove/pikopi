import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  if (!visible) return null

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'
  const bg = type === 'error' ? '#c1121f' : type === 'info' ? '#0c5460' : 'var(--coffee-900)'

  return (
    <div className="toast-coffee" style={{ background: bg }}>
      <div className="toast-icon">{icon}</div>
      <span>{message}</span>
    </div>
  )
}