export const KEYS = {
  recipes: 'rh_recipes',
  users: 'rh_users',
  orders: 'rh_orders',
  carts: 'rh_carts',
  session: 'rh_session',
  theme: 'rh_theme',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable */
  }
}
