import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatDate, money, orderCode } from '../../utils/helpers'

export default function Dashboard() {
  const { recipes, users, orders, pendingRecipes } = useApp()
  const customers = users.filter((u) => u.role === 'user')
  const revenue = orders.reduce((s, o) => s + o.total, 0)

  const stats = [
    { icon: '🍴', label: 'Total recipes', value: recipes.length, tone: 'orange' },
    { icon: '👥', label: 'Registered users', value: customers.length, tone: 'blue' },
    { icon: '⏳', label: 'Pending approvals', value: pendingRecipes.length, tone: 'yellow' },
    { icon: '📦', label: 'Total orders', value: orders.length, tone: 'green' },
  ]

  return (
    <>
      <div className="welcome">
        <div>
          <span className="eyebrow light">Administration</span>
          <h2>Welcome to RecipeHub 👋</h2>
          <p>Manage recipes, users, orders and approvals from one place.</p>
        </div>
        <div className="welcome-revenue">
          <small>Total revenue</small>
          <strong>{money(revenue)}</strong>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat ${s.tone}`}>
            <span className="stat-icon">{s.icon}</span>
            <div><strong>{s.value}</strong><small>{s.label}</small></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Quick actions</h3>
        <div className="quick-actions">
          <Link className="btn primary" to="/admin/recipes/new">➕ Add recipe</Link>
          <Link className="btn ghost" to="/admin/recipes">🍴 Manage recipes</Link>
          <Link className="btn ghost" to="/admin/pending">⏳ Review pending</Link>
          <Link className="btn ghost" to="/admin/users">👥 View users</Link>
          <Link className="btn ghost" to="/admin/orders">📦 View orders</Link>
        </div>
      </div>

      <div className="card">
        <div className="section-head tight">
          <h3>Recent orders</h3>
          <Link className="btn ghost sm" to="/admin/orders">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <ul className="plain-list">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <div>
                  <strong>#{orderCode(o.id)}</strong>
                  <small className="muted block">{o.userName} · {formatDate(o.date)}</small>
                </div>
                <div className="right">
                  <strong>{money(o.total)}</strong>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
