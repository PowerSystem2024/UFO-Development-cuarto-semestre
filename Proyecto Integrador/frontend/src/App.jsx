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
import CartSidebar from "./components/CartSidebar";
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);

  const [cartOpen, setCartOpen] = React.useState(false);


  return (
    <div>
      <header className="topbar">

  {/* IZQUIERDA */}
  <div className="left">
    <Link to="/">Ver Frutas & Verduras</Link>
  </div>

  {/* BOTÓN HAMBURGUESA (solo móvil) */}
  <button className="menu-btn" onClick={() => setOpen(!open)}>
    ☰
  </button>

  {/* DERECHA */}
  <div className={`right ${open ? "open" : ""}`}>
    {user && <Link to="/cart">Carrito</Link>}

    {user ? (
      <>
        <span>Hola, {user.name} 👋</span>
        <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
      </>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <span>|</span>
        <Link to="/register">Registro</Link>
      </>
    )}
  </div>

</header>


      <main style={{ padding: 10 }}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route path="/confirmation" element={<Confirmation />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </main>
      <CartSidebar open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}
