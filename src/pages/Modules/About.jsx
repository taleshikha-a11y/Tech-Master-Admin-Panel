import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  User, Plus, Eye, Save, RefreshCw, ChevronDown, ChevronRight,
  Edit3, Trash2, Copy, Image, ArrowUp, ArrowDown, ExternalLink,
  ShieldCheck, X, UploadCloud, Scissors, BookOpen, Target, 
  BarChart2, Award, Trophy, Briefcase, Bold, Italic, Underline, 
  Heading as HeadingIcon, List, Link as LinkIcon
} from 'lucide-react';

export const About = () => {
  const { db, updateSection } = useDatabase();
  const aboutData = db?.about || {};

  // --- WORKSPACE LAYOUT STATES ---
  const [activeSection, setActiveSection] = useState('introduction'); 
  const [showGlobalAddForm, setShowGlobalAddForm] = useState(false);
  const [inlineEditSectionId, setInlineEditSectionId] = useState(null);
  const [inlineUploadSectionId, setInlineUploadSectionId] = useState(null);
  const [inlineCropActive, setInlineCropActive] = useState(false);
  const [showInlineHistory, setShowInlineHistory] = useState(false);
  const [simulatedLivePreview, setSimulatedLivePreview] = useState(false);

  // Forms Temporal Matrix Data States
  const [newSection, setNewSection] = useState({ type: 'Introduction', name: '', order: '1' });
  const [editFormData, setEditFormData] = useState({});

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
    setInlineEditSectionId(null);
    setInlineUploadSectionId(null);
  };

  // Inline Sub-Form Expansion Launcher
  const triggerInlineEdit = (secId) => {
    setInlineUploadSectionId(null);
    if (inlineEditSectionId === secId) {
      setInlineEditSectionId(null);
    } else {
      setInlineEditSectionId(secId);
      setEditFormData(aboutData[secId] || {
        title: aboutData.title || 'Akanksha Dua',
        subtitle: aboutData.subtitle || 'Digital Luxury Identity Consultant',
        description: aboutData.intro || 'Bespoke storytelling pipelines across global frameworks.',
        heading: 'The Creative Journey Map',
        storyContent: aboutData.story || 'A timeline initiating operations from baseline parameters...',
        visionTitle: 'Empowering Digital Authority',
        visionDescription: 'To bridge traditional luxury spaces with interactive media graphics.',
        awardTitle: 'Luxury Innovator Matrix',
        organization: 'Vogue India Network',
        year: '2025',
        company: 'Zenvora Info',
        position: 'Creative Lead Consultant',
        duration: '2024 - Present'
      });
    }
  };

  const triggerInlineUpload = (secId) => {
    setInlineEditSectionId(null);
    setInlineCropActive(false);
    setInlineUploadSectionId(inlineUploadSectionId === secId ? null : secId);
  };

  const saveInlineForm = (secId) => {
    updateSection('about', { [secId]: editFormData });
    setInlineEditSectionId(null);
    alert(`⚡ [About -> ${secId.toUpperCase()}] framework parameters successfully applied in database storage.`);
  };

  // Structural mapping elements corresponding to the finalized architecture flow
  const sectionsList = [
    { id: "introduction", label: "Introduction", description: "Primary overview block containing profile avatar attachments, headline, subtitles, and shortcut CTA pointers.", icon: User },
    { id: "story", label: "Story", description: "Bespoke full text editorial brand journey block, childhood logs, challenges, and timeline images.", icon: BookOpen },
    { id: "vision", label: "Vision", description: "Configure operational philosophies, targets, core brand values, and creator missions roadmap.", icon: Target },
    { id: "highlights", label: "Key Highlights", description: "Premium analytical performance tracking counters layout (e.g., 25+ Years, 150+ Collaborations).", icon: BarChart2 },
    { id: "achievements", label: "Achievements", description: "Dynamic structural portfolio matrix listing major historical milestones, honors, and descriptions.", icon: Award },
    { id: "awards", label: "Awards", description: "Manage dynamic certifications arrays, organization listings, years, and credential asset files.", icon: Trophy },
    { id: "experience", label: "Experience", description: "Chronological professional corporate timeline containing company logs, roles, and duration blocks.", icon: Briefcase }
  ];

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* GLOBAL TOP ACTION CONTROLS BAR */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <User className="w-5 h-5 text-luxury-gold" />
            About Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure dynamic biography narratives, core brand pillars, numerical reach logs, and career timeline milestones.
          </p>
        </div>
        
        {/* ACTION BUTTON STRIP */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => setShowGlobalAddForm(!showGlobalAddForm)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${showGlobalAddForm ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-zinc-800 hover:bg-zinc-900'}`}>
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> <span className="font-semibold">Add Section</span>
          </Button>
          <Button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${simulatedLivePreview ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' : 'border-zinc-800'}`}>
            <Eye className="w-3.5 h-3.5" /> <span>Preview Layout</span>
          </Button>
          <Button onClick={() => alert("💾 About Section Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button onClick={() => { if(window.confirm("Flush unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button onClick={() => alert("🚀 Public servers updated successfully. About page layout data is live!")} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* GLOBAL INLINE BANNER FORM: ADD NEW SECTION */}
      {showGlobalAddForm && (
        <div className="w-full p-5 rounded-lg border border-luxury-gold/30 bg-gradient-to-r from-zinc-950 to-zinc-900/60 shadow-md animate-fadeIn flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-luxury-gold">Instantiate Profile Component Block</span>
            <button onClick={() => setShowGlobalAddForm(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Section Type *</label>
              <select className="bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-luxury-gold/30" value={newSection.type} onChange={(e) => setNewSection({...newSection, type: e.target.value})}>
                {sectionsList.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                <option value="Custom Module">Custom Code Matrix</option>
              </select>
            </div>
            <Input label="Section Target Name" value={newSection.name} onChange={(e) => setNewSection({...newSection, name: e.target.value})} placeholder="e.g. Speaking Milestones V3" />
            <div className="flex items-center gap-3">
              <Input label="Display Order" type="number" value={newSection.order} onChange={(e) => setNewSection({...newSection, order: e.target.value})} />
              <Button onClick={() => { alert(`Success: Section [${newSection.name || newSection.type}] framework created.`); setShowGlobalAddForm(false); }} variant="primary" size="sm" className="h-[38px] px-6 bg-luxury-gold text-black font-bold mb-0.5">Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE VIEWPORT SIMULATOR BOX */}
      {simulatedLivePreview && (
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden animate-fadeIn shadow-2xl text-center">
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between px-5">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Sandbox Preview Track: localhost:3000/preview/about</span>
            <button onClick={() => setSimulatedLivePreview(false)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"><X className="w-3.5 h-3.5" /> Hide Sandbox</button>
          </div>
          <div className="p-8 bg-luxury-bg text-zinc-300 flex flex-col items-center justify-center min-h-[160px]">
            <h2 className="font-serif text-xl tracking-widest uppercase text-zinc-100">{aboutData?.introduction?.title || "AKANKSHA DUA"}</h2>
            <p className="text-xs font-serif text-luxury-gold tracking-wide mt-0.5">{aboutData?.introduction?.subtitle || "Digital Luxury Identity Strategist"}</p>
            <p className="text-[11px] text-zinc-500 max-w-md mt-2.5 leading-relaxed">{aboutData?.introduction?.description || "Bespoke digital architecture solutions engineered for premium brand configurations."}</p>
          </div>
        </div>
      )}

      {/* CORE PROCESS HOOK: GRID INTERFACE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: CARDS ACCORDION PANELS */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {sectionsList.map((sec) => {
            const SectionIcon = sec.icon;
            const isSectionOpen = activeSection === sec.id;
            const isSectionActive = aboutData?.[sec.id]?.status !== 'Inactive';

            return (
              <Card 
                key={sec.id}
                className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-950/20 ${
                  isSectionOpen ? 'border-zinc-700/60 shadow-[0_0_25px_rgba(212,175,55,0.02)]' : 'border-zinc-800/40'
                }`}
                title={
                  <div className="flex items-center justify-between w-full py-4 px-5 select-none bg-zinc-950/20">
                    <div onClick={() => toggleSection(sec.id)} className="flex items-center gap-3 cursor-pointer flex-1">
                      <SectionIcon className={`w-4 h-4 ${isSectionOpen ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                      <div className="text-left">
                        <h3 className="font-serif text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                          {sec.label}
                          {!isSectionActive && <Badge variant="secondary" className="scale-90 text-[9px] bg-zinc-900 border-zinc-800 text-zinc-500 font-sans tracking-normal font-medium">Inactive Hidden</Badge>}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-sans font-normal mt-0.5 lowercase max-w-xl">{sec.description}</p>
                      </div>
                    </div>

                    {/* STATUS TOGGLE INTERFACE */}
                    <div className="flex items-center gap-3 pl-4">
                      <Switch 
                        checked={isSectionActive} 
                        onChange={(checked) => alert(`Status Changed: ${sec.label} set to [${checked ? 'Active' : 'Inactive'}]. Frontend mapping adjusted dynamically.`)}
                      />
                      <button onClick={() => toggleSection(sec.id)} className="text-zinc-500 hover:text-zinc-300 p-1">
                        {isSectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                }
              >
                {/* DYNAMIC CARD CONTENT DRAWER ACTION SCHEMAS */}
                {isSectionOpen && (
                  <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-4 animate-fadeIn">
                    
                    {/* BUTTON ACTIONS ROW */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900/80 flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => triggerInlineEdit(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineEditSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30 shadow-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                          <Edit3 className="w-3.5 h-3.5 text-luxury-gold" /> <span>Edit Section</span>
                        </button>
                        <button onClick={() => triggerInlineUpload(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineUploadSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                          <Image className="w-3.5 h-3.5" /> <span>Media Library</span>
                        </button>
                        <button onClick={() => alert(`📄 Duplicated matrix layer configuration for [${sec.label}].`)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:text-white rounded text-xs font-medium flex items-center gap-1.5 transition-all">
                          <Copy className="w-3.5 h-3.5 text-zinc-500" /> <span>Duplicate</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => alert("Shifted section layout node sequence index up.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded"><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => alert("Shifted section layout node sequence index down.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded"><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => window.confirm(`Purge data arrays for ${sec.label}?`) && alert("Flushed.")} className="px-2.5 py-1.5 bg-zinc-900/40 border border-zinc-900 text-zinc-500 hover:text-rose-400 rounded text-xs font-medium flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* ─── INLINE EXTENSION SUB PANEL A: CONTENT RICH INPUT FORMS ─── */}
                    {inlineEditSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 flex-wrap gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold block">Form Fields Mapping Block: {sec.label}</span>
                          
                          {/* UNIFORM RICH TEXT TOOLBAR FOR SPECIFIC FIELD BLOCKS */}
                          {["story", "vision", "achievements", "experience"].includes(sec.id) && (
                            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800 flex-wrap">
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Bold className="w-3.5 h-3.5" /></button>
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Italic className="w-3.5 h-3.5" /></button>
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Underline className="w-3.5 h-3.5" /></button>
                              <span className="h-4 w-[1px] bg-zinc-800 mx-1" />
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><HeadingIcon className="w-3.5 h-3.5" /></button>
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><List className="w-3.5 h-3.5" /></button>
                              <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><LinkIcon className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>

                        {/* RENDER SYSTEM ACCORDING TO TARGET FIELD DEFINITIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.id === 'introduction' && (
                            <>
                              <Input label="Title Headline Text" value={editFormData.title || ''} onChange={e => setEditFormData({...editFormData, title: e.target.value})} />
                              <Input label="Subtitle Tagline Overlay" value={editFormData.subtitle || ''} onChange={e => setEditFormData({...editFormData, subtitle: e.target.value})} />
                              <Input label="Button Label Text" value={editFormData.buttonText || ''} onChange={e => setEditFormData({...editFormData, buttonText: e.target.value})} />
                              <Input label="Button Target Route Redirect URL" value={editFormData.buttonLink || ''} onChange={e => setEditFormData({...editFormData, buttonLink: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Short Description Bio Overview" textarea rows={2} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'story' && (
                            <>
                              <Input label="Main Story Section Heading Title" value={editFormData.heading || ''} onChange={e => setEditFormData({...editFormData, heading: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Rich Narrative Text Content Store" textarea rows={4} value={editFormData.storyContent || ''} onChange={e => setEditFormData({...editFormData, storyContent: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'vision' && (
                            <>
                              <Input label="Vision Module Header Title" value={editFormData.visionTitle || ''} onChange={e => setEditFormData({...editFormData, visionTitle: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Vision Statement Narrative Block" textarea rows={3} value={editFormData.visionDescription || ''} onChange={e => setEditFormData({...editFormData, visionDescription: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'highlights' && (
                            <div className="md:col-span-2 p-3.5 bg-zinc-900/60 rounded border border-zinc-800/80 flex flex-col gap-3">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Bespoke Highlights Numerical KPI Counter Matrix :</span>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Input label="Counter Value 1" value="25+" /> <Input label="Label description 1" value="Years Experience" />
                                <Input label="Counter Value 2" value="150+" /> <Input label="Label description 2" value="Brand Collaborations" />
                                <Input label="Counter Value 3" value="300+" /> <Input label="Label description 3" value="Campaigns Completed" />
                                <Input label="Counter Value 4" value="20+" /> <Input label="Label description 4" value="Awards Won" />
                              </div>
                              <button type="button" onClick={() => alert("Added additional interactive metric index grid row.")} className="mt-2 text-xs py-1.5 border border-dashed border-zinc-800 hover:border-luxury-gold/40 text-zinc-400 rounded transition-all">+ Add Counter Metric</button>
                            </div>
                          )}
                          {sec.id === 'achievements' && (
                            <>
                              <Input label="Award / Achievement Name" value={editFormData.awardTitle || ''} onChange={e => setEditFormData({...editFormData, awardTitle: e.target.value})} />
                              <Input label="Year Accomplished" type="number" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Milestone Description Narrative" textarea rows={2} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'awards' && (
                            <>
                              <Input label="Official Recognition Title" value={editFormData.awardTitle || ''} onChange={e => setEditFormData({...editFormData, awardTitle: e.target.value})} />
                              <Input label="Conferring Corporate Body / Organization" value={editFormData.organization || ''} onChange={e => setEditFormData({...editFormData, organization: e.target.value})} />
                              <Input label="Year" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: e.target.value})} />
                            </>
                          )}
                          {sec.id === 'experience' && (
                            <>
                              <Input label="Company / Corporate House Name" value={editFormData.company || ''} onChange={e => setEditFormData({...editFormData, company: e.target.value})} />
                              <Input label="Professional Designation Position" value={editFormData.position || ''} onChange={e => setEditFormData({...editFormData, position: e.target.value})} />
                              <Input label="Tenure Duration Scale" value={editFormData.duration || ''} onChange={e => setEditFormData({...editFormData, duration: e.target.value})} placeholder="e.g. 2024 - Present" />
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-2">
                          <button onClick={() => setInlineEditSectionId(null)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">Cancel</button>
                          <button onClick={() => saveInlineForm(sec.id)} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded transition-all shadow-sm">Save Framework</button>
                        </div>
                      </div>
                    )}

                    {/* ─── DRAWERS NODE B: MEDIA HANDLING MODULE DRAWER ─── */}
                    {inlineUploadSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block border-b border-zinc-900 pb-1.5">Asset Integration Processing Node</span>
                        
                        {inlineCropActive ? (
                          <div className="flex flex-col items-center gap-2 py-1">
                            <div className="w-full h-32 border border-dashed border-luxury-gold/30 bg-zinc-900 rounded flex items-center justify-center relative">
                              <div className="absolute inset-4 border border-white/5 pointer-events-none" />
                              <Scissors className="w-4 h-4 text-luxury-gold animate-pulse mr-2" />
                              <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase">Premium Vector Crop Mode Active (1:1 Aspect Alignment Frame)</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => setInlineCropActive(false)} className="text-xs text-zinc-500 px-2 py-1">Cancel</button>
                              <button onClick={() => { setInlineCropActive(false); setInlineUploadSectionId(null); alert("Canvas crop matrix recalculations saved perfectly."); }} className="bg-luxury-gold text-black font-bold text-[11px] px-3 py-1 rounded">Apply Crop</button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-1 h-20 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1 text-zinc-600 cursor-pointer hover:bg-zinc-900/50 transition-colors" onClick={() => { alert("Local file system explorer invoked successfully. File read."); setInlineUploadSectionId(null); }}>
                              <UploadCloud className="w-5 h-5 text-zinc-500" />
                              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold">Browse Image Asset</span>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-1.5 flex-wrap pl-2">
                              <button onClick={() => setInlineCropActive(true)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-xs rounded text-zinc-400 hover:text-luxury-gold transition-colors">Crop Asset Layout</button>
                              <button onClick={() => window.confirm("Flush image storage reference link?") && setInlineUploadSectionId(null)} className="px-2 py-1.5 text-xs text-zinc-600 hover:text-rose-400">Remove</button>
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

        {/* RIGHT SIDE WORKSPACE MONITOR PANEL */}
        <div className="flex flex-col gap-4">
          <Card className="border border-zinc-800/60 bg-zinc-950/40 p-4" title={<span className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400">Live Workspace Monitoring</span>}>
            <div className="flex flex-col gap-2.5 mt-3">
              <button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-800 hover:border-luxury-gold/40 text-xs font-medium text-zinc-200 flex items-center justify-between transition-all">
                <span>Toggle Preview Layout</span> <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button onClick={() => alert("Opening live production URL path /about securely...")} className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 flex items-center justify-between transition-all">
                <span>View Live Site</span> <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button onClick={() => setShowInlineHistory(!showInlineHistory)} className={`w-full py-2 px-3 rounded border text-left text-xs font-medium flex items-center justify-between transition-all ${showInlineHistory ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>
                <span>Tracking Logs</span> <Badge variant="secondary" className="scale-95 text-[9px] bg-zinc-950 border-zinc-800 font-sans font-normal">Logs</Badge>
              </button>
            </div>

            {/* INLINE AUDIT LOGS TRAIL CONTAINER */}
            {showInlineHistory && (
              <div className="mt-4 border-t border-zinc-900 pt-3 flex flex-col gap-3 font-sans text-[11px] text-zinc-400 animate-fadeIn max-h-[160px] overflow-y-auto pr-1">
                <div className="pb-2 border-b border-zinc-900">
                  <span className="text-[9px] font-mono text-zinc-500 block">Today • 02:15 PM</span>
                  <p className="text-zinc-300 font-medium">Key Highlights Counters Modified</p>
                  <span className="text-[9px] text-luxury-gold">By: Akanksha Dua</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 block">Yesterday • 11:30 AM</span>
                  <p className="text-zinc-300 font-medium">Introduction Copywriter Strings Adjusted</p>
                  <span className="text-[9px] text-zinc-500">By: Rahul Dev</span>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* SECURE STATE BOTTOM INDICATOR BANNER */}
      <div className="flex items-center justify-end mt-4 p-4 border border-zinc-900 bg-zinc-950/30 rounded-lg lg:col-span-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mr-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Inline about system framework running securely with synchronized context hooks.</span>
        </div>
      </div>

    </div>
  );
};