import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/AppContext';
import { useSettings } from '../context/ThemeContext';
import { useAuth } from '../context/AppContext';
import api, { imgUrl } from '../utils/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiCopy } from 'react-icons/fi';

export default function Checkout() {
  const { items, updateQty, removeItem, subtotal, total, delivery, gst, clearCart } = useCart();
  const settings = useSettings();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ customerName:user?.name||'', email:user?.email||'', phone:'', address:'', city:'Agra', pincode:'' });
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!items.length) return toast.error('Cart empty है');
    setLoading(true);
    try {
      await api.post('/orders', {
        ...form,
        patientId: user?._id||null,
        items: items.map(i=>({product:i._id, name:i.name, emoji:i.emoji, price:i.price, quantity:i.qty})),
        subtotal, deliveryFee:delivery, gst, total,
        paymentMethod:'UPI',
      });
      clearCart();
      toast.success('✅ Order placed! Confirmation email जल्द आएगी।');
      nav('/');
    } catch(err) { toast.error('Please try again'); }
    setLoading(false);
  };

  if (!items.length) return (
    <><Navbar/>
    <main className="page-top" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'4rem',marginBottom:16}}>🛒</div>
        <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:10}}>Cart Empty</h2>
        <Link to="/shop" className="btn btn-primary" style={{marginTop:8}}>Browse Shop</Link>
      </div>
    </main>
    <Footer/></>
  );

  return (
    <><Navbar/>
    <main className="page-top">
      <section style={{background:'var(--grad-dark)',padding:'48px 0 36px',color:'#fff',textAlign:'center'}}>
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2.2rem'}}>Checkout</h1>
      </section>
      <section style={{padding:'48px 0 80px',background:'var(--bg3)'}}>
        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 400px',gap:28,alignItems:'start'}}>
          {/* Left */}
          <div>
            <div className="card" style={{marginBottom:20,overflow:'hidden'}}>
              <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',fontWeight:700,fontSize:'.88rem'}}>Cart Items ({items.length})</div>
              {items.map(item=>(
                <div key={item._id} style={{display:'flex',gap:14,padding:'14px 20px',borderBottom:'1px solid var(--border)',alignItems:'center'}}>
                  <div style={{width:56,height:56,borderRadius:10,background:item.bgColor||'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                    {item.image ? <img src={imgUrl(item.image)} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{fontSize:'1.6rem'}}>{item.emoji||'📦'}</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'.87rem'}}>{item.name}</div>
                    <div style={{color:'var(--forest2)',fontWeight:700,marginTop:2}}>₹{item.price?.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={()=>updateQty(item._id,item.qty-1)} style={{width:28,height:28,border:'1px solid var(--border)',borderRadius:6,background:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiMinus size={12}/></button>
                    <span style={{fontWeight:700,minWidth:20,textAlign:'center'}}>{item.qty}</span>
                    <button onClick={()=>updateQty(item._id,item.qty+1)} style={{width:28,height:28,border:'1px solid var(--border)',borderRadius:6,background:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiPlus size={12}/></button>
                  </div>
                  <div style={{fontWeight:700,color:'var(--text)',minWidth:80,textAlign:'right'}}>₹{(item.price*item.qty)?.toLocaleString('en-IN')}</div>
                  <button onClick={()=>removeItem(item._id)} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',padding:4}}><FiTrash2 size={16}/></button>
                </div>
              ))}
            </div>

            <form onSubmit={placeOrder} className="card" style={{padding:24}}>
              <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:20}}>Delivery Details</div>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input value={form.customerName} onChange={e=>set('customerName',e.target.value)} required/></div>
                <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required/></div>
              </div>
              <div className="form-group"><label>Email (for receipt)</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="form-group"><label>Address *</label><textarea value={form.address} onChange={e=>set('address',e.target.value)} rows={2} required/></div>
              <div className="form-row">
                <div className="form-group"><label>City</label><input value={form.city} onChange={e=>set('city',e.target.value)}/></div>
                <div className="form-group"><label>Pincode</label><input value={form.pincode} onChange={e=>set('pincode',e.target.value)}/></div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:8}}>
                {loading ? 'Placing Order...' : '✅ Place Order (UPI Payment)'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <div className="card" style={{padding:24,position:'sticky',top:90}}>
              <div style={{fontWeight:700,fontSize:'.9rem',marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>Order Summary</div>
              {[['Subtotal',`₹${subtotal.toLocaleString('en-IN')}`],['Delivery',`₹${delivery}`],['GST (5%)',`₹${gst}`]].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',color:'var(--text2)',marginBottom:10}}><span>{l}</span><span>{v}</span></div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:'1rem',paddingTop:14,borderTop:'1px solid var(--border)',marginTop:6}}>
                <span>Total</span><span style={{color:'var(--forest2)'}}>₹{total.toLocaleString('en-IN')}</span>
              </div>

              {/* UPI payment */}
              <div style={{marginTop:20,background:'var(--bg3)',borderRadius:12,padding:16}}>
                <div style={{fontWeight:700,fontSize:'.8rem',marginBottom:12,color:'var(--text)'}}>💳 Pay via UPI</div>
                <div style={{display:'flex',alignItems:'center',gap:10,background:'var(--bg)',borderRadius:8,padding:'10px 14px'}}>
                  <span style={{fontSize:'.88rem',fontWeight:700,color:'var(--forest2)',flex:1}}>{settings.upi_id||'7456064956@ptsbi'}</span>
                  <button onClick={()=>{navigator.clipboard.writeText(settings.upi_id||'7456064956@ptsbi');toast.success('UPI ID copied!');}}
                    style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer'}}><FiCopy size={14}/></button>
                </div>
                <div style={{fontSize:'.75rem',color:'var(--text3)',marginTop:8}}>GPay, PhonePe, Paytm, Paytm · {settings.upi_name||'Dr. Manoj Kumar Gupta'}</div>
                <div style={{fontSize:'.73rem',color:'var(--text3)',marginTop:4}}>{settings.payment_note||'Cash on delivery also accepted'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/></>
  );
}
