import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AppContext';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FiCalendar, FiShoppingBag, FiUser, FiLock,
  FiEye, FiEyeOff, FiPhone, FiMail, FiMapPin, FiRefreshCw
} from 'react-icons/fi';

const APPT_STATUS = {
  pending:   { bg:'rgba(212,160,23,.1)',  color:'#7D5A00',  label:'⏳ Pending'   },
  confirmed: { bg:'rgba(27,67,50,.1)',    color:'#1B4332',  label:'✅ Confirmed'  },
  completed: { bg:'rgba(79,139,255,.1)',  color:'#1A3A7A',  label:'🎉 Completed' },
  cancelled: { bg:'rgba(192,57,43,.1)',   color:'#7A1A1A',  label:'❌ Cancelled' },
};
const ORDER_STATUS = {
  placed:     { bg:'rgba(212,160,23,.1)', color:'#7D5A00', label:'📦 Placed'    },
  processing: { bg:'rgba(79,139,255,.1)', color:'#1A3A7A', label:'⚙️ Processing'},
  shipped:    { bg:'rgba(27,67,50,.1)',   color:'#1B4332', label:'🚚 Shipped'   },
  delivered:  { bg:'rgba(27,67,50,.12)', color:'#1B4332',  label:'✅ Delivered' },
  cancelled:  { bg:'rgba(192,57,43,.1)', color:'#7A1A1A',  label:'❌ Cancelled' },
};

export default function PatientDashboard() {
  const { user, loading, updateUser } = useAuth();
  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders]             = useState([]);
  const [apptLoading, setApptLoading]   = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);

  // Password change
  const [pwForm, setPwForm]   = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [showPw, setShowPw]   = useState({ cur:false, new:false, con:false });
  const [pwLoading, setPwLoading] = useState(false);

  // Profile
  const [profileForm, setProfileForm]     = useState({ name:'', phone:'', city:'', address:'' });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name:user.name||'', phone:user.phone||'', city:user.city||'', address:user.address||'' });
      api.get('/appointments/mine').then(r => setAppointments(r.data)).finally(() => setApptLoading(false));
      api.get('/orders/mine').then(r => setOrders(r.data)).finally(() => setOrderLoading(false));
    }
  }, [user]);

  const refreshAppointments = () => {
    setApptLoading(true);
    api.get('/appointments/mine').then(r => setAppointments(r.data)).finally(() => setApptLoading(false));
  };

  if (loading) return <div className="spinner" style={{marginTop:'40vh'}}/>;
  if (!user)   return <Navigate to="/login"/>;

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('New passwords do not match');
    setPwLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('✅ Password changed successfully!');
      setPwForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch(err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setPwLoading(false);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const updated = await api.put('/auth/profile', profileForm);
      updateUser(updated.data);
      toast.success('✅ Profile updated!');
    } catch(err) {
      toast.error('Could not save profile');
    }
    setProfileLoading(false);
  };

  const tabs = [
    { id:'appointments', icon:<FiCalendar size={15}/>, label:'Appointments' },
    { id:'orders',       icon:<FiShoppingBag size={15}/>, label:'My Orders' },
    { id:'profile',      icon:<FiUser size={15}/>, label:'My Profile' },
    { id:'security',     icon:<FiLock size={15}/>, label:'Password' },
  ];

  return (
    <><Navbar/>
    <main className="page-top">
      {/* Header */}
      <div style={{background:'var(--grad-dark)',padding:'48px 0 36px',color:'#fff'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(27,67,50,.6)',border:'2px solid rgba(144,238,144,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:800,color:'#90EE90'}}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',fontWeight:700}}>{user.name}</div>
              <div style={{color:'rgba(255,255,255,.5)',fontSize:'.82rem',marginTop:2}}>{user.email}</div>
            </div>
            <Link to="/appointment" className="btn btn-white btn-sm" style={{marginLeft:'auto'}}>
              <FiCalendar size={13}/> Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div style={{background:'var(--bg3)',minHeight:'60vh',padding:'0 0 60px'}}>
        <div className="container">
          {/* Tabs */}
          <div style={{display:'flex',gap:4,padding:'16px 0',overflowX:'auto',borderBottom:'1px solid var(--border)',background:'var(--bg3)'}}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display:'flex',alignItems:'center',gap:7,padding:'10px 18px',
                  borderRadius:9,border:'none',cursor:'pointer',
                  background: tab===t.id ? 'var(--grad-forest)' : 'none',
                  color: tab===t.id ? '#fff' : 'var(--text2)',
                  fontWeight: tab===t.id ? 700 : 500,
                  fontSize:'.84rem',transition:'all .2s',whiteSpace:'nowrap'
                }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          <div style={{paddingTop:28}}>

            {/* ── APPOINTMENTS ── */}
            {tab === 'appointments' && (
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                  <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700}}>My Appointments</div>
                  <button onClick={refreshAppointments}
                    style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'1.5px solid var(--border)',padding:'7px 14px',borderRadius:8,cursor:'pointer',fontSize:'.8rem',color:'var(--text2)',fontWeight:600}}>
                    <FiRefreshCw size={13}/> Refresh
                  </button>
                </div>
                {apptLoading ? <div className="spinner"/> : appointments.length === 0 ? (
                  <div className="card" style={{padding:48,textAlign:'center'}}>
                    <div style={{fontSize:'3rem',marginBottom:12}}>📅</div>
                    <div style={{fontWeight:700,marginBottom:8}}>No appointments yet</div>
                    <div style={{color:'var(--text3)',fontSize:'.85rem',marginBottom:20}}>Book your first appointment with Dr. Manoj Kumar Gupta</div>
                    <Link to="/appointment" className="btn btn-primary">Book Appointment</Link>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {appointments.map(a => {
                      const st = APPT_STATUS[a.status] || APPT_STATUS.pending;
                      return (
                        <div key={a._id} className="card" style={{padding:'20px 24px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
                            <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                              <div style={{fontSize:'2rem'}}>🐾</div>
                              <div>
                                <div style={{fontWeight:800,fontSize:'.95rem'}}>{a.petName} <span style={{color:'var(--text3)',fontWeight:500}}>({a.petType})</span></div>
                                <div style={{fontSize:'.83rem',color:'var(--text2)',marginTop:3}}>
                                  {a.service} · {new Date(a.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})} at <strong>{a.timeSlot}</strong>
                                </div>
                                {a.fee && <div style={{fontSize:'.8rem',color:'var(--forest2)',fontWeight:700,marginTop:4}}>Fee: ₹{a.fee}</div>}
                                {a.adminNote && (
                                  <div style={{marginTop:8,background:'rgba(27,67,50,.06)',borderRadius:7,padding:'8px 12px',fontSize:'.8rem',color:'var(--text2)'}}>
                                    📋 Doctor's Note: {a.adminNote}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span style={{padding:'5px 14px',borderRadius:20,fontWeight:700,fontSize:'.78rem',background:st.bg,color:st.color,whiteSpace:'nowrap'}}>{st.label}</span>
                          </div>
                          {a.status === 'pending' && (
                            <div style={{marginTop:12,padding:'10px 14px',background:'rgba(212,160,23,.06)',borderRadius:8,fontSize:'.78rem',color:'#7D5A00'}}>
                              ⏳ Your appointment is under review. Dr. Gupta will confirm soon. For urgent queries, call <a href="tel:7456064956" style={{color:'var(--forest2)',fontWeight:700}}>7456064956</a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab === 'orders' && (
              <div>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,marginBottom:20}}>My Orders</div>
                {orderLoading ? <div className="spinner"/> : orders.length === 0 ? (
                  <div className="card" style={{padding:48,textAlign:'center'}}>
                    <div style={{fontSize:'3rem',marginBottom:12}}>🛍️</div>
                    <div style={{fontWeight:700,marginBottom:8}}>No orders yet</div>
                    <div style={{color:'var(--text3)',fontSize:'.85rem',marginBottom:20}}>Browse our pet shop for quality products</div>
                    <Link to="/shop" className="btn btn-primary">Visit Shop</Link>
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {orders.map(o => {
                      const st = ORDER_STATUS[o.status] || ORDER_STATUS.placed;
                      return (
                        <div key={o._id} className="card" style={{padding:'20px 24px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12,marginBottom:14}}>
                            <div>
                              <div style={{fontWeight:800,fontSize:'.88rem'}}>Order #{o._id.slice(-6).toUpperCase()}</div>
                              <div style={{fontSize:'.78rem',color:'var(--text3)',marginTop:3}}>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:12}}>
                              <span style={{fontWeight:800,color:'var(--forest2)',fontSize:'1rem'}}>₹{o.total?.toLocaleString('en-IN')}</span>
                              <span style={{padding:'4px 12px',borderRadius:20,fontWeight:700,fontSize:'.76rem',background:st.bg,color:st.color}}>{st.label}</span>
                            </div>
                          </div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                            {o.items?.map((item,i) => (
                              <span key={i} style={{padding:'4px 12px',background:'var(--bg3)',borderRadius:6,fontSize:'.78rem',fontWeight:600}}>
                                {item.emoji||'📦'} {item.name} ×{item.quantity}
                              </span>
                            ))}
                          </div>
                          {o.address && (
                            <div style={{marginTop:12,fontSize:'.78rem',color:'var(--text3)',display:'flex',alignItems:'center',gap:5}}>
                              <FiMapPin size={11}/> {o.address}, {o.city}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab === 'profile' && (
              <div style={{maxWidth:520}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,marginBottom:24}}>My Profile</div>
                <div className="card" style={{padding:'28px'}}>
                  {/* Read-only email */}
                  <div style={{background:'var(--bg3)',borderRadius:10,padding:'12px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:10}}>
                    <FiMail size={14} color="var(--text3)"/>
                    <div>
                      <div style={{fontSize:'.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text3)'}}>Email (cannot change)</div>
                      <div style={{fontWeight:700,fontSize:'.88rem',marginTop:2}}>{user.email}</div>
                    </div>
                  </div>
                  <form onSubmit={saveProfile}>
                    <div className="form-group"><label>Full Name</label><input value={profileForm.name} onChange={e=>setProfileForm(f=>({...f,name:e.target.value}))}/></div>
                    <div className="form-group">
                      <label><FiPhone size={10}/> Phone</label>
                      <input value={profileForm.phone} onChange={e=>setProfileForm(f=>({...f,phone:e.target.value}))} placeholder="10-digit mobile number"/>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>City</label><input value={profileForm.city} onChange={e=>setProfileForm(f=>({...f,city:e.target.value}))}/></div>
                      <div className="form-group"><label>Address</label><input value={profileForm.address} onChange={e=>setProfileForm(f=>({...f,address:e.target.value}))}/></div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                      {profileLoading ? 'Saving...' : '💾 Save Profile'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── PASSWORD ── */}
            {tab === 'security' && (
              <div style={{maxWidth:460}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',fontWeight:700,marginBottom:24}}>Change Password</div>
                <div className="card" style={{padding:'28px'}}>
                  <form onSubmit={changePassword}>
                    {/* Current password */}
                    <div className="form-group">
                      <label><FiLock size={10}/> Current Password</label>
                      <div style={{position:'relative'}}>
                        <input type={showPw.cur ? 'text':'password'} value={pwForm.currentPassword}
                          onChange={e=>setPwForm(f=>({...f,currentPassword:e.target.value}))}
                          placeholder="••••••••" required style={{paddingRight:44}}/>
                        <button type="button" onClick={()=>setShowPw(s=>({...s,cur:!s.cur}))}
                          style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)'}}>
                          {showPw.cur ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </button>
                      </div>
                    </div>
                    {/* New password */}
                    <div className="form-group">
                      <label>New Password</label>
                      <div style={{position:'relative'}}>
                        <input type={showPw.new ? 'text':'password'} value={pwForm.newPassword}
                          onChange={e=>setPwForm(f=>({...f,newPassword:e.target.value}))}
                          placeholder="Min 6 characters" required style={{paddingRight:44}}/>
                        <button type="button" onClick={()=>setShowPw(s=>({...s,new:!s.new}))}
                          style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)'}}>
                          {showPw.new ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </button>
                      </div>
                    </div>
                    {/* Confirm password */}
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <div style={{position:'relative'}}>
                        <input type={showPw.con ? 'text':'password'} value={pwForm.confirm}
                          onChange={e=>setPwForm(f=>({...f,confirm:e.target.value}))}
                          placeholder="Same as above" required style={{paddingRight:44}}/>
                        <button type="button" onClick={()=>setShowPw(s=>({...s,con:!s.con}))}
                          style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text3)'}}>
                          {showPw.con ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </button>
                      </div>
                    </div>
                    {/* Password strength hint */}
                    {pwForm.newPassword && (
                      <div style={{marginBottom:16,fontSize:'.78rem',color: pwForm.newPassword.length >= 8 ? 'var(--forest2)' : pwForm.newPassword.length >= 6 ? 'var(--gold)' : 'var(--crimson)'}}>
                        {pwForm.newPassword.length >= 8 ? '✅ Strong password' : pwForm.newPassword.length >= 6 ? '⚠️ Acceptable (8+ chars recommended)' : '❌ Too short (min 6 chars)'}
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                      {pwLoading ? 'Changing...' : '🔐 Change Password'}
                    </button>
                  </form>
                  <div style={{marginTop:20,borderTop:'1px solid var(--border)',paddingTop:16,fontSize:'.8rem',color:'var(--text3)'}}>
                    Password भूल गए? <Link to="/forgot-password" style={{color:'var(--forest2)',fontWeight:700}}>Reset via Email</Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
    <Footer/></>
  );
}
