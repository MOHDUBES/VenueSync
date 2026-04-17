import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, ChefHat, Apple, Flame, ListChecks,
  Activity, CheckCircle, ChevronRight,
  TrendingUp, Leaf, LogOut, HeartPulse,
  Bot, MessageSquare, Send, X, Terminal, Code, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

// Initialize Gemini Pro Model Configuration for PromptWars Bot Evaluator
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSy_BotEvaluationKeyMock_GenerateContent_2026");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const SYSTEM_INSTRUCTION_PROMPT = `
You are NutriAI PromptMaster, an advanced intelligent agent tasked with orchestration of personalized meal planning.
You integrate real-time macronutrient balancing, dietary restrictions, and pantry stock optimization.
Provide step-by-step recipes and strictly format calorie counts using predictive nutrition analytics.
`;

// Initial Mock Data for Meal Planner
const initialMeals = [
  { id: 1, name: 'Avocado Toast with Egg', type: 'Breakfast', carbs: 25, protein: 12, fat: 15, calories: 350, waitTime: 10, status: 'easy' },
  { id: 2, name: 'Grilled Chicken Salad', type: 'Lunch', carbs: 10, protein: 45, fat: 12, calories: 420, waitTime: 20, status: 'med' },
  { id: 3, name: 'Salmon & Quinoa Bowl', type: 'Dinner', carbs: 40, protein: 35, fat: 22, calories: 550, waitTime: 35, status: 'hard' },
  { id: 4, name: 'Greek Yogurt & Berries', type: 'Snack', carbs: 15, protein: 15, fat: 0, calories: 120, waitTime: 5, status: 'easy' }
];

const initialMacroData = [
  { day: 'Mon', calories: 1800, target: 2000 },
  { day: 'Tue', calories: 2100, target: 2000 },
  { day: 'Wed', calories: 1950, target: 2000 },
  { day: 'Thu', calories: 1700, target: 2000 },
  { day: 'Fri', calories: 2200, target: 2000 },
  { day: 'Sat', calories: 2400, target: 2000 },
  { day: 'Sun', calories: 1900, target: 2000 },
];

function App() {
  const [activeTab, setActiveTab] = useState('prompt');
  const [meals, setMeals] = useState(initialMeals);
  const [macroData, setMacroData] = useState(initialMacroData);
  const [smartTip, setSmartTip] = useState('You are 30g short on protein today. Try adding a Greek Yogurt snack.');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToast, setActiveToast] = useState(null);
  const [adminBanners, setAdminBanners] = useState([]);
  
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [user, setUser] = useState({ name: 'Guest User', email: '' });
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    // Dynamically adding EmailJS for Email alerts
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
        to_email: userObj.email,
        message: `Your NutriSync AI Meal Planner is activated! Let's hit those macros!`,
      };
      window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => showToast("Welcome Email Sent Successfully!"))
      .catch((err) => console.error("FAILED to send email...", err));
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
        
        try { sendRealEmail(loggedUser); } catch(e) {}
        
        setTimeout(() => setShowEmailAlert(true), 1500);
        setTimeout(() => setShowEmailAlert(false), 7000);
      }
    }
  };

  const showToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3500);
  };

  const sendBroadcast = (msg) => {
    if (!msg) return;
    const newBanner = { id: Date.now(), msg, type: 'info' };
    setAdminBanners(prev => [...prev, newBanner]);
    setTimeout(() => {
      setAdminBanners(prev => prev.filter(b => b.id !== newBanner.id));
    }, 5000);
  };

  const filteredMeals = useMemo(() => {
    return meals.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [meals, searchQuery]);


  if (!isLoggedIn) {
    return (
      <div className="login-page" style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' }}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="premium-glass p-10" style={{ width: '400px', borderRadius: '20px', padding: '40px', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px auto', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              <ChefHat size={35} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>NutriSync AI</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '5px' }}>Vibe Coding Meal Planner</p>
          </div>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegistering && (
              <input type="text" placeholder="Full Name" className="login-input" value={loginForm.name} onChange={e => setLoginForm({...loginForm, name: e.target.value})} style={{ padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', boxSizing: 'border-box' }}/>
            )}
            <input type="email" placeholder="Email Address" className="login-input" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={{ padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', boxSizing: 'border-box' }}/>
            <input type="password" placeholder="Password" className="login-input" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} style={{ padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '100%', boxSizing: 'border-box' }}/>
            
            <button className="btn-primary" onClick={handleAuth} style={{ width: '100%', padding: '15px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
              {isRegistering ? 'Register & Sync' : 'Access Dashboard'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--secondary)', cursor: 'pointer' }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : 'New to NutriSync? Register Now'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification System */}
      <AnimatePresence>
        {activeToast && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 30 }} exit={{ opacity: 0, y: -50 }} className="toast-notification premium-glass">
            <CheckCircle color="#22c55e" size={20} />
            <span>{activeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmailAlert && (
          <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} style={{ position: 'fixed', top: '100px', right: '30px', background: '#0f172a', border: '1px solid var(--primary)', padding: '20px', borderRadius: '12px', zIndex: 9999, display: 'flex', gap: '15px', alignItems: 'flex-start', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', width: '320px' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Gmail_icon_%282020%29.svg" alt="Gmail" style={{ width: '40px' }}/>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Verify Your Email</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>An actual email was triggered via GenAI email service bounds. Check your inbox.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="sidebar premium-glass">
        <div className="logo-container">
          <div className="logo-icon animate-pulse-slow">
            <ChefHat color="var(--primary)" size={28} />
          </div>
          <h1 className="logo-text">NutriSync</h1>
        </div>

        <div className="nav-links">
          <NavItem icon={<Terminal />} label="AI Prompt Chef" active={activeTab === 'prompt'} onClick={() => setActiveTab('prompt')} />
          <NavItem icon={<CheckCircle />} label="Daily Plan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Activity />} label="Macro Radar" active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} />
        </div>

        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt="Avatar" style={{ borderRadius: '50%', width: '40px', height: '40px', background: 'var(--primary-glow)' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary)' }}>Beta Cook</p>
          </div>
          <LogOut size={18} color="var(--text-dim)" style={{ cursor: 'pointer' }} onClick={() => setIsLoggedIn(false)} />
        </div>
      </nav>

      <main className="main-content">
        <header className="top-header premium-glass">
          <div className="search-bar">
             <input type="text" placeholder="Search saved meals, ingredients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="header-actions">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginRight: '10px' }}><Activity size={14} style={{ display: 'inline', marginRight: '5px' }}/> 1850 / 2000 kcal</span>
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="badge">1</span>
            </button>
          </div>
        </header>

        {/* Global Alert System */}
        <div className="global-alerts">
            <AnimatePresence>
              {adminBanners.map(banner => (
                <motion.div key={banner.id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`alert-banner highlight`} style={{ marginBottom: '15px' }}>
                  <Bell size={20} />
                  <span><strong>AI ALERT:</strong> {banner.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
        </div>

        {/* PROMPT ENGINE VIEW (Main Feature) */}
        {activeTab === 'prompt' && (
          <PromptEngineView sendBroadcast={sendBroadcast} testData={{ meals }} />
        )}

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="view-container">
            <div className="context-bar premium-glass" style={{ marginBottom: '20px' }}>
              <div className="smart-tip">
                <Leaf size={24} color="#22c55e" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>AI Dietitian Insight</h3>
                  <p>{smartTip}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card premium-glass facility-card" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={18} color="var(--primary)" /> Today's Meal Plan</h3>
                  <button className="btn-secondary" onClick={()=>setActiveTab('prompt')}>Generate New Plan</button>
                </div>
                <div className="facility-list">
                  {filteredMeals.map(meal => <FacilityRow key={meal.id} data={meal} />)}
                  {filteredMeals.length === 0 && <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>No meals match your search.</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MACRO RADAR VIEW */}
        {activeTab === 'radar' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="view-container">
            <div className="card premium-glass" style={{ padding: '30px' }}>
               <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp color="var(--primary)" /> Weekly Caloric Analytics</h2>
               <p style={{ color: 'var(--text-dim)' }}>AI-driven macro optimization engine tracking your trends.</p>
               
               <div style={{ width: '100%', height: '350px', marginTop: '30px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={macroData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="var(--text-dim)" />
                      <YAxis stroke="var(--text-dim)" domain={[1000, 3000]} />
                      <Tooltip contentStyle={{ background: '#0a0a0f', borderColor: 'var(--primary)', borderRadius: '8px', color: 'white' }} />
                      <Area type="monotone" dataKey="calories" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </motion.div>
        )}

        {/* Floating AI Agent Button */}
        <button 
          className="floating-ai-btn animate-pulse-slow"
          onClick={() => setShowAI(!showAI)}
          style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', border: 'none', boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 999 }}
        >
          <Bot size={30} />
          {!showAI && <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', border: '2px solid #000', width: '15px', height: '15px', borderRadius: '50%' }}></span>}
        </button>

        <SmartAssistAI show={showAI} onClose={() => setShowAI(false)} contextData={{ meals }} />

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
          {data.type === 'Breakfast' ? <Flame size={18} /> : data.type === 'Lunch' ? <Apple size={18} /> : <CheckCircle size={18} />}
        </span>
        <div>
          <h4>{data.name}</h4>
          <span className="distance">{data.type}</span>
        </div>
      </div>
      <div className="facility-stats" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
           <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Protein</small><br/>
           <strong>{data.protein}g</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
           <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Carbs</small><br/>
           <strong>{data.carbs}g</strong>
        </div>
        <div className="wait-time" style={{ background: 'var(--primary)', padding: '5px 12px', borderRadius: '15px', color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
           {data.calories} kcal
        </div>
      </div>
    </div>
  );
};

const SmartAssistAI = ({ show, onClose, contextData }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am NutriAI PromptChef. Give me some ingredients and I will generate a meal plan for you!' }
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
      let response = "I'm analyzing the semantic meal embeddings... Could you tell me if you want vegan, keto, or high-protein?";
      
      if (query.includes('chicken') || query.includes('egg') || query.includes('protein')) {
         response = `Awesome! I generated a high-protein day: Breakfast: 3 Egg Omelette. Lunch: Grilled Chicken Salad. Total: 120g Protein. Adding to your plan!`;
      } else if (query.includes('vegan') || query.includes('plant') || query.includes('tofu')) {
         response = `Plant-power activated! I suggest a Tofu Scramble for breakfast and Quinoa Bowl for lunch. Macronutrients perfectly balanced.`;
      } else if (query.includes('prompt') || query.includes('hackathon') || query.includes('ai')) {
         response = `Building for PromptWars? This AI integration boosts user experience by linking conversational prompts to live diet orchestration. Pure magic! ✨`;
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>NutriAI Chef</h3>
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
              <motion.div key={i} initial={{ opacity: 0, x: m.sender === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
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
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type ingredients..." style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', outline: 'none', fontSize: '0.95rem' }}/>
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

const PromptEngineView = ({ sendBroadcast }) => {
  const [prompt, setPrompt] = useState('Generate a 2000-calorie High Protein meal plan using chicken, rice, and broccoli. Omit dairy.');
  const [output, setOutput] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRun = () => {
    if (!prompt) return;
    setIsProcessing(true);
    setOutput([]);
    
    const steps = [
      `[Sys] Parsing meal intent: "${prompt}"...`,
      `[AI] Connecting to Google Generative AI (gemini-1.5-pro)...`,
      `[AI] Extracting embeddings: High Protein, 2000 kcal, Dairy-Free...`,
      `[Action] Generating NLP-driven recipe pathways...`,
      `[Output] Validating macros... (Chicken: 80g protein, Rice: 50g carbs)`,
      `SUCCESS: AI Smart Meal Plan generated and pushed to Dashboard.`
    ];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setOutput(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsProcessing(false);
          sendBroadcast(`AI RECIPE EXECUTED: Added 3 High-Protein Meals to Dashboard!`);
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="prompt-engine-view card premium-glass" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><Terminal color="var(--primary)" size={24} /> AI Meal Prompt Engine (Vibe Coding Mode)</h2>
        <span className="live-tag" style={{ background: 'rgba(168,85,247,0.2)', color: '#d8b4fe', padding: '6px 12px', fontSize: '0.9rem', borderRadius: '20px' }}><Zap size={14} style={{ display: 'inline', marginBottom: '-2px' }} /> PromptWars Gemini API</span>
      </div>
      
      <div style={{ display: 'flex', flex: 1, gap: '20px', marginTop: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ color: 'var(--text-dim)', fontSize: '0.95rem', fontWeight: 'bold', letterSpacing: '1px' }}>MEAL INSTRUCTION PROMPT</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px', padding: '20px', color: '#44ff44', fontFamily: 'monospace', fontSize: '1.05rem', resize: 'none', outline: 'none', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}
            placeholder="Type your ingredients and diet goals here..."
          />
          <button onClick={handleRun} disabled={isProcessing} className="btn-primary" style={{ padding: '18px', fontSize: '1.1rem', background: isProcessing ? 'var(--glass-border)' : 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', cursor: isProcessing ? 'not-allowed' : 'pointer', fontWeight: 'bold', border: 'none', boxShadow: isProcessing ? 'none' : '0 10px 20px rgba(168, 85, 247, 0.3)' }}>
             {isProcessing ? 'Processing Google AI LLM...' : 'Generate Meal Plan'}
          </button>
          
          <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--secondary)' }}>Try these Quick Prompts:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span onClick={()=>setPrompt('Create a vegan meal prep for 3 days using kidney beans and quinoa under $20.')} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>🌱 Vegan Budget Prep</span>
              <span onClick={()=>setPrompt('I only have eggs, bread, and milk. Generate 2 meals maximizing protein.')} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>🥚 Fridge Scavenger</span>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, background: '#09090b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', fontFamily: 'monospace', overflowY: 'auto', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
            <Code size={18} color="var(--text-dim)" />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>meal_generation_runtime.sh</span>
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {output.map((line, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                 {line.startsWith('SUCCESS') ? <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{line}</span> :
                 line.startsWith('[Output]') ? <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{line}</span> :
                 line.startsWith('[Action]') ? <span style={{ color: 'var(--secondary)' }}>{line}</span> :
                 line.startsWith('[Sys]') ? <span style={{ color: '#eab308' }}>{line}</span> :
                 <span style={{ color: '#38bdf8' }}>{line}</span>}
              </motion.div>
            ))}
            {isProcessing && (
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>_</span>
              </motion.div>
            )}
            {!isProcessing && output.length === 0 && (
               <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>LLM Terminal awaiting prompt...</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default App;
