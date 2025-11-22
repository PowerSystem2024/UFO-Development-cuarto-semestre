import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    async function load() {
      const r = await api.get('/products');
      setProducts(r.data);
    }
    load();
  }, []);
  return (
    <div>
      <h1 style={{ color: '#c4cacaff' }}>Productos</h1>
      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p.id}>
  <img src={`/frutas/${p.image}`} alt={p.name} />

  <h3>{p.name}</h3>
  <p>{p.description}</p>
  <p>${p.price}</p>

  <button className="btn-primary" onClick={() => {
    const key = user ? `cart_${user.id}` : "cart_guest";
    const cart = JSON.parse(localStorage.getItem(key) || "[]");
    const found = cart.find(i=>i.id===p.id);

    if(found) found.qty++;
    else cart.push({ id: p.id, name: p.name, price: Number(p.price), qty: 1, image: p.image });

    localStorage.setItem(key, JSON.stringify(cart));
    alert('Agregado al carrito');
  }}>Agregar</button>
</div>

        ))}
      </div>
    </div>
  );
}
