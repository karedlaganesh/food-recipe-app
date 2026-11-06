import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import RecipeImage from '../../components/RecipeImage.jsx'
import Stars from '../../components/Stars.jsx'
import { dietClass, money } from '../../utils/helpers'

export default function RecipeDetail() {
  const { id } = useParams()
  const { recipes, currentUser, addToCart, rateRecipe, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const recipe = recipes.find((r) => String(r.id) === id)
  const canView = recipe && (recipe.status === 'approved' || currentUser?.role === 'admin' || recipe.submittedByEmail === currentUser?.email)

  if (!canView) {
    return (
      <div className="empty">
        <div className="big-emoji">🍽️</div>
        <h3>Recipe not found</h3>
        <Link className="btn primary" to="/browse">Browse recipes</Link>
      </div>
    )
  }

  const myRating = currentUser ? recipe.userRatings?.[currentUser.email] : 0

  const handleAdd = () => {
    if (addToCart(recipe) === 'auth') {
      toast('Please log in to add items to your cart.', 'error')
      navigate('/login', { state: { from: location.pathname } })
    }
  }

  const handleRate = (value) => {
    if (!currentUser) {
      toast('Please log in to rate recipes.', 'error')
      return navigate('/login', { state: { from: location.pathname } })
    }
    rateRecipe(recipe.id, value)
    toast('Thanks for rating!')
  }

  return (
    <>
      <button className="btn ghost sm back" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail">
        <RecipeImage className="detail-img" src={recipe.image} alt={recipe.title} />
        <div className="detail-info">
          <span className={`diet-chip static ${dietClass(recipe.diet)}`}>{recipe.diet}</span>
          <h1>{recipe.title}</h1>
          <p className="muted">{recipe.cuisine} cuisine · ⏱ {recipe.time} minutes</p>
          <div className="rating-row">
            <Stars value={recipe.rating} />
            <span className="muted small">{recipe.rating || 0} ({recipe.ratingsCount || 0} ratings)</span>
          </div>
          <p className="detail-price">{money(recipe.price)}</p>
          {recipe.status === 'pending' && <p className="notice">⏳ This recipe is awaiting admin approval.</p>}
          {recipe.status === 'approved' && currentUser?.role !== 'admin' && (
            <button className="btn primary" onClick={handleAdd}>🛒 Add to cart</button>
          )}
          {currentUser?.role === 'user' && recipe.status === 'approved' && (
            <div className="rate-box">
              <span className="small muted">{myRating ? 'Your rating:' : 'Rate this recipe:'}</span>
              <Stars value={myRating || 0} onRate={handleRate} />
            </div>
          )}
        </div>
      </div>

      <div className="detail-cols">
        <section className="card">
          <h3>Ingredients</h3>
          <ul className="ingredient-list">
            {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
        <section className="card">
          <h3>Instructions</h3>
          <ol className="step-list">
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>
      </div>
    </>
  )
}
