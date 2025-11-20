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

    // 🔹 Formatear items para backend
    const items = cart.map(i => ({
      product_id: i.id,
      name: i.name,
      quantity: i.qty,
      price: i.price
    }));


    // Crear preferencia de Mercado Pago
    const r = await api.post('/create_preference', { items });

    // Redirigir al pago
    window.location.href = r.data.init_point;

    // 👇 La parte de Mercado Pago la haremos en el próximo paso
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total}</p>

      <button onClick={handlePay}>
        Pagar con Mercado Pago
      </button>

    </div>
  );
};
