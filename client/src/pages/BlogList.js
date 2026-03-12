import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api, { imgUrl } from '../utils/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  useEffect(()=>{ api.get('/blogs').then(r=>setBlogs(r.data)).catch(()=>{}); },[]);
  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'60px 0 44px',textAlign:'center',color:'#fff'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:10}}>Pet Care <em style={{color:'#90EE90'}}>Blog</em></h1>
        <p style={{color:'rgba(255,255,255,.6)'}}>Tips, advice & updates from Dr. Manoj Kumar Gupta</p>
      </section>
      <section style={{padding:'56px 0 80px',background:'var(--bg3)'}}>
        <div className="container">
          {blogs.length === 0
            ? <div style={{textAlign:'center',padding:80,color:'var(--text3)'}}><div style={{fontSize:'3rem',marginBottom:12}}>📝</div><div>Blog posts coming soon! Admin से add करें।</div></div>
            : <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:22}}>
                {blogs.map(b=>(
                  <Link key={b._id} to={`/blog/${b.slug}`} className="card card-hover" style={{overflow:'hidden',textDecoration:'none',color:'inherit'}}>
                    {b.image && <img src={imgUrl(b.image)} alt={b.title} style={{width:'100%',height:200,objectFit:'cover'}}/>}
                    <div style={{padding:20}}>
                      {b.tags?.map(t=><span key={t} style={{fontSize:'.66rem',fontWeight:700,padding:'2px 8px',background:'rgba(27,67,50,.1)',color:'var(--forest2)',borderRadius:4,marginRight:4}}>{t}</span>)}
                      <div style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:'1.05rem',margin:'10px 0 8px',lineHeight:1.3}}>{b.title}</div>
                      <div style={{fontSize:'.82rem',color:'var(--text3)',lineHeight:1.6}}>{b.excerpt}</div>
                      <div style={{marginTop:14,fontSize:'.78rem',color:'var(--forest2)',fontWeight:600}}>Read More →</div>
                    </div>
                  </Link>
                ))}
              </div>
          }
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
