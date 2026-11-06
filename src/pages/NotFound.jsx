import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="big-emoji">🍳</div>
      <h1>404 – Page not found</h1>
      <p className="muted">Looks like this dish isn't on the menu.</p>
      <Link className="btn primary" to="/">Back to home</Link>
    </div>
  )
}
