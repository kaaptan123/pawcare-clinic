import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import api, { imgUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiGrid, FiBox, FiCalendar, FiShoppingBag, FiStar, FiFileText, FiVideo, FiSettings, FiLogOut, FiMenu, FiX, FiUsers, FiPlus, FiEdit2, FiTrash2, FiCheck, FiEye, FiEyeOff, FiUpload, FiChevronDown } from 'react-icons/fi';
import './Admin.css';

// ── LAYOUT ─────────────────────────────────────────────────────
function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);

  const links = [
    { to:'/admin', icon:<FiGrid/>, label:'Dashboard', end:true },
    { to:'/admin/products', icon:<FiBox/>, label:'Products' },
    { to:'/admin/appointments', icon:<FiCalendar/>, label:'Appointments' },
    { to:'/admin/orders', icon:<FiShoppingBag/>, label:'Orders' },
    { to:'/admin/reviews', icon:<FiStar/>, label:'Reviews' },
    { to:'/admin/blog', icon:<FiFileText/>, label:'Blog' },
    { to:'/admin/videos', icon:<FiVideo/>, label:'Videos' },
    { to:'/admin/patients', icon:<FiUsers/>, label:'Patients' },
    { to:'/admin/settings', icon:<FiSettings/>, label:'Settings' },
  ];

  return (
    <div className={`adm ${collapsed?'adm-collapsed':''} ${mobile?'adm-mobile-open':''}`}>
      <aside className="adm-sidebar">
        <div className="adm-sb-top">
          <div className="adm-logo">
            <span>🐾</span>
            {!collapsed && <div><div className="adm-logo-name">PawCare Admin</div><div className="adm-logo-sub">Godfather Panel</div></div>}
          </div>
          <button className="adm-collapse-btn" onClick={() => setCollapsed(c=>!c)}>{collapsed ? '→' : '←'}</button>
        </div>
        <nav className="adm-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({isActive})=>`adm-link ${isActive?'active':''}`} onClick={()=>setMobile(false)}>
              <span className="adm-link-icon">{l.icon}</span>
              {!collapsed && <span>{l.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="adm-sb-bottom">
          <div className={`adm-user ${collapsed?'adm-user-sm':''}`}>
            <div className="adm-avatar">{user?.name?.[0]}</div>
            {!collapsed && <div><div className="adm-uname">{user?.name?.split(' ').slice(0,2).join(' ')}</div><div className="adm-uemail">Admin</div></div>}
          </div>
          <button className="adm-logout" onClick={()=>{logout();nav('/');}}>
            <FiLogOut/> {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
      <div className="adm-mobile-bar">
        <div className="adm-logo" style={{padding:'0 16px'}}><span>🐾</span><div className="adm-logo-name">PawCare Admin</div></div>
        <button onClick={()=>setMobile(m=>!m)} style={{background:'none',border:'none',color:'var(--text)',fontSize:'1.3rem',cursor:'pointer',padding:'0 16px'}}>{mobile?<FiX/>:<FiMenu/>}</button>
      </div>
      {mobile && <div className="adm-mobile-overlay" onClick={()=>setMobile(false)}/>}
      <main className="adm-main">{children}</main>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/dashboard/stats').then(r=>setStats(r.data)).catch(()=>{}); }, []);
  if (!stats) return <div className="adm-page"><div className="spinner"/></div>;
  const cards = [
    { label:'Products', val:stats.products, icon:'📦', color:'#FF6B00' },
    { label:'Pending Appts', val:stats.pendingAppts, icon:'📅', color:'#E91E63' },
    { label:'Total Orders', val:stats.orders, icon:'🛍️', color:'#1976D2' },
    { label:'Total Revenue', val:`₹${(stats.revenue||0).toLocaleString('en-IN')}`, icon:'💰', color:'#2E7D32' },
    { label:'Reviews Live', val:stats.reviews, icon:'⭐', color:'#F57C00' },
    { label:'Pending Reviews', val:stats.pendingReviews, icon:'⏳', color:'#7B1FA2' },
    { label:'Patients', val:stats.patients, icon:'👥', color:'#00897B' },
    { label:'Blog Posts', val:stats.blogs, icon:'📝', color:'#5C6BC0' },
  ];
  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><h1>Dashboard</h1><p>Welcome back, Dr. Gupta 🐾</p></div>
      <div className="dash-grid">
        {cards.map(c=>(
          <div key={c.label} className="dash-card card">
            <div className="dash-icon" style={{background:`${c.color}18`,color:c.color}}>{c.icon}</div>
            <div className="dash-val">{c.val}</div>
            <div className="dash-label">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="dash-tables">
        <div className="card" style={{padding:20}}>
          <div className="adm-tbl-hdr">Recent Appointments</div>
          <div className="tbl-wrap" style={{border:'none',boxShadow:'none'}}>
            <table className="tbl">
              <thead><tr><th>Patient</th><th>Pet</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>{stats.recentAppts?.map(a=>(
                <tr key={a._id}><td>{a.ownerName}</td><td>{a.petName}</td><td>{a.service}</td><td>{new Date(a.date).toLocaleDateString('en-IN')}</td><td><span className={`pill pill-${a.status}`}>{a.status}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="card" style={{padding:20}}>
          <div className="adm-tbl-hdr">Recent Orders</div>
          <div className="tbl-wrap" style={{border:'none',boxShadow:'none'}}>
            <table className="tbl">
              <thead><tr><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>{stats.recentOrders?.map(o=>(
                <tr key={o._id}><td>{o.customerName}</td><td>₹{o.total?.toLocaleString('en-IN')}</td><td><span className={`pill pill-${o.paymentStatus}`}>{o.paymentStatus}</span></td><td><span className={`pill pill-${o.orderStatus}`}>{o.orderStatus}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [form, setForm] = useState({ name:'',description:'',category:'dog',subType:'food',price:'',mrp:'',emoji:'📦',bgColor:'#E8F5E9',badge:'',inStock:true,featured:false });
  const imgRef = useRef();

  const load = () => { setLoading(true); api.get('/products').then(r=>setProducts(r.data)).finally(()=>setLoading(false)); };
  useEffect(load,[]);
  const openAdd = () => { setForm({name:'',description:'',category:'dog',subType:'food',price:'',mrp:'',emoji:'📦',bgColor:'#E8F5E9',badge:'',inStock:true,featured:false}); setEditing(null); setImgFile(null); setImgPrev(null); setModal(true); };
  const openEdit = (p) => { setForm({...p,price:p.price?.toString(),mrp:p.mrp?.toString()||'',badge:p.badge||''}); setEditing(p._id); setImgFile(null); setImgPrev(imgUrl(p.image)); setModal(true); };
  const handleImg = (e) => { const f=e.target.files[0]; if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f));} };

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, v));
    if (imgFile) fd.append('image', imgFile);
    try {
      if (editing) await api.put(`/products/${editing}`, fd, {headers:{'Content-Type':'multipart/form-data'}});
      else await api.post('/products', fd, {headers:{'Content-Type':'multipart/form-data'}});
      toast.success(editing ? 'Product updated!' : 'Product added!');
      setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const del = async (id) => { if (!window.confirm('Delete this product?')) return; await api.delete(`/products/${id}`); toast.success('Deleted'); load(); };

  return (
    <div className="adm-page">
      <div className="adm-page-hdr">
        <div><h1>Products</h1><p>{products.length} products</p></div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus/> Add Product</button>
      </div>
      {loading ? <div className="spinner"/> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>{products.map(p=>(
              <tr key={p._id}>
                <td><div className="tbl-img" style={{background:p.bgColor}}>{p.image ? <img src={imgUrl(p.image)} alt={p.name}/> : p.emoji}</div></td>
                <td><div className="tbl-name">{p.name}</div>{p.badge && <span className={`badge badge-${p.badge}`}>{p.badge}</span>}</td>
                <td><span className="pill" style={{background:'var(--bg3)'}}>{p.category} · {p.subType}</span></td>
                <td><strong>₹{p.price?.toLocaleString('en-IN')}</strong>{p.mrp && <s style={{fontSize:'0.75rem',color:'var(--text3)',display:'block'}}>₹{p.mrp?.toLocaleString('en-IN')}</s>}</td>
                <td><span className={`pill ${p.inStock ? 'pill-confirmed' : 'pill-cancelled'}`}>{p.inStock?'In Stock':'Out'}</span></td>
                <td>{p.featured ? '⭐ Yes' : '—'}</td>
                <td><div className="tbl-actions">
                  <button className="tbl-btn" onClick={()=>openEdit(p)}><FiEdit2/></button>
                  <button className="tbl-btn tbl-btn-del" onClick={()=>del(p._id)}><FiTrash2/></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="adm-modal-bg" onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
          <div className="adm-modal">
            <div className="adm-modal-hdr"><h2>{editing?'Edit':'Add'} Product</h2><button onClick={()=>setModal(false)}><FiX/></button></div>
            <form onSubmit={save} className="adm-modal-body">
              <div className="img-upload-box" onClick={()=>imgRef.current.click()}>
                {imgPrev ? <img src={imgPrev} alt="preview"/> : <div className="iub-placeholder"><FiUpload/><span>Click to upload image</span></div>}
                <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} style={{display:'none'}}/>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></div>
                <div className="form-group"><label>Emoji</label><input value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))}/></div>
              </div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}/></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option value="dog">Dog</option><option value="cat">Cat</option><option value="both">Both</option></select></div>
                <div className="form-group"><label>Sub Type</label><select value={form.subType} onChange={e=>setForm(f=>({...f,subType:e.target.value}))}><option value="food">Food</option><option value="toy">Toy</option><option value="care">Care</option><option value="medicine">Medicine</option><option value="accessory">Accessory</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Price (₹) *</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required/></div>
                <div className="form-group"><label>MRP (₹)</label><input type="number" value={form.mrp} onChange={e=>setForm(f=>({...f,mrp:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Badge</label><select value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))}><option value="">None</option><option value="new">New</option><option value="sale">Sale</option><option value="bestseller">Bestseller</option><option value="rx">Rx</option></select></div>
                <div className="form-group"><label>BG Color</label><input type="color" value={form.bgColor} onChange={e=>setForm(f=>({...f,bgColor:e.target.value}))}/></div>
              </div>
              <div style={{display:'flex',gap:16}}>
                <label style={{display:'flex',gap:6,alignItems:'center',cursor:'pointer',fontSize:'0.88rem'}}><input type="checkbox" checked={form.inStock} onChange={e=>setForm(f=>({...f,inStock:e.target.checked}))}/> In Stock</label>
                <label style={{display:'flex',gap:6,alignItems:'center',cursor:'pointer',fontSize:'0.88rem'}}><input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/> Featured on Home</label>
              </div>
              <div style={{marginTop:20,display:'flex',gap:10,justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-outline btn-sm" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">{editing?'Save Changes':'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APPOINTMENTS ──────────────────────────────────────────────
function Appointments() {
  const [appts, setAppts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status:'', adminNote:'', fee:'' });

  const load = () => { setLoading(true); api.get('/appointments').then(r=>setAppts(r.data)).finally(()=>setLoading(false)); };
  useEffect(load,[]);
  const filtered = filter === 'all' ? appts : appts.filter(a=>a.status===filter);
  const openEdit = (a) => { setSelected(a); setForm({status:a.status,adminNote:a.adminNote||'',fee:a.fee||''}); };
  const save = async (e) => {
    e.preventDefault();
    await api.put(`/appointments/${selected._id}`, form);
    toast.success('Updated! Patient को email भेजी गई।'); setSelected(null); load();
  };

  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><div><h1>Appointments</h1><p>{filtered.length} appointments</p></div></div>
      <div className="filter-tabs">
        {['all','pending','confirmed','completed','cancelled'].map(s=>(
          <button key={s} className={`ftab ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s}</button>
        ))}
      </div>
      {loading ? <div className="spinner"/> : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Owner</th><th>Phone</th><th>Pet</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(a=>(
              <tr key={a._id}>
                <td><div className="tbl-name">{a.ownerName}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{a.email}</div></td>
                <td><a href={`tel:${a.phone}`} style={{color:'var(--saffron)',fontWeight:700}}>{a.phone}</a></td>
                <td>{a.petName} <span style={{color:'var(--text3)',fontSize:'0.75rem'}}>({a.petType})</span></td>
                <td style={{fontSize:'0.85rem'}}>{a.service}</td>
                <td style={{fontSize:'0.85rem',whiteSpace:'nowrap'}}>{new Date(a.date).toLocaleDateString('en-IN')}</td>
                <td style={{fontSize:'0.85rem'}}>{a.timeSlot}</td>
                <td><span className={`pill pill-${a.status}`}>{a.status}</span></td>
                <td><div className="tbl-actions">
                  <button className="tbl-btn" onClick={()=>openEdit(a)}><FiEdit2/></button>
                  <a className="tbl-btn" href={`tel:${a.phone}`}>📞</a>
                  <a className="tbl-btn" href={`https://wa.me/91${a.phone}`} target="_blank" rel="noreferrer">💬</a>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="adm-modal-bg" onClick={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
          <div className="adm-modal" style={{maxWidth:480}}>
            <div className="adm-modal-hdr"><h2>Update Appointment</h2><button onClick={()=>setSelected(null)}><FiX/></button></div>
            <div className="adm-modal-body">
              <div className="appt-info">
                <div><strong>{selected.ownerName}</strong> — {selected.petName} ({selected.petType})</div>
                <div style={{color:'var(--text3)',fontSize:'0.85rem',marginTop:4}}>{selected.service} · {new Date(selected.date).toLocaleDateString('en-IN')} · {selected.timeSlot}</div>
                {selected.address && <div style={{fontSize:'0.83rem',marginTop:4}}>📍 {selected.address}</div>}
              </div>
              <form onSubmit={save}>
                <div className="form-group" style={{marginTop:16}}><label>Status</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                    {['pending','confirmed','completed','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Consultation Fee (₹)</label><input type="number" value={form.fee} onChange={e=>setForm(f=>({...f,fee:e.target.value}))}/></div>
                <div className="form-group"><label>Note to Patient</label><textarea value={form.adminNote} onChange={e=>setForm(f=>({...f,adminNote:e.target.value}))} rows={2} placeholder="Optional note..."/></div>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={()=>setSelected(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Save & Notify Patient</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── REVIEWS ────────────────────────────────────────────────────
function Reviews() {
  const [reviews, setReviews] = useState([]);
  const load = () => api.get('/reviews/all').then(r=>setReviews(r.data));
  useEffect(()=>{load();},[]);
  const update = async (id, data) => { await api.put(`/reviews/${id}`, data); load(); toast.success('Updated!'); };
  const del = async (id) => { if(!window.confirm('Delete?'))return; await api.delete(`/reviews/${id}`); load(); };
  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><div><h1>Reviews</h1><p>{reviews.filter(r=>!r.approved).length} pending approval</p></div></div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Name</th><th>Pet</th><th>Rating</th><th>Comment</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>{reviews.map(r=>(
            <tr key={r._id}>
              <td><div className="tbl-name">{r.name}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{r.city}</div></td>
              <td style={{fontSize:'0.83rem'}}>{r.petName} {r.petType && `(${r.petType})`}</td>
              <td><span style={{color:'var(--gold)',fontSize:'1rem'}}>{'★'.repeat(r.rating)}</span></td>
              <td style={{maxWidth:200,fontSize:'0.83rem'}}>{r.comment?.slice(0,80)}{r.comment?.length>80?'...':''}</td>
              <td><span className={`pill ${r.approved?'pill-confirmed':'pill-pending'}`}>{r.approved?'Live':'Pending'}</span></td>
              <td>{r.featured?'⭐':'—'}</td>
              <td><div className="tbl-actions">
                <button className="tbl-btn" title={r.approved?'Hide':'Approve'} onClick={()=>update(r._id,{approved:!r.approved})} style={{color:r.approved?'var(--rose)':'var(--teal)'}}>{r.approved?<FiEyeOff/>:<FiCheck/>}</button>
                <button className="tbl-btn" title={r.featured?'Unfeature':'Feature'} onClick={()=>update(r._id,{featured:!r.featured})}>⭐</button>
                <button className="tbl-btn tbl-btn-del" onClick={()=>del(r._id)}><FiTrash2/></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── BLOG ───────────────────────────────────────────────────────
function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgFiles, setImgFiles] = useState([]);
  const [imgPrev, setImgPrev] = useState(null);
  const [imgPrevs, setImgPrevs] = useState([]);
  const [form, setForm] = useState({title:'',excerpt:'',content:'',tags:'',published:false});
  const imgRef = useRef();

  const load = () => api.get('/blogs/all').then(r=>setBlogs(r.data));
  useEffect(()=>{load();},[]);
  const openAdd = () => { setForm({title:'',excerpt:'',content:'',tags:'',published:false}); setEditing(null); setImgFile(null); setImgPrev(null); setModal(true); };
  const openEdit = (b) => { setForm({...b,tags:b.tags?.join(',')||''}); setEditing(b._id); setImgFile(null); setImgPrev(imgUrl(b.image)); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    const data = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
    Object.entries(data).forEach(([k,v]) => typeof v === 'object' ? fd.append(k, JSON.stringify(v)) : fd.append(k, v));
    // Support multiple images for blog
    if (imgFile) fd.append('images', imgFile);
    if (imgFiles && imgFiles.length > 0) imgFiles.forEach(f => fd.append('images', f));
    try {
      if (editing) await api.put(`/blogs/${editing}`, fd, {headers:{'Content-Type':'multipart/form-data'}});
      else await api.post('/blogs', fd, {headers:{'Content-Type':'multipart/form-data'}});
      toast.success('Blog saved!'); setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message||'Error'); }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><div><h1>Blog Posts</h1></div><button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus/> New Post</button></div>
      <div className="blog-grid">
        {blogs.map(b => (
          <div key={b._id} className="card blog-card">
            {b.image && <img src={imgUrl(b.image)} alt={b.title} className="blog-card-img"/>}
            <div className="blog-card-body">
              <span className={`pill ${b.published?'pill-confirmed':'pill-pending'}`} style={{fontSize:'0.7rem'}}>{b.published?'Published':'Draft'}</span>
              <div className="blog-card-title">{b.title}</div>
              <div className="blog-card-excerpt">{b.excerpt}</div>
            </div>
            <div className="blog-card-actions">
              <button className="tbl-btn" onClick={()=>openEdit(b)}><FiEdit2/></button>
              <button className="tbl-btn tbl-btn-del" onClick={async()=>{if(window.confirm('Delete?')){await api.delete(`/blogs/${b._id}`);load();}}}><FiTrash2/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="adm-modal-bg" onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-hdr"><h2>{editing?'Edit':'New'} Blog Post</h2><button onClick={()=>setModal(false)}><FiX/></button></div>
            <form onSubmit={save} className="adm-modal-body">
              <div className="img-upload-box" onClick={()=>imgRef.current.click()} style={{height:160}}>
                {imgPrev ? <img src={imgPrev} alt="preview"/> : <div className="iub-placeholder"><FiUpload/><span>Cover image upload करें (multiple select करें)</span></div>
                {imgPrevs.length > 1 && (
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',padding:'8px 10px',background:'var(--bg3)',borderTop:'1px solid var(--border)'}}>
                    {imgPrevs.map((p,i) => (
                      <div key={i} style={{width:48,height:36,borderRadius:5,overflow:'hidden',border:i===0?'2px solid var(--forest2)':'1px solid var(--border)'}}>
                        <img src={p} alt={''} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      </div>
                    ))}
                    <div style={{fontSize:'.72rem',color:'var(--text3)',alignSelf:'center',fontWeight:600}}>{imgPrevs.length} images selected</div>
                  </div>
                )}}
                <input ref={imgRef} type="file" accept="image/*" multiple onChange={e=>{const files=Array.from(e.target.files);if(files.length>0){setImgFile(files[0]);setImgFiles(files);setImgPrev(URL.createObjectURL(files[0]));setImgPrevs(files.map(f=>URL.createObjectURL(f)));}}} style={{display:'none'}}/>
              </div>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/></div>
              <div className="form-group"><label>Excerpt (Short Description)</label><textarea value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))} rows={2}/></div>
              <div className="form-group"><label>Content *</label><textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} rows={8} required/></div>
              <div className="form-row">
                <div className="form-group"><label>Tags (comma-separated)</label><input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="dogs, health, grooming"/></div>
                <div className="form-group"><label>Status</label><select value={form.published} onChange={e=>setForm(f=>({...f,published:e.target.value==='true'}))}><option value="false">Draft</option><option value="true">Published</option></select></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:10}}>
                <button type="button" className="btn btn-outline btn-sm" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── VIDEOS ─────────────────────────────────────────────────────
function Videos() {
  const [videos, setVideos] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({title:'',description:'',youtubeUrl:'',category:'general',published:true});
  const load = () => api.get('/videos/all').then(r=>setVideos(r.data));
  useEffect(()=>{load();},[]);
  const save = async (e) => {
    e.preventDefault();
    try {
      if(editing) await api.put(`/videos/${editing}`,form); else await api.post('/videos',form);
      toast.success('Saved!'); setModal(false); load();
    } catch(err){toast.error(err.response?.data?.message||'Error');}
  };
  const getThumb = (url) => { const m=url?.match(/(?:youtu\.be\/|watch\?v=)([^&]+)/); return m?`https://img.youtube.com/vi/${m[1]}/mqdefault.jpg`:null; };

  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><div><h1>Videos</h1><p>Experience & Tips Videos</p></div><button className="btn btn-primary btn-sm" onClick={()=>{setForm({title:'',description:'',youtubeUrl:'',category:'general',published:true});setEditing(null);setModal(true)}}><FiPlus/> Add Video</button></div>
      <div className="blog-grid">
        {videos.map(v=>(
          <div key={v._id} className="card blog-card">
            {getThumb(v.youtubeUrl) && <img src={getThumb(v.youtubeUrl)} alt={v.title} className="blog-card-img"/>}
            <div className="blog-card-body">
              <span className={`pill ${v.published?'pill-confirmed':'pill-pending'}`} style={{fontSize:'0.7rem'}}>{v.category}</span>
              <div className="blog-card-title">{v.title}</div>
            </div>
            <div className="blog-card-actions">
              <button className="tbl-btn" onClick={()=>{setForm({...v});setEditing(v._id);setModal(true)}}><FiEdit2/></button>
              <button className="tbl-btn tbl-btn-del" onClick={async()=>{if(window.confirm('Delete?')){await api.delete(`/videos/${v._id}`);load();}}}><FiTrash2/></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className="adm-modal-bg" onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
          <div className="adm-modal" style={{maxWidth:520}}>
            <div className="adm-modal-hdr"><h2>{editing?'Edit':'Add'} Video</h2><button onClick={()=>setModal(false)}><FiX/></button></div>
            <form onSubmit={save} className="adm-modal-body">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/></div>
              <div className="form-group"><label>YouTube URL *</label><input value={form.youtubeUrl} onChange={e=>setForm(f=>({...f,youtubeUrl:e.target.value}))} placeholder="https://www.youtube.com/watch?v=..." required/></div>
              {form.youtubeUrl && getThumb(form.youtubeUrl) && <img src={getThumb(form.youtubeUrl)} alt="thumb" style={{width:'100%',borderRadius:10,marginBottom:12}}/>}
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}/></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option value="experience">Patient Experience</option><option value="treatment">Treatment</option><option value="tips">Pet Tips</option><option value="grooming">Grooming</option><option value="general">General</option></select></div>
                <div className="form-group"><label>Status</label><select value={form.published} onChange={e=>setForm(f=>({...f,published:e.target.value==='true'}))}><option value="true">Published</option><option value="false">Hidden</option></select></div>
              </div>
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:10}}>
                <button type="button" className="btn btn-outline btn-sm" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────
function Settings() {
  const [settings, setSettings] = useState({});
  const [tab, setTab] = useState('clinic');
  const [saving, setSaving] = useState(false);
  const [doctorImgFile, setDoctorImgFile] = useState(null);
  const [doctorImgPrev, setDoctorImgPrev] = useState(null);
  const imgRef = useRef();

  useEffect(() => { api.get('/settings').then(r=>{setSettings(r.data); setDoctorImgPrev(imgUrl(r.data.doctor_photo));}); }, []);

  const set = (k,v) => setSettings(s=>({...s,[k]:v}));

  const save = async () => {
    setSaving(true);
    try {
      // Use single multipart request — handles photo + all settings together
      const fd = new FormData();
      if (doctorImgFile) fd.append('doctor_photo', doctorImgFile);
      Object.entries(settings).forEach(([k,v]) => {
        if (v !== null && v !== undefined && k !== 'doctor_photo') fd.append(k, v);
      });
      const r = await api.put('/settings', fd, { headers:{'Content-Type':'multipart/form-data'} });
      // Cache-bust the doctor photo so it loads fresh immediately
      if (r.data.doctor_photo) {
        const freshUrl = imgUrl(r.data.doctor_photo, true); // bust=true adds timestamp
        setDoctorImgPrev(freshUrl);
        setSettings(s => ({...s, doctor_photo: r.data.doctor_photo}));
      }
      setDoctorImgFile(null);
      toast.success('Settings saved! ✅');
      // Reload settings to sync across site
      const fresh = await api.get('/settings');
      setSettings(fresh.data);
    } catch(e) { toast.error('Error saving: ' + (e.response?.data?.message || e.message)); }
    setSaving(false);
  };

  const tabs = [
    {id:'clinic',label:'🏥 Clinic'},
    {id:'doctor',label:'👨‍⚕️ Doctor'},
    {id:'payment',label:'💳 Payment'},
    {id:'prices',label:'💰 Prices'},
    {id:'social',label:'📱 Social'},
  ];

  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><div><h1>Site Settings</h1><p>Control everything from here</p></div><button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving?'Saving...':'💾 Save All'}</button></div>
      <div className="settings-tabs">{tabs.map(t=><button key={t.id} className={`ftab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
      <div className="card" style={{padding:24,marginTop:16}}>
        {tab==='clinic' && <>
          <SettingField label="Clinic Name" k="clinic_name" val={settings.clinic_name} set={set}/>
          <SettingField label="Tagline" k="clinic_tagline" val={settings.clinic_tagline} set={set}/>
          <SettingField label="Phone" k="clinic_phone" val={settings.clinic_phone} set={set}/>
          <SettingField label="Email" k="clinic_email" val={settings.clinic_email} set={set}/>
          <SettingField label="Address" k="clinic_address" val={settings.clinic_address} set={set} type="textarea"/>
          <SettingField label="Working Hours" k="clinic_hours" val={settings.clinic_hours} set={set}/>
          <SettingField label="WhatsApp Number (with country code)" k="clinic_whatsapp" val={settings.clinic_whatsapp} set={set} hint="e.g. 917456064956"/>
          <SettingField label="Google Maps URL" k="clinic_maps_url" val={settings.clinic_maps_url} set={set}/>
          <SettingField label="Google Maps Embed URL" k="clinic_maps_embed" val={settings.clinic_maps_embed} set={set} type="textarea" hint="Google Maps > Share > Embed map > copy the src URL"/>
        </>}
        {tab==='doctor' && <>
          <div className="form-group">
            <label>Doctor Photo</label>
            <div className="img-upload-box" onClick={()=>imgRef.current.click()} style={{height:180,maxWidth:280}}>
              {doctorImgPrev ? <img src={doctorImgPrev} alt="Doctor"/> : <div className="iub-placeholder"><FiUpload/><span>Upload Doctor Photo</span></div>}
              <input ref={imgRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setDoctorImgFile(f);setDoctorImgPrev(URL.createObjectURL(f));}}} style={{display:'none'}}/>
            </div>
          </div>
          <SettingField label="Doctor Name" k="doctor_name" val={settings.doctor_name} set={set}/>
          <SettingField label="Degree" k="doctor_degree" val={settings.doctor_degree} set={set}/>
          <SettingField label="College" k="doctor_college" val={settings.doctor_college} set={set}/>
          <SettingField label="Years of Experience" k="doctor_experience" val={settings.doctor_experience} set={set}/>
          <SettingField label="Speciality" k="doctor_speciality" val={settings.doctor_speciality} set={set}/>
          <SettingField label="Bio / Description" k="doctor_bio" val={settings.doctor_bio} set={set} type="textarea"/>
        </>}
        {tab==='payment' && <>
          <SettingField label="UPI ID" k="upi_id" val={settings.upi_id} set={set} hint="e.g. 7456064956@ptsbi"/>
          <SettingField label="UPI Display Name" k="upi_name" val={settings.upi_name} set={set}/>
          <SettingField label="Payment Note (shown at checkout)" k="payment_note" val={settings.payment_note} set={set}/>
        </>}
        {tab==='prices' && <>
          <div className="settings-price-grid">
            {[['price_consultation','Consultation Fee (₹)'],['price_grooming','Grooming Fee (₹)'],['price_vaccination','Vaccination Fee (₹)'],['price_dental','Dental Care Fee (₹)'],['price_xray','X-Ray Fee (₹)'],['price_boarding','Boarding/Night (₹)'],['delivery_fee','Delivery Fee (₹)'],['gst_percent','GST %']].map(([k,l])=>(
              <SettingField key={k} label={l} k={k} val={settings[k]} set={set} type="number"/>
            ))}
          </div>
        </>}
        {tab==='social' && <>
          <SettingField label="Facebook URL" k="social_facebook" val={settings.social_facebook} set={set} hint="https://facebook.com/..."/>
          <SettingField label="Instagram URL" k="social_instagram" val={settings.social_instagram} set={set} hint="https://instagram.com/..."/>
          <SettingField label="YouTube URL" k="social_youtube" val={settings.social_youtube} set={set} hint="https://youtube.com/..."/>
        </>}
      </div>
    </div>
  );
}

function SettingField({label,k,val,set,type='text',hint}) {
  return (
    <div className="form-group">
      <label>{label}{hint && <span style={{fontWeight:400,color:'var(--text3)',marginLeft:6,fontSize:'0.75rem'}}>({hint})</span>}</label>
      {type==='textarea'
        ? <textarea value={val||''} onChange={e=>set(k,e.target.value)} rows={3}/>
        : <input type={type} value={val||''} onChange={e=>set(k, type==='number' ? Number(e.target.value) : e.target.value)}/>
      }
    </div>
  );
}

// ── ORDERS ─────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState([]);
  const [sel, setSel] = useState(null);
  useEffect(()=>{ api.get('/orders').then(r=>setOrders(r.data)); },[]);
  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><h1>Orders</h1></div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Order Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{orders.map(o=>(
            <tr key={o._id}>
              <td><div className="tbl-name">{o.customerName}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>{o.phone}</div></td>
              <td style={{fontSize:'0.83rem'}}>{o.items?.length} items</td>
              <td><strong>₹{o.total?.toLocaleString('en-IN')}</strong></td>
              <td><span className={`pill pill-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
              <td><select value={o.orderStatus} onChange={async e=>{await api.put(`/orders/${o._id}`,{orderStatus:e.target.value});const u=[...orders];const i=u.findIndex(x=>x._id===o._id);u[i]={...u[i],orderStatus:e.target.value};setOrders(u);toast.success('Updated!');}} style={{fontSize:'0.82rem',padding:'4px 8px',borderRadius:8,border:'1.5px solid var(--border)',background:'var(--input-bg)',color:'var(--text)'}}><option value="placed">Placed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>
              <td style={{fontSize:'0.82rem',whiteSpace:'nowrap'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              <td><button className="tbl-btn" onClick={()=>setSel(o)}><FiEye/></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {sel && (
        <div className="adm-modal-bg" onClick={e=>{if(e.target===e.currentTarget)setSel(null)}}>
          <div className="adm-modal" style={{maxWidth:480}}>
            <div className="adm-modal-hdr"><h2>Order Details</h2><button onClick={()=>setSel(null)}><FiX/></button></div>
            <div className="adm-modal-body">
              <p><strong>{sel.customerName}</strong> · {sel.phone}</p>
              <p style={{fontSize:'0.83rem',color:'var(--text3)',margin:'4px 0 16px'}}>📍 {sel.address}, {sel.city} - {sel.pincode}</p>
              {sel.items?.map((item,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)',fontSize:'0.85rem'}}><span>{item.emoji} {item.name} × {item.quantity}</span><strong>₹{(item.price*item.quantity).toLocaleString('en-IN')}</strong></div>)}
              <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:4}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}><span>Subtotal</span><span>₹{sel.subtotal?.toLocaleString('en-IN')}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}><span>Delivery</span><span>₹{sel.deliveryFee}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',fontWeight:800}}><span>Total</span><span>₹{sel.total?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PATIENTS ───────────────────────────────────────────────────
function Patients() {
  const [patients, setPatients] = useState([]);
  useEffect(()=>{ api.get('/patients').then(r=>setPatients(r.data)); },[]);
  return (
    <div className="adm-page">
      <div className="adm-page-hdr"><h1>Patients</h1><p>{patients.length} registered</p></div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Joined</th></tr></thead>
          <tbody>{patients.map(p=>(
            <tr key={p._id}><td className="tbl-name">{p.name}</td><td style={{fontSize:'0.83rem'}}>{p.email}</td><td>{p.phone}</td><td style={{fontSize:'0.82rem',color:'var(--text3)'}}>{p.address}, {p.city}</td><td style={{fontSize:'0.8rem'}}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export default function AdminPanel() {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{marginTop:'40vh'}}/>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login"/>;
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard/>}/>
        <Route path="products" element={<Products/>}/>
        <Route path="appointments" element={<Appointments/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="reviews" element={<Reviews/>}/>
        <Route path="blog" element={<Blog/>}/>
        <Route path="videos" element={<Videos/>}/>
        <Route path="patients" element={<Patients/>}/>
        <Route path="settings" element={<Settings/>}/>
      </Routes>
    </AdminLayout>
  );
}
