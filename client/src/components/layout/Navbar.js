import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, useCart } from '../../context/AppContext';
import { useSettings } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiPhone, FiShield, FiAward, FiClock } from 'react-icons/fi';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const settings = useSettings();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { to:'/', label:'Home', end:true },
    { to:'/about', label:'About' },
    { to:'/services', label:'Services' },
    { to:'/shop', label:'Shop' },
    { to:'/blog', label:'Blog' },
    { to:'/gallery', label:'Gallery' },
    { to:'/contact', label:'Contact' },
  ];

  return (
    <>
      {/* TOP TRUST BAR */}
      {!scrolled && (
        <div className="trust-bar">
          <div className="trust-bar-inner">
            <span className="tb-item"><FiShield size={11}/> Govt. Certified M.V.Sc.</span>
            <span className="tb-sep">·</span>
            <span className="tb-item"><FiAward size={11}/> {settings.doctor_experience||'25'}+ Years Experience</span>
            <span className="tb-sep">·</span>
            <span className="tb-item">🐾 5000+ Happy Pets</span>
            <span className="tb-sep">·</span>
            <span className="tb-item"><FiClock size={11}/> 24/7 Emergency</span>
            <span className="tb-sep">·</span>
            <a href={`tel:${settings.clinic_phone||'7456064956'}`} className="tb-phone">
              <FiPhone size={11}/> {settings.clinic_phone||'7456064952'}
            </a>
          </div>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{top: scrolled ? 0 : 34}}>
        <div className="nav-inner container">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-paw">🐾</div>
            <div>
              <div className="nav-brand">
                Doctor<span>G24</span>
              </div>
              <div className="nav-brand-sub">Dr. Manoj Kumar Gupta · M.V.Sc.</div>
            </div>
          </Link>

          <ul className={`nav-links ${open ? 'open' : ''}`}>
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}
                  className={({isActive}) => isActive ? 'active' : ''}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-mob-cta">
              <Link to="/appointment" className="btn btn-primary btn-sm" style={{width:'100%',justifyContent:'center',marginTop:4}} onClick={() => setOpen(false)}>
                Book Appointment
              </Link>
            </li>
          </ul>

          <div className="nav-actions">
            <button className="nav-icon" onClick={toggle} title="Toggle theme">
              {dark ? <FiSun size={16}/> : <FiMoon size={16}/>}
            </button>
            <Link to="/shop" className="nav-icon" title="Cart">
              <FiShoppingCart size={16}/>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="user-wrap">
                <button className="user-btn" onClick={() => setUserMenu(m => !m)}>
                  <div className="user-av">{user.name?.[0]?.toUpperCase()}</div>
                  <span className="user-nm">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={12}/>
                </button>
                {userMenu && (
                  <div className="user-drop" onMouseLeave={() => setUserMenu(false)}>
                    <div className="ud-hdr">
                      <div className="ud-name">{user.name}</div>
                      <div className="ud-email">{user.email}</div>
                    </div>
                    {isAdmin
                      ? <Link to="/admin" className="ud-link" onClick={() => setUserMenu(false)}>⚙️ Admin Panel</Link>
                      : <Link to="/patient/dashboard" className="ud-link" onClick={() => setUserMenu(false)}>👤 My Dashboard</Link>
                    }
                    <button className="ud-link ud-out" onClick={() => { logout(); setUserMenu(false); nav('/'); }}>
                      <FiLogOut size={12}/> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm nav-login-btn">
                <FiUser size={13}/> Login
              </Link>
            )}

            <Link to="/appointment" className="btn btn-primary btn-sm nav-book-btn">
              📅 Book Now
            </Link>

            <button className="nav-ham" onClick={() => setOpen(o => !o)}>
              {open ? <FiX size={22}/> : <FiMenu size={22}/>}
            </button>
          </div>
        </div>
        {open && <div className="nav-overlay" onClick={() => setOpen(false)}/>}
      </nav>
    </>
  );
}
