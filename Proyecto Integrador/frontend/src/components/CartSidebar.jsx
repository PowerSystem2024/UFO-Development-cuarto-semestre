import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CartSidebar({ open, setOpen }) {

  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Key solo si hay usuario
  const key = user ? `cart_${user.id}` : null;

  // =============================
  // 🔄 CARGAR CARRITO AL MONTAR Y AL ABRIR PANEL
  // =============================
  const loadCart = () => {
    if (!user) {
      setCart([]);
      return;
    }

    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, [key, open, user]);


  // =============================
  // 🟦 ESCUCHAR EVENTO GLOBAL cartUpdated
  // (esto actualiza el número del carrito inmediatamente)
  // =============================
  useEffect(() => {
    const handler = () => loadCart();
    window.addEventListener("cartUpdated", handler);

    return () => window.removeEventListener("cartUpdated", handler);
  }, [user]);


  // 🔢 TOTAL DE ITEMS
  const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // 💲 TOTAL A PAGAR
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {/* 🔘 BOTÓN FLOTANTE */}
      <button
        className="cart-float-btn"
        onClick={() => {
          if (!user) {
            alert("Debes iniciar sesión para ver tu carrito.");
            return;
          }
          setOpen(!open);
        }}
      >
        🛒

        {/* 🔴 BURBUJA DE CANTIDAD */}
        {user && cartQty > 0 && (
          <span className="cart-badge">{cartQty}</span>
        )}
      </button>


      {/* ============================
            PANEL LATERAL
      ============================= */}
      <div className={`cart-side-panel ${open ? "open" : ""}`}>
        
        {!user ? (
          <div style={{ paddingTop: "30px" }}>
            <p>Inicia sesión para ver tu carrito.</p>
            <button
              className="close-cart-btn"
              onClick={() => setOpen(false)}
            >
              Cerrar ✖
            </button>
          </div>
        ) : (
          <>
            <h3>Mi Carrito</h3>

            {cart.length === 0 ? (
              <>
                <p>No hay productos</p>
                <button
                  className="close-cart-btn"
                  onClick={() => setOpen(false)}
                >
                  Cerrar ✖
                </button>
              </>
            ) : (
              <div className="mini-cart-list">
                
                {cart.map((item) => (
                  <div className="mini-cart-item" key={item.id}>
                    <img src={`/frutas/${item.image}`} alt={item.name} />

                    <div className="mini-cart-info">
                      <strong>{item.name}</strong>
                      <span>Cant: {item.qty}</span>
                      <span className="mini-cart-price">
                        ${item.price * item.qty}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mini-cart-total">
                  <p>Total:</p>
                  <strong>${total}</strong>
                </div>

                <Link to="/cart" onClick={() => setOpen(false)}>
                  <button className="auth-btn">Ver carrito completo</button>
                </Link>

                <button
                  className="close-cart-btn"
                  onClick={() => setOpen(false)}
                >
                  Cerrar ✖
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
