import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../utils/api';
import { getYoutubeId } from '../utils/api';

export default function Gallery() {
  const [videos, setVideos] = useState([]);
  useEffect(()=>{ api.get('/videos').then(r=>setVideos(r.data)).catch(()=>{}); },[]);
  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'60px 0 44px',textAlign:'center',color:'#fff'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:10}}>Gallery & <em style={{color:'#90EE90'}}>Videos</em></h1>
        <p style={{color:'rgba(255,255,255,.6)'}}>Patient experiences, treatments & pet care tips</p>
      </section>
      <section style={{padding:'56px 0 80px',background:'var(--bg3)'}}>
        <div className="container">
          {videos.length === 0
            ? <div style={{textAlign:'center',padding:80,color:'var(--text3)'}}>
                <div style={{fontSize:'3rem',marginBottom:12}}>🎬</div>
                <div style={{fontWeight:700}}>Videos coming soon!</div>
                <div style={{fontSize:'.85rem',marginTop:6}}>Admin → Videos से YouTube links add करें</div>
              </div>
            : <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
                {videos.map(v=>{
                  const id = getYoutubeId(v.youtubeUrl);
                  return (
                    <div key={v._id} className="card card-hover" style={{overflow:'hidden'}}>
                      {id
                        ? <a href={v.youtubeUrl} target="_blank" rel="noreferrer">
                            <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt={v.title} style={{width:'100%',height:200,objectFit:'cover'}}/>
                          </a>
                        : <div style={{height:200,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>🎬</div>
                      }
                      <div style={{padding:'14px 16px'}}>
                        <span style={{fontSize:'.65rem',fontWeight:700,padding:'2px 8px',background:'rgba(27,67,50,.1)',color:'var(--forest2)',borderRadius:4,textTransform:'uppercase'}}>{v.category}</span>
                        <div style={{fontWeight:700,fontSize:'.9rem',margin:'8px 0 4px',lineHeight:1.3}}>{v.title}</div>
                        {v.description && <div style={{fontSize:'.78rem',color:'var(--text3)'}}>{v.description}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
