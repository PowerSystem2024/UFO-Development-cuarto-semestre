// frontend/src/pages/Register.jsx

import React, { useState } from 'react';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/auth/register', { name, email, password });
      console.log(r.data);
      setResponse('Usuario registrado correctamente');
    } catch (err) {
      setResponse('Error: ' + (err.response?.data?.error || 'Error desconocido'));
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
        <h2>Registro</h2>

        <form onSubmit={handleRegister}>

          <input
            className="auth-input"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="auth-btn" type="submit">Registrar</button>
        </form>

        {response && <p className="auth-response">{response}</p>}
      </div>
    </div>
  );
}
