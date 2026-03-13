import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const nav = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setDone(true);
      toast.success('Password reset successful!');
      setTimeout(() => nav('/login'), 2000);
    } catch(err) {
      toast.error(err.response?.data?.message || 'Invalid or expired link. Please request again.');
    }
    setLoading(false);
  };

  if (!token) return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:12}}>❌</div>
        <h2>Invalid Reset Link</h2>
        <Link to="/forgot-password" className="btn btn-primary" style={{marginTop:16,display:'inline-flex'}}>Request New Link</Link>
      </div>
    </main><Footer/></>
  );

  return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',background:'var(--bg3)',padding:'40px 20px'}}>
      <div className="card" style={{width:'100%',maxWidth:400,padding:36}}>
        {done ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:12}}>✅</div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem'}}>Password Reset!</h2>
            <p style={{color:'var(--text3)',margin:'12px 0 20px'}}>Login page पर redirect हो रहे हैं...</p>
          </div>
        ) : (
          <>
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>🔑</div>
              <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:6}}>Set New Password</h1>
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label><FiLock size={11}/> New Password</label>
                <div style={{position:'relative'}}>
                  <input type={showPw ? 'text' : 'password'} value={newPassword}
                    onChange={e=>setNewPassword(e.target.value)} placeholder="Min 6 characters" required style={{paddingRight:44}}/>
                  <button type="button" onClick={()=>setShowPw(s=>!s)}
                    style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)'}}>
                    {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Same password again" required/>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Resetting...' : '🔑 Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
    <Footer/></>
  );
}
