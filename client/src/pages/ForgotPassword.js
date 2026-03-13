import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Email check करें।');
    } catch(err) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',background:'var(--bg3)',padding:'40px 20px'}}>
      <div className="card" style={{width:'100%',maxWidth:420,padding:36}}>
        {sent ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:16}}>📧</div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:12}}>Email Sent!</h2>
            <p style={{color:'var(--text3)',fontSize:'.88rem',lineHeight:1.7,marginBottom:24}}>
              अगर <strong>{email}</strong> हमारे system में है, तो password reset link भेज दिया गया है।<br/>
              <br/>Please अपना Gmail inbox check करें। Spam folder भी देखें।
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              <FiArrowLeft size={14}/> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>🔐</div>
              <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:6}}>Forgot Password?</h1>
              <p style={{color:'var(--text3)',fontSize:'.84rem'}}>अपना email enter करें — reset link भेजेंगे</p>
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label><FiMail size={11}/> Registered Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="your@email.com" required autoFocus/>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending...' : '📧 Send Reset Link'}
              </button>
            </form>
            <div style={{textAlign:'center',marginTop:18}}>
              <Link to="/login" style={{color:'var(--forest2)',fontSize:'.82rem',fontWeight:600,display:'inline-flex',alignItems:'center',gap:4}}>
                <FiArrowLeft size={12}/> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
    <Footer/></>
  );
}
