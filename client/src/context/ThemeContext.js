import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

const ThemeCtx    = createContext();
const SettingsCtx = createContext();

export function useTheme()    { return useContext(ThemeCtx); }
export function useSettings() { return useContext(SettingsCtx); }

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('dg24_theme') === 'dark');
  const toggle = () => setDark(d => {
    const next = !d;
    localStorage.setItem('dg24_theme', next ? 'dark' : 'light');
    return next;
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <ThemeCtx.Provider value={{ dark, toggle }}>{children}</ThemeCtx.Provider>;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    api.get('/settings')
      .then(r => { setSettings(r.data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Refresh settings (called after admin saves)
  const refresh = useCallback(() => { load(); }, [load]);

  const value = { ...settings, _loaded: loaded, _refresh: refresh };
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}
