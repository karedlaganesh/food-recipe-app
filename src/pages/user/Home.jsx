import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import RecipeCard from '../../components/RecipeCard.jsx'
import { CUISINES } from '../../utils/helpers'

export default function Home() {
  const { approvedRecipes } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const featured = [...approvedRecipes].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/browse?q=${encodeURIComponent(q.trim())}` : '/browse')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="pill">🍴 Welcome to RecipeHub</span>
          <h1>Discover your <span>favourite food</span></h1>
          <p>Explore delicious recipes, order your favourite dishes and enjoy fast doorstep delivery.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search recipes, ingredients or cuisine…" />
            <button className="btn primary" type="submit">Search</button>
          </form>
        </div>
        <div className="hero-art" aria-hidden="true">🍕</div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Explore</span>
            <h2>Browse by cuisine</h2>
          </div>
        </div>
        <div className="chip-row">
          {CUISINES.map((c) => (
            <Link key={c} className="chip" to={`/browse?cuisine=${c}`}>{c}</Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Popular choices</span>
            <h2>Top rated recipes</h2>
          </div>
          <Link className="btn ghost sm" to="/browse">View all →</Link>
        </div>
        <div className="grid">
          {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      </section>
    </>
  )
}
