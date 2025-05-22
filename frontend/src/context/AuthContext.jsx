import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(); // 👈 for old components

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const login = (userData, rememberMe = false) => {
    if (user?.token === userData.token) return;

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('user');
    }

    setUser(userData);
  };

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth hook for modern usage
export const useAuth = () => useContext(AuthContext);
