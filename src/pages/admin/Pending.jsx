import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import Modal from '../../components/Modal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { money } from '../../utils/helpers'

export default function Pending() {
  const { pendingRecipes, approveRecipe, deleteRecipe, toast } = useApp()
  const [viewing, setViewing] = useState(null)
  const [rejecting, setRejecting] = useState(null)

  const approve = (r) => {
    approveRecipe(r.id)
    toast(`"${r.title}" approved.`)
    setViewing(null)
  }
  const reject = () => {
    deleteRecipe(rejecting.id)
    toast(`"${rejecting.title}" rejected and removed.`)
    setRejecting(null)
  }

  if (pendingRecipes.length === 0) {
    return (
      <div className="empty card">
        <div className="big-emoji">🎉</div>
        <h3>No pending recipes</h3>
        <p className="muted">All submitted recipes have been reviewed.</p>
      </div>
    )
  }

  return (
    <>
      <div className="table-wrap card">
        <table>
          <thead><tr><th>Recipe</th><th>Submitted by</th><th>Cuisine</th><th>Diet</th><th>Actions</th></tr></thead>
          <tbody>
            {pendingRecipes.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong></td>
                <td>{r.submittedBy || 'User'}</td>
                <td>{r.cuisine}</td>
                <td>{r.diet}</td>
                <td>
                  <div className="actions">
                    <button className="btn ghost sm" onClick={() => setViewing(r)}>View</button>
                    <button className="btn success sm" onClick={() => approve(r)}>Approve</button>
                    <button className="btn danger-ghost sm" onClick={() => setRejecting(r)}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Modal
          title={viewing.title}
          onClose={() => setViewing(null)}
          wide
          footer={
            <>
              <button className="btn danger-ghost" onClick={() => { setRejecting(viewing); setViewing(null) }}>Reject</button>
              <button className="btn success" onClick={() => approve(viewing)}>Approve</button>
            </>
          }
        >
          <p className="muted">
            By {viewing.submittedBy || 'User'} · {viewing.cuisine} · {viewing.diet} · ⏱ {viewing.time} min · {money(viewing.price)}
          </p>
          <h4>Ingredients</h4>
          <ul className="ingredient-list">{viewing.ingredients.map((i, n) => <li key={n}>{i}</li>)}</ul>
          <h4>Steps</h4>
          <ol className="step-list">{viewing.steps.map((s, n) => <li key={n}>{s}</li>)}</ol>
        </Modal>
      )}

      {rejecting && (
        <ConfirmDialog
          title="Reject recipe"
          message={`Reject and remove "${rejecting.title}"?`}
          confirmLabel="Reject"
          danger
          onConfirm={reject}
          onCancel={() => setRejecting(null)}
        />
      )}
    </>
  )
}
