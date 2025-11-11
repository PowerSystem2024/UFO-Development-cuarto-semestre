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
      console.log(r);
      setResponse('Usuario registrado correctamente');
    } catch (err) {
      console.log(err); // Para ver el error real en consola
      setResponse('Error: ' + (err.response?.data?.error || 'Error desconocido'));
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input 
          placeholder="Nombre" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        /><br /><br />

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

        <button type="submit">Registrar</button>
      </form>

      {response && <p>{response}</p>}
    </div>
  );
}
