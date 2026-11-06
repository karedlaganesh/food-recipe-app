import { useState } from 'react'
import { CUISINES, DIETS } from '../utils/helpers'

const toLines = (text) =>
  text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

/**
 * Shared by Admin (add / edit) and User (submit for approval).
 * `initial` is an existing recipe or undefined for a blank form.
 */
export default function RecipeForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    price: initial?.price ?? '',
    cuisine: initial?.cuisine || '',
    diet: initial?.diet || '',
    time: initial?.time ?? '',
    image: initial?.image || '',
    ingredients: initial?.ingredients?.join('\n') || '',
    steps: initial?.steps?.join('\n') || '',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const ingredients = toLines(form.ingredients)
    const steps = toLines(form.steps)
    if (ingredients.length === 0 || steps.length === 0) {
      setError('Please add at least one ingredient and one step (one per line).')
      return
    }
    setError('')
    onSubmit({
      title: form.title.trim(),
      price: Number(form.price),
      cuisine: form.cuisine,
      diet: form.diet,
      time: Number(form.time),
      image: form.image.trim(),
      ingredients,
      steps,
    })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label>Recipe name</label>
        <input value={form.title} onChange={set('title')} placeholder="e.g. Chicken Biryani" required />
      </div>
      <div className="field">
        <label>Price (₹)</label>
        <input type="number" min="1" value={form.price} onChange={set('price')} placeholder="299" required />
      </div>
      <div className="field">
        <label>Cuisine</label>
        <select value={form.cuisine} onChange={set('cuisine')} required>
          <option value="">Select cuisine</option>
          {CUISINES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Diet</label>
        <select value={form.diet} onChange={set('diet')} required>
          <option value="">Select diet</option>
          {DIETS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Preparation time (minutes)</label>
        <input type="number" min="1" value={form.time} onChange={set('time')} placeholder="30" required />
      </div>
      <div className="field">
        <label>Image URL <span className="muted">(optional)</span></label>
        <input type="url" value={form.image} onChange={set('image')} placeholder="https://..." />
      </div>
      <div className="field full">
        <label>Ingredients <span className="muted">(one per line)</span></label>
        <textarea rows="5" value={form.ingredients} onChange={set('ingredients')} placeholder={'Basmati rice\nChicken\nOnion'} required />
      </div>
      <div className="field full">
        <label>Preparation steps <span className="muted">(one per line)</span></label>
        <textarea rows="6" value={form.steps} onChange={set('steps')} placeholder={'Marinate the chicken\nCook the rice\nLayer and dum cook'} required />
      </div>
      {error && <p className="form-error full">{error}</p>}
      <div className="form-actions full">
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  )
}
