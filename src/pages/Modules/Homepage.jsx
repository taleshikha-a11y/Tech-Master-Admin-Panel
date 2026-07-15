import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Home, RefreshCw, Save, ChevronDown, UploadCloud, Edit3, Trash2, AlertCircle, Play, Users, MessageSquare, Plus, Activity, CheckCircle
} from 'lucide-react';

export const Homepage = () => {
  const [toast, setToast] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    hero: { tag: '', headline: '', paragraph: '', ctaPrimary: '', ctaSecondary: '' },
    biography: { name: '', text: '' },
    partnerLogos: [],
    values: [],
    educationPillars: { tagline: '', headline: '', paragraph: '', ctaText: '' },
    stats: [],
    studentShowcase: { tagline: '', headline: '' },
    youtubePromo: { tagline: '', title: '', description: '', url: '' },
    ourImpact: { tagline: '', headline: '' },
    community: { tagline: '', headline: '' },
    testimonials: { tagline: '', headline: '', reviews: [] },
    newsletter: { tagline: '', title: '', description: '' },
    seoFuture: { tagline: '', headline: '', subtitle: '' }
  });

  const [expandedCards, setExpandedCards] = useState({
    hero: true,
    biography: false,
    partnerLogos: false,
    values: false,
    educationPillars: false,
    stats: false,
    studentShowcase: false,
    youtubePromo: false,
    ourImpact: false,
    community: false,
    testimonials: false,
    newsletter: false,
    seoFuture: false
  });

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/homepage/sync`)
      .then(res => res.json())
      .then(json => {
        if(json.hero) {
          setData(prev => ({ ...prev, ...json }));
        } else if (json.data && json.data.hero) {
          setData(prev => ({ ...prev, ...json.data }));
        } else {
          setData(prev => ({ ...prev, ...json }));
        }
      })
      .catch(err => console.log("Could not load initial data", err));
  }, []);

  const handleChange = (section, field, value, index = null, subfield = null) => {
    setData(prev => {
      const next = { ...prev };
      if (index !== null) {
        if (subfield) {
          next[section][index][subfield] = value;
        } else {
          next[section][index] = value;
        }
      } else {
        next[section] = { ...next[section], [field]: value };
      }
      return next;
    });
  };

  const handleAddArrayItem = (section, emptyItem) => {
    setData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), emptyItem]
    }));
  };

  const handleRemoveArrayItem = (section, index) => {
    setData(prev => {
      const arr = [...prev[section]];
      arr.splice(index, 1);
      return { ...prev, [section]: arr };
    });
  };

  const handleAddVideo = () => {
    setData(prev => ({
      ...prev,
      studentShowcase: {
        ...prev.studentShowcase,
        videos: [...(prev.studentShowcase?.videos || []), { id: Date.now().toString(), title: 'New Video', url: '', type: 'long_video', category: 'General' }]
      }
    }));
  };

  const handleRemoveVideo = (index) => {
    setData(prev => {
      const arr = [...(prev.studentShowcase?.videos || [])];
      arr.splice(index, 1);
      return { ...prev, studentShowcase: { ...prev.studentShowcase, videos: arr } };
    });
  };

  const handleChangeVideo = (index, field, value) => {
    setData(prev => {
      const arr = [...(prev.studentShowcase?.videos || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, studentShowcase: { ...prev.studentShowcase, videos: arr } };
    });
  };

  const handleVideoUpload = async (file, index) => {
    try {
      setIsUploading(true);
      setToast({ message: "Uploading video... Please wait before saving.", type: "success" });
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if(json.success) {
        handleChangeVideo(index, 'url', json.url);
        setToast({ message: "Video uploaded successfully! You can now save.", type: "success" });
      } else {
        setToast({ message: json.message || "Upload failed", type: "error" });
      }
    } catch(err) {
      setToast({ message: "Upload failed: " + err.message, type: "error" });
    } finally {
      setIsUploading(false);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleThumbnailUpload = async (file, index) => {
    try {
      setIsUploading(true);
      setToast({ message: "Uploading thumbnail... Please wait.", type: "success" });
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const json = await res.json();
      if(json.success) {
        handleChangeVideo(index, 'thumbnail', json.url);
        setToast({ message: "Thumbnail uploaded successfully! You can now save.", type: "success" });
      } else {
        setToast({ message: json.message || "Upload failed", type: "error" });
      }
    } catch(err) {
      setToast({ message: "Upload failed: " + err.message, type: "error" });
    } finally {
      setIsUploading(false);
    }
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddReview = () => {
    const newReview = { name: 'New Student', role: 'Role', text: 'Amazing experience!', rating: 5 };
    setData(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: [...(prev.testimonials.reviews || []), newReview]
      }
    }));
  };

  const handleRemoveReview = (idx) => {
    setData(prev => {
      const arr = [...prev.testimonials.reviews];
      arr.splice(idx, 1);
      return { ...prev, testimonials: { ...prev.testimonials, reviews: arr } };
    });
  };

  const handleReviewChange = (idx, field, value) => {
    setData(prev => {
      const arr = [...prev.testimonials.reviews];
      arr[idx][field] = value;
      return { ...prev, testimonials: { ...prev.testimonials, reviews: arr } };
    });
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage/sync`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        showToast('Homepage synced to Visitor Website successfully.', 'success');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showToast(err.message || 'Failed to sync.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">Homepage Sync</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage all 12 visitor website's Home page sections.</p>
        </div>
        <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white flex items-center gap-2 font-bold px-6">
          <Save className="w-4 h-4" />
          {loading ? 'Syncing...' : 'Sync All to Visitor Site'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 1. HERO SECTION */}
        <Card title={
          <div onClick={() => toggleCard('hero')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Home className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">1. Hero Section Setup</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.hero && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline (e.g. ELEVATING THE NEXT...)" value={data.hero?.tag || ''} onChange={(e) => handleChange('hero', 'tag', e.target.value)} />
              <Input label="Headline" value={data.hero?.headline || ''} onChange={(e) => handleChange('hero', 'headline', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Paragraph</label>
                <textarea className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm min-h-[100px] focus:outline-none focus:border-gold/50"
                  value={data.hero?.paragraph || ''} onChange={(e) => handleChange('hero', 'paragraph', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Primary CTA Label" value={data.hero?.ctaPrimary || ''} onChange={(e) => handleChange('hero', 'ctaPrimary', e.target.value)} />
                <Input label="Secondary CTA Label" value={data.hero?.ctaSecondary || ''} onChange={(e) => handleChange('hero', 'ctaSecondary', e.target.value)} />
              </div>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 2. FOUNDER BIOGRAPHY */}
        <Card title={
          <div onClick={() => toggleCard('biography')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Edit3 className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">2. Founder Biography</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.biography && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Name" value={data.biography?.name || ''} onChange={(e) => handleChange('biography', 'name', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Biography Text</label>
                <textarea className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm min-h-[100px] focus:outline-none focus:border-gold/50"
                  value={data.biography?.text || ''} onChange={(e) => handleChange('biography', 'text', e.target.value)} />
              </div>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 3. PARTNER LOGOS */}
        <Card title={
          <div onClick={() => toggleCard('partnerLogos')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><RefreshCw className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">3. Partner Logos</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.partnerLogos && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              {(data.partnerLogos || []).map((logo, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Input value={logo} onChange={(e) => handleChange('partnerLogos', null, e.target.value, idx)} />
                  <Button onClick={() => handleRemoveArrayItem('partnerLogos', idx)} variant="ghost" className="text-red-400 hover:text-red-300 px-3"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('partnerLogos', 'NEW BRAND')} className="bg-zinc-800 text-white text-xs">Add Logo String</Button>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 3.5. CORE VALUES */}
        <Card title={
          <div onClick={() => toggleCard('values')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Edit3 className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">3.5. Core Values</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.values && (
            <div className="p-5 border-t border-zinc-800/80 space-y-6">
              {(data.values || []).map((val, idx) => (
                <div key={idx} className="space-y-3 p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gold uppercase tracking-wider">Value #{idx + 1}</span>
                    <Button onClick={() => handleRemoveArrayItem('values', idx)} variant="ghost" className="text-red-400 h-6 w-6 p-0"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <Input label="Title" value={val.title || ''} onChange={(e) => handleChange('values', null, e.target.value, idx, 'title')} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">Description</label>
                    <textarea 
                      className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-gold/50"
                      value={val.description || ''} onChange={(e) => handleChange('values', null, e.target.value, idx, 'description')}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('values', { title: 'New Value', description: '' })} className="bg-zinc-800 text-white text-xs">Add Core Value</Button>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 4. EDUCATIONAL PILLARS */}
        <Card title={
          <div onClick={() => toggleCard('educationPillars')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Edit3 className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">4. Educational Pillars</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.educationPillars && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline (e.g. EDUCATIONAL PILLARS)" value={data.educationPillars?.tagline || ''} onChange={(e) => handleChange('educationPillars', 'tagline', e.target.value)} />
              <Input label="Headline (e.g. Bridging the gap...)" value={data.educationPillars?.headline || ''} onChange={(e) => handleChange('educationPillars', 'headline', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Paragraph</label>
                <textarea className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  value={data.educationPillars?.paragraph || ''} onChange={(e) => handleChange('educationPillars', 'paragraph', e.target.value)} />
              </div>
              <Input label="CTA Text (e.g. View Service Portals)" value={data.educationPillars?.ctaText || ''} onChange={(e) => handleChange('educationPillars', 'ctaText', e.target.value)} />
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 5. CTA REACH (STATS) */}
        <Card title={
          <div onClick={() => toggleCard('stats')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Activity className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">5. CTA Reach (Stats)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.stats && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              {(data.stats || []).map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Input label="Value (e.g. 2.5M+)" value={stat.value || ''} onChange={(e) => handleChange('stats', null, e.target.value, idx, 'value')} />
                  <Input label="Label (e.g. YouTube Learners)" value={stat.label || ''} onChange={(e) => handleChange('stats', null, e.target.value, idx, 'label')} />
                  <Button onClick={() => handleRemoveArrayItem('stats', idx)} variant="ghost" className="text-red-400 hover:text-red-300 mt-6 px-3"><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('stats', { value: '0', label: 'New Stat' })} className="bg-zinc-800 text-white text-xs">Add Metric</Button>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 6. STUDENT SHOWCASE */}
        <Card title={
          <div onClick={() => toggleCard('studentShowcase')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Play className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">6. Student Showcase (Video Streams)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.studentShowcase && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline (e.g. VIDEO PORTFOLIO)" value={data.studentShowcase?.tagline || ''} onChange={(e) => handleChange('studentShowcase', 'tagline', e.target.value)} />
              <Input label="Headline (e.g. Cinematic Video Streams)" value={data.studentShowcase?.headline || ''} onChange={(e) => handleChange('studentShowcase', 'headline', e.target.value)} />
              
              <div className="pt-4 mt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">Video Clips & Streams</h4>
                {(data.studentShowcase?.videos || []).map((vid, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 mb-4 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <Input label="Video Title" value={vid.title || ''} onChange={(e) => handleChangeVideo(idx, 'title', e.target.value)} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Video File (Direct Upload)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => {
                              if(e.target.files[0]) handleVideoUpload(e.target.files[0], idx);
                            }}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-md p-2 text-white text-xs flex-1 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-white"
                          />
                        </div>
                        {vid.url && <a href={vid.url} target="_blank" rel="noreferrer" className="text-[10px] text-green-400 mt-1 truncate">Uploaded: {vid.url}</a>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <Input label="Category (e.g. Tutorial)" value={vid.category || ''} onChange={(e) => handleChangeVideo(idx, 'category', e.target.value)} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Thumbnail Image (Optional)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              if(e.target.files[0]) handleThumbnailUpload(e.target.files[0], idx);
                            }}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-md p-2 text-white text-xs flex-1 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-white"
                          />
                        </div>
                        {vid.thumbnail && <img src={vid.thumbnail} alt="thumb" className="mt-2 h-16 w-32 object-cover rounded-md border border-zinc-700" />}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Video Type</label>
                        <select
                          value={vid.type || 'long_video'}
                          onChange={(e) => handleChangeVideo(idx, 'type', e.target.value)}
                          className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
                        >
                          <option value="long_video">Long Video (16:9)</option>
                          <option value="short">YouTube Short (9:16)</option>
                          <option value="reel">Instagram Reel (9:16)</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={() => handleRemoveVideo(idx)} variant="ghost" className="absolute top-2 right-2 text-red-400 hover:text-red-300 px-3 py-1"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button onClick={handleAddVideo} className="bg-zinc-800 text-white text-xs mt-2">Add Video</Button>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 7. YOUTUBE INITIATIVE */}
        <Card title={
          <div onClick={() => toggleCard('youtubePromo')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><UploadCloud className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">7. YouTube Initiative</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.youtubePromo && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline" value={data.youtubePromo?.tagline || ''} onChange={(e) => handleChange('youtubePromo', 'tagline', e.target.value)} />
              <Input label="Title" value={data.youtubePromo?.title || ''} onChange={(e) => handleChange('youtubePromo', 'title', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Description</label>
                <textarea className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  value={data.youtubePromo?.description || ''} onChange={(e) => handleChange('youtubePromo', 'description', e.target.value)} />
              </div>
              <Input label="YouTube Channel URL" value={data.youtubePromo?.url || ''} onChange={(e) => handleChange('youtubePromo', 'url', e.target.value)} />
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 8. OUR IMPACT (CAMPAIGNS) */}
        <Card title={
          <div onClick={() => toggleCard('ourImpact')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Users className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">8. Our Impact (Campaigns)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.ourImpact && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline (e.g. OUR IMPACT)" value={data.ourImpact?.tagline || ''} onChange={(e) => handleChange('ourImpact', 'tagline', e.target.value)} />
              <Input label="Headline (e.g. Featured Campaigns)" value={data.ourImpact?.headline || ''} onChange={(e) => handleChange('ourImpact', 'headline', e.target.value)} />
              <p className="text-xs text-zinc-500 italic">Note: The actual campaigns automatically sync from the Campaigns module.</p>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 9. COMMUNITY (EVENTS) */}
        <Card title={
          <div onClick={() => toggleCard('community')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Users className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">9. Community (Events)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.community && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline (e.g. COMMUNITY)" value={data.community?.tagline || ''} onChange={(e) => handleChange('community', 'tagline', e.target.value)} />
              <Input label="Headline (e.g. Event Highlights)" value={data.community?.headline || ''} onChange={(e) => handleChange('community', 'headline', e.target.value)} />
              <p className="text-xs text-zinc-500 italic">Note: The actual events automatically sync from the Events module.</p>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 10. WALL OF LOVE (TESTIMONIALS) */}
        <Card title={
          <div onClick={() => toggleCard('testimonials')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><MessageSquare className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">10. Wall of Love (Testimonials)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.testimonials && (
            <div className="p-5 border-t border-zinc-800/80 space-y-6">
              <Input label="Tagline (e.g. WALL OF LOVE)" value={data.testimonials?.tagline || ''} onChange={(e) => handleChange('testimonials', 'tagline', e.target.value)} />
              <Input label="Headline (e.g. What Students Say)" value={data.testimonials?.headline || ''} onChange={(e) => handleChange('testimonials', 'headline', e.target.value)} />
              
              <div className="space-y-4 mt-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase">Reviews / Testimonials Source</h4>
                <p className="text-xs text-zinc-500 italic p-4 bg-zinc-900/40 rounded border border-zinc-800/50">
                  To manage, edit, and delete actual Testimonial records, please use the <strong>Testimonials & Reviews</strong> tab in the main sidebar. The visitor website will automatically fetch records from there!
                </p>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 11. NEWSLETTER */}
        <Card title={
          <div onClick={() => toggleCard('newsletter')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Edit3 className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">11. Stay in the Loop (Newsletter)</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.newsletter && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Title" value={data.newsletter?.title || ''} onChange={(e) => handleChange('newsletter', 'title', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Description</label>
                <textarea className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-white text-sm focus:outline-none focus:border-gold/50"
                  value={data.newsletter?.description || ''} onChange={(e) => handleChange('newsletter', 'description', e.target.value)} />
              </div>
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

        {/* 12. SEO / FUTURE OF CODE */}
        <Card title={
          <div onClick={() => toggleCard('seoFuture')} className="flex items-center justify-between w-full py-4 px-5 cursor-pointer bg-zinc-950/20">
            <div className="flex items-center gap-3"><Edit3 className="w-4 h-4 text-zinc-500" /><span className="font-serif text-xs font-bold uppercase tracking-wider text-zinc-400">12. SEO / Future of Code</span></div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        } className="p-0 border-zinc-800/40 bg-zinc-950/10">
          {expandedCards.seoFuture && (
            <div className="p-5 border-t border-zinc-800/80 space-y-4">
              <Input label="Tagline" value={data.seoFuture?.tagline || ''} onChange={(e) => handleChange('seoFuture', 'tagline', e.target.value)} />
              <Input label="Headline" value={data.seoFuture?.headline || ''} onChange={(e) => handleChange('seoFuture', 'headline', e.target.value)} />
              <Input label="CTA Button Text" value={data.seoFuture?.subtitle || ''} onChange={(e) => handleChange('seoFuture', 'subtitle', e.target.value)} />
              <div className="flex justify-end pt-4 mt-4 border-t border-zinc-800/50">
                <Button onClick={handleSaveAll} disabled={loading} className="bg-gold text-black hover:bg-white text-xs font-bold px-6">Save Record</Button>
              </div>
            </div>
          )}
        </Card>

      </div>

      {toast && (
        <div className={`fixed top-24 right-4 z-[999] px-6 py-3 rounded-lg shadow-2xl font-medium text-sm border flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-500/90 border-red-500 text-white' : 'bg-green-500/90 border-green-500 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};
