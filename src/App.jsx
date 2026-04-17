import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Map, Clock, Coffee,
  Users, Activity, Navigation, ChevronRight,
  MonitorPlay, Maximize2, AlertCircle, Sparkles, TrendingUp, TrendingDown, LogOut,
  Bot, MessageSquare, Send, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './App.css';

// Initial Mock Data
const initialFacilities = [
  { id: 1, name: 'Food Court A', type: 'food', waitTime: 6, status: 'med', capacity: 65, distance: '2 mins away' },
  { id: 2, name: 'Washroom (Screen 1)', type: 'washroom', waitTime: 1, status: 'low', capacity: 15, distance: '1 min away' },
  { id: 3, name: 'Main Entry Gate', type: 'entry', waitTime: 12, status: 'high', capacity: 85, distance: '5 mins away' },
  { id: 4, name: 'Snack Bar B', type: 'food', waitTime: 2, status: 'low', capacity: 20, distance: '4 mins away' },
];

const initialCrowdData = [
  { time: '18:00', density: 30 },
  { time: '18:30', density: 45 },
  { time: '19:00', density: 80 },
  { time: '19:30', density: 95 },
  { time: '20:00', density: 25 },
  { time: '20:30', density: 15 },
  { time: '21:00', density: 75 },
];

const initialMovies = [
  { id: 1, screen: 'Screen 1', title: 'Inception', time: '19:30', status: 'Boarding', inMins: 15 },
  { id: 2, screen: 'Screen 2', title: 'Interstellar', time: '20:00', status: 'Waiting', inMins: 45 },
  { id: 3, screen: 'Screen 3', title: 'Dune: Part Two', time: '19:15', status: 'Running', inMins: -15 },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdmin, setShowAdmin] = useState(false);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [movieTimeLeft, setMovieTimeLeft] = useState(15);
  const [movieStatus, setMovieStatus] = useState('On Time');
  const [crowdData, setCrowdData] = useState(initialCrowdData);
  const [smartTip, setSmartTip] = useState('Washroom near Screen 1 is empty, best time to visit.');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToast, setActiveToast] = useState(null);
  const [adminBanners, setAdminBanners] = useState([]);
  const [adminInput, setAdminInput] = useState('');
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState('menu');
  const [deliveryOption, setDeliveryOption] = useState('seat');
  const [showAR, setShowAR] = useState(false);
  const [scheduleTab, setScheduleTab] = useState('today');
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [user, setUser] = useState({ name: 'Guest User', email: '' });
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    // Dynamically adding EmailJS script for REAL emails
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const sendRealEmail = (userObj) => {
    const SERVICE_ID = "service_32uhn1n"; 
    const TEMPLATE_ID = "template_c5gjfln"; 
    const PUBLIC_KEY = "cMwtlG4vb4yGEeh5K"; 

    if (window.emailjs && SERVICE_ID !== "YOUR_SERVICE_ID") {
      const templateParams = {
        name: userObj.name,
        user_email: userObj.email,
        to_email: userObj.email,
        user_password: loginForm.password, // This sends their password
        login_link: window.location.href, // This sends your live app URL
        message: `Your VenueSync account is now active! Use the link below to access your dashboard.`,
      };
      
      console.log("Attempting to send real email to:", userObj.email);
      
      window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((res) => {
        console.log("SUCCESS! Email Sent.", res.status, res.text);
        showToast("Welcome Email Sent Successfully!");
      })
      .catch((err) => {
        console.error("FAILED to send email...", err);
        showToast("Email sending failed. Check console for details.");
      });
    } else {
      console.warn("EmailJS script not loaded or IDs missing.");
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if(isRegistering) {
      if(loginForm.name && loginForm.email && loginForm.password) {
        setIsRegistering(false);
        showToast('Account Created! Please Login.');
      }
    } else {
      if(loginForm.email && loginForm.password) {
        const finalName = loginForm.name || loginForm.email.split('@')[0];
        const loggedUser = { name: finalName, email: loginForm.email };
        setUser(loggedUser);
        setIsLoggedIn(true);
        showToast(`Logged in as ${finalName}`);
        
        // Triggers the REAL Email Logic with correct object format
        try {
          sendRealEmail(loggedUser);
        } catch(err) {
          console.error("Email trigger failed", err);
        }
        
        // Shows simulated alert to user as well
        setTimeout(() => setShowEmailAlert(true), 1500);
        setTimeout(() => setShowEmailAlert(false), 7000);
      }
    }
  };

  const fullMenu = {
    Combos: [
      { id: 'c1', name: 'Couple Combo', desc: '1 L Popcorn + 2 Coke', price: 550 },
      { id: 'c2', name: 'Family Combo', desc: '2 L Popcorn + 4 Coke + Nachos', price: 950 },
    ],
    Snacks: [
      { id: 's1', name: 'Large Popcorn', desc: 'Caramel & Salted', price: 300 },
      { id: 's2', name: 'Punjabi Samosa (2 Pcs)', desc: 'Garam Garam (Snack Bar A)', price: 80 },
      { id: 's3', name: 'Cheese Nachos', desc: 'Jalapeno & Salsa', price: 150 },
      { id: 's4', name: 'French Fries', desc: 'Peri Peri Masala', price: 120 },
      { id: 's5', name: 'Grilled Sandwich', desc: 'Veg Cheese Corn', price: 100 },
    ],
    Beverages: [
      { id: 'b1', name: 'Cold Drink (Large)', desc: 'Coke / Pepsi / Sprite', price: 120 },
      { id: 'b2', name: 'Cold Coffee', desc: 'With Ice Cream', price: 180 },
      { id: 'b3', name: 'Mineral Water', desc: '1 Litre Bottle', price: 40 },
    ]
  };

  const addToCart = (name, price) => {
    setCartCount(c => c + 1);
    setCartTotal(t => t + price);
    showToast(`${name} added to cart!`);
  };

  const showToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const sendBroadcast = (msg, type = 'info') => {
    if (!msg) return;
    const newBanner = { id: Date.now(), msg, type };
    setAdminBanners(prev => [...prev, newBanner]);
    setAdminInput('');
    setTimeout(() => {
      setAdminBanners(prev => prev.filter(b => b.id !== newBanner.id));
    }, 5000);
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [facilities, searchQuery]);

  // Simulate real-time logic
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Movie Countdown Update
      setMovieTimeLeft(prev => {
        if (prev <= 0) return 0; // Or reset to next movie
        return prev - 1;
      });

      // 2. Dynamic Facility Updates
      setFacilities(prevFacilities => prevFacilities.map(fac => {
        // Randomly adjust wait time - simulate surges and drops
        let newWait = fac.waitTime + Math.floor(Math.random() * 5) - 2; // -2 to +2
        if (newWait < 0) newWait = 0;
        if (newWait > 30) newWait = 30; // Max out wait time

        // Determine capacity based on wait time loosely
        let newCapacity = Math.min(100, Math.max(0, newWait * 3 + Math.floor(Math.random() * 20)));

        let newStatus = 'low';
        if (newWait >= 10) newStatus = 'high';
        else if (newWait >= 5) newStatus = 'med';

        return { ...fac, waitTime: newWait, capacity: newCapacity, status: newStatus };
      }));

      // 3. Dynamic Crowd Graph (Simulate a moving "live" window occasionally)
      setCrowdData(prev => {
        const newData = [...prev];
        // Perturb the values slightly to make the graph "breath"
        return newData.map(point => ({ ...point, density: Math.max(0, Math.min(100, point.density + Math.floor(Math.random() * 7) - 3)) }));
      });

    }, 3000); // Poll every 3 seconds for active simulation feeling

    return () => clearInterval(interval);
  }, []);

  // Smart Tip Generator relying on live facility status
  useEffect(() => {
    const emptyWashroom = facilities.find(f => f.type === 'washroom' && f.status === 'low');
    const crowdedFood = facilities.find(f => f.type === 'food' && f.status === 'high');

    if (movieTimeLeft > 0 && movieTimeLeft <= 5) {
      setSmartTip('Movie starting in under 5 minutes! Proceed to Screen 1.');
      setMovieStatus('Boarding');
    } else if (movieTimeLeft === 0) {
      setSmartTip('Movie "Inception" is currently running.');
      setMovieStatus('Running');
    } else if (emptyWashroom) {
      setSmartTip(`Washroom (${emptyWashroom.name}) is free, skip the rush before the movie.`);
    } else if (crowdedFood) {
      setSmartTip(`${crowdedFood.name} is very crowded. Try pre-ordering or visiting Snack Bar B instead.`);
    } else {
      setSmartTip('Perfect time to grab snacks before the crowds arrive.');
    }
  }, [facilities, movieTimeLeft]);

  // Derived Overall Crowd Status
  const avgCrowd = facilities.reduce((sum, f) => sum + f.capacity, 0) / facilities.length;
  const overallCrowdStatus = avgCrowd > 75 ? 'Heavy' : avgCrowd > 40 ? 'Moderate' : 'Light';


  if (!isLoggedIn) {
    return (
      <div className="login-page" style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Animated Glow Orbs */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', top: '-10%', right: '-5%', zIndex: 0 }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', bottom: '5%', left: '-5%', zIndex: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-glass"
          style={{ width: '420px', padding: '50px 40px', borderRadius: '40px', zIndex: 1, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', textAlign: 'center' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(99,102,241,0.3)' }}>
              <Activity color="white" size={32} />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', marginBottom: '8px', letterSpacing: '-1.5px' }}>VenueSync</h1>
            <p style={{ color: 'var(--secondary)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {isRegistering ? 'Registration Portal' : 'Administrator Gateway'}
            </p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {isRegistering && (
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500', marginLeft: '5px' }}>FULL NAME</span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  style={{ width: '100%', marginTop: '6px', padding: '16px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                  required={isRegistering}
                />
              </div>
            )}

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500', marginLeft: '5px' }}>EMAIL ADDRESS</span>
              <input
                type="email"
                placeholder="name@company.com"
                style={{ width: '100%', marginTop: '6px', padding: '16px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500', marginLeft: '5px' }}>PASSWORD</span>
              <input
                type="password"
                placeholder="••••••••"
                style={{ width: '100%', marginTop: '6px', padding: '16px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '18px', borderRadius: '18px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px' }}
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '35px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
              {isRegistering ? 'Already have an account?' : "New to VenueSync?"}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', marginLeft: '8px', cursor: 'pointer', fontSize: '0.95rem' }}
              >
                {isRegistering ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Simulated Email Notification Portal */}
      <AnimatePresence>
        {showEmailAlert && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            style={{
              position: 'fixed', top: '100px', right: '30px', zIndex: 10000,
              width: '320px', padding: '16px', borderRadius: '16px',
              background: 'white', color: '#1f2937',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', gap: '15px'
            }}
          >
            <div style={{ background: '#ea4335', padding: '8px', borderRadius: '10px' }}>
              <Bell color="white" size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '0.85rem', color: '#ea4335' }}>GMAIL SYSTEM</p>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem', color: '#111827' }}>Login Alert: Successful</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Sent to {user.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'none' }}>
        <AnimatePresence>
          {adminBanners.map(banner => {
            const parts = banner.msg.split(': ');
            return (
              <motion.div
                key={banner.id}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                style={{
                  width: '100vw',
                  minHeight: '80px',
                  padding: '15px 50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '30px',
                  boxShadow: banner.type === 'alert' ? '0 10px 50px rgba(255,0,0,0.5)' : '0 10px 50px rgba(6,182,212,0.3)',
                  background: banner.type === 'alert'
                    ? 'linear-gradient(90deg, #810000 0%, #ff1f1f 50%, #810000 100%)'
                    : 'linear-gradient(90deg, #004e92 0%, #000428 50%, #004e92 100%)',
                  color: 'white',
                  borderBottom: '4px solid rgba(255,255,255,0.2)',
                  pointerEvents: 'auto',
                  transform: 'none' // Reset any CSS classes
                }}
              >
                <div className="banner-icon-side">
                  {banner.type === 'alert'
                    ? <AlertCircle size={40} className="animate-pulse" color="#fff" />
                    : <Bell size={40} className="animate-bounce" color="#fff" />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '4px', textShadow: '2px 2px 10px rgba(0,0,0,0.8)', marginBottom: '2px' }}>
                    {parts.length > 1 ? parts[0] : (banner.type === 'alert' ? 'CRITICAL SYSTEM ALERT' : 'OFFICIAL ANNOUNCEMENT')}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '400', color: 'rgba(255,255,255,0.95)', letterSpacing: '1px' }}>
                    {parts.length > 1 ? parts.slice(1).join(': ') : banner.msg}
                  </span>
                </div>

                <div style={{ width: '40px' }}></div> {/* Spacer for offset icon */}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar premium-glass">
        <div className="logo-container">
          <div className="logo-icon animate-pulse-slow">
            <Activity color="var(--primary)" size={28} />
          </div>
          <h1 className="logo-text">VenueSync</h1>
        </div>

        <div className="nav-links">
          <NavItem icon={<MonitorPlay />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Map />} label="Live Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <NavItem icon={<Clock />} label="Smart Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <NavItem icon={<Users />} label="Crowd Radar" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
        </div>

        <div className="user-profile" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.08)',
          marginTop: 'auto'
        }}>
          <div className="avatar" style={{ 
            width: '45px', 
            height: '45px', 
            minWidth: '45px',
            backgroundColor: 'var(--primary)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white', 
            fontWeight: '900',
            fontSize: '1.2rem',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            aspectRatio: '1/1',
            textTransform: 'uppercase'
          }}>
            {user.name.charAt(0)}
          </div>
          <div className="user-info" style={{ flex: 1, overflow: 'hidden' }}>
            <span className="user-name" style={{ display: 'block', fontWeight: '700', fontSize: '0.95rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </span>
            <span className="user-ticket" style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </span>
          </div>
          <button 
            className="icon-btn" 
            style={{ 
              padding: '10px', 
              color: '#ff4444', 
              background: 'rgba(255,68,68,0.08)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,68,68,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
               setIsLoggedIn(false);
               showToast('Logged out successfully');
            }}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">

        <header className="top-header">
          <div className="search-bar premium-glass">
            <input type="text" placeholder="Search facilities, screens, or features..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="header-actions">
            <button className="icon-btn premium-glass">
              <Bell size={20} />
              <span className="notification-dot animate-ping" style={{ position: 'absolute' }}></span>
            </button>
            <button className="icon-btn premium-glass">
              <Maximize2 size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-grid"
          >
            {/* Live Movie Status */}
            <div className="card premium-glass col-span-2">
              <div className="card-header">
                <h2>Live Event Sync</h2>
                <button className="view-all" onClick={() => setActiveTab('schedule')}>Full Schedule <ChevronRight size={16} /></button>
              </div>
              <div className="movie-status">
                <div className="movie-details">
                  <span className="live-tag animate-pulse">LIVE NOW</span>
                  <h3>{initialMovies[0].title}</h3>
                  <span className="screen-info">{initialMovies[0].screen}</span>
                </div>
                <div className="time-countdown">
                  <span className="time-value">{movieTimeLeft}</span>
                  <span className="time-unit">Mins to Start</span>
                </div>
              </div>
              <div className="progress-bar-container">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - (movieTimeLeft / 15 * 100)}%` }}
                />
              </div>
              <div className="recommendation">
                <Sparkles size={16} /> <span>{smartTip}</span>
              </div>
            </div>

            {/* Smart Actions Container */}
            <div className="card premium-glass">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="action-buttons">
                <button className="action-btn" onClick={() => setShowFoodMenu(true)}>
                  <Coffee size={18} color="var(--primary)" /> Pre-order Food
                </button>
                <button className="action-btn" onClick={() => setActiveTab('map')}>
                  <Navigation size={18} color="var(--secondary)" /> Navigate to Seat
                </button>
              </div>
            </div>

            {/* Facility Status Grid */}
            <div className="card premium-glass col-span-2">
              <div className="card-header">
                <h2>Real-time Facility Status</h2>
              </div>
              <div className="facility-list">
                <AnimatePresence>
                  {filteredFacilities.length > 0 ? filteredFacilities.map(fac => (
                    <FacilityRow key={fac.id} data={fac} />
                  )) : (
                    <div style={{ padding: '20px', color: 'var(--text-dim)', textAlign: 'center' }}>No matching facilities found.</div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Predictive Crowd Graph */}
            <div className="card premium-glass">
              <div className="card-header">
                <h2>Crowd Prediction</h2>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={crowdData}>
                    <defs>
                      <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="density" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smart Schedule Content */}
        {activeTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="schedule-view"
          >
            <div className="dashboard-content animate-fade-in">
              <div className="smart-schedule-tab">
                <div className="card-header" style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Movie & Event Sync</h2>
                  <div className="filter-group" style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className={`filter-btn ${scheduleTab === 'today' ? 'active' : ''}`}
                      onClick={() => setScheduleTab('today')}
                    >
                      Today's Schedule
                    </button>
                    <button
                      className={`filter-btn ${scheduleTab === 'tickets' ? 'active' : ''}`}
                      onClick={() => setScheduleTab('tickets')}
                    >
                      My Tickets
                    </button>
                  </div>
                </div>

                {scheduleTab === 'today' ? (
                  <div className="timeline-container">
                    <div className="timeline-line"></div>
                    {initialMovies.map((movie) => (
                      <div key={movie.id} className="timeline-event">
                        <div className="event-time" style={{ fontWeight: 'bold', color: 'var(--text-dim)', width: '60px' }}>{movie.time}</div>
                        <div className={`event-card premium-glass ${movie.status === 'Running' ? 'dimmed' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="event-info" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white' }}>{movie.title}</h3>
                            <span className="screen-tag" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', width: 'fit-content', border: '1px solid rgba(255,255,255,0.1)' }}>{movie.screen}</span>
                          </div>
                          <div className="event-status" style={{ textAlign: 'right' }}>
                            <span className={`status-badge ${movie.status.toLowerCase()}`} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                              {movie.status === 'Boarding' ? ' Boarding' : movie.status === 'Waiting' ? '🟡 Waiting' : '🔴 Running'}
                            </span>
                            <p className="countdown" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '10px', color: movie.status === 'Running' ? 'var(--text-dim)' : 'white' }}>
                              {movie.status === 'Running' ? 'Started' : `In ${movie.inMins}m`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="card premium-glass slot-recommendation" style={{ marginTop: '2rem', border: '1px solid var(--primary-glow)' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={18} color="var(--primary)" /> Smart Slot Recommendation
                      </h3>
                      <p>Best time for <strong>Food Court</strong> visit: <strong>21:15</strong> (Pre-movie rush drops by 80% after Interstellar starts).</p>
                      <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => showToast("⏰ Reminder Set for 21:15!")}>
                        Set Alarm Reminder
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-ticket-view animate-fade-in">
                    <div className="digital-ticket premium-glass" style={{ 
                      border: '1px solid var(--primary)', 
                      borderRadius: '15px', 
                      padding: '24px', 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                      gap: '20px'
                    }}>
                      <div className="ticket-info" style={{ flex: '1 1 300px', minWidth: '250px', textAlign: 'left' }}>
                        <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>WED, 15 APR • 20:00 PM</p>
                        <h2 style={{ margin: '8px 0', fontSize: '2rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>INTERSTELLAR <span style={{ fontSize: '1rem', background: '#eab308', color: 'black', padding: '4px 10px', borderRadius: '5px', verticalAlign: 'middle', marginLeft: '10px', fontWeight: 'bold' }}>IMAX 3D</span></h2>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
                          <div><p style={{ margin: '0 0 5px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>SCREEN</p><h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Screen 2</h4></div>
                          <div><p style={{ margin: '0 0 5px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>SEAT</p><h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.2rem' }}>VIP-A12</h4></div>
                          <div><p style={{ margin: '0 0 5px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>GATE</p><h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Entry B</h4></div>
                        </div>
                      </div>
                      <div className="ticket-qr" style={{ 
                        flex: '1 1 150px',
                        padding: '20px', 
                        borderLeft: 'none', 
                        borderTop: '2px dashed rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        maxWidth: '100%'
                      }}>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket_interstellar_vipa12&color=000000&bgcolor=ffffff" alt="Ticket QR" style={{ borderRadius: '10px', width: '130px', height: '130px' }} />
                        <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Scan at Gate Entry B</p>
                      </div>
                    </div>

                    <div className="card premium-glass" style={{ marginTop: '20px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🍿 Connected Pre-orders</h3>
                      {cartTotal > 0 ? (
                        <p style={{ color: '#22c55e', fontWeight: 'bold' }}>Active Order Delivery to Seat: ₹{cartTotal}</p>
                      ) : (
                        <p style={{ color: 'var(--text-dim)' }}>No food pre-ordered yet. Head to "Dashboard" to skip the line!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Live Map Content */}
        {activeTab === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="map-view"
          >
            <div className="card premium-glass map-container-3d">
              <div className="card-header">
                <h2>Live Venue Heatmap</h2>
                <div className="map-legend">
                  <span className="legend-item"><div className="dot low"></div> Relaxed</span>
                  <span className="legend-item"><div className="dot med"></div> Active</span>
                  <span className="legend-item"><div className="dot high"></div> Congested</span>
                </div>
              </div>
              <div className="map-grid-simulation floor-plan-design">
                {/* SVG Walking Path */}
                <svg className="walking-path" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 50 85 L 50 50 L 25 50 L 25 35" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="1,1" className="dash-anim" />
                </svg>

                {/* Structured Cinema Floor Plan Layout */}
                <VenueZone name="Screen 1 (IMAX - VIP A12)" density={initialCrowdData[4].density} x={5} y={5} width={42} height={35} type="venue" icon="🎥" />
                <VenueZone name="Screen 2 (Standard)" density={30} x={53} y={5} width={42} height={35} type="venue" icon="🎬" />

                <VenueZone name="Connecting Corridor" density={10} x={5} y={45} width={90} height={10} type="corridor" icon="🚶‍♂️" />

                <VenueZone name="Food Court & Snacks" density={facilities[0].capacity} x={50} y={60} width={45} height={20} type="service" icon="🍔" />
                <VenueZone name="Washrooms" density={facilities[1].capacity} x={5} y={60} width={35} height={20} type="service" icon="🚻" />

                <VenueZone name="Main Entrance & Box Office" density={facilities[2].capacity} x={25} y={85} width={50} height={12} type="lobby" icon="🎟️" />

                {/* Real-time moving "User" dot perfectly following the AR path */}
                <motion.div
                  className="user-dot ar-user"
                  style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
                  animate={{
                    left: ["50%", "50%", "25%", "25%"],
                    top: ["85%", "50%", "50%", "30%"]
                  }}
                  transition={{ duration: 7, times: [0, 0.4, 0.7, 1], repeat: Infinity, ease: "linear" }}
                >
                  <div className="ping"></div>
                  <Navigation size={14} color="white" style={{ transform: 'rotate(-45deg)', position: 'relative', zIndex: 5 }} />
                </motion.div>
              </div>
            </div>
            <div className="side-panel">
              <div className="card premium-glass">
                <h3>Navigation Intelligence</h3>
                <p className="description">Fastest route to seat VIP-A12 avoids Section B (High Density).</p>
                <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setShowAR(true)}>Start AR Navigation</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Crowd Radar Content */}
        {activeTab === 'radar' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="radar-view"
          >
            <div className="radar-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card premium-glass" style={{ display: 'block', width: '100%' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary)" /> Crowd Density Analytics
                </h3>
                <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
                  <div className="stat-box" style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', padding: '15px', borderRadius: '10px' }}>
                    <span className="label" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Main Entry Rush</span>
                    <span className="value" style={{ fontSize: '1.8rem', color: '#ff4444', fontWeight: 'bold' }}>85%</span>
                  </div>
                  <div className="stat-box" style={{ background: 'rgba(100,255,100,0.1)', border: '1px solid rgba(100,255,100,0.3)', padding: '15px', borderRadius: '10px' }}>
                    <span className="label" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Washroom A Flow</span>
                    <span className="value" style={{ fontSize: '1.8rem', color: '#44ff44', fontWeight: 'bold' }}>15%</span>
                  </div>
                  <div className="stat-box" style={{ background: 'rgba(100,100,255,0.1)', border: '1px solid rgba(100,100,255,0.3)', padding: '15px', borderRadius: '10px' }}>
                    <span className="label" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Food Court Wait</span>
                    <span className="value" style={{ fontSize: '1.8rem', color: '#4444ff', fontWeight: 'bold' }}>6 mins</span>
                  </div>
                </div>
              </div>

              <div className="card premium-glass" style={{ minHeight: '220px', width: '100%', display: 'block' }}>
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                  <TrendingUp size={18} color="var(--secondary)" /> Venue Queue Trends (Live)
                </h3>
                <div style={{ width: '100%', height: '160px', marginTop: '15px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crowdData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={12} tickLine={false} />
                      <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1a2e', borderColor: 'var(--primary)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="density" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card premium-glass col-span-2" style={{ marginTop: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="var(--primary)" /> Predictive Crowd Balancing Engine
                </h3>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '15px', 
                  flexWrap: 'wrap', 
                  gap: '15px' 
                }}>
                  <p style={{ flex: '1 1 250px', minWidth: '200px', color: 'var(--text-dim)', lineHeight: '1.5', margin: 0 }}>
                    {!isRoutingActive ? (
                      <>
                        <strong style={{ color: '#ff4444' }}>⚠️ Bottleneck Detected:</strong> Main Entry Gate is at 85% capacity. <br />
                        AI suggests immediately re-routing 30% incoming traffic toward Gate 4 to maintain a smooth 2-minute processing flow.
                      </>
                    ) : (
                      <>
                        <strong style={{ color: '#44ff44' }}>✅ Crowd Routing Activated:</strong> Re-routing in progress.<br />
                        Traffic is actively being diverted. Maintaining healthy flow across all entry points.
                      </>
                    )}
                  </p>
                  <button
                    className="btn-primary"
                    style={{ 
                      background: isRoutingActive ? 'transparent' : 'var(--primary)', 
                      border: isRoutingActive ? '1px solid #44ff44' : 'none', 
                      color: isRoutingActive ? '#44ff44' : 'white', 
                      cursor: isRoutingActive ? 'default' : 'pointer', 
                      fontWeight: 'bold',
                      width: window.innerWidth < 768 ? '100%' : 'auto',
                      padding: '12px 24px'
                    }}
                    onClick={() => {
                      if (!isRoutingActive) {
                        setIsRoutingActive(true);
                        showToast('✅ Smart Routing Active! Digital signs at Entry have been updated.');
                      }
                    }}
                  >
                    {isRoutingActive ? 'Routing Activated ✅' : 'Activate Smart Routing'}
                  </button>
                </div>

                <div className="balancing-viz" style={{ 
                  marginTop: '30px', 
                  padding: '30px', 
                  background: 'rgba(0,0,0,0.3)', 
                  borderRadius: '15px', 
                  display: 'flex', 
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: window.innerWidth < 768 ? '15px' : '0'
                }}>
                  <div className="node src" style={{
                    borderColor: isRoutingActive ? '#eab308' : '#ff4444',
                    color: isRoutingActive ? '#eab308' : '#ff4444',
                    background: isRoutingActive ? 'rgba(234,179,8,0.1)' : 'rgba(255,68,68,0.1)',
                    width: '90px', height: '90px', borderRadius: '50%', border: '2px solid',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexShrink: 0, zIndex: 2, textAlign: 'center', transition: 'all 1s'
                  }}>
                    Main Entry<br /><strong style={{ fontSize: '1.4rem' }}>{isRoutingActive ? '55%' : '85%'}</strong>
                  </div>

                  <div className="flow-line-container" style={{ 
                    flexGrow: 1, 
                    margin: window.innerWidth < 768 ? '0 auto' : '0 20px', 
                    position: 'relative', 
                    height: window.innerWidth < 768 ? '40px' : '4px', 
                    width: window.innerWidth < 768 ? '4px' : 'auto',
                    overflow: 'hidden', 
                    borderRadius: '2px', 
                    background: isRoutingActive ? 'linear-gradient(90deg, #eab308, #44ff44)' : 'transparent', 
                    borderTop: (isRoutingActive || window.innerWidth < 768) ? 'none' : '3px dashed rgba(255,255,255,0.2)', 
                    borderLeft: (isRoutingActive || window.innerWidth >= 768) ? 'none' : '3px dashed rgba(255,255,255,0.2)',
                    transition: 'all 0.5s', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    {isRoutingActive && (
                      <motion.div
                        style={{ 
                          position: 'absolute', 
                          top: window.innerWidth < 768 ? 0 : 'auto',
                          left: window.innerWidth < 768 ? 'auto' : 0, 
                          width: window.innerWidth < 768 ? '100%' : '60px', 
                          height: window.innerWidth < 768 ? '60px' : '100%', 
                          background: 'rgba(255,255,255,0.8)', 
                          filter: 'blur(2px)', 
                          boxShadow: '0 0 15px rgba(255,255,255,0.8)' 
                        }}
                        animate={window.innerWidth < 768 ? { top: ['-10%', '110%'] } : { left: ['-10%', '110%'] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>

                  <div className="node dest" style={{
                    borderColor: isRoutingActive ? '#eab308' : '#44ff44',
                    color: isRoutingActive ? '#eab308' : '#44ff44',
                    background: isRoutingActive ? 'rgba(234,179,8,0.1)' : 'rgba(68,255,68,0.1)',
                    width: '90px', height: '90px', borderRadius: '50%', border: '2px solid',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexShrink: 0, zIndex: 2, textAlign: 'center', transition: 'all 1s'
                  }}>
                    Gate 4<br /><strong style={{ fontSize: '1.4rem' }}>{isRoutingActive ? '42%' : '12%'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Admin Layer Simulation */}
        <div className="admin-toggle" style={{ 
          position: 'fixed', 
          top: '50%', 
          right: '0', 
          transform: 'translateY(-50%)',
          zIndex: 1001 
        }}>
          <button 
            className="premium-glass" 
            style={{ 
              padding: '12px 10px', 
              fontSize: '0.7rem', 
              borderRadius: '15px 0 0 15px', 
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              boxShadow: '-5px 0 15px rgba(0,0,0,0.3)'
            }}
            onClick={() => setShowAdmin(!showAdmin)}
          >
            <div className={`status-dot ${showAdmin ? 'on' : 'off'}`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: showAdmin ? '#44ff44' : '#ff4444' }}></div>
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{showAdmin ? 'CLOSE' : 'ADMIN'}</span>
          </button>
        </div>

        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="admin-control-layer premium-glass"
              style={{ 
                position: 'fixed', 
                bottom: '90px', 
                left: window.innerWidth < 768 ? '15px' : 'auto', 
                right: window.innerWidth < 768 ? '15px' : '30px',
                width: window.innerWidth < 768 ? 'auto' : '420px', 
                maxHeight: '70vh',
                overflowY: 'auto',
                padding: '20px', 
                zIndex: 1000, 
                border: '1px solid rgba(255,255,255,0.2)', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
                background: 'rgba(15, 15, 35, 0.98)',
                backdropFilter: 'blur(25px)'
              }}
            >
              <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', margin: 0 }}><Users size={20} color="var(--primary)" /> Admin Console</h3>
                <span className="live-tag blink" style={{ background: '#ff4444', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>● LIVE BROADCAST</span>
              </div>
              <div className="admin-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    style={{ flex: 1, padding: '12px', background: 'rgba(255,68,68,0.15)', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                    onClick={() => sendBroadcast('🚨 EMERGENCY ALARM: Evacuate Screen 1 through Exit A immediately.', 'alert')}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,68,68,0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,68,68,0.15)'}
                  >
                    Evacuate Alarm
                  </button>
                  <button
                    style={{ flex: 1, padding: '12px', background: 'rgba(74,225,248,0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                    onClick={() => sendBroadcast('ℹ️ Update: Inception is now boarding at Screen 1.', 'info')}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(74,225,248,0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(74,225,248,0.15)'}
                  >
                    Boarding Alert
                  </button>
                </div>

                <div className="broadcast-input-group" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Type custom announcement..."
                    style={{ flex: 1, padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', color: 'white', background: 'rgba(0,0,0,0.5)', outline: 'none' }}
                    value={adminInput} onChange={(e) => setAdminInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && adminInput) sendBroadcast(adminInput, 'info'); }}
                  />
                  <button
                    className="btn-primary"
                    style={{ padding: '0 20px', borderRadius: '10px' }}
                    onClick={() => { if (adminInput) sendBroadcast(adminInput, 'info'); }}
                  >
                    Send Event
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Action Toast Notification */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ y: 50, opacity: 0, x: '-50%' }}
              animate={{ y: 0, opacity: 1, x: '-50%' }}
              exit={{ y: 50, opacity: 0, x: '-50%' }}
              className="toast-notification premium-glass"
            >
              <Sparkles size={16} color="var(--primary)" /> {activeToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Food & Beverage Menu Modal */}
        <AnimatePresence>
          {showFoodMenu && (
            <div className="modal-overlay" onClick={() => { setShowFoodMenu(false); setCheckoutStep('menu'); setCartCount(0); setCartTotal(0); }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="food-menu-modal premium-glass"
                onClick={(e) => e.stopPropagation()}
              >

                {checkoutStep === 'menu' && (
                  <>
                    <div className="modal-header">
                      <h2> Full Food & Beverage Menu</h2>
                      <button className="close-btn" onClick={() => { setShowFoodMenu(false); setCartCount(0); setCartTotal(0); }}>×</button>
                    </div>

                    <div className="food-list custom-scrollbar">
                      {Object.keys(fullMenu).map(category => (
                        <div key={category} className="menu-category">
                          <h3 className="category-title">{category}</h3>
                          {fullMenu[category].map(item => (
                            <div className="food-item" key={item.id}>
                              <div className="food-info">
                                <h4>{item.name}</h4>
                                <p>{item.desc}</p>
                              </div>
                              <button className="add-btn" onClick={() => addToCart(item.name, item.price)}>+ ₹{item.price}</button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="modal-footer">
                      <button
                        className="checkout-btn"
                        onClick={() => {
                          if (cartCount === 0) {
                            showToast('Please add items to cart first.');
                            return;
                          }
                          setCheckoutStep('qr');
                        }}
                      >
                        Proceed to Pay ₹{cartTotal} ({cartCount} items)
                      </button>
                    </div>
                  </>
                )}

                {checkoutStep === 'qr' && (
                  <div className="qr-checkout-step">
                    <div className="modal-header">
                      <h2>📱 Review & Pay</h2>
                      <button className="close-btn" onClick={() => { setShowFoodMenu(false); setCheckoutStep('menu'); setCartCount(0); setCartTotal(0); }}>×</button>
                    </div>

                    {/* Order Details box */}
                    <div style={{ textAlign: 'left', padding: '16px', marginBottom: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                      <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', color: 'var(--text-main)' }}>Order Summary & Location</h4>
                      <p style={{ margin: '6px 0', fontSize: '0.95rem', color: 'var(--text-dim)' }}><strong style={{ color: 'white' }}>Customer Name:</strong> {user.name}</p>
                      <p style={{ margin: '6px 0', fontSize: '0.95rem', color: 'var(--text-dim)' }}><strong style={{ color: 'white' }}>Your Location:</strong> Screen 1, Seat VIP-A12</p>

                      <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                        <button
                          className={`filter-btn ${deliveryOption === 'seat' ? 'active' : ''}`}
                          style={{ flex: 1, padding: '10px', background: deliveryOption === 'seat' ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}
                          onClick={() => setDeliveryOption('seat')}
                        >
                          💺 Deliver to Seat
                        </button>
                        <button
                          className={`filter-btn ${deliveryOption === 'pickup' ? 'active' : ''}`}
                          style={{ flex: 1, padding: '10px', background: deliveryOption === 'pickup' ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}
                          onClick={() => setDeliveryOption('pickup')}
                        >
                          I'll Pick Up
                        </button>
                      </div>
                    </div>

                    <div className="qr-container" style={{ padding: '16px' }}>
                      <p className="qr-amount">Total Amount: <strong>₹{cartTotal}</strong></p>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=venuesync@hdfc&pn=VenueSync&am=${cartTotal}&cu=INR`} alt="UPI QR Code" className="qr-image" style={{ width: '140px', height: '140px' }} />
                      <p className="qr-instruction">Scan to Pay via PhonePe, GPay, Paytm</p>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="upi-logo" />
                    </div>
                    <div className="modal-footer">
                      <button className="btn-secondary" onClick={() => setCheckoutStep('menu')} style={{ marginBottom: '10px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
                      <button
                        className="checkout-btn"
                        onClick={() => {
                          setShowFoodMenu(false);
                          setCheckoutStep('menu');
                          showToast(deliveryOption === 'seat'
                            ? `Payment ₹${cartTotal} Confirmed! Food will arrive at Seat VIP-A12.`
                            : `Payment ₹${cartTotal} Confirmed! Pick up from Fast Track Counter.`);
                          setCartCount(0);
                          setCartTotal(0);
                        }}
                      >
                        I have completed the Payment
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AR Navigation Viewfinder Overlay */}
        <ARSimulationOverlay show={showAR} onClose={() => setShowAR(false)} />

        {/* Floating AI Agent Button */}
        <button 
          className="floating-ai-btn animate-pulse-slow"
          onClick={() => setShowAI(!showAI)}
          style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', border: 'none', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 999 }}
        >
          <Bot size={30} />
          {!showAI && <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', border: '2px solid #000', width: '15px', height: '15px', borderRadius: '50%' }}></span>}
        </button>

        <SmartAssistAI show={showAI} onClose={() => setShowAI(false)} contextData={{ facilities, movieTimeLeft }} />

      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
    {active && <motion.div layoutId="nav-pill" className="active-pill" />}
  </button>
);

const FacilityRow = ({ data }) => {
  return (
    <div className="facility-row">
      <div className="facility-info">
        <span className="facility-icon">
          {data.type === 'food' ? <Coffee size={18} /> : data.type === 'washroom' ? <Users size={18} /> : <Navigation size={18} />}
        </span>
        <div>
          <h4>{data.name}</h4>
          <span className="distance">{data.distance}</span>
        </div>
      </div>
      <div className="facility-stats">
        <div className="capacity-bar" title={`Capacity: ${data.capacity}%`}>
          <motion.div
            className={`fill status-${data.status}`}
            initial={{ width: 0 }}
            animate={{ width: `${data.capacity}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
        <div className="wait-time">
          <motion.span
            key={data.waitTime}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="time"
            style={{
              color: data.status === 'low' ? '#22c55e' : data.status === 'med' ? '#eab308' : '#f43f5e'
            }}
          >
            {data.waitTime}
          </motion.span> min wait
        </div>
      </div>
    </div>
  );
};

const VenueZone = ({ name, density, x, y, width, height, type, icon }) => {
  const status = density > 75 ? 'high' : density > 40 ? 'med' : 'low';
  return (
    <div
      className={`venue-zone ${type} status-${status}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    >
      <div className="zone-content-modern">
        <span className="zone-icon">{icon}</span>
        <span className="zone-label">{name}</span>
        <div className="occupancy-pill">
          <div className={`status-dot ${status}`}></div>
          <span>{Math.floor(density)}%</span>
        </div>
      </div>
    </div>
  );
};

const ARSimulationOverlay = ({ show, onClose }) => {
  const [distance, setDistance] = useState(15);
  const [instruction, setInstruction] = useState({ text: 'Walk Straight', sub: 'Avoid Section B. Follow path from Food Court.' });
  const [arrowRotation, setArrowRotation] = useState(0);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    let timer;
    if (show) {
      setDistance(15);
      setArrived(false);
      setArrowRotation(0);
      setInstruction({ text: 'Walk Straight', sub: 'Avoid Section B. Follow path from Food Court.' });

      timer = setInterval(() => {
        setDistance(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [show]);

  useEffect(() => {
    if (distance === 10) {
      setInstruction({ text: 'Turn Right Ahead', sub: 'The corridor turns right after the Food Court.' });
      setArrowRotation(45);
    } else if (distance === 5) {
      setInstruction({ text: 'Almost There', sub: 'Screen 1 Entrance is taking a slight left.' });
      setArrowRotation(-45);
    } else if (distance === 0 && show && !arrived) {
      setArrived(true);
      setInstruction({ text: 'Destination Reached!', sub: 'Welcome to Seat VIP-A12.' });
      setArrowRotation(180); // Simulate looking around/stopping
      setTimeout(() => onClose(), 3500);
    }
  }, [distance, show, arrived, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="ar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="ar-camera-simulation">
            <div className="viewfinder vf-tl"></div>
            <div className="viewfinder vf-tr"></div>
            <div className="viewfinder vf-bl"></div>
            <div className="viewfinder vf-br"></div>

            <div className="ar-header premium-glass">
              {arrived ? (
                <span className="live-tag" style={{ background: '#22c55e', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '10px' }}>✔ Arrived</span>
              ) : (
                <span className="live-tag blink" style={{ background: 'var(--accent)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '10px' }}>● Live AR</span>
              )}
              <span>Guiding to Screen 1, Seat VIP-A12</span>
            </div>

            <div className="ar-center-content">
              {!arrived && (
                <motion.div
                  className="ar-3d-arrow"
                  animate={{ y: [0, -40, 0], rotateZ: arrowRotation }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Navigation size={100} color="#4ae1f8" style={{ filter: 'drop-shadow(0 10px 20px rgba(74, 225, 248, 0.8))' }} />
                </motion.div>
              )}
              <p className="ar-distance" style={{ color: arrived ? '#22c55e' : 'white' }}>
                {arrived ? 'Welcome' : `${distance} m`}
              </p>
            </div>

            <div className="ar-instructions premium-glass" style={{ borderColor: arrived ? '#22c55e' : 'var(--primary-glow)' }}>
              <h2 style={{ color: arrived ? '#22c55e' : 'white' }}>{instruction.text}</h2>
              <p>{instruction.sub}</p>
              {!arrived && (
                <button className="checkout-btn" style={{ marginTop: '15px', background: 'rgba(255,50,50,0.8)' }} onClick={onClose}>
                  End Navigation
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SmartAssistAI = ({ show, onClose, contextData }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am VenueAI PromptMaster. Ask me about wait times, smart routing, or food pre-ordering!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const query = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "I'm analyzing the real-time venue data... Could you specify if you need info on 'food', 'washroom', or 'movie schedule'?";
      
      if (query.includes('food') || query.includes('hungry') || query.includes('snack')) {
         const snack = contextData.facilities.find(f => f.name.includes('Snack Bar B'));
         response = `Currently, Main Entry Gate has a high wait time, but Snack Bar B has a low wait of ${snack ? snack.waitTime : '2'} mins. I suggest pre-ordering food right now to save time!`;
      } else if (query.includes('washroom') || query.includes('bathroom') || query.includes('toilet') || query.includes('restroom')) {
         const cr = contextData.facilities.find(f => f.type === 'washroom');
         response = `The washroom near Screen 1 is currently ${cr ? cr.status : 'low'} crowded with a ${cr ? cr.waitTime : '1'} min wait. Best time to visit is now, before the Interstellar crowd arrives!`;
      } else if (query.includes('movie') || query.includes('screen') || query.includes('interstellar') || query.includes('vip') || query.includes('ticket')) {
         response = `Interstellar starts in ${contextData.movieTimeLeft} mins. The AR path to Screen 2 (VIP-A12) is clear through the main corridor. Avoid Section B!`;
      } else if (query.includes('prompt') || query.includes('hackathon') || query.includes('promptwars') || query.includes('ai')) {
         response = `Building for PromptWars? This AI integration boosts user experience by linking conversational prompts to live venue telemetry. Pure magic! ✨`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="ai-chat-window premium-glass"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          style={{ position: 'fixed', bottom: '100px', right: '30px', width: '350px', height: '480px', borderRadius: '20px', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden', border: '1px solid var(--primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
        >
          <div className="ai-chat-header" style={{ padding: '15px 20px', background: 'linear-gradient(90deg, rgba(99,102,241,0.3) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%' }}>
                <Bot size={20} color="white" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>VenueAI Agent</h3>
                <span style={{ fontSize: '0.75rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 5px #22c55e' }}></div>
                  Online & Syncing
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
          </div>
          
          <div className="ai-chat-body" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: m.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
              >
                <div style={{ padding: '12px 16px', borderRadius: '15px', background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.05)', color: 'white', borderBottomRightRadius: m.sender === 'user' ? 0 : '15px', borderBottomLeftRadius: m.sender === 'ai' ? 0 : '15px', fontSize: '0.9rem', lineHeight: '1.4', border: m.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
                 <div style={{ padding: '12px 16px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: 0, display: 'flex', gap: '5px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{width:'6px', height:'6px', background:'white', borderRadius:'50%'}}/>
                   <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{width:'6px', height:'6px', background:'white', borderRadius:'50%'}}/>
                   <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{width:'6px', height:'6px', background:'white', borderRadius:'50%'}}/>
                 </div>
              </motion.div>
            )}
          </div>
          
          <div className="ai-chat-footer" style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask VenueAI..."
                style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none', fontSize: '0.95rem' }}
              />
              <button type="submit" style={{ background: 'var(--primary)', border: 'none', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', cursor: 'pointer', transition: 'transform 0.2s', transform: input.trim() ? 'scale(1.05)' : 'scale(1)' }}>
                 <Send size={18} style={{ marginLeft: '-2px' }}/>
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
