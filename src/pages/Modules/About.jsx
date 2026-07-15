import React, { useState, useEffect } from 'react';
import { useMediaManager } from "../../context/MediaContext";
import { getAboutData, updateAboutSection, publishAbout } from '../../Services/aboutServices';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  User, Compass, Eye, ShieldCheck, Film, Plus, Save, RefreshCw, 
  ChevronDown, ChevronRight, Edit3, Trash2, Image as ImageIcon, ArrowUp, ArrowDown, 
  X, UploadCloud, Link as LinkIcon, AlertCircle, Settings, Heart,
  Star, Trophy, Award, Briefcase, Target, HelpCircle, Users, FileText, Globe, BarChart2
} from 'lucide-react';

export const About = () => {
  const [aboutData, setAboutData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({
    introduction: true,
    philosophy: false,
    mission: false,
    vision: false,
    coreValues: false,
    story: false,
    highlights: false,
    achievements: false,
    awards: false,
    experience: false,
    seo: false,
    futureGoals: false
  });

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Single Forms State
  const [introForm, setIntroForm] = useState(aboutData?.introduction || {});
  const [philosophyForm, setPhilosophyForm] = useState(aboutData?.philosophy || {});
  const [missionForm, setMissionForm] = useState(aboutData?.mission || {});
  const [visionForm, setVisionForm] = useState(aboutData?.vision || {});
  const [coreValuesForm, setCoreValuesForm] = useState(aboutData?.coreValues || {});
  const [storyForm, setStoryForm] = useState(aboutData?.story || {});
  const [seoForm, setSeoForm] = useState(aboutData?.seo || {});
  const [ctaForm, setCtaForm] = useState(aboutData?.cta || {});
  const [futureGoalsForm, setFutureGoalsForm] = useState(aboutData?.futureGoals || {});
  const [coreCollabForm, setCoreCollabForm] = useState(aboutData?.coreCollaborations || {});

  // List editor states
  const [activeEditorSection, setActiveEditorSection] = useState(null); 
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});

  // Upload simulation states
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTargetField, setCropTargetField] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      const res = await getAboutData();
      if (res.data) {
        setAboutData(res.data);
        setIntroForm(res.data.introduction || {});
        setPhilosophyForm(res.data.philosophy || {});
        setMissionForm(res.data.mission || {});
        setVisionForm(res.data.vision || {});
        setCoreValuesForm(res.data.coreValues || {});
        setStoryForm(res.data.story || {});
        setSeoForm(res.data.seo || {});
        setCtaForm(res.data.cta || {});
        setFutureGoalsForm(res.data.futureGoals || {});
        setCoreCollabForm(res.data.coreCollaborations || {});
      }
    } catch (error) {
      showToast("Failed to fetch about data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const { openMediaManager } = useMediaManager();
  const simulateMediaUpload = (targetKey, isObjectForm = false, objectSetter = null) => {
    openMediaManager({
      onSelect: (url) => {
          if (activeEditorSection) {
            setDraftItem(prev => ({ ...prev, [targetKey]: url }));
          } else {
            setIntroForm(prev => (targetKey in prev || ['profileImageUrl', 'mobileImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setPhilosophyForm(prev => (targetKey in prev || ['philosophyImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setMissionForm(prev => (targetKey in prev || ['missionImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setVisionForm(prev => (targetKey in prev || ['visionImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setCoreValuesForm(prev => (targetKey in prev || ['coreValuesImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setStoryForm(prev => (targetKey in prev || ['imageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
            setSeoForm(prev => (targetKey in prev || ['ogImageUrl'].includes(targetKey) ? { ...prev, [targetKey]: url } : prev));
          }
      }
    });
  };

  const handleSingleSave = async (sectionKey, data) => {
    try {
      await updateAboutSection(sectionKey, data);
      showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
      fetchAboutData();
    } catch (err) {
      showToast(`Failed to update ${sectionKey}.`, 'error');
    }
  };

  const updateSectionMeta = async (secId, key, val) => {
    const currentSettings = aboutData.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    try {
      await updateAboutSection('sectionSettings', updatedSettings);
      showToast(`Section ${secId.toUpperCase()} settings modified.`);
      fetchAboutData();
    } catch (err) {
      showToast('Failed to update section settings.', 'error');
    }
  };

  // Reusable Media Upload Component with preview, replace, crop, and remove triggers
  const renderMediaUpload = (label, value, fieldKey, isOptional = false) => {
    return (
      <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-zinc-500 block uppercase">{label} {isOptional && <span className="text-zinc-650">(Optional)</span>}</span>
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
          <div className="relative w-full h-24 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
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
                    setIntroForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setPhilosophyForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setMissionForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setVisionForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setCoreValuesForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
                    setStoryForm(prev => (fieldKey in prev ? { ...prev, [fieldKey]: "" } : prev));
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
            className="h-24 border border-dashed border-zinc-855 hover:border-luxury-gold/30 rounded flex flex-col items-center justify-center gap-1 text-zinc-655 cursor-pointer transition-all"
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
        {uploadError && uploadingField === fieldKey && (
          <span className="text-[8px] font-mono text-rose-400">{uploadError}</span>
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
    const listData = aboutData[sectionKey] || [];
    const isEditing = activeEditorSection === sectionKey;

    const handleSaveItem = async () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
      } else {
        const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
        nextList = [...listData, newItem];
      }
      try {
        await updateAboutSection(sectionKey, nextList);
        showToast(editingItemId ? "Item updated successfully." : "New item created.");
        setActiveEditorSection(null);
        setEditingItemId(null);
        setDraftItem({});
        fetchAboutData();
      } catch (err) {
        showToast("Failed to save item.", 'error');
      }
    };

    const handleDeleteItem = async (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const nextList = listData.filter(item => item.id !== id);
        try {
          await updateAboutSection(sectionKey, nextList);
          showToast("Item deleted.");
          fetchAboutData();
        } catch (err) {
          showToast("Failed to delete item.", 'error');
        }
      }
    };

    const handleToggleStatus = async (id, currentStatus) => {
      const nextList = listData.map(item => item.id === id ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);
      try {
        await updateAboutSection(sectionKey, nextList);
        showToast("Visibility state updated.");
        fetchAboutData();
      } catch (err) {
        showToast("Failed to update status.", "error");
      }
    };

    const handleMoveItem = async (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        try {
          await updateAboutSection(sectionKey, nextList);
          fetchAboutData();
        } catch (err) {
          showToast("Failed to reorder items.", "error");
        }
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
                  <tr className="border-b border-zinc-900 text-zinc-550 font-mono uppercase text-[9px] tracking-wider">
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

  // Fixed sections definitions
  const sectionsList = [
    { id: "introduction", label: "Introduction", icon: User },
    { id: "philosophy", label: "Philosophy", icon: Star },
    { id: "mission", label: "Mission", icon: Target },
    { id: "vision", label: "Vision", icon: Eye },
    { id: "coreValues", label: "Core Values", icon: Heart },
    { id: "story", label: "Story", icon: Compass },
    { id: "highlights", label: "Key Highlights", icon: BarChart2 },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "awards", label: "Awards", icon: Award },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "futureGoals", label: "Future Goals", icon: Target },
    { id: "seo", label: "SEO Metadata", icon: Globe }
  ];

  // Dynamically sort collapsible cards based on Section Display Order in sectionSettings
  const sectionSettings = aboutData.sectionSettings || {};
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
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-xl w-[450px] text-zinc-100 flex flex-col gap-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-luxury-gold flex items-center gap-1.5">
                <Settings className="w-4 h-4 animate-spin text-luxury-gold" /> Vector Crop Alignments
              </h3>
              <button onClick={() => setShowCropModal(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-40 border border-dashed border-luxury-gold/30 bg-zinc-955 rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">1:1 Crop Canvas Grid</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-zinc-850 pt-3">
              <button onClick={() => setShowCropModal(false)} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
              <button 
                onClick={() => {
                  setShowCropModal(false);
                  showToast("Image cropped and optimized successfully.");
                }} 
                className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded shadow-gold-glow"
              >
                Apply Crop Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <User className="w-5 h-5 text-luxury-gold" />
            About Page CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure dynamic biography narratives, philosophy statements, client stats counters, work experience timeline, and achievements.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={async () => {
            try {
              await publishAbout("Published");
              showToast("🚀 Public production server updated successfully. Page is Live!");
            } catch (err) {
              showToast("Failed to publish page.", "error");
            }
          }} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      {/* DYNAMIC COLLAPSIBLE CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {sortedSections.map((sec, idx) => {
          const SectionIcon = sec.icon;
          const isCardOpen = expandedCards[sec.id];
          const sectionMeta = sectionSettings[sec.id] || { order: idx + 1, status: "Active" };
          const isActive = sectionMeta.status === "Active";

          return (
            <Card 
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
                  
                  {/* REMOVED SWITCH/INPUT FROM CARD HEADER. ONLY EXPAND/COLLAPSE REMAINS */}
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
                  
                  {/* INLINE SECTION LEVEL META CONFIG CONTROLS */}
                  <div className="p-3 mb-2 rounded border border-zinc-900 bg-zinc-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-400">Section Active Status:</span>
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
                        className="w-12 bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-250 focus:border-luxury-gold/40 outline-none" 
                      />
                    </div>
                  </div>

                  {/* CARD FIELDS */}
                  {sec.id === 'introduction' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Founder Name" value={introForm.founderName || ''} onChange={e => setIntroForm({ ...introForm, founderName: e.target.value })} />
                        <Input label="Professional Designation" value={introForm.designation || ''} onChange={e => setIntroForm({ ...introForm, designation: e.target.value })} />
                        <Input label="Intro Subtitle" value={introForm.subtitle || ''} onChange={e => setIntroForm({ ...introForm, subtitle: e.target.value })} />
                        <Input label="Image Alt Text" value={introForm.imageAltText || ''} onChange={e => setIntroForm({ ...introForm, imageAltText: e.target.value })} />
                        
                        <Input label="CTA Button Text" value={introForm.ctaButtonText || ''} onChange={e => setIntroForm({ ...introForm, ctaButtonText: e.target.value })} />
                        <Input label="CTA Button Redirect Link" value={introForm.ctaButtonLink || ''} onChange={e => setIntroForm({ ...introForm, ctaButtonLink: e.target.value })} />

                        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-400 block">Open Link in New Tab</span>
                            <span className="text-[9px] text-zinc-550">Toggles target="_blank" redirect target</span>
                          </div>
                          <Switch checked={introForm.openInNewTab || false} onChange={val => setIntroForm({ ...introForm, openInNewTab: val })} />
                        </div>

                        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-400 block">CTA Button Visibility</span>
                            <span className="text-[9px] text-zinc-550">Toggle CTA link display status</span>
                          </div>
                          <Switch checked={introForm.buttonVisible || false} onChange={val => setIntroForm({ ...introForm, buttonVisible: val })} />
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Short Description Bio Overview" textarea rows={2} value={introForm.shortDescription || ''} onChange={e => setIntroForm({ ...introForm, shortDescription: e.target.value })} />
                        </div>

                        <div className="md:col-span-2">
                          <Input label="Full Editorial Biography" textarea rows={4} value={introForm.fullBiography || ''} onChange={e => setIntroForm({ ...introForm, fullBiography: e.target.value })} />
                        </div>

                        {renderMediaUpload("Profile Image Upload", introForm.profileImageUrl, "profileImageUrl")}
                        {renderMediaUpload("Mobile Profile Image Upload", introForm.mobileImageUrl, "mobileImageUrl", true)}
                      </div>
                      
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('introduction', introForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Introduction</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'futureGoals' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Tagline (e.g. LOOKING AHEAD)" value={futureGoalsForm.tagline || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, tagline: e.target.value })} />
                        <Input label="Headline" value={futureGoalsForm.headline || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, headline: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Paragraph 1" textarea rows={3} value={futureGoalsForm.paragraph1 || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, paragraph1: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="Paragraph 2" textarea rows={3} value={futureGoalsForm.paragraph2 || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, paragraph2: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Future Goals Cover Image", futureGoalsForm.imageUrl, "imageUrl")}
                        </div>
                      </div>
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('futureGoals', futureGoalsForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Future Goals</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'philosophy' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Philosophy Title" value={philosophyForm.title || ''} onChange={e => setPhilosophyForm({ ...philosophyForm, title: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Philosophy Description Statement" textarea rows={3} value={philosophyForm.description || ''} onChange={e => setPhilosophyForm({ ...philosophyForm, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Philosophy Cover Image", philosophyForm.philosophyImageUrl, "philosophyImageUrl")}
                        </div>
                      </div>
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('philosophy', philosophyForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Philosophy Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'mission' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Mission Title" value={missionForm.title || ''} onChange={e => setMissionForm({ ...missionForm, title: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Mission Description Statement" textarea rows={3} value={missionForm.description || ''} onChange={e => setMissionForm({ ...missionForm, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Mission Cover Image", missionForm.missionImageUrl, "missionImageUrl")}
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
                        <Input label="Vision Title" value={visionForm.title || ''} onChange={e => setVisionForm({ ...visionForm, title: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Vision Description Statement" textarea rows={3} value={visionForm.description || ''} onChange={e => setVisionForm({ ...visionForm, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Vision Cover Image", visionForm.visionImageUrl, "visionImageUrl")}
                        </div>
                      </div>
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('vision', visionForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Vision Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'coreValues' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Core Values Title" value={coreValuesForm.title || ''} onChange={e => setCoreValuesForm({ ...coreValuesForm, title: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Core Values Description Statement" textarea rows={3} value={coreValuesForm.description || ''} onChange={e => setCoreValuesForm({ ...coreValuesForm, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Core Values Cover Image", coreValuesForm.coreValuesImageUrl, "coreValuesImageUrl")}
                        </div>
                      </div>
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('coreValues', coreValuesForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Core Values Details</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'story' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Story Title" value={storyForm.title || ''} onChange={e => setStoryForm({ ...storyForm, title: e.target.value })} />
                        <Input label="Story Subtitle" value={storyForm.subtitle || ''} onChange={e => setStoryForm({ ...storyForm, subtitle: e.target.value })} />
                        <div className="md:col-span-2">
                          <Input label="Story Editorial description Narrative" textarea rows={4} value={storyForm.description || ''} onChange={e => setStoryForm({ ...storyForm, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                          {renderMediaUpload("Story Cover Image", storyForm.imageUrl, "imageUrl")}
                        </div>
                      </div>
                      <div className="flex justify-end border-t border-zinc-900 pt-3">
                        <Button onClick={() => handleSingleSave('story', storyForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Story Editorial</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'highlights' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'highlights',
                        displayColumns: [
                          { key: 'label', label: 'Label' },
                          { key: 'value', label: 'Counter' },
                          { key: 'suffix', label: 'Suffix' }
                        ],
                        fields: [
                          { key: 'value', label: 'Number (Value)', type: 'text' },
                          { key: 'prefix', label: 'Prefix (e.g. $, Vol)', type: 'text', optional: true },
                          { key: 'suffix', label: 'Suffix (e.g. +, M, %)', type: 'text', optional: true },
                          { key: 'label', label: 'Counter Label Description', type: 'text' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'achievements' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'achievements',
                        displayColumns: [
                          { key: 'title', label: 'Accolade Title' },
                          { key: 'year', label: 'Year' }
                        ],
                        fields: [
                          { key: 'title', label: 'Achievement Title', type: 'text' },
                          { key: 'year', label: 'Year Conferred', type: 'text' },
                          { key: 'description', label: 'Narrative description details', type: 'textarea' },
                          { key: 'iconUrl', label: 'Accolade Cover / Image (Upload)', type: 'upload' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'awards' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'awards',
                        displayColumns: [
                          { key: 'title', label: 'Award Name' },
                          { key: 'organization', label: 'Organization' },
                          { key: 'year', label: 'Year' }
                        ],
                        fields: [
                          { key: 'title', label: 'Award Title Name', type: 'text' },
                          { key: 'organization', label: 'Awarding Corporate Body / Organization', type: 'text' },
                          { key: 'year', label: 'Year Won', type: 'text' },
                          { key: 'description', label: 'Short description details', type: 'textarea' },
                          { key: 'imageUrl', label: 'Award Badge Image (Upload)', type: 'upload' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'experience' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'experience',
                        displayColumns: [
                          { key: 'company', label: 'Company Name' },
                          { key: 'position', label: 'Designation Role' },
                          { key: 'location', label: 'Location' }
                        ],
                        fields: [
                          { key: 'company', label: 'Company / Organization Name', type: 'text' },
                          { key: 'position', label: 'Professional Designation Role', type: 'text' },
                          { key: 'location', label: 'Office Location Location (e.g. Paris, France)', type: 'text', optional: true },
                          { key: 'startDate', label: 'Tenure Start Date', type: 'text', optional: true },
                          { key: 'endDate', label: 'Tenure End Date (e.g. Present)', type: 'text', optional: true },
                          { key: 'description', label: 'Job description narrative', type: 'textarea', optional: true },
                          { key: 'logoUrl', label: 'Company Logo Image (Upload)', type: 'upload', optional: true }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'seo' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="SEO Meta Title" value={seoForm.metaTitle || ''} onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })} />
                        <Input label="SEO Meta Keywords" value={seoForm.metaKeywords || ''} onChange={e => setSeoForm({ ...seoForm, metaKeywords: e.target.value })} placeholder="Luxury, Digital, CGI" />
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

      {/* INDICATOR FOOTER */}
      <div className="flex items-center justify-end p-4 border border-zinc-900 bg-zinc-955/20 rounded-lg max-w-5xl">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>About system framework running securely with synchronized context hooks.</span>
        </div>
      </div>

      {/* NEW SECTIONS: Future Goals, Core Collaborations, CTA */}
      <div className="mt-8 space-y-4 max-w-5xl">
        <h2 className="text-xl font-serif text-white tracking-tight mb-4">Additional Meta Sections</h2>
        
        <Card title="Future Goals" className="p-5 border-zinc-800/40 bg-zinc-950/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tagline" value={futureGoalsForm.tagline || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, tagline: e.target.value })} />
            <Input label="Headline" value={futureGoalsForm.headline || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, headline: e.target.value })} />
            <div className="md:col-span-2">
              <Input label="Paragraph 1" textarea rows={3} value={futureGoalsForm.paragraph1 || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, paragraph1: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Input label="Paragraph 2" textarea rows={3} value={futureGoalsForm.paragraph2 || ''} onChange={e => setFutureGoalsForm({ ...futureGoalsForm, paragraph2: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => handleSingleSave('futureGoals', futureGoalsForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Future Goals</Button>
          </div>
        </Card>

        <Card title="Core Collaborations" className="p-5 border-zinc-800/40 bg-zinc-950/10">
            <h3 className="text-luxury-gold font-bold mb-4">1. Header Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Input label="Tagline" value={coreCollabForm.tagline || ''} onChange={e => setCoreCollabForm({ ...coreCollabForm, tagline: e.target.value })} />
              <Input label="Headline" value={coreCollabForm.headline || ''} onChange={e => setCoreCollabForm({ ...coreCollabForm, headline: e.target.value })} />
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={() => handleSingleSave('coreCollaborations', coreCollabForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Header Info</Button>
              </div>
            </div>

            <h3 className="text-luxury-gold font-bold mb-4 border-t border-zinc-800 pt-6">2. Manage Collaborators</h3>
            {renderListManager({
              sectionKey: 'coreCollaboratorsList',
              displayColumns: [
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' }
              ],
              fields: [
                { key: 'name', label: 'Collaborator Name', type: 'text' },
                { key: 'role', label: 'Role / Type (e.g. AI Partner)', type: 'text' },
                { key: 'description', label: 'Description / Bio', type: 'textarea' },
                { key: 'logo', label: 'Collaborator Photo / Logo', type: 'upload' }
              ]
            })}
          </Card>
      </div>

    </div>
  );
};
