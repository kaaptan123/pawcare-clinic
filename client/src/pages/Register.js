import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', city:'Agra' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to DoctorG24 🐾');
      nav('/patient/dashboard');
    } catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',background:'var(--bg3)',padding:'40px 20px'}}>
      <div className="card" style={{width:'100%',maxWidth:460,padding:36}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:'2rem',marginBottom:8}}>🐾</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:4}}>Create Account</h1>
          <p style={{color:'var(--text3)',fontSize:'.83rem'}}>Join DoctorG24 — manage appointments & orders easily</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="आपका पूरा नाम" required/></div>
          <div className="form-row">
            <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit number"/></div>
          </div>
          <div className="form-group"><label>City</label><input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/></div>
          <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 6 characters" required/></div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:4}}>
            {loading ? 'Creating...' : '🐾 Create Account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:18,fontSize:'.83rem',color:'var(--text3)'}}>
          Already have account? <Link to="/login" style={{color:'var(--forest2)',fontWeight:700}}>Login</Link>
        </div>
      </div>
    </main>
    <Footer/></>
  );
}
