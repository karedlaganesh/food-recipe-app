import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const TITLES = [
  ['/admin/recipes/new', 'Add Recipe'],
  ['/admin/recipes', 'Manage Recipes'],
  ['/admin/pending', 'Pending Approvals'],
  ['/admin/users', 'Users'],
  ['/admin/orders', 'Orders'],
]

export default function AdminLayout() {
  const { currentUser, logout, pendingRecipes, theme, toggleTheme, toast } = useApp()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setOpen(false), [location.pathname])

  const title =
    location.pathname.includes('/edit') ? 'Edit Recipe' : TITLES.find(([p]) => location.pathname.startsWith(p))?.[1] || 'Dashboard'

  const handleLogout = () => {
    logout()
    toast('Logged out successfully.')
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to="/admin" className="brand">
          <span className="brand-icon">🍽️</span>
          <span>
            <strong>RecipeHub</strong>
            <small>Admin Panel</small>
          </span>
        </Link>

        <nav>
          <p className="nav-label">Main menu</p>
          <NavLink to="/admin" end>📊 Dashboard</NavLink>
          <NavLink to="/admin/recipes" end>🍴 Recipes</NavLink>
          <NavLink to="/admin/recipes/new">➕ Add Recipe</NavLink>
          <NavLink to="/admin/pending">
            ⏳ Pending
            {pendingRecipes.length > 0 && <span className="count">{pendingRecipes.length}</span>}
          </NavLink>
          <NavLink to="/admin/users">👥 Users</NavLink>
          <NavLink to="/admin/orders">📦 Orders</NavLink>

          <p className="nav-label">Other</p>
          <Link to="/">🌐 View Website</Link>
          <button onClick={handleLogout}>🚪 Logout</button>
        </nav>

        <div className="sidebar-user">
          <span className="avatar">👨‍💼</span>
          <div>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.email}</small>
          </div>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-btn menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <h1>{title}</h1>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
