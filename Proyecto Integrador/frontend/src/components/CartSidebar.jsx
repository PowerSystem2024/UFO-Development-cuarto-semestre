import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CartSidebar({ open, setOpen }) {

  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const key = user ? `cart_${user.id}` : "cart_guest";

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setCart(data);
  }, [key, open]); // refresca cuando abrís el panel

  const total = cart.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  return (
    <>
      {/* BOTÓN FLOTANTE */}
        <button className="cart-float-btn" onClick={() => setOpen(!open)}>
            🛒

            {/* 🔵 BURBUJA con cantidad */}
            {cart.length > 0 && (
                <span className="cart-badge">
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
                )}
        </button>

      {/* PANEL LATERAL */}
      <div className={`cart-side-panel ${open ? "open" : ""}`}>

        <h3>Mi Carrito</h3>

        {cart.length === 0 ? (
            <>
                <p>No hay productos</p>

                {/* 🔹 Agrego botón para cerrar aunque esté vacío */}
                <button
                className="close-cart-btn"
                onClick={() => setOpen(false)}
                style={{ marginTop: "20px" }}
                >
                    Cerrar ✖
                </button>
            </>
            ) : (

          <div className="mini-cart-list">
            {cart.map((item) => (
              <div className="mini-cart-item" key={item.id}>

                <img
                  src={`/frutas/${item.image}`}
                  alt={item.name}
                />

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
      </div>
    </>
  );
}
