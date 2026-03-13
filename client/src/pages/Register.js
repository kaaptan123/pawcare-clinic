import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', city:'Agra' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('🐾 Welcome to DoctorG24! Account created.');
      nav('/patient/dashboard');
    } catch(err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',background:'var(--bg3)',padding:'40px 20px'}}>
      <div className="card" style={{width:'100%',maxWidth:460,padding:36}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:'2rem',marginBottom:8}}>🐾</div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:4}}>Create Account</h1>
          <p style={{color:'var(--text3)',fontSize:'.83rem'}}>Join DoctorG24 — appointments & orders manage करें</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="आपका पूरा नाम" required/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com" required/>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit number"/>
            </div>
          </div>
          <div className="form-group">
            <label>City</label>
            <input value={form.city} onChange={e=>set('city',e.target.value)} placeholder="Agra"/>
          </div>
          <div className="form-group">
            <label>Password *</label>
            <div style={{position:'relative'}}>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e=>set('password',e.target.value)}
                placeholder="Min 6 characters"
                required
                style={{paddingRight:44}}/>
              <button type="button" onClick={()=>setShowPw(s=>!s)}
                style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center'}}>
                {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
              </button>
            </div>
            {form.password && (
              <div style={{marginTop:5,fontSize:'.74rem',color:form.password.length>=8?'var(--forest2)':form.password.length>=6?'var(--gold)':'var(--crimson)'}}>
                {form.password.length>=8?'✅ Strong':'⚠️ Minimum 6 characters required'}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop:4}}>
            {loading ? 'Creating Account...' : '🐾 Create Account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:18,fontSize:'.83rem',color:'var(--text3)'}}>
          Already have account? <Link to="/login" style={{color:'var(--forest2)',fontWeight:700}}>Login here</Link>
        </div>
      </div>
    </main>
    <Footer/></>
  );
}
