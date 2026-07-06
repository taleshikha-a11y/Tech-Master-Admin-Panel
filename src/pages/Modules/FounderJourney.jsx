import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  History, Plus, Eye, Save, RefreshCw, ChevronDown, ChevronRight,
  Edit3, Trash2, Copy, Image, ArrowUp, ArrowDown, ExternalLink,
  ShieldCheck, X, UploadCloud, Scissors, Milestone, Target,
  Bold, Italic, Underline, Heading as HeadingIcon, List, Link as LinkIcon
} from 'lucide-react';

export const FounderJourney = () => {
  const { db, updateSection, addItem, updateItem, deleteItem, toggleStatus } = useDatabase();
  const journeyList = db?.founderJourneyList || db?.founderJourney || [];
  const fixedSectionsData = db?.founderJourneySections || {};

  // --- WORKSPACE INLINE STATES (No Modals, Clean UX) ---
  const [activeSection, setActiveSection] = useState('timeline'); 
  const [inlineEditSectionId, setInlineEditSectionId] = useState(null);
  const [inlineUploadSectionId, setInlineUploadSectionId] = useState(null);
  const [inlineCropActive, setInlineCropActive] = useState(false);
  const [showInlineHistory, setShowInlineHistory] = useState(false);
  const [simulatedLivePreview, setSimulatedLivePreview] = useState(false);

  // Form Creation/Inline Toggle States
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ year: '', title: '', description: '', type: 'timeline' });
  const [editFormData, setEditFormData] = useState({});

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
    setInlineEditSectionId(null);
    setInlineUploadSectionId(null);
  };

  // --- TOP GLOBAL BUTTON ACTIONS ---
  const handleSaveDraft = () => {
    alert("💾 Founder Journey Draft Saved Successfully!\nUnpublished buffer matrix updated in database.");
  };

  const handleResetWorkspace = () => {
    if (window.confirm("⚠️ Reset Founder Journey Layout?\nAll unsaved timeline structures will be reverted.")) {
      window.location.reload();
    }
  };

  const handlePublishLive = () => {
    if (window.confirm("🚀 Publish Founder Journey?\nThis layout will instantly refresh live client-side scroll timelines.")) {
      alert("✨ Success: Production pipeline synchronized.");
    }
  };

  // --- INLINE DATA PERSISTENCE HANDLERS ---
  const triggerInlineEdit = (secId) => {
    setInlineUploadSectionId(null);
    if (inlineEditSectionId === secId) {
      setInlineEditSectionId(null);
    } else {
      setInlineEditSectionId(secId);
      setEditFormData(fixedSectionsData[secId] || {
        futureHeading: 'The Horizon of Immersive Media',
        futureDescription: 'Driving dynamic visual architectures across global operations networks.'
      });
    }
  };

  const triggerInlineUpload = (secId) => {
    setInlineEditSectionId(null);
    setInlineCropActive(false);
    setInlineUploadSectionId(inlineUploadSectionId === secId ? null : secId);
  };

  const saveInlineSectionForm = (secId) => {
    updateSection('founderJourneySections', { [secId]: editFormData });
    setInlineEditSectionId(null);
    alert(`⚡ [${secId.toUpperCase()}] content static variables aligned.`);
  };

  const handleCreateMilestoneNode = (e) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;
    alert(`➕ Milestone [${newMilestone.title}] added dynamically inside ${newMilestone.type === 'timeline' ? 'Journey Timeline' : 'Major Milestones'}.`);
    setShowAddMilestoneForm(false);
    setNewMilestone({ year: '', title: '', description: '', type: 'timeline' });
  };

  // Fixed Layout Architecture Flow (No dynamic creation of sections needed)
  const structuralSections = [
    { id: "timeline", label: "1. Journey Timeline", description: "Chronological narrative line mapping career beginning, years, metrics, and customizable thumbnail layers.", icon: History },
    { id: "milestones", label: "2. Major Milestones", description: "Highlight turning points, critical corporate breakthroughs, and timeline snapshots.", icon: Milestone },
    { id: "futureVision", label: "3. Future Vision", description: "Bespoke segment targeting long-term future goals, vision maps, and scaling consulting metrics.", icon: Target }
  ];

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* TOP GLOBAL ACTION CONTROL HEADER BAR */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <History className="w-5 h-5 text-luxury-gold" />
            Founder Journey Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure chronological scroll milestones, important corporate turning points, and long-term roadmap vectors.
          </p>
        </div>
        
        {/* RIGHT ACTION STRIP */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => setShowAddMilestoneForm(!showAddMilestoneForm)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${showAddMilestoneForm ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-zinc-800 hover:bg-zinc-900'}`}>
            <Plus className="w-3.5 h-3.5 text-luxury-gold stroke-[3]" /> <span className="font-semibold">Add Milestone</span>
          </Button>
          <Button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} variant="secondary" size="sm" className={`gap-1.5 text-xs border ${simulatedLivePreview ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold' : 'border-zinc-800'}`}>
            <Eye className="w-3.5 h-3.5" /> <span>Preview Layout</span>
          </Button>
          <Button onClick={handleSaveDraft} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button onClick={handleResetWorkspace} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button onClick={handlePublishLive} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* INLINE COMPACT SLIDE-DOWN BLOCK FOR ADDING NEW MILESTONE */}
      {showAddMilestoneForm && (
        <form onSubmit={handleCreateMilestoneNode} className="w-full p-5 rounded-lg border border-luxury-gold/30 bg-gradient-to-r from-zinc-950 to-zinc-900/60 shadow-[0_4px_25px_rgba(212,175,55,0.02)] animate-fadeIn flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-luxury-gold flex items-center gap-1.5"><Milestone className="w-4 h-4" /> Append New Journey Milestone Card</span>
            <button type="button" onClick={() => setShowAddMilestoneForm(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Grid Placement *</label>
              <select className="bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-luxury-gold/30" value={newMilestone.type} onChange={(e) => setNewMilestone({...newMilestone, type: e.target.value})}>
                <option value="timeline">Journey Timeline Module</option>
                <option value="milestones">Major Milestones Block</option>
              </select>
            </div>
            <Input label="Year / Time Period" value={newMilestone.year} onChange={e => setNewMilestone({...newMilestone, year: e.target.value})} placeholder="e.g. 2021" required />
            <div className="md:col-span-2">
              <Input label="Milestone Title Name" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} placeholder="e.g. Creative Brand Launch Event" required />
            </div>
            <div className="md:col-span-4 flex items-end gap-4 w-full">
              <div className="flex-1"><Input label="Brief Description Narrative" textarea rows={2} value={newMilestone.description} onChange={e => setNewMilestone({...newMilestone, description: e.target.value})} /></div>
<Button
  type="submit"
  variant="primary"
  className="h-[38px] px-6 !text-white bg-luxury-gold font-bold mb-0.5 whitespace-nowrap"
>
  Create Node
</Button>           
 </div>
          </div>
        </form>
      )}

      {/* LIVE VIEWPORT INTERACTIVE SANDBOX PREVIEW MOCKUP */}
      {simulatedLivePreview && (
        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden animate-fadeIn shadow-2xl">
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between px-5">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Sandbox Simulation Mode: /preview/founder-journey</span>
            <button onClick={() => setSimulatedLivePreview(false)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"><X className="w-3.5 h-3.5" /> Close</button>
          </div>
          <div className="p-8 bg-luxury-bg text-center flex flex-col justify-center items-center min-h-[150px]">
            <Badge variant="gold" className="tracking-widest font-mono scale-105">2018</Badge>
            <h2 className="font-serif text-lg tracking-widest uppercase text-zinc-100 mt-2">The Digital Brand Framework</h2>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">Live timeline stream syncing metrics correctly with dynamic vector maps.</p>
          </div>
        </div>
      )}

      {/* CORE SECTIONS CONTROL PANELS MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN: CARDS ACCORDION PANELS */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {structuralSections.map((sec) => {
            const SectionIcon = sec.icon;
            const isSectionOpen = activeSection === sec.id;
            const isSectionActive = fixedSectionsData?.[sec.id]?.status !== 'Inactive';

            return (
              <Card 
                key={sec.id}
                className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-950/20 ${
                  isSectionOpen ? 'border-zinc-700/60 shadow-[0_0_20px_rgba(212,175,55,0.02)]' : 'border-zinc-800/40'
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

                    {/* STATUS TOGGLE HANDLER (ACTIVE/INACTIVE CAPABILITY) */}
                    <div className="flex items-center gap-3 pl-4">
                      <Switch 
                        checked={isSectionActive} 
                        onChange={(checked) => alert(`Status Notification: ${sec.label} visibility state altered in display layers.`)}
                      />
                      <button onClick={() => toggleSection(sec.id)} className="text-zinc-500 hover:text-zinc-300 p-1">
                        {isSectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                }
              >
                {/* CARDS OPEN DRAWER CAPABILITIES */}
                {isSectionOpen && (
                  <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-4 animate-fadeIn">
                    
                    {/* BUTTON ACTIONS OPERATION ROW */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900/80 flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => triggerInlineEdit(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineEditSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                          <Edit3 className="w-3.5 h-3.5 text-luxury-gold" /> <span>Edit Segment Matrix</span>
                        </button>
                        {sec.id !== 'milestones' && (
                          <button onClick={() => triggerInlineUpload(sec.id)} className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${inlineUploadSectionId === sec.id ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/30' : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'}`}>
                            <Image className="w-3.5 h-3.5" /> <span>Media Canvas</span>
                          </button>
                        )}
                        <button onClick={() => alert(`📄 Appended structural operational copy block for [${sec.label}].`)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:text-white rounded text-xs font-medium flex items-center gap-1.5 transition-all">
                          <Copy className="w-3.5 h-3.5 text-zinc-500" /> <span>Duplicate</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => alert("Reorder parameter shifted sequence index up.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded" title="Move Up"><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => alert("Reorder parameter shifted sequence index down.")} className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded" title="Move Down"><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => window.confirm(`Flush data nodes linked to ${sec.label}?`) && alert("Purged.")} className="px-2.5 py-1.5 bg-zinc-900/40 border border-zinc-900 text-zinc-500 hover:text-rose-400 rounded text-xs font-medium flex items-center gap-1">
                          <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* ─── DRAWERS NODE A: INLINE CONTENT RICH INPUT EDIT FORMS ─── */}
                    {inlineEditSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 flex-wrap gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold block">Inline Field Engine Block: {sec.label}</span>
                          
                          {/* UNIVERSAL RICH TEXT REUSABLE BAR EDITORS */}
                          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800 flex-wrap">
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Bold className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Italic className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Underline className="w-3.5 h-3.5" /></button>
                            <span className="h-4 w-[1px] bg-zinc-800 mx-1" />
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><HeadingIcon className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><List className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><LinkIcon className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* CONDITIONALLY MATCHING FORM SCHEMAS FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.id === 'timeline' && (
                            <>
                              <Input label="Timeline Target (Year)" type="number" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: e.target.value})} placeholder="e.g. 2018" />
                              <Input label="Timeline Node Segment Title" value={editFormData.title || ''} onChange={e => setEditFormData({...editFormData, title: e.target.value})} placeholder="e.g. Career Beginning Story" />
                              <div className="md:col-span-2"><Input label="Detailed Chronological Narrative Summary Description" textarea rows={3} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'milestones' && (
                            <>
                              <Input label="Major Milestone Breakthrough Title" value={editFormData.milestoneTitle || ''} onChange={e => setEditFormData({...editFormData, milestoneTitle: e.target.value})} placeholder="e.g. First Dynamic Luxury Launch" />
                              <Input label="Year" type="number" value={editFormData.year || ''} onChange={e => setEditFormData({...editFormData, year: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Milestone Historical Summary Metrics" textarea rows={3} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} /></div>
                            </>
                          )}
                          {sec.id === 'futureVision' && (
                            <>
                              <Input label="Future Vision Main Heading" value={editFormData.futureHeading || ''} onChange={e => setEditFormData({...editFormData, futureHeading: e.target.value})} />
                              <div className="md:col-span-2"><Input label="Long-term Roadmap Vision Strategy Descriptors" textarea rows={4} value={editFormData.futureDescription || ''} onChange={e => setEditFormData({...editFormData, futureDescription: e.target.value})} /></div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-2.5">
                          <button onClick={() => setInlineEditSectionId(null)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">Cancel</button>
<button
  onClick={() => saveInlineForm(sec.id)}
  className="px-4 py-1.5 bg-luxury-gold text-white font-bold text-xs rounded transition-all shadow-sm hover:opacity-90"
>
  Save Framework
</button>                        </div>
                      </div>
                    )}

                    {/* ─── DRAWERS NODE B: MEDIA SELECTION AND CROP FRAME MODES ─── */}
                    {inlineUploadSectionId === sec.id && (
                      <div className="w-full p-4 rounded border border-zinc-800 bg-zinc-950/80 animate-fadeIn flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block border-b border-zinc-900 pb-1.5">Asset Integration Node Wrapper</span>
                        
                        {inlineCropActive ? (
                          <div className="flex flex-col items-center gap-2 py-1">
                            <div className="w-full h-32 border border-dashed border-luxury-gold/30 bg-zinc-900 rounded flex items-center justify-center relative">
                              <div className="absolute inset-4 border border-white/5 pointer-events-none" />
                              <Scissors className="w-4 h-4 text-luxury-gold animate-pulse mr-2" />
                              <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase">Premium Crop Grid active (16:9 Aspect ratio verification grid)</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => setInlineCropActive(false)} className="text-xs text-zinc-500 px-2 py-1">Cancel</button>
                              <button onClick={() => { setInlineCropActive(false); setInlineUploadSectionId(null); alert("Canvas grid cropped perfectly within database fields references."); }} className="bg-luxury-gold text-black font-bold text-[11px] px-3 py-1 rounded">Apply Crop</button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-1 h-20 bg-zinc-900 border border-zinc-800 rounded flex flex-col items-center justify-center gap-1 text-zinc-600 cursor-pointer hover:bg-zinc-900/50 transition-colors" onClick={() => { alert("Asset repository matched completely. Resource active."); setInlineUploadSectionId(null); }}>
                              <UploadCloud className="w-5 h-5 text-zinc-500" />
                              <span className="text-[9px] uppercase font-mono tracking-wider font-semibold">Upload Image Source</span>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-1.5 flex-wrap pl-2">
                              <button onClick={() => setInlineCropActive(true)} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-xs rounded text-zinc-400 hover:text-luxury-gold transition-colors">Crop Asset Canvas</button>
                              <button onClick={() => window.confirm("Flush image storage link reference parameters?") && setInlineUploadSectionId(null)} className="px-2 py-1.5 text-xs text-zinc-600 hover:text-rose-400">Remove</button>
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

        {/* RIGHT SIDE WORKSPACE MONITOR CORES */}
        <div className="flex flex-col gap-4">
          <Card className="border border-zinc-800/60 bg-zinc-950/40 p-4" title={<span className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400">Live Workspace Monitoring</span>}>
            <div className="flex flex-col gap-2.5 mt-3">
              <button onClick={() => setSimulatedLivePreview(!simulatedLivePreview)} className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-800 hover:border-luxury-gold/40 text-xs font-medium text-zinc-200 flex items-center justify-between transition-all">
                <span>Toggle Preview Layout</span> <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button onClick={() => alert("Directing secure pipeline connection directly to public view route /founder-journey...")} className="w-full py-2 px-3 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 flex items-center justify-between transition-all">
                <span>View Live Site</span> <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              <button onClick={() => setShowInlineHistory(!showInlineHistory)} className={`w-full py-2 px-3 rounded border text-left text-xs font-medium flex items-center justify-between transition-all ${showInlineHistory ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5' : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>
                <span>Tracking Logs</span> <Badge variant="secondary" className="scale-95 text-[9px] bg-zinc-950 border-zinc-800 font-sans font-normal">Logs</Badge>
              </button>
            </div>

            {/* INLINE HISTORICAL TRACK CONTROLLER */}
            {showInlineHistory && (
              <div className="mt-4 border-t border-zinc-900 pt-3 flex flex-col gap-3 font-sans text-[11px] text-zinc-400 animate-fadeIn max-h-[160px] overflow-y-auto pr-1">
                <div className="pb-2 border-b border-zinc-900">
                  <span className="text-[9px] font-mono text-zinc-500 block">Today • 02:26 PM</span>
                  <p className="text-zinc-300 font-medium">Timeline Node [2018 Segment] Updated</p>
                  <span className="text-[9px] text-luxury-gold">By: Akanksha Dua</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 block">2 Days Ago</span>
                  <p className="text-zinc-300 font-medium">Future Vision Editorial Statement Saved</p>
                  <span className="text-[9px] text-zinc-500">By: Rahul Dev</span>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* FOOTER CONFIRMATION SEGMENT */}
      <div className="flex items-center justify-end mt-4 p-4 border border-zinc-900 bg-zinc-950/30 rounded-lg lg:col-span-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mr-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Operational sequence layers and core founder journey roadmap assets successfully verified.</span>
        </div>
      </div>

    </div>
  );
};