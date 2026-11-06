import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatDate, money, orderCode } from '../../utils/helpers'

export default function OrderHistory() {
  const { orders, currentUser } = useApp()
  const mine = orders.filter((o) => o.userEmail === currentUser.email)

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Your orders</span>
        <h1>📋 Order history</h1>
      </div>

      {mine.length === 0 ? (
        <div className="empty">
          <div className="big-emoji">📋</div>
          <h3>No orders yet</h3>
          <p className="muted">Your orders will appear here.</p>
          <Link className="btn primary" to="/browse">Browse recipes</Link>
        </div>
      ) : (
        <div className="stack">
          {mine.map((o) => (
            <div className="card" key={o.id}>
              <div className="tracker-head">
                <div>
                  <h3>Order #{orderCode(o.id)}</h3>
                  <p className="muted small">{formatDate(o.date)}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <ul className="order-lines">
                {o.items.map((i) => (
                  <li key={i.id}><span>{i.title} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></li>
                ))}
              </ul>
              <div className="row total"><span>Total paid</span><span>{money(o.total)}</span></div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
