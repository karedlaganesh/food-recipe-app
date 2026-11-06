export const ADMIN_ACCOUNT = {
  id: 'admin-1',
  name: 'Administrator',
  email: 'admin@recipehub.com',
  password: 'admin123',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const img = (id) => `https://images.unsplash.com/${id}?w=700&auto=format&fit=crop`

export const SEED_RECIPES = [
  {
    id: 1, title: 'Chicken Biryani', cuisine: 'Indian', diet: 'Non-Vegetarian', time: 60, price: 299,
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices', 'Onion', 'Tomato'],
    steps: ['Marinate chicken', 'Cook rice', 'Prepare biryani masala', 'Layer rice and chicken', 'Dum cook', 'Serve hot'],
    rating: 4.5, ratingsCount: 12, image: img('photo-1563379091339-03b21ab4a4f8'), status: 'approved',
  },
  {
    id: 2, title: 'Margherita Pizza', cuisine: 'Italian', diet: 'Vegetarian', time: 30, price: 249,
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    steps: ['Prepare dough', 'Spread tomato sauce', 'Add mozzarella', 'Bake at 220°C', 'Garnish with basil'],
    rating: 4.7, ratingsCount: 20, image: img('photo-1574071318508-1cdbab80d002'), status: 'approved',
  },
  {
    id: 3, title: 'Veg Hakka Noodles', cuisine: 'Chinese', diet: 'Vegetarian', time: 25, price: 199,
    ingredients: ['Noodles', 'Cabbage', 'Carrot', 'Capsicum', 'Soy Sauce'],
    steps: ['Boil noodles', 'Stir fry vegetables', 'Add noodles', 'Mix with sauce', 'Serve hot'],
    rating: 4.3, ratingsCount: 8, image: img('photo-1585032226651-759b368d7246'), status: 'approved',
  },
  {
    id: 4, title: 'Chocolate Brownie', cuisine: 'American', diet: 'Vegetarian', time: 40, price: 149,
    ingredients: ['Dark Chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour'],
    steps: ['Melt chocolate', 'Mix ingredients', 'Prepare batter', 'Bake for 25 minutes', 'Cool and cut'],
    rating: 4.8, ratingsCount: 15, image: img('photo-1606313564200-e75d5e30476c'), status: 'approved',
  },
  {
    id: 5, title: 'Paneer Butter Masala', cuisine: 'Indian', diet: 'Vegetarian', time: 35, price: 279,
    ingredients: ['Paneer', 'Butter', 'Tomato', 'Cream', 'Spices'],
    steps: ['Prepare tomato gravy', 'Add butter', 'Add paneer', 'Add cream', 'Simmer', 'Serve with naan'],
    rating: 4.6, ratingsCount: 18, image: img('photo-1631452180519-c014fe946bc7'), status: 'approved',
  },
  {
    id: 6, title: 'Veggie Tacos', cuisine: 'Mexican', diet: 'Vegan', time: 20, price: 179,
    ingredients: ['Corn Tortillas', 'Black Beans', 'Avocado', 'Tomato', 'Lime', 'Coriander'],
    steps: ['Warm the tortillas', 'Cook and season beans', 'Chop vegetables', 'Assemble tacos', 'Finish with lime'],
    rating: 4.4, ratingsCount: 9, image: img('photo-1565299585323-38d6b0865b47'), status: 'approved',
  },
]
