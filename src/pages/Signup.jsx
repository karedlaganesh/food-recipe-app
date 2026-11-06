import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function Signup() {
  const { signup, currentUser, toast } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/'} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Please enter your full name.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    const result = signup(form)
    if (!result.ok) return setError(result.error)

    toast('Account created! Please log in.')
    navigate('/login', { state: { email: result.email } })
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Join RecipeHub today"
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label>Full name</label>
          <input value={form.name} onChange={set('name')} placeholder="Your full name" required autoFocus />
        </div>
        <div className="field">
          <label>Email address</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" required />
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat your password" required />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn primary block" type="submit">Create account</button>
      </form>
    </AuthShell>
  )
}
