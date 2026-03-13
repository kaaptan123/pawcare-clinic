import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, SettingsProvider } from './context/ThemeContext';
import { AuthProvider, CartProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

const Home            = lazy(() => import('./pages/Home'));
const About           = lazy(() => import('./pages/About'));
const Services        = lazy(() => import('./pages/Services'));
const Shop            = lazy(() => import('./pages/Shop'));
const Checkout        = lazy(() => import('./pages/Checkout'));
const Appointment     = lazy(() => import('./pages/Appointment'));
const BlogList        = lazy(() => import('./pages/BlogList'));
const BlogPost        = lazy(() => import('./pages/BlogPost'));
const Gallery         = lazy(() => import('./pages/Gallery'));
const Contact         = lazy(() => import('./pages/Contact'));
const Login           = lazy(() => import('./pages/Login'));
const Register        = lazy(() => import('./pages/Register'));
const ForgotPassword  = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword   = lazy(() => import('./pages/ResetPassword'));
const AdminLogin      = lazy(() => import('./pages/AdminLogin'));
const AdminPanel      = lazy(() => import('./pages/admin/AdminPanel'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));

const Spinner = () => <div className="spinner" style={{marginTop:'40vh'}}/>;

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('doctorg24_token');
  const user  = JSON.parse(localStorage.getItem('doctorg24_user') || '{}');
  if (!token || user.role !== 'admin') return <Navigate to="/admin/login"/>;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster position="top-center" toastOptions={{
                style:{ background:'var(--surface)',color:'var(--text)',border:'1px solid var(--border)',borderRadius:10,fontSize:'.88rem' },
                success:{ iconTheme:{ primary:'#2D6A4F', secondary:'#fff' } },
              }}/>
              <Suspense fallback={<Spinner/>}>
                <Routes>
                  <Route path="/"                    element={<Home/>}/>
                  <Route path="/about"               element={<About/>}/>
                  <Route path="/services"            element={<Services/>}/>
                  <Route path="/shop"                element={<Shop/>}/>
                  <Route path="/checkout"            element={<Checkout/>}/>
                  <Route path="/appointment"         element={<Appointment/>}/>
                  <Route path="/blog"                element={<BlogList/>}/>
                  <Route path="/blog/:slug"          element={<BlogPost/>}/>
                  <Route path="/gallery"             element={<Gallery/>}/>
                  <Route path="/contact"             element={<Contact/>}/>
                  <Route path="/login"               element={<Login/>}/>
                  <Route path="/register"            element={<Register/>}/>
                  <Route path="/forgot-password"     element={<ForgotPassword/>}/>
                  <Route path="/reset-password"      element={<ResetPassword/>}/>
                  <Route path="/admin/login"         element={<AdminLogin/>}/>
                  <Route path="/admin/*"             element={<ProtectedAdmin><AdminPanel/></ProtectedAdmin>}/>
                  <Route path="/patient/dashboard"   element={<PatientDashboard/>}/>
                  <Route path="*"                    element={<Navigate to="/"/>}/>
                </Routes>
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
