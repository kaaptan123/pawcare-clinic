import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'guptamanukrishna10@gmail.com', password:'' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') { toast.error('Admin access required'); setLoading(false); return; }
      toast.success('Welcome, Dr. Gupta! 🐾');
      nav('/admin');
    } catch(err) { toast.error(err.response?.data?.message || 'Invalid credentials'); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--grad-dark)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'var(--surface)',borderRadius:20,padding:40,width:'100%',maxWidth:400,boxShadow:'0 24px 80px rgba(0,0,0,.5)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,background:'var(--grad-forest)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',margin:'0 auto 14px',boxShadow:'0 8px 24px rgba(27,67,50,.4)'}}>🐾</div>
          <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',fontWeight:700}}>DoctorG<span style={{color:'var(--forest2)'}}>24</span></div>
          <div style={{color:'var(--text3)',fontSize:'.8rem',marginTop:4}}>Admin Control Panel</div>
        </div>
        <form onSubmit={submit}>
          <div className="form-group"><label><FiLock size={10}/> Email</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
          <div className="form-group"><label><FiLock size={10}/> Password</label><input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required/></div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:8}} disabled={loading}>
            {loading ? 'Logging in...' : '🔐 Admin Login'}
          </button>
        </form>
        <div style={{marginTop:18,background:'var(--bg3)',borderRadius:10,padding:14,fontSize:'.76rem',color:'var(--text3)'}}>
          <div style={{fontWeight:800,color:'var(--text)',marginBottom:4}}>Default Login:</div>
          <div>Email: guptamanukrishna10@gmail.com</div>
          <div>Password: DrManoj@2025</div>
        </div>
        <div style={{textAlign:'center',marginTop:14}}>
          <Link to="/" style={{color:'var(--text3)',fontSize:'.78rem'}}>← Back to DoctorG24</Link>
        </div>
      </div>
    </div>
  );
}
