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
  Award, Search, Plus, Edit2, Trash2, X, Star, 
  MessageSquare, User, Building, Quote
} from 'lucide-react';

export const Testimonials = () => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const list = db.testimonials || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Modals & Panels State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showcaseItem, setShowcaseItem] = useState(null); // Active 3D testimonial showcase item

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
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = 
      ratingFilter === 'all' || 
      String(item.rating) === ratingFilter;

    return matchesSearch && matchesRating;
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
        name: '',
        company: '',
        role: '',
        quote: '',
        rating: 5,
        avatarUrl: '',
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
    if (!formData.name.trim() || !formData.company.trim() || !formData.quote.trim()) {
      setFormErrors({
        name: !formData.name ? 'Client name is required.' : '',
        company: !formData.company ? 'Company name is required.' : '',
        quote: !formData.quote ? 'Quote text is required.' : ''
      });
      return;
    }

    if (editingItem) {
      updateItem('testimonials', editingItem.id, formData);
      if (showcaseItem?.id === editingItem.id) {
        setShowcaseItem(prev => ({ ...prev, ...formData }));
      }
    } else {
      addItem('testimonials', formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem('testimonials', deleteId);
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
            <Award className="w-5 h-5 text-luxury-gold" />
            Client Reviews & Testimonials
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} testimonials. Hover to tilt. Click any review card to open the interactive details portal.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={(e) => openForm(e, null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Add Testimonial</span>
        </Button>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search clients, company names, or quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { value: 'all', label: 'All Ratings' },
              { value: '5', label: '5 Stars' },
              { value: '4', label: '4 Stars' }
            ]}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.length === 0 ? (
          <p className="text-sm text-zinc-500 italic p-6">No testimonials registered.</p>
        ) : (
          filteredList.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setShowcaseItem(item)}
              layoutId={`test-card-${item.id}`}
              className="cursor-pointer"
            >
              <TiltCard 
                className="h-full border border-zinc-800/80 p-5 flex flex-col justify-between group relative overflow-hidden"
                maxTilt={10}
              >
                {/* Gold Quote Icon in background */}
                <Quote className="w-16 h-16 text-luxury-gold/[0.04] absolute -top-2 -left-2 pointer-events-none" />

                <div className="flex flex-col gap-4 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < (item.rating || 5) ? 'text-luxury-gold fill-luxury-gold' : 'text-zinc-700'}`} 
                      />
                    ))}
                  </div>

                  {/* Quote excerpt */}
                  <p className="text-xs text-zinc-300 leading-relaxed italic truncate-4-lines">
                    "{item.quote}"
                  </p>
                </div>

                {/* User card info */}
                <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-6 flex-wrap gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                      className="w-8 h-8 rounded-full border border-zinc-800 object-cover" 
                      alt="" 
                    />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-zinc-200 block">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">{item.role || 'Partner'}, {item.company}</span>
                    </div>
                  </div>

                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => openForm(e, item)}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
              layoutId={`test-card-${showcaseItem.id}`}
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
                className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden relative group border-b md:border-b-0 md:border-r border-zinc-800/80 cursor-crosshair select-none flex items-center justify-center bg-zinc-950"
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              >
                <motion.img 
                  src={showcaseItem.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"} 
                  alt="" 
                  animate={{
                    rotateX: imgTilt.x,
                    rotateY: imgTilt.y,
                    scale: imgHovered ? 1.06 : 1.01
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-48 h-48 rounded-full border border-luxury-gold/20 object-cover shadow-gold-glow-lg" 
                />

                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 flex flex-col justify-between p-6 pointer-events-none z-10"
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
                    <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">VERIFIED CLIENT PARTNER</span>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider truncate">{showcaseItem.company}</h3>
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
                  {/* Rating Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-wrap gap-2 mt-4 md:mt-0">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < (showcaseItem.rating || 5) ? 'text-luxury-gold fill-luxury-gold' : 'text-zinc-700'}`} 
                        />
                      ))}
                    </div>
                    <Badge variant="gold">Partner Endorsement</Badge>
                  </div>

                  {/* Name details */}
                  <div>
                    <h2 className="font-serif text-lg font-bold text-zinc-100">{showcaseItem.name}</h2>
                    <p className="text-xs text-zinc-500 mt-1 uppercase font-semibold font-mono">{showcaseItem.role || 'Executive'}, {showcaseItem.company}</p>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="flex flex-col gap-1.5 relative">
                    <Quote className="w-10 h-10 text-luxury-gold/[0.04] absolute -top-4 -left-4" />
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono relative z-10">Client Testimonial</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/40 p-4 border border-zinc-900 rounded italic relative z-10">
                      "{showcaseItem.quote}"
                    </p>
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900/80 pt-4 flex-wrap">
                  <Button variant="secondary" className="flex-1 py-2.5 text-xs" onClick={() => setShowcaseItem(null)}>
                    Close Review
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
        title={editingItem ? "Edit Testimonial Quote" : "Add Testimonial Quote"}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Client Partner Name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={formErrors.name}
              placeholder="e.g. Sabrina D'Souza"
              required
            />
            <Input 
              label="Company / Brand"
              value={formData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              error={formErrors.company}
              placeholder="e.g. Hermès Paris"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Client Role / Designation"
              value={formData.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
              placeholder="e.g. Creative Lead"
            />
            <Select 
              label="Star Rating"
              options={[
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' }
              ]}
              value={formData.rating || 5}
              onChange={(e) => handleInputChange('rating', Number(e.target.value))}
            />
          </div>

          <Input 
            label="Client Profile Picture URL"
            value={formData.avatarUrl || ''}
            onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
            placeholder="https://unsplash.com/face..."
          />

          <Input 
            label="Testimonial Quote Text"
            textarea
            rows={4}
            value={formData.quote || ''}
            onChange={(e) => handleInputChange('quote', e.target.value)}
            placeholder="Input client endorsement quote text here..."
            required
            error={formErrors.quote}
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingItem ? "Save Changes" : "Register Testimonial"}
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
