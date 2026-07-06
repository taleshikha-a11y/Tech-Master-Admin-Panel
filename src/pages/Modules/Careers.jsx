import React, { useState, useEffect } from 'react';
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
  FileSpreadsheet, Search, Plus, Eye, Edit2, Trash2, CheckCircle, 
  Briefcase, GraduationCap, MapPin, Calendar, Link2, Download, 
  User, Mail, Phone, Clock, Award, ShieldAlert, Check
} from 'lucide-react';

export const Careers = ({ activeSubFeature }) => {
  const { db, addItem, updateItem, deleteItem, toggleStatus } = useDatabase();
  const jobsList = db.careers || [];
  const resumesList = db.resumes || [];

  const [activeSubTab, setActiveSubTab] = useState('jobs'); // jobs, resumes

  // Intercept view change from external navigation clicks
  useEffect(() => {
    if (activeSubFeature === 'job-openings') {
      setActiveSubTab('jobs');
    } else if (activeSubFeature === 'resume-management') {
      setActiveSubTab('resumes');
    }
  }, [activeSubFeature]);

  // General Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Job Opening CRUD States
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [jobFormData, setJobFormData] = useState({});
  const [jobErrors, setJobErrors] = useState({});

  // Resume CRUD States
  const [isResumeFormOpen, setIsResumeFormOpen] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [deleteResumeId, setDeleteResumeId] = useState(null);
  const [resumeFormData, setResumeFormData] = useState({});
  const [resumeErrors, setResumeErrors] = useState({});
  const [viewingResume, setViewingResume] = useState(null); // Immersive 3D modal active item

  // 3D image tilt coordinates
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });
  const [imgHovered, setImgHovered] = useState(false);

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    const tiltLimit = 10;
    setImgTilt({
      x: -normalizedY * tiltLimit,
      y: normalizedX * tiltLimit
    });
  };

  const handleImageMouseLeave = () => {
    setImgHovered(false);
    setImgTilt({ x: 0, y: 0 });
  };

  // Stats
  const totalJobs = jobsList.length;
  const totalResumes = resumesList.length;
  const verifiedResumes = resumesList.filter(r => r.status === 'Reviewed').length;
  const pendingResumes = resumesList.filter(r => r.status === 'New').length;

  // --- JOB OPENINGS ACTIONS ---
  const openJobForm = (job = null) => {
    setJobErrors({});
    if (job) {
      setEditingJob(job);
      setJobFormData(job);
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        department: 'Production',
        type: 'Full-time',
        location: 'Mumbai (Hybrid)',
        description: '',
        requirements: '',
        benefits: '',
        isActive: true
      });
    }
    setIsJobFormOpen(true);
  };

  const handleJobInputChange = (name, value) => {
    setJobFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!jobFormData.title?.trim() || !jobFormData.description?.trim()) {
      setJobErrors({
        title: !jobFormData.title ? 'Position Title is required.' : '',
        description: !jobFormData.description ? 'Description is required.' : ''
      });
      return;
    }

    if (editingJob) {
      updateItem('careers', editingJob.id, jobFormData);
    } else {
      addItem('careers', jobFormData);
    }
    setIsJobFormOpen(false);
  };

  const handleJobDelete = () => {
    if (deleteJobId) {
      deleteItem('careers', deleteJobId);
      setDeleteJobId(null);
    }
  };

  // --- RESUME APPLICATION ACTIONS ---
  const openResumeForm = (resume = null) => {
    setResumeErrors({});
    if (resume) {
      setEditingResume(resume);
      setResumeFormData(resume);
    } else {
      setEditingResume(null);
      setResumeFormData({
        candidateName: '',
        email: '',
        phone: '',
        jobApplied: jobsList[0]?.title || 'Creative Video Producer & Editor',
        experienceYears: 2,
        portfolioLink: '',
        resumeFileName: 'Candidate_CV_Draft.pdf',
        status: 'New',
        coverLetter: ''
      });
    }
    setIsResumeFormOpen(true);
  };

  const handleResumeInputChange = (name, value) => {
    setResumeFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeSubmit = (e) => {
    e.preventDefault();
    if (!resumeFormData.candidateName?.trim() || !resumeFormData.email?.trim()) {
      setResumeErrors({
        candidateName: !resumeFormData.candidateName ? 'Candidate Name is required.' : '',
        email: !resumeFormData.email ? 'Email address is required.' : ''
      });
      return;
    }

    if (editingResume) {
      updateItem('resumes', editingResume.id, resumeFormData);
      if (viewingResume?.id === editingResume.id) {
        setViewingResume(prev => ({ ...prev, ...resumeFormData }));
      }
    } else {
      addItem('resumes', resumeFormData);
    }
    setIsResumeFormOpen(false);
  };

  const handleResumeDelete = () => {
    if (deleteResumeId) {
      deleteItem('resumes', deleteResumeId);
      if (viewingResume?.id === deleteResumeId) {
        setViewingResume(null);
      }
      setDeleteResumeId(null);
    }
  };

  const verifyResumeStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Reviewed' ? 'New' : 'Reviewed';
    updateItem('resumes', id, { status: nextStatus });
    if (viewingResume?.id === id) {
      setViewingResume(prev => ({ ...prev, status: nextStatus }));
    }
  };

  // Filters
  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || job.department === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredResumes = resumesList.filter(res => {
    const matchesSearch = 
      res.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.jobApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header info */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-luxury-gold" />
            Recruitment Hub
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying corporate job listings, internship roles, and submitted candidate resumes.
          </p>
        </div>
      </div>

      {/* Recruitment Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel border border-zinc-850 p-4 rounded-lg flex flex-col gap-1 bg-zinc-950/20">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Open Job Listings</span>
          <span className="text-2xl font-bold text-zinc-100 mt-1">{totalJobs} Active</span>
        </div>
        <div className="glass-panel border border-zinc-850 p-4 rounded-lg flex flex-col gap-1 bg-zinc-950/20">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Total Submissions</span>
          <span className="text-2xl font-bold text-zinc-100 mt-1">{totalResumes} Resumes</span>
        </div>
        <div className="glass-panel border border-zinc-850 p-4 rounded-lg flex flex-col gap-1 bg-zinc-950/20">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Pending Evaluation</span>
          <span className="text-2xl font-bold text-luxury-gold mt-1">{pendingResumes} Review</span>
        </div>
        <div className="glass-panel border border-zinc-850 p-4 rounded-lg flex flex-col gap-1 bg-zinc-950/20">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Verified Candidate Rate</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1">
            {totalResumes > 0 ? `${Math.round((verifiedResumes / totalResumes) * 100)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-800 gap-2 select-none">
        <button
          onClick={() => { setActiveSubTab('jobs'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
            activeSubTab === 'jobs' 
              ? 'border-luxury-gold text-luxury-gold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-350'
          }`}
        >
          Job Openings ({totalJobs})
        </button>
        <button
          onClick={() => { setActiveSubTab('resumes'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
            activeSubTab === 'resumes' 
              ? 'border-luxury-gold text-luxury-gold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-350'
          }`}
        >
          Resume Management ({totalResumes})
        </button>
      </div>

      {/* --- TAB PANEL: JOB OPENINGS --- */}
      {activeSubTab === 'jobs' && (
        <div className="flex flex-col gap-6">
          {/* Section description */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-200">Job Positions Directory</h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                Define active vacancies, job descriptions, and locations. Toggle listings as live or draft to control publishing.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => openJobForm(null)} className="gap-1.5 self-start xl:self-auto">
              <Plus className="w-4 h-4 text-black" />
              <span className="text-black font-semibold">Add Job Role</span>
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search job roles, departments, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="w-44">
              <Select
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'Production', label: 'Production' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Creative Consulting', label: 'Creative Consulting' },
                  { value: 'Administration', label: 'Administration' }
                ]}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Jobs Listing Grid with Staggered Animations */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06 }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.length === 0 ? (
              <p className="text-sm text-zinc-500 italic p-6 col-span-3">No jobs found matching the parameters.</p>
            ) : (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.97 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 15 } }
                  }}
                >
                  <TiltCard 
                    className="h-full border border-zinc-800/80 p-5 flex flex-col justify-between group bg-zinc-950/10"
                    maxTilt={5}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Badge variant="gold">{job.department}</Badge>
                        <Badge variant={job.isActive ? 'success' : 'default'}>
                          {job.isActive ? 'Active' : 'Draft'}
                        </Badge>
                      </div>

                      <div className="border-b border-zinc-900 pb-2">
                        <h3 className="font-serif text-sm font-bold text-zinc-200 tracking-wide mt-1 group-hover:text-luxury-gold transition-colors">{job.title}</h3>
                        <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 mt-1 uppercase">
                          <MapPin className="w-3 h-3 text-luxury-gold" /> {job.location} | {job.type}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {job.description || "Creative job opening seeking elite candidate files."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5 mt-5">
                      <span className="text-[9px] text-zinc-500 font-mono">
                        Posted: {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="flex gap-1">
                        <button 
                          onClick={() => openJobForm(job)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Edit Position"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteJobId(job.id)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-450 transition-colors cursor-pointer"
                          title="Delete Position"
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

          {/* Job Guideline Box */}
          <Card className="border border-zinc-800/70 bg-zinc-950/70 p-5 mt-4">
            <h3 className="text-sm uppercase tracking-[0.3em] text-zinc-500">Job Listing Guidelines</h3>
            <ul className="mt-4 space-y-2 text-xs text-zinc-450 list-disc list-inside">
              <li>Define the core narrative scope and storyboards expected of the candidate.</li>
              <li>Outline technical software parameters (such as Premiere, After Effects, DaVinci, or Blender).</li>
              <li>List competitive benefits, health provisions, and access to co-branded visual events.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* --- TAB PANEL: RESUME MANAGEMENT --- */}
      {activeSubTab === 'resumes' && (
        <div className="flex flex-col gap-6">
          {/* Section description */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-200">Submitted Candidate Resumes</h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                Review applicant statements, portfolios, and experience levels. Verify resume submissions to mark them Reviewed.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => openResumeForm(null)} className="gap-1.5 self-start xl:self-auto">
              <Plus className="w-4 h-4 text-black" />
              <span className="text-black font-semibold">Add Candidate CV</span>
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search candidate names, emails, or job titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="w-40">
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'New', label: 'New Files' },
                  { value: 'Reviewed', label: 'Reviewed/Verified' },
                  { value: 'Rejected', label: 'Archived/Rejected' }
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Candidate Resumes Cards Grid */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06 }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResumes.length === 0 ? (
              <p className="text-sm text-zinc-500 italic p-6 col-span-3">No resumes matching selection.</p>
            ) : (
              filteredResumes.map((res) => (
                <motion.div
                  key={res.id}
                  onClick={() => setViewingResume(res)}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.97 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 15 } }
                  }}
                  className="cursor-pointer"
                >
                  <TiltCard 
                    className="h-full border border-zinc-800/80 p-5 flex flex-col justify-between group relative overflow-hidden bg-zinc-950/10"
                    maxTilt={6}
                  >
                    {/* Watermarked AD logo in backdrop */}
                    <div className="absolute -bottom-8 -right-8 text-7xl font-black font-serif text-white/[0.015] pointer-events-none select-none">
                      AD
                    </div>

                    <div className="flex flex-col gap-3 relative z-10">
                      <div className="flex justify-between items-center">
                        <Badge variant={res.status === 'Reviewed' ? 'success' : res.status === 'Rejected' ? 'danger' : 'info'}>
                          {res.status}
                        </Badge>
                        <span className="text-[10px] text-zinc-500 font-mono font-semibold">{res.experienceYears || '0'} Years Practice</span>
                      </div>

                      <div className="border-b border-zinc-900 pb-2">
                        <h4 className="font-serif text-sm font-bold text-zinc-200 uppercase tracking-wide group-hover:text-luxury-gold transition-colors">{res.candidateName}</h4>
                        <span className="text-[9px] text-zinc-500 font-mono tracking-wider block mt-0.5 uppercase">{res.jobApplied}</span>
                      </div>

                      <p className="text-xs text-zinc-400 italic line-clamp-3 leading-relaxed">
                        "{res.coverLetter || "No cover statement uploaded by candidate."}"
                      </p>
                    </div>

                    {/* Actions and Footer */}
                    <div className="flex justify-between items-center mt-5 border-t border-zinc-900/60 pt-3.5 relative z-10" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {new Date(res.appliedAt || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setViewingResume(res)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Inspect CV"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => verifyResumeStatus(res.id, res.status)}
                          className={`p-1.5 rounded hover:bg-zinc-800 transition-colors cursor-pointer ${res.status === 'Reviewed' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-emerald-400'}`}
                          title={res.status === 'Reviewed' ? "Mark Unverified" : "Verify Resume"}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => openResumeForm(res)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Edit Submission"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteResumeId(res.id)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-450 transition-colors cursor-pointer"
                          title="Delete Submission"
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

          {/* Candidate Guideline Box */}
          <Card className="border border-zinc-800/70 bg-zinc-950/70 p-5 mt-4">
            <h3 className="text-sm uppercase tracking-[0.3em] text-zinc-500">Candidate Review Workflow</h3>
            <ul className="mt-4 space-y-2 text-xs text-zinc-450 list-disc list-inside">
              <li>HR can click the verification checkmark on the card to instantly verify a profile (marked Reviewed in green).</li>
              <li>Open candidate CV mockups to view structured education, experience, statement, and contact details.</li>
              <li>Update application status, download PDF documents, and visit portfolio reels from within the preview panel.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* --- JOB CRUDE DIALOG FORM --- */}
      <Dialog
        isOpen={isJobFormOpen}
        onClose={() => setIsJobFormOpen(false)}
        title={editingJob ? "Edit Job Position" : "Register Job Position"}
        size="md"
      >
        <form onSubmit={handleJobSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Position Title"
              value={jobFormData.title || ''}
              onChange={(e) => handleJobInputChange('title', e.target.value)}
              error={jobErrors.title}
              placeholder="e.g. Creative Video Editor"
              required
            />
            <Select 
              label="Department"
              options={['Production', 'Marketing', 'Creative Consulting', 'Administration']}
              value={jobFormData.department || 'Production'}
              onChange={(e) => handleJobInputChange('department', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Employment Type"
              options={['Full-time', 'Part-time', 'Internship', 'Contract']}
              value={jobFormData.type || 'Full-time'}
              onChange={(e) => handleJobInputChange('type', e.target.value)}
            />
            <Input 
              label="Work Location"
              value={jobFormData.location || ''}
              onChange={(e) => handleJobInputChange('location', e.target.value)}
              placeholder="e.g. Mumbai (Hybrid)"
            />
          </div>

          <Input 
            label="Job Description"
            textarea
            rows={3}
            value={jobFormData.description || ''}
            onChange={(e) => handleJobInputChange('description', e.target.value)}
            error={jobErrors.description}
            placeholder="Define core duties and daily responsibilities..."
            required
          />

          <Input 
            label="Role Requirements"
            textarea
            rows={3}
            value={jobFormData.requirements || ''}
            onChange={(e) => handleJobInputChange('requirements', e.target.value)}
            placeholder="e.g. 3+ years experience, DaVinci Resolve expertise..."
          />

          <Input 
            label="Benefits & Perks"
            textarea
            rows={2}
            value={jobFormData.benefits || ''}
            onChange={(e) => handleJobInputChange('benefits', e.target.value)}
            placeholder="e.g. Competitive budget, VIP access events, health cover..."
          />

          <div className="flex items-center gap-3 py-2">
            <span className="text-xs font-semibold text-zinc-400">Position Status:</span>
            <div className="flex items-center gap-1.5">
              <Switch 
                checked={jobFormData.isActive ?? true}
                onChange={(checked) => handleJobInputChange('isActive', checked)}
              />
              <span className="text-xs text-zinc-300 font-mono font-bold uppercase">
                {jobFormData.isActive ? 'Live Listing' : 'Draft / Closed'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsJobFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingJob ? "Save Changes" : "Register Position"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* --- RESUME CRUDE DIALOG FORM --- */}
      <Dialog
        isOpen={isResumeFormOpen}
        onClose={() => setIsResumeFormOpen(false)}
        title={editingResume ? "Edit Resume File" : "Register Resume File"}
        size="md"
      >
        <form onSubmit={handleResumeSubmit} className="flex flex-col gap-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Candidate Full Name"
              value={resumeFormData.candidateName || ''}
              onChange={(e) => handleResumeInputChange('candidateName', e.target.value)}
              error={resumeErrors.candidateName}
              placeholder="e.g. Rohan Varma"
              required
            />
            <Input 
              label="Email Address"
              type="email"
              value={resumeFormData.email || ''}
              onChange={(e) => handleResumeInputChange('email', e.target.value)}
              error={resumeErrors.email}
              placeholder="name@gmail.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Contact Phone"
              value={resumeFormData.phone || ''}
              onChange={(e) => handleResumeInputChange('phone', e.target.value)}
              placeholder="+91 99999 88888"
            />
            <Select 
              label="Job Position Applied"
              options={
                jobsList.length > 0 
                  ? jobsList.map(j => j.title)
                  : ['Creative Video Producer & Editor', 'Luxury Public Relations (PR) Associate', '3D Motion Graphics Intern']
              }
              value={resumeFormData.jobApplied || ''}
              onChange={(e) => handleResumeInputChange('jobApplied', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Years of Experience"
              type="number"
              value={resumeFormData.experienceYears || ''}
              onChange={(e) => handleResumeInputChange('experienceYears', Number(e.target.value))}
              placeholder="e.g. 4"
            />
            <Input 
              label="Portfolio / LinkedIn Link"
              value={resumeFormData.portfolioLink || ''}
              onChange={(e) => handleResumeInputChange('portfolioLink', e.target.value)}
              placeholder="https://vimeo.com/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Attached Resume File Name"
              value={resumeFormData.resumeFileName || ''}
              onChange={(e) => handleResumeInputChange('resumeFileName', e.target.value)}
              placeholder="e.g. Candidate_CV.pdf"
            />
            <Select 
              label="Evaluation Status"
              options={['New', 'Reviewed', 'Rejected']}
              value={resumeFormData.status || 'New'}
              onChange={(e) => handleResumeInputChange('status', e.target.value)}
            />
          </div>

          <Input 
            label="Candidate Statement / Cover Letter"
            textarea
            rows={3}
            value={resumeFormData.coverLetter || ''}
            onChange={(e) => handleResumeInputChange('coverLetter', e.target.value)}
            placeholder="Input cover letter summaries here..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsResumeFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingResume ? "Save Changes" : "Submit Candidate"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* --- 3D IMMERSIVE CV SHOWCASE DETAILS --- */}
      <AnimatePresence>
        {viewingResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingResume(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40"
            />

            {/* Showcase details container */}
            <motion.div
              layoutId={`res-card-${viewingResume.id}`}
              className="relative w-full max-w-4xl glass-panel border border-zinc-800 rounded-lg overflow-hidden z-50 flex flex-col md:flex-row text-left shadow-gold-glow-lg"
              style={{ perspective: 1200 }}
            >
              {/* Left pane: cream A4 paper CV Mockup with 3D mouse tracking tilt */}
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={handleImageMouseLeave}
                className="w-full md:w-1/2 min-h-[420px] md:min-h-auto p-8 overflow-hidden relative group cursor-crosshair select-none flex items-center justify-center bg-zinc-950/80"
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              >
                {/* cream-white paper CV sheet */}
                <motion.div 
                  animate={{
                    rotateX: imgTilt.x,
                    rotateY: imgTilt.y,
                    scale: imgHovered ? 1.03 : 1.0
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-full max-w-[320px] aspect-[1/1.414] bg-stone-50 border border-stone-200/80 p-5 flex flex-col justify-between text-left relative overflow-hidden shadow-2xl rounded"
                >
                  {/* Watermarked AD logo in background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[130px] font-black font-serif text-stone-200/40 pointer-events-none select-none">
                    AD
                  </div>

                  <div className="flex flex-col gap-4 relative z-10">
                    {/* CV Header */}
                    <div className="border-b border-stone-300 pb-3 flex justify-between items-start">
                      <div className="max-w-[200px]">
                        <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wide leading-tight">{viewingResume.candidateName}</h4>
                        <p className="text-[8px] text-stone-500 font-mono tracking-widest uppercase mt-0.5">{viewingResume.jobApplied} Candidate</p>
                      </div>
                      <img 
                        src={
                          viewingResume.candidateName.includes("Rohan") 
                            ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" 
                            : viewingResume.candidateName.includes("Neha") 
                            ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                            : viewingResume.candidateName.includes("Aleksei") 
                            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                        } 
                        className="w-10 h-10 rounded border border-stone-200 object-cover shadow-sm flex-shrink-0"
                        alt="" 
                      />
                    </div>

                    {/* CV Details */}
                    <div className="flex flex-col gap-3.5 text-[9px] text-stone-600 font-sans">
                      {/* Contact */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono">Contact Details</span>
                        <span className="font-mono text-stone-850 font-semibold">{viewingResume.email}</span>
                        <span className="font-mono text-stone-850 font-semibold">{viewingResume.phone || "No contact phone"}</span>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono">Summary</span>
                        <p className="leading-relaxed text-stone-800 italic line-clamp-3">
                          "{viewingResume.coverLetter || "Creative specialist looking to expand luxury brand campaigns and digital assets."}"
                        </p>
                      </div>

                      {/* Work history */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono">Work History</span>
                        <div className="flex justify-between font-semibold text-stone-900">
                          <span>Senior {viewingResume.jobApplied || 'Specialist'}</span>
                          <span>{viewingResume.experienceYears} Years Exp</span>
                        </div>
                        <p className="leading-tight text-[8px] text-stone-500">Led campaign storylines, edited cinematic reels, and coordinated publishing.</p>
                      </div>

                      {/* Technical core */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7.5px] font-bold text-stone-400 uppercase tracking-wider font-mono">Competencies</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[8px] py-0.5 px-2 bg-stone-200/60 rounded-full text-stone-700 font-semibold">Creative Suite</span>
                          <span className="text-[8px] py-0.5 px-2 bg-stone-200/60 rounded-full text-stone-700 font-semibold">Asset Ops</span>
                          <span className="text-[8px] py-0.5 px-2 bg-stone-200/60 rounded-full text-stone-700 font-semibold">Luxury Code</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV Footer */}
                  <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-[7.5px] text-stone-400 font-mono">
                    <span>AKANKSHA DUA TALENT</span>
                    <span>VERIFIED PROFILE</span>
                  </div>
                </motion.div>

                {/* 3D Parallax floating check glass badge */}
                <div 
                  className="absolute bottom-6 left-6 right-6 bg-black/65 border border-luxury-gold/20 backdrop-blur-md p-4 rounded-md shadow-gold-glow flex flex-col gap-1 pointer-events-none z-10"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <span className="text-[9px] text-luxury-gold font-mono tracking-widest uppercase block">TALENT ACQUISITION</span>
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider truncate">{viewingResume.candidateName}</h3>
                </div>
              </motion.div>

              {/* Right content details pane */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950/60 overflow-y-auto">
                <button
                  onClick={() => setViewingResume(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900/60 text-zinc-500 hover:text-white transition-colors cursor-pointer z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-5">
                  {/* Status header */}
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-900 flex-wrap gap-2 mt-4 md:mt-0">
                    <div>
                      <h3 className="font-serif text-base font-bold text-zinc-200">{viewingResume.candidateName}</h3>
                      <span className="text-[10px] text-zinc-500">Recruitment Portal File</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">Status:</span>
                      <select 
                        value={viewingResume.status}
                        onChange={(e) => {
                          updateItem('resumes', viewingResume.id, { status: e.target.value });
                          setViewingResume(prev => ({ ...prev, status: e.target.value }));
                        }}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-355 text-xs font-semibold rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 uppercase font-semibold text-[9px] tracking-wider">Experience Level</span>
                      <span className="text-zinc-300 font-medium">{viewingResume.experienceYears} Years Practice</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 uppercase font-semibold text-[9px] tracking-wider">Application Date</span>
                      <span className="text-zinc-300 font-mono">{new Date(viewingResume.appliedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="flex flex-col gap-2 p-3 bg-zinc-900/30 border border-zinc-900 rounded">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Document Repository</span>
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-luxury-gold" />
                        <span className="text-zinc-300 font-mono text-[11px]">{viewingResume.resumeFileName}</span>
                      </div>
                      <Button variant="secondary" size="sm" className="py-1 px-3 gap-1 text-[10px]">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CV</span>
                      </Button>
                    </div>
                    {viewingResume.portfolioLink && (
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-t border-zinc-900/80 pt-2 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-300 font-mono text-[11px] truncate max-w-xs">{viewingResume.portfolioLink}</span>
                        </div>
                        <a href={viewingResume.portfolioLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="secondary" size="sm" className="py-1 px-3 gap-1 text-[10px]">
                            <span>Visit Portfolio</span>
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Candidate letter */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Cover Letter Quote</span>
                    <p className="text-xs text-zinc-450 leading-relaxed bg-zinc-950/40 p-3.5 border border-zinc-900/85 rounded italic">
                      "{viewingResume.coverLetter || "No cover statement uploaded by candidate."}"
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8 border-t border-zinc-900 pt-4 flex-wrap">
                  <Button 
                    variant="primary" 
                    className="flex-1 py-2.5 text-center gap-1.5 text-xs text-black" 
                    onClick={() => verifyResumeStatus(viewingResume.id, viewingResume.status)}
                  >
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>{viewingResume.status === 'Reviewed' ? 'Mark Unverified' : 'Verify Resume'}</span>
                  </Button>
                  <Button variant="danger" className="py-2.5 text-xs" onClick={() => { setDeleteResumeId(viewingResume.id); }}>
                    Delete
                  </Button>
                  <Button variant="secondary" className="py-2.5 text-xs" onClick={() => setViewingResume(null)}>
                    Close File
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirms */}
      <ConfirmDialog
        isOpen={deleteJobId !== null}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleJobDelete}
        title="Delete Job Opening"
        message="This will permanently delete this job position. Are you sure?"
      />

      <ConfirmDialog
        isOpen={deleteResumeId !== null}
        onClose={() => setDeleteResumeId(null)}
        onConfirm={handleResumeDelete}
        title="Delete Resume Application"
        message="This will permanently remove this candidate application. Are you sure?"
      />
    </div>
  );
};
