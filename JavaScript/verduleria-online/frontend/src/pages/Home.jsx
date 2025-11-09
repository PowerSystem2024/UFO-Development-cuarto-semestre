import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function load() {
      const r = await api.get('/products');
      setProducts(r.data);
    }
    load();
  }, []);
  return (
    <div>
      <h2>Productos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>${p.price}</p>
            <button onClick={() => {
              const cart = JSON.parse(localStorage.getItem('cart') || '[]');
              const found = cart.find(i=>i.id===p.id);
              if(found) found.qty++;
              else cart.push({ id: p.id, name: p.name, price: Number(p.price), qty: 1 });
              localStorage.setItem('cart', JSON.stringify(cart));
              alert('Agregado al carrito');
            }}>Agregar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
