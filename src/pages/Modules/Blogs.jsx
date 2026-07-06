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
  FileText, Search, Plus, Edit2, Trash2, X, Eye, 
  ExternalLink, Calendar, User, Clock, Tag
} from 'lucide-react';

export const Blogs = ({ activeSubFeature }) => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const list = db.blogs || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals & Panels State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D blog showcase item

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
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.author || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'all' || 
      item.category === categoryFilter;

    // Filter by Sub-tab (Features list at top)
    let matchesSubTab = true;
    if (activeSubFeature === 'Drafts') {
      matchesSubTab = item.status === 'draft';
    } else if (activeSubFeature === 'Published') {
      matchesSubTab = item.status === 'published';
    }

    return matchesSearch && matchesCategory && matchesSubTab;
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
        category: 'Branding',
        author: 'Akanksha Dua',
        readTime: '5 min read',
        publishDate: new Date().toISOString().split('T')[0],
        coverImage: '',
        content: '',
        status: 'published',
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
    if (!formData.title?.trim()) {
      setFormErrors({
        title: 'Article title is required.'
      });
      return;
    }

    const payload = {
      ...formData,
      coverImage: formData.coverImage?.trim() || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800"
    };

    if (editingItem) {
      updateItem('blogs', editingItem.id, payload);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...payload }));
      }
    } else {
      addItem('blogs', payload);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem('blogs', deleteId);
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
            <FileText className="w-5 h-5 text-luxury-gold" />
            Blog Insight Manager
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} articles. Hover to tilt. Click to read, edit, or publish luxury press articles.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Add Blog</span>
        </Button>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search blog titles, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="w-48">
          <Select
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Lifestyle', label: 'Lifestyle' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Branding', label: 'Branding' },
              { value: 'Creator Journey', label: 'Creator Journey' },
              { value: 'Tips', label: 'Tips' },
              { value: 'Latest News', label: 'Latest News' }
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 glass-panel border border-zinc-800/70 rounded-lg p-6 bg-zinc-950/10 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-zinc-500 italic">No blog posts found matching this category.</p>
            <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-1.5">
              <Plus className="w-4 h-4 text-black" />
              <span className="text-black font-semibold">Add Blog</span>
            </Button>
          </div>
        ) : (
          filteredList.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setShowcaseItem(item)}
              className="cursor-pointer"
            >
              <TiltCard 
                className="h-full border border-zinc-800/80 p-0 overflow-hidden flex flex-col justify-between group"
                maxTilt={8}
              >
                {/* Widescreen cover thumbnail */}
                <div className="h-48 overflow-hidden relative border-b border-zinc-800 bg-zinc-950">
                  <img 
                    src={item.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4 z-10">
                    <Badge variant="gold">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Details info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-luxury-gold font-mono tracking-wider uppercase block">{item.publishDate}</span>
                    <h3 className="font-serif text-sm font-bold text-zinc-200 tracking-wide leading-snug truncate-2-lines">{item.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 truncate-2-lines">
                      {item.content || "Exclusive thoughts and insights discussing high-end branding layouts."}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-5 border-t border-zinc-900/60 pt-3 flex-wrap gap-2">
                    <span className="text-[10px] text-zinc-500 font-semibold font-mono uppercase">
                      {item.readTime}
                    </span>

                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={(e) => openForm(e, item)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                        title="Edit Blog"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Blog"
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
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
                  src={showcaseItem.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800"} 
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
                    <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">INSIGHT ARTICLE</span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.category}</h3>
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
                  {/* Category & Date header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-mono uppercase">
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>{showcaseItem.publishDate}</span>
                    </div>
                    <Badge variant="gold">{showcaseItem.category}</Badge>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-zinc-100">{showcaseItem.title}</h2>
                    <div className="flex gap-4 text-[10px] text-zinc-500 uppercase font-semibold font-mono mt-2">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-luxury-gold" /> By {showcaseItem.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {showcaseItem.readTime}</span>
                    </div>
                  </div>

                  {/* Blog content */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Article Excerpt</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed max-h-[160px] overflow-y-auto p-3.5 border border-zinc-900 bg-zinc-950/40 rounded italic">
                      "{showcaseItem.content || "Branding methodologies co-designed for the modern luxury web framework spaces."}"
                    </p>
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900/80 pt-4 flex-wrap w-full">
                  <Button 
                    variant="primary" 
                    className="flex-grow py-2.5 text-xs text-black font-semibold gap-1.5" 
                    onClick={(e) => { 
                      setShowcaseItem(null); 
                      openForm(e, showcaseItem); 
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-black" />
                    <span className="text-black font-semibold">Edit Article</span>
                  </Button>
                  <Button 
                    variant="danger" 
                    className="py-2.5 text-xs gap-1.5" 
                    onClick={() => { 
                      setShowcaseItem(null); 
                      setDeleteId(showcaseItem.id); 
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                  <Button variant="secondary" className="py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                    Close
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
        title={editingItem ? "Edit Blog Article" : "Compose Blog Article"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Article Title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={formErrors.title}
              placeholder="e.g. The Art of Golden Ratios"
              required
            />
            <Input 
              label="Author Name"
              value={formData.author || 'Akanksha Dua'}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="e.g. Akanksha Dua"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Article Category"
              options={[
                { value: 'Lifestyle', label: 'Lifestyle' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Branding', label: 'Branding' },
                { value: 'Creator Journey', label: 'Creator Journey' },
                { value: 'Tips', label: 'Tips' },
                { value: 'Latest News', label: 'Latest News' }
              ]}
              value={formData.category || 'Branding'}
              onChange={(e) => handleInputChange('category', e.target.value)}
            />
            <Select 
              label="Publication Status"
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' }
              ]}
              value={formData.status || 'published'}
              onChange={(e) => handleInputChange('status', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Publish Date"
              type="date"
              value={formData.publishDate || ''}
              onChange={(e) => handleInputChange('publishDate', e.target.value)}
            />
            <Input 
              label="Est. Read Time (e.g. 5 min read)"
              value={formData.readTime || ''}
              onChange={(e) => handleInputChange('readTime', e.target.value)}
              placeholder="e.g. 5 min read"
            />
          </div>

          <Input 
            label="Featured Cover Image URL"
            value={formData.coverImage || ''}
            onChange={(e) => handleInputChange('coverImage', e.target.value)}
            error={formErrors.coverImage}
            placeholder="https://unsplash.com/image..."
          />

          <Input 
            label="Article Narrative Content"
            textarea
            rows={5}
            value={formData.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Write blog paragraphs or article summaries here..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Publish Article"}
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
