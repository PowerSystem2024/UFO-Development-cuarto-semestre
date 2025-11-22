// frontend/src/pages/Checkout.jsx

import React, { useContext } from 'react';
import api, { setToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Checkout() {

  const { user } = useContext(AuthContext);

  const key = user ? `cart_${user.id}` : "cart_guest";
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  const userToken = localStorage.getItem('token');

  const handlePay = async () => {
    if (!userToken) {
      alert('Debes iniciar sesión para pagar.');
      return window.location.href = '/login';
    }

    setToken(userToken);

    const items = cart.map(i => ({
      product_id: i.id,
      name: i.name,
      quantity: i.qty,
      price: i.price
    }));

    const r = await api.post('/create_preference', { items });
    window.location.href = r.data.init_point;
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="cart-page-container">

      <div className="cart-page-panel">

        <h2>Checkout</h2>

        <ul className="cart-page-list">
          {cart.map(item => (
            <li className="cart-page-item" key={item.id}>

              <img 
                src={`/frutas/${item.image}`}
                className="cart-page-img"
                alt={item.name}
              />

              <div className="cart-page-info">
                <strong>{item.name}</strong>
                <span className="cart-page-qty">x {item.qty}</span>
              </div>

              <span className="cart-page-price">
                ${item.price * item.qty}
              </span>

            </li>
          ))}
        </ul>

        <div className="cart-page-total">
          <span>Total:</span>
          <strong>${total}</strong>
        </div>

        <button className="auth-btn" onClick={handlePay}>
          Pagar con Mercado Pago
        </button>

      </div>
    </div>
  );
}
