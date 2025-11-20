// frontend/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const { login } = useContext(AuthContext);   // ✅ usamos login() del contexto
  const navigate = useNavigate();              // ✅ para redirigir después del login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Pedido al backend
      const r = await api.post('/auth/login', { email, password });

      const token = r.data.token;

      // 2. Actualizar contexto + guardar token + obtener /auth/me
      await login(token);

      setResponse('Login correcto');
      
      // 3. Redirigir al home o donde quieras
      navigate('/');

    } catch (err) {
      setResponse('Error: ' + (err.response?.data?.error || 'Credenciales incorrectas'));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Ingresar</button>
      </form>

      {response && <p>{response}</p>}
    </div>
  );
}
