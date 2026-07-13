import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo_transparent-removebg-preview.png';
import {
  LayoutDashboard, Home, User, History, Target, Briefcase, 
  Handshake, Megaphone, Calendar, FolderHeart, Newspaper, 
  Award, FileSpreadsheet, FileText, MessageSquare, Globe, 
  Users, Settings, Menu, LogOut, Bell, X, ChevronDown, 
  ChevronRight, ShieldAlert, Layers, ExternalLink, PhoneCall 
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Floating3DShapes } from './ui/Floating3DShapes';

export const Layout = ({ children, currentView, setCurrentView }) => {
  const { auth, logout, notifications } = useDatabase();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Career dropdown state
  const [isCareerExpanded, setIsCareerExpanded] = useState(false);

  // Sub-views state tracking for pages mapping
  const [activeSubView, setActiveSubView] = useState({});

  const triggerTransition = (targetViewId, isSubView = false) => {
    if (!isSubView) {
      setCurrentView(targetViewId);
    } else {
      if (currentView === 'homepage') {
        const featureToPageMap = {
          "Hero Section": "homepage",
          "Featured Services": "services",
          "Journey Highlights": "founder-journey",
          "Brand Collaborations": "brand-collaborations",
          "Featured Campaigns": "campaign-product",
          "Contact Preview": "faq-contact"
        };
        const targetPage = featureToPageMap[targetViewId];
        if (targetPage && targetPage !== 'homepage') {
          setCurrentView(targetPage);
          return;
        }
      }
      setActiveSubView(prev => ({
        ...prev,
        [currentView]: targetViewId
      }));
    }
  };

  // Listen for programmatic navigation events from child components
  React.useEffect(() => {
    const handler = (e) => {
      const view = e?.detail?.view;
      if (view) triggerTransition(view);
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [currentView, isTransitioning]);

  // Main navigation sidebar list
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "homepage", label: "Homepage", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "founder-journey", label: "Founder Journey", icon: History },
    { id: "mission-vision", label: "Mission & Vision", icon: Target },
    { id: "what-we-do", label: "What We Do", icon: Layers },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "brand-collaborations", label: "Brand Collaborations", icon: Handshake },
    { id: "campaign-product", label: "Campaign & Product Launch", icon: Megaphone },
    { id: "events", label: "Events", icon: Calendar },
    { id: "portfolio", label: "Portfolio", icon: FolderHeart },
    { id: "media-coverage", label: "Media & Gallery", icon: Newspaper },
    { id: "career", label: "Career",  icon: FileSpreadsheet, },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "faq", label: "FAQ Portal", icon: MessageSquare },
    { id: "contact", label: "Contact Page", icon: PhoneCall },
    { id: "seo-management", label: "SEO Management", icon: Globe },
    { id: "user-management", label: "User Management", icon: Users },
    { id: "website-settings", label: "Website Settings", icon: Settings }
  ];

  // Mapping pages to their related features/buttons
  const pageFeatures = {
    "dashboard": ["Overview", "Analytics", "Recent Activities"],
    "homepage": ["Hero Section", "Featured Services", "Journey Highlights", "Brand Collaborations", "Featured Campaigns", "Statistics", "Newsletter", "Contact Preview"],
    "about": ["Introduction"],
    "founder-journey": ["Timeline", "Milestones", "Future Vision"],
    "mission-vision": ["Mission", "Vision", "Core Values", "Roadmap"],
    "what-we-do": ["Overview", "Capabilities Manager"],
    "services": ["Service List", "What We Do", "Categories"],
    "brand-collaborations": ["Brands", "Case Studies", "Success Metrics", "Partner Logos"],
    "campaign-product": ["Campaigns", "Product Launches"],
    "events": ["Events"],
    "portfolio": ["Manage Portfolio"],
    "media-coverage": ["Interviews", "Press Releases", "Podcasts", "Magazine Features"],
    "job-openings": ["All Openings", "Applications", "Requirements"],
    "resume-management": ["Resumes Inbox", "Shortlisted", "Archived"],
    "blog": ["All Blogs", "Categories", "Drafts", "Published"],
    "faq-contact": ["FAQs", "Contact Enquiries", "Business Enquiries"],
    "seo-management": ["Meta Tags", "Sitemap", "Robots.txt", "Redirects"],
    "user-management": ["Admin Users", "Roles", "Permissions"],
    "website-settings": ["General Settings", "Logo & Favicon", "Social Links", "Contact Details", "Footer Settings", "Email Configuration"]
  };

  const currentFeatures = pageFeatures[currentView] || [];
  const currentSubActive = activeSubView[currentView] || currentFeatures[0];

  return (
    <div className="h-screen bg-luxury-bg text-zinc-100 flex relative overflow-hidden luxury-grid">
      <Floating3DShapes />
      
      {/* Background Radiants */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] luxury-radial pointer-events-none z-0" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] luxury-radial pointer-events-none z-0" />

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-20 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="h-32 flex items-center justify-between px-5 border-b border-zinc-800/80 flex-shrink-0">
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 w-full justify-center">
              <img src={logoImage} alt="TechMaster Logo" className="h-24 w-auto object-contain drop-shadow-[0_0_28px_rgba(250,204,21,1)]" />
            </motion.div>
          )}
          {isSidebarCollapsed && (
            <div className="w-12 flex items-center justify-center mx-auto">
              <img src={logoImage} alt="TechMaster Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_16px_rgba(250,204,21,1)]" />
            </div>
          )}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isCareerActive = currentView === 'job-openings' || currentView === 'resume-management';
            const isActive = item.hasDropdown ? isCareerActive : currentView === item.id;

            if (item.hasDropdown) {
              return (
                <div key={item.id} className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => isSidebarCollapsed ? [setIsSidebarCollapsed(false), setIsCareerExpanded(true)] : setIsCareerExpanded(!isCareerExpanded)}
                    className={`w-full flex items-center rounded-md transition-all duration-300 py-2.5 px-3 text-sm cursor-pointer border justify-between ${isCareerActive ? 'bg-luxury-gold/5 text-luxury-gold border-luxury-gold/20' : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/40'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isCareerActive ? 'text-luxury-gold' : ''}`} />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isSidebarCollapsed && (isCareerExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronRight className="w-3.5 h-3.5 opacity-60" />)}
                  </button>

                  {isCareerExpanded && !isSidebarCollapsed && (
                    <div className="pl-9 pr-2 py-1 flex flex-col gap-1 border-l border-zinc-800/60 ml-5 mt-0.5">
                      {item.subItems.map((sub) => (
                        <button
                          type="button"
                          key={sub.id}
                          onClick={() => triggerTransition(sub.id)}
                          className={`w-full text-left py-1.5 px-2.5 text-xs rounded transition-all cursor-pointer ${currentView === sub.id ? 'text-luxury-gold font-medium bg-luxury-gold/5' : 'text-zinc-500 hover:text-zinc-200'}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => triggerTransition(item.id)}
                className={`w-full flex items-center rounded-md transition-all duration-300 py-2.5 px-3 text-sm cursor-pointer border ${isActive ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/40'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-luxury-gold' : ''}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>
              </button>
            );
          })}
        </div>

      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-r from-luxury-gold to-luxury-darkgold flex items-center justify-center text-black font-serif font-black text-xs">TM</div>
          <span className="font-serif font-bold text-[10px] tracking-wider text-zinc-100">TECHMASTER <span className="text-luxury-gold font-sans font-medium text-[9px]">ADMIN PANEL</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsNotificationsOpen(true)} className="relative p-2 text-zinc-400"><Bell className="w-5 h-5" /></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400"><Menu className="w-5 h-5" /></button>
        </div>
      </div>

      {/* MAIN CONTAINER PANEL */}
      <div className="flex-1 flex flex-col h-screen pt-16 md:pt-0 z-10 w-full overflow-hidden">
        {/* DESKTOP HEADER BAR */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <h2 className="text-lg font-medium text-zinc-100 uppercase tracking-widest font-serif flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-gold-glow animate-pulse" />
            {currentView === 'job-openings' ? 'Job Openings' : currentView === 'resume-management' ? 'Resume Management' : menuItems.find(i => i.id === currentView)?.label || "Dashboard"}
          </h2>
          <div className="flex items-center gap-5">
            <button onClick={() => setIsNotificationsOpen(true)} className="relative p-2 text-zinc-400"><Bell className="w-5 h-5" /></button>
            <div 
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-3 pl-4 border-l border-zinc-800/80 cursor-pointer hover:opacity-85 transition-opacity"
              title="View & Edit Profile"
            >
              <div className="text-right">
                <span className="text-xs font-semibold text-zinc-300 block">{auth?.user?.name || 'TechMaster'}</span>
                <span className="text-[10px] text-zinc-500 font-mono flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> ONLINE</span>
              </div>
              <img src={auth?.user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} alt="" className="w-10 h-10 rounded-full border border-zinc-800 object-cover" />
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 border border-zinc-900 rounded transition-all cursor-pointer"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DYNAMIC INNER PAGE FEATURES ROW */}
        {currentFeatures.length > 0 && (
          <div className="w-full bg-zinc-950/40 border-b border-zinc-900/60 backdrop-blur-md px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-20 z-10">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs pr-3 border-r border-zinc-800/80 whitespace-nowrap">
              <Layers className="w-3.5 h-3.5 text-luxury-gold/70" />
              <span>Features :</span>
            </div>
            <div className="flex items-center gap-2">
              {currentFeatures.map((feature, idx) => {
                const isSubActive = currentSubActive === feature;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => triggerTransition(feature, true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      isSubActive 
                        ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)]' 
                        : 'bg-zinc-900/30 text-zinc-400 border-zinc-800/40 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN BODY LAYOUT VIEW */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto flex flex-col justify-between" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentView}-${currentSubActive}`}
              initial={{ opacity: 0, rotateX: 4, y: 10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -4, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-grow"
            >
             {React.isValidElement(children)
  ? React.cloneElement(children, {
      activeSubFeature: currentSubActive,
    })
  : children}
            </motion.div>
          </AnimatePresence>

          {/* GLOBAL LUXURY FOOTER */}
          <footer className="w-full mt-12 border-t border-zinc-900 bg-zinc-950/20 rounded-lg p-8 flex flex-col gap-8 text-left text-xs text-zinc-400 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Brand and Description */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-r from-luxury-gold to-luxury-darkgold flex items-center justify-center text-black font-serif font-black text-xs">TM</div>
                  <span className="font-serif font-bold text-xs tracking-wider text-zinc-150 uppercase">TECHMASTER ADMIN PANEL</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-sans text-left">
                  The executive content management platform for TechMaster's official creator network portfolio, campaigns, and luxury consultation services.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col gap-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Quick Links</span>
                <div className="flex flex-col gap-1.5 text-zinc-500 font-medium">
                  <button onClick={() => { triggerTransition('dashboard'); window.scrollTo(0,0); }} className="hover:text-luxury-gold transition-colors text-left">Dashboard Home</button>
                  <button onClick={() => { triggerTransition('homepage'); window.scrollTo(0,0); }} className="hover:text-luxury-gold transition-colors text-left">Homepage Manager</button>
                  <button onClick={() => { triggerTransition('blog'); window.scrollTo(0,0); }} className="hover:text-luxury-gold transition-colors text-left">Blog Publisher</button>
                  <button onClick={() => { triggerTransition('faq-contact'); window.scrollTo(0,0); }} className="hover:text-luxury-gold transition-colors text-left">Contact & FAQ Hub</button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex flex-col gap-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Social Networks</span>
                <div className="flex flex-col gap-1.5 text-zinc-500 font-medium">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors flex items-center gap-1.5">Instagram <ExternalLink className="w-3 h-3" /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors flex items-center gap-1.5">YouTube <ExternalLink className="w-3 h-3" /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors flex items-center gap-1.5">LinkedIn <ExternalLink className="w-3 h-3" /></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors flex items-center gap-1.5">Facebook <ExternalLink className="w-3 h-3" /></a>
                </div>
              </div>

              {/* Newsletter subscription */}
              <div className="flex flex-col gap-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Newsletter Hub</span>
                <p className="text-[10px] text-zinc-500 leading-normal mb-1">
                  Dispatch administrative news briefs directly to registered team accounts.
                </p>
                <div className="flex gap-1 bg-zinc-950/60 border border-zinc-900 rounded p-1">
                  <input 
                    type="email" 
                    placeholder="mail@techmaster.com" 
                    className="w-full bg-transparent border-none text-[10px] px-1 text-zinc-200 outline-none placeholder-zinc-700" 
                  />
                  <button 
                    onClick={() => alert("Subscription registered for news briefs.")}
                    className="bg-luxury-gold hover:bg-luxury-darkgold text-black text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-1 rounded transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row Legal & Copyright */}
            <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] text-zinc-550 font-mono uppercase tracking-wider">
              <span>© 2026 TECHMASTER. Crafted with Zenvora 3D engine. All Rights Reserved.</span>
              <div className="flex gap-4">
                <a href="#privacy" onClick={() => alert("Privacy policy settings are locked inside database configuration files.")} className="hover:text-luxury-gold transition-colors">Privacy Policy</a>
                <a href="#terms" onClick={() => alert("Terms of service are bound to the YouTuber licensing agreement.")} className="hover:text-luxury-gold transition-colors">Terms of Service</a>
              </div>
            </div>

          </footer>
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNotificationsOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 24, stiffness: 220 }} className="relative w-full max-w-md h-full bg-zinc-950/95 backdrop-blur-2xl border-l border-zinc-800 shadow-gold-glow flex flex-col z-10">
              <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-luxury-gold" />
                  <h3 className="font-serif text-lg font-medium text-zinc-100 uppercase tracking-wider">Notifications</h3>
                </div>
                <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-zinc-500 text-sm">
                <ShieldAlert className="w-8 h-8 text-zinc-600 mb-2" />
                <span>Inbox is completely empty</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative w-80 h-full bg-zinc-950 border-l border-zinc-800 flex flex-col pt-20 px-4 z-10 overflow-y-auto">
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 text-zinc-500"><X className="w-6 h-6" /></button>
              <div className="flex-1 flex flex-col gap-1 py-4">
                {menuItems.map((item) => (
                  <button key={item.id} onClick={() => { triggerTransition(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center rounded-md py-2 px-3 text-sm border ${currentView === item.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'text-zinc-400 border-transparent'}`}>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CINEMATIC PAGE LOADER */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 dynamic-fade-luxury">
            <div className="absolute w-[450px] h-[450px] bg-luxury-gold/10 rounded-full filter blur-[120px] animate-pulse" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div animate={{ rotateY: 360 }} transition={{ duration: 1.2, ease: "easeInOut" }} className="w-20 h-20 rounded-full bg-gradient-to-br from-luxury-gold to-luxury-darkgold border border-luxury-lightgold/30 flex items-center justify-center text-black font-serif font-black text-3xl shadow-gold-glow-lg">TM</motion.div>
              <h3 className="font-serif text-sm font-bold tracking-[0.25em] text-zinc-300 uppercase mt-2 gold-text-gradient">TECHMASTER ADMIN PANEL</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};