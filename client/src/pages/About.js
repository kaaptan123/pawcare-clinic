import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSettings } from '../context/ThemeContext';
import { imgUrl } from '../utils/api';
import { FiCheck, FiCalendar, FiAward, FiShield, FiHeart } from 'react-icons/fi';

export default function About() {
  const s = useSettings();
  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'70px 0 50px',textAlign:'center',color:'#fff'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(27,67,50,.4)',padding:'5px 16px',borderRadius:20,fontSize:'.71rem',fontWeight:700,color:'#90EE90',marginBottom:14,letterSpacing:'.1em'}}><FiShield size={11}/> TRUSTED SINCE 1999</div>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2.2rem,4vw,3.2rem)',marginBottom:12}}>About <em style={{color:'#90EE90'}}>DoctorG24</em></h1>
        <p style={{color:'rgba(255,255,255,.6)',maxWidth:560,margin:'0 auto',fontSize:'.95rem',lineHeight:1.8}}>Agra की सबसे trusted veterinary clinic — Dr. Manoj Kumar Gupta (M.V.Sc.) द्वारा founded.</p>
      </section>

      {/* Doctor section */}
      <section style={{padding:'80px 0',background:'var(--bg)'}}>
        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>
          <div style={{borderRadius:24,overflow:'hidden',background:'var(--grad-dark)',aspectRatio:'4/5',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--sh-xl)'}}>
            {s.doctor_photo
              ? <img src={imgUrl(s.doctor_photo)} alt={s.doctor_name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              : <div style={{textAlign:'center',color:'rgba(255,255,255,.5)',padding:40}}><div style={{fontSize:'5rem',marginBottom:12}}>👨‍⚕️</div><div style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',color:'rgba(255,255,255,.7)'}}>Doctor Photo<br/>Admin से upload करें</div></div>
            }
          </div>
          <div>
            <div className="s-eyebrow">Meet the Doctor</div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(1.8rem,3vw,2.5rem)',marginBottom:8}}>
              {s.doctor_name||'Dr. Manoj Kumar Gupta'}
            </h2>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',fontStyle:'italic',color:'var(--forest2)',marginBottom:20}}>{s.doctor_degree||'M.V.Sc.'} — {s.doctor_speciality||'Dogs & Cats Specialist'}</div>

            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:24}}>
              <span className="trust-badge"><FiShield size={11}/> Govt. Certified</span>
              <span className="trust-badge gold"><FiAward size={11}/> {s.doctor_experience||'25'}+ Years</span>
              <span className="verified-seal">✅ Verified</span>
            </div>

            <p style={{color:'var(--text2)',lineHeight:1.9,fontSize:'.93rem',marginBottom:28}}>{s.doctor_bio||'Agra के सबसे भरोसेमंद पशु चिकित्सकों में से एक। 25 वर्षों से dogs और cats की dedicated सेवा। आपके pet के स्वास्थ्य के लिए हमेशा present।'}</p>

            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
              {[`Graduation: ${s.doctor_college||'Mathura Veterinary College'}`,`Degree: ${s.doctor_degree||'M.V.Sc.'} (Master of Veterinary Science)`,'Government of India Registered Veterinarian','Member, Veterinary Council of India','Specialisation: Small Animals — Dogs & Cats'].map(i=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:'.87rem',color:'var(--text2)'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(27,67,50,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}><FiCheck size={11} color="var(--forest2)"/></div>{i}
                </div>
              ))}
            </div>
            <Link to="/appointment" className="btn btn-primary"><FiCalendar size={15}/> Book an Appointment</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{padding:'60px 0',background:'var(--grad-forest)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {[{n:'25+',l:'Years Experience'},{n:'5000+',l:'Pets Treated'},{n:'4.9★',l:'Patient Rating'},{n:'24/7',l:'Emergency Care'}].map(s=>(
              <div key={s.l} style={{textAlign:'center',padding:'28px 16px',background:'rgba(255,255,255,.06)',borderRadius:16,border:'1px solid rgba(255,255,255,.1)'}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'2.4rem',fontWeight:700,color:'#fff',lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:'.74rem',color:'rgba(255,255,255,.6)',marginTop:6,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{padding:'80px 0',background:'var(--bg3)'}}>
        <div className="container" style={{maxWidth:800,textAlign:'center'}}>
          <div className="s-eyebrow" style={{justifyContent:'center'}}>Our Mission</div>
          <h2 className="s-title" style={{textAlign:'center',marginBottom:24}}>Every Pet Deserves the <em>Best Care</em></h2>
          <p style={{color:'var(--text2)',fontSize:'.96rem',lineHeight:1.9,marginBottom:40}}>"हर pet एक family member है। उनकी health और happiness हमारी priority है। हम सिर्फ treatment नहीं करते — हम आपके pet की जिंदगी बेहतर बनाते हैं।"</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[{icon:<FiShield size={24}/>,t:'Trust & Transparency',b:'Clear diagnosis, honest pricing, no hidden costs.'},{icon:<FiHeart size={24}/>,t:'Compassionate Care',b:'We treat every pet with the love they deserve.'},{icon:<FiAward size={24}/>,t:'Clinical Excellence',b:'25+ years of evidence-based veterinary practice.'}].map(c=>(
              <div key={c.t} className="card" style={{padding:'24px 20px',textAlign:'center'}}>
                <div style={{width:50,height:50,background:'var(--grad-forest)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',margin:'0 auto 14px',boxShadow:'0 4px 14px rgba(27,67,50,.3)'}}>{c.icon}</div>
                <div style={{fontWeight:700,fontSize:'.92rem',marginBottom:8}}>{c.t}</div>
                <div style={{fontSize:'.8rem',color:'var(--text3)',lineHeight:1.6}}>{c.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
