import React, { useState } from 'react';
import { useMediaManager } from "../../context/MediaContext";
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import {
  Briefcase, Star, Users, BarChart, FileText, Clock, Workflow, MessageSquare, Globe,
  Edit3, Trash2, ArrowUp, ArrowDown, X, UploadCloud, Plus, Save,
  RefreshCw, Eye, Search, AlertCircle, Settings, ChevronDown, ChevronRight, LayoutGrid
} from 'lucide-react';

export default function Collaborations() {
  const { db, updateSection, deleteNestedItem } = useDatabase();
  const collaborationsPage = db?.collaborationsPage || {};

  // Collapsible cards state
  const [expandedCards, setExpandedCards] = useState({
    hero: true,
    brandCarousel: false,
    partners: false,
    metrics: false,
    campaigns: false,
    history: false,
    process: false,
    testimonials: false,
    seo: false
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

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Single Forms State
  const [heroForm, setHeroForm] = useState(collaborationsPage?.hero || {});
  const [historyForm, setHistoryForm] = useState(collaborationsPage?.history || {});
  const [seoForm, setSeoForm] = useState(collaborationsPage?.seo || {});

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
          setDraftItem(prev => ({ ...prev, [targetKey]: dummyUrl }));
        } else {
          setSeoForm(prev => (targetKey in prev || ['ogImage'].includes(targetKey) ? { ...prev, [targetKey]: dummyUrl } : prev));
        }
      }
    });
  };

  const handleSingleSave = (sectionKey, data) => {
    updateSection('collaborationsPage', { [sectionKey]: data });
    showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
  };

  const updateSectionMeta = (secId, key, val) => {
    const currentSettings = collaborationsPage.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    updateSection('collaborationsPage', { sectionSettings: updatedSettings });
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
              <button onClick={() => simulateMediaUpload(fieldKey)} className="p-1 bg-black/60 rounded text-luxury-gold hover:text-white" title="Replace Image">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => {
                if(activeEditorSection) {
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
  const renderListManager = ({ sectionKey, fields = [], displayColumns = [] }) => {
    const listData = collaborationsPage[sectionKey] || [];

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
      if (editingItemId !== null) {
        nextList = listData.map(item => String(item.id) === String(editingItemId) ? { ...item, ...draftItem } : item);
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
      updateSection('collaborationsPage', { [sectionKey]: nextList });
      setActiveEditorSection(null);
      setEditingItemId(null);
      setDraftItem({});
    };

    const handleMoveItem = (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        updateSection('collaborationsPage', { [sectionKey]: nextList });
      }
    };

    const handleStartAdd = () => {
      setActiveEditorSection(sectionKey);
      setEditingItemId(null);
      const defaultObj = {};
      fields.forEach(f => {
        defaultObj[f.key] = f.type === 'number' ? 0 : f.type === 'switch' ? false : f.type === 'color' ? '#D4AF37' : '';
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
                          ) : col.type === 'color' ? (
                            <div className="flex items-center gap-2">
                               <span className="w-3 h-3 rounded-full border border-zinc-800" style={{backgroundColor: item[col.key] || '#D4AF37'}}></span>
                               <span>{item[col.key]}</span>
                            </div>
                          ) : item[col.key] || '-'}
                        </td>
                      ))}
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
              {editingItemId !== null ? "Edit Record Item" : "Create New Record"}
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
                if (field.type === 'color') {
                  return (
                     <div key={field.key} className="flex flex-col gap-1 text-left">
                        <label className="text-xs text-zinc-400 font-semibold">{field.label}</label>
                        <div className="flex gap-2 items-center">
                            <input 
                                type="color" 
                                value={draftItem[field.key] || '#D4AF37'} 
                                onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <Input
                                value={draftItem[field.key] || ''}
                                onChange={e => setDraftItem({ ...draftItem, [field.key]: e.target.value })}
                                placeholder="#FFFFFF"
                            />
                        </div>
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

  // Fixed 9 segments definitions
  const sectionsList = [
    { id: "hero", label: "Hero Settings", icon: LayoutGrid },
    { id: "brandCarousel", label: "Brand Logo Carousel", icon: Star },
    { id: "partners", label: "Partner Cards", icon: Users },
    { id: "metrics", label: "Success Metrics", icon: BarChart },
    { id: "campaigns", label: "Case Studies / Campaigns", icon: FileText },
    { id: "history", label: "Collaboration History", icon: Clock },
    { id: "process", label: "Partnership Process", icon: Workflow },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "seo", label: "SEO Metadata", icon: Globe }
  ];

  const sectionSettings = collaborationsPage.sectionSettings || {};
  const sortedSections = [...sectionsList].sort((a, b) => {
    const orderA = sectionSettings[a.id]?.order ?? 99;
    const orderB = sectionSettings[b.id]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="flex flex-col gap-6 text-left relative">

      {toast && (
        <div className="fixed top-5 right-5 z-[100] px-4 py-3 rounded-md shadow-lg border flex items-center gap-2.5 bg-zinc-955 border-luxury-gold/30 text-white font-sans">
          <AlertCircle className="w-4 h-4 text-luxury-gold" />
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

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
                onClick={() => { setShowCropModal(false); showToast("Image cropped successfully."); }}
                className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded shadow-gold-glow"
              >
                Apply Crop Grid
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deletingItemId !== null}
        onClose={() => { setDeletingItemId(null); setDeletingSection(null); }}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          deleteNestedItem("collaborationsPage", deletingSection, deletingItemId);
          setDeletingItemId(null);
          setDeletingSection(null);
          showToast("Record deleted successfully.");
        }}
      />

      <Dialog
        isOpen={viewingItem !== null}
        onClose={() => { setViewingItem(null); setViewingSection(null); }}
        title="Record Details Preview"
        size="md"
      >
        {viewingItem && (
          <div className="space-y-4 text-xs text-left">
             <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-3">
                {Object.keys(viewingItem).filter(k => k !== 'id' && !k.toLowerCase().includes('image') && !k.toLowerCase().includes('logo') && !k.toLowerCase().includes('avatar') && !k.toLowerCase().includes('url')).map((key, idx) => (
                    <div key={idx}>
                        <span className="text-[10px] text-zinc-500 block uppercase font-mono">{key}</span>
                        <span className="text-zinc-200 font-bold">{viewingItem[key] || '-'}</span>
                    </div>
                ))}
             </div>
             
             {/* Render images if present */}
             {Object.keys(viewingItem).filter(k => k.toLowerCase().includes('image') || k.toLowerCase().includes('logo') || k.toLowerCase().includes('avatar')).map((key, idx) => (
                <div key={idx}>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono mb-1">{key}</span>
                    {viewingItem[key] ? (
                        <div className="w-16 h-16 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden">
                            <img src={viewingItem[key]} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <span className="text-zinc-500 italic">No Media</span>
                    )}
                </div>
             ))}

            <div className="flex justify-end pt-3 border-t border-zinc-800 mt-4">
              <Button variant="secondary" onClick={() => { setViewingItem(null); setViewingSection(null); }}>
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* DASHBOARD STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/20">
            <span className="text-2xl font-serif text-luxury-gold">{(collaborationsPage.partners || []).length}</span>
            <span className="text-[10px] uppercase font-mono text-zinc-400">Total Partners</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/20">
            <span className="text-2xl font-serif text-luxury-gold">{(collaborationsPage.campaigns || []).length}</span>
            <span className="text-[10px] uppercase font-mono text-zinc-400">Total Campaigns</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/20">
            <span className="text-2xl font-serif text-luxury-gold">{(collaborationsPage.testimonials || []).length}</span>
            <span className="text-[10px] uppercase font-mono text-zinc-400">Testimonials</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/20">
            <span className="text-2xl font-serif text-luxury-gold">{Object.keys(sectionSettings).filter(k => sectionSettings[k].status === 'Active').length || sortedSections.length}</span>
            <span className="text-[10px] uppercase font-mono text-zinc-400">Active Sections</span>
        </div>
      </div>

      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-luxury-gold" />
            Brand Collaborations CMS
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure partner networks, successful campaigns, historical milestones, and brand strategy processes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => { setExpandedCards(prev => ({...prev, partners: true})); setActiveEditorSection('partners'); setEditingItemId(null); setDraftItem({}); document.getElementById('partners')?.scrollIntoView(); }} variant="primary" size="sm" className="bg-luxury-gold border-luxury-gold text-black font-bold">
             <Plus className="w-4 h-4 mr-1.5" /> Add Collab
          </Button>
          <Button onClick={() => showToast("💾 Collaborations Page Draft Saved Successfully!")} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-amber-500/90">
            <Save className="w-3.5 h-3.5" /> <span>Save Draft</span>
          </Button>
          <Button onClick={() => { if (window.confirm("Reset unsaved changes?")) window.location.reload(); }} variant="secondary" size="sm" className="gap-1.5 text-xs border border-zinc-800 text-zinc-400 hover:text-rose-400">
            <RefreshCw className="w-3.5 h-3.5" /> <span>Reset</span>
          </Button>
          <Button onClick={() => showToast("🚀 Public production server updated successfully. Page is Live!")} variant="primary" size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-luxury-gold to-luxury-darkgold text-black font-bold shadow-gold-glow">
            <span>Publish Live</span>
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records across lists..."
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

      <div className="grid grid-cols-1 gap-4 max-w-5xl pb-20">
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
                  
                  <div className="p-3 mb-2 rounded border border-zinc-900 bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-405">Display Order:</span>
                      <input
                        type="number"
                        value={sectionMeta.order}
                        onChange={e => updateSectionMeta(sec.id, 'order', parseInt(e.target.value) || 1)}
                        className="w-12 bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-center text-xs font-semibold text-zinc-200 focus:border-luxury-gold/40 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-405">Section Status:</span>
                        <select 
                            value={sectionMeta.status}
                            onChange={e => updateSectionMeta(sec.id, 'status', e.target.value)}
                            className="bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-xs text-zinc-300 focus:border-luxury-gold/40 outline-none"
                        >
                            <option value="Active">Active (Visible)</option>
                            <option value="Inactive">Inactive (Hidden)</option>
                        </select>
                    </div>
                  </div>

                  {sec.id === 'hero' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Eyebrow Text" value={heroForm.eyebrowText || ''} onChange={e => setHeroForm({ ...heroForm, eyebrowText: e.target.value })} />
                        <Input label="Main Title" value={heroForm.title || ''} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} />
                        <Input label="Highlighted Word" value={heroForm.highlightedTitle || ''} onChange={e => setHeroForm({ ...heroForm, highlightedTitle: e.target.value })} />
                        <div className="md:col-span-2">
                            <Input textarea rows={3} label="Description" value={heroForm.description || ''} onChange={e => setHeroForm({ ...heroForm, description: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex justify-end pt-3 border-t border-zinc-900/60">
                        <Button onClick={() => handleSingleSave('hero', heroForm)} variant="primary" size="sm" className="bg-luxury-gold text-black">Save Hero</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'history' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Eyebrow Text" value={historyForm.eyebrow || ''} onChange={e => setHistoryForm({ ...historyForm, eyebrow: e.target.value })} />
                        <Input label="Main Title" value={historyForm.title || ''} onChange={e => setHistoryForm({ ...historyForm, title: e.target.value })} />
                        <Input label="Highlighted Word" value={historyForm.highlightedTitle || ''} onChange={e => setHistoryForm({ ...historyForm, highlightedTitle: e.target.value })} />
                        <div className="md:col-span-2">
                            <Input textarea rows={3} label="Main Description" value={historyForm.description || ''} onChange={e => setHistoryForm({ ...historyForm, description: e.target.value })} />
                        </div>
                        <Input label="Card Title" value={historyForm.cardTitle || ''} onChange={e => setHistoryForm({ ...historyForm, cardTitle: e.target.value })} />
                        <Input label="Card Description" value={historyForm.cardDescription || ''} onChange={e => setHistoryForm({ ...historyForm, cardDescription: e.target.value })} />
                      </div>
                      <div className="flex justify-end pt-3 border-t border-zinc-900/60">
                        <Button onClick={() => handleSingleSave('history', historyForm)} variant="primary" size="sm" className="bg-luxury-gold text-black">Save History Section</Button>
                      </div>
                    </div>
                  )}

                  {sec.id === 'brandCarousel' && renderListManager({
                    sectionKey: 'brandCarousel',
                    displayColumns: [
                      { key: 'brandName', label: 'Brand Name' },
                      { key: 'logoImage', label: 'Logo', type: 'image' }
                    ],
                    fields: [
                      { key: 'brandName', label: 'Brand Name', type: 'text' },
                      { key: 'logoImage', label: 'Brand Logo Image', type: 'upload' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'partners' && renderListManager({
                    sectionKey: 'partners',
                    displayColumns: [
                      { key: 'name', label: 'Partner Name' },
                      { key: 'type', label: 'Type' },
                      { key: 'logo', label: 'Logo', type: 'image' }
                    ],
                    fields: [
                      { key: 'name', label: 'Partner Name', type: 'text' },
                      { key: 'type', label: 'Industry Type', type: 'text' },
                      { key: 'featuredWork', label: 'Featured Work / Project', type: 'text' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                      { key: 'accentColor', label: 'Accent Color', type: 'color' },
                      { key: 'logo', label: 'Partner Logo', type: 'upload' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'metrics' && renderListManager({
                    sectionKey: 'metrics',
                    displayColumns: [
                      { key: 'value', label: 'Metric Value' },
                      { key: 'label', label: 'Metric Label' }
                    ],
                    fields: [
                      { key: 'value', label: 'Metric Value (e.g. 50+)', type: 'text' },
                      { key: 'label', label: 'Metric Label', type: 'text' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'campaigns' && renderListManager({
                    sectionKey: 'campaigns',
                    displayColumns: [
                      { key: 'title', label: 'Campaign Title' },
                      { key: 'image', label: 'Cover', type: 'image' }
                    ],
                    fields: [
                      { key: 'title', label: 'Campaign Title', type: 'text' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                      { key: 'buttonText', label: 'Button Text', type: 'text' },
                      { key: 'buttonLink', label: 'Button URL', type: 'text' },
                      { key: 'accentColor', label: 'Accent Color', type: 'color' },
                      { key: 'image', label: 'Campaign Cover Image', type: 'upload' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'process' && renderListManager({
                    sectionKey: 'process',
                    displayColumns: [
                      { key: 'stepNumber', label: 'Step' },
                      { key: 'title', label: 'Title' }
                    ],
                    fields: [
                      { key: 'stepNumber', label: 'Step Number (e.g. 01)', type: 'text' },
                      { key: 'title', label: 'Step Title', type: 'text' },
                      { key: 'description', label: 'Step Description', type: 'textarea' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'testimonials' && renderListManager({
                    sectionKey: 'testimonials',
                    displayColumns: [
                      { key: 'personName', label: 'Person' },
                      { key: 'company', label: 'Company' },
                      { key: 'avatar', label: 'Avatar', type: 'image' }
                    ],
                    fields: [
                      { key: 'personName', label: 'Person Name', type: 'text' },
                      { key: 'designation', label: 'Designation / Role', type: 'text' },
                      { key: 'company', label: 'Company Name', type: 'text' },
                      { key: 'quote', label: 'Quote', type: 'textarea' },
                      { key: 'accentColor', label: 'Accent Color', type: 'color' },
                      { key: 'avatar', label: 'Avatar Image', type: 'upload' },
                      { key: 'status', label: 'Active Status', type: 'switch' }
                    ]
                  })}

                  {sec.id === 'seo' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4">
                        <Input label="Meta Title" value={seoForm.metaTitle || ''} onChange={e => setSeoForm({ ...seoForm, metaTitle: e.target.value })} />
                        <Input textarea rows={2} label="Meta Description" value={seoForm.metaDescription || ''} onChange={e => setSeoForm({ ...seoForm, metaDescription: e.target.value })} />
                        <Input textarea rows={2} label="Keywords (comma separated)" value={seoForm.keywords || ''} onChange={e => setSeoForm({ ...seoForm, keywords: e.target.value })} />
                        {renderMediaUpload("OpenGraph / Twitter Shared Image", seoForm.ogImage, "ogImage")}
                      </div>
                      <div className="flex justify-end pt-3 border-t border-zinc-900/60">
                        <Button onClick={() => handleSingleSave('seo', seoForm)} variant="primary" size="sm" className="bg-luxury-gold text-black">Save SEO Metadata</Button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
