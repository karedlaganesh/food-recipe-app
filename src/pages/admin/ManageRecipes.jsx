import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import Modal from '../../components/Modal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import RecipeImage from '../../components/RecipeImage.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { CUISINES, money } from '../../utils/helpers'

export default function ManageRecipes() {
  const { recipes, deleteRecipe, toast } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [status, setStatus] = useState('All')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter(
      (r) =>
        (cuisine === 'All' || r.cuisine === cuisine) &&
        (status === 'All' || r.status === status) &&
        (!q || [r.title, r.cuisine, r.diet].some((v) => v.toLowerCase().includes(q))),
    )
  }, [recipes, query, cuisine, status])

  const confirmDelete = () => {
    deleteRecipe(deleting.id)
    toast(`"${deleting.title}" deleted.`)
    setDeleting(null)
  }

  return (
    <>
      <div className="toolbar">
        <input className="grow" placeholder="Search recipes…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          <option value="All">All cuisines</option>
          {CUISINES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
        <Link className="btn primary" to="/admin/recipes/new">➕ Add recipe</Link>
      </div>

      {list.length === 0 ? (
        <div className="empty card"><h3>No recipes found</h3><p className="muted">Try changing the filters or add a new recipe.</p></div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr><th>Recipe</th><th>Cuisine</th><th>Diet</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="cell-recipe">
                      <RecipeImage className="thumb" src={r.image} alt={r.title} />
                      <strong>{r.title}</strong>
                    </div>
                  </td>
                  <td>{r.cuisine}</td>
                  <td>{r.diet}</td>
                  <td>{money(r.price)}</td>
                  <td>⭐ {r.rating || 0}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="actions">
                      <button className="btn ghost sm" onClick={() => setViewing(r)}>View</button>
                      <button className="btn ghost sm" onClick={() => navigate(`/admin/recipes/${r.id}/edit`)}>Edit</button>
                      <button className="btn danger-ghost sm" onClick={() => setDeleting(r)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <Modal title={viewing.title} onClose={() => setViewing(null)} wide>
          <RecipeImage className="modal-img" src={viewing.image} alt={viewing.title} />
          <p className="muted">{viewing.cuisine} · {viewing.diet} · ⏱ {viewing.time} min · {money(viewing.price)}</p>
          <h4>Ingredients</h4>
          <ul className="ingredient-list">{viewing.ingredients.map((i, n) => <li key={n}>{i}</li>)}</ul>
          <h4>Steps</h4>
          <ol className="step-list">{viewing.steps.map((s, n) => <li key={n}>{s}</li>)}</ol>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete recipe"
          message={`Are you sure you want to delete "${deleting.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}
