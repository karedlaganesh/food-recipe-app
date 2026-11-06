import { Navigate, Route, Routes } from 'react-router-dom'
import UserLayout from './components/UserLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Toasts from './components/Toasts.jsx'

import Home from './pages/user/Home.jsx'
import Browse from './pages/user/Browse.jsx'
import RecipeDetail from './pages/user/RecipeDetail.jsx'
import Cart from './pages/user/Cart.jsx'
import TrackOrder from './pages/user/TrackOrder.jsx'
import OrderHistory from './pages/user/OrderHistory.jsx'
import SubmitRecipe from './pages/user/SubmitRecipe.jsx'
import Profile from './pages/user/Profile.jsx'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import NotFound from './pages/NotFound.jsx'

import Dashboard from './pages/admin/Dashboard.jsx'
import ManageRecipes from './pages/admin/ManageRecipes.jsx'
import RecipeEditor from './pages/admin/RecipeEditor.jsx'
import Pending from './pages/admin/Pending.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'

export default function App() {
  return (
    <>
      <Routes>
        {/* ---------- User module ---------- */}
        <Route element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="cart" element={<RequireAuth role="user"><Cart /></RequireAuth>} />
          <Route path="track" element={<RequireAuth role="user"><TrackOrder /></RequireAuth>} />
          <Route path="orders" element={<RequireAuth role="user"><OrderHistory /></RequireAuth>} />
          <Route path="submit" element={<RequireAuth role="user"><SubmitRecipe /></RequireAuth>} />
          <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Route>

        {/* ---------- Auth ---------- */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* ---------- Admin module ---------- */}
        <Route path="admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="recipes" element={<ManageRecipes />} />
          <Route path="recipes/new" element={<RecipeEditor />} />
          <Route path="recipes/:id/edit" element={<RecipeEditor />} />
          <Route path="pending" element={<Pending />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>

        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toasts />
    </>
  )
}
