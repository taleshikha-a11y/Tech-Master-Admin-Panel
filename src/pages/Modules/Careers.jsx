import React, { useState, useRef } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Briefcase, FileText, CheckCircle, Trash2, Edit2, X, Upload, 
  Eye, Download, Star, StarHalf, MapPin, DollarSign, Globe, Award, Settings, MessageSquare
} from 'lucide-react';

/* =========================================================
   FILE UPLOAD SIMULATOR (BLOB)
========================================================= */
const FileUpload = ({ label, value, onChange, accept="image/*,video/*,audio/*,.pdf,.zip,.doc,.docx" }) => {
  const fileRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url, file.name);
    }
  };
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        {value && accept.includes('image') && (
          <div className="w-12 h-10 rounded border border-zinc-700 bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
             <img src={value} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
          </div>
        )}
        <input type="file" ref={fileRef} className="hidden" accept={accept} onChange={handleFileChange} />
        <button type="button" onClick={() => fileRef.current?.click()} className="flex-1 border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-950/50 rounded-lg px-4 py-2 text-sm flex items-center justify-center transition-colors text-zinc-400 min-h-[42px] truncate">
          <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{value ? (value.includes('blob:') ? 'File Uploaded' : value.split('/').pop()) : 'Upload File'}</span>
        </button>
      </div>
    </div>
  );
};

export const Careers = () => {
  const { db, updateSection } = useDatabase();
  
  // Data Collections
  const careerHero = db?.careerHero || {};
  const careers = db?.careers || [];
  const resumes = db?.resumes || [];
  const careerCulture = db?.careerCulture || [];
  const careerProcess = db?.careerProcess || [];
  const careerStats = db?.careerStats || {};
  const careerGallery = db?.careerGallery || [];
  const careerSettings = db?.careerSettings || {};
  const careerSEO = db?.careerSEO || {};

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  // Nav
  const NAV_TABS = ['Dashboard', 'Hero Settings', 'Job Openings', 'Resumes & HR', 'Culture & DNA', 'Hiring Process', 'Statistics', 'Gallery', 'Display & SEO'];
  const [activeNavTab, setActiveNavTab] = useState('Dashboard'); 
  
  // States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deletingType, setDeletingType] = useState(null);

  // Settings Drafts
  const [heroDraft, setHeroDraft] = useState(careerHero);
  const [settingsDraft, setSettingsDraft] = useState(careerSettings);
  const [seoDraft, setSeoDraft] = useState(careerSEO);
  const [statsDraft, setStatsDraft] = useState(careerStats);

  // Resume Viewer side-panel
  const [viewingResume, setViewingResume] = useState(null);

  const handleStartAdd = (type) => {
    setEditingType(type);
    setEditingId(null);
    let init = { active: true, order: 1 };
    if (type === 'careers') init = { active: true, featured: false, priority: 1, type: 'Full Time' };
    if (type === 'resumes') init = { status: 'New', rating: 0 };
    setDraftItem(init);
    setIsEditorOpen(true);
  };

  const handleStartEdit = (type, item) => {
    setEditingType(type);
    setEditingId(item.id);
    setDraftItem(item);
    setIsEditorOpen(true);
  };

  const handleSaveItem = () => {
    const collectionKey = editingType;
    const currentList = db[collectionKey] || [];
    let nextList = [];
    if (editingId) {
      nextList = currentList.map(item => item.id === editingId ? { ...draftItem, id: item.id } : item);
      if (viewingResume?.id === editingId) setViewingResume(draftItem);
    } else {
      nextList = [...currentList, { ...draftItem, id: `${editingType}-${Date.now()}` }];
    }
    updateSection(collectionKey, nextList);
    setIsEditorOpen(false);
    showToast(`✅ Saved ${editingType}.`);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const collectionKey = deletingType;
      const currentList = db[collectionKey] || [];
      updateSection(collectionKey, currentList.filter(item => item.id !== deleteId));
      if (viewingResume?.id === deleteId) setViewingResume(null);
      setDeleteId(null);
      setDeletingType(null);
      showToast("✅ Record deleted.");
    }
  };

  const handleBulkAction = (action, collectionKey) => {
      // In a real app, this would use a checklist. Simulating bulk action for now.
      showToast(`Simulated Bulk ${action} on ${collectionKey}`);
  }

  const renderTable = (list, type) => (
    <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
        <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-5 py-4 w-10">#</th>
            <th className="px-5 py-4">Details</th>
            {type === 'careers' && <th className="px-5 py-4">Role Info</th>}
            {type === 'resumes' && <th className="px-5 py-4">Application</th>}
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850/50">
          {list.length === 0 && <tr><td colSpan="6" className="px-5 py-8 text-center text-zinc-500 italic">No items found.</td></tr>}
          {list.map((item, idx) => (
            <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors group cursor-pointer" onClick={() => type === 'resumes' && setViewingResume(item)}>
              <td className="px-5 py-4 text-zinc-500">{item.order || idx + 1}</td>
              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-zinc-200 font-medium truncate max-w-[200px]">{item.title || item.candidateName || item.step || '-'}</span>
                  <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{item.department || item.email || item.description || '-'}</span>
                </div>
              </td>
              
              {type === 'careers' && (
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-300 text-xs flex items-center gap-1"><MapPin className="w-3 h-3 text-luxury-gold"/> {item.location || '-'}</span>
                    <span className="text-zinc-500 text-[10px] uppercase">{item.type || 'Full Time'}</span>
                  </div>
                </td>
              )}
              
              {type === 'resumes' && (
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-zinc-300 text-xs font-semibold">{item.jobApplied || 'General'}</span>
                    <span className="text-zinc-500 text-[10px]">{item.experienceYears ? `${item.experienceYears} Yrs` : '-'}</span>
                  </div>
                </td>
              )}

              <td className="px-5 py-4">
                {type === 'resumes' ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium border ${item.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : item.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : item.status === 'Reviewed' || item.status === 'Shortlisted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{item.status || 'New'}</span>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium border ${item.active !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{item.active !== false ? 'Active' : 'Hidden'}</span>
                )}
              </td>
              <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => handleStartEdit(type, item)} className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { setDeletingType(type); setDeleteId(item.id); }} className="p-1.5 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 text-left min-h-screen pb-20 relative">
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isEditorOpen && (
        <>
          <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-luxury-gold" /> Careers CMS
              </h1>
              <p className="text-sm text-zinc-500 mt-2">Manage open positions, resumes, hiring culture, process, and HR dashboard.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2 pb-4 border-b border-zinc-800/50">
            {NAV_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveNavTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeNavTab === tab ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeNavTab === 'Dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl text-center"><span className="text-2xl font-serif text-white">{careers.length}</span><span className="text-[10px] uppercase text-zinc-500 block mt-1">Total Jobs</span></div>
                <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl text-center"><span className="text-2xl font-serif text-white">{resumes.length}</span><span className="text-[10px] uppercase text-zinc-500 block mt-1">Applications</span></div>
                <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl text-center"><span className="text-2xl font-serif text-blue-400">{resumes.filter(r=>r.status==='Shortlisted').length}</span><span className="text-[10px] uppercase text-zinc-500 block mt-1">Shortlisted</span></div>
                <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl text-center"><span className="text-2xl font-serif text-emerald-400">{resumes.filter(r=>r.status==='Selected').length}</span><span className="text-[10px] uppercase text-zinc-500 block mt-1">Hired (Selected)</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950/40 border border-zinc-800/80 p-6 rounded-2xl">
                   <h3 className="text-lg font-serif mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-luxury-gold"/> Recent Applications</h3>
                   <div className="flex flex-col gap-3">
                      {resumes.slice(0,5).map(r => (
                        <div key={r.id} onClick={() => setViewingResume(r)} className="bg-black/40 border border-zinc-800 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-luxury-gold/50 transition-colors">
                           <div>
                              <p className="font-bold text-sm text-zinc-200">{r.candidateName}</p>
                              <p className="text-xs text-zinc-500">{r.jobApplied}</p>
                           </div>
                           <Badge variant={r.status === 'New' ? 'info' : 'success'}>{r.status}</Badge>
                        </div>
                      ))}
                      {resumes.length === 0 && <p className="text-xs text-zinc-500 italic">No applications yet.</p>}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeNavTab === 'Hero Settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-serif text-white mb-6">Hero Builder</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Small Badge Heading" value={heroDraft.badge || ''} onChange={e => setHeroDraft(p => ({...p, badge: e.target.value}))} />
                  <Input label="Main Title Line 1" value={heroDraft.titleLine1 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine1: e.target.value}))} />
                  <Input label="Main Title Line 2 (Highlight)" value={heroDraft.titleLine2 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine2: e.target.value}))} />
                  <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={heroDraft.description || ''} onChange={e => setHeroDraft(p => ({...p, description: e.target.value}))} /></div>
                  <FileUpload label="Background Image" value={heroDraft.bgImageUrl || ''} onChange={url => setHeroDraft(p => ({...p, bgImageUrl: url}))} accept="image/*" />
                  <FileUpload label="Background Video" value={heroDraft.bgVideoUrl || ''} onChange={url => setHeroDraft(p => ({...p, bgVideoUrl: url}))} accept="video/*" />
                </div>
                <div className="flex justify-end mt-6"><Button onClick={() => { updateSection('careerHero', null, heroDraft); showToast('✅ Hero Saved'); }} variant="primary" className="bg-luxury-gold text-black">Save Hero</Button></div>
              </div>
            </motion.div>
          )}

          {activeNavTab === 'Job Openings' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Job Vacancies</h3>
               <div className="flex gap-2">
                 <Button onClick={() => handleBulkAction('Publish', 'careers')} variant="secondary" className="text-xs">Bulk Publish</Button>
                 <Button onClick={() => handleStartAdd('careers')} className="bg-luxury-gold text-black">Add Job</Button>
               </div>
               </div>
               {renderTable(careers, 'careers')}
             </motion.div>
          )}

          {activeNavTab === 'Resumes & HR' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Applicant Resumes & Pipeline</h3>
               <div className="flex gap-2">
                 <Button onClick={() => handleStartAdd('resumes')} className="bg-luxury-gold text-black">Add Manual Applicant</Button>
               </div>
               </div>
               {renderTable(resumes, 'resumes')}
               <p className="text-xs text-zinc-500 italic mt-2">* Click any applicant to open the HR side-panel for reviewing PDFs and rating.</p>
             </motion.div>
          )}

          {activeNavTab === 'Culture & DNA' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Workplace Benefits</h3><Button onClick={() => handleStartAdd('careerCulture')} className="bg-luxury-gold text-black">Add Benefit</Button></div>
               {renderTable(careerCulture, 'careerCulture')}
             </motion.div>
          )}

          {activeNavTab === 'Hiring Process' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Hiring Steps</h3><Button onClick={() => handleStartAdd('careerProcess')} className="bg-luxury-gold text-black">Add Step</Button></div>
               {renderTable(careerProcess, 'careerProcess')}
             </motion.div>
          )}

          {activeNavTab === 'Statistics' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="font-serif text-xl mb-6">Counters & Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Total Employees (e.g. 50+)" value={statsDraft.employees || ''} onChange={e => setStatsDraft(p => ({...p, employees: e.target.value}))} />
                    <Input label="Countries (e.g. 12)" value={statsDraft.countries || ''} onChange={e => setStatsDraft(p => ({...p, countries: e.target.value}))} />
                    <Input label="Hiring Success (e.g. 98%)" value={statsDraft.success || ''} onChange={e => setStatsDraft(p => ({...p, success: e.target.value}))} />
                    <Input label="Open Positions" value={statsDraft.openPositions || ''} onChange={e => setStatsDraft(p => ({...p, openPositions: e.target.value}))} />
                    <Input label="Students Mentored (e.g. 15,000+)" value={statsDraft.students || ''} onChange={e => setStatsDraft(p => ({...p, students: e.target.value}))} />
                  </div>
                  <div className="flex justify-end mt-6"><Button onClick={() => { updateSection('careerStats', null, statsDraft); showToast('✅ Stats Saved'); }} className="bg-luxury-gold text-black">Save Stats</Button></div>
                </div>
             </motion.div>
          )}
          
          {activeNavTab === 'Gallery' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Office & Team Gallery</h3><Button onClick={() => handleStartAdd('careerGallery')} className="bg-luxury-gold text-black">Add Photo</Button></div>
               {renderTable(careerGallery, 'careerGallery')}
             </motion.div>
          )}

          {activeNavTab === 'Display & SEO' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-serif text-xl mb-6">Visitor Section Visibility</h3>
                    <div className="flex flex-col gap-4">
                      {['showHero', 'showJobs', 'showCulture', 'showProcess', 'showStats', 'showGallery', 'showFAQ'].map(key => (
                         <div key={key} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zinc-800">
                           <span className="text-sm font-mono text-zinc-300">{key}</span>
                           <Switch checked={settingsDraft[key] !== false} onChange={v => setSettingsDraft(p => ({...p, [key]: v}))} />
                         </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="font-serif text-xl mb-2">SEO Settings</h3>
                    <Input label="Meta Title" value={seoDraft.title || ''} onChange={e => setSeoDraft(p => ({...p, title: e.target.value}))} />
                    <Input label="Meta Description" textarea rows={3} value={seoDraft.description || ''} onChange={e => setSeoDraft(p => ({...p, description: e.target.value}))} />
                    <div className="flex items-center justify-between mt-4"><span className="text-sm text-zinc-300">Index Page</span><Switch checked={seoDraft.index !== false} onChange={v => setSeoDraft(p => ({...p, index: v}))} /></div>
                  </div>
                </div>
                <div className="flex justify-end"><Button onClick={() => { updateSection('careerSettings', null, settingsDraft); updateSection('careerSEO', null, seoDraft); showToast('✅ SEO Saved'); }} className="bg-luxury-gold text-black">Save Settings</Button></div>
             </motion.div>
          )}
        </>
      )}

      {/* ======================= MEGA EDITOR ======================= */}
      {isEditorOpen && (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)] relative z-[50]">
          <div className="w-full lg:w-2/3 bg-zinc-950/90 border border-luxury-gold/20 p-6 rounded-2xl shadow-gold-glow flex flex-col overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80 z-20">
              <h2 className="text-xl font-serif text-white flex items-center gap-2">
                 <Edit2 className="w-5 h-5 text-luxury-gold"/> {editingId ? 'Edit' : 'Create'} {editingType}
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {editingType === 'careers' && (
                   <>
                     <Input label="Job Title" value={draftItem.title || ''} onChange={e => setDraftItem(p => ({...p, title: e.target.value}))} />
                     <Input label="Department" value={draftItem.department || ''} onChange={e => setDraftItem(p => ({...p, department: e.target.value}))} />
                     <Input label="Team" value={draftItem.team || ''} onChange={e => setDraftItem(p => ({...p, team: e.target.value}))} />
                     <Input label="Employment Type (e.g. Full Time)" value={draftItem.type || ''} onChange={e => setDraftItem(p => ({...p, type: e.target.value}))} />
                     <Input label="Experience Required (e.g. 2+ Yrs)" value={draftItem.experience || ''} onChange={e => setDraftItem(p => ({...p, experience: e.target.value}))} />
                     <Input label="Location (e.g. Remote, NY)" value={draftItem.location || ''} onChange={e => setDraftItem(p => ({...p, location: e.target.value}))} />
                     <Input label="Salary Range" value={draftItem.salary || ''} onChange={e => setDraftItem(p => ({...p, salary: e.target.value}))} />
                     <Input label="Vacancies" type="number" value={draftItem.vacancies || ''} onChange={e => setDraftItem(p => ({...p, vacancies: e.target.value}))} />
                     <div className="md:col-span-2"><Input label="Job Description" textarea rows={3} value={draftItem.description || ''} onChange={e => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                     <div className="md:col-span-2"><Input label="Responsibilities (Bullet points)" textarea rows={3} value={draftItem.responsibilities || ''} onChange={e => setDraftItem(p => ({...p, responsibilities: e.target.value}))} /></div>
                     <div className="md:col-span-2"><Input label="Requirements (Bullet points)" textarea rows={3} value={draftItem.requirements || ''} onChange={e => setDraftItem(p => ({...p, requirements: e.target.value}))} /></div>
                     <FileUpload label="Company Logo" value={draftItem.companyLogo || ''} onChange={url => setDraftItem(p => ({...p, companyLogo: url}))} accept="image/*" />
                     <div className="flex flex-col gap-2 mt-4 md:col-span-2">
                       <Switch label="Active & Published" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
                       <Switch label="Featured Job" checked={draftItem.featured || false} onChange={v => setDraftItem(p => ({...p, featured: v}))} />
                     </div>
                   </>
                 )}

                 {editingType === 'resumes' && (
                   <>
                     <Input label="Applicant Name" value={draftItem.candidateName || ''} onChange={e => setDraftItem(p => ({...p, candidateName: e.target.value}))} />
                     <Input label="Email" value={draftItem.email || ''} onChange={e => setDraftItem(p => ({...p, email: e.target.value}))} />
                     <Input label="Phone" value={draftItem.phone || ''} onChange={e => setDraftItem(p => ({...p, phone: e.target.value}))} />
                     <Input label="Job Applied" value={draftItem.jobApplied || ''} onChange={e => setDraftItem(p => ({...p, jobApplied: e.target.value}))} />
                     <Input label="Experience (Yrs)" value={draftItem.experienceYears || ''} onChange={e => setDraftItem(p => ({...p, experienceYears: e.target.value}))} />
                     <Input label="Expected Salary" value={draftItem.expectedSalary || ''} onChange={e => setDraftItem(p => ({...p, expectedSalary: e.target.value}))} />
                     <div className="md:col-span-2"><Input label="LinkedIn URL" value={draftItem.linkedinUrl || ''} onChange={e => setDraftItem(p => ({...p, linkedinUrl: e.target.value}))} /></div>
                     <div className="md:col-span-2"><Input label="Portfolio URL" value={draftItem.portfolioUrl || ''} onChange={e => setDraftItem(p => ({...p, portfolioUrl: e.target.value}))} /></div>
                     <div className="md:col-span-2"><Input label="Cover Letter Message" textarea rows={3} value={draftItem.coverLetter || ''} onChange={e => setDraftItem(p => ({...p, coverLetter: e.target.value}))} /></div>
                     <div className="md:col-span-2"><FileUpload label="Resume PDF/DOC Upload" value={draftItem.resumeFileName || ''} onChange={(url, name) => setDraftItem(p => ({...p, resumeFileName: name, resumeFileUrl: url}))} accept=".pdf,.doc,.docx" /></div>
                     
                     {/* HR specific fields */}
                     <div className="md:col-span-2 mt-4 pt-4 border-t border-zinc-800">
                        <h4 className="text-luxury-gold font-bold uppercase text-[10px] mb-4">HR & Review Panel</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Application Status</label><Select options={[{value:'New',label:'New'},{value:'Reviewed',label:'Reviewed'},{value:'Shortlisted',label:'Shortlisted'},{value:'Selected',label:'Selected'},{value:'Rejected',label:'Rejected'}]} value={draftItem.status||'New'} onChange={e=>setDraftItem(p=>({...p, status:e.target.value}))} /></div>
                           <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Star Rating</label><Select options={[{value:0,label:'Unrated'},{value:1,label:'1 Star'},{value:2,label:'2 Stars'},{value:3,label:'3 Stars'},{value:4,label:'4 Stars'},{value:5,label:'5 Stars'}]} value={draftItem.rating||0} onChange={e=>setDraftItem(p=>({...p, rating:Number(e.target.value)}))} /></div>
                        </div>
                        <Input label="Internal HR Notes" textarea rows={3} value={draftItem.hrNotes || ''} onChange={e => setDraftItem(p => ({...p, hrNotes: e.target.value}))} />
                     </div>
                   </>
                 )}

                 {(editingType === 'careerCulture' || editingType === 'careerProcess' || editingType === 'careerGallery') && (
                   <>
                     <Input label="Title/Step Name" value={draftItem.title || ''} onChange={e => setDraftItem(p => ({...p, title: e.target.value}))} />
                     <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={draftItem.description || ''} onChange={e => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                     <FileUpload label="Media/Icon Upload" value={draftItem.icon || draftItem.url || ''} onChange={url => setDraftItem(p => ({...p, icon: url, url: url}))} />
                     <div className="flex items-center mt-4"><Switch label="Active" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} /></div>
                   </>
                 )}

              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 mt-auto">
              <Button onClick={() => setIsEditorOpen(false)} variant="secondary">Cancel</Button>
              <Button onClick={handleSaveItem} variant="primary" className="bg-luxury-gold text-black font-bold">Save Record</Button>
            </div>
          </div>
        </div>
      )}

      {/* HR RESUME SIDE PANEL */}
      <AnimatePresence>
        {viewingResume && !isEditorOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingResume(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col z-[1000]"
            >
               <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                  <div>
                     <h2 className="text-2xl font-serif text-white">{viewingResume.candidateName}</h2>
                     <p className="text-sm text-luxury-gold uppercase tracking-wider">{viewingResume.jobApplied}</p>
                  </div>
                  <button onClick={() => setViewingResume(null)} className="p-2 hover:bg-zinc-900 rounded-full"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Status & Actions */}
                  <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                     <div className="flex gap-2">
                        <Badge variant={viewingResume.status === 'New' ? 'info' : viewingResume.status === 'Selected' ? 'success' : 'default'}>{viewingResume.status}</Badge>
                        {viewingResume.rating > 0 && <span className="flex items-center gap-1 text-luxury-gold text-xs font-bold"><Star className="w-3 h-3 fill-luxury-gold"/> {viewingResume.rating}/5</span>}
                     </div>
                     <Button onClick={() => handleStartEdit('resumes', viewingResume)} className="bg-luxury-gold text-black text-xs h-8">Edit & Rate</Button>
                  </div>
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300">
                     <div><span className="text-[10px] text-zinc-500 uppercase block mb-1">Email</span>{viewingResume.email}</div>
                     <div><span className="text-[10px] text-zinc-500 uppercase block mb-1">Phone</span>{viewingResume.phone || 'N/A'}</div>
                     <div><span className="text-[10px] text-zinc-500 uppercase block mb-1">Experience</span>{viewingResume.experienceYears ? `${viewingResume.experienceYears} Years` : 'N/A'}</div>
                     <div><span className="text-[10px] text-zinc-500 uppercase block mb-1">Expected Salary</span>{viewingResume.expectedSalary || 'N/A'}</div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] text-zinc-500 uppercase">Portfolio & Links</span>
                     {viewingResume.portfolioUrl && <a href={viewingResume.portfolioUrl} target="_blank" className="text-blue-400 hover:underline flex items-center gap-2"><Globe className="w-4 h-4"/> {viewingResume.portfolioUrl}</a>}
                     {viewingResume.linkedinUrl && <a href={viewingResume.linkedinUrl} target="_blank" className="text-blue-400 hover:underline flex items-center gap-2"><Globe className="w-4 h-4"/> LinkedIn Profile</a>}
                  </div>

                  {/* Document */}
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-2"><FileText className="w-4 h-4 text-luxury-gold"/> Resume Document</span>
                        {viewingResume.resumeFileUrl && <a href={viewingResume.resumeFileUrl} download className="text-luxury-gold hover:text-white flex items-center gap-1 text-xs"><Download className="w-3 h-3"/> Download</a>}
                     </div>
                     {viewingResume.resumeFileUrl ? (
                        <div className="w-full h-40 bg-black rounded border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                           {viewingResume.resumeFileUrl.includes('image') || viewingResume.resumeFileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? 
                              <img src={viewingResume.resumeFileUrl} className="w-full h-full object-cover opacity-50"/> : 
                              <span className="text-zinc-500 text-xs">PDF Document Uploaded</span>
                           }
                        </div>
                     ) : (
                        <p className="text-zinc-500 text-xs italic">No document uploaded.</p>
                     )}
                  </div>

                  {/* Cover Letter & HR Notes */}
                  <div className="space-y-4">
                     <div>
                        <span className="text-[10px] text-zinc-500 uppercase block mb-1">Cover Letter</span>
                        <p className="text-zinc-300 text-sm bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">{viewingResume.coverLetter || 'No message provided.'}</p>
                     </div>
                     {viewingResume.hrNotes && (
                        <div>
                           <span className="text-[10px] text-luxury-gold uppercase block mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Internal HR Notes</span>
                           <p className="text-zinc-300 text-sm bg-luxury-gold/5 p-4 rounded-lg border border-luxury-gold/20">{viewingResume.hrNotes}</p>
                        </div>
                     )}
                  </div>
               </div>
               
               <div className="p-4 border-t border-zinc-800 flex justify-between bg-zinc-950">
                  <Button onClick={() => setViewingResume(null)} variant="secondary">Close</Button>
                  <Button onClick={() => { updateSection('resumes', viewingResume.id, {...viewingResume, status: 'Shortlisted'}); setViewingResume({...viewingResume, status: 'Shortlisted'}); showToast('✅ Shortlisted!'); }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Mark Shortlisted</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        title="Confirm Deletion" 
        message="Are you sure you want to delete this record? This action cannot be undone." 
        onConfirm={handleDeleteConfirm} 
        onClose={() => { setDeleteId(null); setDeletingType(null); }} 
      />
    </div>
  );
}
