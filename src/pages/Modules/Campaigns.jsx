import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { TiltCard } from '../../components/ui/TiltCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Search, Plus, Edit2, Trash2, X, Eye, 
  ExternalLink, Calendar, DollarSign, Target, BarChart2
} from 'lucide-react';

export const Campaigns = ({ activeSubFeature }) => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const list = db.campaigns || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Active panels
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D campaign showcase
  // Tab state: 'Campaigns' or 'Product Launches'
  const [selectedTab, setSelectedTab] = useState('Campaigns');
  // Launch form & delete state
  const [isLaunchFormOpen, setIsLaunchFormOpen] = useState(false);
  const [launchEditing, setLaunchEditing] = useState(null);
  const [launchFormData, setLaunchFormData] = useState({});
  const [deleteLaunchId, setDeleteLaunchId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Dynamic KPI fields state
  const [kpiLabel, setKpiLabel] = useState('');
  const [kpiValue, setKpiValue] = useState('');

  // 3D image tilt states in modal
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });
  const [imgHovered, setImgHovered] = useState(false);

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    // Tilt limit
    const tiltLimit = 12;
    setImgTilt({
      x: -normalizedY * tiltLimit,
      y: normalizedX * tiltLimit
    });
  };

  const handleImageMouseLeave = () => {
    setImgHovered(false);
    setImgTilt({ x: 0, y: 0 });
  };

  // Filter list
  const filteredList = list.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandPartner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.outcome || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && item.isActive) || 
      (statusFilter === 'inactive' && !item.isActive);

    return matchesSearch && matchesStatus;
  });

  // Open Edit/Create Form
  const openForm = (e, item = null) => {
    e.stopPropagation(); // Avoid opening details modal
    setFormErrors({});
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        // Fallback for older entries
        kpis: item.kpis || []
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        brandPartner: '',
        timeline: '',
        bannerUrl: '',
        metrics: '',
        outcome: '',
        detailedDescription: '',
        budget: '',
        targetAudience: '',
        kpis: [],
        isActive: true
      });
    }
    setIsFormOpen(true);
  };

  const openLaunchForm = (e, item = null) => {
    e?.stopPropagation?.();
    setLaunchEditing(item);
    if (item) {
      setLaunchFormData({ ...item });
    } else {
      setLaunchFormData({
        productName: '',
        launchEventTitle: '',
        videosList: '',
        brandDetails: '',
        releaseDate: '',
        isActive: true
      });
    }
    setIsLaunchFormOpen(true);
  };

  const handleLaunchInputChange = (name, value) => {
    setLaunchFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLaunchSubmit = (e) => {
    e?.preventDefault?.();
    if (!launchFormData.productName || !launchFormData.launchEventTitle) {
      return;
    }
    if (launchEditing) {
      updateItem('launches', launchEditing.id, launchFormData);
      if (showcaseItem?.id === launchEditing.id) setShowcaseItem(prev => ({ ...prev, ...launchFormData }));
    } else {
      addItem('launches', launchFormData);
    }
    setIsLaunchFormOpen(false);
  };

  const handleDeleteLaunchConfirm = () => {
    if (deleteLaunchId) {
      deleteItem('launches', deleteLaunchId);
      if (showcaseItem?.id === deleteLaunchId) setShowcaseItem(null);
      setDeleteLaunchId(null);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddKpi = () => {
    if (!kpiLabel.trim() || !kpiValue.trim()) return;
    const currentKpis = formData.kpis || [];
    handleInputChange('kpis', [...currentKpis, { label: kpiLabel.trim(), value: kpiValue.trim() }]);
    setKpiLabel('');
    setKpiValue('');
  };

  const handleRemoveKpi = (idx) => {
    const currentKpis = formData.kpis || [];
    handleInputChange('kpis', currentKpis.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.brandPartner.trim() || !formData.bannerUrl.trim()) {
      setFormErrors({
        title: !formData.title ? 'Campaign title is required.' : '',
        brandPartner: !formData.brandPartner ? 'Brand partner is required.' : '',
        bannerUrl: !formData.bannerUrl ? 'Banner image URL is required.' : ''
      });
      return;
    }

    if (editingItem) {
      updateItem('campaigns', editingItem.id, formData);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...formData }));
      }
    } else {
      addItem('campaigns', formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem('campaigns', deleteId);
      if (showcaseItem?.id === deleteId) {
        setShowcaseItem(null);
      }
      setDeleteId(null);
    }
  };

  React.useEffect(() => {
    if (activeSubFeature && (activeSubFeature === 'Campaigns' || activeSubFeature === 'Product Launches')) {
      setSelectedTab(activeSubFeature);
    }
  }, [activeSubFeature]);

  const navigateTo = (view) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view } }));
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      {/* <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
           Campaign & Product Launch Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} global campaigns. Manage Campaign Planning, Strategy, Execution and Product Launches.
          </p>
        </div>
        {selectedTab === 'Add Campaign' ? (
          <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
            <Plus className="w-4 h-4 text-black" />
            <span className="text-black">New Campaign</span>
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={(e) => openLaunchForm(e, null)} className="gap-2">
            <Plus className="w-4 h-4 text-black" />
            <span className="text-black">New Launch</span>
          </Button>
        )}
      </div> */}
      <div className="flex items-start justify-between border-b border-zinc-800 pb-5 mb-6">
    <div>
        <h2 className="text-3xl font-serif text-white">
            Campaign & Product Launch Management
        </h2>

        <p className="text-zinc-400 mt-2">
            Manage Campaign Planning, Strategy, Execution and Product Launches.
        </p>
    </div>

    {selectedTab === "Campaigns" ? (
        <button
            onClick={(e) => openForm(e, null)}
            className="bg-[#D4AF37] hover:bg-[#C9A227] text-black font-semibold px-5 py-2 rounded-lg transition"
        >
            + Add Campaign
        </button>
    ) : (
        <button
            onClick={(e) => openLaunchForm(e, null)}
            className="bg-[#D4AF37] hover:bg-[#C9A227] text-black font-semibold px-5 py-2 rounded-lg transition"
        >
            + Launch Product
        </button>
    )}
</div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search campaigns, brands, or outcomes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Internal Sidebar */}
        <aside className="hidden md:flex flex-col w-44 gap-2 sticky top-28 self-start">
          <button onClick={() => setSelectedTab('Campaigns')} className={`text-left px-3 py-2 rounded ${selectedTab === 'Campaigns' ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20' : 'text-zinc-400 hover:bg-zinc-900/30'}`}>
            Campaigns
          </button>
          <button onClick={() => setSelectedTab('Product Launches')} className={`text-left px-3 py-2 rounded ${selectedTab === 'Product Launches' ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20' : 'text-zinc-400 hover:bg-zinc-900/30'}`}>
            Product Launches
          </button>
          <div className="mt-3 border-t border-zinc-900/60 pt-3 flex flex-col gap-2">
            <button onClick={() => navigateTo('portfolio-gallery')} className="text-xs text-zinc-400 hover:text-zinc-100 text-left">Open Portfolio</button>
            <button onClick={() => navigateTo('services')} className="text-xs text-zinc-400 hover:text-zinc-100 text-left">Open Services</button>
            <button onClick={() => navigateTo('media-coverage')} className="text-xs text-zinc-400 hover:text-zinc-100 text-left">Media Coverage</button>
          </div>
        </aside>

        {/* Content Column */}
        <div className="flex-1">
          {/* Campaigns list cards OR Product Launches list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedTab === 'Campaigns' ? (
              filteredList.length === 0 ? (
                <p className="text-sm text-zinc-500 italic p-6 col-span-full">No campaigns found.</p>
              ) : (
                filteredList.map((item) => (
                  <div key={item.id} className="cursor-pointer" onClick={() => setShowcaseItem(item)}>
                    <TiltCard className="p-4 border border-zinc-800/60 rounded-md flex flex-col gap-2">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="text-[10px] text-luxury-gold font-mono uppercase">{item.brandPartner}</span>
                          <h3 className="font-serif text-sm font-bold text-zinc-200 mt-1">{item.title}</h3>
                        </div>
                        <Badge variant={item.isActive ? 'gold' : 'default'}>{item.isActive ? 'Live' : 'Draft'}</Badge>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{item.metrics || (item.kpis && item.kpis[0]?.value) || '—'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={(e) => { e.stopPropagation(); openForm(e, item); }} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setShowcaseItem(item); }} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </TiltCard>
                  </div>
                ))
              )
            ) : (
              // Product Launches view
              (db.launches || []).length === 0 ? (
                <p className="text-sm text-zinc-500 italic p-6 col-span-full">No product launches found.</p>
              ) : (
                (db.launches || []).map((l) => (
                  <div key={l.id} className="cursor-pointer" onClick={() => setShowcaseItem({ ...l, isLaunch: true })}>
                    <TiltCard className="p-4 border border-zinc-800/60 rounded-md flex flex-col gap-2">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h3 className="font-serif text-sm font-bold text-zinc-200">{l.productName}</h3>
                          <p className="text-xs text-zinc-400">{l.launchEventTitle}</p>
                        </div>
                        <Badge variant={l.isActive ? 'gold' : 'default'}>{l.isActive ? 'Live' : 'Draft'}</Badge>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{l.brandDetails || ''}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setShowcaseItem({ ...l, isLaunch: true }); }}>Preview</Button>
                        <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); openLaunchForm(e, l); }}>Open</Button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteLaunchId(l.id); }} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TiltCard>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* 3D IMMERSIVE SHOWCASE DIALOG */}
      <AnimatePresence>
        {showcaseItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowcaseItem(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40"
            />

            {/* Showcase panel */}
            <motion.div
              layoutId={`camp-card-${showcaseItem.id}`}
              className="relative w-full max-w-4xl glass-panel border border-zinc-800 rounded-lg overflow-hidden z-50 flex flex-col md:flex-row text-left shadow-gold-glow-lg"
              style={{ perspective: 1200 }}
            >
              {/* Left animated product image / video panel with 3D slant */}
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={handleImageMouseLeave}
                className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden relative group border-b md:border-b-0 md:border-r border-zinc-800/80 cursor-crosshair select-none"
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              >
                {showcaseItem.isLaunch ? (
                  <video className="w-full h-full object-cover" src={showcaseItem.videosList} controls />
                ) : (
                  <motion.img 
                    src={showcaseItem.bannerUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"} 
                    alt="" 
                    animate={{
                      rotateX: imgTilt.x,
                      rotateY: imgTilt.y,
                      scale: imgHovered ? 1.05 : 1.01
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="w-full h-full object-cover" 
                  />
                )}

                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 flex flex-col justify-between p-6 pointer-events-none z-10"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div 
                    className="w-10 h-10 rounded-full bg-black/60 border border-luxury-gold/30 backdrop-blur flex items-center justify-center font-serif font-black text-luxury-gold"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    AD
                  </div>

                  <div 
                    className="bg-black/65 border border-luxury-gold/20 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 w-full max-w-[280px]"
                    style={{ transform: 'translateZ(60px)' }}
                  >
                    <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">SIGNATURE CAMPAIGN PROJECT</span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.brandPartner}</h3>
                  </div>
                </div>
              </motion.div>

              {/* Right content details pane */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                <button
                  onClick={() => setShowcaseItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900/60 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-6">
                  {/* Timeline & Status */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>{showcaseItem.isLaunch ? showcaseItem.releaseDate : showcaseItem.timeline}</span>
                    </div>
                    <Badge variant={showcaseItem.isActive ? 'gold' : 'default'}>
                      {showcaseItem.isActive ? 'Live' : 'Draft'}
                    </Badge>
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <h2 className="font-serif text-xl font-bold text-zinc-100">{showcaseItem.isLaunch ? showcaseItem.productName : showcaseItem.title}</h2>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold font-mono">{showcaseItem.isLaunch ? showcaseItem.brandDetails : showcaseItem.brandPartner} {showcaseItem.isLaunch ? '' : 'Collaboration'}</p>
                  </div>

                  {/* Narrative details */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Campaign Overview</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                      {showcaseItem.isLaunch ? (showcaseItem.brandDetails || "Product launch details and event overview.") : (showcaseItem.detailedDescription || "This luxury co-branded campaign integrates digital aesthetics with custom web config features and cinematic assets.")}
                    </p>
                  </div>

                  {/* Budget & Target Audience Info cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-3">
                      <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded">
                        <DollarSign className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 uppercase font-semibold">Budget Allocation</span>
                        <span className="text-xs font-bold text-zinc-200">{showcaseItem.budget || "N/A"}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-3">
                      <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded">
                        <Target className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 uppercase font-semibold">Target Audience</span>
                        <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px]" title={showcaseItem.targetAudience}>
                          {showcaseItem.targetAudience || "Luxury Consumers"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Outcome statement */}
                  <div className="flex flex-col gap-1.5 p-3 bg-zinc-900/10 border border-zinc-900/60 rounded-md border-l-2 border-l-luxury-gold">
                    <h4 className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                      Campaign Outcome & Impact
                    </h4>
                    <p className="text-xs text-zinc-300 italic">
                      "{showcaseItem.outcome || "Initial launch preparations under schedule."}"
                    </p>
                  </div>

                  {/* KPI Grid (Progressive fade-in) */}
                  {showcaseItem.kpis && showcaseItem.kpis.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Performance Indicators</h4>
                      <div className="grid grid-cols-3 gap-2.5">
                        {showcaseItem.kpis.map((kpi, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                            className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md text-center flex flex-col gap-1 hover:border-luxury-gold/30 hover:bg-zinc-900/60 transition-colors"
                          >
                            <span className="font-serif text-sm font-bold text-luxury-gold tracking-wide">{kpi.value}</span>
                            <span className="text-[9px] text-zinc-500 uppercase font-semibold leading-tight">{kpi.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900/80 pt-4">
                  <Button variant="secondary" className="flex-1 py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                    Close Portal
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit Campaign Project" : "Register Campaign Project"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Campaign Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={formErrors.title}
              placeholder="e.g. Summer Resort Wear '26"
              required
            />
            <Input 
              label="Brand Partner"
              value={formData.brandPartner || ''}
              onChange={(e) => handleInputChange('brandPartner', e.target.value)}
              error={formErrors.brandPartner}
              placeholder="e.g. Hermès Paris"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Campaign Timeline"
              value={formData.timeline || ''}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              placeholder="e.g. May 2026 - June 2026"
            />
            <Input 
              label="Campaign Widescreen Banner URL"
              value={formData.bannerUrl || ''}
              onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
              error={formErrors.bannerUrl}
              placeholder="https://unsplash.com/banner..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Budget Allocation"
              value={formData.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="e.g. $150,000"
            />
            <Input 
              label="Target Demographic"
              value={formData.targetAudience || ''}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              placeholder="e.g. HNW Individuals, Gen-Z Elite"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Performance Badge Metrics"
              value={formData.metrics || ''}
              onChange={(e) => handleInputChange('metrics', e.target.value)}
              placeholder="e.g. 5.4M Reach, 12K Clicks"
            />
            <Input 
              label="Campaign Core Outcome"
              value={formData.outcome || ''}
              onChange={(e) => handleInputChange('outcome', e.target.value)}
              placeholder="e.g. Sold out collection within 48 hrs"
            />
          </div>

          <Input 
            label="Campaign Narrative Overview"
            textarea
            rows={3}
            value={formData.detailedDescription || ''}
            onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
            placeholder="Outline campaign milestones, marketing channels, and strategic goals..."
          />

          {/* Dynamic KPI Configurator */}
          <div className="border-t border-zinc-900 pt-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Configure KPI Stats Grid</span>
            <div className="flex gap-3">
              <Input 
                label="KPI Value (e.g. 5.4M)"
                value={kpiValue}
                onChange={(e) => setKpiValue(e.target.value)}
              />
              <Input 
                label="KPI Label (e.g. Reach)"
                value={kpiLabel}
                onChange={(e) => setKpiLabel(e.target.value)}
              />
              <Button onClick={handleAddKpi} variant="secondary" className="h-fit mt-5">Add KPI</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {(formData.kpis || []).map((kpi, idx) => (
                <Badge key={idx} variant="gold" className="flex items-center gap-1">
                  <span>{kpi.value} {kpi.label}</span>
                  <button type="button" onClick={() => handleRemoveKpi(idx)} className="text-zinc-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Register Campaign"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Launch Add / Edit Form Dialog */}
      <Dialog
        isOpen={isLaunchFormOpen}
        onClose={() => setIsLaunchFormOpen(false)}
        title={launchEditing ? "Edit Product Launch" : "Register Product Launch"}
        size="md"
      >
        <form onSubmit={handleLaunchSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name" value={launchFormData.productName || ''} onChange={(e) => handleLaunchInputChange('productName', e.target.value)} required />
            <Input label="Event Title" value={launchFormData.launchEventTitle || ''} onChange={(e) => handleLaunchInputChange('launchEventTitle', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Video URL" value={launchFormData.videosList || ''} onChange={(e) => handleLaunchInputChange('videosList', e.target.value)} />
            <Input label="Brand Details" value={launchFormData.brandDetails || ''} onChange={(e) => handleLaunchInputChange('brandDetails', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Release Date" value={launchFormData.releaseDate || ''} onChange={(e) => handleLaunchInputChange('releaseDate', e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsLaunchFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{launchEditing ? 'Save Changes' : 'Register Launch'}</Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Launch Confirmation */}
      <ConfirmDialog isOpen={deleteLaunchId !== null} onClose={() => setDeleteLaunchId(null)} onConfirm={handleDeleteLaunchConfirm} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
