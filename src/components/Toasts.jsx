import { useApp } from '../context/AppContext.jsx'

export default function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'error' ? '⚠️' : '✅'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
