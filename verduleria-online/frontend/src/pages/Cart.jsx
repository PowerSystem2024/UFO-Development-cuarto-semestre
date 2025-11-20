// frontend/src/pages/Cart.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Cart() {
  const { user } = useContext(AuthContext);              // ✅ obtener usuario arriba
  const [cart, setCart] = useState([]);

  const key = user ? `cart_${user.id}` : 'cart_guest';   // ✅ nombre de carrito por usuario

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    setCart(data);
  }, [key]);  // ✅ se recarga si cambia el usuario (y por ende la key)

  const total = cart.reduce((s, i) => s + Number(i.price) * Number(i.qty || 1), 0);

  return (
    <div>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div>
          <ul>
            {cart.map(i => (
              <li key={i.id}>
                {i.name} x {i.qty} - ${Number(i.price) * Number(i.qty || 1)}
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
          <Link to="/checkout">
            <button>Ir a pagar</button>
          </Link>
        </div>
      )}
    </div>
  );
}
