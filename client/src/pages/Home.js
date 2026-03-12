import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSettings } from '../context/ThemeContext';
import { useCart } from '../context/AppContext';
import api, { imgUrl } from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiCalendar, FiPhone, FiArrowRight, FiCheck, FiStar,
  FiMessageCircle, FiShield, FiAward, FiHeart, FiClock,
  FiMapPin, FiChevronRight
} from 'react-icons/fi';

const SERVICES = [
  { icon:'🩺', name:'Veterinary Consultation', desc:'Expert diagnosis & treatment for all conditions', key:'price_consultation', color:'#E8F5E9' },
  { icon:'✂️', name:'Full Pet Grooming', desc:'Bath, haircut, ear cleaning & nail trim', key:'price_grooming', color:'#E3F2FD' },
  { icon:'💉', name:'Vaccination', desc:'All vaccines with official health certificate', key:'price_vaccination', color:'#FFF3E0' },
  { icon:'🦷', name:'Dental Care', desc:'Professional scaling & oral hygiene check', key:'price_dental', color:'#F3E5F5' },
  { icon:'🩻', name:'X-Ray & Diagnostics', desc:'Digital X-Ray, blood tests on same day', key:'price_xray', color:'#E0F7FA' },
  { icon:'🏠', name:'Pet Boarding', desc:'Safe, comfortable stay with round-the-clock care', key:'price_boarding', color:'#FCE4EC' },
];

const TRUST_PILLARS = [
  { icon:<FiShield size={22}/>, title:'Govt. Certified M.V.Sc.', body:'Degree from Mathura Veterinary College — officially recognised by Govt. of India.', color:'#1B4332' },
  { icon:<FiAward size={22}/>, title:'25+ Years of Experience', body:'Over two decades treating dogs, cats and small animals in Agra.', color:'#1B4332' },
  { icon:<FiHeart size={22}/>, title:'5000+ Families Trust Us', body:'Agra\'s most recommended vet clinic — word-of-mouth since 1999.', color:'#1B4332' },
  { icon:<FiClock size={22}/>, title:'24/7 Emergency Care', body:'Your pet\'s emergencies don\'t wait. Neither do we.', color:'#1B4332' },
];

const STATS = [
  { val:'25+', label:'Years Experience' },
  { val:'5000+', label:'Pets Treated' },
  { val:'4.9★', label:'Average Rating' },
  { val:'24/7', label:'Emergency Available' },
];

export default function Home() {
  const settings = useSettings();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rForm, setRForm] = useState({ name:'', city:'', petName:'', petType:'', rating:5, comment:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/products?featured=true').then(r => setProducts(r.data.slice(0,4))).catch(()=>{});
    api.get('/reviews').then(r => setReviews(r.data.slice(0,6))).catch(()=>{});
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rForm.name || !rForm.comment) return toast.error('Name और comment ज़रूरी है');
    setSubmitting(true);
    try {
      await api.post('/reviews', rForm);
      toast.success('✅ Review submit! Approval के बाद दिखेगा।');
      setRForm({ name:'', city:'', petName:'', petType:'', rating:5, comment:'' });
    } catch { toast.error('Please try again'); }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar/>
      <main className="page-top">

        {/* ══════════ HERO ══════════ */}
        <section style={{
          background:'var(--grad-dark)',
          minHeight:'92vh',
          display:'flex',
          alignItems:'center',
          position:'relative',
          overflow:'hidden',
          padding:'60px 0 80px'
        }}>
          {/* BG texture */}
          <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z'/%3E%3C/g%3E%3C/svg%3E")`}}/>
          {/* Green accent glow */}
          <div style={{position:'absolute',top:'-20%',right:'-10%',width:'60vw',height:'60vw',background:'radial-gradient(circle, rgba(27,67,50,.5) 0%, transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:'-20%',left:'-10%',width:'50vw',height:'50vw',background:'radial-gradient(circle, rgba(184,134,11,.15) 0%, transparent 70%)',pointerEvents:'none'}}/>

          <div className="container" style={{position:'relative',zIndex:1}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>

              {/* Left */}
              <div className="fade-up">
                {/* Trust badges */}
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:24}}>
                  <span className="trust-badge" style={{background:'rgba(255,255,255,.08)',color:'#90EE90',borderColor:'rgba(144,238,144,.25)',fontSize:'.7rem'}}>
                    <FiShield size={11}/> Govt. Certified M.V.Sc.
                  </span>
                  <span className="trust-badge" style={{background:'rgba(255,255,255,.08)',color:'#FFD700',borderColor:'rgba(255,215,0,.25)',fontSize:'.7rem'}}>
                    <FiAward size={11}/> 25+ Years
                  </span>
                </div>

                <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2.4rem,4.5vw,3.8rem)',fontWeight:700,color:'#fff',lineHeight:1.08,marginBottom:20}}>
                  Agra's Most<br/>
                  <em style={{fontStyle:'italic',color:'#90EE90'}}>Trusted</em> Vet<br/>
                  <span style={{color:'rgba(255,255,255,.5)',fontSize:'78%'}}>for Dogs & Cats</span>
                </h1>

                <p style={{color:'rgba(255,255,255,.65)',fontSize:'.96rem',lineHeight:1.85,marginBottom:32,maxWidth:480}}>
                  {settings.doctor_name||'Dr. Manoj Kumar Gupta'} ({settings.doctor_degree||'M.V.Sc.'}) — dedicatedly serving Agra's pet families since 1999. Backed by science, driven by love.
                </p>

                <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:40}}>
                  <Link to="/appointment" className="btn btn-primary btn-lg">
                    <FiCalendar size={17}/> Book Appointment
                  </Link>
                  <a href={`tel:${settings.clinic_phone||'7456064956'}`} className="btn btn-white btn-lg">
                    <FiPhone size={17}/> Call Now
                  </a>
                </div>

                {/* Stats row */}
                <div style={{display:'flex',gap:0,background:'rgba(255,255,255,.06)',borderRadius:14,overflow:'hidden',border:'1px solid rgba(255,255,255,.1)'}}>
                  {STATS.map((st, i) => (
                    <div key={st.label} style={{flex:1,padding:'18px 12px',textAlign:'center',borderRight:i<3?'1px solid rgba(255,255,255,.1)':'none'}}>
                      <div style={{fontSize:'1.5rem',fontWeight:800,color:'#90EE90',fontFamily:'Playfair Display,serif'}}>{st.val}</div>
                      <div style={{fontSize:'.65rem',color:'rgba(255,255,255,.45)',marginTop:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Doctor card */}
              <div className="fade-up d2" style={{position:'relative'}}>
                <div style={{
                  background:'rgba(255,255,255,.06)',
                  backdropFilter:'blur(12px)',
                  border:'1px solid rgba(255,255,255,.12)',
                  borderRadius:24,
                  overflow:'hidden',
                  aspectRatio:'4/5',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  position:'relative',
                }}>
                  {settings.doctor_photo
                    ? <img src={imgUrl(settings.doctor_photo)} alt={settings.doctor_name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : (
                      <div style={{textAlign:'center',padding:48}}>
                        <div style={{fontSize:'5rem',marginBottom:20}}>🐾</div>
                        <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',color:'#fff',fontWeight:700}}>{settings.doctor_name||'Dr. Manoj Kumar Gupta'}</div>
                        <div style={{color:'rgba(255,255,255,.5)',fontSize:'.85rem',marginTop:8}}>{settings.doctor_degree||'M.V.Sc.'} · {settings.doctor_speciality||'Dogs & Cats Specialist'}</div>
                        <div style={{marginTop:20,padding:'10px 20px',background:'rgba(27,67,50,.5)',borderRadius:8,display:'inline-block',color:'#90EE90',fontSize:'.8rem',fontWeight:600}}>
                          📸 Photo upload करें Admin Settings में
                        </div>
                      </div>
                    )
                  }

                  {/* Floating trust chip */}
                  <div style={{
                    position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',
                    background:'rgba(27,67,50,.9)',backdropFilter:'blur(12px)',
                    border:'1px solid rgba(144,238,144,.3)',
                    borderRadius:40,padding:'10px 22px',
                    display:'flex',alignItems:'center',gap:10,
                    boxShadow:'0 8px 32px rgba(0,0,0,.3)',
                    whiteSpace:'nowrap',
                  }}>
                    <div style={{width:8,height:8,background:'#90EE90',borderRadius:'50%',animation:'pulse 2s infinite'}}/>
                    <span style={{color:'#fff',fontWeight:700,fontSize:'.82rem'}}>Available Today</span>
                    <span style={{color:'rgba(255,255,255,.5)',fontSize:'.75rem'}}>· {settings.clinic_hours?.split('|')[0]||'9AM–8PM'}</span>
                  </div>
                </div>

                {/* Floating accolade cards */}
                <div style={{
                  position:'absolute',top:-16,right:-16,
                  background:'var(--grad-gold)',
                  borderRadius:16,padding:'14px 18px',
                  boxShadow:'0 8px 32px rgba(184,134,11,.4)',
                  textAlign:'center',
                }}>
                  <div style={{fontSize:'1.4rem',fontWeight:900,color:'#1A1714',lineHeight:1}}>4.9</div>
                  <div style={{color:'#B8860B',fontSize:'.9rem'}}>★★★★★</div>
                  <div style={{fontSize:'.65rem',color:'rgba(26,23,20,.6)',fontWeight:700,marginTop:2}}>Patient Rating</div>
                </div>

                <div style={{
                  position:'absolute',bottom:80,left:-20,
                  background:'var(--card-bg)',
                  border:'1px solid var(--border)',
                  borderRadius:14,padding:'12px 16px',
                  boxShadow:'var(--sh-lg)',
                  display:'flex',alignItems:'center',gap:10,
                }}>
                  <div style={{fontSize:'1.5rem'}}>🏅</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:'.82rem',color:'var(--text)'}}>M.V.Sc. Certified</div>
                    <div style={{fontSize:'.7rem',color:'var(--text3)'}}>Govt. Recognised</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ WHY TRUST US ══════════ */}
        <section style={{padding:'96px 0',background:'var(--bg)'}}>
          <div className="container">
            <div style={{textAlign:'center',marginBottom:56}}>
              <div className="s-eyebrow" style={{justifyContent:'center'}}>Why Choose DoctorG24</div>
              <h2 className="s-title" style={{textAlign:'center'}}>Built on <em>Trust,</em><br/>Backed by <span className="gold">Experience</span></h2>
              <p className="s-sub" style={{margin:'14px auto 0',textAlign:'center'}}>Your pet deserves a doctor you can fully trust — here is why thousands of Agra families do.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
              {TRUST_PILLARS.map((p,i) => (
                <div key={p.title} className={`card card-hover fade-up d${i+1}`} style={{padding:'28px 22px',textAlign:'center',borderTop:`3px solid var(--forest2)`}}>
                  <div style={{width:52,height:52,background:'var(--grad-forest)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',margin:'0 auto 18px',boxShadow:'0 6px 18px rgba(27,67,50,.35)'}}>
                    {p.icon}
                  </div>
                  <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.05rem',fontWeight:700,marginBottom:10,color:'var(--text)'}}>{p.title}</div>
                  <div style={{fontSize:'.83rem',color:'var(--text3)',lineHeight:1.7}}>{p.body}</div>
                </div>
              ))}
            </div>

            {/* Credentials strip */}
            <div style={{marginTop:40,background:'var(--bg3)',borderRadius:16,padding:'24px 32px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:20,border:'1px solid var(--border)'}}>
              {[
                {emoji:'🎓',bold:'Mathura Veterinary College',light:'M.V.Sc. Degree'},
                {emoji:'🏛️',bold:'Govt. of India Recognised',light:'Official Registration'},
                {emoji:'💼',bold:'Since 1999',light:'25+ Years Serving Agra'},
                {emoji:'📍',bold:'Agra, Uttar Pradesh',light:'doctorg24.in'},
              ].map(c=>(
                <div key={c.bold} style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:'1.6rem'}}>{c.emoji}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'.88rem',color:'var(--text)'}}>{c.bold}</div>
                    <div style={{fontSize:'.75rem',color:'var(--text3)'}}>{c.light}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ SERVICES ══════════ */}
        <section style={{padding:'80px 0',background:'var(--bg3)'}}>
          <div className="container">
            <div className="section-hdr-row">
              <div>
                <div className="s-eyebrow">Our Services</div>
                <h2 className="s-title">Complete <em>Care</em><br/>Under One Roof</h2>
              </div>
              <Link to="/services" className="btn btn-outline btn-sm">All Services <FiArrowRight size={14}/></Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
              {SERVICES.map(svc => (
                <Link to="/appointment" key={svc.name} className="card card-hover" style={{padding:'24px',display:'flex',gap:18,alignItems:'flex-start',textDecoration:'none',color:'inherit'}}>
                  <div style={{width:56,height:56,background:svc.color,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>
                    {svc.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'.93rem',marginBottom:5,color:'var(--text)'}}>{svc.name}</div>
                    <div style={{fontSize:'.8rem',color:'var(--text3)',lineHeight:1.6}}>{svc.desc}</div>
                    {settings[svc.key] && (
                      <div style={{marginTop:8,fontSize:'.78rem',fontWeight:700,color:'var(--forest2)'}}>
                        Starting ₹{settings[svc.key]}
                      </div>
                    )}
                    <div style={{marginTop:10,display:'flex',alignItems:'center',gap:4,fontSize:'.76rem',color:'var(--forest2)',fontWeight:600}}>
                      Book Now <FiChevronRight size={12}/>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ ABOUT DOCTOR ══════════ */}
        <section style={{padding:'96px 0',background:'var(--bg)'}}>
          <div className="container">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
              <div>
                <div className="s-eyebrow">Meet Your Doctor</div>
                <h2 className="s-title" style={{marginBottom:18}}>
                  {settings.doctor_name||'Dr. Manoj Kumar Gupta'}
                  <br/><em>({settings.doctor_degree||'M.V.Sc.'})</em>
                </h2>

                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:22}}>
                  <span className="trust-badge"><FiShield size={11}/> Govt. Certified</span>
                  <span className="trust-badge gold"><FiAward size={11}/> {settings.doctor_experience||'25'}+ Years</span>
                  <span className="verified-seal">✅ Verified Vet</span>
                </div>

                <p style={{color:'var(--text2)',lineHeight:1.9,fontSize:'.93rem',marginBottom:28}}>
                  {settings.doctor_bio||`Agra के सबसे भरोसेमंद पशु चिकित्सकों में से एक। 25 वर्षों से dogs, cats और छोटे animals की dedicated सेवा। आपके pet के स्वास्थ्य के लिए हमेशा present।`}
                </p>

                <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
                  {[
                    `${settings.doctor_speciality||'Dogs & Cats Specialist'}`,
                    `${settings.doctor_college||'Mathura Veterinary College'} — M.V.Sc.`,
                    'Government of India Registered Veterinarian',
                    '24/7 Emergency — Always reachable',
                  ].map(item => (
                    <div key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:'.87rem',color:'var(--text2)'}}>
                      <div style={{width:20,height:20,background:'rgba(27,67,50,.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <FiCheck size={11} color="var(--forest2)"/>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  <Link to="/appointment" className="btn btn-primary"><FiCalendar size={15}/> Book a Visit</Link>
                  <Link to="/about" className="btn btn-outline">Know More <FiArrowRight size={14}/></Link>
                </div>
              </div>

              <div style={{position:'relative'}}>
                <div style={{
                  borderRadius:24,overflow:'hidden',
                  background:'var(--grad-dark)',
                  aspectRatio:'4/5',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:'var(--sh-xl)',
                }}>
                  {settings.doctor_photo
                    ? <img src={imgUrl(settings.doctor_photo)} alt={settings.doctor_name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{textAlign:'center',color:'rgba(255,255,255,.6)',padding:40}}>
                        <div style={{fontSize:'4rem',marginBottom:16}}>👨‍⚕️</div>
                        <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem'}}>Admin → Settings<br/>में Doctor Photo<br/>upload करें</div>
                      </div>
                  }
                </div>
                {/* Decoration */}
                <div style={{
                  position:'absolute',bottom:-20,right:-20,
                  background:'var(--bg)',
                  border:'1px solid var(--border)',
                  borderRadius:16,padding:'18px 20px',
                  boxShadow:'var(--sh-lg)',
                  textAlign:'center',
                }}>
                  <div style={{fontSize:'1.8rem',fontWeight:900,fontFamily:'Playfair Display,serif',color:'var(--forest2)',lineHeight:1}}>{settings.doctor_experience||'25'}+</div>
                  <div style={{fontSize:'.7rem',color:'var(--text3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginTop:3}}>Years of<br/>Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ SHOP ══════════ */}
        {products.length > 0 && (
          <section style={{padding:'80px 0',background:'var(--bg3)'}}>
            <div className="container">
              <div className="section-hdr-row">
                <div>
                  <div className="s-eyebrow">Pet Shop</div>
                  <h2 className="s-title">Quality <em>Products</em><br/>for Your Pets</h2>
                </div>
                <Link to="/shop" className="btn btn-outline btn-sm">Full Shop <FiArrowRight size={14}/></Link>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18}}>
                {products.map(p => (
                  <div key={p._id} className="card card-hover" style={{overflow:'hidden'}}>
                    <div style={{height:180,background:p.bgColor||'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                      {p.image
                        ? <img src={imgUrl(p.image)} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        : <span style={{fontSize:'3.5rem'}}>{p.emoji}</span>
                      }
                      {p.badge && <span className={`badge badge-${p.badge}`} style={{position:'absolute',top:10,left:10}}>{p.badge}</span>}
                    </div>
                    <div style={{padding:'14px 16px'}}>
                      <div style={{fontSize:'.68rem',textTransform:'uppercase',letterSpacing:'.06em',color:'var(--text3)',fontWeight:700,marginBottom:4}}>{p.category} · {p.subType}</div>
                      <div style={{fontWeight:700,fontSize:'.88rem',marginBottom:10,lineHeight:1.3,color:'var(--text)'}}>{p.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                        <span style={{fontSize:'1rem',fontWeight:800,color:'var(--forest2)'}}>₹{p.price?.toLocaleString('en-IN')}</span>
                        {p.mrp && <span style={{fontSize:'.78rem',color:'var(--text3)',textDecoration:'line-through'}}>₹{p.mrp?.toLocaleString('en-IN')}</span>}
                      </div>
                      <button
                        className="btn btn-primary btn-sm btn-full"
                        onClick={() => { addItem(p); toast.success(`${p.emoji||'📦'} Added to cart!`); }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════ REVIEWS ══════════ */}
        <section style={{padding:'96px 0',background:'var(--bg)'}}>
          <div className="container">
            <div style={{textAlign:'center',marginBottom:56}}>
              <div className="s-eyebrow" style={{justifyContent:'center'}}>Patient Stories</div>
              <h2 className="s-title" style={{textAlign:'center'}}>What Pet Parents <em>Say</em></h2>
              <p className="s-sub" style={{margin:'12px auto 0',textAlign:'center'}}>Real reviews from real families. Every review is verified before being shown.</p>
            </div>

            {reviews.length > 0 && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginBottom:60}}>
                {reviews.map((r,i) => (
                  <div key={r._id} className={`card fade-up d${Math.min(i+1,4)}`} style={{padding:'26px',position:'relative'}}>
                    <div style={{position:'absolute',top:16,right:20,fontSize:'3.5rem',fontFamily:'Playfair Display,serif',color:'var(--border)',lineHeight:1,fontWeight:900}}>"</div>
                    <div className="star-row" style={{marginBottom:12}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                    <p style={{fontSize:'.88rem',color:'var(--text2)',lineHeight:1.8,marginBottom:20,fontStyle:'italic'}}>"{r.comment}"</p>
                    <div style={{display:'flex',gap:12,alignItems:'center',borderTop:'1px solid var(--border)',paddingTop:16}}>
                      <div style={{width:40,height:40,borderRadius:'50%',background:'var(--grad-forest)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.9rem',flexShrink:0}}>
                        {r.name?.[0]}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:'.86rem'}}>{r.name}</div>
                        <div style={{fontSize:'.74rem',color:'var(--text3)',marginTop:2}}>
                          {r.city}{r.petName&&` · 🐾 ${r.petName}`}
                        </div>
                      </div>
                      <div style={{marginLeft:'auto'}}>
                        <span className="verified-seal" style={{fontSize:'.65rem',padding:'2px 8px'}}>✅ Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Review form */}
            <div className="card" style={{padding:36,maxWidth:700,margin:'0 auto'}}>
              <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:28,paddingBottom:22,borderBottom:'1px solid var(--border)'}}>
                <div style={{width:48,height:48,background:'rgba(27,67,50,.1)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <FiMessageCircle size={22} color="var(--forest2)"/>
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:'1rem',color:'var(--text)'}}>Share Your Experience</div>
                  <div style={{fontSize:'.78rem',color:'var(--text3)',marginTop:3}}>Your review helps other pet parents in Agra. Approval के बाद show होगा।</div>
                </div>
              </div>
              <form onSubmit={submitReview}>
                <div className="form-row">
                  <div className="form-group"><label>Your Name *</label><input value={rForm.name} onChange={e=>setRForm(f=>({...f,name:e.target.value}))} placeholder="जैसे: Rajesh Verma" required/></div>
                  <div className="form-group"><label>City</label><input value={rForm.city} onChange={e=>setRForm(f=>({...f,city:e.target.value}))} placeholder="जैसे: Agra, Civil Lines"/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Pet's Name</label><input value={rForm.petName} onChange={e=>setRForm(f=>({...f,petName:e.target.value}))} placeholder="जैसे: Bruno"/></div>
                  <div className="form-group"><label>Pet Type</label>
                    <select value={rForm.petType} onChange={e=>setRForm(f=>({...f,petType:e.target.value}))}>
                      <option value="">Select</option><option>Dog</option><option>Cat</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Rating *</label>
                  <div style={{display:'flex',gap:6}}>
                    {[1,2,3,4,5].map(n=>(
                      <button type="button" key={n} onClick={()=>setRForm(f=>({...f,rating:n}))}
                        style={{background:'none',border:'none',fontSize:'1.8rem',cursor:'pointer',color:rForm.rating>=n?'var(--gold)':'var(--border)',transition:'color .15s,transform .1s',transform:rForm.rating>=n?'scale(1.1)':'scale(1)'}}>★</button>
                    ))}
                  </div>
                </div>
                <div className="form-group"><label>Your Review *</label>
                  <textarea value={rForm.comment} onChange={e=>setRForm(f=>({...f,comment:e.target.value}))} placeholder="अपना experience share करें — other pet parents को help मिलेगी..." required rows={3}/>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{marginTop:4}}>
                  {submitting ? 'Submitting...' : '⭐ Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ══════════ CTA STRIP ══════════ */}
        <section style={{background:'var(--grad-forest)',padding:'72px 0'}}>
          <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:32,flexWrap:'wrap'}}>
            <div>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(1.7rem,3vw,2.4rem)',color:'#fff',marginBottom:10}}>
                Ready to Book an Appointment?
              </h2>
              <p style={{color:'rgba(255,255,255,.65)',fontSize:'.93rem'}}>
                {settings.clinic_hours||'Mon–Sat: 9AM–8PM'} · Emergency: 24/7 · Easy online booking
              </p>
            </div>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <Link to="/appointment" className="btn btn-white btn-lg">
                <FiCalendar size={16}/> Book Now
              </Link>
              <a href={`https://wa.me/${settings.clinic_whatsapp||'917456064956'}`} target="_blank" rel="noreferrer"
                style={{display:'flex',alignItems:'center',gap:8,padding:'16px 28px',background:'#25D366',color:'#fff',borderRadius:9,fontWeight:700,fontSize:'.9rem',border:'none',cursor:'pointer'}}>
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer/>
    </>
  );
}
