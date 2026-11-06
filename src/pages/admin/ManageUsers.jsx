import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import Modal from '../../components/Modal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { formatDate } from '../../utils/helpers'

export default function ManageUsers() {
  const { users, orders, deleteUser, toast } = useApp()
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) => u.role === 'user' && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    )
  }, [users, query])

  const orderCount = (email) => orders.filter((o) => o.userEmail === email).length

  const confirmDelete = () => {
    deleteUser(deleting.email)
    toast(`User ${deleting.name} deleted.`)
    setDeleting(null)
  }

  return (
    <>
      <div className="toolbar">
        <input className="grow" placeholder="Search users by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {list.length === 0 ? (
        <div className="empty card">
          <h3>No registered users</h3>
          <p className="muted">Users will appear here after they sign up.</p>
        </div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((u, i) => (
                <tr key={u.email}>
                  <td>{i + 1}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                  <td>{orderCount(u.email)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn ghost sm" onClick={() => setViewing(u)}>View</button>
                      <button className="btn danger-ghost sm" onClick={() => setDeleting(u)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <Modal title="User details" onClose={() => setViewing(null)}>
          <dl className="details">
            <dt>Name</dt><dd>{viewing.name}</dd>
            <dt>Email</dt><dd>{viewing.email}</dd>
            <dt>Joined</dt><dd>{viewing.createdAt ? formatDate(viewing.createdAt) : '—'}</dd>
            <dt>Orders</dt><dd>{orderCount(viewing.email)}</dd>
          </dl>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete user"
          message={`Delete ${deleting.name} (${deleting.email})? Their account and cart will be removed.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
