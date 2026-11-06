export const CUISINES = ['Indian', 'Italian', 'Chinese', 'American', 'Mexican']
export const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free']
export const ORDER_STATUSES = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered']

export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export const orderCode = (id) => `RH${String(id).slice(-6)}`

export const formatDate = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function calcTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 40
  const tax = Math.round(subtotal * 0.05)
  return { subtotal, delivery, tax, total: subtotal + delivery + tax }
}

export const dietClass = (diet) =>
  ({ Vegetarian: 'veg', 'Non-Vegetarian': 'nonveg', Vegan: 'vegan', 'Gluten-Free': 'gf' }[diet] || 'veg')

export const statusClass = (status) =>
  ({
    approved: 'ok',
    pending: 'warn',
    'Order Placed': 'info',
    Preparing: 'warn',
    'Out for Delivery': 'purple',
    Delivered: 'ok',
  }[status] || 'info')
