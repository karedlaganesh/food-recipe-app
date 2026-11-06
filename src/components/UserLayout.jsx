import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function UserLayout() {
  const { currentUser, logout, cartCount, theme, toggleTheme, toast } = useApp()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const isUser = currentUser?.role === 'user'
  const isAdmin = currentUser?.role === 'admin'

  const handleLogout = () => {
    logout()
    toast('You have been logged out.')
    navigate('/')
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">🍽️</span>
            <span>
              <strong>RecipeHub</strong>
              <small>Fresh • Fast • Delicious</small>
            </span>
          </Link>

          <nav className={`main-nav ${open ? 'open' : ''}`}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/browse">Browse</NavLink>
            {isUser && <NavLink to="/track">Track Order</NavLink>}
            {isUser && <NavLink to="/orders">My Orders</NavLink>}
            {isUser && <NavLink to="/submit">Submit Recipe</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin Panel</NavLink>}
            {currentUser && <NavLink to="/profile">Profile</NavLink>}
            <div className="nav-auth-mobile">
              {currentUser ? (
                <button className="btn ghost" onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link className="btn ghost" to="/login">Login</Link>
                  <Link className="btn primary" to="/signup">Sign up</Link>
                </>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isUser && (
              <Link to="/cart" className="icon-btn cart-link" aria-label="Cart">
                🛒{cartCount > 0 && <span className="count">{cartCount}</span>}
              </Link>
            )}
            <div className="auth-desktop">
              {currentUser ? (
                <button className="btn ghost sm" onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link className="btn ghost sm" to="/login">Login</Link>
                  <Link className="btn primary sm" to="/signup">Sign up</Link>
                </>
              )}
            </div>
            <button className="icon-btn menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main className="container page">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>🍽️ RecipeHub</strong>
            <p className="muted small">Fresh food. Delicious recipes. Fast delivery.</p>
          </div>
          <p className="muted small">© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
