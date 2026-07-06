import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Sparkles, Home, Layers, ShieldCheck, Plus,
  BarChart, Mail, Phone, ChevronDown, ChevronRight,
  Briefcase, History, Eye, Award, Edit3, Trash2, 
  Copy, Image, RefreshCw, Save, ArrowUp, ArrowDown, 
  ExternalLink, Handshake, X, UploadCloud, Scissors
} from 'lucide-react';

export const Homepage = () => {
  const { db, updateSection } = useDatabase();
  const homepageData = db?.homepage || {};

  // --- INLINE EXPANSION STATES (No Page Navigation, No Modals) ---
  const [activeSection, setActiveSection] = useState('hero'); 
  const [showGlobalAddForm, setShowGlobalAddForm] = useState(false);
  const [inlineEditSectionId, setInlineEditSectionId] = useState(null);
  const [inlineUploadSectionId, setInlineUploadSectionId] = useState(null);
  const [inlineCropActive, setInlineCropActive] = useState(false);
  const [showInlineHistory, setShowInlineHistory] = useState(false);
  const [simulatedLivePreview, setSimulatedLivePreview] = useState(false);

  // Dynamic States for Forms
  const [newSection, setNewSection] = useState({ type: 'Hero Section', name: '', order: '1' });
  const [editFormData, setEditFormData] = useState({});

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
    setInlineEditSectionId(null);
    setInlineUploadSectionId(null);
  };

  // Trigger Inline Section Editor
  const triggerInlineEdit = (secId) => {
    setInlineUploadSectionId(null);
    if (inlineEditSectionId === secId) {
      setInlineEditSectionId(null);
    } else {
      setInlineEditSectionId(secId);
      setEditFormData(homepageData[secId] || {
        title: 'REDEFINING DIGITAL LUXURY',
        subtitle: 'Bespoke Brand Strategy & Design',
        description: 'Bespoke execution metrics matching golden ratios.',
        ctaText: 'Explore Space',
        ctaLink: '/portfolio',
        address: 'Indore, MP, India',
        email: 'booking@akankshadua.com',
        phone: '+91 99999 11111'
      });
    }
  };

  // Trigger Inline Asset Vault
  const triggerInlineUpload = (secId) => {
    setInlineEditSectionId(null);
    setInlineCropActive(false);
    setInlineUploadSectionId(inlineUploadSectionId === secId ? null : secId);
  };

  const saveInlineForm = (secId) => {
    updateSection('homepage', { [secId]: editFormData });
    setInlineEditSectionId(null);
    alert(`⚡ [${secId.toUpperCase()}] content matrices updated directly in workspace context!`);
  };

  const sectionsList = [
    { id: "hero", label: "Hero Section", description: "Manage overlay banners, cinematic background video/image assets, and CTA buttons.", icon: Sparkles },
    { id: "services", label: "Featured Services", description: "Display, add, and reorder active business core services lists.", icon: Briefcase },
    { id: "journey", label: "Journey Highlights", description: "Configure chronological milestones pinned on home page snapshot matrix.", icon: History },
    { id: "collaborations", label: "Brand Collaborations", description: "Manage client logos grid panel, carousels, and success analytics.", icon: Handshake },
    { id: "campaigns", label: "Featured Campaigns", description: "Display high-end product launch videos and media decks links.", icon: Layers },
    { id: "statistics", label: "Statistics Counters", description: "Configure numeric reach parameters (e.g. Happy Clients, Years Active).", icon: BarChart },
    { id: "testimonials", label: "Testimonials Preview", description: "Curate active review slide arrays, client comments, and featured tags.", icon: Award },
    { id: "newsletter", label: "Newsletter Hub", description: "Configure subscriptions text values and marketing fields status.", icon: Mail },
    { id: "contact", label: "Contact Preview Overlay", description: "Manage quick telephone numbers, booking email hooks, and embedded maps.", icon: Phone }
  ];

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* TOP GLOBAL ACTION BAR CONTROL */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Home className="w-5 h-5 text-luxury-gold" />
            Homepage Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Maintain immersive structure layouts, content publishing metrics, and control panels.
          </p>
        </div>
        
        {/* GLOBAL STRIP BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => setShowGlobalAddForm(!showGlobalAddForm)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${showGlobalAddForm ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-zinc-800 hover:bg-zinc-900'}`}>
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> <span className="font-semibold">Add Section</span>
          </Button>
          <Button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${simulatedLivePreview ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' : 'border-zinc-800'}`}>
            <Eye className="w-3.5 h-3.5" /> <span>Preview Layout</span>
          </Button>
          <Button onClick={() => alert("💾 Homepage Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button onClick={() => { if(window.confirm("Reset unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button onClick={() => alert("🚀 Public production server updated successfully. Page is Live!")} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* 1. INLINE SLIDE DOWN BANNER FOR "ADD SECTION" */}
      {showGlobalAddForm && (
        <div className="w-full p-5 rounded-lg border border-luxury-gold/30 bg-gradient-to-r from-zinc-950 to-zinc-900/60 shadow-[0_4px_20px_rgba(212,175,55,0.02)] animate-fadeIn flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-luxury-gold">Add New Custom Workspace Segment</span>
            <button onClick={() => setShowGlobalAddForm(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Section Type *</label>
              <select className="bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-luxury-gold/30" value={newSection.type} onChange={(e) => setNewSection({...newSection, type: e.target.value})}>
                {sectionsList.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                <option value="Custom Code">Custom Code Section</option>
              </select>
            </div>
            <Input label="Section Custom Name" value={newSection.name} onChange={(e) => setNewSection({...newSection, name: e.target.value})} placeholder="e.g. Luxury Promo Loop" />
            <div className="flex items-center gap-3">
              <Input label="Sequence Order" type="number" value={newSection.order} onChange={(e) => setNewSection({...newSection, order: e.target.value})} />
              <Button onClick={() => { alert(`Success: Section [${newSection.name || newSection.type}] framework added!`); setShowGlobalAddForm(false); }} variant="primary" size="sm" className="h-[38px] px-6 bg-luxury-gold text-black font-bold mb-0.5">Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. INLINE LIVE LAYOUT PREVIEW SANDBOX */}
      {simulatedLivePreview && (
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden animate-fadeIn shadow-2xl">
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between px-5">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Sandbox Mode Route: /preview/homepage
            </span>
            <button onClick={() => setSimulatedLivePreview(false)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"><X className="w-3.5 h-3.5" /> Hide</button>
          </div>
          <div className="p-10 bg-luxury-bg text-center flex flex-col justify-center items-center min-h-[180px]">
            <h1 className="font-serif text-2xl font-light text-zinc-300 tracking-widest uppercase">{homepageData?.hero?.title || "REDEFINING DIGITAL LUXURY"}</h1>
            <p className="text-[11px] text-zinc-500 tracking-wide mt-1 max-w-sm">{homepageData?.hero?.subtitle || "Bespoke Digital Identity System"}</p>
            <div className="mt-5 px-4 py-1 border border-luxury-gold/30 rounded text-luxury-gold font-serif text-[10px] uppercase tracking-widest">{homepageData?.hero?.ctaText || "Explore"}</div>
          </div>
        </div>
      )}

      {/* TWO PANEL CORE GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT SECTIONS */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {sectionsList.map((sec) => {
            const SectionIcon = sec.icon;
            const isSectionOpen = activeSection === sec.id;
            const isSectionActive = homepageData?.[sec.id]?.status !== 'Inactive';

            return (
              <Card 
                key={sec.id}
                className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-950/20 ${
                  isSectionOpen ? 'border-zinc-800/80' : 'border-zinc-800/40'
                }`}
                title={
                  <div className="flex items-center justify-between w-full py-4 px-5 select-none bg-zinc-950/20">
                    <div onClick={() => toggleSection(sec.id)} className="flex items-center gap-3 cursor-pointer flex-1">
                      <SectionIcon className={`w-4 h-4 ${isSectionOpen ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                      <div className="text-left">
                        <h3 className="font-serif text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                          {sec.label}
                          {!isSectionActive && <Badge variant="secondary" className="scale-90 text-[9px] bg-zinc-900 border-zinc-800 text-zinc-500 font-sans tracking-normal font-medium">Inactive</Badge>}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-4">
                      <Switch 
                        checked={isSectionActive} 
                        onChange={(checked) => alert(`${sec.label} is now set to [${checked ? 'Active' : 'Inactive'}].`)}
                      />
                      <button onClick={() => toggleSection(sec.id)} className="text-zinc-500 hover:text-zinc-300 p-1">
                        {isSectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                }
              >
                {isSectionOpen && (
                  <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-4">
                    
                    {/* UNIVERSAL INLINE ACTIONS BAR */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900/80 flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => triggerInlineEdit(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineEditSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                          <Edit3 className="w-3.5 h-3.5" /> <span>Edit Content</span>
                        </button>
                        <button onClick={() => triggerInlineUpload(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineUploadSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                          <Image className="w-3.5 h-3.5" /> <span>Upload/Media</span>
                        </button>
                        <button onClick={() => alert(`📄 Structure [${sec.label}] cloned successfully.`)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:text-white rounded text-xs font-medium flex items-center gap-1.5 transition-all">
                          <Copy className="w-3.5 h-3.5 text-zinc-500" /> <span>Duplicate</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => alert("Shifted up in database layout flow.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded"><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => alert("Shifted down in database layout flow.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded"><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => window.confirm("Purge section database values?") && alert("Removed.")} className="px-2.5 py-1.5 bg-zinc-900/40 border border-zinc-900 text-zinc-500 hover:text-rose-400 rounded text-xs font-medium flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* ─── INLINE SUB-DRAWER A: DYNAMIC EDIT FORM CONTENT ─── */}
                    {inlineEditSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold block border-b border-zinc-900 pb-1.5">Inline Fields Engine: {sec.label}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.id === 'hero' ? (
                            <>
                              <Input label="Title Headline Text" value={editFormData.title || ''} onChange={e => setEditFormData({...editFormData, title: e.target.value})} />
                              <Input label="Subtitle Tagline Overlay" value={editFormData.subtitle || ''} onChange={e => setEditFormData({...editFormData, subtitle: e.target.value})} />
                              <Input label="CTA Button Text" value={editFormData.ctaText || ''} onChange={e => setEditFormData({...editFormData, ctaText: e.target.value})} />
                              <Input label="CTA Redirect Link" value={editFormData.ctaLink || ''} onChange={e => setEditFormData({...editFormData, ctaLink: e.target.value})} />
                            </>
                          ) : sec.id === 'contact' ? (
                            <>
                              <Input label="Corporate Address Line" value={editFormData.address || ''} onChange={e => setEditFormData({...editFormData, address: e.target.value})} />
                              <Input label="Booking Email Hook" value={editFormData.email || ''} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
                              <Input label="WhatsApp Line" value={editFormData.phone || ''} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
                            </>
                          ) : (
                            <>
                              <Input label="Section Header Title Accent" value={editFormData.heading || ''} onChange={e => setEditFormData({...editFormData, heading: e.target.value})} placeholder="e.g. Featured Highlights" />
                              <Input label="Supporting Context Statement Description" textarea rows={2} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} placeholder="Write narrative text details..." />
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-2.5">
                          <button onClick={() => setInlineEditSectionId(null)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">Cancel</button>
                          <button onClick={() => saveInlineForm(sec.id)} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded shadow-sm">Save Framework</button>
                        </div>
                      </div>
                    )}

                    {/* ─── INLINE SUB-DRAWER B: MEDIA UPLOAD & CROP CONTROL ─── */}
                    {inlineUploadSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block border-b border-zinc-900 pb-1.5">Asset Processing Node</span>
                        
                        {inlineCropActive ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-full h-32 border border-dashed border-luxury-gold/30 bg-zinc-900 rounded flex items-center justify-center relative">
                              <div className="absolute inset-3 border border-white/10 pointer-events-none" />
                              <span className="text-[10px] font-mono text-luxury-gold animate-pulse">CROP GRID BOUNDS ACTIVATED (16:9)</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => setInlineCropActive(false)} className="text-xs text-zinc-500 px-2 py-1">Cancel</button>
                              <button onClick={() => { setInlineCropActive(false); setInlineUploadSectionId(null); alert("Canvas crop matrix applied safely."); }} className="bg-luxury-gold text-black font-bold text-[11px] px-3 py-1 rounded">Apply Crop</button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-1 h-20 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1 text-zinc-600 cursor-pointer hover:bg-zinc-900/60 transition-colors" onClick={() => { alert("File picker executed successfully."); setInlineUploadSectionId(null); }}>
                              <UploadCloud className="w-5 h-5 text-zinc-500" />
                              <span className="text-[9px] uppercase font-mono tracking-wider">Browse File (.jpg, .png, .webp)</span>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-1.5 flex-wrap pl-2">
                              <button onClick={() => setInlineCropActive(true)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-xs rounded text-zinc-400 hover:text-luxury-gold transition-colors">Crop Canvas Aspect</button>
                              <button onClick={() => window.confirm("Flush image path?") && setInlineUploadSectionId(null)} className="px-2 py-1.5 text-xs text-zinc-600 hover:text-rose-400">Remove</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* RIGHT SIDE DRAWER SYSTEM MONITORING (SLIDE-DOWN DRAWER LOGS) */}
        <div className="flex flex-col gap-4">
          <Card className="border border-zinc-800/60 bg-zinc-950/40 p-4" title={<span className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400">Workspace Logs</span>}>
            <div className="flex flex-col gap-2.5 mt-3">
              <button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-800 hover:border-luxury-gold/40 text-xs font-medium text-zinc-200 flex items-center justify-between transition-all">
                <span>Toggle Preview Layout</span> <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button onClick={() => setShowInlineHistory(!showInlineHistory)} className={`w-full py-2 px-3 rounded border text-left text-xs font-medium flex items-center justify-between transition-all ${showInlineHistory ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>
                <span>History Logs Tracking</span> <Badge variant="secondary" className="scale-95 text-[9px] bg-zinc-950 border-zinc-800 font-sans font-normal">Logs</Badge>
              </button>
            </div>

            {/* INLINE HISTORICAL TRACK LOGS SHOWN IMMEDIATELY INSIDE THE PANEL */}
            {showInlineHistory && (
              <div className="mt-4 border-t border-zinc-900 pt-3 flex flex-col gap-3 font-sans text-[11px] text-zinc-400 animate-fadeIn max-h-[150px] overflow-y-auto pr-1">
                <div className="pb-2 border-b border-zinc-900">
                  <span className="text-[9px] font-mono text-zinc-500 block">Today • 11:30 AM</span>
                  <p className="text-zinc-300 font-medium">Hero Section Content Modified</p>
                  <span className="text-[9px] text-luxury-gold">By: Akanksha Dua</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 block">Yesterday • 04:15 PM</span>
                  <p className="text-zinc-300 font-medium">Brand Logos Loops Synchronized</p>
                  <span className="text-[9px] text-zinc-500">By: Dev Rahul</span>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Global Status Footer */}
      <div className="flex items-center justify-end mt-4 p-4 border border-zinc-900 bg-zinc-950/30 rounded-lg lg:col-span-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mr-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Inline workspace system layout running smoothly with immediate UI response hooks.</span>
        </div>
      </div>

    </div>
  );
};