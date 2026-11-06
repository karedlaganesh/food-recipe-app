import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-art">
        <Link to="/" className="brand light">
          <span className="brand-icon">🍽️</span>
          <span><strong>RecipeHub</strong><small>Fresh • Fast • Delicious</small></span>
        </Link>
        <div>
          <h2>Cook it. Order it. Love it.</h2>
          <p>Discover recipes from every cuisine and get your favourite dishes delivered.</p>
        </div>
        <div className="auth-emoji">🍕 🍔 🍰 🍜</div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </div>
    </div>
  )
}
