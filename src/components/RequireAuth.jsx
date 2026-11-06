import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function RequireAuth({ role, children }) {
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/'} replace />
  }
  return children
}
