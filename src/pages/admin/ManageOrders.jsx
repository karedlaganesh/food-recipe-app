import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { ORDER_STATUSES, formatDate, money, orderCode } from '../../utils/helpers'

export default function ManageOrders() {
  const { orders, updateOrderStatus, toast } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter(
      (o) =>
        (status === 'All' || o.status === status) &&
        (!q || orderCode(o.id).toLowerCase().includes(q) || o.userName.toLowerCase().includes(q) || o.userEmail.toLowerCase().includes(q)),
    )
  }, [orders, query, status])

  const handleChange = (order, value) => {
    updateOrderStatus(order.id, value)
    toast(`Order #${orderCode(order.id)} marked "${value}".`)
  }

  return (
    <>
      <div className="toolbar">
        <input className="grow" placeholder="Search by order ID, name or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All status</option>
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="empty card">
          <div className="big-emoji">📦</div>
          <h3>No orders</h3>
          <p className="muted">Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td><strong>#{orderCode(o.id)}</strong></td>
                  <td>{o.userName}<small className="muted block">{o.userEmail}</small></td>
                  <td className="items-cell">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(', ')}</td>
                  <td>{money(o.total)}</td>
                  <td>{formatDate(o.date)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <select value={o.status} onChange={(e) => handleChange(o, e.target.value)}>
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
