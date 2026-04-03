import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
        )
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = cart.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}