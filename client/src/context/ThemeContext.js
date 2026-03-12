import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// ── THEME ─────────────────────────────────────────────────────
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('pawcare_theme') === 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('pawcare_theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);

// ── SETTINGS ──────────────────────────────────────────────────
const SettingsContext = createContext({});
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  useEffect(() => { api.get('/settings').then(r => setSettings(r.data)).catch(() => {}); }, []);
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
export const useSettings = () => useContext(SettingsContext);
