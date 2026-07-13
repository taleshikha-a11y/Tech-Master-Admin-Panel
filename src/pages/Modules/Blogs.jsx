import React, { useState, useRef } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, Trash2, Edit2, X, Upload, 
  Settings, Layout, BarChart, Users, Tag, Bold, Italic, Link, Code
} from 'lucide-react';

/* =========================================================
   FILE UPLOAD SIMULATOR (BLOB)
========================================================= */
const FileUpload = ({ label, value, onChange, accept="image/*" }) => {
  const fileRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-12 h-10 rounded border border-zinc-700 bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
             <img src={value} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
          </div>
        )}
        <input type="file" ref={fileRef} className="hidden" accept={accept} onChange={handleFileChange} />
        <button type="button" onClick={() => fileRef.current?.click()} className="flex-1 border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-950/50 rounded-lg px-4 py-2 text-sm flex items-center justify-center transition-colors text-zinc-400 min-h-[42px] truncate">
          <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{value ? 'Change Media' : 'Upload File'}</span>
        </button>
      </div>
    </div>
  );
};

export const Blogs = () => {
  const { db, updateSection } = useDatabase();
  
  // Data Collections
  const blogHero = db?.blogHero || {};
  const featuredStrategy = db?.featuredStrategy || {};
  const strategyStats = db?.strategyStats || [];
  const strategyPillars = db?.strategyPillars || [];
  const strategyPresets = db?.strategyPresets || [];
  const quickBlueprint = db?.quickBlueprint || {};
  const blogCategories = db?.blogCategories || [];
  const latestInsights = db?.latestInsights || {};
  const blogs = db?.blogs || [];
  const blogSettings = db?.blogPageSettings || {};
  const blogSEO = db?.blogSEO || {};

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  // Nav
  const NAV_TABS = ['Articles', 'Hero Setup', 'Strategy Builder', 'Categories', 'Global & SEO'];
  const [activeNavTab, setActiveNavTab] = useState('Articles'); 
  
  // States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deletingType, setDeletingType] = useState(null);

  // Settings Drafts
  const [heroDraft, setHeroDraft] = useState(blogHero);
  const [featDraft, setFeatDraft] = useState(featuredStrategy);
  const [quickDraft, setQuickDraft] = useState(quickBlueprint);
  const [latestDraft, setLatestDraft] = useState(latestInsights);
  const [settingsDraft, setSettingsDraft] = useState(blogSettings);
  const [seoDraft, setSeoDraft] = useState(blogSEO);

  const handleStartAdd = (type) => {
    setEditingType(type);
    setEditingId(null);
    let init = { active: true, order: 1 };
    if (type === 'blogs') init = { active: true, status: 'published', author: 'TechMaster', readTime: '5 min read', publishDate: new Date().toISOString().split('T')[0] };
    setDraftItem(init);
    setIsEditorOpen(true);
  };

  const handleStartEdit = (type, item) => {
    setEditingType(type);
    setEditingId(item.id);
    setDraftItem(item);
    setIsEditorOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const collectionKey = editingType;
    const currentList = db[collectionKey] || [];
    let nextList = [];
    if (editingId) {
      nextList = currentList.map(item => item.id === editingId ? { ...draftItem, id: item.id } : item);
    } else {
      nextList = [...currentList, { ...draftItem, id: `${editingType}-${Date.now()}` }];
    }
    updateSection(collectionKey, null, nextList);
    setIsEditorOpen(false);
    showToast(`✅ Saved ${editingType}.`);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      const collectionKey = deletingType;
      const currentList = db[collectionKey] || [];
      updateSection(collectionKey, null, currentList.filter(item => item.id !== deleteId));
      setDeleteId(null);
      setDeletingType(null);
      showToast("✅ Record deleted.");
    }
  };

  // Editor Toolbar Logic
  const handleFormat = (tagOpen, tagClose) => {
     const textarea = document.getElementById('blog-content-editor');
     if(!textarea) return;
     const start = textarea.selectionStart;
     const end = textarea.selectionEnd;
     const text = draftItem.content || '';
     const newText = text.substring(0, start) + tagOpen + text.substring(start, end) + tagClose + text.substring(end);
     setDraftItem({...draftItem, content: newText});
  };

  const renderTable = (list, type) => (
    <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
        <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-5 py-4 w-10">#</th>
            <th className="px-5 py-4">Title / Label</th>
            {type === 'blogs' && <th className="px-5 py-4">Category</th>}
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850/50">
          {list.length === 0 && <tr><td colSpan="5" className="px-5 py-8 text-center text-zinc-500 italic">No items found.</td></tr>}
          {list.map((item, idx) => (
            <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors">
              <td className="px-5 py-4 text-zinc-500">{item.order || idx + 1}</td>
              <td className="px-5 py-4 font-medium text-zinc-200">
                {item.title || item.name || item.number || item.presetName || '-'}
                {(type === 'blogs') && <span className="block text-[10px] font-normal text-zinc-500 mt-0.5">{item.publishDate}</span>}
              </td>
              {type === 'blogs' && <td className="px-5 py-4"><Badge variant="outline">{item.category}</Badge></td>}
              <td className="px-5 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium border ${item.active !== false && item.status !== 'draft' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                  {item.status === 'draft' ? 'Draft' : (item.active !== false ? 'Active' : 'Hidden')}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
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
                <FileText className="w-7 h-7 text-luxury-gold" /> Blog CMS Engine
              </h1>
              <p className="text-sm text-zinc-500 mt-2">Manage articles, landing page strategy logic, categories, and SEO.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2 pb-4 border-b border-zinc-800/50">
            {NAV_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveNavTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeNavTab === tab ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeNavTab === 'Articles' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Articles Hub</h3>
                 <Button onClick={() => handleStartAdd('blogs')} className="bg-luxury-gold text-black">Write Article</Button>
               </div>
               {renderTable(blogs, 'blogs')}
             </motion.div>
          )}

          {activeNavTab === 'Hero Setup' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-serif text-white mb-6">Hero Texts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Small Badge" value={heroDraft.badge || ''} onChange={e => setHeroDraft(p => ({...p, badge: e.target.value}))} />
                  <Input label="Main Title Line 1" value={heroDraft.titleLine1 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine1: e.target.value}))} />
                  <Input label="Main Title Line 2 (Highlight)" value={heroDraft.titleLine2 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine2: e.target.value}))} />
                  <div className="flex items-center gap-4 mt-4">
                    <Switch label="Show Section" checked={heroDraft.active !== false} onChange={v => setHeroDraft(p => ({...p, active: v}))} />
                    <Switch label="Glow Effect" checked={heroDraft.glowEnabled !== false} onChange={v => setHeroDraft(p => ({...p, glowEnabled: v}))} />
                  </div>
                </div>
                <div className="flex justify-end mt-6"><Button onClick={() => { updateSection('blogHero', null, heroDraft); showToast('✅ Hero Saved'); }} className="bg-luxury-gold text-black">Save Settings</Button></div>
              </div>
            </motion.div>
          )}

          {activeNavTab === 'Strategy Builder' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                {/* Intro Texts */}
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-between mb-6"><h3 className="text-xl font-serif">Featured Strategy Intro</h3><Switch checked={featDraft.active !== false} onChange={v => { setFeatDraft(p => ({...p, active: v})); updateSection('featuredStrategy', null, {...featDraft, active: v}); }} /></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input label="Badge" value={featDraft.badge || ''} onChange={e => setFeatDraft(p => ({...p, badge: e.target.value}))} />
                    <Input label="Title Start" value={featDraft.titleLine1 || ''} onChange={e => setFeatDraft(p => ({...p, titleLine1: e.target.value}))} />
                    <Input label="Title Highlight" value={featDraft.titleLine2 || ''} onChange={e => setFeatDraft(p => ({...p, titleLine2: e.target.value}))} />
                    <Input label="Title End" value={featDraft.titleLine3 || ''} onChange={e => setFeatDraft(p => ({...p, titleLine3: e.target.value}))} />
                    <div className="md:col-span-2"><Input label="Description" value={featDraft.description || ''} onChange={e => setFeatDraft(p => ({...p, description: e.target.value}))} /></div>
                  </div>
                  <Button onClick={() => { updateSection('featuredStrategy', null, featDraft); showToast('✅ Strategy Intro Saved'); }}>Save Intro</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* STATS */}
                   <div>
                     <div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg text-luxury-gold">Strategy Stats</h3><Button size="sm" onClick={() => handleStartAdd('strategyStats')}>Add Stat</Button></div>
                     {renderTable(strategyStats, 'strategyStats')}
                   </div>
                   {/* PILLARS */}
                   <div>
                     <div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg text-luxury-gold">Core Pillars</h3><Button size="sm" onClick={() => handleStartAdd('strategyPillars')}>Add Pillar</Button></div>
                     {renderTable(strategyPillars, 'strategyPillars')}
                   </div>
                </div>

                {/* PRESETS */}
                <div>
                   <div className="flex justify-between items-center mb-4"><h3 className="font-serif text-lg text-luxury-gold">Planner Presets (Estimator)</h3><Button size="sm" onClick={() => handleStartAdd('strategyPresets')}>Add Preset</Button></div>
                   {renderTable(strategyPresets, 'strategyPresets')}
                </div>
             </motion.div>
          )}

          {activeNavTab === 'Categories' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
               <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Blog Categories Taxonomy</h3><Button onClick={() => handleStartAdd('blogCategories')} className="bg-luxury-gold text-black">Add Category</Button></div>
               {renderTable(blogCategories, 'blogCategories')}
             </motion.div>
          )}

          {activeNavTab === 'Global & SEO' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Latest Insights Text */}
                  <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-serif text-xl mb-4">Latest Insights Header</h3>
                    <div className="flex flex-col gap-4">
                      <Input label="Section Title" value={latestDraft.title || ''} onChange={e => setLatestDraft(p => ({...p, title: e.target.value}))} />
                      <Input label="Subtitle" value={latestDraft.subtitle || ''} onChange={e => setLatestDraft(p => ({...p, subtitle: e.target.value}))} />
                      <Switch label="Show Latest Insights Block" checked={latestDraft.active !== false} onChange={v => setLatestDraft(p => ({...p, active: v}))} />
                      <Button onClick={() => { updateSection('latestInsights', null, latestDraft); showToast('Saved'); }}>Save Section</Button>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-serif text-xl mb-4">Page Level Controls</h3>
                    <div className="flex flex-col gap-3">
                      {['showHero', 'showStrategy', 'showLatest', 'showFilters', 'hoverAnimations'].map(key => (
                         <div key={key} className="flex justify-between p-2 border-b border-zinc-800/50">
                           <span className="text-sm text-zinc-300 font-mono">{key}</span>
                           <Switch checked={settingsDraft[key] !== false} onChange={v => setSettingsDraft(p => ({...p, [key]: v}))} />
                         </div>
                      ))}
                      <Button onClick={() => { updateSection('blogPageSettings', null, settingsDraft); showToast('Saved'); }} className="mt-2">Save Controls</Button>
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 md:col-span-2">
                    <h3 className="font-serif text-xl mb-4">SEO & Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Meta Title" value={seoDraft.metaTitle || ''} onChange={e => setSeoDraft(p => ({...p, metaTitle: e.target.value}))} />
                      <Input label="Keywords" value={seoDraft.keywords || ''} onChange={e => setSeoDraft(p => ({...p, keywords: e.target.value}))} />
                      <div className="md:col-span-2"><Input label="Meta Description" textarea rows={2} value={seoDraft.metaDescription || ''} onChange={e => setSeoDraft(p => ({...p, metaDescription: e.target.value}))} /></div>
                    </div>
                    <Button onClick={() => { updateSection('blogSEO', null, seoDraft); showToast('Saved'); }} className="mt-4">Save SEO</Button>
                  </div>
                </div>
             </motion.div>
          )}
        </>
      )}

      {/* ======================= MEGA EDITOR / CMS MODAL ======================= */}
      <Dialog isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title={editingId ? 'Edit Record' : 'Create Record'} size={editingType === 'blogs' ? 'xl' : 'md'}>
        <form onSubmit={handleSaveItem} className="flex flex-col gap-4">
           {/* BLOG ARTICLE FORM */}
           {editingType === 'blogs' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col gap-4">
                   <Input label="Blog Title" value={draftItem.title || ''} onChange={e => setDraftItem(p => ({...p, title: e.target.value}))} required />
                   <Input label="Short Excerpt" textarea rows={2} value={draftItem.excerpt || ''} onChange={e => setDraftItem(p => ({...p, excerpt: e.target.value}))} required />
                   
                   <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/40">
                     <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex gap-2">
                       <button type="button" onClick={() => handleFormat('**', '**')} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400" title="Bold"><Bold className="w-4 h-4"/></button>
                       <button type="button" onClick={() => handleFormat('*', '*')} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400" title="Italic"><Italic className="w-4 h-4"/></button>
                       <button type="button" onClick={() => handleFormat('[', '](url)')} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400" title="Link"><Link className="w-4 h-4"/></button>
                       <button type="button" onClick={() => handleFormat('```\\n', '\\n```')} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400" title="Code"><Code className="w-4 h-4"/></button>
                     </div>
                     <textarea id="blog-content-editor" className="w-full h-[400px] bg-transparent text-sm text-zinc-200 p-4 focus:outline-none custom-scrollbar" placeholder="Start writing using Markdown..." value={draftItem.content || ''} onChange={e => setDraftItem(p => ({...p, content: e.target.value}))} required />
                   </div>
                </div>

                <div className="flex flex-col gap-4 border-l border-zinc-800/80 pl-6">
                   <Select label="Status" options={[{value:'published',label:'Published'},{value:'draft',label:'Draft'}]} value={draftItem.status || 'published'} onChange={e => setDraftItem(p => ({...p, status: e.target.value}))} />
                   <Select label="Category" options={(blogCategories.length ? blogCategories : [{name:'Marketing'}]).map(c => ({value: c.name, label: c.name}))} value={draftItem.category || ''} onChange={e => setDraftItem(p => ({...p, category: e.target.value}))} />
                   <Input label="Publish Date" type="date" value={draftItem.publishDate || ''} onChange={e => setDraftItem(p => ({...p, publishDate: e.target.value}))} />
                   <Input label="Read Time (e.g. 5 min)" value={draftItem.readTime || ''} onChange={e => setDraftItem(p => ({...p, readTime: e.target.value}))} />
                   <Input label="Author Name" value={draftItem.author || ''} onChange={e => setDraftItem(p => ({...p, author: e.target.value}))} />
                   <FileUpload label="Cover Image" value={draftItem.coverImage || ''} onChange={url => setDraftItem(p => ({...p, coverImage: url}))} />
                   <div className="mt-2 space-y-2">
                     <Switch label="Active/Visible" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
                     <Switch label="Featured Post" checked={draftItem.featured || false} onChange={v => setDraftItem(p => ({...p, featured: v}))} />
                   </div>
                </div>
             </div>
           )}

           {/* STRATEGY STATS */}
           {editingType === 'strategyStats' && (
             <>
                <Input label="Number Text (e.g. 10M+)" value={draftItem.number || ''} onChange={e => setDraftItem(p => ({...p, number: e.target.value}))} required />
                <Input label="Label (e.g. Impressions)" value={draftItem.label || ''} onChange={e => setDraftItem(p => ({...p, label: e.target.value}))} required />
                <Switch label="Active" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
             </>
           )}

           {/* STRATEGY PILLARS */}
           {editingType === 'strategyPillars' && (
             <>
                <Input label="Pillar Title" value={draftItem.title || ''} onChange={e => setDraftItem(p => ({...p, title: e.target.value}))} required />
                <Input label="Description" textarea rows={2} value={draftItem.description || ''} onChange={e => setDraftItem(p => ({...p, description: e.target.value}))} required />
                <Switch label="Active" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
             </>
           )}

           {/* STRATEGY PRESETS */}
           {editingType === 'strategyPresets' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Preset Name (ID)" value={draftItem.presetName || ''} onChange={e => setDraftItem(p => ({...p, presetName: e.target.value}))} required />
                <Input label="Badge Text (e.g. Solo Creator)" value={draftItem.badge || ''} onChange={e => setDraftItem(p => ({...p, badge: e.target.value}))} required />
                <Input label="Monthly Reach" value={draftItem.impressions || ''} onChange={e => setDraftItem(p => ({...p, impressions: e.target.value}))} required />
                <Input label="Primary Channels" value={draftItem.channel || ''} onChange={e => setDraftItem(p => ({...p, channel: e.target.value}))} required />
                <div className="md:col-span-2"><Input label="Content Focus" textarea rows={2} value={draftItem.focus || ''} onChange={e => setDraftItem(p => ({...p, focus: e.target.value}))} required /></div>
                <div className="md:col-span-2"><Input label="ROI" value={draftItem.roi || ''} onChange={e => setDraftItem(p => ({...p, roi: e.target.value}))} required /></div>
                <Switch label="Active" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
             </div>
           )}

           {/* CATEGORIES */}
           {editingType === 'blogCategories' && (
             <>
                <Input label="Category Name" value={draftItem.name || ''} onChange={e => setDraftItem(p => ({...p, name: e.target.value}))} required />
                <Input label="Slug (e.g. all, lifestyle)" value={draftItem.slug || ''} onChange={e => setDraftItem(p => ({...p, slug: e.target.value}))} required />
                <Switch label="Active" checked={draftItem.active !== false} onChange={v => setDraftItem(p => ({...p, active: v}))} />
             </>
           )}

           <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
             <Button type="button" onClick={() => setIsEditorOpen(false)} variant="secondary">Cancel</Button>
             <Button type="submit" variant="primary" className="bg-luxury-gold text-black font-bold">Save Record</Button>
           </div>
        </form>
      </Dialog>

      <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
