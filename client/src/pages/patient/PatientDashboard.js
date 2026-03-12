import React from 'react';
import { useAuth } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
export default function PatientDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{marginTop:'40vh'}}/>;
  if (!user) return <Navigate to="/login"/>;
  return (<><Navbar/><main className="page-top"><div className="container" style={{padding:'40px 5%'}}><h1>Welcome, {user.name} 🐾</h1><p style={{color:'var(--text3)',marginTop:8}}>Your patient dashboard coming soon.</p></div></main></>);
}
