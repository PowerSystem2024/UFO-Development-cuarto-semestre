import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(()=> setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);
  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  return (
    <div>
      <h2>Carrito</h2>
      {cart.length===0 ? <p>No hay productos</p> :
        <div>
          <ul>
            {cart.map(i=> <li key={i.id}>{i.name} x {i.qty} - ${i.price * i.qty}</li>)}
          </ul>
          <p>Total: ${total}</p>
          <Link to="/checkout"><button>Ir a pagar</button></Link>
        </div>
      }
    </div>
  );
}
