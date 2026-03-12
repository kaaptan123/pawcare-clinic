import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api, { imgUrl } from '../utils/api';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(()=>{ api.get(`/blogs/${slug}`).then(r=>setBlog(r.data)).catch(()=>{}); },[slug]);
  if (!blog) return <><Navbar/><div className="page-top"><div className="spinner"/></div></>;
  return (
    <><Navbar/>
    <main className="page-top">
      {blog.image && <div style={{height:380,overflow:'hidden'}}><img src={imgUrl(blog.image)} alt={blog.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>}
      <section style={{padding:'56px 0 80px',background:'var(--bg3)'}}>
        <div className="container" style={{maxWidth:780}}>
          <div style={{marginBottom:16}}>
            {blog.tags?.map(t=><span key={t} style={{fontSize:'.68rem',fontWeight:700,padding:'3px 10px',background:'rgba(27,67,50,.1)',color:'var(--forest2)',borderRadius:5,marginRight:6}}>{t}</span>)}
          </div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(1.8rem,3vw,2.6rem)',marginBottom:16,lineHeight:1.15}}>{blog.title}</h1>
          <div style={{color:'var(--text3)',fontSize:'.83rem',marginBottom:32}}>By <strong>{blog.author}</strong> · {new Date(blog.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
          <div className="card" style={{padding:'32px 36px'}}>
            <div style={{lineHeight:1.9,fontSize:'.95rem',color:'var(--text2)',whiteSpace:'pre-wrap'}}>{blog.content}</div>
          </div>
          <Link to="/blog" style={{display:'inline-flex',alignItems:'center',gap:6,marginTop:24,color:'var(--forest2)',fontWeight:600,fontSize:'.85rem'}}>← All Posts</Link>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
