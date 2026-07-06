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
  Newspaper, Search, Plus, Edit2, Trash2, X, Eye, 
  ExternalLink, Calendar, Award, Globe, Link2
} from 'lucide-react';

export const MediaCoverage = () => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const list = db.coverage || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');

  // Modals & Panels State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D press showcase item

  // Form State
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

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
      item.mediaOutlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.format || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFormat = 
      formatFilter === 'all' || 
      item.format === formatFilter;

    return matchesSearch && matchesFormat;
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
        mediaOutlet: '',
        format: 'Magazine Features',
        date: '',
        url: '',
        thumbnail: '',
        detailedExcerpt: '',
        metrics: '',
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
    if (!formData.title.trim() || !formData.mediaOutlet.trim() || !formData.thumbnail.trim()) {
      setFormErrors({
        title: !formData.title ? 'Article title is required.' : '',
        mediaOutlet: !formData.mediaOutlet ? 'Media outlet name is required.' : '',
        thumbnail: !formData.thumbnail ? 'Featured image URL is required.' : ''
      });
      return;
    }

    if (editingItem) {
      updateItem('coverage', editingItem.id, formData);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...formData }));
      }
    } else {
      addItem('coverage', formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem('coverage', deleteId);
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
            <Newspaper className="w-5 h-5 text-luxury-gold" />
            Media Press Coverage
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} articles. Click on any press card to open the interactive 3D showcase.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Register Article</span>
        </Button>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search headlines, journalists, or magazines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="w-48">
          <Select
            options={[
              { value: 'all', label: 'All Formats' },
              { value: 'Magazine Features', label: 'Magazine Features' },
              { value: 'Press Releases', label: 'Press Releases' },
              { value: 'Podcasts', label: 'Podcasts' }
            ]}
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Press Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.length === 0 ? (
          <p className="text-sm text-zinc-500 italic p-6">No coverage articles registered.</p>
        ) : (
          filteredList.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setShowcaseItem(item)}
              layoutId={`cov-card-${item.id}`}
              className="cursor-pointer"
            >
              <TiltCard 
                className="h-full border border-zinc-800/80 p-0 overflow-hidden flex flex-col justify-between group"
                maxTilt={8}
              >
                {/* Widescreen cover thumbnail */}
                <div className="h-48 overflow-hidden relative border-b border-zinc-800 bg-zinc-950">
                  <img 
                    src={item.thumbnail || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4 z-10">
                    <Badge variant="gold">
                      {item.format}
                    </Badge>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-luxury-gold font-mono tracking-wider uppercase block">{item.mediaOutlet}</span>
                    <h3 className="font-serif text-sm font-bold text-zinc-200 tracking-wide leading-snug truncate-2-lines">{item.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 truncate-2-lines">
                      {item.detailedExcerpt || "Exclusive interview and coverage feature showcasing executive creator strategies."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-5 border-t border-zinc-900/60 pt-3 flex-wrap gap-2">
                    <span className="text-[10px] text-zinc-500 font-semibold font-mono uppercase">
                      {item.date}
                    </span>

                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => openForm(e, item)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                        title="Edit Press"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Press"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))
        )}
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

            {/* Showcase details container */}
            <motion.div
              layoutId={`cov-card-${showcaseItem.id}`}
              className="relative w-full max-w-4xl glass-panel border border-zinc-800 rounded-lg overflow-hidden z-50 flex flex-col md:flex-row text-left shadow-gold-glow-lg"
              style={{ perspective: 1200 }}
            >
              {/* Left animated product image panel with 3D slant */}
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
                <motion.img 
                  src={showcaseItem.thumbnail || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800"} 
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
                    <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">EXCLUSIVE INTERVIEW</span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.mediaOutlet}</h3>
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
                  {/* Outlet & Date header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>{showcaseItem.date}</span>
                    </div>
                    <Badge variant="gold">{showcaseItem.format}</Badge>
                  </div>

                  {/* Title & Outlet */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-zinc-100">{showcaseItem.title}</h2>
                    <p className="text-xs text-luxury-gold font-mono uppercase tracking-wider mt-1.5 font-semibold">{showcaseItem.mediaOutlet} Coverage</p>
                  </div>

                  {/* detailedExcerpt details */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Article Excerpt</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {showcaseItem.detailedExcerpt || "In this coverage, the media outlet covers the latest campaigns, designer configuration portals, and VIP setups developed under the Akanksha Dua brand."}
                    </p>
                  </div>

                  {/* Readership statistics card */}
                  <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center gap-3">
                    <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded">
                      <Award className="w-4 h-4 text-luxury-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Verified Impact Reach</span>
                      <span className="text-xs font-bold text-zinc-200">{showcaseItem.metrics || "Premium Reader Segment"}</span>
                    </div>
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900/80 pt-4 flex-wrap">
                  {showcaseItem.url && (
                    <a href={showcaseItem.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="primary" className="w-full py-2.5 text-center gap-1.5 text-xs">
                        <span>Read Full Press</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black" />
                      </Button>
                    </a>
                  )}
                  <Button variant="secondary" className="flex-grow py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                    Back to Index
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
        title={editingItem ? "Edit Press Release" : "Register Press Release"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Article Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={formErrors.title}
              placeholder="e.g. Akanksha Dua Redefines the Luxury Creator Economy"
              required
            />
            <Input 
              label="Media Outlet"
              value={formData.mediaOutlet || ''}
              onChange={(e) => handleInputChange('mediaOutlet', e.target.value)}
              error={formErrors.mediaOutlet}
              placeholder="e.g. Forbes India"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Publication Format"
              options={[
                { value: 'Magazine Features', label: 'Magazine Features' },
                { value: 'Press Releases', label: 'Press Releases' },
                { value: 'Podcasts', label: 'Podcasts' }
              ]}
              value={formData.format || 'Magazine Features'}
              onChange={(e) => handleInputChange('format', e.target.value)}
            />
            <Input 
              label="Publication Date"
              type="date"
              value={formData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Featured Cover / Thumbnail URL"
              value={formData.thumbnail || ''}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
              error={formErrors.thumbnail}
              placeholder="https://unsplash.com/cover..."
              required
            />
            <Input 
              label="Verified Reader Metrics"
              value={formData.metrics || ''}
              onChange={(e) => handleInputChange('metrics', e.target.value)}
              placeholder="e.g. 850K Readership"
            />
          </div>

          <Input 
            label="Article Target Link URL"
            value={formData.url || ''}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://outlet.com/article"
          />

          <Input 
            label="Press Excerpt Overview"
            textarea
            rows={3}
            value={formData.detailedExcerpt || ''}
            onChange={(e) => handleInputChange('detailedExcerpt', e.target.value)}
            placeholder="Outline core themes, interview quotes, and published key points..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Register Press"}
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
