import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { ORDER_STATUSES, money, orderCode, formatDate } from '../../utils/helpers'

function Tracker({ order }) {
  const step = ORDER_STATUSES.indexOf(order.status)
  return (
    <div className="card tracker">
      <div className="tracker-head">
        <div>
          <h3>Order #{orderCode(order.id)}</h3>
          <p className="muted small">{formatDate(order.date)} · {money(order.total)}</p>
        </div>
        <span className="badge info">{order.status}</span>
      </div>
      <p className="muted small">{order.items.map((i) => `${i.title} × ${i.quantity}`).join(', ')}</p>
      <div className="steps">
        {ORDER_STATUSES.map((label, i) => (
          <div key={label} className={`step ${i <= step ? 'done' : ''} ${i === step ? 'current' : ''}`}>
            <span className="dot">{i < step ? '✓' : i + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TrackOrder() {
  const { orders, currentUser } = useApp()
  const mine = orders.filter((o) => o.userEmail === currentUser.email)
  const active = mine.filter((o) => o.status !== 'Delivered')

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Delivery status</span>
        <h1>📍 Track your order</h1>
      </div>

      {active.length === 0 ? (
        <div className="empty">
          <div className="big-emoji">🚚</div>
          <h3>No active orders</h3>
          <p className="muted">
            {mine.length ? 'All your orders have been delivered.' : 'Place an order and track it here.'}
          </p>
          <Link className="btn primary" to={mine.length ? '/orders' : '/browse'}>
            {mine.length ? 'View order history' : 'Browse recipes'}
          </Link>
        </div>
      ) : (
        <div className="stack">
          {active.map((o) => <Tracker key={o.id} order={o} />)}
        </div>
      )}
    </>
  )
}
