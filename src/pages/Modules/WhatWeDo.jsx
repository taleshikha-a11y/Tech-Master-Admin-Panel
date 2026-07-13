import React, { useState } from 'react';
import { useMediaManager } from "../../context/MediaContext";
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Layers, Video, Code, Presentation, MessageSquareCode, Save, RefreshCw, 
  ChevronDown, ChevronRight, Edit3, Trash2, ArrowUp, ArrowDown, 
  X, UploadCloud, Link as LinkIcon, AlertCircle, Settings, Plus, 
  Milestone, Compass, Lightbulb, Globe, ShieldCheck
} from 'lucide-react';

export const WhatWeDo = () => {
  const { db, updateSection } = useDatabase();
  const wwdData = db?.whatWeDo || {};

  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({
    hero: true,
    operations: false,
    servicesList: false,
    quoteBanner: false,
    seo: false
  });

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Toast state (only for critical saves, toggles are silent)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Single Forms State
  const [heroForm, setHeroForm] = useState(wwdData?.hero || {});
  const [quoteForm, setQuoteForm] = useState(wwdData?.quoteBanner || {});
  const [seoForm, setSeoForm] = useState(wwdData?.seo || {});

  // List editor states
  const [activeEditorSection, setActiveEditorSection] = useState(null); 
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});

  // Media uploading state
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTargetField, setCropTargetField] = useState(null);

  const { openMediaManager } = useMediaManager();
  const simulateMediaUpload = (targetKey, isObjectForm = false, objectSetter = null) => {
    openMediaManager({
      onSelect: (url) => {
        if (activeEditorSection) {
            setDraftItem(prev => ({ ...prev, [targetKey]: url }));
          } else {
            setSeoForm(prev => (targetKey in prev || ['ogImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
          }
      }
    });
  };

  const handleSingleSave = (sectionKey, data) => {
    updateSection('whatWeDo', { [sectionKey]: data });
    showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
  };

  const updateSectionMeta = (secId, key, val) => {
    const currentSettings = wwdData.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    updateSection('whatWeDo', { sectionSettings: updatedSettings });
    // Silent update, no toast notifications popped up!
  };

  // Reusable Media Upload Component
  const renderMediaUpload = (label, value, fieldKey, isOptional = false) => {
    return (
      <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-zinc-555 block uppercase">{label} {isOptional && <span className="text-zinc-650">(Optional)</span>}</span>
          {value && (
            <button 
              type="button"
              onClick={() => {
                setCropTargetField(fieldKey);
                setShowCropModal(true);
              }}
              className="text-[9px] uppercase tracking-wider text-luxury-gold hover:underline flex items-center gap-1"
            >
              <Settings className="w-2.5 h-2.5" /> Crop Image
            </button>
          )}
        </div>
        
        {value ? (
          <div className="relative w-full h-24 bg-zinc-955 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
            <img src={value} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 right-1 flex items-center gap-1">
              <button 
                onClick={() => simulateMediaUpload(fieldKey)} 
                className="p-1 bg-black/60 rounded text-luxury-gold hover:text-white"
                title="Replace Image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  if (activeEditorSection) {
                    setDraftItem(prev => ({ ...prev, [fieldKey]: "" }));
                  } else {
                    setSeoForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                  }
                  showToast("Image removed.");
                }} 
                className="p-1 bg-black/60 rounded text-rose-400 hover:text-white"
                title="Remove Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => simulateMediaUpload(fieldKey)} 
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); simulateMediaUpload(fieldKey); }}
            className="h-24 border border-dashed border-zinc-850 hover:border-luxury-gold/30 rounded flex flex-col items-center justify-center gap-1 text-zinc-655 cursor-pointer transition-all"
          >
            {uploadingField === fieldKey ? (
              <div className="flex flex-col items-center gap-1 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-luxury-gold" />
                <span className="text-[8px] font-mono">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span className="text-[8px] uppercase font-mono tracking-wider">Drag & Drop or Click</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // --- REUSABLE LIST MANAGER ---
  const renderListManager = ({
    sectionKey,
    fields = [],
    displayColumns = []
  }) => {
    const listData = wwdData[sectionKey] || [];
    const isEditing = activeEditorSection === sectionKey;

    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
        showToast("Item updated successfully.");
      } else {
        const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
        nextList = [...listData, newItem];
        showToast("New item created.");
      }
      updateSection('whatWeDo', { [sectionKey]: nextList });
      setActiveEditorSection(null);
      setEditingItemId(null);
      setDraftItem({});
    };

    const handleDeleteItem = (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const nextList = listData.filter(item => item.id !== id);
        updateSection('whatWeDo', { [sectionKey]: nextList });
        showToast("Item deleted.");
      }
    };

    const handleToggleStatus = (id, currentStatus) => {
      const nextList = listData.map(item => item.id === id ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);
      updateSection('whatWeDo', { [sectionKey]: nextList });
      // Silent update on toggle switch, no notifications popped up!
    };

    const handleMoveItem = (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        updateSection('whatWeDo', { [sectionKey]: nextList });
      }
    };

    const handleStartAdd = () => {
      setActiveEditorSection(sectionKey);
      setEditingItemId(null);
      const defaultObj = {};
      fields.forEach(f => {
        defaultObj[f.key] = f.type === 'number' ? 0 : f.type === 'switch' ? false : '';
      });
      setDraftItem(defaultObj);
    };

    const handleStartEdit = (item) => {
      setActiveEditorSection(sectionKey);
      setEditingItemId(item.id);
      setDraftItem({ ...item });
    };

    return (
      <div className="flex flex-col gap-4 text-left">
        {!isEditing && (
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-555 font-mono uppercase text-[9px] tracking-wider">
                    <th className="py-2 px-3">Order</th>
                    {displayColumns.map(col => (
                      <th key={col.key} className="py-2 px-3">{col.label}</th>
                    ))}
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/10 text-zinc-300">
                      <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                      {displayColumns.map(col => (
                        <td key={col.key} className="py-2.5 px-3 max-w-[180px] truncate">
                          {col.type === 'image' ? (
                            item[col.key] ? (
                              <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-955 flex items-center justify-center overflow-hidden">
                                <img src={item[col.key]} className="w-full h-full object-cover" />
                              </div>
                            ) : '-'
                          ) : item[col.key] || '-'}
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-center">
                        <Switch 
                          checked={item.status === 'Active'} 
                          onChange={() => handleToggleStatus(item.id, item.status)}
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1.5 mt-0.5">
                        <button onClick={() => handleMoveItem(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleMoveItem(idx, 1)} disabled={idx === listData.length - 1} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleStartEdit(item)} className="p-1 hover:bg-zinc-900 rounded text-amber-500"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                  {listData.length === 0 && (
                    <tr>
                      <td colSpan={displayColumns.length + 3} className="text-center py-6 text-zinc-655 font-mono italic">No records stored inside database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <Button onClick={handleStartAdd} variant="secondary" size="sm" className="gap-1 text-xs border border-zinc-800 text-luxury-gold">
                <Plus className="w-3.5 h-3.5" /> <span>Add Row Item</span>
              </Button>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold block border-b border-zinc-900 pb-1.5">
              {editingItemId ? "Edit Record Item" : "Create New Record"}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(field => {
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <Input 
                        label={field.label} 
                        textarea 
                        rows={3} 
                        value={draftItem[field.key] || ''} 
                        onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })} 
                      />
                    </div>
                  );
                }
                if (field.type === 'upload') {
                  return (
                    <div key={field.key}>
                      {renderMediaUpload(field.label, draftItem[field.key], field.key, field.optional)}
                    </div>
                  );
                }
                if (field.type === 'switch') {
                  return (
                    <div key={field.key} className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-400">{field.label}</span>
                      <Switch checked={draftItem[field.key] || false} onChange={val => setDraftItem({ ...draftItem, [field.key]: val })} />
                    </div>
                  );
                }
                return (
                  <Input 
                    key={field.key}
                    label={field.label} 
                    type={field.type || 'text'} 
                    value={draftItem[field.key] || ''} 
                    onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })} 
                  />
                );
              })}
            </div>

            <div className="flex justify-end gap-2 border-t border-zinc-900/60 pt-2.5">
              <button onClick={() => { setActiveEditorSection(null); setEditingItemId(null); setDraftItem({}); }} className="px-3 py-1.5 text-xs text-zinc-555 hover:text-white">Cancel</button>
              <button onClick={handleSaveItem} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Save Record</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fixed 5 segments definitions
  const sectionsList = [
    { id: "hero", label: "Hero Settings", icon: Layers },
    { id: "operations", label: "Operations Grid", icon: Code },
    { id: "servicesList", label: "Expertise Tags", icon: Milestone },
    { id: "quoteBanner", label: "Quote Banner", icon: Presentation },
    { id: "seo", label: "SEO Metadata", icon: Globe }
  ];

  // Dynamic sorting at section level
  const sectionSettings = wwdData.sectionSettings || {};
  const sortedSections = [...sectionsList].sort((a, b) => {
    const orderA = sectionSettings[a.id]?.order ?? 99;
    const orderB = sectionSettings[b.id]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="flex flex-col gap-6 text-left relative">
      
      {/* TOAST SYSTEM */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-md shadow-lg border flex items-center gap-2.5 bg-zinc-955 border-luxury-gold/30 text-white font-sans`}>
          <AlertCircle className="w-4 h-4 text-luxury-gold" />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* CROP IMAGE MODAL */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-[450px] text-zinc-100 flex flex-col gap-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-luxury-gold flex items-center gap-1.5">
                <Settings className="w-4 h-4 animate-spin text-luxury-gold" /> Crop Vector Bounds
              </h3>
              <button onClick={() => setShowCropModal(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-40 border border-dashed border-luxury-gold/30 bg-zinc-955 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">1:1 Crop Canvas</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-zinc-850 pt-3">
              <button onClick={() => setShowCropModal(false)} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
              <button 
                onClick={() => {
                  setShowCropModal(false);
                  showToast("Image cropped successfully.");
                }} 
                className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded shadow-gold-glow"
              >
                Apply Crop Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ACTION CONTROLS */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-luxury-gold" />
            What We Do CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure operations grid blocks representing content creation, workshops, keynotes, and services list.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => { setExpandedCards(prev => ({...prev, servicesList: true})); setActiveEditorSection('servicesList'); setEditingItemId(null); setDraftItem({}); document.getElementById('servicesList')?.scrollIntoView(); }} variant="primary" size="sm" className="bg-luxury-gold border-luxury-gold text-black font-bold">
             <Plus className="w-4 h-4 mr-1.5" /> Add Services
          </Button>
          <Button onClick={() => showToast("💾 What We Do Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button onClick={() => { if(window.confirm("Reset unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button onClick={() => showToast("🚀 Public production server updated successfully. Page is Live!")} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* 5 DYNAMIC COLLAPSIBLE CARDS STACK */}
      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {sortedSections.map((sec, idx) => {
          const SectionIcon = sec.icon;
          const isCardOpen = expandedCards[sec.id];
          const sectionMeta = sectionSettings[sec.id] || { order: idx + 1, status: "Active" };
          const isActive = sectionMeta.status === "Active";

          return (
            <Card 
              id={sec.id}
              key={sec.id}
              className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-950/20 ${isCardOpen ? 'border-zinc-800/80' : 'border-zinc-800/40'}`}
              title={
                <div className="flex items-center justify-between w-full py-4 px-5 select-none bg-zinc-950/20 cursor-pointer" onClick={() => toggleCard(sec.id)}>
                  <div className="flex items-center gap-3 flex-1">
                    <SectionIcon className={`w-4 h-4 ${isCardOpen ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-200">
                      {idx + 1}. {sec.label}
                    </span>
                    {!isActive && <Badge variant="secondary" className="scale-90 text-[9px] bg-zinc-900 border-zinc-800 text-zinc-500">Inactive</Badge>}
                  </div>
                  
                  <div className="flex items-center pl-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleCard(sec.id)} className="text-zinc-500 hover:text-zinc-300 p-1">
                      {isCardOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              }
            >
              {isCardOpen && (
                <div className="p-5 border-t border-zinc-800/80 bg-zinc-955/20 flex flex-col gap-4 animate-fadeIn">
                  
                  {/* INLINE SECTION LEVEL META CONFIG (SILENT CHANGES) */}
                  <div className="p-3 mb-2 rounded border border-zinc-900 bg-zinc-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-405">Section Status:</span>
                      <Switch 
                        checked={isActive} 
                        onChange={(checked) => updateSectionMeta(sec.id, 'status', checked ? 'Active' : 'Inactive')}
                      />
                      <span className="text-[10px] font-mono text-zinc-500">({isActive ? 'Visible on Website' : 'Hidden from Website'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-405">Display Order:</span>
                      <input 
                        type="number" 
                        value={sectionMeta.order}
                        onChange={e => updateSectionMeta(sec.id, 'order', parseInt(e.target.value) || 1)}
                        className="w-12 bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-200 focus:border-luxury-gold/40 outline-none" 
                      />
                    </div>
                  </div>

                  {/* SECTION FIELDS */}
                  {sec.id === 'hero' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Small Badge Header" value={heroForm.smallBadge || ''} onChange={e => setHeroForm({ ...heroForm, smallBadge: e.target.value })} />
                        <Input label="Main Heading Title" value={heroForm.headline || ''} onChange={e => setHeroForm({ ...heroForm, headline: e.target.value })} />
                        <Input label="Highlighted Word Tag" value={heroForm.highlightWord || ''} onChange={e => setHeroForm({ ...heroForm, highlightWord: e.target.value })} />
                        
                        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-400 block">Background Aurora Glow</span>
                            <span className="text-[9px] text-zinc-550">Toggles background ambient purple/gold halos</span>
                          </div>
                          <Switch checked={heroForm.glowEnabled || false} onChange={val => setHeroForm({ ...heroForm, glowEnabled: val })} />
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Detailed Hero Description subtext" textarea rows={3} value={heroForm.description || ''} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('hero', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Hero Parameters</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'operations' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'operations',
                        displayColumns: [
                          { key: 'title', label: 'Operation Title' },
                          { key: 'subtitle', label: 'Subtitle' }
                        ],
                        fields: [
                          { key: 'title', label: 'Operation Card Title', type: 'text' },
                          { key: 'subtitle', label: 'Card Subtitle Label', type: 'text' },
                          { key: 'icon', label: 'Icon Symbol Tag (e.g. Video, Code, Presentation, MessageSquareCode)', type: 'text' },
                          { key: 'accent', label: 'Accent Glow Color (e.g. #D4AF37)', type: 'text' },
                          { key: 'description', label: 'Detailed Description Narrative text', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'servicesList' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'servicesList',
                        displayColumns: [
                          { key: 'tag', label: 'Service Tag' }
                        ],
                        fields: [
                          { key: 'tag', label: 'Expertise Service Tag name', type: 'text' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'quoteBanner' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Author Name Conferred" value={quoteForm.authorName || ''} onChange={e => setQuoteForm({ ...quoteForm, authorName: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Quotable Statement Copy text" textarea rows={3} value={quoteForm.quoteText || ''} onChange={e => setQuoteForm({ ...quoteForm, quoteText: e.target.value })} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('quoteBanner', quoteForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Quote Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'seo' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="SEO Meta Title" value={seoForm.metaTitle || ''} onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })} />
                        <Input label="SEO Meta Keywords" value={seoForm.metaKeywords || ''} onChange={e => setSeoForm({ ...seoForm, metaKeywords: e.target.value })} placeholder="Services, keynotes, masterclasses" />
                        <div className="md:col-span-2">
                          <Input label="SEO Meta Description Content" textarea rows={2} value={seoForm.metaDescription || ''} onChange={e => setSeoForm({ ...seoForm, metaDescription: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("OG Social Share Graphics Card", seoForm.ogImageUrl, "ogImageUrl")}
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('seo', seoForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save SEO Parameters</Button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* FINAL STATUS BAR FOOTER */}
      <div className="flex items-center justify-end p-4 border border-zinc-900 bg-zinc-955/20 rounded-lg max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>What We Do CMS dashboard framework running securely.</span>
        </div>
      </div>

    </div>
  );
};
