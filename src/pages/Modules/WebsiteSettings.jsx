import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Key, ShieldCheck, AlertCircle, Save, 
  Globe, Mail, Share2, Server, HelpCircle, Upload, 
  Film, FileText, Image, Briefcase, Calendar, FolderOpen, 
  Layers, Inbox, Trash2, Edit2, Plus, CheckCircle, ExternalLink, X
} from 'lucide-react';

export const WebsiteSettings = ({ setCurrentView }) => {
  const { db, updateSection, changePassword, addItem, updateItem, deleteItem } = useDatabase();
  const settingsData = db.settings || {};

  // 10 Dedicated Tabs state
  const [activeTab, setActiveTab] = useState('images'); // images, videos, text, blogs, jobs, events, projects, campaigns, inquiries, system
  const [systemSubTab, setSystemSubTab] = useState('branding'); // branding, security, smtp

  // 1. Image Upload Simulator State
  const [uploadedImages, setUploadedImages] = useState([
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400', name: 'vogue_cover.webp' },
    { id: 'img-2', url: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400', name: 'studio_shoot.webp' }
  ]);
  const [imageProgress, setImageProgress] = useState(false);

  // 2. Video Upload Simulator State
  const [videosList, setVideosList] = useState([
    { id: 'vid-1', title: 'Summer Collection Highlights', url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-makeup-40439-large.mp4' }
  ]);
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [videoSuccess, setVideoSuccess] = useState(false);

  // 3. Text Edit States
  const [textFields, setTextFields] = useState({
    tagline: 'Establish Authority in the Digital Landscape',
    headline: 'Creative Direction & Brand Consultancy',
    copyright: settingsData.footerText || '© 2026 TECHMASTER. All Rights Reserved.'
  });
  const [textSuccess, setTextSuccess] = useState(false);

  // 4. Jobs (Careers) CRUD states
  const careersList = db.careers || [];
  const [jobForm, setJobForm] = useState({ title: '', location: '', salary: '', type: 'Full-time' });
  const [jobEditingId, setJobEditingId] = useState(null);
  const [jobSuccess, setJobSuccess] = useState(false);

  // 5. Events CRUD states
  const eventsList = db.events || [];
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', time: '' });
  const [eventEditingId, setEventEditingId] = useState(null);
  const [eventSuccess, setEventSuccess] = useState(false);

  // 6. Projects (Portfolio) CRUD states
  const portfolioList = db.portfolio || [];
  const [projForm, setProjForm] = useState({ title: '', client: '', imageUrl: '', category: 'Creative Direction' });
  const [projEditingId, setProjEditingId] = useState(null);
  const [projSuccess, setProjSuccess] = useState(false);

  // 7. Campaigns CRUD states
  const campaignsList = db.campaigns || [];
  const [campForm, setCampForm] = useState({ name: '', subtitle: '', budget: '', status: 'Active' });
  const [campEditingId, setCampEditingId] = useState(null);
  const [campSuccess, setCampSuccess] = useState(false);

  // General Settings update
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleGeneralChange = (key, val) => {
    updateSection('settings', { [key]: val });
  };

  const handleSocialChange = (key, val) => {
    const updatedSocials = { ...settingsData.socialLinks, [key]: val };
    updateSection('settings', { socialLinks: updatedSocials });
  };

  // Image Upload Handler
  const simulateImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageProgress(true);
    setTimeout(() => {
      const payload = {
        id: `img-${Date.now()}`,
        url: URL.createObjectURL(file),
        name: file.name
      };
      setUploadedImages([payload, ...uploadedImages]);
      setImageProgress(false);
    }, 1500);
  };

  // Video Upload Handler
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideo.title.trim() || !newVideo.url.trim()) return;

    const payload = {
      id: `vid-${Date.now()}`,
      ...newVideo
    };
    setVideosList([payload, ...videosList]);
    setNewVideo({ title: '', url: '' });
    setVideoSuccess(true);
    setTimeout(() => setVideoSuccess(false), 1500);
  };

  // Text Save Handler
  const handleTextSave = (e) => {
    e.preventDefault();
    updateSection('settings', { footerText: textFields.copyright });
    setTextSuccess(true);
    setTimeout(() => setTextSuccess(false), 1500);
  };

  // Careers (Jobs) Handlers
  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.location.trim()) return;

    if (jobEditingId) {
      updateItem('careers', jobEditingId, jobForm);
      setJobEditingId(null);
    } else {
      addItem('careers', { id: `job-${Date.now()}`, ...jobForm });
    }
    setJobForm({ title: '', location: '', salary: '', type: 'Full-time' });
    setJobSuccess(true);
    setTimeout(() => setJobSuccess(false), 1500);
  };

  // Events Handlers
  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.location.trim()) return;

    if (eventEditingId) {
      updateItem('events', eventEditingId, eventForm);
      setEventEditingId(null);
    } else {
      addItem('events', { id: `evt-${Date.now()}`, ...eventForm });
    }
    setEventForm({ title: '', date: '', location: '', time: '' });
    setEventSuccess(true);
    setTimeout(() => setEventSuccess(false), 1500);
  };

  // Projects Handlers
  const handleProjSubmit = (e) => {
    e.preventDefault();
    if (!projForm.title.trim() || !projForm.client.trim()) return;

    const fallbackImg = 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=300';
    const payload = {
      ...projForm,
      imageUrl: projForm.imageUrl.trim() || fallbackImg
    };

    if (projEditingId) {
      updateItem('portfolio', projEditingId, payload);
      setProjEditingId(null);
    } else {
      addItem('portfolio', { id: `proj-${Date.now()}`, ...payload });
    }
    setProjForm({ title: '', client: '', imageUrl: '', category: 'Creative Direction' });
    setProjSuccess(true);
    setTimeout(() => setProjSuccess(false), 1500);
  };

  // Campaigns Handlers
  const handleCampSubmit = (e) => {
    e.preventDefault();
    if (!campForm.name.trim() || !campForm.subtitle.trim()) return;

    if (campEditingId) {
      updateItem('campaigns', campEditingId, campForm);
      setCampEditingId(null);
    } else {
      addItem('campaigns', { id: `camp-${Date.now()}`, ...campForm });
    }
    setCampForm({ name: '', subtitle: '', budget: '', status: 'Active' });
    setCampSuccess(true);
    setTimeout(() => setCampSuccess(false), 1500);
  };

  // Credentials Password submit
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = changePassword(oldPassword, newPassword);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setErrorMsg(res.message);
      }
    }, 800);
  };

  // Tabs structure metadata
  const tabsList = [
    { id: 'images', label: 'Upload Images', icon: Image },
    { id: 'videos', label: 'Upload Videos', icon: Film },
    { id: 'text', label: 'Edit Text', icon: FileText },
    { id: 'blogs', label: 'Publish Blogs', icon: Inbox },
    { id: 'jobs', label: 'Add Jobs', icon: Briefcase },
    { id: 'events', label: 'Add Events', icon: Calendar },
    { id: 'projects', label: 'Add Projects', icon: FolderOpen },
    { id: 'campaigns', label: 'Add Campaigns', icon: Layers },
    { id: 'inquiries', label: 'Manage Inquiries', icon: Mail },
    { id: 'system', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-150 flex items-center gap-2">
            <Settings className="w-5 h-5 text-luxury-gold" />
            Website Settings & Control Center
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage sitemaps, media catalogs, administrative campaigns, event listings, and corporate details.
          </p>
        </div>
        
        <Badge variant="gold" className="text-[10px] font-mono tracking-wider py-1 px-3 uppercase">
          Client Workspace Active
        </Badge>
      </div>

      {/* TOP NAVIGATION SCROLLBAR TABS */}
      <div className="flex border-b border-zinc-800 gap-1 select-none overflow-x-auto pb-1.5 scrollbar-thin">
        {tabsList.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setErrorMsg(''); setSuccessMsg(''); }}
              className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-luxury-gold text-luxury-gold font-bold' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TabIcon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: UPLOAD IMAGES ─── */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="1. Choose Image Assets">
            <div className="flex flex-col gap-4 mt-3">
              <label className="border border-dashed border-zinc-850 hover:border-luxury-gold/50 rounded-lg p-10 flex flex-col items-center justify-center gap-2.5 bg-zinc-950/40 cursor-pointer transition-colors min-h-[200px]">
                <Upload className="w-6 h-6 text-zinc-550" />
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 text-center">
                  {imageProgress ? "Uploading Image asset..." : "Browse Photo (.jpg, .png, .webp)"}
                </span>
                <input type="file" accept="image/*" onChange={simulateImageUpload} className="hidden" />
              </label>
            </div>
          </Card>

          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Uploaded Media Gallery">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {uploadedImages.map((img) => (
                <div key={img.id} className="relative group rounded-lg border border-zinc-900 bg-zinc-950 overflow-hidden h-28 shadow-md">
                  <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <span className="text-[8px] font-mono text-zinc-350 truncate">{img.name}</span>
                    <button 
                      onClick={() => setUploadedImages(uploadedImages.filter(i => i.id !== img.id))}
                      className="p-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all self-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: UPLOAD VIDEOS ─── */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="2. Register Video Asset">
            <form onSubmit={handleAddVideo} className="flex flex-col gap-4 mt-3">
              <Input 
                label="Video Title" 
                placeholder="e.g. Campaign Behind The Scenes"
                value={newVideo.title}
                onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                required
              />
              <Input 
                label="Video Source link (.mp4)" 
                placeholder="https://assets.mixkit.co/..."
                value={newVideo.url}
                onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                required
              />
              <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-2" disabled={videoSuccess}>
                {videoSuccess ? "Video Registered Successfully!" : "Add Video Asset"}
              </Button>
            </form>
          </Card>

          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Registered Videos Library">
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {videosList.map((vid) => (
                <div key={vid.id} className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <Film className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <span className="font-bold text-zinc-300 block truncate">{vid.title}</span>
                      <span className="text-[10px] text-zinc-550 font-mono truncate block">{vid.url}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVideosList(videosList.filter(v => v.id !== vid.id))}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-550 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: EDIT TEXT ─── */}
      {activeTab === 'text' && (
        <div className="max-w-2xl">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="3. Modify Website Texts">
            <form onSubmit={handleTextSave} className="flex flex-col gap-4 mt-3">
              <Input 
                label="Home Page Headline Title" 
                value={textFields.headline}
                onChange={e => setTextFields({ ...textFields, headline: e.target.value })}
                required
              />
              <Input 
                label="Hero Overlay Tagline Statement" 
                value={textFields.tagline}
                onChange={e => setTextFields({ ...textFields, tagline: e.target.value })}
                required
              />
              <Input 
                label="Footer Copyright Notice" 
                value={textFields.copyright}
                onChange={e => setTextFields({ ...textFields, copyright: e.target.value })}
                required
              />
              <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-2" disabled={textSuccess}>
                {textSuccess ? "Copyright Texts Serialized!" : "Save Text Layouts"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* ─── TAB 4: PUBLISH BLOGS ─── */}
      {activeTab === 'blogs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="4. Blogs Status Summary">
            <div className="flex flex-col gap-4 mt-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Published Blogs</span>
                  <span className="text-2xl font-bold font-serif text-luxury-gold block mt-2">12</span>
                </div>
                <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Drafts</span>
                  <span className="text-2xl font-bold font-serif text-zinc-300 block mt-2">4</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-1">
                Blogs support publication status and draft folders. You can edit title, content, cover photos, and tags in the main Blog Manager.
              </p>
              <Button onClick={() => setCurrentView('blog')} variant="primary" className="w-full text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-1.5">
                <span>Manage & Publish Blogs</span> <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Recent Article Drafts">
            <div className="flex flex-col gap-3">
              {(db.blogs || []).slice(0, 3).map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900 flex justify-between items-center text-xs">
                  <div className="text-left min-w-0">
                    <span className="font-bold text-zinc-300 block truncate">{b.title}</span>
                    <span className="text-[10px] text-zinc-550 font-mono uppercase tracking-wider block mt-0.5">{b.status}</span>
                  </div>
                  <button onClick={() => setCurrentView('blog')} className="p-1 text-zinc-500 hover:text-luxury-gold"><ExternalLink className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 5: ADD JOBS ─── */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title={jobEditingId ? "Edit Job opening" : "5. Add Job opening"}>
              <form onSubmit={handleJobSubmit} className="flex flex-col gap-3.5 mt-2">
                <Input 
                  label="Job Role Title" 
                  placeholder="e.g. Lead Video Editor" 
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
                <Input 
                  label="Studio Location" 
                  placeholder="Mumbai / Remote" 
                  value={jobForm.location}
                  onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />
                <Input 
                  label="Salary Range" 
                  placeholder="e.g. $2,000 / month" 
                  value={jobForm.salary}
                  onChange={e => setJobForm({ ...jobForm, salary: e.target.value })}
                />
                <Select 
                  label="Job Type"
                  options={[
                    { value: 'Full-time', label: 'Full-time' },
                    { value: 'Contract', label: 'Contract' },
                    { value: 'Part-time', label: 'Part-time' }
                  ]}
                  value={jobForm.type}
                  onChange={e => setJobForm({ ...jobForm, type: e.target.value })}
                />
                <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-1" disabled={jobSuccess}>
                  {jobSuccess ? "Job Openings Synced!" : jobEditingId ? "Save Job Details" : "Publish Job Opening"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Vacancies Database List">
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {careersList.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-6 text-center">No jobs active.</p>
                ) : (
                  careersList.map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-xs">
                      <div className="text-left min-w-0">
                        <span className="font-bold text-zinc-300 block truncate">{job.title}</span>
                        <span className="text-[10px] text-zinc-550 font-mono mt-0.5 block">{job.location} • {job.type} • {job.salary || 'Unspecified'}</span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => { setJobEditingId(job.id); setJobForm(job); }} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('careers', job.id)} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-550 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 6: ADD EVENTS ─── */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title={eventEditingId ? "Edit Appearance Details" : "6. Schedule Appearance"}>
              <form onSubmit={handleEventSubmit} className="flex flex-col gap-3.5 mt-2">
                <Input 
                  label="Event Appearance Title" 
                  placeholder="e.g. Creator Summit Keynote Speech" 
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
                <Input 
                  label="Host Venue Address" 
                  placeholder="e.g. Nesco Centre, Mumbai" 
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <Input 
                    label="Date" 
                    type="date"
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                  <Input 
                    label="Time / Slot" 
                    placeholder="e.g. 14:00 PM"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-1" disabled={eventSuccess}>
                  {eventSuccess ? "Appearances Sync Complete!" : eventEditingId ? "Save Event Details" : "Schedule Event"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Scheduled Appearances">
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {eventsList.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-6 text-center">No appearances scheduled.</p>
                ) : (
                  eventsList.map(evt => (
                    <div key={evt.id} className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-xs">
                      <div className="text-left min-w-0">
                        <span className="font-bold text-zinc-300 block truncate">{evt.title}</span>
                        <span className="text-[10px] text-zinc-550 font-mono mt-0.5 block">{evt.location} • {new Date(evt.date).toLocaleDateString()} {evt.time && `at ${evt.time}`}</span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => { setEventEditingId(evt.id); setEventForm(evt); }} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('events', evt.id)} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-550 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 7: ADD PROJECTS ─── */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title={projEditingId ? "Edit Project Details" : "7. Add Portfolio Project"}>
              <form onSubmit={handleProjSubmit} className="flex flex-col gap-3.5 mt-2">
                <Input 
                  label="Project Name" 
                  placeholder="e.g. Vogue Winter Editorial" 
                  value={projForm.title}
                  onChange={e => setProjForm({ ...projForm, title: e.target.value })}
                  required
                />
                <Input 
                  label="Brand Client" 
                  placeholder="e.g. Vogue India" 
                  value={projForm.client}
                  onChange={e => setProjForm({ ...projForm, client: e.target.value })}
                  required
                />
                <Input 
                  label="Project Cover Image link" 
                  placeholder="https://images.unsplash.com/..."
                  value={projForm.imageUrl}
                  onChange={e => setProjForm({ ...projForm, imageUrl: e.target.value })}
                />
                <Select 
                  label="Production Category"
                  options={[
                    { value: 'Creative Direction', label: 'Creative Direction' },
                    { value: 'Ambassadorship', label: 'Ambassadorship' },
                    { value: 'Editorial Shoot', label: 'Editorial Shoot' }
                  ]}
                  value={projForm.category}
                  onChange={e => setProjForm({ ...projForm, category: e.target.value })}
                />
                <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-1" disabled={projSuccess}>
                  {projSuccess ? "Project Database Updated!" : projEditingId ? "Save Project" : "Publish Project Card"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Portfolio Projects List">
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {portfolioList.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-6 text-center">No projects registered.</p>
                ) : (
                  portfolioList.map(proj => (
                    <div key={proj.id} className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-xs">
                      <div className="text-left min-w-0">
                        <span className="font-bold text-zinc-300 block truncate">{proj.title}</span>
                        <span className="text-[10px] text-zinc-550 font-mono mt-0.5 block">Client: {proj.client} • {proj.category}</span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => { setProjEditingId(proj.id); setProjForm(proj); }} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('portfolio', proj.id)} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-550 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 8: ADD CAMPAIGNS ─── */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title={campEditingId ? "Edit Campaign details" : "8. Launch New Campaign"}>
              <form onSubmit={handleCampSubmit} className="flex flex-col gap-3.5 mt-2">
                <Input 
                  label="Campaign Name" 
                  placeholder="e.g. Winter Luxury Shoot" 
                  value={campForm.name}
                  onChange={e => setCampForm({ ...campForm, name: e.target.value })}
                  required
                />
                <Input 
                  label="Subtitle Line" 
                  placeholder="e.g. Dior Launch Editorial" 
                  value={campForm.subtitle}
                  onChange={e => setCampForm({ ...campForm, subtitle: e.target.value })}
                  required
                />
                <Input 
                  label="Campaign Budget ($ USD)" 
                  placeholder="e.g. 50,000"
                  value={campForm.budget}
                  onChange={e => setCampForm({ ...campForm, budget: e.target.value })}
                />
                <Select 
                  label="Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' }
                  ]}
                  value={campForm.status}
                  onChange={e => setCampForm({ ...campForm, status: e.target.value })}
                />
                <Button type="submit" variant="primary" className="text-white text-xs font-semibold py-2.5 mt-1" disabled={campSuccess}>
                  {campSuccess ? "Campaign Configured!" : campEditingId ? "Save Campaign" : "Launch Campaign"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Launched Campaigns">
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {campaignsList.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic p-6 text-center">No campaigns launched.</p>
                ) : (
                  campaignsList.map(camp => (
                    <div key={camp.id} className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 text-xs">
                      <div className="text-left min-w-0">
                        <span className="font-bold text-zinc-300 block truncate">{camp.name || camp.brandName}</span>
                        <span className="text-[10px] text-zinc-550 font-mono mt-0.5 block">{camp.subtitle || camp.campaignName} • Status: {camp.status}</span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => { setCampEditingId(camp.id); setCampForm(camp); }} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-luxury-gold"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('campaigns', camp.id)} className="p-1.5 rounded hover:bg-zinc-900 text-zinc-555 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ─── TAB 9: MANAGE INQUIRIES ─── */}
      {activeTab === 'inquiries' && (
        <div className="max-w-xl">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="9. Inquiries Management Hub">
            <div className="flex flex-col gap-4 mt-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">General Enquiries</span>
                  <span className="text-2xl font-bold font-serif text-luxury-gold block mt-2">
                    {(db.enquiries || []).filter(e => e.category !== 'Booking' && e.category !== 'Sponsorship').length}
                  </span>
                </div>
                <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Business Bookings</span>
                  <span className="text-2xl font-bold font-serif text-zinc-300 block mt-2">
                    {(db.enquiries || []).filter(e => e.category === 'Booking' || e.category === 'Sponsorship').length}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-zinc-400 leading-relaxed mb-1">
                Customer bookings, brand inquiries, and collaboration proposals are consolidated. You can reply and manage bookings in the main enquiries log.
              </p>
              
              <Button onClick={() => setCurrentView('faq-contact')} variant="primary" className="w-full text-white font-semibold text-xs py-2.5 flex items-center justify-center gap-1.5">
                <span>Open Booking Inbox</span> <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 10: SYSTEM SETTINGS (GENERAL CONFIGS) ─── */}
      {activeTab === 'system' && (
        <div className="flex flex-col gap-6">
          {/* Sub Navigation */}
          <div className="flex gap-2 border-b border-zinc-900 pb-2.5">
            {['branding', 'security', 'smtp'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSystemSubTab(sub)}
                className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                  systemSubTab === sub 
                    ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30' 
                    : 'bg-zinc-900/40 border border-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {systemSubTab === 'branding' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Core branding */}
                <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20" title="Corporate Branding">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Executive Brand Name" 
                      value={settingsData.brandName}
                      onChange={(e) => handleGeneralChange('brandName', e.target.value)}
                      required
                    />
                    <Input 
                      label="Brand Logo Vector URL" 
                      value={settingsData.brandLogoUrl}
                      onChange={(e) => handleGeneralChange('brandLogoUrl', e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <Input 
                      label="Headquarters Office Address" 
                      textarea
                      rows={2}
                      value={settingsData.officeAddress}
                      onChange={(e) => handleGeneralChange('officeAddress', e.target.value)}
                      required
                    />
                  </div>
                </Card>

                {/* Channels & Emails */}
                <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20" title="Communications & Social Channels">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input 
                      label="General Inquiries Email" 
                      type="email"
                      value={settingsData.emailGeneral}
                      onChange={(e) => handleGeneralChange('emailGeneral', e.target.value)}
                      required
                    />
                    <Input 
                      label="Corporate Booking Email" 
                      type="email"
                      value={settingsData.emailBooking}
                      onChange={(e) => handleGeneralChange('emailBooking', e.target.value)}
                      required
                    />
                    <Input 
                      label="WhatsApp Hotline Number" 
                      value={settingsData.whatsappNumber}
                      onChange={(e) => handleGeneralChange('whatsappNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 mt-5 pt-4">
                    <Input 
                      label="Instagram Handle link" 
                      value={settingsData.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    />
                    <Input 
                      label="YouTube Channel link" 
                      value={settingsData.socialLinks?.youtube || ''}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    />
                    <Input 
                      label="LinkedIn Profile link" 
                      value={settingsData.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    />
                    <Input 
                      label="Pinterest Boards link" 
                      value={settingsData.socialLinks?.pinterest || ''}
                      onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                    />
                  </div>
                </Card>
              </div>

              <div>
                <Card className="border border-zinc-800/60 p-5 h-fit bg-zinc-950/20" title="System Maintenance State">
                  <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                    Activating maintenance mode will override the public facing website with a styled splash screen under the Zenvora logo, notifying visitors of scheduled updates.
                  </p>
                  
                  <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-md flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-zinc-200 block">Maintenance Override</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 inline-block">Off-duty toggle</span>
                    </div>
                    <Switch 
                      checked={settingsData.maintenanceMode}
                      onChange={(val) => handleGeneralChange('maintenanceMode', val)}
                    />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {systemSubTab === 'security' && (
            <div className="max-w-xl">
              <Card className="border border-zinc-800/60 p-6 bg-zinc-950/20" title="Reset Administrative Credentials">
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Update the master security passphrase used to authenticate access key requests into the CMS panel dashboard. Use a minimum of 6 characters containing numbers or special symbols.
                </p>

                <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-4">
                  <Input 
                    label="Current Access Key" 
                    type="password"
                    placeholder="Enter current password (admin123)"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <Input 
                    label="New Master Access Key" 
                    type="password"
                    placeholder="Must be at least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input 
                    label="Confirm Master Access Key" 
                    type="password"
                    placeholder="Retype password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />

                  {errorMsg && (
                    <div className="bg-rose-950/20 border border-rose-500/20 rounded p-3 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-455 mt-0.5" />
                      <span className="text-xs text-rose-300">{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-3 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-455 mt-0.5" />
                      <span className="text-xs text-emerald-300">{successMsg}</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full justify-center gap-2 mt-2" disabled={loading}>
                    <Key className="w-4 h-4 text-white" />
                    <span className="text-white">Update Access Credentials</span>
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {systemSubTab === 'smtp' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20" title="SMTP Mailing Server Configurations">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="SMTP Outgoing Host" 
                      value={settingsData.smtpHost}
                      onChange={(e) => handleGeneralChange('smtpHost', e.target.value)}
                      placeholder="smtp.mailgun.org"
                      required
                    />
                    <Input 
                      label="SMTP Port" 
                      value="587 (TLS)"
                      disabled
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-4 italic">
                    * SMTP details are currently routing through the Zenvora mock envelope simulator for testing and validation.
                  </p>
                </Card>

                <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20" title="Google Analytics Configurations">
                  <Input 
                    label="Universal measurement ID (GA4)" 
                    value={settingsData.googleAnalyticsId}
                    onChange={(e) => handleGeneralChange('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    required
                  />
                </Card>
              </div>

              <div>
                <Card className="border border-zinc-800/60 p-5 h-fit bg-zinc-950/20" title="System Check">
                  <div className="flex flex-col gap-3.5 text-xs text-zinc-400 mt-1">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                      <span>Server Database</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                      <span>SSL Certificate</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Local Storage Backup</span>
                      <Badge variant="success">Sync Complete</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save bar footer */}
      <div className="flex items-center justify-end p-4 border border-zinc-900 bg-zinc-950/30 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mr-6">
          <ShieldCheck className="w-4 h-4" />
          <span>All settings saved in database storage</span>
        </div>
      </div>
    </div>
  );
};
