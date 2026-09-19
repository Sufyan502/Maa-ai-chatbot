import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { id: string; name: string; email: string; createdAt: number };
type AuthContextValue = { user: User | null; token: string | null; loading: boolean; setSession: (token: string, user: User) => void; logout: () => void };

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('maa_auth_token');
    if (!savedToken) { setLoading(false); return; }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setToken(savedToken); setUser(data.user); })
      .catch(() => localStorage.removeItem('maa_auth_token'))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user, token, loading,
    setSession: (nextToken: string, nextUser: User) => { localStorage.setItem('maa_auth_token', nextToken); setToken(nextToken); setUser(nextUser); },
    logout: () => { localStorage.removeItem('maa_auth_token'); setToken(null); setUser(null); }
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
