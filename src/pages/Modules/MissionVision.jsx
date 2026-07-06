import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Target, Plus, Trash2, ShieldCheck, MapPin, Milestone } from 'lucide-react';

export const MissionVision = () => {
  const { db, updateSection } = useDatabase();
  const data = db.missionVision;

  const handleTextChange = (section, key, val) => {
    const updatedSection = { ...data[section], [key]: val };
    updateSection('missionVision', { [section]: updatedSection });
  };

  // Roadmap CRUD
  const [newQuarter, setNewQuarter] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newStatus, setNewStatus] = useState('Planning');

  const handleAddRoadmap = () => {
    if (!newQuarter.trim() || !newGoal.trim()) return;
    const updatedRoadmap = [
      ...data.roadmap,
      { id: `rm-${Date.now()}`, quarter: newQuarter.trim(), goal: newGoal.trim(), status: newStatus }
    ];
    updateSection('missionVision', { roadmap: updatedRoadmap });
    setNewQuarter('');
    setNewGoal('');
    setNewStatus('Planning');
  };

  const handleDeleteRoadmap = (id) => {
    const updatedRoadmap = data.roadmap.filter(item => item.id !== id);
    updateSection('missionVision', { roadmap: updatedRoadmap });
  };

  const handleStatusChange = (id, status) => {
    const updatedRoadmap = data.roadmap.map(item => 
      item.id === id ? { ...item, status } : item
    );
    updateSection('missionVision', { roadmap: updatedRoadmap });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-luxury-gold" />
          Mission, Vision & Brand Philosophy
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Define core organizational philosophies, community visions, and chronological roadmap milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Statements */}
        <div className="flex flex-col gap-6">
          <Card className="border border-zinc-800/60 p-5" title="Brand Philosophy">
            <div className="flex flex-col gap-4">
              <Input 
                label="Headline Title" 
                value={data.brandPhilosophy.headline}
                onChange={(e) => handleTextChange('brandPhilosophy', 'headline', e.target.value)}
                placeholder="e.g. Artistry as Strategy"
                required
              />
              <Input 
                label="Philosophy Description" 
                textarea
                rows={4}
                value={data.brandPhilosophy.content}
                onChange={(e) => handleTextChange('brandPhilosophy', 'content', e.target.value)}
                placeholder="Formulate the core branding philosophy..."
                required
              />
            </div>
          </Card>

          <Card className="border border-zinc-800/60 p-5" title="Community Vision & Creator Mission">
            <div className="flex flex-col gap-5">
              <div>
                <Input 
                  label="Community Vision Headline" 
                  value={data.communityVision.headline}
                  onChange={(e) => handleTextChange('communityVision', 'headline', e.target.value)}
                  placeholder="e.g. Elevating the Creator Economy"
                  required
                />
                <Input 
                  label="Community Vision Description" 
                  textarea
                  rows={2}
                  value={data.communityVision.content}
                  onChange={(e) => handleTextChange('communityVision', 'content', e.target.value)}
                  placeholder="Details..."
                  required
                  className="mt-1"
                />
              </div>

              <div className="border-t border-zinc-900 pt-4">
                <Input 
                  label="Creator Mission Headline" 
                  value={data.creatorMission.headline}
                  onChange={(e) => handleTextChange('creatorMission', 'headline', e.target.value)}
                  required
                />
                <Input 
                  label="Creator Mission Description" 
                  textarea
                  rows={2}
                  value={data.creatorMission.content}
                  onChange={(e) => handleTextChange('creatorMission', 'content', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Roadmap Milestones */}
        <div className="flex flex-col gap-6">
          {/* List */}
          <Card className="border border-zinc-800/60 p-5 flex-1" title="Strategic Roadmap Milestones">
            <div className="flex flex-col gap-3 mt-2 max-h-[400px] overflow-y-auto pr-1">
              {data.roadmap.length === 0 ? (
                <p className="text-sm text-zinc-500 italic p-6 border border-dashed border-zinc-800 rounded">No milestones defined. Create one below.</p>
              ) : (
                data.roadmap.map((item) => (
                  <div key={item.id} className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-md flex items-center justify-between gap-4 hover:border-zinc-800">
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Milestone className="w-3.5 h-3.5 text-luxury-gold" />
                        <span className="text-xs font-bold text-luxury-gold font-mono uppercase tracking-wider">{item.quarter}</span>
                        <div className="w-28">
                          <select 
                            value={item.status} 
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="bg-zinc-900 text-zinc-300 text-[10px] uppercase font-bold border border-zinc-800 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Planning">Planning</option>
                            <option value="Proposed">Proposed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300 font-semibold mt-1.5 leading-relaxed truncate" title={item.goal}>
                        {item.goal}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteRoadmap(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Roadmap Form */}
            <div className="border-t border-zinc-900 mt-5 pt-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Append Roadmap Target</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Quarter (e.g. Q4 2026)" 
                  value={newQuarter}
                  onChange={(e) => setNewQuarter(e.target.value)}
                  required
                />
                <Select 
                  label="Target Status" 
                  options={['Planning', 'In Progress', 'Proposed', 'Completed']}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
              </div>
              <div className="mt-3 flex gap-2 items-end">
                <Input 
                  label="Milestone Target Goal" 
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g. Expand design studios..."
                  required
                />
                <Button onClick={handleAddRoadmap} variant="primary" className="py-2.5">
                  <Plus className="w-4 h-4 text-black" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-end p-4 border border-zinc-900 bg-zinc-950/30 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mr-6">
          <ShieldCheck className="w-4 h-4" />
          <span>All settings saved in database storage</span>
        </div>
      </div>
    </div>
  );
};
