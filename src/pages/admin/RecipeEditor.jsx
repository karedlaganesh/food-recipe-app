import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import RecipeForm from '../../components/RecipeForm.jsx'

export default function RecipeEditor() {
  const { id } = useParams()
  const { recipes, addRecipe, updateRecipe, toast } = useApp()
  const navigate = useNavigate()
  const editing = id ? recipes.find((r) => String(r.id) === id) : null

  if (id && !editing) {
    return (
      <div className="empty card">
        <h3>Recipe not found</h3>
        <Link className="btn primary" to="/admin/recipes">Back to recipes</Link>
      </div>
    )
  }

  const handleSubmit = (data) => {
    if (editing) {
      updateRecipe(editing.id, data)
      toast('Recipe updated successfully.')
    } else {
      addRecipe(data)
      toast('Recipe added successfully.')
    }
    navigate('/admin/recipes')
  }

  return (
    <div className="card">
      <h3>{editing ? `Edit “${editing.title}”` : 'Add a new recipe'}</h3>
      <RecipeForm
        initial={editing || undefined}
        submitLabel={editing ? 'Save changes' : 'Add recipe'}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/recipes')}
      />
    </div>
  )
}
