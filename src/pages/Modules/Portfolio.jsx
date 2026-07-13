import React, { useState, useEffect, useRef } from 'react';
import { useMediaManager } from '../../context/MediaContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { 
  Sparkles, Search, Plus, Edit2, Trash2, X, Eye, 
  RefreshCw, Save, Image as ImageIcon, Video, FolderGit2, Calendar, Star,
  Monitor, CheckCircle, ArrowUpRight, Hash, ArrowRight, LayoutDashboard, Download, Filter,
  ChevronLeft, ChevronRight, Layers, FileDown, Settings, GripVertical, Settings2, Upload, FileUp
} from 'lucide-react';

/* =========================================================
   TILT CARD COMPONENT
========================================================= */
const TiltCard = ({ children, className = '', maxTilt = 10, glowColor = 'rgba(212, 175, 55, 0.12)', ...props }) => {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rotateX.set(-((y / rect.height) - 0.5) * maxTilt);
    rotateY.set(((x / rect.width) - 0.5) * maxTilt);
    setGlowPos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); rotateX.set(0); rotateY.set(0); }}
      style={{ transformStyle: 'preserve-3d', rotateX: smoothRotateX, rotateY: smoothRotateY }}
      animate={{ scale: isHovered ? 1.015 : 1, z: isHovered ? 30 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-panel rounded-lg p-5 shadow-card-glow border border-zinc-800/80 relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {isHovered && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle 120px at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent 80%)`, mixBlendMode: 'screen', zIndex: 1 }} />}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="relative z-10">{children}</div>
    </motion.div>
  );
};

const FileUpload = ({ label, value, onChange, accept = 'image/*,video/*,audio/*,.pdf,.zip,.doc,.docx' }) => {
  const { openMediaManager } = useMediaManager();
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => openMediaManager({ onSelect: (url) => onChange(url) })} className="flex-1 border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-955/50 rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors min-h-[42px] text-left overflow-hidden truncate">
          {value ? (value.split('/').pop() || 'File Uploaded') : `Upload ${label} via Media Hub`}
        </button>
      </div>
    </div>
  );
};

export const Portfolio = () => {
  const { db, updateSection } = useDatabase();
  const portfolioList = db?.portfolio || [];
  const portfolioHero = db?.portfolioHero || {};
  const portfolioFilters = db?.portfolioFilters || [];

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  // Section Toggles
  const [showHeroSettings, setShowHeroSettings] = useState(false);
  const [showFilterManager, setShowFilterManager] = useState(false);

  // Hero State
  const [heroDraft, setHeroDraft] = useState(portfolioHero);
  
  // Filter Manager State
  const [filtersDraft, setFiltersDraft] = useState(portfolioFilters);
  const [editingFilterId, setEditingFilterId] = useState(null);
  const [filterDraftItem, setFilterDraftItem] = useState({});

  // Main Portfolio State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Portfolio'); 
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFeatured, setFilterFeatured] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('General'); 

  // Media uploading state
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { openMediaManager } = useMediaManager();
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [galleryImageInput, setGalleryImageInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Bulk States
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [bulkStatusTarget, setBulkStatusTarget] = useState('');
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');

  const dynamicCategories = portfolioFilters.map(f => f.name);

  /* ===========================
        FILTER, SORT & PAGINATION
  =========================== */
  let filteredList = portfolioList.filter(item => {
    const matchesSearch = (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.client?.toLowerCase().includes(searchQuery.toLowerCase()) || item.year?.toString().includes(searchQuery) || item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTab = activeTab === 'Portfolio' || item.category === activeTab;
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesFeatured = filterFeatured === 'All' || (filterFeatured === 'Featured' && item.featured) || (filterFeatured === 'Standard' && !item.featured);
    const matchesYear = filterYear === 'All' || item.year?.toString() === filterYear;
    return matchesSearch && matchesTab && matchesStatus && matchesFeatured && matchesYear;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'a-z') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'order') return (a.sortOrder || 0) - (b.sortOrder || 0);
    return 0;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const currentList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const metrics = {
    total: portfolioList.length,
    videos: portfolioList.filter(i => i.category === 'Videos').length,
    photos: portfolioList.filter(i => i.category === 'Photos').length,
    projects: portfolioList.filter(i => i.category === 'Projects').length,
    featured: portfolioList.filter(i => i.featured).length
  };

  const renderDashboardCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <Monitor className="w-5 h-5 text-blue-400 mb-2" />
        <span className="text-2xl font-serif text-white">{metrics.total}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Portfolio Items</span>
      </div>
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <Star className="w-5 h-5 text-luxury-gold mb-2" />
        <span className="text-2xl font-serif text-white">{metrics.featured}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Featured Work</span>
      </div>
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <Sparkles className="w-5 h-5 text-emerald-400 mb-2" />
        <span className="text-2xl font-serif text-white">{metrics.projects}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Project Cases</span>
      </div>
      <div className="bg-luxury-gold/10 border border-luxury-gold/30 p-4 rounded-xl flex flex-col justify-center items-center shadow-gold-glow-sm">
        <Download className="w-5 h-5 text-luxury-gold mb-2" />
        <span className="text-2xl font-serif text-luxury-gold">{metrics.videos}</span>
        <span className="text-[10px] uppercase tracking-wider text-luxury-gold/70">Video Items</span>
      </div>
    </div>
  );

  /* ===========================
        HERO HANDLERS
  =========================== */
  const handleSaveHero = () => {
    updateSection('portfolioHero', null, heroDraft);
    showToast("✅ Portfolio Hero Settings Saved!");
  };

  /* ===========================
        FILTER HANDLERS
  =========================== */
  const handleSaveFilter = () => {
    if (!filterDraftItem.name || !filterDraftItem.slug) return showToast("❌ Name and Slug are required.");
    let nextList = [];
    if (editingFilterId) {
      nextList = filtersDraft.map(f => f.id === editingFilterId ? { ...filterDraftItem, id: f.id } : f);
    } else {
      nextList = [...filtersDraft, { ...filterDraftItem, id: `pf-${Date.now()}` }];
    }
    setFiltersDraft(nextList);
    updateSection('portfolioFilters', null, nextList);
    setEditingFilterId(null);
    setFilterDraftItem({});
    showToast("✅ Filter Saved!");
  };

  const handleDeleteFilter = (id) => {
    const nextList = filtersDraft.filter(f => f.id !== id);
    setFiltersDraft(nextList);
    updateSection('portfolioFilters', null, nextList);
    showToast("✅ Filter Deleted!");
  };

  /* ===========================
        BULK ACTIONS
  =========================== */
  const toggleSelectAll = () => {
    if (selectedIds.length === currentList.length && currentList.length > 0) setSelectedIds([]);
    else setSelectedIds(currentList.map(item => item.id));
  };
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleBulkDelete = () => {
    updateSection('portfolio', null, portfolioList.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]); setIsBulkDeleteOpen(false); showToast(`✅ ${selectedIds.length} items deleted successfully.`);
  };

  const handleBulkStatusUpdate = () => {
    if (!bulkStatusTarget) return;
    updateSection('portfolio', null, portfolioList.map(item => selectedIds.includes(item.id) ? { ...item, status: bulkStatusTarget, updatedAt: new Date().toISOString() } : item));
    setBulkStatusTarget(''); setSelectedIds([]); showToast(`✅ Status updated to ${bulkStatusTarget}.`);
  };

  const handleBulkCategoryUpdate = () => {
    if (!bulkCategoryTarget) return;
    updateSection('portfolio', null, portfolioList.map(item => selectedIds.includes(item.id) ? { ...item, category: bulkCategoryTarget, updatedAt: new Date().toISOString() } : item));
    setBulkCategoryTarget(''); setSelectedIds([]); showToast(`✅ Category updated to ${bulkCategoryTarget}.`);
  };

  const handleExportCSV = () => {
    if (portfolioList.length === 0) return showToast("No records to export.");
    const headers = "ID,Title,Category,Client,Year,Status,Featured,Tags,SEO Title";
    const rows = portfolioList.map(item => `"${item.id}","${item.title}","${item.category}","${item.client}","${item.year}","${item.status}","${item.featured ? 'Yes' : 'No'}","${(item.tags || []).join(', ')}","${item.seoTitle || ''}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_export.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast(`✅ Exported to CSV/Excel!`);
  };

  /* ===========================
        CRUD HANDLERS
  =========================== */
  const handleStartAdd = () => {
    setDraftItem({ 
      title: '', subtitle: '', category: dynamicCategories[0] || 'Projects', categories: [], client: '', year: new Date().getFullYear().toString(), 
      description: '', caseStudy: '', externalUrl: '', projectUrl: '',
      coverImage: '', bannerImage: '', galleryImages: [], photoAssets: [], multipleVideos: [], reels: [], commercialShootVideos: [], featureVideo: '', mediaFile: '', youtubeUrl: '', vimeoUrl: '',
      tags: [], technology: [], industry: '', location: '', duration: '', photographer: '', director: '', brand: '', agency: '', credits: '', awards: '',
      accentColor: '#D4AF37', status: 'Active', featured: false, sortOrder: portfolioList.length + 1, 
      reviewCaseButtonText: 'Review Case', reviewCaseButtonTarget: 'Same Tab',
      seoTitle: '', seoDescription: '', metaKeywords: '', slug: '', canonicalUrl: '', schema: '', ogImage: '', twitterImage: ''
    });
    setEditingItemId(null);
    setActiveFormTab('General');
    setIsEditorOpen(true);
  };

  const handleStartEdit = (item) => {
    setDraftItem({ ...item, tags: item.tags || [], technology: item.technology || [], categories: item.categories || [], galleryImages: item.galleryImages || [], photoAssets: item.photoAssets || [], multipleVideos: item.multipleVideos || [], reels: item.reels || [], commercialShootVideos: item.commercialShootVideos || [], featureVideo: item.featureVideo || '', mediaFile: item.mediaFile || '' });
    setEditingItemId(item.id);
    setActiveFormTab('General');
    setIsEditorOpen(true);
  };

  const handleSaveItem = () => {
    if (!draftItem.title || !draftItem.category || !draftItem.coverImage || !draftItem.client) {
      return showToast("❌ Title, Category, Client, and Cover Image are required.");
    }
    let nextList = [];
    if (editingItemId) {
      nextList = portfolioList.map(item => item.id === editingItemId ? { ...draftItem, id: item.id, updatedAt: new Date().toISOString() } : item);
      showToast("✅ Portfolio updated successfully.");
    } else {
      nextList = [...portfolioList, { ...draftItem, id: `port-${Date.now()}`, createdAt: new Date().toISOString() }];
      showToast("✅ New portfolio item created.");
    }
    updateSection('portfolio', null, nextList);
    setIsEditorOpen(false);
  };

  const handleDeleteItem = () => {
    updateSection('portfolio', null, portfolioList.filter(item => item.id !== deletingItemId));
    setDeletingItemId(null);
    showToast("✅ Portfolio item deleted.");
  };

  const simulateMediaUpload = (fieldKey) => {
    openMediaManager({
      onSelect: (url) => {
        setDraftItem(prevItem => ({ ...prevItem, [fieldKey]: url }));
      }
    });
  };

  const handleAddArrayItem = (field, input, setInput) => {
    if (input.trim() && !draftItem[field]?.includes(input.trim())) {
      setDraftItem(prev => ({ ...prev, [field]: [...(prev[field] || []), input.trim()] }));
      setInput('');
    }
  };
  const handleRemoveArrayItem = (field, itemToRemove) => {
    setDraftItem(prev => ({ ...prev, [field]: (prev[field] || []).filter(i => i !== itemToRemove) }));
  };

  /* ===========================
        RENDERERS
  =========================== */
  return (
    <div className="flex flex-col gap-6 text-left relative min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm tracking-wide">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
            <Layers className="w-7 h-7 text-luxury-gold" /> Portfolio Engine
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button type="button" onClick={() => setShowHeroSettings(!showHeroSettings)} variant="secondary" size="sm" className="gap-1.5 border border-zinc-800 text-zinc-400">
            <Settings className="w-4 h-4" /> <span>Hero Settings</span>
          </Button>
          <Button type="button" onClick={() => setShowFilterManager(!showFilterManager)} variant="secondary" size="sm" className="gap-1.5 border border-zinc-800 text-zinc-400">
            <Filter className="w-4 h-4" /> <span>Manage Filters</span>
          </Button>
          <Button type="button" onClick={handleExportCSV} variant="secondary" size="sm" className="gap-1.5 border border-zinc-800 text-zinc-400">
            <FileDown className="w-4 h-4" /> <span>Export CSV</span>
          </Button>
          <Button type="button" onClick={handleStartAdd} variant="primary" size="sm" className="gap-1.5 bg-luxury-gold text-black font-bold">
            <Plus className="w-4 h-4" /> <span>Add Portfolio</span>
          </Button>
        </div>
      </div>

      {/* HERO SETTINGS CARD */}
      <AnimatePresence>
        {showHeroSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-white">Portfolio Hero Settings</h3>
              <Switch checked={heroDraft.isVisible || false} onChange={v => setHeroDraft(p => ({...p, isVisible: v}))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Small Heading" value={heroDraft.smallHeading || ''} onChange={e => setHeroDraft(p => ({...p, smallHeading: e.target.value}))} />
              <Input label="Highlight Text" value={heroDraft.highlightText || ''} onChange={e => setHeroDraft(p => ({...p, highlightText: e.target.value}))} />
              <Input label="Main Heading Line 1" value={heroDraft.mainHeadingLine1 || ''} onChange={e => setHeroDraft(p => ({...p, mainHeadingLine1: e.target.value}))} />
              <Input label="Main Heading Line 2" value={heroDraft.mainHeadingLine2 || ''} onChange={e => setHeroDraft(p => ({...p, mainHeadingLine2: e.target.value}))} />
              <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={heroDraft.description || ''} onChange={e => setHeroDraft(p => ({...p, description: e.target.value}))} /></div>
              <Input label="Background Image URL" value={heroDraft.bgImageUrl || ''} onChange={e => setHeroDraft(p => ({...p, bgImageUrl: e.target.value}))} />
              <Input label="Background Video URL" value={heroDraft.bgVideoUrl || ''} onChange={e => setHeroDraft(p => ({...p, bgVideoUrl: e.target.value}))} />
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <Button onClick={() => setHeroDraft(portfolioHero)} variant="secondary">Reset</Button>
              <Button onClick={handleSaveHero} variant="primary" className="bg-luxury-gold text-black">Save Hero</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER MANAGER CARD */}
      <AnimatePresence>
        {showFilterManager && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-xl font-serif text-white mb-6">Filter (Tabs) Management</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-black/40 p-4 rounded-xl border border-zinc-800">
                <div className="md:col-span-1"><Input label="Filter Name" value={filterDraftItem.name || ''} onChange={e => setFilterDraftItem(p => ({...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))} /></div>
                <div className="md:col-span-1"><Input label="Slug" value={filterDraftItem.slug || ''} onChange={e => setFilterDraftItem(p => ({...p, slug: e.target.value}))} /></div>
                <div className="md:col-span-1"><Input label="Order" type="number" value={filterDraftItem.order || ''} onChange={e => setFilterDraftItem(p => ({...p, order: e.target.value}))} /></div>
                <div className="md:col-span-1 flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Visibility</label><Switch checked={filterDraftItem.isVisible !== false} onChange={v => setFilterDraftItem(p => ({...p, isVisible: v}))} /></div>
                <div className="md:col-span-1 flex justify-end"><Button onClick={handleSaveFilter} variant="primary" className="bg-luxury-gold text-black w-full">{editingFilterId ? 'Update' : 'Add Filter'}</Button></div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {filtersDraft.sort((a,b)=> (a.order||0)-(b.order||0)).map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-zinc-600" />
                      <span className="font-bold text-zinc-200">{f.name}</span>
                      <span className="text-xs text-zinc-500 font-mono">/{f.slug}</span>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full border ${f.isVisible !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>{f.isVisible !== false ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFilterDraftItem(f); setEditingFilterId(f.id); }} className="p-1.5 text-zinc-400 hover:text-luxury-gold"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteFilter(f.id)} className="p-1.5 text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD & TABLE */}
      {!isEditorOpen ? (
        <div className="w-full flex flex-col gap-6">
          {renderDashboardCards()}
          
          <div className="flex flex-wrap gap-2 mb-2">
            <button onClick={() => { setActiveTab('Portfolio'); setCurrentPage(1); }} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeTab === 'Portfolio' ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700"}`}>All Work</button>
            {portfolioFilters.filter(f => f.isVisible !== false).sort((a,b)=>(a.order||0)-(b.order||0)).map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.name); setCurrentPage(1); }} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeTab === tab.name ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-zinc-950/40 border border-zinc-800/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex-1 w-full relative">
               <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
               <input type="text" placeholder="Search by title, client, year, or tags..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full bg-black/40 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-luxury-gold/50" />
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
               <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-luxury-gold/50">
                 <option value="All">All Statuses</option>
                 <option value="Active">Active</option>
                 <option value="Draft">Draft</option>
                 <option value="Inactive">Inactive</option>
               </select>
               <select value={filterYear} onChange={e => { setFilterYear(e.target.value); setCurrentPage(1); }} className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-luxury-gold/50">
                 <option value="All">All Years</option>
                 {Array.from(new Set(portfolioList.map(i => i.year).filter(Boolean))).sort().reverse().map(y => <option key={y} value={y}>{y}</option>)}
               </select>
               <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-black/40 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-luxury-gold/50">
                 <option value="order">Sort by Order</option>
                 <option value="newest">Newest First</option>
                 <option value="a-z">A-Z Title</option>
               </select>
             </div>
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-xl p-3 flex flex-wrap items-center justify-between overflow-hidden">
                <span className="text-sm font-medium text-luxury-gold">{selectedIds.length} item(s) selected</span>
                <div className="flex gap-2 items-center">
                   <select value={bulkStatusTarget} onChange={e => setBulkStatusTarget(e.target.value)} className="bg-black/60 border border-zinc-700 text-xs px-2 py-1.5 rounded-lg text-zinc-200"><option value="">Update Status...</option><option value="Active">Set Active</option><option value="Draft">Set Draft</option><option value="Inactive">Set Inactive</option></select>
                   <Button type="button" onClick={handleBulkStatusUpdate} variant="secondary" size="sm" className="h-8">Apply</Button>
                   <div className="w-px h-6 bg-zinc-700 mx-2"></div>
                   <select value={bulkCategoryTarget} onChange={e => setBulkCategoryTarget(e.target.value)} className="bg-black/60 border border-zinc-700 text-xs px-2 py-1.5 rounded-lg text-zinc-200"><option value="">Update Category...</option>{dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}</select>
                   <Button type="button" onClick={handleBulkCategoryUpdate} variant="secondary" size="sm" className="h-8">Apply</Button>
                   <div className="w-px h-6 bg-zinc-700 mx-2"></div>
                   <Button type="button" onClick={() => setIsBulkDeleteOpen(true)} className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 text-xs px-3 h-8 rounded-lg border-0">Bulk Delete</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
              <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4 w-10"><input type="checkbox" checked={selectedIds.length === currentList.length && currentList.length > 0} onChange={toggleSelectAll} className="rounded border-zinc-700 bg-black cursor-pointer" /></th>
                  <th className="px-5 py-4">Portfolio Item</th>
                  <th className="px-5 py-4">Category & Client</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/50">
                {currentList.length === 0 && <tr><td colSpan="7" className="px-5 py-8 text-center text-zinc-500 italic">No items found.</td></tr>}
                {currentList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors group">
                    <td className="px-5 py-4"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-zinc-700 bg-black cursor-pointer" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {item.coverImage ? <img src={item.coverImage} className="w-16 h-10 rounded-md object-cover border border-zinc-800" /> : <div className="w-16 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-600"/></div>}
                          {item.featured && <div className="absolute -top-1.5 -right-1.5 bg-luxury-gold text-black rounded-full p-0.5"><Star className="w-2.5 h-2.5 fill-current" /></div>}
                        </div>
                        <div className="flex flex-col"><span className="text-zinc-200 font-medium truncate max-w-[200px]">{item.title}</span><span className="text-[10px] text-zinc-500">{item.year}</span></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="flex flex-col gap-1"><span className="text-zinc-300 text-xs">{item.category}</span><span className="text-[10px] text-zinc-500 truncate max-w-[150px]">{item.client}</span></div></td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : item.status === 'Draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{item.status || 'Active'}</span></td>
                    <td className="px-5 py-4 text-zinc-500 font-mono text-xs">{item.sortOrder || idx + 1}</td>
                    <td className="px-5 py-4 text-zinc-500 font-mono text-[10px]">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setDraftItem(item); setIsViewerOpen(true); }} className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-white" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleStartEdit(item)} className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-luxury-gold" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeletingItemId(item.id)} className="p-1.5 hover:bg-zinc-900 rounded text-rose-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/50">
              <span className="text-xs text-zinc-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredList.length)} of {filteredList.length} items</span>
              <div className="flex items-center gap-2">
                <Button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="secondary" size="sm" className="px-2"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-xs font-medium px-2 text-zinc-300">Page {currentPage} of {totalPages}</span>
                <Button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="secondary" size="sm" className="px-2"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TABBED SPLIT SCREEN EDITOR */
        <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)]">
          
          <div className="w-full lg:w-2/3 bg-zinc-950/40 border border-luxury-gold/20 p-6 rounded-2xl shadow-gold-glow-lg flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80 z-20">
              <h2 className="text-xl font-serif text-white flex items-center gap-2"><Edit2 className="w-5 h-5 text-luxury-gold"/> {editingItemId ? 'Edit Portfolio Item' : 'Create Portfolio Item'}</h2>
              <button onClick={() => { if(window.confirm("Discard changes?")) setIsEditorOpen(false); }} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            {/* FORM TABS */}
            <div className="flex gap-4 border-b border-zinc-800 pt-4 mb-4">
              {['General', 'Media', 'Metadata', 'SEO'].map(tab => (
                <button key={tab} onClick={() => setActiveFormTab(tab)} className={`pb-2 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 ${activeFormTab === tab ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>{tab}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
              
              {/* GENERAL TAB */}
              {activeFormTab === 'General' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <div className="md:col-span-2"><Input label="Portfolio Title *" value={draftItem.title || ''} onChange={(e) => setDraftItem(p => ({...p, title: e.target.value}))} /></div>
                   <div className="md:col-span-2"><Input label="Subtitle" value={draftItem.subtitle || ''} onChange={(e) => setDraftItem(p => ({...p, subtitle: e.target.value}))} /></div>
                   <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Primary Category *</label><select value={draftItem.category || ''} onChange={e => setDraftItem(p => ({...p, category: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100">{dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                   <Input label="Client Name *" value={draftItem.client || ''} onChange={(e) => setDraftItem(p => ({...p, client: e.target.value}))} />
                   <Input label="Year *" type="number" value={draftItem.year || ''} onChange={(e) => setDraftItem(p => ({...p, year: e.target.value}))} />
                   <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</label><select value={draftItem.status || 'Active'} onChange={e => setDraftItem(p => ({...p, status: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Draft">Draft</option></select></div>
                   <div className="md:col-span-2"><Input label="Description *" textarea rows={3} value={draftItem.description || ''} onChange={(e) => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                   <div className="md:col-span-2"><Input label="Case Study Text" textarea rows={4} value={draftItem.caseStudy || ''} onChange={(e) => setDraftItem(p => ({...p, caseStudy: e.target.value}))} /></div>
                   <Input label="External URL" value={draftItem.externalUrl || ''} onChange={(e) => setDraftItem(p => ({...p, externalUrl: e.target.value}))} />
                   <Input label="Project URL" value={draftItem.projectUrl || ''} onChange={(e) => setDraftItem(p => ({...p, projectUrl: e.target.value}))} />
                   <div className="flex items-center gap-3 mt-4"><Switch checked={draftItem.featured || false} onChange={v => setDraftItem(p => ({...p, featured: v}))} /><span className="text-sm text-zinc-300">Featured Item</span></div>
                   <div className="flex items-center gap-3 bg-black/40 border border-zinc-800 rounded-xl p-1.5 pr-4"><input type="color" value={draftItem.accentColor || '#D4AF37'} onChange={e => setDraftItem(p => ({...p, accentColor: e.target.value}))} className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0" /><input type="text" value={draftItem.accentColor || '#D4AF37'} onChange={e => setDraftItem(p => ({...p, accentColor: e.target.value}))} className="flex-1 bg-transparent text-sm text-zinc-200 outline-none font-mono" /></div>
                   <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                     <Input label="Review Button Text" value={draftItem.reviewCaseButtonText || ''} onChange={e => setDraftItem(p => ({...p, reviewCaseButtonText: e.target.value}))} />
                     <Input label="Review Button Link" value={draftItem.reviewCaseButtonLink || ''} onChange={e => setDraftItem(p => ({...p, reviewCaseButtonLink: e.target.value}))} />
                     <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Open in</label><select value={draftItem.reviewCaseButtonTarget || 'Same Tab'} onChange={e => setDraftItem(p => ({...p, reviewCaseButtonTarget: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100"><option value="Same Tab">Same Tab</option><option value="New Tab">New Tab</option></select></div>
                   </div>
                </div>
              )}

              {/* MEDIA TAB */}
              {activeFormTab === 'Media' && (
                <div className="flex flex-col gap-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Cover Image *</label>
                       {draftItem.coverImage ? (
                          <div className="relative w-full h-32 bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden group"><img src={draftItem.coverImage} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"><button onClick={() => simulateMediaUpload('coverImage')} className="px-3 py-1.5 bg-zinc-900 rounded-lg text-luxury-gold text-xs flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Replace</button></div></div>
                       ) : (
                          <div onClick={() => simulateMediaUpload('coverImage')} className="w-full h-32 border-2 border-dashed border-zinc-800 hover:border-luxury-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-955/20">{uploadingField === 'coverImage' ? <RefreshCw className="w-6 h-6 animate-spin text-luxury-gold" /> : <><ImageIcon className="w-6 h-6 text-zinc-600 mb-1" /><span className="text-xs text-zinc-400">Upload Cover</span></>}</div>
                       )}
                     </div>
                     <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Banner Image</label>
                       {draftItem.bannerImage ? (
                          <div className="relative w-full h-32 bg-zinc-955 border border-zinc-800 rounded-lg overflow-hidden group"><img src={draftItem.bannerImage} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"><button onClick={() => simulateMediaUpload('bannerImage')} className="px-3 py-1.5 bg-zinc-900 rounded-lg text-luxury-gold text-xs flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Replace</button></div></div>
                       ) : (
                          <div onClick={() => simulateMediaUpload('bannerImage')} className="w-full h-32 border-2 border-dashed border-zinc-800 hover:border-luxury-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-955/20">{uploadingField === 'bannerImage' ? <RefreshCw className="w-6 h-6 animate-spin text-luxury-gold" /> : <><ImageIcon className="w-6 h-6 text-zinc-600 mb-1" /><span className="text-xs text-zinc-400">Upload Banner</span></>}</div>
                       )}
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-800/50 pt-6">
                     <FileUpload label="Upload Feature Video" value={draftItem.featureVideo || ''} onChange={(url) => setDraftItem(p => ({ ...p, featureVideo: url }))} accept="video/*" />
                     <FileUpload label="Upload Media File" value={draftItem.mediaFile || ''} onChange={(url) => setDraftItem(p => ({ ...p, mediaFile: url }))} accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
                   </div>
                   {draftItem.featureVideo && (
                     <div className="mt-4">
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Feature Video Preview</label>
                       <video controls src={draftItem.featureVideo} className="w-full rounded-2xl border border-zinc-800 bg-black" />
                     </div>
                   )}
                   {draftItem.mediaFile && (
                     <div className="mt-4">
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Media File Preview</label>
                       {draftItem.mediaFile.endsWith('.mp4') || draftItem.mediaFile.endsWith('.webm') || draftItem.mediaFile.endsWith('.ogg') ? (
                         <video controls src={draftItem.mediaFile} className="w-full rounded-2xl border border-zinc-800 bg-black" />
                       ) : draftItem.mediaFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                         <img src={draftItem.mediaFile} className="w-full rounded-2xl border border-zinc-800 object-cover" />
                       ) : (
                         <div className="rounded-2xl border border-zinc-800 bg-black/70 p-4 text-sm text-zinc-300">{draftItem.mediaFile.split('/').pop() || draftItem.mediaFile}</div>
                       )}
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-zinc-800/50 pt-6">
                     <div className="space-y-4">
                       <FileUpload label="Upload Photo Asset" value="" onChange={(url) => setDraftItem(prev => ({ ...prev, photoAssets: [...(prev.photoAssets || []), url] }))} accept="image/*" />
                       {draftItem.photoAssets?.length > 0 && (
                         <div className="grid grid-cols-2 gap-2">
                           {draftItem.photoAssets.map((url, idx) => (
                             <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                               <img src={url} className="w-full h-full object-cover" />
                               <button type="button" onClick={() => setDraftItem(prev => ({ ...prev, photoAssets: prev.photoAssets.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>

                     <div className="space-y-4">
                       <FileUpload label="Upload Reel" value="" onChange={(url) => setDraftItem(prev => ({ ...prev, reels: [...(prev.reels || []), url] }))} accept="video/*" />
                       {draftItem.reels?.length > 0 && (
                         <div className="flex flex-col gap-2">
                           {draftItem.reels.map((url, idx) => (
                             <div key={idx} className="bg-black/30 rounded-xl p-3 border border-zinc-800 flex items-center justify-between gap-2">
                               <span className="text-xs text-zinc-400 truncate">{url.split('/').pop() || url}</span>
                               <button type="button" onClick={() => setDraftItem(prev => ({ ...prev, reels: prev.reels.filter((_, i) => i !== idx) }))} className="text-rose-400 p-1"><X className="w-3.5 h-3.5" /></button>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>

                     <div className="space-y-4">
                       <FileUpload label="Upload Commercial Shoot" value="" onChange={(url) => setDraftItem(prev => ({ ...prev, commercialShootVideos: [...(prev.commercialShootVideos || []), url] }))} accept="video/*" />
                       {draftItem.commercialShootVideos?.length > 0 && (
                         <div className="flex flex-col gap-2">
                           {draftItem.commercialShootVideos.map((url, idx) => (
                             <div key={idx} className="bg-black/30 rounded-xl p-3 border border-zinc-800 flex items-center justify-between gap-2">
                               <span className="text-xs text-zinc-400 truncate">{url.split('/').pop() || url}</span>
                               <button type="button" onClick={() => setDraftItem(prev => ({ ...prev, commercialShootVideos: prev.commercialShootVideos.filter((_, i) => i !== idx) }))} className="text-rose-400 p-1"><X className="w-3.5 h-3.5" /></button>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="border-t border-zinc-800/50 pt-6">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Gallery Images (Multiple)</label>
                      <div className="flex mb-3">
                        <button type="button" onClick={() => openMediaManager({ onSelect: (url) => setDraftItem(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), url] })) })} className="w-full border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-955/50 rounded-lg px-4 py-2.5 text-sm text-zinc-400 transition-colors">
                          Upload Images via Media Hub
                        </button>
                      </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {(draftItem.galleryImages || []).map((img, i) => (
                         <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group"><img src={img} className="w-full h-full object-cover" /><button onClick={() => handleRemoveArrayItem('galleryImages', img)} className="absolute top-1 right-1 bg-rose-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button></div>
                       ))}
                     </div>
                   </div>

                   <div className="border-t border-zinc-800/50 pt-6">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Multiple Videos (Media Hub)</label>
                      <div className="flex mb-3">
                        <button type="button" onClick={() => openMediaManager({ onSelect: (url) => setDraftItem(prev => ({ ...prev, multipleVideos: [...(prev.multipleVideos || []), url] })) })} className="w-full border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-955/50 rounded-lg px-4 py-2.5 text-sm text-zinc-400 transition-colors">
                          Upload Videos via Media Hub
                        </button>
                      </div>
                     <div className="flex flex-col gap-2">
                       {(draftItem.multipleVideos || []).map((vid, i) => (
                         <div key={i} className="flex justify-between items-center bg-black/30 p-2 rounded border border-zinc-800"><span className="text-xs text-zinc-400 truncate">{vid}</span><button onClick={() => handleRemoveArrayItem('multipleVideos', vid)} className="text-rose-400 p-1"><Trash2 className="w-3.5 h-3.5"/></button></div>
                       ))}
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-zinc-800/50">
                     <Input label="YouTube Embed URL" value={draftItem.youtubeUrl || ''} onChange={(e) => setDraftItem(p => ({...p, youtubeUrl: e.target.value}))} />
                     <Input label="Vimeo Embed URL" value={draftItem.vimeoUrl || ''} onChange={(e) => setDraftItem(p => ({...p, vimeoUrl: e.target.value}))} />
                   </div>
                </div>
              )}

              {/* METADATA TAB */}
              {activeFormTab === 'Metadata' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <div className="md:col-span-2 flex flex-col gap-2">
                     <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tags</label>
                     <div className="flex gap-2"><input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){ e.preventDefault(); handleAddArrayItem('tags', tagInput, setTagInput);}}} placeholder="Type tag..." className="flex-1 bg-black/40 border border-zinc-800 rounded-lg px-4 py-2 text-sm" /><Button onClick={() => handleAddArrayItem('tags', tagInput, setTagInput)} variant="secondary">Add</Button></div>
                     <div className="flex flex-wrap gap-2 mt-1">{draftItem.tags?.map(t => <span key={t} className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">{t} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveArrayItem('tags', t)}/></span>)}</div>
                   </div>
                   
                   <div className="md:col-span-2 flex flex-col gap-2">
                     <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Technology Stack</label>
                     <div className="flex gap-2"><input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){ e.preventDefault(); handleAddArrayItem('technology', techInput, setTechInput);}}} placeholder="React, Unreal Engine..." className="flex-1 bg-black/40 border border-zinc-800 rounded-lg px-4 py-2 text-sm" /><Button onClick={() => handleAddArrayItem('technology', techInput, setTechInput)} variant="secondary">Add</Button></div>
                     <div className="flex flex-wrap gap-2 mt-1">{draftItem.technology?.map(t => <span key={t} className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-blue-300 flex items-center gap-1">{t} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveArrayItem('technology', t)}/></span>)}</div>
                   </div>

                   <Input label="Industry" value={draftItem.industry || ''} onChange={e => setDraftItem(p => ({...p, industry: e.target.value}))} />
                   <Input label="Location" value={draftItem.location || ''} onChange={e => setDraftItem(p => ({...p, location: e.target.value}))} />
                   <Input label="Duration" value={draftItem.duration || ''} onChange={e => setDraftItem(p => ({...p, duration: e.target.value}))} />
                   <Input label="Photographer" value={draftItem.photographer || ''} onChange={e => setDraftItem(p => ({...p, photographer: e.target.value}))} />
                   <Input label="Director" value={draftItem.director || ''} onChange={e => setDraftItem(p => ({...p, director: e.target.value}))} />
                   <Input label="Brand" value={draftItem.brand || ''} onChange={e => setDraftItem(p => ({...p, brand: e.target.value}))} />
                   <Input label="Agency" value={draftItem.agency || ''} onChange={e => setDraftItem(p => ({...p, agency: e.target.value}))} />
                   <Input label="Credits" value={draftItem.credits || ''} onChange={e => setDraftItem(p => ({...p, credits: e.target.value}))} />
                   <div className="md:col-span-2"><Input label="Awards" value={draftItem.awards || ''} onChange={e => setDraftItem(p => ({...p, awards: e.target.value}))} /></div>
                </div>
              )}

              {/* SEO TAB */}
              {activeFormTab === 'SEO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <Input label="SEO Meta Title" value={draftItem.seoTitle || ''} onChange={e => setDraftItem(p => ({...p, seoTitle: e.target.value}))} />
                   <Input label="URL Slug" value={draftItem.slug || ''} onChange={e => setDraftItem(p => ({...p, slug: e.target.value}))} />
                   <div className="md:col-span-2"><Input label="SEO Meta Description" textarea rows={2} value={draftItem.seoDescription || ''} onChange={e => setDraftItem(p => ({...p, seoDescription: e.target.value}))} /></div>
                   <div className="md:col-span-2"><Input label="Meta Keywords (Comma separated)" value={draftItem.metaKeywords || ''} onChange={e => setDraftItem(p => ({...p, metaKeywords: e.target.value}))} /></div>
                   <Input label="Canonical URL" value={draftItem.canonicalUrl || ''} onChange={e => setDraftItem(p => ({...p, canonicalUrl: e.target.value}))} />
                   <div className="md:col-span-2"><Input label="Schema JSON" textarea rows={4} value={draftItem.schema || ''} onChange={e => setDraftItem(p => ({...p, schema: e.target.value}))} /></div>
                   <Input label="Open Graph (OG) Image URL" value={draftItem.ogImage || ''} onChange={e => setDraftItem(p => ({...p, ogImage: e.target.value}))} />
                   <Input label="Twitter Image URL" value={draftItem.twitterImage || ''} onChange={e => setDraftItem(p => ({...p, twitterImage: e.target.value}))} />
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 mt-auto bg-zinc-950/90 z-20">
              <Button onClick={() => { if(window.confirm("Discard changes?")) setIsEditorOpen(false); }} variant="secondary">Cancel</Button>
              <Button onClick={handleSaveItem} variant="primary" className="bg-luxury-gold text-black font-bold px-8">Save Record</Button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden items-center justify-center">
             <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest"><Eye className="w-4 h-4"/> Visitor Card Preview</div>
             <div className="w-full max-w-[400px]">
                <TiltCard maxTilt={8} glowColor={draftItem.accentColor || '#D4AF37'}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 mb-6 relative bg-zinc-900 flex items-center justify-center">
                        {draftItem.coverImage ? <img src={draftItem.coverImage} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /> : <ImageIcon className="w-8 h-8 text-zinc-700" />}
                        <div className="absolute top-4 left-4 bg-black/85 border border-white/10 px-3 py-1 rounded-full text-[9px] uppercase tracking-[1px] font-mono text-luxury-gold/90">{draftItem.category || 'Category'}</div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-[2px] opacity-40 font-bold">{draftItem.client || 'Client Name'}</span>
                        <span className="font-mono text-xs text-luxury-gold">{draftItem.year || '2026'}</span>
                      </div>
                      <h3 className="font-serif text-2xl text-white font-medium mb-1 hover:text-luxury-gold transition-colors duration-300">{draftItem.title || 'Portfolio Title'}</h3>
                      {draftItem.subtitle && <p className="text-zinc-400 text-xs italic mb-2">{draftItem.subtitle}</p>}
                      <p className="text-zinc-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">{draftItem.description || 'Description of the portfolio project goes here...'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1.5">
                        {(draftItem.tags?.length ? draftItem.tags.slice(0,3) : ['Tag 1']).map(tag => <span key={tag} className="px-2.5 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-zinc-400">{tag}</span>)}
                        {draftItem.tags?.length > 3 && <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-zinc-400">+{draftItem.tags.length - 3}</span>}
                      </div>
                      <button className="text-luxury-gold hover:text-white transition-colors duration-300 flex items-center gap-1 text-xs uppercase font-bold tracking-[1px]">{draftItem.reviewCaseButtonText || 'Review Case'} <ArrowUpRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </TiltCard>
             </div>
          </div>
        </div>
      )}

      {/* POPUPS */}
      <ConfirmDialog isOpen={deletingItemId !== null} onClose={() => setDeletingItemId(null)} title="Delete Portfolio Item" message="Are you sure you want to permanently delete this portfolio case study? This action cannot be undone." confirmText="Delete Permanently" cancelText="Cancel" onConfirm={handleDeleteItem} />
      <ConfirmDialog isOpen={isBulkDeleteOpen} onClose={() => setIsBulkDeleteOpen(false)} title="Bulk Delete Items" message={`Are you sure you want to delete ${selectedIds.length} items permanently?`} confirmText={`Delete ${selectedIds.length} Items`} cancelText="Cancel" onConfirm={handleBulkDelete} />
      
      <Dialog isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} title={<span className="font-serif">Mega Portfolio View</span>}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <TiltCard maxTilt={8} glowColor={draftItem.accentColor || '#D4AF37'}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 mb-6 relative bg-zinc-900 flex items-center justify-center">
                        {draftItem.coverImage ? <img src={draftItem.coverImage} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /> : <ImageIcon className="w-8 h-8 text-zinc-700" />}
                        <div className="absolute top-4 left-4 bg-black/85 border border-white/10 px-3 py-1 rounded-full text-[9px] uppercase tracking-[1px] font-mono text-luxury-gold/90">{draftItem.category || 'Category'}</div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-[2px] opacity-40 font-bold">{draftItem.client || 'Client Name'}</span>
                        <span className="font-mono text-xs text-luxury-gold">{draftItem.year || '2026'}</span>
                      </div>
                      <h3 className="font-serif text-2xl text-white font-medium mb-1 hover:text-luxury-gold transition-colors duration-300">{draftItem.title || 'Portfolio Title'}</h3>
                      <p className="text-zinc-400 text-xs font-light leading-relaxed mb-6 line-clamp-3">{draftItem.description || 'Description of the portfolio project goes here...'}</p>
                    </div>
                  </div>
                </TiltCard>
            </div>
            <div className="flex flex-col gap-6 text-sm text-zinc-300">
               <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                 <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Status</span><span className={draftItem.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{draftItem.status}</span></div>
                 <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Featured</span><span className={draftItem.featured ? 'text-luxury-gold font-bold' : 'text-zinc-400'}>{draftItem.featured ? 'Yes' : 'No'}</span></div>
                 <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Industry / Location</span><span className="font-medium text-white">{draftItem.industry || 'N/A'} / {draftItem.location || 'N/A'}</span></div>
                 <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-zinc-500">Director / Photographer</span><span className="font-medium text-white">{draftItem.director || 'N/A'} / {draftItem.photographer || 'N/A'}</span></div>
               </div>
               
               <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
                 <span className="text-[10px] uppercase tracking-wider text-zinc-500">Technology Stack</span>
                 <div className="flex flex-wrap gap-1">{draftItem.technology?.map(t => <span key={t} className="px-2 py-0.5 bg-black rounded text-[10px]">{t}</span>) || 'N/A'}</div>
               </div>

               <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
                 <span className="text-[10px] uppercase tracking-wider text-zinc-500">SEO Profile</span>
                 <span><b className="text-zinc-400">Title:</b> {draftItem.seoTitle || 'N/A'}</span>
                 <span><b className="text-zinc-400">Slug:</b> {draftItem.slug || 'N/A'}</span>
                 <span><b className="text-zinc-400">Keywords:</b> {draftItem.metaKeywords || 'N/A'}</span>
               </div>

               <div className="flex flex-col gap-1">
                 <span className="text-[10px] uppercase tracking-wider text-zinc-500">Record Timestamps</span>
                 <span>Created: {new Date(draftItem.createdAt).toLocaleString()}</span>
                 <span>Updated: {draftItem.updatedAt ? new Date(draftItem.updatedAt).toLocaleString() : 'Never'}</span>
               </div>
               <Button onClick={() => { setIsViewerOpen(false); handleStartEdit(draftItem); }} variant="primary" className="mt-auto bg-luxury-gold text-black w-full shadow-gold-glow">Edit Full Record</Button>
            </div>
         </div>
      </Dialog>
    </div>
  );
}
