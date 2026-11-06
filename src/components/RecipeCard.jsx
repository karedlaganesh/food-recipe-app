import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { dietClass, money } from '../utils/helpers'
import RecipeImage from './RecipeImage.jsx'

export default function RecipeCard({ recipe }) {
  const { addToCart, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAdd = () => {
    if (addToCart(recipe) === 'auth') {
      toast('Please log in to add items to your cart.', 'error')
      navigate('/login', { state: { from: location.pathname + location.search } })
    }
  }

  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-img-wrap">
        <RecipeImage src={recipe.image} alt={recipe.title} />
        <span className={`diet-chip ${dietClass(recipe.diet)}`}>{recipe.diet}</span>
      </Link>
      <div className="recipe-body">
        <h3><Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link></h3>
        <p className="muted small">
          {recipe.cuisine} · ⏱ {recipe.time} min · ⭐ {recipe.rating || 'New'}
        </p>
        <div className="recipe-foot">
          <strong className="price">{money(recipe.price)}</strong>
          <button className="btn primary sm" onClick={handleAdd}>Add to cart</button>
        </div>
      </div>
    </article>
  )
}
