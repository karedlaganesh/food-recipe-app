import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import RecipeForm from '../../components/RecipeForm.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

export default function SubmitRecipe() {
  const { addRecipe, recipes, currentUser, toast } = useApp()
  const [formKey, setFormKey] = useState(0)
  const mine = recipes.filter((r) => r.submittedByEmail === currentUser.email)

  const handleSubmit = (data) => {
    addRecipe(data)
    toast('Recipe submitted for admin approval.')
    setFormKey((k) => k + 1) // resets the form
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Share your food</span>
        <h1>Submit a recipe</h1>
        <p className="muted">Your recipe will appear on the website once an admin approves it.</p>
      </div>

      <div className="card">
        <RecipeForm key={formKey} submitLabel="Submit for approval" onSubmit={handleSubmit} />
      </div>

      {mine.length > 0 && (
        <section className="section">
          <h2>My submissions</h2>
          <div className="card">
            <ul className="plain-list">
              {mine.map((r) => (
                <li key={r.id}>
                  <Link to={`/recipe/${r.id}`}>{r.title}</Link>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
