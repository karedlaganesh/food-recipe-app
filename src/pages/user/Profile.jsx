import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/helpers'

export default function Profile() {
  const { currentUser, orders, recipes, updateProfile, logout, toast } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState(currentUser.name)

  const orderCount = orders.filter((o) => o.userEmail === currentUser.email).length
  const submitted = recipes.filter((r) => r.submittedByEmail === currentUser.email).length

  const handleSave = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return toast('Please enter a valid name.', 'error')
    updateProfile(name)
    toast('Profile updated.')
  }

  const handleLogout = () => {
    logout()
    toast('You have been logged out.')
    navigate('/')
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Account</span>
        <h1>👤 My profile</h1>
      </div>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="avatar big">{currentUser.name.charAt(0).toUpperCase()}</div>
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.email}</p>
          <span className="badge info">{currentUser.role === 'admin' ? 'Administrator' : 'Member'}</span>
          {currentUser.createdAt && <p className="small muted">Joined {formatDate(currentUser.createdAt)}</p>}
          {currentUser.role === 'user' && (
            <div className="mini-stats">
              <div><strong>{orderCount}</strong><small>Orders</small></div>
              <div><strong>{submitted}</strong><small>Recipes</small></div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Edit details</h3>
          <form className="stack" onSubmit={handleSave}>
            <div className="field">
              <label>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Email (cannot be changed)</label>
              <input value={currentUser.email} disabled />
            </div>
            <div className="form-actions">
              <button type="button" className="btn danger-ghost" onClick={handleLogout}>Logout</button>
              <button type="submit" className="btn primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
