import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function Login() {
  const { login, currentUser, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/'} replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast(`Welcome back, ${result.user.name}!`)
    if (result.user.role === 'admin') navigate('/admin', { replace: true })
    else navigate(location.state?.from || '/', { replace: true })
  }

  const fillAdmin = () => {
    setEmail('admin@recipehub.com')
    setPassword('admin123')
    setError('')
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to RecipeHub"
      footer={<>New here? <Link to="/signup">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn primary block" type="submit">Login</button>
      </form>

      <div className="demo-box">
        <strong>Admin demo account</strong>
        <p className="small">admin@recipehub.com / admin123</p>
        <button type="button" className="btn ghost sm" onClick={fillAdmin}>Fill admin credentials</button>
      </div>
    </AuthShell>
  )
}
