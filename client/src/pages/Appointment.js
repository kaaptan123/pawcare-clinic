import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSettings } from '../context/ThemeContext';
import { useAuth } from '../context/AppContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiCheck, FiShield, FiPhone } from 'react-icons/fi';

const SERVICES = ['Veterinary Consultation','Full Grooming','Vaccination','Dental Cleaning','X-Ray & Diagnostics','Pet Boarding','Emergency Care','Other'];
const TIMES = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];
const PETS = ['Dog','Cat','Rabbit','Bird','Hamster','Other'];

export default function Appointment() {
  const settings = useSettings();
  const { user } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ownerName: user?.name||'', phone:'', email: user?.email||'',
    address:'', petName:'', petType:'Dog', breed:'', age:'',
    service:'', date:'', timeSlot:'', notes:''
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', {...form, patientId: user?._id||null});
      toast.success('✅ Appointment booked! Confirmation email भेजी गई।');
      setStep(3);
    } catch(err) { toast.error(err.response?.data?.message || 'Please try again'); }
    setLoading(false);
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <><Navbar/>
    <main className="page-top">
      {/* Hero */}
      <section style={{background:'var(--grad-dark)',padding:'64px 0 48px',color:'#fff'}}>
        <div className="container" style={{textAlign:'center'}}>
          <div style={{display:'inline-flex',gap:8,background:'rgba(27,67,50,.4)',padding:'5px 16px',borderRadius:20,fontSize:'.72rem',fontWeight:700,color:'#90EE90',marginBottom:14,letterSpacing:'.1em'}}>
            <FiCalendar size={12}/> EASY ONLINE BOOKING
          </div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:12}}>Book an Appointment</h1>
          <p style={{color:'rgba(255,255,255,.6)',fontSize:'.93rem'}}>
            {settings.clinic_hours||'Mon–Sat: 9AM–8PM'} · Confirmation email instantly
          </p>
        </div>
      </section>

      <section style={{padding:'56px 0',background:'var(--bg3)'}}>
        <div className="container" style={{maxWidth:800}}>

          {step === 3 ? (
            <div className="card" style={{padding:48,textAlign:'center'}}>
              <div style={{fontSize:'4rem',marginBottom:16}}>✅</div>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',marginBottom:12,color:'var(--forest2)'}}>Appointment Booked!</h2>
              <p style={{color:'var(--text2)',marginBottom:8}}>नमस्ते <strong>{form.ownerName}</strong> जी,</p>
              <p style={{color:'var(--text2)',marginBottom:28,lineHeight:1.8}}><strong>{form.petName}</strong> के लिए <strong>{form.service}</strong> की appointment {new Date(form.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})} को <strong>{form.timeSlot}</strong> पर book हो गई।</p>
              {form.email && <p style={{color:'var(--text3)',fontSize:'.85rem',marginBottom:28}}>📧 Confirmation email: <strong>{form.email}</strong></p>}
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <button className="btn btn-primary" onClick={()=>{setStep(1);setForm({...form,petName:'',service:'',date:'',timeSlot:'',notes:''});}}>Book Another</button>
                <a href={`https://wa.me/${settings.clinic_whatsapp||'917456064956'}`} target="_blank" rel="noreferrer" className="btn btn-outline">💬 WhatsApp</a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {/* Step indicators */}
              <div style={{display:'flex',gap:8,marginBottom:32,alignItems:'center',justifyContent:'center'}}>
                {[1,2].map(s=>(
                  <React.Fragment key={s}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:step>=s?'var(--grad-forest)':'var(--bg)',border:`2px solid ${step>=s?'transparent':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',color:step>=s?'#fff':'var(--text3)',fontWeight:700,fontSize:'.82rem',transition:'all .3s'}}>
                        {step>s?<FiCheck size={14}/>:s}
                      </div>
                      <span style={{fontSize:'.8rem',fontWeight:600,color:step>=s?'var(--text)':'var(--text3)'}}>{s===1?'Pet & Owner':'Schedule'}</span>
                    </div>
                    {s<2 && <div style={{flex:1,height:2,background:step>s?'var(--forest2)':'var(--border)',maxWidth:80,transition:'background .3s'}}/>}
                  </React.Fragment>
                ))}
              </div>

              <div className="card" style={{padding:32}}>
                {step === 1 && (
                  <>
                    <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:24}}>Owner & Pet Details</h3>
                    <div className="form-row">
                      <div className="form-group"><label>Owner Name *</label><input value={form.ownerName} onChange={e=>set('ownerName',e.target.value)} placeholder="आपका नाम" required/></div>
                      <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="10-digit mobile" required/></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Email (for confirmation)</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com"/></div>
                      <div className="form-group"><label>Address</label><input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Colony, Area, Agra"/></div>
                    </div>
                    <div style={{borderTop:'1px solid var(--border)',paddingTop:20,marginTop:8}}>
                      <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',marginBottom:20}}>Pet Details</h3>
                      <div className="form-row">
                        <div className="form-group"><label>Pet Name *</label><input value={form.petName} onChange={e=>set('petName',e.target.value)} placeholder="Bruno, Mitthu..." required/></div>
                        <div className="form-group"><label>Pet Type *</label>
                          <select value={form.petType} onChange={e=>set('petType',e.target.value)}>
                            {PETS.map(p=><option key={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label>Breed (optional)</label><input value={form.breed} onChange={e=>set('breed',e.target.value)} placeholder="Labrador, Persian..."/></div>
                        <div className="form-group"><label>Age</label><input value={form.age} onChange={e=>set('age',e.target.value)} placeholder="2 years, 6 months..."/></div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" style={{marginTop:8}} onClick={()=>{if(!form.ownerName||!form.phone||!form.petName)return toast.error('Required fields fill करें');setStep(2);}}>
                      Next: Schedule →
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:24}}>Choose Date & Time</h3>
                    <div className="form-group"><label>Service *</label>
                      <select value={form.service} onChange={e=>set('service',e.target.value)} required>
                        <option value="">-- Service चुनें --</option>
                        {SERVICES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Preferred Date *</label><input type="date" value={form.date} onChange={e=>set('date',e.target.value)} min={minDate} required/></div>
                    </div>
                    <div className="form-group"><label>Preferred Time *</label>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginTop:4}}>
                        {TIMES.map(t=>(
                          <button type="button" key={t} onClick={()=>set('timeSlot',t)}
                            style={{padding:'10px 8px',border:`2px solid ${form.timeSlot===t?'var(--forest2)':'var(--border)'}`,borderRadius:9,background:form.timeSlot===t?'rgba(27,67,50,.1)':'var(--inp-bg)',color:form.timeSlot===t?'var(--forest2)':'var(--text2)',fontWeight:600,fontSize:'.78rem',cursor:'pointer',transition:'all .2s'}}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group"><label>Additional Notes</label>
                      <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="कोई specific problem या request..." rows={2}/>
                    </div>
                    <div style={{display:'flex',gap:12,marginTop:8}}>
                      <button type="button" className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
                      <button type="submit" className="btn btn-primary" disabled={loading||!form.service||!form.date||!form.timeSlot}>
                        {loading ? 'Booking...' : '✅ Confirm Appointment'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          )}

          {/* Trust sidebar note */}
          <div style={{marginTop:24,background:'var(--bg)',borderRadius:12,padding:'18px 22px',border:'1px solid var(--border)',display:'flex',gap:12,alignItems:'flex-start'}}>
            <FiShield size={20} color="var(--forest2)" style={{flexShrink:0,marginTop:2}}/>
            <div style={{fontSize:'.82rem',color:'var(--text3)',lineHeight:1.7}}>
              <strong style={{color:'var(--text)'}}>आपकी booking safe है.</strong> Dr. Manoj Kumar Gupta (M.V.Sc.) personally हर appointment review करते हैं। Confirmation email 5 minutes में आएगी। कोई query? <a href={`tel:${settings.clinic_phone||'7456064956'}`} style={{color:'var(--forest2)',fontWeight:700}}>{settings.clinic_phone||'7456064956'}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
