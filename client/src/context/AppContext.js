import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

// ── AUTH ─────────────────────────────────────────────────────
const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('doctorg24_user') || 'null'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('doctorg24_token', r.data.token);
    localStorage.setItem('doctorg24_user', JSON.stringify(r.data.user));
    setUser(r.data.user);
    return r.data.user;
  }, []);

  const register = useCallback(async (data) => {
    const r = await api.post('/auth/register', data);
    localStorage.setItem('doctorg24_token', r.data.token);
    localStorage.setItem('doctorg24_user', JSON.stringify(r.data.user));
    setUser(r.data.user);
    return r.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('doctorg24_token');
    localStorage.removeItem('doctorg24_user');
    setUser(null);
  }, []);

  // Call this after profile update to sync user in state + localStorage
  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('doctorg24_user', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthCtx.Provider>
  );
}

// ── CART ─────────────────────────────────────────────────────
const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dg24_cart') || '[]'); } catch{ return []; }
  });

  useEffect(() => {
    localStorage.setItem('dg24_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) { setItems(prev => prev.filter(i => i._id !== id)); return; }
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery   = subtotal > 0 ? 50 : 0;
  const gst        = Math.round(subtotal * 0.05);
  const total      = subtotal + delivery + gst;

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, delivery, gst, total }}>
      {children}
    </CartCtx.Provider>
  );
}
