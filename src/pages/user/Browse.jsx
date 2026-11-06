import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import RecipeCard from '../../components/RecipeCard.jsx'
import { CUISINES, DIETS } from '../../utils/helpers'

export default function Browse() {
  const { approvedRecipes } = useApp()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') || ''
  const cuisine = params.get('cuisine') || 'All'
  const diet = params.get('diet') || 'All'
  const sort = params.get('sort') || 'rating'

  const update = (key, value, empty) => {
    const next = new URLSearchParams(params)
    if (!value || value === empty) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    const filtered = approvedRecipes.filter((r) => {
      if (cuisine !== 'All' && r.cuisine !== cuisine) return false
      if (diet !== 'All' && r.diet !== diet) return false
      if (!query) return true
      return (
        r.title.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.ingredients.join(' ').toLowerCase().includes(query)
      )
    })
    const sorters = {
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      priceLow: (a, b) => a.price - b.price,
      priceHigh: (a, b) => b.price - a.price,
      time: (a, b) => a.time - b.time,
    }
    return [...filtered].sort(sorters[sort] || sorters.rating)
  }, [approvedRecipes, q, cuisine, diet, sort])

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Explore food</span>
        <h1>Browse recipes</h1>
        <p className="muted">Find delicious food according to your taste.</p>
      </div>

      <div className="filter-bar">
        <input
          className="grow"
          placeholder="Search recipes, ingredients or cuisine…"
          value={q}
          onChange={(e) => update('q', e.target.value)}
        />
        <select value={cuisine} onChange={(e) => update('cuisine', e.target.value, 'All')}>
          <option value="All">All cuisines</option>
          {CUISINES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={diet} onChange={(e) => update('diet', e.target.value, 'All')}>
          <option value="All">All diets</option>
          {DIETS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={sort} onChange={(e) => update('sort', e.target.value, 'rating')}>
          <option value="rating">Top rated</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
          <option value="time">Quickest</option>
        </select>
        <button className="btn ghost" onClick={() => setParams({}, { replace: true })}>Clear</button>
      </div>

      <p className="muted small results-count">{list.length} recipe{list.length === 1 ? '' : 's'} found</p>

      {list.length === 0 ? (
        <div className="empty">
          <div className="big-emoji">🔍</div>
          <h3>No recipes found</h3>
          <p className="muted">Try another search or clear the filters.</p>
        </div>
      ) : (
        <div className="grid">
          {list.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </>
  )
}
