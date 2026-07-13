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
  PhoneCall, Settings, Edit2, Trash2, CheckCircle, Search, 
  MapPin, Mail, Phone, LayoutTemplate, Layers, Database, MessageSquare, Plus, GripVertical
} from 'lucide-react';

export const Contact = () => {
  const { db, addItem, updateItem, deleteItem, updateSection } = useDatabase();
  
  // Settings Data
  const contactHeroSetup = db.contactHeroSetup || {};
  const contactInfoSetup = db.contactInfoSetup || {};
  const contactWhatsAppSetup = db.contactWhatsAppSetup || {};
  const contactMapSetupData = db.contactMapSetupData || {};
  const contactFormConfig = db.contactFormConfig || {};
  const contactSEOSetup = db.contactSEOSetup || {};
  const contactVisibilitySetup = db.contactVisibilitySetup || {};
  
  // Lists Data
  const contactFormFields = db.contactFormFields || [];
  const contactCategoriesSetup = db.contactCategoriesSetup || [];
  const contactSocialLinksSetup = db.contactSocialLinksSetup || [];
  const enquiries = db.enquiries || [];

  // Tab State
  const [activeTab, setActiveTab] = useState('settings'); // settings, form, socials, submissions

  // Local Drafts
  const [heroDraft, setHeroDraft] = useState(contactHeroSetup);
  const [infoDraft, setInfoDraft] = useState(contactInfoSetup);
  const [waDraft, setWaDraft] = useState(contactWhatsAppSetup);
  const [mapDraft, setMapDraft] = useState(contactMapSetupData);
  const [formDraft, setFormDraft] = useState(contactFormConfig);
  const [seoDraft, setSeoDraft] = useState(contactSEOSetup);
  const [visDraft, setVisDraft] = useState(contactVisibilitySetup);

  // Modals & States
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldForm, setFieldForm] = useState({});

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({});

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({});

  const [viewingSub, setViewingSub] = useState(null);

  // Deletion
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Sync effect for Drafts when DB changes
  useEffect(() => {
    setHeroDraft(db.contactHeroSetup || {});
    setInfoDraft(db.contactInfoSetup || {});
    setWaDraft(db.contactWhatsAppSetup || {});
    setMapDraft(db.contactMapSetupData || {});
    setFormDraft(db.contactFormConfig || {});
    setSeoDraft(db.contactSEOSetup || {});
    setVisDraft(db.contactVisibilitySetup || {});
  }, [db]);

  // --- Handlers ---
  const handleSaveSettings = (section, draft, msg) => {
    updateSection(section, null, draft);
    showToast(msg);
  };

  const handleOpenForm = (type, item = null) => {
    if (type === 'field') {
      setEditingField(item);
      setFieldForm(item || { label: '', placeholder: '', order: contactFormFields.length + 1, required: true, enable: true });
      setIsFieldModalOpen(true);
    } else if (type === 'cat') {
      setEditingCat(item);
      setCatForm(item || { name: '', value: '', status: true });
      setIsCatModalOpen(true);
    } else if (type === 'social') {
      setEditingSocial(item);
      setSocialForm(item || { platform: '', handle: '', url: '', icon: 'instagram', order: contactSocialLinksSetup.length + 1, status: true, newTab: true });
      setIsSocialModalOpen(true);
    }
  };

  const handleSaveList = (e, type) => {
    e.preventDefault();
    if (type === 'field') {
      const list = db.contactFormFields || [];
      if (editingField) updateSection('contactFormFields', null, list.map(i => i.id === editingField.id ? { ...fieldForm, id: i.id } : i));
      else updateSection('contactFormFields', null, [...list, { ...fieldForm, id: `cff-${Date.now()}` }]);
      setIsFieldModalOpen(false); showToast('Field Saved');
    } else if (type === 'cat') {
      const list = db.contactCategoriesSetup || [];
      if (editingCat) updateSection('contactCategoriesSetup', null, list.map(i => i.id === editingCat.id ? { ...catForm, id: i.id } : i));
      else updateSection('contactCategoriesSetup', null, [...list, { ...catForm, id: `cc-${Date.now()}` }]);
      setIsCatModalOpen(false); showToast('Category Saved');
    } else if (type === 'social') {
      const list = db.contactSocialLinksSetup || [];
      if (editingSocial) updateSection('contactSocialLinksSetup', null, list.map(i => i.id === editingSocial.id ? { ...socialForm, id: i.id } : i));
      else updateSection('contactSocialLinksSetup', null, [...list, { ...socialForm, id: `csl-${Date.now()}` }]);
      setIsSocialModalOpen(false); showToast('Social Link Saved');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'field') {
      updateSection('contactFormFields', null, (db.contactFormFields || []).filter(i => i.id !== deleteId));
    } else if (deleteType === 'cat') {
      updateSection('contactCategoriesSetup', null, (db.contactCategoriesSetup || []).filter(i => i.id !== deleteId));
    } else if (deleteType === 'social') {
      updateSection('contactSocialLinksSetup', null, (db.contactSocialLinksSetup || []).filter(i => i.id !== deleteId));
    } else if (deleteType === 'submission') {
      deleteItem('enquiries', deleteId);
      if (viewingSub?.id === deleteId) setViewingSub(null);
    }
    setDeleteId(null); setDeleteType(null); showToast('Item Deleted');
  };
  
  const handleTestWhatsApp = () => {
    if (waDraft.number) window.open(`https://wa.me/${waDraft.number.replace(/\s+/g, '')}`, '_blank');
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Helper for icons
  const renderIcon = (iconStr) => {
    switch(iconStr) {
      case 'instagram': return <div className="w-4 h-4 rounded border border-current flex items-center justify-center text-[8px] font-bold">IG</div>;
      case 'linkedin': return <div className="w-4 h-4 rounded border border-current flex items-center justify-center text-[8px] font-bold">in</div>;
      case 'youtube': return <div className="w-4 h-4 rounded border border-current flex items-center justify-center text-[8px] font-bold">YT</div>;
      case 'mail': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'map-pin': return <MapPin className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

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
          <PhoneCall className="w-7 h-7 text-luxury-gold" /> Contact Page CMS
        </h1>
        <p className="text-sm text-zinc-500 mt-2">Fully dynamic management module for the Visitor Contact Page.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 pb-4 border-b border-zinc-800/50">
        {[
          { id: 'settings', label: 'General Settings' },
          { id: 'form', label: 'Form Builder' },
          { id: 'socials', label: 'Social Media Links' },
          { id: 'submissions', label: 'Submissions Inbox' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeTab === tab.id ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        
        {/* LEFT COLUMN: Operations */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          
          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              
              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="1. Visibility Controls">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <Switch label="Hero Section" checked={visDraft.hero !== false} onChange={v => setVisDraft(p => ({...p, hero: v}))} />
                  <Switch label="Contact Info" checked={visDraft.info !== false} onChange={v => setVisDraft(p => ({...p, info: v}))} />
                  <Switch label="WhatsApp Box" checked={visDraft.whatsapp !== false} onChange={v => setVisDraft(p => ({...p, whatsapp: v}))} />
                  <Switch label="Google Map" checked={visDraft.map !== false} onChange={v => setVisDraft(p => ({...p, map: v}))} />
                  <Switch label="Contact Form" checked={visDraft.form !== false} onChange={v => setVisDraft(p => ({...p, form: v}))} />
                  <Switch label="Social Links" checked={visDraft.social !== false} onChange={v => setVisDraft(p => ({...p, social: v}))} />
                </div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactVisibilitySetup', visDraft, 'Visibility Saved')}>Save Visibility</Button></div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="2. Hero Settings">
                <div className="flex flex-col gap-4 mt-4">
                  <Switch label="Enable Hero" checked={heroDraft.enable !== false} onChange={v => setHeroDraft(p => ({...p, enable: v}))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Small Label" value={heroDraft.label || ''} onChange={e => setHeroDraft(p => ({...p, label: e.target.value}))} />
                    <Input label="Main Heading Line 1" value={heroDraft.mainLine1 || ''} onChange={e => setHeroDraft(p => ({...p, mainLine1: e.target.value}))} />
                  </div>
                  <Input label="Highlight Heading" value={heroDraft.highlight || ''} onChange={e => setHeroDraft(p => ({...p, highlight: e.target.value}))} />
                  <Input label="Hero Description" textarea rows={3} value={heroDraft.description || ''} onChange={e => setHeroDraft(p => ({...p, description: e.target.value}))} />
                  <Switch label="Background Glow Enable" checked={heroDraft.glowEnable !== false} onChange={v => setHeroDraft(p => ({...p, glowEnable: v}))} />
                </div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactHeroSetup', heroDraft, 'Hero Saved')}>Save Hero</Button></div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="3. Contact Information">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="border border-zinc-800 p-4 rounded bg-zinc-900/30">
                    <Switch label="Enable Email" checked={infoDraft.enableEmail !== false} onChange={v => setInfoDraft(p => ({...p, enableEmail: v}))} />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Input label="Email Address" value={infoDraft.email || ''} onChange={e => setInfoDraft(p => ({...p, email: e.target.value}))} />
                      <Input label="Icon Picker" value={infoDraft.emailIcon || ''} onChange={e => setInfoDraft(p => ({...p, emailIcon: e.target.value}))} />
                    </div>
                  </div>
                  <div className="border border-zinc-800 p-4 rounded bg-zinc-900/30">
                    <Switch label="Enable Telephone" checked={infoDraft.enablePhone !== false} onChange={v => setInfoDraft(p => ({...p, enablePhone: v}))} />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Input label="Phone Number" value={infoDraft.phone || ''} onChange={e => setInfoDraft(p => ({...p, phone: e.target.value}))} />
                      <Input label="Icon Picker" value={infoDraft.phoneIcon || ''} onChange={e => setInfoDraft(p => ({...p, phoneIcon: e.target.value}))} />
                    </div>
                  </div>
                  <div className="border border-zinc-800 p-4 rounded bg-zinc-900/30">
                    <Switch label="Enable Location" checked={infoDraft.enableLocation !== false} onChange={v => setInfoDraft(p => ({...p, enableLocation: v}))} />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Input label="Location Title" value={infoDraft.locationTitle || ''} onChange={e => setInfoDraft(p => ({...p, locationTitle: e.target.value}))} />
                      <Input label="Icon Picker" value={infoDraft.locationIcon || ''} onChange={e => setInfoDraft(p => ({...p, locationIcon: e.target.value}))} />
                    </div>
                    <Input label="Full Address" className="mt-4" value={infoDraft.address || ''} onChange={e => setInfoDraft(p => ({...p, address: e.target.value}))} />
                  </div>
                </div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactInfoSetup', infoDraft, 'Contact Info Saved')}>Save Info</Button></div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="4. WhatsApp Settings">
                <div className="flex flex-col gap-4 mt-4">
                  <Switch label="Enable WhatsApp" checked={waDraft.enable !== false} onChange={v => setWaDraft(p => ({...p, enable: v}))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="WhatsApp Number (Digits only)" value={waDraft.number || ''} onChange={e => setWaDraft(p => ({...p, number: e.target.value}))} />
                    <Input label="Button Text" value={waDraft.buttonText || ''} onChange={e => setWaDraft(p => ({...p, buttonText: e.target.value}))} />
                  </div>
                  <Input label="Short Description" value={waDraft.description || ''} onChange={e => setWaDraft(p => ({...p, description: e.target.value}))} />
                  <Switch label="Open in New Tab" checked={waDraft.openNewTab !== false} onChange={v => setWaDraft(p => ({...p, openNewTab: v}))} />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="secondary" onClick={handleTestWhatsApp}>Test WhatsApp</Button>
                  <Button onClick={() => handleSaveSettings('contactWhatsAppSetup', waDraft, 'WhatsApp Saved')}>Save WhatsApp</Button>
                </div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="5. Google Map Settings">
                <div className="flex flex-col gap-4 mt-4">
                  <Switch label="Enable Map" checked={mapDraft.enable !== false} onChange={v => setMapDraft(p => ({...p, enable: v}))} />
                  <Input label="Google Maps Embed URL" value={mapDraft.url || ''} onChange={e => setMapDraft(p => ({...p, url: e.target.value}))} />
                  <Input label="Map Height (px)" value={mapDraft.height || ''} onChange={e => setMapDraft(p => ({...p, height: e.target.value}))} />
                  <div className="flex gap-4">
                    <Switch label="Rounded Corners" checked={mapDraft.rounded !== false} onChange={v => setMapDraft(p => ({...p, rounded: v}))} />
                    <Switch label="Dark Mode Filter" checked={mapDraft.darkMode !== false} onChange={v => setMapDraft(p => ({...p, darkMode: v}))} />
                  </div>
                </div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactMapSetupData', mapDraft, 'Map Saved')}>Save Map</Button></div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="6. SEO Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input label="Meta Title" value={seoDraft.title || ''} onChange={e => setSeoDraft(p => ({...p, title: e.target.value}))} />
                  <Input label="Canonical URL" value={seoDraft.canonical || ''} onChange={e => setSeoDraft(p => ({...p, canonical: e.target.value}))} />
                </div>
                <div className="mt-4"><Input label="Meta Description" textarea rows={2} value={seoDraft.description || ''} onChange={e => setSeoDraft(p => ({...p, description: e.target.value}))} /></div>
                <div className="mt-4"><Input label="Meta Keywords" value={seoDraft.keywords || ''} onChange={e => setSeoDraft(p => ({...p, keywords: e.target.value}))} /></div>
                <div className="mt-4"><Switch label="Enable Indexing" checked={seoDraft.indexing !== false} onChange={v => setSeoDraft(p => ({...p, indexing: v}))} /></div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactSEOSetup', seoDraft, 'SEO Saved')}>Save SEO</Button></div>
              </Card>

            </motion.div>
          )}

          {/* TAB: FORM BUILDER */}
          {activeTab === 'form' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              
              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="Business Inquiry Form Configuration">
                <div className="flex flex-col gap-4 mt-4">
                  <Switch label="Enable Form" checked={formDraft.enable !== false} onChange={v => setFormDraft(p => ({...p, enable: v}))} />
                  <Input label="Form Title" value={formDraft.title || ''} onChange={e => setFormDraft(p => ({...p, title: e.target.value}))} />
                  <Input label="Button Text" value={formDraft.buttonText || ''} onChange={e => setFormDraft(p => ({...p, buttonText: e.target.value}))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Success Title" value={formDraft.successTitle || ''} onChange={e => setFormDraft(p => ({...p, successTitle: e.target.value}))} />
                    <Input label="Success Description" value={formDraft.successDesc || ''} onChange={e => setFormDraft(p => ({...p, successDesc: e.target.value}))} />
                  </div>
                  <Switch label="Receive Submission Email" checked={formDraft.receiveEmail !== false} onChange={v => setFormDraft(p => ({...p, receiveEmail: v}))} />
                </div>
                <div className="flex justify-end mt-4"><Button onClick={() => handleSaveSettings('contactFormConfig', formDraft, 'Form Config Saved')}>Save Form Config</Button></div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="Dynamic Form Fields">
                <div className="flex justify-end mb-4"><Button size="sm" onClick={() => handleOpenForm('field')}><Plus className="w-4 h-4 mr-1"/> Add Field</Button></div>
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider">
                      <tr><th className="p-3 w-10">Order</th><th className="p-3">Label & Placeholder</th><th className="p-3">Settings</th><th className="p-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {contactFormFields.sort((a,b) => (a.order||0)-(b.order||0)).map(f => (
                        <tr key={f.id} className="hover:bg-zinc-900/30">
                          <td className="p-3 text-zinc-500"><GripVertical className="w-3 h-3 inline mr-1"/> {f.order}</td>
                          <td className="p-3"><p className="font-semibold text-zinc-200">{f.label}</p><span className="text-[10px] text-zinc-500">{f.placeholder}</span></td>
                          <td className="p-3 flex gap-2">
                            {f.required && <Badge variant="gold" className="text-[9px]">Required</Badge>}
                            {f.enable === false && <Badge variant="default" className="text-[9px]">Disabled</Badge>}
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleOpenForm('field', f)} className="text-zinc-400 hover:text-luxury-gold p-1"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => { setDeleteId(f.id); setDeleteType('field'); }} className="text-rose-500 hover:text-rose-400 p-1 ml-2"><Trash2 className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="Inquiry Categories">
                <div className="flex justify-end mb-4"><Button size="sm" onClick={() => handleOpenForm('cat')}><Plus className="w-4 h-4 mr-1"/> Add Category</Button></div>
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider">
                      <tr><th className="p-3">Name</th><th className="p-3">Value</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {contactCategoriesSetup.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-900/30">
                          <td className="p-3 font-semibold text-zinc-200">{c.name}</td>
                          <td className="p-3 text-zinc-500 font-mono">{c.value}</td>
                          <td className="p-3"><Badge variant={c.status !== false ? 'success' : 'default'}>{c.status !== false ? 'Active' : 'Disabled'}</Badge></td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleOpenForm('cat', c)} className="text-zinc-400 hover:text-luxury-gold p-1"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => { setDeleteId(c.id); setDeleteType('cat'); }} className="text-rose-500 hover:text-rose-400 p-1 ml-2"><Trash2 className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </motion.div>
          )}

          {/* TAB: SOCIALS */}
          {activeTab === 'socials' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="Social Media Management">
                <div className="flex justify-end mb-4"><Button size="sm" onClick={() => handleOpenForm('social')}><Plus className="w-4 h-4 mr-1"/> Add Link</Button></div>
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider">
                      <tr><th className="p-3 w-10">Order</th><th className="p-3">Platform</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {contactSocialLinksSetup.sort((a,b) => (a.order||0)-(b.order||0)).map(s => (
                        <tr key={s.id} className="hover:bg-zinc-900/30">
                          <td className="p-3 text-zinc-500"><GripVertical className="w-3 h-3 inline mr-1"/> {s.order}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {renderIcon(s.icon)}
                              <div className="flex flex-col">
                                <span className="font-semibold text-zinc-200">{s.platform}</span>
                                <span className="text-[10px] text-luxury-gold">{s.handle}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3"><Badge variant={s.status !== false ? 'success' : 'default'}>{s.status !== false ? 'Active' : 'Disabled'}</Badge></td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleOpenForm('social', s)} className="text-zinc-400 hover:text-luxury-gold p-1"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => { setDeleteId(s.id); setDeleteType('social'); }} className="text-rose-500 hover:text-rose-400 p-1 ml-2"><Trash2 className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB: SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                   <input type="text" placeholder="Search sender or message..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900/60 border border-zinc-800 rounded pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none" />
                 </div>
              </div>

              <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider">
                    <tr><th className="p-3">Name / Email</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {enquiries.filter(e => e.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) || e.email?.toLowerCase().includes(searchTerm.toLowerCase())).map(sub => (
                      <tr key={sub.id} className="hover:bg-zinc-900/30">
                        <td className="p-3">
                          <p className="font-semibold text-zinc-200">{sub.senderName} {sub.status === 'Unread' && <span className="inline-block w-2 h-2 bg-luxury-gold rounded-full ml-1 animate-pulse"/>}</p>
                          <span className="text-[10px] text-zinc-500">{sub.email}</span>
                        </td>
                        <td className="p-3">{sub.category}</td>
                        <td className="p-3"><Badge variant={sub.status === 'Replied' ? 'success' : sub.status === 'Unread' ? 'gold' : 'default'}>{sub.status}</Badge></td>
                        <td className="p-3 text-right">
                          <button onClick={() => { setViewingSub(sub); if(sub.status === 'Unread') updateItem('enquiries', sub.id, {status: 'Read'}); }} className="text-luxury-gold hover:text-white px-2 py-1 text-xs">View</button>
                          <button onClick={() => { setDeleteId(sub.id); setDeleteType('submission'); }} className="text-rose-500 hover:text-rose-400 ml-2 px-2 py-1"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {viewingSub && (
                <Card className="border-zinc-800 p-6 bg-zinc-950/80 mt-4" title="Submission Inspector">
                   <div className="space-y-4">
                     <div>
                       <span className="text-[10px] text-zinc-500 uppercase">From:</span>
                       <p className="text-zinc-200 font-bold">{viewingSub.senderName} <span className="text-luxury-gold font-normal">({viewingSub.email})</span></p>
                     </div>
                     <div>
                       <span className="text-[10px] text-zinc-500 uppercase">Subject / Category:</span>
                       <p className="text-zinc-200">{viewingSub.subject || viewingSub.category}</p>
                     </div>
                     <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded">
                       <p className="text-sm text-zinc-300 whitespace-pre-line">{viewingSub.message}</p>
                     </div>
                     <div className="flex justify-end gap-3 pt-4">
                       <Button variant="secondary" onClick={() => setViewingSub(null)}>Close</Button>
                       <Button onClick={() => { updateItem('enquiries', viewingSub.id, {status: 'Replied'}); setViewingSub(p => ({...p, status: 'Replied'})); showToast('Marked as Replied'); }}>Mark Replied</Button>
                     </div>
                   </div>
                </Card>
              )}
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 sticky top-24">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <h3 className="font-serif text-xl text-luxury-gold">Live Visitor Preview</h3>
            <span className="text-[10px] text-emerald-500 uppercase font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Sync Active</span>
          </div>

          <div className="glass-panel border border-zinc-800/60 rounded-2xl overflow-hidden bg-black/60 relative p-6 min-h-[700px] overflow-y-auto custom-scrollbar">
             {/* Preview Hero */}
             {visDraft.hero !== false && heroDraft.enable !== false && (
               <div className="text-center mb-8 relative">
                 {heroDraft.glowEnable !== false && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 aurora-glow-gold opacity-30 pointer-events-none" />}
                 {heroDraft.label && <span className="text-[8px] uppercase tracking-[3px] text-luxury-gold font-bold mb-2 block">{heroDraft.label}</span>}
                 <h4 className="font-serif text-xl font-light text-white leading-tight">
                   {heroDraft.mainLine1} <span className="text-luxury-gold italic font-bold block">{heroDraft.highlight}</span>
                 </h4>
                 {heroDraft.description && <p className="text-[9px] text-zinc-400 mt-2 leading-relaxed">{heroDraft.description}</p>}
               </div>
             )}

             {/* Preview Info & WA */}
             <div className="grid grid-cols-1 gap-4 mb-8">
               {visDraft.info !== false && (
                 <div className="border border-white/10 p-4 bg-white/[0.02] rounded-xl flex flex-col gap-3">
                   {infoDraft.enableEmail !== false && (
                     <div className="flex items-center gap-2 text-zinc-300 text-[10px]">
                       {renderIcon(infoDraft.emailIcon)} {infoDraft.email || "Email"}
                     </div>
                   )}
                   {infoDraft.enablePhone !== false && (
                     <div className="flex items-center gap-2 text-zinc-300 text-[10px]">
                       {renderIcon(infoDraft.phoneIcon)} {infoDraft.phone || "Phone"}
                     </div>
                   )}
                   {infoDraft.enableLocation !== false && (
                     <div className="flex flex-col gap-1 text-zinc-300 text-[10px]">
                       <div className="flex items-center gap-2 text-luxury-gold font-bold">{renderIcon(infoDraft.locationIcon)} {infoDraft.locationTitle}</div>
                       <span className="pl-6">{infoDraft.address}</span>
                     </div>
                   )}
                 </div>
               )}

               {visDraft.whatsapp !== false && waDraft.enable !== false && (
                 <div className="bg-[#25D366] text-white p-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold shadow-md">
                   <Phone className="w-3 h-3" /> {waDraft.buttonText || "WhatsApp"}
                 </div>
               )}
             </div>

             {/* Preview Form */}
             {visDraft.form !== false && formDraft.enable !== false && (
               <div className="border border-white/10 p-5 bg-black/40 rounded-xl mb-8">
                 <h5 className="text-[10px] uppercase font-bold text-luxury-gold mb-4">{formDraft.title || "Form"}</h5>
                 <div className="flex flex-col gap-3">
                   {contactFormFields.filter(f => f.enable !== false).sort((a,b) => (a.order||0)-(b.order||0)).map(f => (
                     <input key={f.id} type="text" placeholder={f.placeholder} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 focus:border-luxury-gold outline-none transition-colors" />
                   ))}
                   <button className="w-full bg-luxury-gold text-black font-bold py-2 rounded text-[10px] mt-2 hover:bg-yellow-500 transition-colors cursor-pointer" onClick={() => showToast('Form submission simulated successfully!')}>{formDraft.buttonText || "Submit"}</button>
                 </div>
               </div>
             )}

             {/* Preview Map */}
             {visDraft.map !== false && mapDraft.enable !== false && (
               <div className={`mb-8 w-full bg-zinc-900 overflow-hidden ${mapDraft.rounded !== false ? 'rounded-xl' : ''} ${mapDraft.darkMode !== false ? 'grayscale contrast-125' : ''}`} style={{height: `${mapDraft.height || 200}px`}}>
                 <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 border border-zinc-800">Map Placeholder</div>
               </div>
             )}

             {/* Preview Socials */}
             {visDraft.social !== false && (
               <div className="flex justify-center gap-3 flex-wrap">
                 {contactSocialLinksSetup.filter(s => s.status !== false).sort((a,b) => (a.order||0)-(b.order||0)).map(s => (
                   <a key={s.id} href={s.url} target={s.newTab !== false ? "_blank" : "_self"} className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors cursor-pointer">
                     {renderIcon(s.icon)}
                   </a>
                 ))}
               </div>
             )}
          </div>
        </div>

      </div>

      {/* MODALS */}
      <Dialog isOpen={isFieldModalOpen} onClose={() => setIsFieldModalOpen(false)} title={editingField ? "Edit Field" : "Add Field"} size="sm">
        <form onSubmit={(e) => handleSaveList(e, 'field')} className="flex flex-col gap-4 mt-2">
          <Input label="Label" value={fieldForm.label || ''} onChange={e => setFieldForm(p => ({...p, label: e.target.value}))} required />
          <Input label="Placeholder" value={fieldForm.placeholder || ''} onChange={e => setFieldForm(p => ({...p, placeholder: e.target.value}))} required />
          <Input label="Sort Order" type="number" value={fieldForm.order || ''} onChange={e => setFieldForm(p => ({...p, order: parseInt(e.target.value)}))} required />
          <div className="flex gap-4">
            <Switch label="Required" checked={fieldForm.required !== false} onChange={v => setFieldForm(p => ({...p, required: v}))} />
            <Switch label="Enabled" checked={fieldForm.enable !== false} onChange={v => setFieldForm(p => ({...p, enable: v}))} />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900"><Button type="button" variant="secondary" onClick={() => setIsFieldModalOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Dialog>

      <Dialog isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title={editingCat ? "Edit Category" : "Add Category"} size="sm">
        <form onSubmit={(e) => handleSaveList(e, 'cat')} className="flex flex-col gap-4 mt-2">
          <Input label="Category Name" value={catForm.name || ''} onChange={e => setCatForm(p => ({...p, name: e.target.value}))} required />
          <Input label="Value (Slug)" value={catForm.value || ''} onChange={e => setCatForm(p => ({...p, value: e.target.value}))} required />
          <Switch label="Active Status" checked={catForm.status !== false} onChange={v => setCatForm(p => ({...p, status: v}))} />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900"><Button type="button" variant="secondary" onClick={() => setIsCatModalOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Dialog>

      <Dialog isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} title={editingSocial ? "Edit Social" : "Add Social"} size="sm">
        <form onSubmit={(e) => handleSaveList(e, 'social')} className="flex flex-col gap-4 mt-2">
          <Input label="Platform Name" value={socialForm.platform || ''} onChange={e => setSocialForm(p => ({...p, platform: e.target.value}))} required />
          <Input label="Handle" value={socialForm.handle || ''} onChange={e => setSocialForm(p => ({...p, handle: e.target.value}))} required />
          <Input label="URL" value={socialForm.url || ''} onChange={e => setSocialForm(p => ({...p, url: e.target.value}))} required />
          <Input label="Icon Name" value={socialForm.icon || ''} onChange={e => setSocialForm(p => ({...p, icon: e.target.value}))} required />
          <Input label="Sort Order" type="number" value={socialForm.order || ''} onChange={e => setSocialForm(p => ({...p, order: parseInt(e.target.value)}))} required />
          <div className="flex gap-4">
            <Switch label="Active Status" checked={socialForm.status !== false} onChange={v => setSocialForm(p => ({...p, status: v}))} />
            <Switch label="Open New Tab" checked={socialForm.newTab !== false} onChange={v => setSocialForm(p => ({...p, newTab: v}))} />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900"><Button type="button" variant="secondary" onClick={() => setIsSocialModalOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Dialog>

      <ConfirmDialog isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setDeleteType(null); }} onConfirm={handleDeleteConfirm} />
    </div>
  );
};
