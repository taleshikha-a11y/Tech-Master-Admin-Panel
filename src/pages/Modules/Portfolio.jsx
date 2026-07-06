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
  FolderHeart, Search, Plus, Edit2, Trash2, X, Eye, 
  Film, Image as ImageIcon, LayoutGrid, List, Calendar, 
  Target, Award, Users, HardDrive, ShieldCheck, MapPin, Tag
} from 'lucide-react';

export const Portfolio = ({ activeSubFeature }) => {
  const { db, addItem, updateItem, deleteItem, toggleStatus } = useDatabase();
  const portfolioList = db.portfolio || [];
  const galleryList = db.gallery || [];
  const activeFeature = (activeSubFeature || '').toLowerCase();
  const isGalleryMode = activeFeature.includes('gallery') || activeFeature.includes('album');
  const isPortfolioMode = !isGalleryMode;

  // Tabs State - New
  const [activeTab, setActiveTab] = useState('All');
  const tabs = isGalleryMode
    ? ['All', 'Images', 'Videos']
    : ['All', 'Photos', 'Videos', 'Campaigns', 'Projects', 'Client Work', 'Commercial Shoots'];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table, grid

  // Modals & Panels State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D portfolio showcase item

  // Form State
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // 3D image/ticket tilt states in modal
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

  const collectionName = isGalleryMode ? 'gallery' : 'portfolio';
  const list = isGalleryMode ? galleryList : portfolioList;

  // Filter list - Updated with Tab Logic
  const filteredList = list.filter(item => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      item.serviceType === categoryFilter ||
      item.category === categoryFilter;

    let matchesTab = true;
    if (activeTab === 'All') matchesTab = true;
    else if (activeTab === 'Photos') matchesTab = item.type !== 'video';
    else if (activeTab === 'Videos') matchesTab = item.type === 'video';
    else if (activeTab === 'Campaigns') matchesTab = item.portfolioType === 'Campaigns';
    else if (activeTab === 'Projects') matchesTab = item.portfolioType === 'Projects';
    else if (activeTab === 'Client Work') matchesTab = item.portfolioType === 'Client Work';
    else if (activeTab === 'Commercial Shoots') matchesTab = item.portfolioType === 'Commercial Shoots';

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Open Form
  const openForm = (e, item = null) => {
    e.stopPropagation(); // Avoid triggering details modal open
    setFormErrors({});
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      if (isGalleryMode) {
        setFormData({
          title: '',
          type: 'image',
          category: 'Campaigns',
          mediaUrl: '',
          description: '',
          dimensions: '3840x2160 (4K)',
          size: '4.5 MB',
          isActive: true
        });
      } else {
        setFormData({
          title: '',
          client: '',
          serviceType: 'Content Creation',
          imageUrl: '',
          videoUrl: '',
          completionDate: new Date().toISOString().split('T')[0],
          description: '',
          budget: '$15,000',
          reach: '500K Views',
          venue: 'Grand Hyatt, Mumbai',
          vipGuests: '12 VIP Editors',
          contractDeliverables: '3 cinematic reels, 1 main catalog',
          isActive: true,
          isFeatured: true
        });
      }
    }
    setIsFormOpen(true);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || (!(isGalleryMode ? formData.mediaUrl : formData.imageUrl || formData.videoUrl)?.trim())) {
      setFormErrors({
        title: !formData.title ? 'Title is required.' : '',
        client: isPortfolioMode && !formData.client ? 'Client brand is required.' : '',
        imageUrl: isPortfolioMode && !formData.imageUrl ? 'Cover photo URL is required.' : '',
        mediaUrl: isGalleryMode && !formData.mediaUrl ? 'Media URL is required.' : ''
      });
      return;
    }

    if (editingItem) {
      updateItem(collectionName, editingItem.id, formData);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...formData }));
      }
    } else {
      addItem(collectionName, formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem(collectionName, deleteId);
      if (showcaseItem?.id === deleteId) {
        setShowcaseItem(null);
      }
      setDeleteId(null);
    }
  };

  // Helper to categorize views
  const getCategoryTheme = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('shoot') || t.includes('content') || t.includes('promo')) {
      return 'production'; // Commercial Reels / Content Creation
    }
    if (t.includes('campaign') || t.includes('launch')) {
      return 'campaign'; // Brand Campaigns & Launches
    }
    if (t.includes('host') || t.includes('event') || t.includes('stage')) {
      return 'event'; // VIP Hostings & Stages
    }
    return 'corporate'; // Corporate Collaborations B2B
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-luxury-gold" />
            {isGalleryMode ? 'Album Manager' : 'Portfolio Manager'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} {isGalleryMode ? 'album assets' : 'portfolio records'}. Click rows or View icons to preview item details.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Add New Entry</span>
        </Button>
      </div>

      {/* Tabs Navigation - New */}
      <div className="flex gap-6 border-b border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab 
              ? 'text-luxury-gold border-b-2 border-luxury-gold' 
              : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, client, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select
              options={isGalleryMode ? [
                { value: 'all', label: 'All Formats' },
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Videos' }
              ] : [
                { value: 'all', label: 'All Categories' },
                { value: 'Commercial Shoots', label: 'Commercial Shoots' },
                { value: 'Content Creation', label: 'Content Creation' },
                { value: 'Brand Campaigns', label: 'Brand Campaigns' },
                { value: 'Product Launches', label: 'Product Launches' },
                { value: 'Event Hosting', label: 'Event Hosting' },
                { value: 'Corporate Collaborations', label: 'Corporate Collaborations' }
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>

          {/* View Toggler */}
          <div className="flex bg-zinc-950 border border-zinc-800 rounded-md p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-zinc-800 text-luxury-gold' : ''}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-zinc-800 text-luxury-gold' : ''}`}
              title="3D Card Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main List */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel border border-zinc-800/80 rounded-lg overflow-hidden"
          >
            {filteredList.length === 0 ? (
              <p className="text-sm text-zinc-500 italic p-8 text-center">No portfolio items registered.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      <th className="px-6 py-4">Cover Image</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">{isGalleryMode ? 'Category' : 'Client Brand'}</th>
                      <th className="px-6 py-4">{isGalleryMode ? 'Format' : 'Service Category'}</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {filteredList.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setShowcaseItem(item)}
                        className="hover:bg-luxury-gold/[0.02] border-transparent hover:border-luxury-gold/10 transition-all duration-300 cursor-pointer"
                      >
                        <td className="px-6 py-3.5">
                          <img 
                            src={item.type === 'video'
                              ? item.mediaUrl || item.videoUrl || item.imageUrl
                              : item.imageUrl || item.mediaUrl || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=120"}
                            className="w-11 h-11 object-cover rounded border border-zinc-800 shadow-sm"
                            alt={item.title || 'Portfolio asset'}
                          />
                        </td>
                        <td className="px-6 py-3.5 font-semibold text-zinc-200">{item.title}</td>
                        <td className="px-6 py-3.5 text-zinc-300">{isGalleryMode ? item.category || 'Asset' : item.client}</td>
                        <td className="px-6 py-3.5">
                          <Badge variant="gold" className="text-[10px] py-0.5 px-2">
                            {isGalleryMode ? item.type : item.serviceType}
                          </Badge>
                        </td>
                        <td className="px-6 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleStatus(collectionName, item.id)}
                            className="cursor-pointer"
                          >
                            <Badge variant={item.isActive ? 'gold' : 'default'}>
                              {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2 items-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowcaseItem(item); }}
                              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => openForm(e, item)}
                              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          /* Grid View with Stagger and 3D Cards */
          <motion.div
            key="grid-view"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredList.map((item) => {
              const isVideoItem = item.type === 'video' || !!item.videoUrl;
              const assetUrl = isVideoItem
                ? item.mediaUrl || item.videoUrl || item.imageUrl
                : item.imageUrl || item.mediaUrl;
              const assetBadge = item.serviceType || item.category || (item.type ? item.type.toUpperCase() : 'Asset');
              return (
                <motion.div
                  key={item.id}
                  onClick={() => setShowcaseItem(item)}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                  }}
                  className="cursor-pointer"
                >
                  <TiltCard 
                    className="h-full border border-zinc-800/80 p-0 overflow-hidden flex flex-col justify-between group bg-zinc-950/10"
                    maxTilt={8}
                  >
                    <div className="h-48 overflow-hidden relative border-b border-zinc-800 bg-black flex items-center justify-center">
                      {isVideoItem ? (
                        <video 
                          src={assetUrl} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                        />
                      ) : (
                        <img 
                          src={assetUrl || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600"} 
                          alt={item.title || 'Portfolio asset'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" 
                        />
                      )}

                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="gold">{assetBadge}</Badge>
                      </div>

                      <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-black/60 border border-zinc-850 backdrop-blur flex items-center justify-center">
                        {isVideoItem ? <Film className="w-3.5 h-3.5 text-luxury-gold" /> : <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/45 to-transparent flex items-end p-4 z-10">
                        <h3 className="font-serif text-sm font-bold text-zinc-100 tracking-wide truncate group-hover:text-luxury-gold transition-colors">{item.title}</h3>
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between border-t border-zinc-900/60 flex-wrap gap-2">
                      <span className="text-[10px] text-zinc-500 font-semibold font-mono uppercase">
                        {isGalleryMode ? `Category: ${item.category || item.type}` : `Client: ${item.client}`}
                      </span>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowcaseItem(item); }}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => openForm(e, item)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </AnimatePresence>

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

            {/* Dynamic Portal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl glass-panel border border-zinc-800 rounded-lg overflow-hidden z-50 flex flex-col md:flex-row text-left shadow-gold-glow-lg"
              style={{ perspective: 1200 }}
            >
              <button
                onClick={() => setShowcaseItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900/60 text-zinc-500 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* SERVICE CATEGORY THEMED PAGES */}
              {(() => {
                const showcaseMediaUrl = showcaseItem.mediaUrl || showcaseItem.videoUrl || showcaseItem.imageUrl;
                const showcaseIsVideo = showcaseItem.type === 'video' || !!showcaseItem.videoUrl;
                const showcaseClient = showcaseItem.client || showcaseItem.category || 'Selected Asset';
                const showcaseTypeLabel = showcaseItem.serviceType || showcaseItem.category || showcaseItem.type || 'Production';
                const theme = getCategoryTheme(showcaseItem.serviceType || showcaseItem.type || showcaseItem.category);

                // --- 1. THEME: CONTENT CREATION / SHOOTS ---
                if (theme === 'production') {
                  return (
                    <>
                      {/* Left: 3D Video/Image Slant Canvas */}
                      <motion.div 
                        onMouseMove={handleImageMouseMove}
                        onMouseEnter={() => setImgHovered(true)}
                        onMouseLeave={handleImageMouseLeave}
                        className="w-full md:w-1/2 h-[350px] md:h-auto overflow-hidden relative group cursor-crosshair select-none bg-black flex items-center justify-center"
                        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                      >
                        {showcaseItem.videoUrl ? (
                          <motion.video 
                            src={showcaseItem.videoUrl} 
                            autoPlay 
                            loop 
                            controls
                            muted
                            animate={{
                              rotateX: imgTilt.x,
                              rotateY: imgTilt.y,
                              scale: imgHovered ? 1.03 : 1.01
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <motion.img 
                            src={showcaseItem.imageUrl || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"} 
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
                          <div className="w-10 h-10 rounded-full bg-black/60 border border-luxury-gold/30 backdrop-blur flex items-center justify-center font-serif font-black text-luxury-gold" style={{ transform: 'translateZ(30px)' }}>AD</div>
                          <div 
                            className="bg-black/65 border border-luxury-gold/20 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 w-full max-w-[280px]"
                            style={{ transform: 'translateZ(60px)' }}
                          >
                            <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">PRODUCTION CATEGORY</span>
                            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.client}</h3>
                          </div>
                        </div>
                      </motion.div>

                      {/* Right: Shoot Details Panel */}
                      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                        <div className="flex flex-col gap-6 mt-4 md:mt-0">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                              <Calendar className="w-4 h-4 text-luxury-gold" />
                              <span>{showcaseItem.completionDate}</span>
                            </div>
                            <Badge variant="gold">Creative Shoot</Badge>
                          </div>

                          <div>
                            <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase">FILM & PHOTO PORTFOLIO</span>
                            <h2 className="font-serif text-xl font-bold text-zinc-100 mt-1 leading-snug">{showcaseItem.title}</h2>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Production Summary</h4>
                            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/30 p-3 border border-zinc-900 rounded italic">
                              "{showcaseItem.description || "Storyboarding, direction, and asset finalization. Custom styling codes applied for high-net-worth consumers."}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <Film className="w-4 h-4 text-zinc-400" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Camera Specs</span>
                                <span className="font-bold text-zinc-200 text-[10px]">Arri Alexa / 35mm</span>
                              </div>
                            </div>
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <HardDrive className="w-4 h-4 text-zinc-400" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Est. Deliverable</span>
                                <span className="font-bold text-zinc-200 text-[10px] truncate max-w-[120px]">{showcaseItem.contractDeliverables || "Reels & Catalogs"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-8 border-t border-zinc-900 pt-4">
                          <Button variant="secondary" className="w-full py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                            Close Showcase
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                }

                // --- 2. THEME: CAMPAIGNS / PRODUCT LAUNCHES ---
                if (theme === 'campaign') {
                  return (
                    <>
                      {/* Left: 3D Marketing Billboard */}
                      <motion.div 
                        onMouseMove={handleImageMouseMove}
                        onMouseEnter={() => setImgHovered(true)}
                        onMouseLeave={handleImageMouseLeave}
                        className="w-full md:w-1/2 h-[350px] md:h-auto overflow-hidden relative group cursor-crosshair select-none bg-black flex items-center justify-center"
                        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                      >
                        <motion.img 
                          src={showcaseItem.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"} 
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

                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 flex flex-col justify-between p-6 pointer-events-none z-10"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div className="w-10 h-10 rounded-full bg-black/60 border border-luxury-gold/30 backdrop-blur flex items-center justify-center font-serif font-black text-luxury-gold" style={{ transform: 'translateZ(30px)' }}>AD</div>
                          <div 
                            className="bg-black/70 border border-luxury-gold/25 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 w-full max-w-[280px]"
                            style={{ transform: 'translateZ(60px)' }}
                          >
                            <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">CAMPAIGN HIGHLIGHT</span>
                            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.reach || "800K CTR Reach"}</h3>
                          </div>
                        </div>
                      </motion.div>

                      {/* Right: Campaign KPIs Panel */}
                      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                        <div className="flex flex-col gap-6 mt-4 md:mt-0">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                              <Calendar className="w-4 h-4 text-luxury-gold" />
                              <span>{showcaseItem.completionDate}</span>
                            </div>
                            <Badge variant="gold">Campaign Launch</Badge>
                          </div>

                          <div>
                            <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase">PARTNER BRAND LAUNCH</span>
                            <h2 className="font-serif text-xl font-bold text-zinc-100 mt-1 leading-snug">{showcaseItem.title}</h2>
                            <p className="text-xs text-zinc-400 mt-1.5 font-semibold">Brand Partner: {showcaseItem.client}</p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Campaign Narrative</h4>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              {showcaseItem.description || "Deploying visual strategy across media houses and digital configurators to engage target consumers."}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <Target className="w-4 h-4 text-luxury-gold" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Verified Reach</span>
                                <span className="font-bold text-zinc-200 text-[10px]">{showcaseItem.reach || "1.5M reach"}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <Award className="w-4 h-4 text-luxury-gold" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Budget Tier</span>
                                <span className="font-bold text-zinc-200 text-[10px]">{showcaseItem.budget || "$25,000"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-8 border-t border-zinc-900 pt-4">
                          <Button variant="secondary" className="w-full py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                            Close Case
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                }

                // --- 3. THEME: VIP EVENTS / HOSTINGS ---
                if (theme === 'event') {
                  return (
                    <>
                      {/* Left: 3D gilded VIP event ticket mockup */}
                      <motion.div 
                        onMouseMove={handleImageMouseMove}
                        onMouseEnter={() => setImgHovered(true)}
                        onMouseLeave={handleImageMouseLeave}
                        className="w-full md:w-1/2 min-h-[400px] md:min-h-auto p-8 overflow-hidden relative group cursor-crosshair select-none flex items-center justify-center bg-zinc-950/90"
                        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                      >
                        {/* gold ticket */}
                        <motion.div 
                          animate={{
                            rotateX: imgTilt.x,
                            rotateY: imgTilt.y,
                            scale: imgHovered ? 1.04 : 1.0
                          }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          style={{ transformStyle: 'preserve-3d' }}
                          className="w-full max-w-[310px] aspect-[1/1.58] bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-luxury-gold/30 p-6 flex flex-col justify-between text-left relative overflow-hidden shadow-2xl rounded-lg"
                        >
                          {/* gold radial flare in backdrop */}
                          <div className="absolute top-0 right-0 w-36 h-36 bg-luxury-gold/5 rounded-full filter blur-xl pointer-events-none" />

                          {/* Watermarked AD logo */}
                          <div className="absolute -bottom-8 -right-8 text-8xl font-black font-serif text-white/[0.02] pointer-events-none select-none">AD</div>

                          <div className="flex flex-col gap-4 relative z-10">
                            <div className="border-b border-zinc-800 pb-3">
                              <span className="text-[8px] text-luxury-gold font-mono tracking-[0.25em] uppercase block">VIP ENTRY PASS</span>
                              <h4 className="font-serif text-sm font-bold text-zinc-100 uppercase tracking-wide mt-1 line-clamp-2 leading-snug">{showcaseItem.title}</h4>
                            </div>

                            <div className="flex flex-col gap-3 text-[9px] text-zinc-400">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Location coordinates</span>
                                <span className="text-zinc-300 font-semibold flex items-center gap-1"><MapPin className="w-3 h-3 text-luxury-gold" /> {showcaseItem.venue || "Luxury Studio, Mumbai"}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[7.5px] font-bold text-stone-500 uppercase tracking-wider font-mono">Hosting Stage Role</span>
                                <span className="text-zinc-300 font-semibold uppercase">{showcaseItem.serviceType}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[7.5px] font-bold text-stone-500 uppercase tracking-wider font-mono">VIP GUEST SEGMENT</span>
                                <span className="text-luxury-gold font-semibold font-mono">{showcaseItem.vipGuests || "50 HNW Editors"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-[7.5px] text-zinc-500 font-mono relative z-10">
                            <span>AKANKSHA DUA GALA</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Right: Event Details Panel */}
                      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                        <div className="flex flex-col gap-6 mt-4 md:mt-0">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                              <Calendar className="w-4 h-4 text-luxury-gold" />
                              <span>{showcaseItem.completionDate}</span>
                            </div>
                            <Badge variant="gold">Event Showcase</Badge>
                          </div>

                          <div>
                            <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase">STAGE HOSTING & MANAGEMENT</span>
                            <h2 className="font-serif text-xl font-bold text-zinc-100 mt-1 leading-snug">{showcaseItem.title}</h2>
                            <p className="text-xs text-zinc-500 mt-1 font-semibold uppercase font-mono">Client Organization: {showcaseItem.client}</p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Event highlights</h4>
                            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/30 p-3.5 border border-zinc-900 rounded italic">
                              "{showcaseItem.description || "Delivering VIP opening speeches, hosting panels, and managing co-branded brand experience suites."}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <Users className="w-4 h-4 text-luxury-gold" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Audience Scope</span>
                                <span className="font-bold text-zinc-200 text-[10px]">{showcaseItem.vipGuests || "500 Attendees"}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                              <MapPin className="w-4 h-4 text-luxury-gold" />
                              <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-500 uppercase font-semibold font-mono">Venue Coordinates</span>
                                <span className="font-bold text-zinc-200 text-[10px] truncate max-w-[120px]">{showcaseItem.venue || "Taj, Mumbai"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-8 border-t border-zinc-900 pt-4">
                          <Button variant="secondary" className="w-full py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                            Close Event Panel
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                }

                // --- 4. THEME: CORPORATE COLLABORATIONS B2B ---
                return (
                  <>
                    {/* Left: co-branded partnership grid */}
                    <motion.div 
                      onMouseMove={handleImageMouseMove}
                      onMouseEnter={() => setImgHovered(true)}
                      onMouseLeave={handleImageMouseLeave}
                      className="w-full md:w-1/2 h-[350px] md:h-auto overflow-hidden relative group cursor-crosshair select-none bg-black flex items-center justify-center"
                      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                    >
                      <motion.img 
                        src={showcaseItem.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"} 
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

                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 flex flex-col justify-between p-6 pointer-events-none z-10"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className="w-10 h-10 rounded-full bg-black/60 border border-luxury-gold/30 backdrop-blur flex items-center justify-center font-serif font-black text-luxury-gold" style={{ transform: 'translateZ(30px)' }}>AD</div>
                        <div 
                          className="bg-black/65 border border-luxury-gold/20 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 w-full max-w-[280px]"
                          style={{ transform: 'translateZ(60px)' }}
                        >
                          <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">CORPORATE ALLIANCE</span>
                          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.client}</h3>
                        </div>
                      </div>
                    </motion.div>

                    {/* Right: B2B Details Panel */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                      <div className="flex flex-col gap-6 mt-4 md:mt-0">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                            <Calendar className="w-4 h-4 text-luxury-gold" />
                            <span>{showcaseItem.completionDate}</span>
                          </div>
                          <Badge variant="gold">B2B Alliance</Badge>
                        </div>

                        <div>
                          <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase">CORPORATE PARTNERSHIP</span>
                          <h2 className="font-serif text-xl font-bold text-zinc-100 mt-1 leading-snug">{showcaseItem.title}</h2>
                          <p className="text-xs text-zinc-400 mt-1">Alliance Partner: {showcaseItem.client}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Partnership Scope</h4>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {showcaseItem.description || "Strategic collaboration co-created to deliver visual marketing configurations, B2B consulting, and luxury positioning."}
                          </p>
                        </div>

                        <div className="p-3.5 bg-zinc-900/30 border border-zinc-900 rounded-md flex flex-col gap-2">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Contract Deliverables</span>
                          <p className="text-xs text-zinc-300 font-medium font-mono truncate">{showcaseItem.contractDeliverables || "Branding assets, strategy decks, and key consultation sessions."}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8 border-t border-zinc-900 pt-4">
                        <Button variant="secondary" className="w-full py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                          Close Alliance File
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit Portfolio Project" : "Register Portfolio Project"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Project Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={formErrors.title}
              placeholder="e.g. Noir Fashion Film"
              required
            />
            <Input 
              label="Client Brand"
              value={formData.client || ''}
              onChange={(e) => handleInputChange('client', e.target.value)}
              error={formErrors.client}
              placeholder="e.g. Vogue India"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Service Category"
              options={[
                { value: 'Commercial Shoots', label: 'Commercial Shoots' },
                { value: 'Content Creation', label: 'Content Creation' },
                { value: 'Brand Campaigns', label: 'Brand Campaigns' },
                { value: 'Product Launches', label: 'Product Launches' },
                { value: 'Event Hosting', label: 'Event Hosting' },
                { value: 'Corporate Collaborations', label: 'Corporate Collaborations' },
                { value: 'Album', label: 'Album' }
              ]}
              value={formData.serviceType || 'Content Creation'}
              onChange={(e) => handleInputChange('serviceType', e.target.value)}
            />
            <Input 
              label="Completion Date"
              type="date"
              value={formData.completionDate || ''}
              onChange={(e) => handleInputChange('completionDate', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Cover Photo URL"
              value={formData.imageUrl || ''}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              error={formErrors.imageUrl}
              placeholder="https://images.unsplash.com/..."
              required
            />
            <Input 
              label="Video Showcase URL (Optional)"
              value={formData.videoUrl || ''}
              onChange={(e) => handleInputChange('videoUrl', e.target.value)}
              placeholder="https://assets.mixkit.co/videos/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-3">
            <Input 
              label="Campaign Budget / Stage Fee"
              value={formData.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="e.g. $15,000"
            />
            <Input 
              label="Verified Reach / CTR metrics"
              value={formData.reach || ''}
              onChange={(e) => handleInputChange('reach', e.target.value)}
              placeholder="e.g. 500K Views"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Event Venue / Stage coordinates"
              value={formData.venue || ''}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              placeholder="e.g. Grand Hyatt, Mumbai"
            />
            <Input 
              label="VIP Guest Roster Size"
              value={formData.vipGuests || ''}
              onChange={(e) => handleInputChange('vipGuests', e.target.value)}
              placeholder="e.g. 12 VIP Editors"
            />
          </div>

          <Input 
            label="Contract Deliverables summary"
            value={formData.contractDeliverables || ''}
            onChange={(e) => handleInputChange('contractDeliverables', e.target.value)}
            placeholder="e.g. 3 Reels, 1 catalog shoot"
          />

          <Input 
            label="Project Description Overview"
            textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe storyboard, visual codes, and customer reach results..."
          />

          <div className="flex items-center gap-4">
            <label className="text-sm text-zinc-400">Featured Project?</label>
            <Switch 
              checked={formData.isFeatured || false}
              onChange={(val) => handleInputChange('isFeatured', val)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Register Project"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};