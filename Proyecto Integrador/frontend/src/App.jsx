// frontend/src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from "./components/PrivateRoute";


import { AuthContext } from './context/AuthContext';   // ✅ IMPORTANTE


export default function App() {
  const { user, logout } = useContext(AuthContext);   // ✅ Extraemos usuario y logout
  

  return (
    <div>
      <header  className="topbar" style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Frutería & Verdulería</Link> | 
        {user && (
        <>
          <Link to="/cart">Carrito</Link> |
        </>
      )} 

        {/* ✅ Si hay usuario logueado → muestra nombre y botón de logout */}
        {user ? (
          <>
            <span style={{ marginLeft: 10 }}>Hola, {user.name} 👋</span>

            <button 
              onClick={logout}
              style={{ marginLeft: 10 }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
        /* ❌ Si NO hay usuario logueado → muestra Login y Registro */
          <>
            <Link to="/login" style={{ marginLeft: 10 }}>Login</Link> |
            <Link to="/register" style={{ marginLeft: 10 }}>Registro</Link>
          </>
        )}

      </header>

      <main style={{ padding: 10 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>}/>
          <Route path="/confirmation" element={<Confirmation />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
