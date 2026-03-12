import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🐾`);
      nav(user.role === 'admin' ? '/admin' : '/patient/dashboard');
    } catch(err) { toast.error(err.response?.data?.message || 'Invalid credentials'); }
    setLoading(false);
  };

  return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',background:'var(--bg3)',padding:'40px 20px'}}>
      <div className="card" style={{width:'100%',maxWidth:420,padding:36}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:'2.5rem',marginBottom:10}}>🐾</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.6rem',marginBottom:6}}>Welcome Back</h1>
          <p style={{color:'var(--text3)',fontSize:'.85rem'}}>Login to manage your appointments & orders</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group"><label><FiMail size={11}/> Email Address</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" required autoFocus/></div>
          <div className="form-group"><label><FiLock size={11}/> Password</label><input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required/></div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:6}} disabled={loading}>
            <FiLogIn size={15}/>{loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:20,fontSize:'.84rem',color:'var(--text3)'}}>
          New here? <Link to="/register" style={{color:'var(--forest2)',fontWeight:700}}>Create Account</Link>
        </div>
      </div>
    </main>
    <Footer/></>
  );
}
