import React, { useState, useEffect } from 'react';
import { useMediaManager } from "../../context/MediaContext";
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Target, Eye, Save, RefreshCw, ChevronDown, ChevronRight, 
  Edit3, Trash2, ArrowUp, ArrowDown, X, UploadCloud, 
  Link as LinkIcon, AlertCircle, Settings, Plus, Milestone, 
  Compass, Lightbulb, Globe, ShieldCheck
} from 'lucide-react';
import {
  getMissionVision,
  updateHero,
  updateMission,
  updateVision,
  updateCTA,
  updateSEO,
  addCoreValue,
  updateCoreValue,
  deleteCoreValue,
  addBrandPillar,
  addRoadmap,
  saveDraft,
  publish
} from "../../Services/missionVisionService";

export const MissionVision = () => {
  const { updateSection } = useDatabase();

const [mvData, setMvData] = useState({});

useEffect(() => {
  fetchMissionVision();
}, []);

const fetchMissionVision = async () => {
  try {
    const response = await getMissionVision();

    setMvData(response.data?.data || response.data || {});

  } catch (error) {
    console.log("Mission Vision Fetch Error:", error);
  }
};

  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({
    hero: true,
    mission: false,
    vision: false,
    coreValues: false,
    brandPillars: false,
    roadmap: false,
    cta: false,
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
  const [heroForm, setHeroForm] = useState(mvData?.hero || {});
  useEffect(() => {
  if(mvData){
    setHeroForm(mvData.hero || {});
    setMissionForm(mvData.mission || {});
    setVisionForm(mvData.vision || {});
    setCtaForm(mvData.cta || {});
    setSeoForm(mvData.seo || {});
  }
}, [mvData]);
  const [missionForm, setMissionForm] = useState(mvData?.mission || {});
  const [visionForm, setVisionForm] = useState(mvData?.vision || {});
  const [ctaForm, setCtaForm] = useState(mvData?.cta || {});
  const [seoForm, setSeoForm] = useState(mvData?.seo || {});

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
          setHeroForm(prev => (targetKey in prev ? { ...prev, [targetKey]: url } : prev));
          setMissionForm(prev => (targetKey in prev ? { ...prev, [targetKey]: url } : prev));
          setVisionForm(prev => (targetKey in prev ? { ...prev, [targetKey]: url } : prev));
          setSeoForm(prev => (targetKey in prev || ['ogImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
        }
      }
    });
  };

 const handleSingleSave = async (sectionKey, data) => {

  try {

    if(sectionKey === "hero"){
      await updateHero(data);
    }

    if(sectionKey === "mission"){
      await updateMission(data);
    }

    if(sectionKey === "vision"){
      await updateVision(data);
    }

    if(sectionKey === "cta"){
      await updateCTA(data);
    }

    if(sectionKey === "seo"){
      await updateSEO(data);
    }


    showToast(
      `${sectionKey.toUpperCase()} updated successfully`
    );

    fetchMissionVision();

  } catch(error){

    console.log(error);
    showToast("Update failed","error");

  }

};

  const updateSectionMeta = (secId, key, val) => {
    const currentSettings = mvData.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    updateSection('missionVision', { sectionSettings: updatedSettings });
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
                    setHeroForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setMissionForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setVisionForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
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
    displayColumns = [],
    maxItems = 99
  }) => {
    const listData = mvData[sectionKey] || [];
    const isEditing = activeEditorSection === sectionKey;

    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
        showToast("Item updated successfully.");
      } else {
        if (listData.length >= maxItems) {
          showToast(`Maximum limit of ${maxItems} items reached.`, 'error');
          return;
        }
        const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
        nextList = [...listData, newItem];
        showToast("New item created.");
      }
      updateSection('missionVision', { [sectionKey]: nextList });
      setActiveEditorSection(null);
      setEditingItemId(null);
      setDraftItem({});
    };

    const handleDeleteItem = (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const nextList = listData.filter(item => item.id !== id);
        updateSection('missionVision', { [sectionKey]: nextList });
        showToast("Item deleted.");
      }
    };

    const handleToggleStatus = (id, currentStatus) => {
      const nextList = listData.map(item => item.id === id ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);
      updateSection('missionVision', { [sectionKey]: nextList });
      // Silent update on toggle switch, no notifications popped up!
    };

    const handleMoveItem = (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        updateSection('missionVision', { [sectionKey]: nextList });
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
            {listData.length < maxItems && (
              <div>
                <Button onClick={handleStartAdd} variant="secondary" size="sm" className="gap-1 text-xs border border-zinc-800 text-luxury-gold">
                  <Plus className="w-3.5 h-3.5" /> <span>Add Row Item</span>
                </Button>
              </div>
            )}
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
                if (field.type === 'select') {
                  return (
                    <div key={field.key} className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                      <select 
                        className="bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 outline-none focus:border-luxury-gold/30" 
                        value={draftItem[field.key] || field.options[0]} 
                        onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })}
                      >
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
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

  // Fixed 8 segments definitions
  const sectionsList = [
    { id: "hero", label: "Hero Banner", icon: Target },
    { id: "mission", label: "Mission Core", icon: Compass },
    { id: "vision", label: "Vision Core", icon: Eye },
    { id: "coreValues", label: "Core Values", icon: Lightbulb },
    { id: "brandPillars", label: "Brand Pillars", icon: Milestone },
    { id: "roadmap", label: "Strategic Roadmap", icon: Compass },
    { id: "cta", label: "CTA Banner", icon: Target },
    { id: "seo", label: "SEO Parameters", icon: Globe }
  ];

  // Dynamic sorting at section level
  const sectionSettings = mvData.sectionSettings || {};
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
          <div className="bg-zinc-900 border border-zinc-805 p-6 rounded-xl w-[450px] text-zinc-100 flex flex-col gap-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-luxury-gold flex items-center gap-1.5">
                <Settings className="w-4 h-4 animate-spin text-luxury-gold" /> Crop Vector Bounds
              </h3>
              <button onClick={() => setShowCropModal(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-40 border border-dashed border-luxury-gold/30 bg-zinc-950 rounded flex items-center justify-center relative overflow-hidden">
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
            <Target className="w-5 h-5 text-luxury-gold" />
            Mission & Vision CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Maintain fixed core philosophy blocks, brand pillars, and strategic milestone roadmap metrics.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => { setExpandedCards(prev => ({...prev, coreValues: true})); setActiveEditorSection('coreValues'); setEditingItemId(null); setDraftItem({}); document.getElementById('coreValues')?.scrollIntoView(); }} variant="secondary" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-300">
             <Plus className="w-4 h-4 mr-1.5" /> Add Core Value
          </Button>
          <Button onClick={() => showToast("💾 Mission & Vision Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
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

      {/* 8 DYNAMIC COLLAPSIBLE CARDS STACK */}
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
              className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-955/20 ${isCardOpen ? 'border-zinc-800/80' : 'border-zinc-800/40'}`}
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
                        <Input label="Small Label Header" value={heroForm.smallLabel || ''} onChange={e => setHeroForm({ ...heroForm, smallLabel: e.target.value })} />
                        <Input label="Main Heading Title" value={heroForm.headline || ''} onChange={e => setHeroForm({ ...heroForm, headline: e.target.value })} />
                        <Input label="Highlighted Word Tag" value={heroForm.highlightWord || ''} onChange={e => setHeroForm({ ...heroForm, highlightWord: e.target.value })} />
                        <Input label="Button 1 Text Label" value={heroForm.button1Text || ''} onChange={e => setHeroForm({ ...heroForm, button1Text: e.target.value })} />
                        
                        <Input label="Button 1 Redirect Link" value={heroForm.button1Link || ''} onChange={e => setHeroForm({ ...heroForm, button1Link: e.target.value })} />
                        <Input label="Button 2 Text Label" value={heroForm.button2Text || ''} onChange={e => setHeroForm({ ...heroForm, button2Text: e.target.value })} />
                        <Input label="Button 2 Redirect Link" value={heroForm.button2Link || ''} onChange={e => setHeroForm({ ...heroForm, button2Link: e.target.value })} />

                        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-400 block">Show Scroll Indicator</span>
                            <span className="text-[9px] text-zinc-550">Toggles the animated down arrow icon</span>
                          </div>
                          <Switch checked={heroForm.scrollIndicatorVisible || false} onChange={val => setHeroForm({ ...heroForm, scrollIndicatorVisible: val })} />
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Detailed Hero Subtext Description" textarea rows={3} value={heroForm.description || ''} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} />
                        </div>

                        {renderMediaUpload("Background Image Overlay", heroForm.backgroundImage, "backgroundImage")}
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('hero', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Hero Parameters</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'mission' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Mission Main Heading" value={missionForm.heading || ''} onChange={e => setMissionForm({ ...missionForm, heading: e.target.value })} />
                        <Input label="Mission Sub Heading Tag" value={missionForm.subHeading || ''} onChange={e => setMissionForm({ ...missionForm, subHeading: e.target.value })} />
                        <Input label="Left Accent Border Color" value={missionForm.leftBorderColor || ''} onChange={e => setMissionForm({ ...missionForm, leftBorderColor: e.target.value })} placeholder="e.g. #D4AF37" />
                        <Input label="Mission Icon Code Symbol" value={missionForm.missionIcon || ''} onChange={e => setMissionForm({ ...missionForm, missionIcon: e.target.value })} placeholder="e.g. Target, Eye" />
                        
                        <Input label="CTA Button Text" value={missionForm.buttonText || ''} onChange={e => setMissionForm({ ...missionForm, buttonText: e.target.value })} />
                        <Input label="CTA Redirect URL" value={missionForm.buttonUrl || ''} onChange={e => setMissionForm({ ...missionForm, buttonUrl: e.target.value })} />

                        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-400 block">Glassmorphism Effect</span>
                            <span className="text-[9px] text-zinc-550">Toggles luxury glass overlay visual filters</span>
                          </div>
                          <Switch checked={missionForm.glassEffect || false} onChange={val => setMissionForm({ ...missionForm, glassEffect: val })} />
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Mission Copywrite Statement Description" textarea rows={3} value={missionForm.description || ''} onChange={e => setMissionForm({ ...missionForm, description: e.target.value })} />
                        </div>

                        <div className="md:col-span-2">
                          {renderMediaUpload("Mission Cover Image", missionForm.missionImage, "missionImage")}
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('mission', missionForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Mission Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'vision' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Vision Main Heading" value={visionForm.heading || ''} onChange={e => setVisionForm({ ...visionForm, heading: e.target.value })} />
                        <Input label="Vision Sub Heading Tag" value={visionForm.subHeading || ''} onChange={e => setVisionForm({ ...visionForm, subHeading: e.target.value })} />
                        <Input label="Accent Tone Color Code" value={visionForm.accentColor || ''} onChange={e => setVisionForm({ ...visionForm, accentColor: e.target.value })} placeholder="e.g. #00E5FF" />
                        <Input label="Vision Icon Code Symbol" value={visionForm.visionIcon || ''} onChange={e => setVisionForm({ ...visionForm, visionIcon: e.target.value })} placeholder="e.g. Eye, Compass" />
                        
                        <Input label="CTA Button Text" value={visionForm.buttonText || ''} onChange={e => setVisionForm({ ...visionForm, buttonText: e.target.value })} />
                        <Input label="CTA Redirect URL" value={visionForm.buttonUrl || ''} onChange={e => setVisionForm({ ...visionForm, buttonUrl: e.target.value })} />

                        <div className="md:col-span-2">
                          <Input label="Vision Copywrite Statement Description" textarea rows={3} value={visionForm.description || ''} onChange={e => setVisionForm({ ...visionForm, description: e.target.value })} />
                        </div>

                        <div className="md:col-span-2">
                          {renderMediaUpload("Vision Cover Image", visionForm.visionImage, "visionImage")}
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('vision', visionForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Vision Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'coreValues' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'coreValues',
                        maxItems: 12,
                        displayColumns: [
                          { key: 'title', label: 'Value Title' },
                          { key: 'icon', label: 'Icon Code' }
                        ],
                        fields: [
                          { key: 'title', label: 'Value Pillar Title', type: 'text' },
                          { key: 'icon', label: 'Icon Symbol Tag (e.g. Compass, Eye, ShieldCheck)', type: 'text' },
                          { key: 'accentColor', label: 'Pillar Accent Color (e.g. #D4AF37)', type: 'text' },
                          { key: 'description', label: 'Value Description Statement', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'brandPillars' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'brandPillars',
                        displayColumns: [
                          { key: 'title', label: 'Pillar Title' },
                          { key: 'subtitle', label: 'Subtitle' }
                        ],
                        fields: [
                          { key: 'title', label: 'Brand Pillar Title', type: 'text' },
                          { key: 'subtitle', label: 'Card Subtitle Tagline', type: 'text' },
                          { key: 'icon', label: 'Icon Code Symbol', type: 'text' },
                          { key: 'borderColor', label: 'Border Color Code (e.g. #D4AF37)', type: 'text' },
                          { key: 'hoverColor', label: 'Hover Glow Accent Tone', type: 'text' },
                          { key: 'description', label: 'Detailed Description Narrative text', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'roadmap' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'roadmap',
                        displayColumns: [
                          { key: 'quarter', label: 'Quarter' },
                          { key: 'year', label: 'Year' },
                          { key: 'title', label: 'Goal Title' }
                        ],
                        fields: [
                          { key: 'quarter', label: 'Quarter Name (e.g. Q3, Q4)', type: 'text' },
                          { key: 'year', label: 'Year Period', type: 'text' },
                          { key: 'title', label: 'Timeline Goal Title', type: 'text' },
                          { key: 'goal', label: 'Long Goal Description', type: 'text' },
                          { key: 'accentColor', label: 'Timeline Node Accent Tone', type: 'text' },
                          { key: 'status', label: 'Progress Status', type: 'select', options: ['Planning', 'In Progress', 'Completed', 'Upcoming'] },
                          { key: 'description', label: 'Strategic Milestone Narrative Description', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'cta' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="CTA Title Heading" value={ctaForm.heading || ''} onChange={e => setCtaForm({ ...ctaForm, heading: e.target.value })} />
                        <Input label="Primary Button Text" value={ctaForm.primaryButtonText || ''} onChange={e => setCtaForm({ ...ctaForm, primaryButtonText: e.target.value })} />
                        <Input label="Primary Button Redirect Link" value={ctaForm.primaryButtonLink || ''} onChange={e => setCtaForm({ ...ctaForm, primaryButtonLink: e.target.value })} />
                        <Input label="Secondary Button Text" value={ctaForm.secondaryButtonText || ''} onChange={e => setCtaForm({ ...ctaForm, secondaryButtonText: e.target.value })} />
                        
                        <Input label="Secondary Button Redirect Link" value={ctaForm.secondaryButtonLink || ''} onChange={e => setCtaForm({ ...ctaForm, secondaryButtonLink: e.target.value })} />
                        <Input label="Background Gradient Style" value={ctaForm.backgroundGradient || ''} onChange={e => setCtaForm({ ...ctaForm, backgroundGradient: e.target.value })} placeholder="e.g. linear-gradient(to right, #000, #111)" />

                        <div className="md:col-span-2">
                          <Input label="CTA Section Copywriting Subtext Description" textarea rows={3} value={ctaForm.description || ''} onChange={e => setCtaForm({ ...ctaForm, description: e.target.value })} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('cta', ctaForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save CTA Parameters</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'seo' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="SEO Meta Title" value={seoForm.metaTitle || ''} onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })} />
                        <Input label="SEO Meta Keywords" value={seoForm.metaKeywords || ''} onChange={e => setSeoForm({ ...seoForm, metaKeywords: e.target.value })} placeholder="Mission, Vision, Roadmap" />
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
          <span>Mission & Vision CMS dashboard framework running securely.</span>
        </div>
      </div>

    </div>
  );
};
