// frontend/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const r = await api.post('/auth/login', { email, password });
      const token = r.data.token;

      await login(token);

      setResponse('Login correcto');
      navigate('/');
    } catch (err) {
      setResponse('Error: ' + (err.response?.data?.error || 'Credenciales incorrectas'));
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>

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

          <button className="auth-btn" type="submit">Ingresar</button>
        </form>

        {response && <p className="auth-response">{response}</p>}
      </div>
    </div>
  );
}
