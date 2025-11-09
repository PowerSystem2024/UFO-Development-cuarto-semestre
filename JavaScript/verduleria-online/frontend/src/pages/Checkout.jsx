import React from 'react';
import api, { setToken } from '../services/api';

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const userToken = localStorage.getItem('token'); // si logueaste, lo guardas aquí
  const handlePay = async () => {
    if (!userToken) return alert('Inicia sesión antes de pagar (próximamente implementaremos login).');
    setToken(userToken);
    const items = cart.map(i => ({ product_id: i.id, name: i.name, quantity: i.qty, price: i.price }));
    const resp = await api.post('/create_preference', { items });
    // Redirigir a Mercado Pago
    window.location.href = resp.data.init_point;
  };
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total}</p>
      <button onClick={handlePay}>Pagar con Mercado Pago (modo test)</button>
    </div>
  );
}
