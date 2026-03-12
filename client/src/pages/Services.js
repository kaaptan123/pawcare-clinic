import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSettings } from '../context/ThemeContext';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

const SVCS = [
  {icon:'🩺',name:'Veterinary Consultation',key:'price_consultation',desc:'Thorough physical examination, diagnosis and treatment plan tailored for your pet. Includes prescription medicines if needed.',inc:['Full physical exam','Diagnosis & treatment','Prescription if needed','Follow-up advice']},
  {icon:'✂️',name:'Full Pet Grooming',key:'price_grooming',desc:'Head-to-tail grooming session including bath, blow-dry, breed-specific haircut, ear cleaning and nail trim.',inc:['Bath & blow dry','Breed haircut','Ear cleaning','Nail trimming']},
  {icon:'💉',name:'Vaccination',key:'price_vaccination',desc:'Complete vaccination schedule for puppies & kittens. Adult boosters available. Official health certificate provided.',inc:['All core vaccines','Health certificate','Deworming advice','Follow-up schedule']},
  {icon:'🦷',name:'Dental Care',key:'price_dental',desc:'Professional dental scaling to remove tartar and plaque. Prevents gum disease and improves overall health.',inc:['Scaling & polishing','Oral exam','Gum assessment','Diet advice']},
  {icon:'🩻',name:'X-Ray & Diagnostics',key:'price_xray',desc:'Digital X-ray for bones, joints and internal organs. Blood tests and pathology available on same day.',inc:['Digital X-Ray','Blood panel','Same-day results','Expert interpretation']},
  {icon:'🏠',name:'Pet Boarding',key:'price_boarding',desc:'Safe, comfortable boarding when you travel. Includes meals, exercise and daily health monitoring.',inc:['Daily meals','Exercise & play','Health monitoring','24/7 supervision']},
];

export default function Services() {
  const s = useSettings();
  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'70px 0 50px',textAlign:'center',color:'#fff'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:12}}>Our <em style={{color:'#90EE90'}}>Services</em></h1>
        <p style={{color:'rgba(255,255,255,.6)',maxWidth:520,margin:'0 auto',fontSize:'.93rem'}}>Complete veterinary care under one roof — for dogs, cats & small animals</p>
      </section>
      <section style={{padding:'64px 0 80px',background:'var(--bg3)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
            {SVCS.map(sv=>(
              <div key={sv.name} className="card" style={{padding:'28px',display:'flex',gap:22,alignItems:'flex-start',borderLeft:'3px solid var(--forest2)'}}>
                <div style={{fontSize:'2.5rem',flexShrink:0}}>{sv.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
                    <h3 style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:'1.1rem'}}>{sv.name}</h3>
                    {s[sv.key] && <span style={{fontWeight:800,color:'var(--forest2)',fontSize:'.9rem',flexShrink:0}}>From ₹{s[sv.key]}</span>}
                  </div>
                  <p style={{color:'var(--text3)',fontSize:'.84rem',lineHeight:1.7,margin:'8px 0 14px'}}>{sv.desc}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {sv.inc.map(i=>(
                      <span key={i} style={{fontSize:'.72rem',fontWeight:600,padding:'3px 10px',background:'rgba(27,67,50,.08)',color:'var(--forest2)',borderRadius:20}}>✓ {i}</span>
                    ))}
                  </div>
                  <Link to="/appointment" style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:14,fontSize:'.8rem',fontWeight:700,color:'var(--forest2)'}}>Book This <FiArrowRight size={12}/></Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:48,textAlign:'center'}}>
            <Link to="/appointment" className="btn btn-primary btn-lg"><FiCalendar size={16}/> Book Appointment Now</Link>
          </div>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
