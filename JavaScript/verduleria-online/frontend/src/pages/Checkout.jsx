import React, { useContext } from 'react';
import api, { setToken } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Checkout() {

  // ✅ Usuario actual
  const { user } = useContext(AuthContext);

  // ✅ Nombre del carrito según usuario
  const key = user ? `cart_${user.id}` : "cart_guest";

  // ✅ Leer carrito correcto
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  // ✅ Token si existe
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

    const resp = await api.post('/create_preference', { items });

    // Redirigir a Mercado Pago
    window.location.href = resp.data.init_point;
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total}</p>

      <button onClick={handlePay}>
        Pagar con Mercado Pago (modo test)
      </button>
    </div>
  );
};