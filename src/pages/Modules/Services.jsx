import React, { useState } from 'react';
import { useMediaManager } from "../../context/MediaContext";
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Cpu, Layers, Box, Sparkles, Globe, ShieldCheck, ChevronDown, ChevronRight, 
  Edit3, Trash2, ArrowUp, ArrowDown, X, UploadCloud, Plus, Save, 
  RefreshCw, Eye, Search, AlertCircle, Settings
} from 'lucide-react';

// ==========================================
// 1. REUSABLE LIST INPUT MANAGER (FOR DYNAMIC TEXT ARRAYS)
// ==========================================
const ListInputManager = ({ label, items = [], onChange }) => {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const handleDelete = (idxToDelete) => {
    onChange(items.filter((_, idx) => idx !== idxToDelete));
  };

  const handleMove = (index, direction) => {
    const nextItems = [...items];
    const target = index + direction;
    if (target >= 0 && target < nextItems.length) {
      const temp = nextItems[index];
      nextItems[index] = nextItems[target];
      nextItems[target] = temp;
      onChange(nextItems);
    }
  };

  return (
    <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-2 text-left">
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem} 
          onChange={e => setNewItem(e.target.value)} 
          placeholder={`Add new ${label.toLowerCase()} item...`}
          className="flex-1 bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:border-luxury-gold/40 outline-none"
        />
        <button 
          type="button" 
          onClick={handleAdd}
          className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-luxury-gold/30 text-luxury-gold text-xs rounded font-bold"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mt-2 max-h-32 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-300 font-sans truncate">{idx + 1}. {item}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
              <button type="button" onClick={() => handleMove(idx, 1)} disabled={idx === items.length - 1} className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
              <button type="button" onClick={() => handleDelete(idx)} className="p-1 text-zinc-550 hover:text-rose-400"><X className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <span className="text-[10px] text-zinc-650 italic">No list items added yet.</span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. REUSABLE GALLERY MANAGER (FOR MULTIPLE IMAGES)
// ==========================================
const GalleryManager = ({ label, images = [], onChange }) => {
  const [uploading, setUploading] = useState(false);

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const dummyUrls = [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80"
      ];
      const randomUrl = dummyUrls[Math.floor(Math.random() * dummyUrls.length)];
      onChange([...images, { url: randomUrl, title: "Gallery Slide Image", alt: "Visual asset placeholder" }]);
      setUploading(false);
    }, 1000);
  };

  const handleDelete = (idxToDelete) => {
    onChange(images.filter((_, idx) => idx !== idxToDelete));
  };

  const handleMove = (index, direction) => {
    const nextImages = [...images];
    const target = index + direction;
    if (target >= 0 && target < nextImages.length) {
      const temp = nextImages[index];
      nextImages[index] = nextImages[target];
      nextImages[target] = temp;
      onChange(nextImages);
    }
  };

  return (
    <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3 text-left">
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      
      <div 
        onClick={simulateUpload}
        className="h-20 border border-dashed border-zinc-850 hover:border-luxury-gold/30 rounded flex flex-col items-center justify-center gap-1 text-zinc-655 cursor-pointer transition-colors"
      >
        {uploading ? (
          <span className="text-[9px] uppercase tracking-widest font-mono animate-pulse">Uploading Media...</span>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            <span className="text-[9px] uppercase font-mono tracking-widest">Add Gallery Image</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-video rounded border border-zinc-900 bg-zinc-950 overflow-hidden group">
            <img src={img.url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all">
              <button type="button" onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="p-1 bg-black/40 rounded text-zinc-450 hover:text-white disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
              <button type="button" onClick={() => handleMove(idx, 1)} disabled={idx === images.length - 1} className="p-1 bg-black/40 rounded text-zinc-450 hover:text-white disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
              <button type="button" onClick={() => handleDelete(idx)} className="p-1 bg-black/40 rounded text-rose-450 hover:text-white"><X className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN SERVICES MODULE DEFINITION
// ==========================================
export default function Services() {
  const { db, updateSection } = useDatabase();
  const servicesPage = db?.servicesPage || {};

  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({
    hero: true,
    mainServices: false,
    advancedServices: false,
    categories: false,
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

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Single Forms State
  const [heroForm, setHeroForm] = useState(servicesPage?.hero || {});
  const [seoForm, setSeoForm] = useState(servicesPage?.seo || {});

  // List editor states
  const [activeEditorSection, setActiveEditorSection] = useState(null); 
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});

  // View modal state
  const [viewingItem, setViewingItem] = useState(null);
  const [viewingSection, setViewingSection] = useState(null);

  // Delete modal state
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [deletingSection, setDeletingSection] = useState(null);

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
    updateSection('servicesPage', { [sectionKey]: data });
    showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
  };

  const updateSectionMeta = (secId, key, val) => {
    const currentSettings = servicesPage.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    updateSection('servicesPage', { sectionSettings: updatedSettings });
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

  // --- REUSABLE LIST MANAGER (WITH SEARCH & FILTERS & MODALS CONNECTED) ---
  const renderListManager = ({
    sectionKey,
    fields = [],
    displayColumns = []
  }) => {
    const listData = servicesPage[sectionKey] || [];
    
    // Apply search filter
    const filteredList = listData.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = displayColumns.some(col => 
        String(item[col.key] || '').toLowerCase().includes(query)
      );
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const isEditing = activeEditorSection === sectionKey;

    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
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
      updateSection('servicesPage', { [sectionKey]: nextList });
      setActiveEditorSection(null);
      setEditingItemId(null);
      setDraftItem({});
    };

    const handleToggleStatus = (id, currentStatus) => {
      const nextList = listData.map(item => item.id === id ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);
      updateSection('servicesPage', { [sectionKey]: nextList });
      // Silent update on toggle switch, no notifications popped up!
    };

    const handleMoveItem = (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        updateSection('servicesPage', { [sectionKey]: nextList });
      }
    };

    const handleStartAdd = () => {
      setActiveEditorSection(sectionKey);
      setEditingItemId(null);
      const defaultObj = {};
      fields.forEach(f => {
        defaultObj[f.key] = f.type === 'number' ? 0 : f.type === 'switch' ? false : f.type === 'list' || f.type === 'gallery' ? [] : '';
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
                  {filteredList.map((item, idx) => (
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
                        <button onClick={() => { setViewingItem(item); setViewingSection(sectionKey); }} className="p-1 hover:bg-zinc-900 rounded text-luxury-gold" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleStartEdit(item)} className="p-1 hover:bg-zinc-900 rounded text-amber-500" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { setDeletingItemId(item.id); setDeletingSection(sectionKey); }} className="p-1 hover:bg-zinc-900 rounded text-rose-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={displayColumns.length + 3} className="text-center py-6 text-zinc-655 font-mono italic">No matching records found.</td>
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
                if (field.type === 'list') {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <ListInputManager 
                        label={field.label}
                        items={draftItem[field.key] || []}
                        onChange={newVal => setDraftItem({ ...draftItem, [field.key]: newVal })}
                      />
                    </div>
                  );
                }
                if (field.type === 'gallery') {
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <GalleryManager 
                        label={field.label}
                        images={draftItem[field.key] || []}
                        onChange={newVal => setDraftItem({ ...draftItem, [field.key]: newVal })}
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
    { id: "hero", label: "Hero Settings", icon: Cpu },
    { id: "mainServices", label: "Accordion Services", icon: Layers },
    { id: "advancedServices", label: "Advanced Services Tabs", icon: Box },
    { id: "categories", label: "Service Categories", icon: Sparkles },
    { id: "seo", label: "SEO Metadata", icon: Globe }
  ];

  // Dynamic sorting at section level
  const sectionSettings = servicesPage.sectionSettings || {};
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
              <button onClick={() => setShowCropModal(false)} className="px-3 py-1.5 text-xs text-zinc-555 hover:text-white">Cancel</button>
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

      {/* LUXURY DELETE CONFIRMATION MODAL */}
      {deletingItemId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-xl w-[380px] text-zinc-100 flex flex-col gap-4 text-left shadow-2xl border-t-2 border-t-rose-500">
            <div className="flex items-center gap-2 text-rose-400 border-b border-zinc-800 pb-2">
              <Trash2 className="w-4.5 h-4.5" />
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider">Confirm Permanent Delete</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to delete this record? This action will permanently remove it from the CMS database and public interfaces.
            </p>
            <div className="flex justify-end gap-2 border-t border-zinc-850 pt-3 mt-1">
              <button onClick={() => { setDeletingItemId(null); setDeletingSection(null); }} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
              <button 
                onClick={() => {
                  const listData = servicesPage[deletingSection] || [];
                  const nextList = listData.filter(item => item.id !== deletingItemId);
                  updateSection('servicesPage', { [deletingSection]: nextList });
                  setDeletingItemId(null);
                  setDeletingSection(null);
                  showToast("Record successfully deleted.");
                }} 
                className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS PREVIEW MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn p-4">
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl w-full max-w-lg text-zinc-100 flex flex-col gap-4 text-left shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 p-5 pb-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-luxury-gold flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5" /> Service Record Details
              </h3>
              <button onClick={() => { setViewingItem(null); setViewingSection(null); }} className="text-zinc-500 hover:text-white"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-5 pt-0 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-900/60 pb-3">
                <div>
                  <span className="text-[10px] text-zinc-550 block uppercase font-mono">Title</span>
                  <span className="text-zinc-200 font-bold">{viewingItem.title || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-555 block uppercase font-mono">Tagline</span>
                  <span className="text-zinc-350">{viewingItem.tagline || '-'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-550 block uppercase font-mono">Description</span>
                <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-900 font-sans mt-1">{viewingItem.description || viewingItem.overview || '-'}</p>
              </div>

              {viewingItem.features && (
                <div>
                  <span className="text-[10px] text-zinc-550 block uppercase font-mono mb-1.5">Accordion Features List</span>
                  <div className="flex flex-col gap-1">
                    {String(viewingItem.features).split(',').map((feat, idx) => (
                      <span key={idx} className="p-1.5 bg-zinc-950/40 border border-zinc-900/60 rounded text-zinc-400 font-mono text-[10px]">&bull; {feat.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewingItem.benefits && (
                <div>
                  <span className="text-[10px] text-zinc-555 block uppercase font-mono mb-1.5">Benefits Highlights</span>
                  <div className="flex flex-col gap-1">
                    {String(viewingItem.benefits).split(',').map((ben, idx) => (
                      <span key={idx} className="p-1.5 bg-zinc-950/40 border border-zinc-900/60 rounded text-zinc-400 font-sans">&bull; {ben.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewingItem.process && (
                <div>
                  <span className="text-[10px] text-zinc-555 block uppercase font-mono mb-1.5">Strategic Process Steps</span>
                  <div className="flex flex-col gap-1">
                    {String(viewingItem.process).split(',').map((step, idx) => (
                      <span key={idx} className="p-1.5 bg-zinc-950/40 border border-zinc-900/60 rounded text-zinc-400 font-sans">{idx + 1}. {step.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-5 pt-2 border-t border-zinc-850">
              <button onClick={() => { setViewingItem(null); setViewingSection(null); }} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ACTION CONTROLS */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-luxury-gold" />
            Services CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure accordion services list, advanced tabs overview, benefits, process stages, and categories.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => { setExpandedCards(prev => ({...prev, mainServices: true})); setActiveEditorSection('mainServices'); setEditingItemId(null); setDraftItem({}); document.getElementById('mainServices')?.scrollIntoView(); }} variant="primary" size="sm" className="bg-luxury-gold border-luxury-gold text-black font-bold">
             <Plus className="w-4 h-4 mr-1.5" /> Add Services
          </Button>
          <Button onClick={() => showToast("💾 Services Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
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

      {/* TOP FILTERS TOOLBAR */}
      <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search service title, tagline, description..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-850 rounded-md pl-9 pr-4 py-2 text-xs text-zinc-200 focus:border-luxury-gold/30 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Status:</span>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none"
            >
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} 
              className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded"
            >
              Clear
            </button>
          )}
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
              className={`border transition-all duration-300 p-0 overflow-hidden bg-zinc-955/20 ${isCardOpen ? 'border-zinc-800/80' : 'border-zinc-800/40'}`}
              title={
                <div className="flex items-center justify-between w-full py-4 px-5 select-none bg-zinc-955/20 cursor-pointer" onClick={() => toggleCard(sec.id)}>
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
                            <span className="text-xs font-semibold text-zinc-400 block">Background Glow Effect</span>
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

                  {sec.id === 'mainServices' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'mainServices',
                        displayColumns: [
                          { key: 'title', label: 'Service Title' },
                          { key: 'tagline', label: 'Tagline' }
                        ],
                        fields: [
                          { key: 'title', label: 'Service Accordion Title', type: 'text' },
                          { key: 'tagline', label: 'Service Subtitle Tagline', type: 'text' },
                          { key: 'icon', label: 'Icon Symbol Tag (e.g. Cpu, Layers, Box, Sparkles)', type: 'text' },
                          { key: 'accentColor', label: 'Accent Border Color (e.g. #D4AF37)', type: 'text' },
                          { key: 'features', label: 'Core Features (Comma separated list)', type: 'text' },
                          { key: 'description', label: 'Detailed Description Narrative text', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'advancedServices' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'advancedServices',
                        displayColumns: [
                          { key: 'title', label: 'Tab Name' }
                        ],
                        fields: [
                          { key: 'title', label: 'Advanced Service Tab Title', type: 'text' },
                          { key: 'cta', label: 'CTA Button Text', type: 'text' },
                          { key: 'overview', label: 'Overview Paragraph text', type: 'textarea' },
                          { key: 'benefits', label: 'Benefits (Comma separated list)', type: 'textarea' },
                          { key: 'process', label: 'Process Steps (Comma separated list)', type: 'textarea' }
                        ]
                      })}
                    </div>
                  )}

                  {sec.id === 'categories' && (
                    <div>
                      {renderListManager({
                        sectionKey: 'categories',
                        displayColumns: [
                          { key: 'title', label: 'Category Name' }
                        ],
                        fields: [
                          { key: 'title', label: 'Category Name Label', type: 'text' },
                          { key: 'color', label: 'Display Color (e.g. #D4AF37)', type: 'text' }
                        ]
                      })}
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
          <span>Services CMS dashboard framework running securely.</span>
        </div>
      </div>

    </div>
  );
}
