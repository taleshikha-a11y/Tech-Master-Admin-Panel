import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { 
  Settings, Key, ShieldCheck, AlertCircle, Save, 
  Globe, Mail, Share2, Server, HelpCircle
} from 'lucide-react';

export const WebsiteSettings = () => {
  const { db, updateSection, changePassword } = useDatabase();
  const settingsData = db.settings;

  const [activeTab, setActiveTab] = useState('general'); // general, security, smtp

  // Form states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // General settings update helper
  const handleGeneralChange = (key, val) => {
    updateSection('settings', { [key]: val });
  };

  const handleSocialChange = (key, val) => {
    const updatedSocials = { ...settingsData.socialLinks, [key]: val };
    updateSection('settings', { socialLinks: updatedSocials });
  };

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-luxury-gold" />
          Global Website Settings
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Configure branding logo keys, office contacts, social links, SMTP server parameters, and admin security credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-1 select-none">
        <button
          onClick={() => { setActiveTab('general'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'general' 
              ? 'border-luxury-gold text-luxury-gold' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          General Branding
        </button>
        <button
          onClick={() => { setActiveTab('security'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'security' 
              ? 'border-luxury-gold text-luxury-gold' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Security & Access Key
        </button>
        <button
          onClick={() => { setActiveTab('smtp'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'smtp' 
              ? 'border-luxury-gold text-luxury-gold' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          SMTP & Analytics
        </button>
      </div>

      {/* Panels */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Core branding */}
            <Card className="border border-zinc-800/60 p-5" title="Corporate Branding">
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
            <Card className="border border-zinc-800/60 p-5" title="Communications & Social Channels">
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
                  value={settingsData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                />
                <Input 
                  label="YouTube Channel link" 
                  value={settingsData.socialLinks.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                />
                <Input 
                  label="LinkedIn Profile link" 
                  value={settingsData.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                />
                <Input 
                  label="Pinterest Boards link" 
                  value={settingsData.socialLinks.pinterest}
                  onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                />
              </div>
            </Card>
          </div>

          {/* Maintenance Mode */}
          <div>
            <Card className="border border-zinc-800/60 p-5 h-fit" title="System Maintenance State">
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

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="max-w-xl">
          <Card className="border border-zinc-800/60 p-6" title="Reset Administrative Credentials">
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
                  <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5" />
                  <span className="text-xs text-rose-300">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span className="text-xs text-emerald-300">{successMsg}</span>
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full justify-center gap-2 mt-2" disabled={loading}>
                <Key className="w-4 h-4 text-black" />
                <span className="text-black">Update Access Credentials</span>
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* SMTP and Analytics settings */}
      {activeTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="border border-zinc-800/60 p-5" title="SMTP Mailing Server Configurations">
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

            <Card className="border border-zinc-800/60 p-5" title="Google Analytics Configurations">
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
            <Card className="border border-zinc-800/60 p-5 h-fit" title="System Check">
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
