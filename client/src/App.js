import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, SettingsProvider } from './context/ThemeContext';
import { AuthProvider, CartProvider } from './context/AppContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Shop from './pages/Shop';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import PatientDashboard from './pages/patient/PatientDashboard';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster position="top-center" toastOptions={{ style:{ background:'var(--surface)', color:'var(--text)', border:'1.5px solid var(--border)', borderRadius:12 }}}/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/services" element={<Services/>}/>
                <Route path="/shop" element={<Shop/>}/>
                <Route path="/blog" element={<BlogList/>}/>
                <Route path="/blog/:slug" element={<BlogPost/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/appointment" element={<Appointment/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/admin/login" element={<AdminLogin/>}/>
                <Route path="/admin/*" element={<AdminPanel/>}/>
                <Route path="/patient/*" element={<PatientDashboard/>}/>
              </Routes>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
