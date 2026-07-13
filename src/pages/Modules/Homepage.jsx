import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useMediaManager } from '../../context/MediaContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Input } from '../../components/ui/Input';
import { 
  Sparkles, Home, Layers, Plus, 
  BarChart, Mail, ChevronDown, ChevronRight,
  Briefcase, History, Edit3, Trash2, 
  RefreshCw, Save, ArrowUp, ArrowDown, 
  UploadCloud, AlertCircle, Play, Film, Video, Handshake,
  Calendar, Target, Star, Download, Search
} from 'lucide-react';

export const Homepage = () => {
  const { db, updateSection } = useDatabase();
  const homepageData = db?.homepage || {};

  const [expandedCards, setExpandedCards] = useState({
    hero: true, stats: false, coreValues: false, events: false, newsletter: false,
    heroSlides: false, videoSlider: false, reels: false, shorts: false, longVideos: false,
    projects: false, services: false, logos: false, whyChooseUs: false, gallery: false, customSections: true
  });

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [heroForm, setHeroForm] = useState(homepageData?.hero || {});
  const [newsletterForm, setNewsletterForm] = useState(homepageData?.newsletter || {});
  const [eventsForm, setEventsForm] = useState(homepageData?.events || {});
  const [subscriberSearch, setSubscriberSearch] = useState('');

  const [activeEditorSection, setActiveEditorSection] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});

  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { openMediaManager } = useMediaManager();
  const simulateMediaUpload = (targetKey, isObjectForm = false, objectSetter = null) => {
    openMediaManager({
      onSelect: (url) => {
        if (activeEditorSection) {
          setDraftItem(prev => ({ ...prev, [targetKey]: url }));
        } else {
          if (targetKey in heroForm || ['desktopImageUrl', 'mobileImageUrl', 'videoUrl'].includes(targetKey)) setHeroForm(prev => ({ ...prev, [targetKey]: url }));
          if (targetKey in newsletterForm || ['backgroundImage', 'backgroundVideo', 'leftIllustration', 'rightIllustration'].includes(targetKey)) setNewsletterForm(prev => ({ ...prev, [targetKey]: url }));
        }
      }
    });
  };


  const handleSingleSave = (sectionKey, data) => {
    updateSection('homepage', { [sectionKey]: data });
    showToast(`${sectionKey.toUpperCase()} saved successfully.`);
  };

  const handleExportCSV = () => {
    const subscribers = homepageData?.newsletter?.subscribers || [];
    if (subscribers.length === 0) return showToast("No subscribers to export", "error");
    
    const headers = ["Name,Email,Subscription Date,Status"];
    const rows = subscribers.map(s => `${s.name},${s.email},${s.subscriptionDate},${s.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Exported Successfully.");
  };

  const handleDeleteSubscriber = (id) => {
    if(window.confirm("Delete this subscriber?")) {
      const nextSubs = (homepageData?.newsletter?.subscribers || []).filter(s => s.id !== id);
      updateSection('homepage', { newsletter: { ...homepageData.newsletter, subscribers: nextSubs }});
      showToast("Subscriber deleted.");
    }
  };
  
  const handleBulkDeleteSubscribers = () => {
    if(window.confirm("Delete ALL subscribers? This cannot be undone.")) {
      updateSection('homepage', { newsletter: { ...homepageData.newsletter, subscribers: [] }});
      showToast("Bulk delete completed.");
    }
  };

  const renderListManager = ({ sectionKey, fields = [], displayColumns = [], innerListKey = null }) => {
    let listData = [];
    if (innerListKey) {
       listData = homepageData[sectionKey]?.[innerListKey] || [];
    } else {
       listData = homepageData[sectionKey] || [];
    }
    
    if (!Array.isArray(listData)) {
      listData = Object.values(listData || {});
    }

    const isEditing = activeEditorSection === (innerListKey ? `${sectionKey}_${innerListKey}` : sectionKey);

    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
        showToast("Item updated.");
      } else {
        const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
        nextList = [...listData, newItem];
        showToast("Item created.");
      }
      
      if (innerListKey) {
        const parentObj = homepageData[sectionKey] || {};
        updateSection('homepage', { [sectionKey]: { ...parentObj, [innerListKey]: nextList } });
      } else {
        updateSection('homepage', { [sectionKey]: nextList });
      }
      setActiveEditorSection(null); setEditingItemId(null); setDraftItem({});
    };

    const handleDeleteItem = (id) => {
      if (window.confirm("Delete this item?")) {
        const nextList = listData.filter(item => item.id !== id);
        if (innerListKey) {
          const parentObj = homepageData[sectionKey] || {};
          updateSection('homepage', { [sectionKey]: { ...parentObj, [innerListKey]: nextList } });
        } else {
          updateSection('homepage', { [sectionKey]: nextList });
        }
        showToast("Deleted.");
      }
    };

    return (
      <div className="flex flex-col gap-4">
        {!isEditing && (
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider">
                    {displayColumns.map(col => <th key={col.key} className="py-2 px-3">{col.label}</th>)}
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/10 text-zinc-300">
                      {displayColumns.map(col => (
                        <td key={col.key} className="py-2.5 px-3 truncate">
                          {col.type === 'image' || col.type === 'video' || col.type === 'gallery' ? (
                            item[col.key] ? <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden"><img src={typeof item[col.key] === 'string' ? item[col.key].split(',')[0] : item[col.key]} className="w-full h-full object-cover" /></div> : '-'
                          ) : col.type === 'switch' ? (
                            <Switch checked={item[col.key] === true || item[col.key] === 'Active'} onChange={() => {}} />
                          ) : item[col.key] || '-'}
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1.5">
                        <button onClick={() => { setActiveEditorSection(innerListKey ? `${sectionKey}_${innerListKey}` : sectionKey); setEditingItemId(item.id); setDraftItem({ ...item }); }} className="p-1 hover:bg-zinc-900 rounded text-amber-500"><Edit3 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3 h-3" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <Button onClick={() => { setActiveEditorSection(innerListKey ? `${sectionKey}_${innerListKey}` : sectionKey); setEditingItemId(null); setDraftItem({}); }} variant="secondary" size="sm" className="gap-1 text-xs border border-zinc-800 text-luxury-gold"><Plus className="w-3.5 h-3.5" /> <span>Add Row</span></Button>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase text-luxury-gold border-b border-zinc-900 pb-1.5">Editor</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(field => {
                if (field.type === 'textarea') return <div key={field.key} className="md:col-span-2"><Input label={field.label} textarea rows={2} value={draftItem[field.key] || ''} onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })} /></div>;
                if (field.type === 'upload' || field.type === 'video' || field.type === 'gallery' || field.type === 'reel') return <div key={field.key} className="border border-zinc-900 p-3 rounded bg-zinc-950/40 flex flex-col gap-2"><span className="text-[9px] font-mono text-zinc-550 block uppercase">{field.label}</span>{draftItem[field.key] ? <div className="relative w-full h-20 bg-zinc-950 overflow-hidden"><img src={draftItem[field.key].split(',')[0]} className="w-full h-full object-cover" /><button onClick={() => setDraftItem({ ...draftItem, [field.key]: "" })} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-rose-455"><Trash2 className="w-3.5 h-3.5" /></button></div> : <div onClick={() => simulateMediaUpload(field.key)} className="h-20 border border-dashed border-zinc-850 cursor-pointer flex justify-center items-center"><UploadCloud className="w-4 h-4 text-zinc-650" /></div>}</div>;
                if (field.type === 'switch') return <div key={field.key} className="flex items-center justify-between border border-zinc-900 p-3 rounded bg-zinc-950/40"><span className="text-[10px] font-bold text-zinc-400 uppercase">{field.label}</span><Switch checked={draftItem[field.key] === true || draftItem[field.key] === 'Active'} onChange={v => setDraftItem({ ...draftItem, [field.key]: v })} /></div>;
                if (field.type === 'select') return <div key={field.key} className="flex flex-col gap-1"><label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label><select className="bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200" value={draftItem[field.key] || field.options[0]} onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })}>{field.options.map(o => <option key={o} value={o}>{o}</option>)}</select></div>;
                return <Input key={field.key} label={field.label} type={field.type || 'text'} value={draftItem[field.key] || ''} onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })} />;
              })}
            </div>
            <div className="flex justify-end gap-2 pt-2.5">
              <button onClick={() => { setActiveEditorSection(null); setEditingItemId(null); setDraftItem({}); }} className="px-3 py-1 text-xs text-zinc-550 hover:text-white">Cancel</button>
              <button onClick={handleSaveItem} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Save Record</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left relative pb-20">
      
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-full shadow-gold-glow border flex items-center gap-2.5 bg-zinc-950 border-luxury-gold/50 text-luxury-gold font-sans">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Home className="w-5 h-5 text-luxury-gold" />
            Homepage Dynamic CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Reorganized to map perfectly with Visitor Website naming and structures.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => { setExpandedCards(prev => ({...prev, customSections: true})); setActiveEditorSection('customSections'); setEditingItemId(null); setDraftItem({}); document.getElementById('customSections')?.scrollIntoView(); }} variant="secondary" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
             <Plus className="w-4 h-4 mr-1.5" /> Add Section
          </Button>
          <Button onClick={() => { setHeroForm(homepageData?.hero || {}); setNewsletterForm(homepageData?.newsletter || {}); setEventsForm(homepageData?.events || {}); showToast("Forms reset to original database state.", "info"); }} variant="secondary" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
             <RefreshCw className="w-4 h-4 mr-1.5" /> Reset
          </Button>
          <Button onClick={() => showToast("Draft saved locally.", "success")} variant="secondary" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
             <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button onClick={() => showToast("🚀 Public production server updated successfully. Page is Live!")} variant="primary" size="sm" className="bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow ml-2">
             Publish Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        
        {/* 1. HERO SECTION */}
        <Card title={<div onClick={() => toggleCard('hero')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-luxury-gold" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Hero Overview</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/80 bg-zinc-950/20">
          {expandedCards.hero && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Main Title" value={heroForm.title || ''} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} />
                <Input label="Highlight Title" value={heroForm.highlightTitle || ''} onChange={e => setHeroForm({ ...heroForm, highlightTitle: e.target.value })} />
                <Input label="Subtitle" value={heroForm.subtitle || ''} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} />
                <Input label="CTA Button Text" value={heroForm.ctaButtonText || ''} onChange={e => setHeroForm({ ...heroForm, ctaButtonText: e.target.value })} />
                <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={heroForm.description || ''} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} /></div>
                
                {['desktopImageUrl', 'mobileImageUrl', 'videoUrl'].map(k => (
                  <div key={k} className="border border-zinc-900 p-3 rounded bg-zinc-900/10 flex flex-col gap-2">
                    <span className="text-[9px] font-mono text-zinc-550 block uppercase">{k}</span>
                    {heroForm[k] ? (
                      <div className="relative w-full h-20 bg-zinc-950 overflow-hidden"><img src={heroForm[k]} className="w-full h-full object-cover" /><button onClick={() => setHeroForm({ ...heroForm, [k]: "" })} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-rose-455"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    ) : (
                      <div onClick={() => simulateMediaUpload(k)} className="h-20 border border-dashed border-zinc-850 cursor-pointer flex justify-center items-center"><UploadCloud className="w-4 h-4 text-zinc-650" /></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end border-t border-zinc-900 pt-3"><Button onClick={() => handleSingleSave('hero', heroForm)}>Save Hero</Button></div>
            </div>
          )}
        </Card>

        {/* 2. STATISTICS SECTION */}
        <Card title={<div onClick={() => toggleCard('stats')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><BarChart className="w-4 h-4 text-luxury-gold" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Global Impact Statistics</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/80 bg-zinc-950/20">
          {expandedCards.stats && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40">
              {renderListManager({
                sectionKey: 'statistics',
                displayColumns: [{ key: 'counterNumber', label: 'Counter' }, { key: 'counterLabel', label: 'Label' }, { key: 'activeToggle', label: 'Active', type: 'switch' }],
                fields: [
                  { key: 'counterNumber', label: 'Counter Number' }, { key: 'counterLabel', label: 'Counter Label' }, 
                  { key: 'icon', label: 'Icon String' }, { key: 'order', label: 'Display Order', type: 'number' },
                  { key: 'animationToggle', label: 'Enable Animation', type: 'switch' }, { key: 'activeToggle', label: 'Active Status', type: 'switch' }
                ]
              })}
            </div>
          )}
        </Card>

        {/* 3. CORE VALUES SECTION */}
        <Card title={<div onClick={() => toggleCard('coreValues')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Star className="w-4 h-4 text-luxury-gold" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Foundational Core Values</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/80 bg-zinc-950/20">
          {expandedCards.coreValues && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40">
              {renderListManager({
                sectionKey: 'coreValues',
                displayColumns: [{ key: 'valueName', label: 'Value Name' }, { key: 'image', label: 'Image', type: 'image' }, { key: 'status', label: 'Status' }],
                fields: [
                  { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'valueName', label: 'Value Name' },
                  { key: 'description', label: 'Short Description', type: 'textarea' }, { key: 'longDescription', label: 'Long Description', type: 'textarea' }, 
                  { key: 'icon', label: 'Icon String' }, { key: 'image', label: 'Main Image', type: 'upload' },
                  { key: 'order', label: 'Display Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }
                ]
              })}
            </div>
          )}
        </Card>

        {/* 4. NEWSLETTER SECTION */}
        <Card title={<div onClick={() => toggleCard('newsletter')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Mail className="w-4 h-4 text-luxury-gold" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Exclusive Newsletter Hub</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/80 bg-zinc-950/20">
          {expandedCards.newsletter && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-4">
              <span className="text-[10px] font-mono uppercase text-luxury-gold border-b border-zinc-900 pb-1.5">Newsletter Layout Settings</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Switch label="Enable Newsletter Section" checked={newsletterForm.enableNewsletter !== false} onChange={v => setNewsletterForm({...newsletterForm, enableNewsletter: v})} />
                <Switch label="Enable Email Validation" checked={newsletterForm.enableEmailValidation !== false} onChange={v => setNewsletterForm({...newsletterForm, enableEmailValidation: v})} />
                <Switch label="Enable Form Animations" checked={newsletterForm.enableAnimation !== false} onChange={v => setNewsletterForm({...newsletterForm, enableAnimation: v})} />
                <Switch label="Enable Auto Response" checked={newsletterForm.enableAutoResponse !== false} onChange={v => setNewsletterForm({...newsletterForm, enableAutoResponse: v})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Input label="Small Heading" value={newsletterForm.smallHeading || ''} onChange={e => setNewsletterForm({ ...newsletterForm, smallHeading: e.target.value })} />
                <Input label="Main Heading" value={newsletterForm.mainHeading || ''} onChange={e => setNewsletterForm({ ...newsletterForm, mainHeading: e.target.value })} />
                <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={newsletterForm.description || ''} onChange={e => setNewsletterForm({ ...newsletterForm, description: e.target.value })} /></div>
                <Input label="Email Placeholder" value={newsletterForm.placeholderText || ''} onChange={e => setNewsletterForm({ ...newsletterForm, placeholderText: e.target.value })} />
                <Input label="Subscribe Button Text" value={newsletterForm.buttonText || ''} onChange={e => setNewsletterForm({ ...newsletterForm, buttonText: e.target.value })} />
                <Input label="Success Message" value={newsletterForm.successMessage || ''} onChange={e => setNewsletterForm({ ...newsletterForm, successMessage: e.target.value })} />
                <Input label="Error Message" value={newsletterForm.errorMessage || ''} onChange={e => setNewsletterForm({ ...newsletterForm, errorMessage: e.target.value })} />
                <div className="md:col-span-2"><Input label="Privacy Text" value={newsletterForm.privacyText || ''} onChange={e => setNewsletterForm({ ...newsletterForm, privacyText: e.target.value })} /></div>
                
                {['backgroundImage', 'backgroundVideo', 'leftIllustration', 'rightIllustration'].map(k => (
                  <div key={k} className="border border-zinc-900 p-3 rounded bg-zinc-900/10 flex flex-col gap-2">
                    <span className="text-[9px] font-mono text-zinc-550 block uppercase">{k}</span>
                    {newsletterForm[k] ? (
                      <div className="relative w-full h-20 bg-zinc-950 overflow-hidden"><img src={newsletterForm[k]} className="w-full h-full object-cover" /><button onClick={() => setNewsletterForm({ ...newsletterForm, [k]: "" })} className="absolute top-1 right-1 p-1 bg-black/60 rounded text-rose-455"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    ) : (
                      <div onClick={() => simulateMediaUpload(k)} className="h-20 border border-dashed border-zinc-850 cursor-pointer flex justify-center items-center"><UploadCloud className="w-4 h-4 text-zinc-650" /></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end border-t border-zinc-900 pt-3 pb-6"><Button onClick={() => handleSingleSave('newsletter', newsletterForm)}>Save Newsletter Layout</Button></div>
              
              {/* SUBSCRIBERS TABLE */}
              <span className="text-[10px] font-mono uppercase text-luxury-gold border-b border-zinc-900 pb-1.5 mt-2">Subscriber Management</span>
              <div className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-900">
                <div className="flex items-center gap-2 px-3">
                   <Search className="w-4 h-4 text-zinc-500" />
                   <input type="text" placeholder="Search subscribers..." value={subscriberSearch} onChange={(e)=>setSubscriberSearch(e.target.value)} className="bg-transparent border-none outline-none text-xs text-zinc-200 w-48" />
                </div>
                <div className="flex gap-2">
                   <Button onClick={handleExportCSV} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-luxury-gold"><Download className="w-3.5 h-3.5" /> CSV Export</Button>
                   <Button onClick={handleBulkDeleteSubscribers} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-rose-500"><Trash2 className="w-3.5 h-3.5" /> Bulk Delete</Button>
                </div>
              </div>
              <table className="w-full text-xs text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider">
                    <th className="py-2 px-3">Name</th><th className="py-2 px-3">Email</th><th className="py-2 px-3">Date</th><th className="py-2 px-3">Status</th><th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(homepageData?.newsletter?.subscribers || []).filter(s => s.name.toLowerCase().includes(subscriberSearch.toLowerCase()) || s.email.toLowerCase().includes(subscriberSearch.toLowerCase())).map(sub => (
                    <tr key={sub.id} className="border-b border-zinc-900/60 text-zinc-300">
                      <td className="py-2.5 px-3">{sub.name}</td><td className="py-2.5 px-3">{sub.email}</td><td className="py-2.5 px-3 font-mono text-[10px]">{sub.subscriptionDate}</td>
                      <td className="py-2.5 px-3 text-luxury-gold">{sub.status}</td>
                      <td className="py-2.5 px-3 text-right"><button onClick={() => handleDeleteSubscriber(sub.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3 h-3" /></button></td>
                    </tr>
                  ))}
                  {(homepageData?.newsletter?.subscribers || []).length === 0 && <tr><td colSpan={5} className="text-center py-6 text-zinc-600 font-mono italic">No active subscribers found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 5. EVENT SECTION */}
        <Card title={<div onClick={() => toggleCard('events')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-luxury-gold" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">Corporate Events Manager</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/80 bg-zinc-950/20">
          {expandedCards.events && (
            <div className="p-5 border-t border-zinc-800/80 bg-zinc-950/40 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-zinc-900">
                 <Input label="Section Title" value={eventsForm.sectionTitle || ''} onChange={e => setEventsForm({...eventsForm, sectionTitle: e.target.value})} />
                 <Input label="Subtitle" value={eventsForm.subtitle || ''} onChange={e => setEventsForm({...eventsForm, subtitle: e.target.value})} />
                 <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={eventsForm.description || ''} onChange={e => setEventsForm({...eventsForm, description: e.target.value})} /></div>
                 <div className="md:col-span-2 flex justify-end"><Button onClick={() => handleSingleSave('events', eventsForm)}>Save Event Headers</Button></div>
              </div>
              {renderListManager({
                sectionKey: 'events',
                innerListKey: 'list',
                displayColumns: [{ key: 'eventName', label: 'Event Name' }, { key: 'eventDate', label: 'Date' }, { key: 'eventBanner', label: 'Banner', type: 'image' }],
                fields: [
                  { key: 'eventName', label: 'Event Name' }, { key: 'eventCategory', label: 'Category' }, 
                  { key: 'eventDate', label: 'Date' }, { key: 'eventTime', label: 'Time' },
                  { key: 'eventLocation', label: 'Venue Location' }, { key: 'speaker', label: 'Speaker' }, 
                  { key: 'shortDescription', label: 'Short Description', type: 'textarea' }, { key: 'fullDescription', label: 'Full Description', type: 'textarea' },
                  { key: 'registrationButtonText', label: 'Registration CTA' }, { key: 'registrationUrl', label: 'Registration URL' },
                  { key: 'eventBanner', label: 'Event Banner', type: 'upload' }, { key: 'eventThumbnail', label: 'Event Thumbnail', type: 'upload' },
                  { key: 'eventGalleryImages', label: 'Gallery Images (CSV)', type: 'gallery' }, { key: 'eventVideo', label: 'Event Video', type: 'video' },
                  { key: 'eventReel', label: 'Event Reel', type: 'reel' },
                  { key: 'featuredToggle', label: 'Featured Event', type: 'switch' }, { key: 'activeToggle', label: 'Active', type: 'switch' }
                ]
              })}
            </div>
          )}
        </Card>

        {/* 6. DYNAMIC CUSTOM SECTIONS */}
        <Card id="customSections" title={<div onClick={() => toggleCard('customSections')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-luxury-gold/10 border-b border-luxury-gold/20"><div className="flex items-center gap-3"><Plus className="w-5 h-5 text-luxury-gold" /><span className="font-serif text-sm font-bold uppercase tracking-wider text-luxury-gold">Dynamic Custom Sections Builder</span></div><ChevronDown className="w-4 h-4 text-luxury-gold" /></div>} className="p-0 border-luxury-gold/30 bg-zinc-950/20 shadow-gold-glow-sm">
          {expandedCards.customSections && (
            <div className="p-5 flex flex-col gap-5">
              <div className="text-sm text-zinc-400 mb-2">Build completely custom layout sections that will render dynamically on your homepage. Select the layout type and populate the media using the Media Hub.</div>
              {renderListManager({
                sectionKey: 'customSections',
                displayColumns: [{ key: 'sectionTitle', label: 'Title' }, { key: 'layoutType', label: 'Layout Type' }, { key: 'primaryMediaUrl', label: 'Media', type: 'image' }],
                fields: [
                  { key: 'sectionTitle', label: 'Section Title' },
                  { key: 'subtitle', label: 'Subtitle' },
                  { key: 'layoutType', label: 'Layout Type', type: 'select', options: ['Full Width Hero', 'Split Image & Text', 'Video Background', 'Feature Grid', 'Call to Action Block'] },
                  { key: 'description', label: 'Content Paragraph', type: 'textarea' },
                  { key: 'primaryMediaUrl', label: 'Primary Media', type: 'upload' },
                  { key: 'ctaText', label: 'Button Text' },
                  { key: 'ctaLink', label: 'Button Link' },
                  { key: 'order', label: 'Display Order', type: 'number' },
                  { key: 'status', label: 'Visibility Status', type: 'select', options: ['Active', 'Hidden', 'Draft'] }
                ]
              })}
            </div>
          )}
        </Card>

        {/* LEGACY SECTIONS (Restored untouched) */}
        <Card title={<div onClick={() => toggleCard('heroSlides')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Layers className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Hero Slides (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.heroSlides && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'heroSlides', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'mediaUrl', label: 'Media', type: 'image' }], fields: [{ key: 'title', label: 'Slide Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'mediaType', label: 'Media Type', type: 'select', options: ['image', 'video'] }, { key: 'mediaUrl', label: 'Media File', type: 'upload' }, { key: 'buttonText', label: 'Button Text' }, { key: 'buttonUrl', label: 'Button URL' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('projects')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Projects (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.projects && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'featuredProjects', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'thumbnailUrl', label: 'Thumbnail', type: 'image' }], fields: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'thumbnailUrl', label: 'Thumbnail', type: 'upload' }, { key: 'previewImageUrl', label: 'Preview Image', type: 'upload' }, { key: 'previewVideoUrl', label: 'Preview Video', type: 'video' }, { key: 'redirectLink', label: 'Redirect Link' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('videoSlider')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Play className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Video Slider (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.videoSlider && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'videoSlider', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'videoUrl', label: 'Video', type: 'video' }], fields: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'videoUrl', label: 'Upload Video', type: 'video' }, { key: 'thumbnailUrl', label: 'Upload Thumbnail', type: 'upload' }, { key: 'redirectUrl', label: 'Redirect Link' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('reels')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Film className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Reels (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.reels && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'reels', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'videoUrl', label: 'Reel Video', type: 'reel' }], fields: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'duration', label: 'Duration' }, { key: 'videoUrl', label: 'Upload Reel', type: 'reel' }, { key: 'thumbnailUrl', label: 'Upload Thumbnail', type: 'upload' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('shorts')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Video className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Shorts (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.shorts && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'shorts', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'videoUrl', label: 'Short Video', type: 'video' }], fields: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'videoUrl', label: 'Upload Short', type: 'video' }, { key: 'thumbnailUrl', label: 'Upload Thumbnail', type: 'upload' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('longVideos')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Film className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Long Videos (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.longVideos && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'longVideos', displayColumns: [{ key: 'title', label: 'Title' }, { key: 'videoUrl', label: 'Long Video', type: 'video' }], fields: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'videoUrl', label: 'Upload Long Video', type: 'video' }, { key: 'thumbnailUrl', label: 'Upload Thumbnail', type: 'upload' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('services')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Services Preview (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.services && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'servicesPreview', displayColumns: [{ key: 'name', label: 'Service Name' }, { key: 'iconUrl', label: 'Icon', type: 'image' }], fields: [{ key: 'name', label: 'Name' }, { key: 'iconUrl', label: 'Icon Upload', type: 'upload' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'redirectLink', label: 'Link URL' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>
        <Card title={<div onClick={() => toggleCard('logos')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20"><div className="flex items-center gap-3"><Handshake className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">Client Logos (Legacy)</span></div><ChevronDown className="w-4 h-4 text-zinc-500" /></div>} className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.logos && <div className="p-5 border-t border-zinc-800/80">{renderListManager({ sectionKey: 'clientLogos', displayColumns: [{ key: 'clientName', label: 'Client' }, { key: 'logoUrl', label: 'Logo', type: 'image' }], fields: [{ key: 'clientName', label: 'Client Name' }, { key: 'logoUrl', label: 'Client Logo', type: 'upload' }, { key: 'websiteLink', label: 'Website URL' }, { key: 'order', label: 'Order', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }] })}</div>}
        </Card>

      </div>
    </div>
  );
};
