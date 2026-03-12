import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// ── AUTH ──────────────────────────────────────────────────────
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const u = localStorage.getItem('pawcare_user');
    const t = localStorage.getItem('pawcare_token');
    if (u && t) setUser(JSON.parse(u));
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('pawcare_token', data.token);
    localStorage.setItem('pawcare_user', JSON.stringify(data.user));
    setUser(data.user); return data.user;
  };
  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('pawcare_token', data.token);
    localStorage.setItem('pawcare_user', JSON.stringify(data.user));
    setUser(data.user); return data.user;
  };
  const logout = () => { localStorage.removeItem('pawcare_token'); localStorage.removeItem('pawcare_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin', isPatient: user?.role === 'patient' }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

// ── CART ──────────────────────────────────────────────────────
const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (p) => setItems(prev => { const ex = prev.find(i => i._id === p._id); return ex ? prev.map(i => i._id === p._id ? { ...i, qty: i.qty+1 } : i) : [...prev, { ...p, qty:1 }]; });
  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));
  const updateQty = (id, qty) => { if (qty <= 0) return removeItem(id); setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i)); };
  const clearCart = () => setItems([]);
  const subtotal = items.reduce((a,i) => a + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const delivery = 50;
  const total = subtotal + gst + delivery;
  const totalItems = items.reduce((a,i) => a + i.qty, 0);
  return <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, gst, delivery, total, totalItems }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
