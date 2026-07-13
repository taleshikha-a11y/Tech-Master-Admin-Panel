import React, { useState, useEffect } from 'react';
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
  HelpCircle, Search, Plus, Edit2, Trash2, CheckCircle, 
  ChevronDown, ChevronUp, GripVertical, Settings, Database,
  Layers, LayoutTemplate
} from 'lucide-react';

export const FAQ = () => {
  const { db, addItem, updateItem, deleteItem, updateSection } = useDatabase();
  
  // Data
  const faqSettings = db.faqSettings || {};
  const faqCategories = db.faqCategories || [];
  const faqs = db.faqs || [];

  // Local Drafts
  const [heroDraft, setHeroDraft] = useState(faqSettings);
  
  // Modals & States
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [faqForm, setFAQForm] = useState({});
  
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({});

  // Deletion
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Preview State
  const [expandedPreviewId, setExpandedPreviewId] = useState(null);
  
  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // --- Handlers ---
  const handleSaveHero = () => {
    updateSection('faqSettings', null, heroDraft);
    showToast('Hero Settings Saved');
  };

  const handleOpenFAQ = (item = null) => {
    setEditingFAQ(item);
    setFAQForm(item || { question: '', answer: '', categoryId: (faqCategories[0]?.id || ''), displayOrder: faqs.length + 1, isActive: true });
    setIsFAQModalOpen(true);
  };

  const handleSaveFAQ = (e) => {
    e.preventDefault();
    if (editingFAQ) {
      updateItem('faqs', editingFAQ.id, faqForm);
    } else {
      addItem('faqs', faqForm);
    }
    setIsFAQModalOpen(false);
    showToast(editingFAQ ? 'FAQ Updated' : 'FAQ Added');
  };

  const handleOpenCat = (item = null) => {
    setEditingCat(item);
    setCatForm(item || { name: '', slug: '', displayOrder: faqCategories.length + 1, isActive: true });
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e) => {
    e.preventDefault();
    const currentList = db.faqCategories || [];
    if (editingCat) {
      updateSection('faqCategories', null, currentList.map(c => c.id === editingCat.id ? { ...catForm, id: c.id } : c));
    } else {
      updateSection('faqCategories', null, [...currentList, { ...catForm, id: `fc-${Date.now()}` }]);
    }
    setIsCatModalOpen(false);
    showToast(editingCat ? 'Category Updated' : 'Category Added');
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'faqs') {
      deleteItem('faqs', deleteId);
    } else if (deleteType === 'faqCategories') {
      const currentList = db.faqCategories || [];
      updateSection('faqCategories', null, currentList.filter(c => c.id !== deleteId));
    }
    setDeleteId(null);
    setDeleteType(null);
    showToast('Item Deleted');
  };

  // Derived Stats
  const activeFAQsCount = faqs.filter(f => f.isActive !== false).length;
  const inactiveFAQsCount = faqs.length - activeFAQsCount;
  const categoryCount = faqCategories.length;

  // Filtered FAQs
  const filteredFAQs = faqs.filter(f => {
    const matchSearch = f.question?.toLowerCase().includes(searchTerm.toLowerCase()) || f.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catFilter === 'all' || f.categoryId === catFilter || f.category === catFilter;
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? f.isActive !== false : f.isActive === false);
    return matchSearch && matchCat && matchStatus;
  }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Preview Logic
  const visiblePreviewFAQs = faqs.filter(f => f.isActive !== false).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="flex flex-col gap-6 text-left relative min-h-screen pb-20">
      
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b border-zinc-800 pb-5">
        <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
          <HelpCircle className="w-7 h-7 text-luxury-gold" /> FAQ Management
        </h1>
        <p className="text-sm text-zinc-500 mt-2">Centralized portal for managing frequently asked questions and real-time visitor previews.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total FAQs', val: faqs.length, icon: <Database className="w-4 h-4" /> },
          { label: 'Active', val: activeFAQsCount, icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
          { label: 'Inactive', val: inactiveFAQsCount, icon: <Settings className="w-4 h-4 text-rose-500" /> },
          { label: 'Categories', val: categoryCount, icon: <Layers className="w-4 h-4 text-blue-400" /> }
        ].map((s, i) => (
          <div key={i} className="glass-panel border border-zinc-850 p-4 rounded-xl flex items-center justify-between bg-zinc-950/40">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-550 uppercase font-mono tracking-wider">{s.label}</span>
              <span className="text-2xl font-bold text-zinc-100">{s.val}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        
        {/* LEFT COLUMN: Operations */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Hero Settings */}
          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title={<span className="text-luxury-gold font-serif flex items-center gap-2"><LayoutTemplate className="w-4 h-4"/> FAQ Hero Settings</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <Input label="Badge Text" value={heroDraft.badge || ''} onChange={e => setHeroDraft(p => ({...p, badge: e.target.value}))} />
              <Input label="Background Image URL" value={heroDraft.backgroundImage || ''} onChange={e => setHeroDraft(p => ({...p, backgroundImage: e.target.value}))} />
              <Input label="Main Heading" value={heroDraft.heading || ''} onChange={e => setHeroDraft(p => ({...p, heading: e.target.value}))} />
              <Input label="Highlight Heading (Gold Italic)" value={heroDraft.highlightHeading || ''} onChange={e => setHeroDraft(p => ({...p, highlightHeading: e.target.value}))} />
            </div>
            <div className="mt-5">
              <Input label="Description" textarea rows={3} value={heroDraft.description || ''} onChange={e => setHeroDraft(p => ({...p, description: e.target.value}))} />
            </div>
            <div className="flex justify-between items-center mt-5 pt-5 border-t border-zinc-900">
              <Switch label="Enable FAQ Section on Visitor Site" checked={heroDraft.enabled !== false} onChange={v => setHeroDraft(p => ({...p, enabled: v}))} />
              <Button onClick={handleSaveHero} variant="primary">Save Settings</Button>
            </div>
          </Card>

          {/* Categories Manager */}
          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title={<span className="text-luxury-gold font-serif flex items-center gap-2"><Layers className="w-4 h-4"/> FAQ Category Management</span>}>
            <div className="flex justify-end mb-4"><Button size="sm" onClick={() => handleOpenCat()}><Plus className="w-4 h-4 mr-1"/> Add Category</Button></div>
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900/60 text-zinc-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3 w-10">Order</th>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {faqCategories.sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0)).map(cat => (
                    <tr key={cat.id} className="hover:bg-zinc-900/30">
                      <td className="p-3 text-zinc-500 flex items-center gap-1"><GripVertical className="w-3 h-3"/> {cat.displayOrder}</td>
                      <td className="p-3 font-semibold text-zinc-200">{cat.name}</td>
                      <td className="p-3 text-zinc-500">{cat.slug}</td>
                      <td className="p-3"><Badge variant={cat.isActive !== false ? 'success' : 'default'}>{cat.isActive !== false ? 'Active' : 'Hidden'}</Badge></td>
                      <td className="p-3 flex justify-end gap-2">
                        <button onClick={() => handleOpenCat(cat)} className="text-zinc-400 hover:text-luxury-gold"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => { setDeleteId(cat.id); setDeleteType('faqCategories'); }} className="text-rose-500 hover:text-rose-400"><Trash2 className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                  {faqCategories.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-zinc-600 italic">No categories created yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>

          {/* FAQ CRUD Table */}
          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title={<span className="text-luxury-gold font-serif flex items-center gap-2"><Database className="w-4 h-4"/> FAQ Management Database</span>}>
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
               <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                   <input type="text" placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900/60 border border-zinc-800 rounded pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-luxury-gold/50" />
                 </div>
                 <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900/60 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none w-32">
                   <option value="all">All Cats</option>
                   {faqCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   <option value="General">Legacy General</option>
                 </select>
                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-zinc-900/60 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none w-28">
                   <option value="all">All Status</option>
                   <option value="active">Active</option>
                   <option value="inactive">Inactive</option>
                 </select>
               </div>
               <Button onClick={() => handleOpenFAQ()}><Plus className="w-4 h-4 mr-1"/> Add FAQ</Button>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900/60 text-zinc-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3 w-10">Order</th>
                    <th className="p-3 w-1/2">Question & Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredFAQs.map(faq => {
                    const catName = faqCategories.find(c => c.id === faq.categoryId)?.name || faq.category || 'Uncategorized';
                    return (
                      <tr key={faq.id} className="hover:bg-zinc-900/30">
                        <td className="p-3 text-zinc-500 font-mono">{faq.displayOrder}</td>
                        <td className="p-3">
                          <p className="font-semibold text-zinc-200 leading-snug">{faq.question}</p>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-1">{catName}</span>
                        </td>
                        <td className="p-3"><Badge variant={faq.isActive !== false ? 'gold' : 'default'}>{faq.isActive !== false ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="p-3 flex justify-end gap-2">
                          <button onClick={() => handleOpenFAQ(faq)} className="text-zinc-400 hover:text-luxury-gold p-1.5"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => { setDeleteId(faq.id); setDeleteType('faqs'); }} className="text-rose-500 hover:text-rose-400 p-1.5"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredFAQs.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-zinc-600 italic">No FAQs match criteria.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <h3 className="font-serif text-xl text-luxury-gold">Live Preview</h3>
            <span className="text-[10px] text-emerald-500 uppercase font-mono tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Sync Active</span>
          </div>

          <div className="glass-panel border border-zinc-800/60 rounded-2xl overflow-hidden bg-black/60 relative p-6 min-h-[600px]">
            {/* Background Effects Simulator */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-zinc-900/50 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-luxury-gold/10 blur-[100px] pointer-events-none" />

            {heroDraft.enabled !== false && (
              <div className="text-center mb-8 relative z-10">
                {heroDraft.badge && <span className="text-[9px] uppercase tracking-[4px] text-luxury-gold font-bold mb-3 block">{heroDraft.badge}</span>}
                <h4 className="font-serif text-2xl font-light text-white leading-tight">
                  {heroDraft.heading} <br/><span className="text-luxury-gold italic font-bold">{heroDraft.highlightHeading}</span>
                </h4>
                {heroDraft.description && <p className="text-[10px] text-zinc-400 mt-3 max-w-[200px] mx-auto leading-relaxed">{heroDraft.description}</p>}
              </div>
            )}

            <div className="flex flex-col gap-3 relative z-10">
              {visiblePreviewFAQs.length === 0 ? (
                <div className="text-center text-zinc-600 text-xs italic py-12">No active FAQs to display.</div>
              ) : (
                visiblePreviewFAQs.map(faq => {
                  const isExpanded = expandedPreviewId === faq.id;
                  return (
                    <div key={faq.id} className="border border-white/10 bg-white/[0.02] rounded-xl overflow-hidden transition-all duration-300 hover:border-luxury-gold/30">
                      <div onClick={() => setExpandedPreviewId(isExpanded ? null : faq.id)} className="p-4 flex justify-between items-center cursor-pointer select-none">
                        <div className="flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                          <h5 className="text-[11px] font-semibold text-white leading-snug">{faq.question}</h5>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-white/5 bg-black/40">
                            <div className="p-4 text-[10px] text-zinc-400 leading-relaxed whitespace-pre-line">{faq.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MODALS */}
      {/* Category Modal */}
      <Dialog isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title={editingCat ? "Edit Category" : "Add Category"} size="sm">
        <form onSubmit={handleSaveCat} className="flex flex-col gap-4 mt-2">
          <Input label="Category Name" value={catForm.name || ''} onChange={e => {
            const val = e.target.value;
            setCatForm(p => ({...p, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-')}));
          }} required />
          <Input label="URL Slug" value={catForm.slug || ''} onChange={e => setCatForm(p => ({...p, slug: e.target.value}))} required />
          <Input label="Display Order (Number)" type="number" value={catForm.displayOrder || ''} onChange={e => setCatForm(p => ({...p, displayOrder: parseInt(e.target.value)}))} required />
          <Switch label="Category Active" checked={catForm.isActive !== false} onChange={v => setCatForm(p => ({...p, isActive: v}))} />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900">
            <Button type="button" variant="secondary" onClick={() => setIsCatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Category</Button>
          </div>
        </form>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog isOpen={isFAQModalOpen} onClose={() => setIsFAQModalOpen(false)} title={editingFAQ ? "Edit FAQ" : "Add FAQ"} size="md">
        <form onSubmit={handleSaveFAQ} className="flex flex-col gap-4 mt-2">
          <Input label="Question" value={faqForm.question || ''} onChange={e => setFAQForm(p => ({...p, question: e.target.value}))} required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Assigned Category" 
              options={faqCategories.map(c => ({value: c.id, label: c.name}))} 
              value={faqForm.categoryId || (faqCategories[0]?.id || '')} 
              onChange={e => setFAQForm(p => ({...p, categoryId: e.target.value}))} 
            />
            <Input label="Display Order" type="number" value={faqForm.displayOrder || ''} onChange={e => setFAQForm(p => ({...p, displayOrder: parseInt(e.target.value)}))} required />
          </div>

          <Input label="Answer Content" textarea rows={5} value={faqForm.answer || ''} onChange={e => setFAQForm(p => ({...p, answer: e.target.value}))} required />
          
          <Switch label="Active (Visible in Preview & Visitor Site)" checked={faqForm.isActive !== false} onChange={v => setFAQForm(p => ({...p, isActive: v}))} />
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900">
            <Button type="button" variant="secondary" onClick={() => setIsFAQModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save FAQ</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setDeleteType(null); }} onConfirm={handleDeleteConfirm} />
    </div>
  );
};
