import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  User, Mail, Phone, MapPin, Shield, LogOut, CheckCircle, Save 
} from 'lucide-react';

export const AdminProfile = () => {
  const { auth, updateProfile, logout } = useDatabase();
  const user = auth.user || {};

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+91 99999 11111',
    address: user.address || 'Zenvora Creative Studio, Floor 14, Nariman Point, Mumbai 400021',
    imageUrl: user.imageUrl || ''
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    updateProfile(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-150 flex items-center gap-2">
          <User className="w-6 h-6 text-luxury-gold" />
          My Profile & Administrative Account
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review your access level, update credentials, change contact metrics, and manage active sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Avatar & Profile Metadata */}
        <div className="flex flex-col gap-5 md:col-span-1">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-luxury-gold/40 bg-zinc-900 shadow-lg">
              <img 
                src={formData.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
                alt={formData.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <h3 className="font-serif text-base font-bold text-zinc-200 mt-4 truncate max-w-full">
              {formData.name || 'TechMaster'}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-luxury-gold" />
              <Badge variant="gold" className="text-[9px] uppercase font-mono tracking-wider py-0.5">
                {user.role || 'Super Admin'}
              </Badge>
            </div>

            <p className="text-[10px] text-zinc-550 font-mono mt-3 uppercase tracking-wider">
              Status: <span className="text-emerald-400 font-bold">Active</span>
            </p>

            <Button 
              onClick={logout} 
              variant="ghost" 
              className="w-full mt-6 flex items-center justify-center gap-2 border border-zinc-900/60 hover:bg-rose-950/25 hover:text-rose-455 text-zinc-400 text-xs font-semibold py-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> <span>Log Out of Session</span>
            </Button>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="flex flex-col gap-5 md:col-span-2">
          <Card className="border border-zinc-800/60 p-5 bg-zinc-950/20 text-left" title="Edit Profile Details">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Full Name *" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input 
                  label="Email Address *" 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Contact Phone *" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input 
                  label="Profile Avatar URL" 
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <Input 
                label="Billing / Headquarters Address" 
                textarea 
                rows={3} 
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="flex justify-end gap-2 border-t border-zinc-900 pt-4 mt-2">
                <Button type="submit" variant="primary" className="text-white font-semibold text-xs py-2.5 px-6 flex items-center gap-1.5" disabled={success}>
                  {success ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> <span>Profile Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> <span>Save Profile Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
