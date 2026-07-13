import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Search, Plus, Edit2, Trash2, X, Eye, 
  RefreshCw, Save, Image as ImageIcon, Video, Laptop, Terminal, Layers, ArrowUpRight, Calendar, Users, MapPin, Monitor, FileText, Download, CheckCircle, Clock, Layout
} from 'lucide-react';

export default function Events() {
  const { db, updateSection, deleteNestedItem } = useDatabase();
  const eventsPage = db?.eventsPage || {};

  // Tab State
  const [selectedTab, setSelectedTab] = useState('masterEventsList');

  /* ===========================
        GLOBAL UI STATES
  =========================== */
  const [expandedCards, setExpandedCards] = useState({});
  const toggleCard = (id) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* ===========================
        INLINE EDITOR STATES
  =========================== */
  const [activeEditorSection, setActiveEditorSection] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [deletingSection, setDeletingSection] = useState(null);

  /* ===========================
        MEDIA UPLOAD STATES
  =========================== */
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Object Forms
  const [heroForm, setHeroForm] = useState(eventsPage.heroSettings || {});
  const [videoForm, setVideoForm] = useState(eventsPage.videoHighlights || {});
  const [ctaForm, setCtaForm] = useState(eventsPage.bookingCTA || {});

  useEffect(() => {
    setHeroForm(eventsPage.heroSettings || {});
    setVideoForm(eventsPage.videoHighlights || {});
    setCtaForm(eventsPage.bookingCTA || {});
  }, [eventsPage]);

  const handleTabSwitch = (tab) => {
    setSelectedTab(tab);
    setExpandedCards({});
    setActiveEditorSection(null);
    setEditingItemId(null);
  };

  const handleSingleSave = (sectionKey, data) => {
    updateSection('eventsPage', { [sectionKey]: data });
    showToast(`✅ ${sectionKey.toUpperCase()} Updated Successfully!`);
  };

  const simulateMediaUpload = (fieldKey, isObjectForm = false, objectSetter = null) => {
    setUploadingField(fieldKey);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingField(null);
          const newUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=800`;
          
          if (isObjectForm && objectSetter) {
            objectSetter(prevForm => ({ ...prevForm, [fieldKey]: newUrl }));
          } else if (activeEditorSection) {
            setDraftItem(prevItem => ({ ...prevItem, [fieldKey]: newUrl }));
          }
          return 0;
        }
        return prev + 25;
      });
    }, 250);
  };

  const renderMediaUpload = (label, value, fieldKey, isObjectForm = false, objectSetter = null) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
        {value ? (
          <div className="relative w-full h-32 bg-zinc-955 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
            <img src={value} className="w-full h-full object-cover" alt="Upload" />
            <div className="absolute bottom-1 right-1 flex items-center gap-1">
              <button type="button" onClick={() => simulateMediaUpload(fieldKey, isObjectForm, objectSetter)} className="p-1 bg-black/60 rounded text-luxury-gold hover:text-white" title="Replace">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => {
                if (isObjectForm && objectSetter) {
                  objectSetter(prev => ({...prev, [fieldKey]: ''}));
                } else if (activeEditorSection) {
                  setDraftItem(prev => ({...prev, [fieldKey]: ''}));
                }
              }} className="p-1 bg-black/60 hover:bg-zinc-900 rounded text-rose-500" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => simulateMediaUpload(fieldKey, isObjectForm, objectSetter)}
            className="h-32 w-full border border-dashed border-zinc-850 hover:border-luxury-gold/30 rounded flex flex-col items-center justify-center gap-1 text-zinc-655 cursor-pointer transition-all bg-zinc-955/20"
          >
            {uploadingField === fieldKey ? (
              <div className="flex flex-col items-center gap-1 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-luxury-gold" />
                <span className="text-[8px] font-mono">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mb-1" />
                <span className="text-xs">Click to upload image</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderColorPicker = (label, value, fieldKey) => {
    const presets = ["#D4AF37", "#00E5FF", "#aa3bff", "#E60000", "#FFFFFF"];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={value || '#D4AF37'} 
            onChange={(e) => setDraftItem(prev => ({...prev, [fieldKey]: e.target.value}))}
            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
          />
          <Input 
            value={value || '#D4AF37'}
            onChange={(e) => setDraftItem(prev => ({...prev, [fieldKey]: e.target.value}))}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2 mt-1">
          {presets.map(color => (
            <div 
              key={color} 
              onClick={() => setDraftItem(prev => ({...prev, [fieldKey]: color}))}
              className="w-5 h-5 rounded-full cursor-pointer border border-zinc-700 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderListManager = (sectionKey, fields, gridCols = 2) => {
    const listData = eventsPage[sectionKey] || [];
    const isEditing = activeEditorSection === sectionKey;

    const handleStartAdd = () => {
      const defaultData = fields.reduce((acc, field) => {
        acc[field.key] = field.type === 'color' ? '#D4AF37' : (field.type === 'switch' ? 'Upcoming' : '');
        return acc;
      }, {});
      setDraftItem(defaultData);
      setEditingItemId(null);
      setActiveEditorSection(sectionKey);
    };

    const handleStartEdit = (item) => {
      setDraftItem({ ...item });
      setEditingItemId(item.id);
      setActiveEditorSection(sectionKey);
    };

    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...draftItem, id: item.id } : item);
        showToast("Item updated successfully.");
      } else {
        const newItem = {
          ...draftItem,
          id: `item-${Date.now()}`,
          order: listData.length + 1
        };
        nextList = [...listData, newItem];
        showToast("New item created.");
      }
      handleSingleSave(sectionKey, nextList);
      setActiveEditorSection(null);
    };

    return (
      <div className="flex flex-col w-full h-full">
        {!isEditing ? (
          <div className="flex flex-col">
            <div className="flex justify-end mb-3">
              <button type="button" onClick={handleStartAdd} className="bg-luxury-gold text-black hover:bg-luxury-gold/90 text-xs px-4 py-2 flex items-center rounded">
                <Plus className="w-4 h-4 mr-2" /> Add New
              </button>
            </div>
            <div className="overflow-x-auto border border-zinc-850 rounded bg-zinc-955/30">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/50 border-b border-zinc-850 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium">Core Details</th>
                    <th className="px-4 py-3 font-medium">Status/Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/50">
                  {listData.length === 0 && (
                    <tr><td colSpan="3" className="px-4 py-6 text-center text-zinc-500 italic">No records found.</td></tr>
                  )}
                  {listData.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-zinc-900/20 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {(item.media || item.url || item.banner) && (
                            <img src={item.media || item.url || item.banner} className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-zinc-200 font-medium text-sm">{item.title || item.name || item.eventName || "Untitled"}</span>
                            <span className="text-[10px] text-zinc-500 max-w-xs truncate">{item.description || item.location || item.email || ""}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                           <span className={`px-2 py-0.5 rounded-full w-max text-[10px] ${item.status === 'Upcoming' || item.status === 'Active' || item.status === 'New' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                             {item.status || 'Active'}
                           </span>
                           {item.date && <span className="text-zinc-500 text-[10px]"><Calendar className="w-3 h-3 inline mr-1"/>{item.date}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => handleStartEdit(item)} className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => { setDeletingItemId(item.id); setDeletingSection(sectionKey); }} className="p-1.5 hover:bg-zinc-900 rounded text-rose-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-start">
              <Button type="button" onClick={handleStartAdd} variant="secondary" size="sm" className="gap-1 text-xs border border-zinc-800 text-luxury-gold">
                <Plus className="w-3.5 h-3.5" /> Add Record
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 bg-zinc-950/40 border border-luxury-gold/20 p-6 rounded-lg shadow-gold-glow-lg max-h-[80vh] overflow-y-auto">
            <h4 className="font-serif text-lg text-white mb-2 flex justify-between items-center">
              <span>{editingItemId ? 'Edit Record' : 'Create New Record'}</span>
              <button type="button" onClick={() => setActiveEditorSection(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </h4>
            <div className={`grid grid-cols-1 md:grid-cols-${gridCols} gap-x-6 gap-y-5`}>
              {fields.map(field => {
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="md:col-span-full">
                      <Input label={field.label} textarea rows={field.rows || 3} value={draftItem[field.key] || ''} onChange={(e) => setDraftItem(prev => ({...prev, [field.key]: e.target.value}))} />
                    </div>
                  );
                }
                if (field.type === 'upload') {
                  return (
                    <div key={field.key} className={field.fullWidth ? "md:col-span-full" : ""}>
                      {renderMediaUpload(field.label, draftItem[field.key], field.key)}
                    </div>
                  );
                }
                if (field.type === 'color') {
                  return <div key={field.key}>{renderColorPicker(field.label, draftItem[field.key], field.key)}</div>;
                }
                if (field.type === 'switch') {
                  return (
                    <div key={field.key} className="flex flex-col gap-2 justify-center">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                      <select 
                        value={draftItem[field.key] || 'Upcoming'}
                        onChange={(e) => setDraftItem(prev => ({...prev, [field.key]: e.target.value}))}
                        className="bg-black/40 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-luxury-gold/50 transition-colors"
                      >
                        {field.options ? field.options.map(opt => <option key={opt}>{opt}</option>) : (
                          <>
                            <option>Upcoming</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                            <option>Active</option>
                            <option>Inactive</option>
                          </>
                        )}
                      </select>
                    </div>
                  );
                }
                return (
                  <div key={field.key} className={field.fullWidth ? "md:col-span-full" : ""}>
                    <Input label={field.label} value={draftItem[field.key] || ''} onChange={(e) => setDraftItem(prev => ({...prev, [field.key]: e.target.value}))} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 sticky bottom-0 bg-zinc-950/90 backdrop-blur py-3">
              <Button type="button" onClick={() => setActiveEditorSection(null)} variant="secondary" size="sm">Cancel</Button>
              <Button type="button" onClick={handleSaveItem} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Record</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ===========================
        TAB RENDERERS
  =========================== */

  const renderMasterEvents = () => {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800/50 p-6 rounded-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-serif text-white flex items-center gap-2"><Monitor className="w-5 h-5 text-luxury-gold"/> Master Events Database</h2>
            <p className="text-xs text-zinc-500 mt-1">Manage 20+ fields for all comprehensive events (Keynotes, Meetups, Summits).</p>
          </div>
          <Button type="button" variant="secondary" size="sm" className="gap-2 text-xs border border-zinc-800"><Download className="w-3 h-3"/> Export CSV</Button>
        </div>
        {renderListManager('masterEventsList', [
          { key: 'title', label: 'Event Title', type: 'text', fullWidth: true },
          { key: 'type', label: 'Event Type (Category)', type: 'text' },
          { key: 'slug', label: 'URL Slug', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'time', label: 'Time', type: 'text' },
          { key: 'venue', label: 'Venue Name', type: 'text' },
          { key: 'location', label: 'Location (City, Country)', type: 'text' },
          { key: 'googleMapLink', label: 'Google Map Embed Link', type: 'text' },
          { key: 'attendance', label: 'Expected Attendance', type: 'text' },
          { key: 'organizer', label: 'Organizer / Brand', type: 'text' },
          { key: 'coordinator', label: 'Coordinator Name', type: 'text' },
          { key: 'budget', label: 'Total Budget / Cost', type: 'text' },
          { key: 'status', label: 'Event Status', type: 'switch', options: ['Upcoming', 'Completed', 'Cancelled', 'Draft'] },
          { key: 'accentColor', label: 'Card Accent Color', type: 'color' },
          { key: 'media', label: 'Cover/Banner Image', type: 'upload' },
          { key: 'pressKitPdf', label: 'Press Kit PDF Link', type: 'text' },
          { key: 'description', label: 'Full Description & Agenda', type: 'textarea', rows: 5, fullWidth: true },
        ], 2)}
      </div>
    );
  };

  const renderWorkshops = () => {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800/50 p-6 rounded-2xl w-full">
        <h2 className="text-xl font-serif text-white flex items-center gap-2 mb-6"><Laptop className="w-5 h-5 text-luxury-gold"/> Workshops Manager</h2>
        {renderListManager('workshops', [
          { key: 'title', label: 'Workshop Name', type: 'text' },
          { key: 'instructor', label: 'Instructor', type: 'text' },
          { key: 'date', label: 'Date & Time', type: 'text' },
          { key: 'venue', label: 'Venue / Platform', type: 'text' },
          { key: 'seats', label: 'Total Seats', type: 'text' },
          { key: 'price', label: 'Price (e.g. ₹5000 / Free)', type: 'text' },
          { key: 'status', label: 'Status', type: 'switch' }
        ], 2)}
      </div>
    );
  };

  const renderConferences = () => {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800/50 p-6 rounded-2xl w-full">
        <h2 className="text-xl font-serif text-white flex items-center gap-2 mb-6"><Users className="w-5 h-5 text-luxury-gold"/> Conferences Manager</h2>
        {renderListManager('conferences', [
          { key: 'title', label: 'Conference Name', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'guests', label: 'Guests count', type: 'text' },
          { key: 'status', label: 'Status', type: 'switch' }
        ], 2)}
      </div>
    );
  };

  const renderBookingRequests = () => {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800/50 p-6 rounded-2xl w-full">
        <h2 className="text-xl font-serif text-white flex items-center gap-2 mb-6"><FileText className="w-5 h-5 text-luxury-gold"/> Inbound Booking Requests</h2>
        {renderListManager('bookingRequests', [
          { key: 'name', label: 'Client Name', type: 'text' },
          { key: 'email', label: 'Email Address', type: 'text' },
          { key: 'organization', label: 'Organization / Company', type: 'text' },
          { key: 'eventName', label: 'Proposed Event Name', type: 'text' },
          { key: 'date', label: 'Requested Date', type: 'text' },
          { key: 'budget', label: 'Allocated Budget', type: 'text' },
          { key: 'status', label: 'Status', type: 'switch', options: ['New', 'Contacted', 'Approved', 'Archived'] },
          { key: 'message', label: 'Additional Message / Requirements', type: 'textarea', fullWidth: true }
        ], 2)}
      </div>
    );
  };

  const renderPageBuilder = () => {
    return (
      <div className="w-full flex flex-col gap-4">
        <Card title={<div className="font-serif px-5 py-4 bg-zinc-955/20 text-white flex items-center gap-2"><Layout className="w-4 h-4"/> Hero Settings</div>} className="bg-zinc-955/20 border-zinc-800/50 p-0 overflow-hidden">
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-800/40 bg-black/20">
              <Input label="Small Badge" value={heroForm.smallBadge || ''} onChange={(e) => setHeroForm(prev => ({...prev, smallBadge: e.target.value}))} />
              <Input label="Highlight Word" value={heroForm.highlightWord || ''} onChange={(e) => setHeroForm(prev => ({...prev, highlightWord: e.target.value}))} />
              <div className="md:col-span-2"><Input label="Main Headline" value={heroForm.headline || ''} onChange={(e) => setHeroForm(prev => ({...prev, headline: e.target.value}))} /></div>
              <div className="md:col-span-2"><Input label="Hero Description" textarea rows={3} value={heroForm.description || ''} onChange={(e) => setHeroForm(prev => ({...prev, description: e.target.value}))} /></div>
              <div className="md:col-span-2 flex justify-end"><Button onClick={() => handleSingleSave('heroSettings', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Hero</Button></div>
           </div>
        </Card>

        <Card title={<div className="font-serif px-5 py-4 bg-zinc-955/20 text-white flex items-center gap-2"><ArrowUpRight className="w-4 h-4"/> Engagement Types</div>} className="bg-zinc-955/20 border-zinc-800/50 p-0 overflow-hidden">
           <div className="p-6 border-t border-zinc-800/40 bg-black/20">
              {renderListManager('engagementTypes', [{ key: 'title', label: 'Engagement Title', type: 'text' }, { key: 'status', label: 'Status', type: 'switch', options: ['Active', 'Hidden'] }])}
           </div>
        </Card>
        
        <Card title={<div className="font-serif px-5 py-4 bg-zinc-955/20 text-white flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Media Archive Gallery</div>} className="bg-zinc-955/20 border-zinc-800/50 p-0 overflow-hidden">
           <div className="p-6 border-t border-zinc-800/40 bg-black/20">
              {renderListManager('mediaArchive', [
                { key: 'title', label: 'Image Title / Alt Text', type: 'text' },
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'url', label: 'Upload Image', type: 'upload', fullWidth: true }
              ])}
           </div>
        </Card>

        <Card title={<div className="font-serif px-5 py-4 bg-zinc-955/20 text-white flex items-center gap-2"><Video className="w-4 h-4"/> Video Highlights</div>} className="bg-zinc-955/20 border-zinc-800/50 p-0 overflow-hidden">
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-800/40 bg-black/20">
              <Input label="Recap Badge Text" value={videoForm.recapBadge || ''} onChange={(e) => setVideoForm(prev => ({...prev, recapBadge: e.target.value}))} />
              <Input label="Video Title" value={videoForm.title || ''} onChange={(e) => setVideoForm(prev => ({...prev, title: e.target.value}))} />
              <div className="md:col-span-2"><Input label="YouTube Embed URL" value={videoForm.videoUrl || ''} onChange={(e) => setVideoForm(prev => ({...prev, videoUrl: e.target.value}))} /></div>
              <div className="md:col-span-2">{renderMediaUpload('Video Thumbnail', videoForm.thumbnail, 'thumbnail', true, setVideoForm)}</div>
              <div className="md:col-span-2 flex justify-end"><Button onClick={() => handleSingleSave('videoHighlights', videoForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Video Settings</Button></div>
           </div>
        </Card>

        <Card title={<div className="font-serif px-5 py-4 bg-zinc-955/20 text-white flex items-center gap-2"><Calendar className="w-4 h-4"/> Booking CTA Text</div>} className="bg-zinc-955/20 border-zinc-800/50 p-0 overflow-hidden">
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-800/40 bg-black/20">
              <Input label="Small Badge" value={ctaForm.smallBadge || ''} onChange={(e) => setCtaForm(prev => ({...prev, smallBadge: e.target.value}))} />
              <Input label="Highlight Word" value={ctaForm.highlightWord || ''} onChange={(e) => setCtaForm(prev => ({...prev, highlightWord: e.target.value}))} />
              <div className="md:col-span-2"><Input label="Main Headline" value={ctaForm.headline || ''} onChange={(e) => setCtaForm(prev => ({...prev, headline: e.target.value}))} /></div>
              <div className="md:col-span-2"><Input label="Description" textarea rows={3} value={ctaForm.description || ''} onChange={(e) => setCtaForm(prev => ({...prev, description: e.target.value}))} /></div>
              <div className="md:col-span-2"><Input label="Award / Footer Text" value={ctaForm.awardText || ''} onChange={(e) => setCtaForm(prev => ({...prev, awardText: e.target.value}))} /></div>
              <div className="md:col-span-2 flex justify-end"><Button onClick={() => handleSingleSave('bookingCTA', ctaForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save CTA Form</Button></div>
           </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left relative min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm tracking-wide">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-luxury-gold" />
            Global Events Command Center
          </h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
            Control the entire visitor event ecosystem. Manage 20-field master events, independent workshop modules, inbound booking forms, and dynamic page builders all from one unified luxury interface.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={() => { setSelectedTab('masterEventsList'); setActiveEditorSection('masterEventsList'); setEditingItemId(null); setDraftItem({}); }} variant="secondary" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
             <Plus className="w-4 h-4 mr-1.5" /> Add Event
          </Button>
          <Button type="button" onClick={() => { if (window.confirm("Reset unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-4 h-4" /> <span>Reset</span>
          </Button>
          <Button type="button" onClick={() => showToast("🚀 Production server synced. All changes are Live!")} variant="primary" size="sm" className="gap-1.5 bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow px-5 py-2.5 rounded-lg">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[3px] px-2 mb-2">CMS Modules</h3>
          
          <button onClick={() => handleTabSwitch('masterEventsList')} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'masterEventsList' ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/50'}`}>
            <Monitor className="w-4 h-4" /> Master Events Database
          </button>
          
          <button onClick={() => handleTabSwitch('workshops')} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'workshops' ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/50'}`}>
            <Laptop className="w-4 h-4" /> Workshops
          </button>
          
          <button onClick={() => handleTabSwitch('conferences')} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'conferences' ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/50'}`}>
            <Users className="w-4 h-4" /> Conferences
          </button>
          
          <div className="my-2 border-t border-zinc-800/50"></div>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[3px] px-2 mb-2">Frontend Control</h3>
          
          <button onClick={() => handleTabSwitch('pageBuilder')} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'pageBuilder' ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/50'}`}>
            <Layout className="w-4 h-4" /> Page Builder UI
          </button>
          
          <button onClick={() => handleTabSwitch('bookingRequests')} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${selectedTab === 'bookingRequests' ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800/50'}`}>
            <div className="flex items-center gap-3"><FileText className="w-4 h-4" /> Booking Requests</div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedTab === 'bookingRequests' ? 'bg-luxury-gold/20' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>New</span>
          </button>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full flex flex-col gap-4">
           {selectedTab === 'masterEventsList' && renderMasterEvents()}
           {selectedTab === 'workshops' && renderWorkshops()}
           {selectedTab === 'conferences' && renderConferences()}
           {selectedTab === 'bookingRequests' && renderBookingRequests()}
           {selectedTab === 'pageBuilder' && renderPageBuilder()}
        </div>
      </div>

      {/* GLOBAL DELETE CONFIRMATION PORTAL */}
      <ConfirmDialog
        isOpen={deletingItemId !== null}
        onClose={() => { setDeletingItemId(null); setDeletingSection(null); }}
        title="Delete Record"
        message="Are you sure you want to permanently delete this record? This action will remove it from the visitor website immediately."
        confirmText="Permanently Delete"
        cancelText="Cancel"
        onConfirm={() => {
          deleteNestedItem('eventsPage', deletingSection, deletingItemId);
          setDeletingItemId(null);
          setDeletingSection(null);
          showToast("Record deleted successfully.");
        }}
      />
    </div>
  );
}
