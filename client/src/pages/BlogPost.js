import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api, { imgUrl } from '../utils/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/blogs/${slug}`).then(r => { setBlog(r.data); setActiveImg(0); }).catch(() => {});
  }, [slug]);

  if (!blog) return <><Navbar/><div className="page-top"><div className="spinner"/></div><Footer/></>;

  const images = blog.images?.length > 0 ? blog.images : (blog.image ? [blog.image] : []);

  return (
    <><Navbar/>
    <main className="page-top">
      {/* Hero image with gallery */}
      {images.length > 0 && (
        <div style={{background:'#1A1714'}}>
          <div style={{height:380,overflow:'hidden',position:'relative'}}>
            <img src={imgUrl(images[activeImg])} alt={blog.title}
              style={{width:'100%',height:'100%',objectFit:'cover',opacity:.85}}/>
            {/* Image counter */}
            {images.length > 1 && (
              <div style={{position:'absolute',bottom:12,right:16,background:'rgba(0,0,0,.6)',color:'#fff',padding:'4px 12px',borderRadius:20,fontSize:'.75rem',fontWeight:700}}>
                {activeImg+1} / {images.length}
              </div>
            )}
          </div>
          {/* Thumbnail strip for multiple images */}
          {images.length > 1 && (
            <div style={{display:'flex',gap:8,padding:'12px 20px',overflowX:'auto',background:'rgba(0,0,0,.3)'}}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{width:72,height:52,flexShrink:0,borderRadius:6,overflow:'hidden',cursor:'pointer',border:`2px solid ${activeImg===i?'#90EE90':'transparent'}`,opacity:activeImg===i?1:.6,transition:'all .2s'}}>
                  <img src={imgUrl(img)} alt={`img-${i}`} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <section style={{padding:'52px 0 80px',background:'var(--bg3)'}}>
        <div className="container" style={{maxWidth:780}}>
          {/* Tags */}
          <div style={{marginBottom:16,display:'flex',gap:6,flexWrap:'wrap'}}>
            {blog.tags?.map(t => (
              <span key={t} style={{fontSize:'.68rem',fontWeight:700,padding:'3px 10px',background:'rgba(27,67,50,.1)',color:'var(--forest2)',borderRadius:5}}>{t}</span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(1.8rem,3vw,2.6rem)',marginBottom:16,lineHeight:1.15,color:'var(--text)'}}>{blog.title}</h1>

          {/* Meta */}
          <div style={{display:'flex',alignItems:'center',gap:16,color:'var(--text3)',fontSize:'.83rem',marginBottom:32,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'var(--grad-forest)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.75rem'}}>
                {blog.author?.[0] || 'D'}
              </div>
              <strong style={{color:'var(--text)'}}>{blog.author || 'Dr. Manoj Kumar Gupta'}</strong>
            </div>
            <span>·</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
            {blog.views > 0 && <><span>·</span><span>👁 {blog.views} views</span></>}
          </div>

          {/* Content */}
          <div className="card" style={{padding:'32px 36px',marginBottom:28}}>
            <div style={{lineHeight:1.95,fontSize:'.96rem',color:'var(--text2)',whiteSpace:'pre-wrap'}}>{blog.content}</div>
          </div>

          {/* Image gallery grid (all images) */}
          {images.length > 1 && (
            <div style={{marginBottom:28}}>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',fontWeight:700,marginBottom:14,color:'var(--text)'}}>📸 Photo Gallery ({images.length} images)</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{borderRadius:10,overflow:'hidden',cursor:'pointer',border:`2px solid ${activeImg===i?'var(--forest2)':'transparent'}`,transition:'all .2s',aspectRatio:'4/3'}}>
                    <img src={imgUrl(img)} alt={`${blog.title} ${i+1}`}
                      style={{width:'100%',height:'100%',objectFit:'cover'}}
                      onMouseOver={e=>e.target.style.opacity='.85'}
                      onMouseOut={e=>e.target.style.opacity='1'}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <Link to="/blog" style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--forest2)',fontWeight:700,fontSize:'.88rem',marginTop:8}}>
            ← All Blog Posts
          </Link>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
