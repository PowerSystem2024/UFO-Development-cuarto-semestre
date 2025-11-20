// frontend/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import api, { setToken } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // ✅ evita parpadeo en el header

  // Ejecutar al iniciar la app: cargar sesión si existe token
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token);

    api.get('/auth/me')
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Si el token no sirve → borrar sesión
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));

  }, []);

  // ✅ Función login
  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);

    return api.get('/auth/me').then((res) => {
      setUser(res.data);
      return res.data;
    });
  };

  // ✅ Función logout
  const logout = () => {
  if (user) {
    localStorage.removeItem(`cart_${user.id}`);
  }
  localStorage.removeItem('token');
  setUser(null);
};


  const value = {
    user,
    login,
    logout,
    loading,  // útil si querés mostrar un spinner
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
