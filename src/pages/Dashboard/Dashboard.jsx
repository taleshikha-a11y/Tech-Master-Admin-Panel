import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TiltCard } from '../../components/ui/TiltCard';
import { Button } from '../../components/ui/Button';
import { 
  Users, Handshake, MessageSquare, Briefcase, Plus, Globe, 
  ArrowUpRight, ArrowDownRight, Settings, Sparkles, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const Dashboard = ({ setCurrentView }) => {
  const { db, notifications } = useDatabase();

  // Safe Fallback Calculations
  const collaborationCount = db?.collaborations?.length || 0;
  const pendingEnquiriesCount = db?.enquiries?.filter(e => e.status === 'Unread').length || 0;
  const portfolioCount = db?.portfolio?.length || db?.portfolioGallery?.length || 0;

  // Premium Dashboard Cards Metadata
  const stats = [
    {
      title: "Unique Visitors",
      value: "148.6K",
      change: "+12.4%",
      isPositive: true,
      desc: "Compared to last month",
      icon: Users,
      color: "from-amber-500/10 to-amber-500/20"
    },
    {
      title: "Brand Partners",
      value: collaborationCount.toString(),
      change: "+2 new",
      isPositive: true,
      desc: "Active partnerships",
      icon: Handshake,
      color: "from-emerald-500/10 to-emerald-500/20"
    },
    {
      title: "Pending Enquiries",
      value: pendingEnquiriesCount.toString(),
      change: "-5% response time",
      isPositive: true,
      desc: "Awaiting review",
      icon: MessageSquare,
      color: "from-blue-500/10 to-blue-500/20"
    },
    {
      title: "Completed Projects",
      value: portfolioCount.toString(),
      change: "+1 this quarter",
      isPositive: true,
      desc: "Delivered spaces",
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-500/20"
    }
  ];

  // Activities timeline data logs
  const activities = [
    { id: 1, text: "Hermès Summer Wear '26 campaign status updated to Active.", type: "campaign", time: "1 hour ago" },
    { id: 2, text: "Resume submission received from Rohan Varma (Editor).", type: "career", time: "4 hours ago" },
    { id: 3, text: "Vogue India brand collaboration logged into database.", type: "collab", time: "1 day ago" },
    { id: 4, text: "Blog published: 'The Art of Golden Ratios in Modern Luxury Branding'.", type: "blog", time: "2 days ago" },
  ];

  // Custom Recharts Luxury Tooltip Element
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950/95 backdrop-blur-md border border-zinc-800 p-3 rounded shadow-[0_0_15px_rgba(212,175,55,0.1)] text-left">
          <p className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} className="text-xs font-semibold mt-1" style={{ color: item.color || '#d4af37' }}>
              {item.name}: {item.value.toLocaleString()} visitors
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Dynamic Welcome Banner Area */}
      <div className="relative overflow-hidden rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800/80 bg-gradient-to-r from-zinc-950 to-zinc-900/40 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-luxury-gold/5 to-transparent pointer-events-none blur-xl" />
        <div className="z-10">
          <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-wide gold-text-gradient flex items-center gap-2">
            Welcome Back, TechMaster
            <Sparkles className="w-5 h-5 text-luxury-gold hidden sm:inline-block animate-pulse" />
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Your personal luxury brand workspace status is healthy. System operations and assets matrix run smoothly.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setCurrentView('faq-contact')} className="gap-2 border border-zinc-800 hover:border-zinc-700">
            <MessageSquare className="w-4 h-4" />
            <span>Enquiries</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => setCurrentView('blog')} className="gap-2">
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span className="text-white font-semibold">Write Blog</span>
          </Button>
        </div>
      </div>

      {/* Balanced Grid Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <TiltCard key={i} className="relative overflow-hidden group border border-zinc-800/60 bg-zinc-950/40 p-5 rounded-lg" maxTilt={8}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</span>
                  <span className="font-serif text-3xl font-medium text-zinc-100 tracking-wide mt-1">{stat.value}</span>
                </div>
                <div className={`p-2.5 rounded-md bg-gradient-to-br ${stat.color} border border-zinc-800/80`}>
                  <Icon className="w-4 h-4 text-luxury-gold" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-xs">
                <span className={`flex items-center gap-0.5 font-bold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-zinc-500 text-[11px]">{stat.desc}</span>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Analytics Matrix Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Audience Metrics */}
        <Card className="lg:col-span-2 flex flex-col border border-zinc-800/60 bg-zinc-950/20" title="Audience Analytics" subtitle="Traffic distribution over the last 7 days">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={db?.analytics?.traffic || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#161619" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Mobile" dataKey="mobile" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorMobile)" />
                <Area type="monotone" name="Desktop" dataKey="desktop" stroke="#a1a1aa" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDesktop)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic Platform Graph representation */}
        <Card className="flex flex-col border border-zinc-800/60 bg-zinc-950/20" title="Device Distribution" subtitle="Audience browser platform type">
          <div className="h-[200px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={db?.analytics?.devices || []} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161619" horizontal={false} />
                <XAxis type="number" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} width={60} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                <Bar dataKey="value" name="Share %" radius={[0, 4, 4, 0]}>
                  {(db?.analytics?.devices || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#d4af37'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around items-center mt-4 border-t border-zinc-900 pt-4 text-[11px] flex-wrap gap-2">
            {(db?.analytics?.devices || []).map((dev, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: dev.color }} />
                <span className="text-zinc-400 font-medium">{dev.name}</span>
                <span className="text-zinc-500 font-mono">({dev.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Ops & Active Logging Timeline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Control Operation Matrix Links */}
        <Card className="border border-zinc-800/60 bg-zinc-950/20" title="Quick Operations" subtitle="Shortcuts to frequent tasks">
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => setCurrentView('portfolio-gallery')}
              className="p-4 rounded-md border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <Briefcase className="w-5 h-5 text-zinc-400 group-hover:text-luxury-gold transition-colors" />
              <span className="text-xs text-zinc-300 font-medium">Add Project</span>
            </button>
            <button 
              onClick={() => setCurrentView('seo-management')}
              className="p-4 rounded-md border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <Globe className="w-5 h-5 text-zinc-400 group-hover:text-luxury-gold transition-colors" />
              <span className="text-xs text-zinc-300 font-medium">SEO Meta</span>
            </button>
            <button 
              onClick={() => setCurrentView('faq-contact')}
              className="p-4 rounded-md border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-luxury-gold transition-colors" />
              <span className="text-xs text-zinc-300 font-medium">Enquiries</span>
            </button>
            <button 
              onClick={() => setCurrentView('website-settings')}
              className="p-4 rounded-md border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/30 hover:border-luxury-gold/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <Settings className="w-5 h-5 text-zinc-400 group-hover:text-luxury-gold transition-colors" />
              <span className="text-xs text-zinc-300 font-medium">Settings</span>
            </button>
          </div>
        </Card>

        {/* Dynamic Activity Tracker Layout Logs */}
        <Card className="lg:col-span-2 border border-zinc-800/60 bg-zinc-950/20" title="Recent Management Logs" subtitle="Audit timeline of operations in this panel">
          <div className="flex flex-col gap-4 mt-4">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-4 items-start border-l border-zinc-800 pl-4 relative pb-2 transition-all hover:translate-x-0.5">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">{act.text}</p>
                  <span className="text-[9px] text-zinc-500 font-mono block mt-1 uppercase tracking-wider">{act.time}</span>
                </div>
                <Badge variant={act.type === 'campaign' ? 'gold' : act.type === 'career' ? 'info' : 'default'} className="text-[10px] tracking-wide scale-95 uppercase">
                  {act.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};