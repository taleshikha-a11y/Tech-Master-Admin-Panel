import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Search, Plus, Edit2, Trash2, X, Eye, 
  RefreshCw, Save, Image as ImageIcon, Video, Laptop, Terminal, Layers, ArrowUpRight, Cpu, Calendar, CheckCircle
} from 'lucide-react';

export const Campaigns = () => {
  const { db, updateSection, deleteNestedItem } = useDatabase();
  
  // We handle both pages within this CMS module
  const campaignsPage = db?.campaignsPage || {};
  const launchesPage = db?.launchesPage || {};

  // Tab State: 'campaigns' or 'launches'
  const [selectedTab, setSelectedTab] = useState('campaigns');

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
  
  const [heroForm, setHeroForm] = useState({});
  const [seoForm, setSeoForm] = useState({});
  const [featureVideoForm, setFeatureVideoForm] = useState({});

  const [deletingItemId, setDeletingItemId] = useState(null);
  const [deletingSection, setDeletingSection] = useState(null);

  /* ===========================
        MEDIA UPLOAD STATES
  =========================== */
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize specific object forms when tab changes or initially
  useEffect(() => {
    const pageData = selectedTab === 'campaigns' ? campaignsPage : launchesPage;
    setHeroForm(pageData.hero || {});
    setSeoForm(pageData.seo || {});
    if (selectedTab === 'launches') {
      setFeatureVideoForm(pageData.featureVideo || {});
    }
  }, [selectedTab, campaignsPage, launchesPage]);

  // Handle switching tabs
  const handleTabSwitch = (tab) => {
    setSelectedTab(tab);
    setExpandedCards({});
    setActiveEditorSection(null);
    setEditingItemId(null);
  };

  /* ===========================
        SAVE HANDLERS
  =========================== */
  const handleSingleSave = (sectionKey, data) => {
    const targetPage = selectedTab === 'campaigns' ? 'campaignsPage' : 'launchesPage';
    updateSection(targetPage, { [sectionKey]: data });
    showToast(`✅ ${sectionKey.toUpperCase()} Updated Successfully!`);
  };

  const simulateMediaUpload = (fieldKey) => {
    setUploadingField(fieldKey);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingField(null);
          // random unsplash image
          const newUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=800`;
          
          if (activeEditorSection === 'featureVideo') {
            setFeatureVideoForm(prevForm => ({ ...prevForm, [fieldKey]: newUrl }));
          } else if (activeEditorSection) {
            setDraftItem(prevItem => ({ ...prevItem, [fieldKey]: newUrl }));
          } else {
            setSeoForm(prevForm => ({ ...prevForm, [fieldKey]: newUrl }));
          }
          return 0;
        }
        return prev + 25;
      });
    }, 250);
  };

  /* ===========================
        RENDER HELPERS
  =========================== */
  
  const renderMediaUpload = (label, value, fieldKey) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
        {value ? (
          <div className="relative w-full h-32 bg-zinc-955 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
            <img src={value} className="w-full h-full object-cover" alt="Upload" />
            <div className="absolute bottom-1 right-1 flex items-center gap-1">
              <button type="button" onClick={() => simulateMediaUpload(fieldKey)} className="p-1 bg-black/60 rounded text-luxury-gold hover:text-white" title="Replace Image">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => {
                if (activeEditorSection === 'featureVideo') {
                  setFeatureVideoForm(prev => ({...prev, [fieldKey]: ''}));
                } else if (activeEditorSection) {
                  setDraftItem(prev => ({...prev, [fieldKey]: ''}));
                } else {
                  setSeoForm(prev => ({...prev, [fieldKey]: ''}));
                }
              }} className="p-1 hover:bg-zinc-900 rounded text-rose-500" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => simulateMediaUpload(fieldKey)}
            className="h-32 border border-dashed border-zinc-850 hover:border-luxury-gold/30 rounded flex flex-col items-center justify-center gap-1 text-zinc-655 cursor-pointer transition-all bg-zinc-955/20"
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
                <span className="text-[10px] uppercase">WEBP, PNG, JPG</span>
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
      <div className="flex flex-col gap-1.5">
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

  const ListInputManager = ({ items = [], onChange, label, placeholder }) => {
    const [newItem, setNewItem] = useState('');
    const handleAdd = () => {
      if(newItem.trim()) {
        onChange([...items, newItem.trim()]);
        setNewItem('');
      }
    };
    const handleDelete = (idxToDelete) => {
      onChange(items.filter((_, idx) => idx !== idxToDelete));
    };
    
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
        <div className="flex gap-2">
          <Input 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
            placeholder={placeholder}
          />
          <Button type="button" onClick={handleAdd} variant="secondary">Add</Button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 px-3 py-2 rounded text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>{item}</span>
                </div>
                <button type="button" onClick={() => handleDelete(idx)} className="p-1 text-zinc-550 hover:text-rose-400"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderListManager = (sectionKey, fields) => {
    const targetPage = selectedTab === 'campaigns' ? campaignsPage : launchesPage;
    const listData = targetPage[sectionKey] || [];
    const isEditing = activeEditorSection === sectionKey;

    const handleStartAdd = () => {
      const defaultData = fields.reduce((acc, field) => {
        acc[field.key] = field.type === 'list' ? [] : (field.type === 'color' ? '#D4AF37' : (field.type === 'switch' ? 'Active' : ''));
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
          status: draftItem.status || 'Active',
          order: listData.length + 1
        };
        nextList = [...listData, newItem];
        showToast("New item created.");
      }
      handleSingleSave(sectionKey, nextList);
      setActiveEditorSection(null);
    };

    const handleCancelEdit = () => {
      setActiveEditorSection(null);
      setDraftItem({});
      setEditingItemId(null);
    };

    return (
      <div className="flex flex-col w-full">
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
                    <th className="px-4 py-3 font-medium">Item Details</th>
                    <th className="px-4 py-3 font-medium">Status</th>
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
                          {item.coverImage && (
                            <img src={item.coverImage} className="w-10 h-10 rounded object-cover border border-zinc-800" />
                          )}
                          {item.icon && (
                            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                              {/* Displaying simple text for icon mapping in CMS */}
                              <span className="text-[10px] text-luxury-gold font-mono">{item.icon}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-zinc-200 font-medium">{item.title || item.name}</span>
                            <span className="text-[10px] text-zinc-500 max-w-xs truncate">{item.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' || item.status === 'Active Launch' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                          <span className="text-xs">{item.status || 'Active'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleStartEdit(item)} className="p-1 hover:bg-zinc-900 rounded text-zinc-400" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => { setDeletingItemId(item.id); setDeletingSection(sectionKey); }} className="p-1 hover:bg-zinc-900 rounded text-rose-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-start">
              <Button type="button" onClick={handleStartAdd} variant="secondary" size="sm" className="gap-1 text-xs border border-zinc-800 text-luxury-gold">
                <Plus className="w-3.5 h-3.5" /> Add Row Item
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 bg-zinc-950/40 border border-luxury-gold/20 p-6 rounded-lg relative shadow-gold-glow-lg">
            <h4 className="font-serif text-lg text-white mb-2">{editingItemId ? 'Edit Record' : 'Create New Record'}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {fields.map(field => {
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="lg:col-span-2">
                      <Input 
                        label={field.label}
                        textarea
                        rows={3}
                        value={draftItem[field.key] || ''}
                        onChange={(e) => setDraftItem(prev => ({...prev, [field.key]: e.target.value}))}
                      />
                    </div>
                  );
                }
                if (field.type === 'list') {
                  return (
                    <div key={field.key} className="lg:col-span-2">
                      <ListInputManager 
                        label={field.label}
                        items={draftItem[field.key] || []}
                        onChange={(newItems) => setDraftItem(prev => ({...prev, [field.key]: newItems}))}
                        placeholder="Type and press Enter to add..."
                      />
                    </div>
                  );
                }
                if (field.type === 'upload') {
                  return (
                    <div key={field.key}>
                      {renderMediaUpload(field.label, draftItem[field.key], field.key)}
                    </div>
                  );
                }
                if (field.type === 'color') {
                  return (
                    <div key={field.key}>
                      {renderColorPicker(field.label, draftItem[field.key], field.key)}
                    </div>
                  );
                }
                if (field.type === 'switch') {
                  return (
                    <div key={field.key} className="flex flex-col gap-2 justify-center">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                      <Switch 
                        label="Toggle Visibility"
                        checked={draftItem[field.key] === 'Active' || draftItem[field.key] === 'Active Launch'}
                        onChange={(val) => setDraftItem(prev => ({...prev, [field.key]: val ? 'Active' : 'Inactive'}))}
                      />
                    </div>
                  );
                }
                return (
                  <div key={field.key}>
                    <Input 
                      label={field.label}
                      value={draftItem[field.key] || ''}
                      onChange={(e) => setDraftItem(prev => ({...prev, [field.key]: e.target.value}))}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80">
              <Button type="button" onClick={handleCancelEdit} variant="secondary" size="sm">Cancel</Button>
              <Button type="button" onClick={handleSaveItem} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Record</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleGlobalAdd = () => {
    if (selectedTab === 'campaigns') {
      setExpandedCards(prev => ({ ...prev, campaignsList: true }));
      setActiveEditorSection('campaignsList');
      setEditingItemId(null);
      setDraftItem({ title: '', sponsor: '', reach: '', coverImage: '', description: '', highlights: [], accentColor: '#D4AF37', status: 'Active' });
      setTimeout(() => document.getElementById('section-campaignsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } else {
      setExpandedCards(prev => ({ ...prev, products: true }));
      setActiveEditorSection('products');
      setEditingItemId(null);
      setDraftItem({ title: '', tagline: '', description: '', icon: 'Laptop', accentColor: '#D4AF37', status: 'Active Launch' });
      setTimeout(() => document.getElementById('section-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  };

  /* ===========================
        PAGE CONFIGURATIONS
  =========================== */
  const campaignsSections = [
    {
      id: 'hero', title: '1. Campaigns Hero Settings', icon: <Sparkles className="w-4 h-4 text-zinc-400" />,
      content: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Small Badge" value={heroForm.smallBadge || ''} onChange={(e) => setHeroForm(prev => ({...prev, smallBadge: e.target.value}))} />
            <Input label="Highlight Word" value={heroForm.highlightWord || ''} onChange={(e) => setHeroForm(prev => ({...prev, highlightWord: e.target.value}))} />
            <div className="md:col-span-2">
              <Input label="Main Headline" value={heroForm.headline || ''} onChange={(e) => setHeroForm(prev => ({...prev, headline: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <Input label="Hero Description" textarea rows={3} value={heroForm.description || ''} onChange={(e) => setHeroForm(prev => ({...prev, description: e.target.value}))} />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <Button type="button" onClick={() => handleSingleSave('hero', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Hero Parameters</Button>
          </div>
        </div>
      )
    },
    {
      id: 'campaignsList', title: '2. Initiative Campaigns', icon: <Layers className="w-4 h-4 text-zinc-400" />,
      content: renderListManager('campaignsList', [
        { key: 'title', label: 'Campaign Title', type: 'text' },
        { key: 'sponsor', label: 'Sponsor Brand', type: 'text' },
        { key: 'reach', label: 'Total Reach Metric', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'highlights', label: 'Campaign Highlights', type: 'list' },
        { key: 'accentColor', label: 'Card Accent Color', type: 'color' },
        { key: 'coverImage', label: 'Cover Image', type: 'upload' },
        { key: 'status', label: 'Active Status', type: 'switch' }
      ])
    },
    {
      id: 'lifecycle', title: '3. End-to-End Lifecycle', icon: <RefreshCw className="w-4 h-4 text-zinc-400" />,
      content: renderListManager('lifecycle', [
        { key: 'title', label: 'Step Title', type: 'text' },
        { key: 'description', label: 'Step Description', type: 'textarea' },
        { key: 'status', label: 'Active Status', type: 'switch' }
      ])
    },
    {
      id: 'successStories', title: '4. Client Success Stories', icon: <ArrowUpRight className="w-4 h-4 text-zinc-400" />,
      content: renderListManager('successStories', [
        { key: 'title', label: 'Story Title', type: 'text' },
        { key: 'description', label: 'Story Description', type: 'textarea' },
        { key: 'linkText', label: 'Link Text', type: 'text' },
        { key: 'accentColor', label: 'Accent Color', type: 'color' },
        { key: 'status', label: 'Active Status', type: 'switch' }
      ])
    },
    {
      id: 'seo', title: '5. Search Engine Optimization', icon: <Search className="w-4 h-4 text-zinc-400" />,
      content: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <Input label="Meta Title" value={seoForm.metaTitle || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaTitle: e.target.value}))} />
            <Input label="Meta Description" textarea rows={2} value={seoForm.metaDescription || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaDescription: e.target.value}))} />
            <Input label="Meta Keywords (Comma separated)" value={seoForm.metaKeywords || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaKeywords: e.target.value}))} />
            <div className="md:w-1/2">
              {renderMediaUpload('Open Graph Image (Social Share)', seoForm.ogImageUrl, 'ogImageUrl')}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <Button type="button" onClick={() => handleSingleSave('seo', seoForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save SEO Metadata</Button>
          </div>
        </div>
      )
    }
  ];

  const launchesSections = [
    {
      id: 'hero', title: '1. Product Launches Hero', icon: <Sparkles className="w-4 h-4 text-zinc-400" />,
      content: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Small Badge" value={heroForm.smallBadge || ''} onChange={(e) => setHeroForm(prev => ({...prev, smallBadge: e.target.value}))} />
            <Input label="Highlight Word" value={heroForm.highlightWord || ''} onChange={(e) => setHeroForm(prev => ({...prev, highlightWord: e.target.value}))} />
            <div className="md:col-span-2">
              <Input label="Main Headline" value={heroForm.headline || ''} onChange={(e) => setHeroForm(prev => ({...prev, headline: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <Input label="Hero Description" textarea rows={3} value={heroForm.description || ''} onChange={(e) => setHeroForm(prev => ({...prev, description: e.target.value}))} />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <Button type="button" onClick={() => handleSingleSave('hero', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Hero Parameters</Button>
          </div>
        </div>
      )
    },
    {
      id: 'products', title: '2. Software Releases & Products', icon: <Laptop className="w-4 h-4 text-zinc-400" />,
      content: renderListManager('products', [
        { key: 'title', label: 'Product Title', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon String (e.g. Laptop, Terminal, Layers)', type: 'text' },
        { key: 'accentColor', label: 'Accent Color', type: 'color' },
        { key: 'status', label: 'Release Status', type: 'switch' }
      ])
    },
    {
      id: 'featureVideo', title: '3. Latest Launch Video', icon: <Video className="w-4 h-4 text-zinc-400" />,
      content: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Small Badge" value={featureVideoForm.smallBadge || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, smallBadge: e.target.value}))} />
            <div className="md:col-span-2">
              <Input label="Main Headline" value={featureVideoForm.headline || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, headline: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              <Input label="Description" textarea rows={3} value={featureVideoForm.description || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, description: e.target.value}))} />
            </div>
            <Input label="Trailer Button Text" value={featureVideoForm.trailerBtnText || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, trailerBtnText: e.target.value}))} />
            <Input label="Notes Button Text" value={featureVideoForm.notesBtnText || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, notesBtnText: e.target.value}))} />
            <div className="md:col-span-2">
              <Input label="Video URL Embed" value={featureVideoForm.videoUrl || ''} onChange={(e) => setFeatureVideoForm(prev => ({...prev, videoUrl: e.target.value}))} />
            </div>
            <div className="md:col-span-2">
              {renderMediaUpload('Video Thumbnail', featureVideoForm.thumbnailUrl, 'thumbnailUrl')}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <Button type="button" onClick={() => { setActiveEditorSection('featureVideo'); handleSingleSave('featureVideo', featureVideoForm); setActiveEditorSection(null); }} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Video Settings</Button>
          </div>
        </div>
      )
    },
    {
      id: 'initiatives', title: '4. Launch Initiatives Portfolio', icon: <Layers className="w-4 h-4 text-zinc-400" />,
      content: renderListManager('initiatives', [
        { key: 'title', label: 'Initiative Title', type: 'text' },
        { key: 'description', label: 'Initiative Description', type: 'textarea' },
        { key: 'status', label: 'Active Status', type: 'switch' }
      ])
    },
    {
      id: 'seo', title: '5. Search Engine Optimization', icon: <Search className="w-4 h-4 text-zinc-400" />,
      content: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <Input label="Meta Title" value={seoForm.metaTitle || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaTitle: e.target.value}))} />
            <Input label="Meta Description" textarea rows={2} value={seoForm.metaDescription || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaDescription: e.target.value}))} />
            <Input label="Meta Keywords (Comma separated)" value={seoForm.metaKeywords || ''} onChange={(e) => setSeoForm(prev => ({...prev, metaKeywords: e.target.value}))} />
            <div className="md:w-1/2">
              {renderMediaUpload('Open Graph Image (Social Share)', seoForm.ogImageUrl, 'ogImageUrl')}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <Button type="button" onClick={() => handleSingleSave('seo', seoForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save SEO Metadata</Button>
          </div>
        </div>
      )
    }
  ];

  const currentSections = selectedTab === 'campaigns' ? campaignsSections : launchesSections;

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm tracking-wide">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ACTION CONTROLS */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
            {selectedTab === 'campaigns' ? 'Campaigns CMS' : 'Product Launches CMS'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {selectedTab === 'campaigns' 
              ? 'Configure empowerment drives, coding challenges, lifecycle process, and success stories.' 
              : 'Configure software releases, product showcases, videos, and launch portfolios.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            type="button"
            onClick={handleGlobalAdd} 
            variant="primary" 
            size="sm" 
            className="gap-1.5 text-xs bg-luxury-gold text-black font-bold mr-2"
          >
            <Plus className="w-3.5 h-3.5" /> <span>{selectedTab === 'campaigns' ? 'Add Campaign' : 'Add Launch'}</span>
          </Button>

          <Button type="button" onClick={() => showToast(`💾 ${selectedTab === 'campaigns' ? 'Campaigns' : 'Launches'} Draft Saved Successfully!`)} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button type="button" onClick={() => { if (window.confirm("Reset unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button type="button" onClick={() => showToast("🚀 Public production server updated successfully. Page is Live!")} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start mt-2">
        {/* LEFT NAVIGATION SIDEBAR */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2">Page Modules</h3>
          <button 
            type="button"
            onClick={() => handleTabSwitch('campaigns')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'campaigns' ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/50 border border-transparent'}`}
          >
            <Layers className="w-4 h-4" /> Initiative Campaigns
          </button>
          <button 
            type="button"
            onClick={() => handleTabSwitch('launches')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${selectedTab === 'launches' ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shadow-inner' : 'text-zinc-400 hover:bg-zinc-900/50 border border-transparent'}`}
          >
            <Laptop className="w-4 h-4" /> Product Launches
          </button>
        </div>

        {/* ACCORDION BUILDER */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {currentSections.map((sec) => {
            const isCardOpen = expandedCards[sec.id];
            // Meta logic for Active/Inactive badge is optional here
            const isActive = true; // Hardcoded true for accordion display

            return (
              <div id={`section-${sec.id}`} key={sec.id}>
                <Card
                  className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-955/20 ${isCardOpen ? 'border-zinc-800/80' : 'border-zinc-800/40'}`}
                  title={
                    <div className="flex items-center justify-between w-full py-4 px-5 select-none bg-zinc-955/20 cursor-pointer" onClick={() => toggleCard(sec.id)}>
                      <div className="flex items-center gap-3 flex-1">
                        {sec.icon}
                        <h2 className="font-serif text-base font-medium text-zinc-100">{sec.title}</h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-zinc-600'}`} />
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider hidden sm:block">{isActive ? 'Active' : 'Hidden'}</span>
                        </div>
                        <div className={`text-zinc-500 transition-transform duration-300 ${isCardOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </div>
                  }
                >
                  {isCardOpen && (
                    <div className="p-6 border-t border-zinc-800/40 bg-black/20">
                      {sec.content}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingItemId !== null}
        onClose={() => { setDeletingItemId(null); setDeletingSection(null); }}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          const targetPage = selectedTab === 'campaigns' ? 'campaignsPage' : 'launchesPage';
          deleteNestedItem(targetPage, deletingSection, deletingItemId);
          setDeletingItemId(null);
          setDeletingSection(null);
          showToast("Record deleted successfully.");
        }}
      />
    </div>
  );
};
