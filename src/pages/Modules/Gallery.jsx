import React, { useState, useRef } from 'react';
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
  Image as ImageIcon, Video, Search, Plus, Edit2, Trash2, X, 
  Eye, Copy, Check, Download, Calendar, Tag, HardDrive, Expand
} from 'lucide-react';

export const Gallery = () => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const list = db.gallery || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals & Panels State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D media showcase item

  // Form State
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);

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

  // Copy Link helper
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter list
  const filteredList = list.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      typeFilter === 'all' || 
      item.type === typeFilter;

    return matchesSearch && matchesType;
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
    }
    setIsFormOpen(true);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      setFormErrors({
        title: !formData.title ? 'Asset title is required.' : '',
        mediaUrl: !formData.mediaUrl ? 'Asset Media URL is required.' : ''
      });
      return;
    }

    if (editingItem) {
      updateItem('gallery', editingItem.id, formData);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...formData }));
      }
    } else {
      addItem('gallery', formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem('gallery', deleteId);
      if (showcaseItem?.id === deleteId) {
        setShowcaseItem(null);
      }
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-luxury-gold" />
            Media Assets Gallery
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} assets. Hover cards to tilt in 3D. Click any asset to preview media loops and download assets.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Register Asset</span>
        </Button>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search media by title, tag, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { value: 'all', label: 'All Formats' },
              { value: 'image', label: 'Images' },
              { value: 'video', label: 'Videos' }
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredList.length === 0 ? (
          <p className="text-sm text-zinc-500 italic p-6">No gallery assets registered.</p>
        ) : (
          filteredList.map((item) => (
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
                {/* Widescreen Preview panel */}
                <div className="h-52 overflow-hidden relative border-b border-zinc-800 bg-black flex items-center justify-center">
                  {item.type === 'video' ? (
                    <video 
                      src={item.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-amalfi-coast-rocks-42521-large.mp4"} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
                    />
                  ) : (
                    <img 
                      src={item.mediaUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600"} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" 
                    />
                  )}

                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="gold">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-black/60 border border-zinc-850 backdrop-blur flex items-center justify-center">
                    {item.type === 'video' ? <Video className="w-3.5 h-3.5 text-luxury-gold" /> : <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4 z-10">
                    <h3 className="font-serif text-sm font-bold text-zinc-100 tracking-wide truncate group-hover:text-luxury-gold transition-colors">{item.title}</h3>
                  </div>
                </div>

                {/* Details bar */}
                <div className="p-4 flex items-center justify-between border-t border-zinc-900/60 flex-wrap gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold font-mono uppercase">
                    {item.dimensions || "4K resolution"}
                  </span>

                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => openForm(e, item)}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                      title="Edit Asset"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))
        )}
      </motion.div>

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

            {/* Showcase details container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl glass-panel border border-zinc-800 rounded-lg overflow-hidden z-50 flex flex-col md:flex-row text-left shadow-gold-glow-lg"
              style={{ perspective: 1200 }}
            >
              {/* Left animated media preview panel with 3D slant */}
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={handleImageMouseLeave}
                className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden relative group border-b md:border-b-0 md:border-r border-zinc-800/80 cursor-crosshair select-none flex items-center justify-center bg-black"
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              >
                {showcaseItem.type === 'video' ? (
                  <motion.video 
                    src={showcaseItem.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-amalfi-coast-rocks-42521-large.mp4"} 
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
                    src={showcaseItem.mediaUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"} 
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

                  {/* 3D Parallax floating card */}
                  <div 
                    className="bg-black/65 border border-luxury-gold/20 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 w-full max-w-[280px]"
                    style={{ transform: 'translateZ(60px)' }}
                  >
                    <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">MEDIA DIMENSIONS</span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.dimensions || "4K UHD Format"}</h3>
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

                <div className="flex flex-col gap-5">
                  {/* Category & Date header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>{new Date(showcaseItem.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="gold">{showcaseItem.category}</Badge>
                  </div>

                  {/* Title & Format */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-zinc-100">{showcaseItem.title}</h2>
                    <p className="text-xs text-luxury-gold font-mono uppercase tracking-wider mt-1.5 font-semibold">
                      {showcaseItem.type === 'video' ? 'Luxury Video Asset' : 'Fine Art Image Asset'}
                    </p>
                  </div>

                  {/* Excerpt details */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Description</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {showcaseItem.description || "Premium media asset co-designed to display high-fashion marketing visual content across web configurations."}
                    </p>
                  </div>

                  {/* Metadata cards */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                      <HardDrive className="w-4 h-4 text-zinc-400" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-semibold">File Size</span>
                        <span className="font-bold text-zinc-200 font-mono text-[10px]">{showcaseItem.size || "4.5 MB"}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-2.5">
                      <Expand className="w-4 h-4 text-zinc-400" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-500 uppercase font-semibold">Aspect Ratio</span>
                        <span className="font-bold text-zinc-200 font-mono text-[10px]">{showcaseItem.type === 'video' ? '16:9 Landscape' : '3:2 Landscape'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900/80 pt-4 flex-wrap">
                  <Button 
                    variant="primary" 
                    className="flex-1 py-2.5 text-center gap-1.5 text-xs" 
                    onClick={() => handleCopyLink(showcaseItem.mediaUrl)}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                    <span>{copied ? "Link Copied" : "Copy Resource URL"}</span>
                  </Button>
                  <Button variant="secondary" className="flex-grow py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                    Back to Gallery
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
        title={editingItem ? "Edit Media Asset" : "Register Media Asset"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Asset Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={formErrors.title}
              placeholder="e.g. Red Carpet - Cannes Film Festival"
              required
            />
            <Select 
              label="Asset Format Type"
              options={[
                { value: 'image', label: 'Image' },
                { value: 'video', label: 'Video' }
              ]}
              value={formData.type || 'image'}
              onChange={(e) => handleInputChange('type', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Asset Category Tag"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="e.g. Travel, Behind the Scenes, Campaigns"
            />
            <Input 
              label="Visual Resolution / Dimensions"
              value={formData.dimensions || ''}
              onChange={(e) => handleInputChange('dimensions', e.target.value)}
              placeholder="e.g. 3840x2160 (4K)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Asset File Size (e.g. 4.5 MB)"
              value={formData.size || ''}
              onChange={(e) => handleInputChange('size', e.target.value)}
              placeholder="e.g. 4.5 MB"
            />
            <Input 
              label="Media URL (Image / Video Link)"
              value={formData.mediaUrl || ''}
              onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
              error={formErrors.mediaUrl}
              placeholder="https://unsplash.com/photo... or mixkit.co/video..."
              required
            />
          </div>

          <Input 
            label="Visual Asset Description Overview"
            textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the mood, color themes, shot angles, and co-branded details..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Register Asset"}
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
