import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/ThemeContext';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiShield, FiAward } from 'react-icons/fi';

export default function Footer() {
  const s = useSettings();
  const yr = new Date().getFullYear();
  return (
    <footer style={{background:'var(--forest)',color:'rgba(255,255,255,.8)',marginTop:80}}>
      {/* Trust band */}
      <div style={{background:'rgba(0,0,0,.2)',padding:'20px 0',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
        <div className="container" style={{display:'flex',justifyContent:'center',gap:40,flexWrap:'wrap',alignItems:'center'}}>
          {[
            {icon:'🏅', text:'M.V.Sc. Certified'},
            {icon:'🐾', text:'25+ Years Experience'},
            {icon:'💚', text:'5000+ Pets Treated'},
            {icon:'⭐', text:'4.9/5 Rating'},
            {icon:'🚨', text:'24/7 Emergency'},
            {icon:'💳', text:'UPI / Cash Accepted'},
          ].map(t => (
            <div key={t.text} style={{display:'flex',alignItems:'center',gap:8,fontSize:'.82rem',fontWeight:600}}>
              <span>{t.icon}</span><span style={{opacity:.85}}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{padding:'56px 5% 40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1.2fr',gap:48}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div style={{width:48,height:48,background:'rgba(255,255,255,.12)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>🐾</div>
              <div>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',fontWeight:700,color:'#fff',lineHeight:1.1}}>DoctorG<span style={{color:'#90EE90'}}>24</span></div>
                <div style={{fontSize:'.65rem',opacity:.5,marginTop:2}}>doctorg24.in</div>
              </div>
            </div>
            <p style={{fontSize:'.84rem',lineHeight:1.8,opacity:.65,marginBottom:20}}>{s.doctor_name||'Dr. Manoj Kumar Gupta'} ({s.doctor_degree||'M.V.Sc.'}) — {s.doctor_experience||'25'}+ वर्षों से Agra के pets की देखभाल कर रहे हैं।</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {s.social_facebook&&<a href={s.social_facebook} target="_blank" rel="noreferrer" style={{width:34,height:34,borderRadius:'50%',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',transition:'all .2s'}}><FiFacebook/></a>}
              {s.social_instagram&&<a href={s.social_instagram} target="_blank" rel="noreferrer" style={{width:34,height:34,borderRadius:'50%',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem'}}><FiInstagram/></a>}
              {s.social_youtube&&<a href={s.social_youtube} target="_blank" rel="noreferrer" style={{width:34,height:34,borderRadius:'50%',border:'1px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem'}}><FiYoutube/></a>}
              <a href={`https://wa.me/${s.clinic_whatsapp||'917456064956'}`} target="_blank" rel="noreferrer" style={{padding:'0 14px',height:34,borderRadius:20,background:'#25D366',border:'none',color:'#fff',fontSize:'.75rem',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>💬 WhatsApp</a>
            </div>
          </div>
          {/* Quick links */}
          <div>
            <div style={{fontWeight:800,fontSize:'.75rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:18}}>Quick Links</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
              {[['/', 'Home'],['/about','About Us'],['/services','Services'],['/appointment','Book Appointment'],['/shop','Pet Shop'],['/blog','Blog'],['/contact','Contact']].map(([to,l])=>(
                <li key={l}><Link to={to} style={{fontSize:'.84rem',opacity:.65,transition:'opacity .2s'}} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=.65}>{l}</Link></li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <div style={{fontWeight:800,fontSize:'.75rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:18}}>Services</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:9}}>
              {['Vet Consultation','Full Grooming','Vaccination','Dental Care','X-Ray & Diagnostics','Pet Boarding','Emergency 24/7'].map(sv=>(
                <li key={sv} style={{fontSize:'.84rem',opacity:.65}}>{sv}</li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <div style={{fontWeight:800,fontSize:'.75rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:18}}>Contact Us</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',gap:10,fontSize:'.84rem'}}><FiMapPin style={{color:'#90EE90',marginTop:2,flexShrink:0}}/><span style={{opacity:.7}}>{s.clinic_address||'Agra, Uttar Pradesh, India'}</span></div>
              <div style={{display:'flex',gap:10,fontSize:'.84rem'}}><FiPhone style={{color:'#90EE90',flexShrink:0}}/><a href={`tel:${s.clinic_phone||'7456064956'}`} style={{opacity:.7}}>{s.clinic_phone||'7456064956'}</a></div>
              <div style={{display:'flex',gap:10,fontSize:'.84rem'}}><FiMail style={{color:'#90EE90',flexShrink:0}}/><a href={`mailto:${s.clinic_email||'guptamanukrishna10@gmail.com'}`} style={{opacity:.7,fontSize:'.78rem'}}>{s.clinic_email||'guptamanukrishna10@gmail.com'}</a></div>
            </div>
            <div style={{marginTop:18,background:'rgba(255,255,255,.07)',borderRadius:10,padding:14}}>
              <div style={{fontSize:'.72rem',fontWeight:800,color:'#90EE90',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Working Hours</div>
              <div style={{fontSize:'.83rem',opacity:.7}}>{s.clinic_hours||'Mon–Sat: 9AM–8PM'}</div>
              <div style={{fontSize:'.8rem',color:'#FF9999',fontWeight:700,marginTop:4}}>🚨 Emergency: 24/7</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{borderTop:'1px solid rgba(255,255,255,.08)',padding:'18px 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,fontSize:'.78rem',opacity:.45}}>
          <span>© {yr} DoctorG24 · {s.doctor_name||'Dr. Manoj Kumar Gupta'} ({s.doctor_degree||'M.V.Sc.'}) · Agra, UP · doctorg24.in</span>
          <span>Made with ❤️ in Agra</span>
        </div>
      </div>
    </footer>
  );
}
