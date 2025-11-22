// frontend/src/pages/Cart.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Cart() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const key = user ? `cart_${user.id}` : 'cart_guest';

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    setCart(data);
  }, [key]);

  const total = cart.reduce(
    (s, i) => s + Number(i.price) * Number(i.qty || 1), 
    0
  );

  return (
    <div className="cart-page-container">

      <div className="cart-page-panel">
        <h2>Carrito</h2>

        {cart.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <>
            <ul className="cart-page-list">
              {cart.map(i => (
                <li className="cart-page-item" key={i.id}>
                  
                  {/* Imagen del producto */}
                  <img 
                    src={`/frutas/${i.image}`} 
                    alt={i.name} 
                    className="cart-page-img"
                  />

                  {/* Nombre + cantidad */}
                  <div className="cart-page-info">
                    <strong>{i.name}</strong>
                    <span className="cart-page-qty">x {i.qty}</span>
                  </div>

                  {/* Subtotal */}
                  <span className="cart-page-price">
                    ${Number(i.price) * Number(i.qty || 1)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="cart-page-total">
              <p>Total:</p>
              <strong>${total}</strong>
            </div>

            <Link to="/checkout">
              <button className="auth-btn">Ir a pagar</button>
            </Link>
          </>
        )}
      </div>

    </div>
  );
}
