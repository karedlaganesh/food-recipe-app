import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, load, save } from '../utils/storage'
import { ADMIN_ACCOUNT, SEED_RECIPES } from '../data/seed'
import { calcTotals } from '../utils/helpers'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const normalizeUsers = (list) => {
  const users = list.map((u) => ({ role: 'user', ...u }))
  return users.some((u) => u.role === 'admin') ? users : [ADMIN_ACCOUNT, ...users]
}
const normalizeRecipes = (list) => list.map((r) => ({ status: 'approved', ...r }))

export function AppProvider({ children }) {
  const [recipes, setRecipes] = useState(() => normalizeRecipes(load(KEYS.recipes, SEED_RECIPES)))
  const [users, setUsers] = useState(() => normalizeUsers(load(KEYS.users, [])))
  const [orders, setOrders] = useState(() => load(KEYS.orders, []))
  const [carts, setCarts] = useState(() => load(KEYS.carts, {}))
  const [session, setSession] = useState(() => load(KEYS.session, null))
  const [theme, setTheme] = useState(() => load(KEYS.theme, 'light'))
  const [toasts, setToasts] = useState([])

  /* ---------- persistence ---------- */
  useEffect(() => save(KEYS.recipes, recipes), [recipes])
  useEffect(() => save(KEYS.users, users), [users])
  useEffect(() => save(KEYS.orders, orders), [orders])
  useEffect(() => save(KEYS.carts, carts), [carts])
  useEffect(() => save(KEYS.session, session), [session])
  useEffect(() => {
    save(KEYS.theme, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  /* keep several open tabs (e.g. admin + user) in sync */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEYS.recipes) setRecipes(normalizeRecipes(load(KEYS.recipes, SEED_RECIPES)))
      if (e.key === KEYS.users) setUsers(normalizeUsers(load(KEYS.users, [])))
      if (e.key === KEYS.orders) setOrders(load(KEYS.orders, []))
      if (e.key === KEYS.carts) setCarts(load(KEYS.carts, {}))
      if (e.key === KEYS.session) setSession(load(KEYS.session, null))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /* ---------- toast ---------- */
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  /* ---------- auth ---------- */
  const currentUser = useMemo(() => users.find((u) => u.email === session) || null, [users, session])

  const signup = ({ name, email, password }) => {
    const e = email.trim().toLowerCase()
    if (users.some((u) => u.email === e)) return { ok: false, error: 'This email is already registered.' }
    const user = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: e,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    }
    setUsers((p) => [...p, user])
    return { ok: true, email: e }
  }

  const login = (email, password) => {
    const e = email.trim().toLowerCase()
    const user = users.find((u) => u.email === e && u.password === password)
    if (!user) return { ok: false, error: 'Invalid email or password.' }
    setSession(user.email)
    return { ok: true, user }
  }

  const logout = () => setSession(null)

  const updateProfile = (name) =>
    setUsers((p) => p.map((u) => (u.email === currentUser.email ? { ...u, name: name.trim() } : u)))

  const deleteUser = (email) => {
    setUsers((p) => p.filter((u) => u.email !== email || u.role === 'admin'))
    setCarts((p) => {
      const { [email]: _removed, ...rest } = p
      return rest
    })
  }

  /* ---------- recipes ---------- */
  const approvedRecipes = useMemo(() => recipes.filter((r) => r.status === 'approved'), [recipes])
  const pendingRecipes = useMemo(() => recipes.filter((r) => r.status === 'pending'), [recipes])

  const addRecipe = (data) => {
    const byAdmin = currentUser?.role === 'admin'
    const recipe = {
      id: Date.now(),
      rating: 0,
      ratingsCount: 0,
      ...data,
      status: byAdmin ? 'approved' : 'pending',
      submittedBy: byAdmin ? 'Admin' : currentUser?.name || 'User',
      submittedByEmail: currentUser?.email,
    }
    setRecipes((p) => [recipe, ...p])
    return recipe
  }
  const updateRecipe = (id, patch) => setRecipes((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const deleteRecipe = (id) => setRecipes((p) => p.filter((r) => r.id !== id))
  const approveRecipe = (id) => updateRecipe(id, { status: 'approved' })

  const rateRecipe = (id, value) => {
    if (!currentUser) return
    setRecipes((p) =>
      p.map((r) => {
        if (r.id !== id) return r
        const userRatings = { ...(r.userRatings || {}) }
        const previous = userRatings[currentUser.email]
        userRatings[currentUser.email] = value
        let count = r.ratingsCount || 0
        let sum = (r.rating || 0) * count
        if (previous) sum -= previous
        else count += 1
        sum += value
        return { ...r, userRatings, ratingsCount: count, rating: Math.round((sum / count) * 10) / 10 }
      }),
    )
  }

  /* ---------- cart ---------- */
  const cart = currentUser ? carts[currentUser.email] || [] : []
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const updateCart = (fn) =>
    setCarts((prev) => ({ ...prev, [currentUser.email]: fn(prev[currentUser.email] || []) }))

  /** returns 'ok' | 'auth' | 'forbidden' */
  const addToCart = (recipe) => {
    if (!currentUser) return 'auth'
    if (currentUser.role === 'admin') {
      toast('Admins cannot place orders. Please use a user account.', 'error')
      return 'forbidden'
    }
    updateCart((items) => {
      const found = items.find((i) => i.id === recipe.id)
      if (found) return items.map((i) => (i.id === recipe.id ? { ...i, quantity: i.quantity + 1 } : i))
      return [...items, { id: recipe.id, title: recipe.title, price: recipe.price, image: recipe.image, quantity: 1 }]
    })
    toast(`${recipe.title} added to cart`)
    return 'ok'
  }
  const changeQty = (id, delta) =>
    updateCart((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0),
    )
  const removeFromCart = (id) => updateCart((items) => items.filter((i) => i.id !== id))

  /* ---------- orders ---------- */
  const placeOrder = () => {
    if (!currentUser || cart.length === 0) return null
    const totals = calcTotals(cart)
    const order = {
      id: Date.now(),
      userEmail: currentUser.email,
      userName: currentUser.name,
      items: cart,
      ...totals,
      status: 'Order Placed',
      date: new Date().toISOString(),
    }
    setOrders((p) => [order, ...p])
    updateCart(() => [])
    return order
  }
  const updateOrderStatus = (id, status) =>
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o)))

  const value = {
    recipes, approvedRecipes, pendingRecipes, users, orders, cart, cartCount,
    currentUser, theme, toasts,
    toast, toggleTheme,
    signup, login, logout, updateProfile, deleteUser,
    addRecipe, updateRecipe, deleteRecipe, approveRecipe, rateRecipe,
    addToCart, changeQty, removeFromCart, placeOrder, updateOrderStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
