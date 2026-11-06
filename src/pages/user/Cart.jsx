import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import RecipeImage from '../../components/RecipeImage.jsx'
import { calcTotals, money } from '../../utils/helpers'

export default function Cart() {
  const { cart, changeQty, removeFromCart, placeOrder, toast } = useApp()
  const navigate = useNavigate()
  const { subtotal, delivery, tax, total } = calcTotals(cart)

  const handlePlace = () => {
    const order = placeOrder()
    if (order) {
      toast('Order placed successfully!')
      navigate('/track')
    }
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Your order</span>
        <h1>🛒 Shopping cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty">
          <div className="big-emoji">🛒</div>
          <h3>Your cart is empty</h3>
          <p className="muted">Add some delicious food to your cart.</p>
          <Link className="btn primary" to="/browse">Browse recipes</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="stack">
            {cart.map((item) => (
              <div className="cart-item card" key={item.id}>
                <RecipeImage className="cart-thumb" src={item.image} alt={item.title} />
                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="muted small">{money(item.price)} each</p>
                  <div className="qty">
                    <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease">−</button>
                    <strong>{item.quantity}</strong>
                    <button onClick={() => changeQty(item.id, 1)} aria-label="Increase">+</button>
                  </div>
                </div>
                <div className="cart-right">
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button className="link-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="card summary">
            <h3>Order summary</h3>
            <div className="row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="row"><span>Delivery fee</span><span>{delivery === 0 ? 'Free' : money(delivery)}</span></div>
            <div className="row"><span>Tax (5%)</span><span>{money(tax)}</span></div>
            <hr />
            <div className="row total"><span>Total</span><span>{money(total)}</span></div>
            {delivery > 0 && <p className="small muted">Free delivery on orders above ₹500.</p>}
            <button className="btn primary block" onClick={handlePlace}>Place order →</button>
          </aside>
        </div>
      )}
    </>
  )
}
