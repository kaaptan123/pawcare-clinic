import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/AppContext';
import api, { imgUrl } from '../utils/api';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';

const CATS = [
  {val:'all',label:'All Products'},
  {val:'dog',label:'🐕 Dogs'},
  {val:'cat',label:'🐈 Cats'},
  {val:'both',label:'❤️ Both'},
];
const TYPES = [
  {val:'',label:'All Types'},
  {val:'food',label:'🍗 Food'},
  {val:'toy',label:'🧸 Toys'},
  {val:'care',label:'🧴 Care'},
  {val:'medicine',label:'💊 Medicine'},
  {val:'accessory',label:'🎀 Accessories'},
];

export default function Shop() {
  const { addItem, items, totalItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (type) params.set('subType', type);
    if (search) params.set('search', search);
    api.get(`/products?${params}`).then(r=>setProducts(r.data)).finally(()=>setLoading(false));
  }, [cat, type, search]);

  return (
    <><Navbar/>
    <main className="page-top">
      {/* Hero */}
      <section style={{background:'var(--grad-dark)',padding:'60px 0 44px',color:'#fff',textAlign:'center'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(2rem,3.5vw,2.8rem)',marginBottom:10}}>Pet <em style={{color:'#90EE90'}}>Shop</em></h1>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.93rem'}}>Vet-recommended food, care products & accessories</p>
      </section>

      <section style={{padding:'48px 0 80px',background:'var(--bg3)'}}>
        <div className="container">
          {/* Filters */}
          <div style={{background:'var(--bg)',borderRadius:14,padding:'20px 24px',marginBottom:28,border:'1px solid var(--border)',display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <FiSearch style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text3)'}} size={15}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
                style={{width:'100%',padding:'10px 12px 10px 36px',border:'1.5px solid var(--inp-border)',borderRadius:9,background:'var(--inp-bg)',color:'var(--text)',outline:'none',fontSize:'.88rem'}}/>
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {CATS.map(c=>(
                <button key={c.val} onClick={()=>setCat(c.val)}
                  style={{padding:'8px 16px',borderRadius:8,border:`1.5px solid ${cat===c.val?'var(--forest2)':'var(--border)'}`,background:cat===c.val?'rgba(27,67,50,.1)':'none',color:cat===c.val?'var(--forest2)':'var(--text2)',fontWeight:600,fontSize:'.8rem',cursor:'pointer',transition:'all .2s'}}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {TYPES.map(t=>(
                <button key={t.val} onClick={()=>setType(t.val)}
                  style={{padding:'8px 14px',borderRadius:8,border:`1.5px solid ${type===t.val?'var(--forest2)':'var(--border)'}`,background:type===t.val?'rgba(27,67,50,.1)':'none',color:type===t.val?'var(--forest2)':'var(--text2)',fontWeight:600,fontSize:'.78rem',cursor:'pointer',transition:'all .2s'}}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? <div className="spinner"/> : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
              {products.map(p => {
                const inCart = items.find(i=>i._id===p._id);
                return (
                  <div key={p._id} className="card card-hover" style={{overflow:'hidden'}}>
                    <div style={{height:200,background:p.bgColor||'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                      {p.image
                        ? <img src={imgUrl(p.image)} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        : <span style={{fontSize:'4rem'}}>{p.emoji||'📦'}</span>
                      }
                      {p.badge && <span className={`badge badge-${p.badge}`} style={{position:'absolute',top:10,left:10}}>{p.badge}</span>}
                      {!p.inStock && (
                        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <span style={{color:'#fff',fontWeight:800,fontSize:'.85rem'}}>Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div style={{padding:'16px'}}>
                      <div style={{fontSize:'.67rem',textTransform:'uppercase',letterSpacing:'.06em',color:'var(--text3)',fontWeight:700,marginBottom:5}}>{p.category} · {p.subType}</div>
                      <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:10,lineHeight:1.35,color:'var(--text)',minHeight:40}}>{p.name}</div>
                      <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:14}}>
                        <span style={{fontSize:'1.1rem',fontWeight:800,color:'var(--forest2)'}}>₹{p.price?.toLocaleString('en-IN')}</span>
                        {p.mrp && <span style={{fontSize:'.78rem',color:'var(--text3)',textDecoration:'line-through'}}>₹{p.mrp?.toLocaleString('en-IN')}</span>}
                        {p.mrp && <span style={{fontSize:'.7rem',fontWeight:800,color:'var(--crimson)'}}>
                          {Math.round((p.mrp-p.price)/p.mrp*100)}% off
                        </span>}
                      </div>
                      <button
                        className="btn btn-primary btn-sm btn-full"
                        disabled={!p.inStock}
                        onClick={() => { addItem(p); toast.success(`${p.emoji||'📦'} Added!`); }}
                        style={{background: inCart ? 'var(--grad-forest)':undefined}}>
                        <FiShoppingCart size={14}/>
                        {inCart ? `In Cart (${inCart.qty})` : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--text3)'}}>
                  <div style={{fontSize:'3rem',marginBottom:12}}>🔍</div>
                  <div style={{fontWeight:700}}>No products found</div>
                  <div style={{fontSize:'.85rem',marginTop:6}}>Try changing filters</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cart float */}
      {totalItems > 0 && (
        <div style={{position:'fixed',bottom:24,right:24,zIndex:500}}>
          <Link to="/checkout" className="btn btn-primary btn-lg" style={{boxShadow:'0 8px 32px rgba(27,67,50,.45)'}}>
            <FiShoppingCart size={18}/> View Cart ({totalItems})
          </Link>
        </div>
      )}
    </main>
    <Footer/></>
  );
}
