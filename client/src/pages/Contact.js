import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSettings } from '../context/ThemeContext';
import { FiPhone, FiMail, FiMapPin, FiClock, FiMessageCircle } from 'react-icons/fi';

export default function Contact() {
  const s = useSettings();
  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'64px 0 48px',textAlign:'center',color:'#fff'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:10}}>Contact <em style={{color:'#90EE90'}}>Us</em></h1>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.93rem'}}>We're here to help — reach us any way you prefer</p>
      </section>

      <section style={{padding:'64px 0',background:'var(--bg3)'}}>
        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start'}}>
          <div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.6rem',marginBottom:28}}>Get In <em>Touch</em></h2>
            {[
              {icon:<FiPhone size={18}/>, label:'Phone / WhatsApp', val:s.clinic_phone||'7456064956', href:`tel:${s.clinic_phone}`},
              {icon:<FiMail size={18}/>, label:'Email', val:s.clinic_email||'guptamanukrishna10@gmail.com', href:`mailto:${s.clinic_email}`},
              {icon:<FiMapPin size={18}/>, label:'Address', val:s.clinic_address||'Agra, Uttar Pradesh', href:s.clinic_maps_url||'#'},
              {icon:<FiClock size={18}/>, label:'Hours', val:s.clinic_hours||'Mon–Sat 9AM–8PM', href:null},
            ].map(c=>(
              <div key={c.label} style={{display:'flex',gap:16,alignItems:'flex-start',padding:'18px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:44,height:44,background:'rgba(27,67,50,.1)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--forest2)',flexShrink:0}}>{c.icon}</div>
                <div>
                  <div style={{fontSize:'.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text3)',marginBottom:4}}>{c.label}</div>
                  {c.href
                    ? <a href={c.href} style={{fontWeight:600,color:'var(--text)',fontSize:'.92rem'}}>{c.val}</a>
                    : <div style={{fontWeight:600,color:'var(--text)',fontSize:'.92rem'}}>{c.val}</div>
                  }
                </div>
              </div>
            ))}
            <div style={{marginTop:24}}>
              <a href={`https://wa.me/${s.clinic_whatsapp||'917456064956'}`} target="_blank" rel="noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 24px',background:'#25D366',color:'#fff',borderRadius:9,fontWeight:700,fontSize:'.9rem'}}>
                <FiMessageCircle size={16}/> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div>
            {s.clinic_maps_embed
              ? <div style={{borderRadius:16,overflow:'hidden',boxShadow:'var(--sh-lg)',height:420}}>
                  <iframe src={s.clinic_maps_embed} width="100%" height="420" style={{border:0}} allowFullScreen="" loading="lazy" title="Clinic Location"/>
                </div>
              : <div className="card" style={{padding:40,textAlign:'center',height:420,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <div style={{fontSize:'3rem',marginBottom:12}}>📍</div>
                  <div style={{fontWeight:700,fontSize:'1rem',marginBottom:8}}>Map Coming Soon</div>
                  <div style={{color:'var(--text3)',fontSize:'.84rem',marginBottom:20}}>Admin → Settings → Google Maps Embed URL डालें</div>
                  <a href={s.clinic_maps_url||'https://maps.google.com'} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Open in Google Maps</a>
                </div>
            }
          </div>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
