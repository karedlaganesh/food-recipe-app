# 🍽️ RecipeHub – Food Recipe Web Application

A React + Vite app with two modules — **User** and **Admin** — and
Local Storage based login/signup. No backend needed.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
```

## Demo credentials
| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | admin@recipehub.com   | admin123   |
| User  | create one via **Sign up** | — |

## Modules
**User** – browse/search/filter/sort recipes, recipe details + star rating,
cart with quantity controls, place order, live order tracking, order history,
submit a recipe for approval, profile, dark mode.

**Admin** – dashboard stats, add/edit/delete/view recipes, approve/reject
user-submitted recipes, view/delete users, view orders and update order status,
dark mode.

## Authentication (Local Storage)
- Sign up stores the account in `localStorage` (`rh_users`).
- Login stores the session (`rh_session`); role decides where you land
  (`admin` → `/admin`, `user` → `/`).
- Protected routes redirect to `/login` when not logged in or when the role doesn't match.
- Note: passwords are stored in plain text because this is a front-end-only demo.

## Deploy
1. Push to GitHub.
2. On vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Build: `npm run build`, Output: `dist`.
4. Deploy. `vercel.json` already rewrites all routes to `index.html`, so page refresh works.

## Structure
```
src/
  context/AppContext.jsx   state + localStorage persistence + auth
  components/              layouts, route guard, modal, form, cards
  pages/                   Login, Signup, NotFound
  pages/user/              Home, Browse, RecipeDetail, Cart, TrackOrder, OrderHistory, SubmitRecipe, Profile
  pages/admin/             Dashboard, ManageRecipes, RecipeEditor, Pending, ManageUsers, ManageOrders
```
