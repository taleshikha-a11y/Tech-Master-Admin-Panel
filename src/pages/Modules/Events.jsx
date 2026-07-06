import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  Filter,
  X,
  Image,
  Video,
  Download
} from "lucide-react";

const defaultEvents = [
  {
    id: 1,
    title: "Luxury Product Launch",
    type: "Product Launch",
    date: "12 Aug 2026",
    time: "7:00 PM",
    venue: "The Oberoi Delhi",
    location: "Delhi",
    guests: 250,
    budget: "₹8,00,000",
    status: "Upcoming",
    coordinator: "Rahul Sharma",
    description:
      "Luxury product launch with influencers, media partners and VIP guests."
  },
  {
    id: 2,
    title: "Corporate Annual Meet",
    type: "Corporate Event",
    date: "22 Aug 2026",
    time: "10:00 AM",
    venue: "JW Marriott",
    location: "Mumbai",
    guests: 400,
    budget: "₹15,00,000",
    status: "Completed",
    coordinator: "Anjali Singh",
    description:
      "Annual corporate conference and award ceremony."
  },
  {
    id: 3,
    title: "Fashion Week",
    type: "Fashion Show",
    date: "4 Sept 2026",
    time: "6:00 PM",
    venue: "Grand Hyatt",
    location: "Jaipur",
    guests: 700,
    budget: "₹25,00,000",
    status: "Upcoming",
    coordinator: "Ritika Kapoor",
    description:
      "International Fashion Show."
  }
];
export default function Events(){
const [events,setEvents]=useState(defaultEvents);
const [activeTab,setActiveTab]=useState("Events");
const [search,setSearch]=useState("");
const [statusFilter,setStatusFilter]=useState("All");
const [showForm,setShowForm]=useState(false);
const [showView,setShowView]=useState(false);
const [selected,setSelected]=useState(null);
const [editId,setEditId]=useState(null);
const [form,setForm]=useState({
title:"",
type:"",
date:"",
time:"",
venue:"",
location:"",
guests:"",
budget:"",
coordinator:"",
status:"Upcoming",
description:""
});
const tabs=[
"Events",
"Workshops",
"Conferences",
"Gallery",
"Highlights"
];
const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};
const saveEvent=(e)=>{
e.preventDefault();
if(editId){
setEvents(events.map(item=>
item.id===editId
?{...item,...form}
:item
));
}else{
setEvents([
...events,
{
id:Date.now(),
...form
}
]);
}
setEditId(null);
setForm({
title:"",
type:"",
date:"",
time:"",
venue:"",
location:"",
guests:"",
budget:"",
coordinator:"",
status:"Upcoming",
description:""
});
setShowForm(false);
};
const deleteEvent=(id)=>{
setEvents(events.filter(item=>item.id!==id));
};
const filteredEvents=events.filter(item=>{
const matchSearch=item.title
.toLowerCase()
.includes(search.toLowerCase());
const matchStatus=
statusFilter==="All"
||
item.status===statusFilter;
return matchSearch && matchStatus;
});
return(
<div className="min-h-screen bg-black text-white p-8">
<div className="flex justify-between items-center mb-8">
<div>
<h1 className="text-2xl font-bold text-white-400">
Event Management
</h1>
<p className="text-gray-400 mt-2">
Manage all company events
</p>
</div>
<div className="flex gap-3">
<button className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-5 py-2.5 rounded-lg flex items-center gap-2 transition">
  <Download size={18}/>
  Export
</button>
<button
onClick={()=>{
setEditId(null);
setShowForm(true);
}}
className="bg-yellow-500 text-black px-5 py-3 rounded-xl flex items-center gap-2"
>
<Plus size={18}/>
Add Event
</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
  <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Total Events</p>
        <h2 className="text-3xl font-bold text-white mt-3">{events.length}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
        <Calendar size={20} />
      </div>
    </div>
  </motion.div>

  <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Upcoming</p>
        <h2 className="text-3xl font-bold text-green-400 mt-3">{events.filter(x=>x.status==="Upcoming").length}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
        <Calendar size={20} />
      </div>
    </div>
  </motion.div>

  <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Completed</p>
        <h2 className="text-3xl font-bold text-blue-400 mt-3">{events.filter(x=>x.status==="Completed").length}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
        <Calendar size={20} />
      </div>
    </div>
  </motion.div>

  <motion.div whileHover={{ y: -5 }} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Cancelled</p>
        <h2 className="text-3xl font-bold text-red-400 mt-3">{events.filter(x=>x.status==="Cancelled").length}</h2>
      </div>
      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
        <Calendar size={20} />
      </div>
    </div>
  </motion.div>
</div>
<div className="flex gap-3 mb-8">
{tabs.map(tab => (
  <button
    key={tab}
    onClick={() => setActiveTab(tab)}
    className={`px-5 py-2 rounded-xl transition ${activeTab === tab ? "bg-yellow-500 text-black" : "bg-zinc-900"}`}
  >
    {tab}
  </button>
))}
</div>
<div className="flex gap-4 mb-8">
<div className="relative flex-1">
<Search
className="absolute left-3 top-3 text-gray-400"
/>
<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search Event..."
className="w-full bg-zinc-900 pl-10 py-3 rounded-xl"/>
</div>
<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
className="bg-zinc-900 px-5 rounded-xl">
<option>All</option>
<option>Upcoming</option>
<option>Completed</option>
<option>Cancelled</option>
</select>
</div>
{activeTab === "Events" && (
<div className="overflow-x-auto rounded-xl bg-zinc-900 border border-zinc-800">
<table className="w-full">
<thead className="bg-zinc-900 border-b border-zinc-700">
  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
    <th className="p-4">Event</th>
    <th>Date</th>
    <th>Venue</th>
    <th>Guests</th>
    <th>Status</th>
    <th className="text-center">Actions</th>
  </tr>
</thead>
<tbody>
{filteredEvents.map((event)=>(
<tr
key={event.id}
className="border-b border-zinc-800 hover:bg-zinc-800 transition"
>
<td className="p-4">
<h3 className="font-semibold">
{event.title}
</h3>
<p className="text-gray-400 text-sm">
{event.type}
</p>
</td>
<td>
<div className="flex items-center gap-2">
<Calendar size={16}/>
{event.date}
</div>
<p className="text-xs text-gray-500">
{event.time}
</p>
</td>
<td>
<div className="flex items-center gap-2">
<MapPin size={16}/>
{event.location}
</div>
<p className="text-xs text-gray-500">
{event.venue}
</p>
</td>
<td>
<div className="flex items-center gap-2">
<Users size={16}/>
{event.guests}
</div>
</td>
<td>
<span
className={`px-3 py-1 rounded-full text-xs border
${
event.status==="Upcoming"
?"bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
:event.status==="Completed"
?"bg-blue-500/10 text-blue-400 border-blue-500/30"
:"bg-red-500/10 text-red-400 border-red-500/30"
}
`}
>
{event.status}
</span>
</td>
<td>
<div className="flex justify-center gap-2">
  <button onClick={()=>{ setSelected(event); setShowView(true); }} className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg">
    <Eye size={18} />
  </button>
  <button onClick={()=>{ setEditId(event.id); setForm({ title:event.title, type:event.type, date:event.date, time:event.time, venue:event.venue, location:event.location, guests:event.guests, budget:event.budget, coordinator:event.coordinator, status:event.status, description:event.description }); setShowForm(true); }} className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg">
    <Edit size={18} />
  </button>
  <button onClick={()=>deleteEvent(event.id)} className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg">
    <Trash2 size={18} />
  </button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}
<AnimatePresence>
{showView && selected && (
<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
>
<motion.div
initial={{scale:.8}}
animate={{scale:1}}
exit={{scale:.8}}
className="bg-zinc-900 rounded-2xl border border-yellow-500 w-[700px] p-8"
>
<div className="flex justify-between items-center mb-6">
<h2 className="text-3xl font-bold text-yellow-400">
Event Details
</h2>
<button
onClick={()=>setShowView(false)}
>
<X/>
</button>
</div>
<div className="grid grid-cols-2 gap-6">
<div>
<p className="text-gray-400">
Event Name
</p>
<h3 className="text-xl">
{selected.title}
</h3>
</div>
<div>
<p className="text-gray-400">
Type
</p>
<h3>
{selected.type}
</h3>
</div>
<div>
<p className="text-gray-400">
Date
</p>
<h3>
{selected.date}
</h3>
</div>
<div>
<p className="text-gray-400">
Time
</p>
<h3>
{selected.time}
</h3>
</div>
<div>
<p className="text-gray-400">
Venue
</p>
<h3>
{selected.venue}
</h3>
</div>
<div>
<p className="text-gray-400">
Location
</p>
<h3>
{selected.location}
</h3>
</div>
<div>
<p className="text-gray-400">
Guests
</p>
<h3>
{selected.guests}
</h3>
</div>
<div>
<p className="text-gray-400">
Budget
</p>
<h3>
{selected.budget}
</h3>
</div>
<div>
<p className="text-gray-400">
Coordinator
</p>
<h3>
{selected.coordinator}
</h3>
</div>
<div>
<p className="text-gray-400">
Status
</p>
<h3>
{selected.status}
</h3>
</div>
</div>
<div className="mt-6">
<p className="text-gray-400 mb-2">
Description
</p>
<p>
{selected.description}
</p>
</div>
<div className="mt-6 flex justify-end">
<button onClick={()=>setShowView(false)} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl">Close</button>
</div>
</motion.div>
</motion.div>
)}
</AnimatePresence>
<AnimatePresence>
{showForm&&(
<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
>
<motion.form
initial={{scale:.8}}
animate={{scale:1}}
exit={{scale:.8}}
onSubmit={saveEvent}
className="bg-zinc-900 border border-yellow-500 rounded-2xl w-[850px] p-8 max-h-[90vh] overflow-y-auto"
>
<div className="flex justify-between items-center mb-6">
<h2 className="text-3xl font-bold text-yellow-400">
{editId?"Update Event":"Add Event"}
</h2>
<button type="button" onClick={()=>setShowForm(false)}>
<X/>
</button>
</div>
<div className="grid grid-cols-2 gap-5">
<input
name="title"
value={form.title}
onChange={handleChange}
placeholder="Event Title"
className="bg-zinc-800 p-3 rounded-xl outline-none"
/>
<select
name="type"
value={form.type}
onChange={handleChange}
className="bg-zinc-800 p-3 rounded-xl"
>
<option value="">Select Type</option>
<option>Product Launch</option>
<option>Corporate Event</option>
<option>Fashion Show</option>
<option>Conference</option>
<option>Workshop</option>
<option>Meetup</option>
</select>
<input
type="date"
name="date"
value={form.date}
onChange={handleChange}
className="bg-zinc-800 p-3 rounded-xl"
/>
<input
type="time"
name="time"
value={form.time}
onChange={handleChange}
className="bg-zinc-800 p-3 rounded-xl"
/>
<input
name="venue"
value={form.venue}
onChange={handleChange}
placeholder="Venue"
className="bg-zinc-800 p-3 rounded-xl"
/>

<input
name="location"
value={form.location}
onChange={handleChange}
placeholder="City"
className="bg-zinc-800 p-3 rounded-xl"
/>

<input
name="guests"
value={form.guests}
onChange={handleChange}
placeholder="Guests"
className="bg-zinc-800 p-3 rounded-xl"
/>

<input
name="budget"
value={form.budget}
onChange={handleChange}
placeholder="Budget"
className="bg-zinc-800 p-3 rounded-xl"
/>

<input
name="coordinator"
value={form.coordinator}
onChange={handleChange}
placeholder="Coordinator"
className="bg-zinc-800 p-3 rounded-xl"
/>

<select
name="status"
value={form.status}
onChange={handleChange}
className="bg-zinc-800 p-3 rounded-xl"
>
<option>Upcoming</option>
<option>Completed</option>
<option>Cancelled</option>
</select>

<textarea
name="description"
value={form.description}
onChange={handleChange}
placeholder="Description"
rows={5}
className="col-span-2 bg-zinc-800 p-3 rounded-xl resize-none"
/>

<div className="col-span-2">
<label className="block mb-2">Banner Image</label>
<input type="file" className="w-full bg-zinc-800 rounded-xl p-3"/>
</div>

<div className="col-span-2">
<label className="block mb-2">Gallery Images</label>
<input type="file" multiple className="w-full bg-zinc-800 rounded-xl p-3"/>
</div>

<div className="col-span-2 flex justify-end gap-3">
<button
type="button"
onClick={()=>setShowForm(false)}
className="px-6 py-3 rounded-xl bg-gray-700"
>
Cancel
</button>

<button
type="submit"
className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold"
>
{editId?"Update Event":"Save Event"}
</button>
</div>

</div>

</motion.form>
</motion.div>
)}
</AnimatePresence>
{activeTab === "Workshops" && (
  <div className="bg-zinc-900 rounded-xl p-6">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-zinc-100">Workshops</h2>
      <button
        onClick={() => {
          setEditId(null);
          setForm({ title: "", type: "Workshop", date: "", time: "", venue: "", location: "", guests: "", budget: "", coordinator: "", status: "Upcoming", description: "" });
          setShowForm(true);
        }}
        className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl"
      >
        Add Workshop
      </button>
    </div>

    <table className="w-full">
      <thead className="bg-zinc-900 border-b border-zinc-700">
        <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
          <th className="p-4">Event</th>
          <th>Date</th>
          <th>Venue</th>
          <th>Guests</th>
          <th>Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>

        <tr className="border-b border-zinc-800">
          <td className="p-3">React Masterclass</td>
          <td>Rahul Sharma</td>
          <td>15 Aug 2026</td>
          <td>Delhi</td>
          <td>
            <span className="px-3 py-1 rounded-full text-xs border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Upcoming</span>
          </td>
          <td>
            <div className="flex gap-2">
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Eye size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Edit size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </td>
        </tr>

        <tr>
          <td className="p-3">Marketing Workshop</td>
          <td>Akash Verma</td>
          <td>20 Aug 2026</td>
          <td>Mumbai</td>
          <td>
            <span className="px-3 py-1 rounded-full text-xs border bg-blue-500/10 text-blue-400 border-blue-500/30">Completed</span>
          </td>
          <td>
            <div className="flex gap-2">
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Eye size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Edit size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
)}

{activeTab === "Conferences" && (
  <div className="bg-zinc-900 rounded-xl p-6">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-zinc-100">Conferences</h2>
      <button
        onClick={() => {
          setEditId(null);
          setForm({ title: "", type: "Conference", date: "", time: "", venue: "", location: "", guests: "", budget: "", coordinator: "", status: "Upcoming", description: "" });
          setShowForm(true);
        }}
        className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl"
      >
        Add Conference
      </button>
    </div>
    <table className="w-full">
      <thead>
        <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-sm">
          <th className="p-3 text-left font-medium">Event</th>
          <th className="p-3 text-left font-medium">Date</th>
          <th className="p-3 text-left font-medium">Venue</th>
          <th className="p-3 text-left font-medium">Location</th>
          <th className="p-3 text-left font-medium">Status</th>
          <th className="p-3 text-center font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-white/5 hover:bg-white/5 transition">
          <td className="p-3">
            <div>
              <p className="text-white text-sm font-medium">Luxury Product Launch</p>
              <p className="text-gray-500 text-xs">Product Launch</p>
            </div>
          </td>
          <td className="p-3 text-gray-300 text-sm">12 Aug 2026 <br /><span className="text-gray-500 text-xs">7:00 PM</span></td>
          <td className="p-3 text-gray-300 text-sm">Delhi <br /><span className="text-gray-500 text-xs">The Oberoi</span></td>
          <td className="p-3 text-gray-300 text-sm">250</td>
          <td className="p-3">
            <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Upcoming</span>
          </td>
          <td className="p-3 text-center">
            <div className="inline-flex gap-2 py-3">
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Eye size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Edit size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </td>
        </tr>
        <tr className="border-b border-white/5 hover:bg-white/5 transition">
          <td className="p-3">
            <div>
              <p className="text-white text-sm font-medium">Startup Expo</p>
              <p className="text-gray-500 text-xs">Product Launch</p>
            </div>
          </td>
          <td className="p-3 text-gray-300 text-sm">15 Aug 2026 <br /><span className="text-gray-500 text-xs">7:00 PM</span></td>
          <td className="p-3 text-gray-300 text-sm">Banglore <br /><span className="text-gray-500 text-xs">Priya Kapoor</span></td>
          <td className="p-3 text-gray-300 text-sm">150</td>
          <td className="p-3">
            <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Upcoming</span>
          </td>
          <td className="p-3 text-center">
            <div className="inline-flex gap-2 py-3">
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Eye size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Edit size={16} /></button>
              <button className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

{activeTab === "Gallery" && (
  <div className="grid md:grid-cols-3 gap-6">

    {events.map(item => (
      <div key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <img src={`https://picsum.photos/500/300?random=${item.id}`} className="w-full h-52 object-cover" />
        <div className="p-5">
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-gray-400 mt-2">{item.location}</p>
          <div className="flex justify-center gap-2">
            <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition">
              <Eye size={16} className="text-gray-300" />
            </button>

            <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition">
              <Edit size={16} className="text-gray-300" />
            </button>

            <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-red-900/20 transition">
              <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
            </button>

          </div>
        </div>
      </div>
    ))}

  </div>
)}
{activeTab === "Highlights" && (
  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-zinc-400">Total Revenue</h3>
      <h2 className="text-3xl font-bold text-white mt-2">₹48,00,000</h2>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-zinc-400">Total Guests</h3>
      <h2 className="text-3xl font-bold text-white mt-2">1350</h2>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-zinc-400">Upcoming Events</h3>
      <h2 className="text-3xl font-bold text-white mt-2">{events.filter(e => e.status === "Upcoming").length}</h2>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-zinc-400">Completed Events</h3>
      <h2 className="text-3xl font-bold text-white mt-2">{events.filter(e => e.status === "Completed").length}</h2>
    </div>

    <div className="lg:col-span-4 bg-zinc-900 rounded-xl p-6 mt-2">
      <h2 className="text-2xl font-bold text-zinc-100 mb-5">Event Highlights</h2>
      <div className="space-y-4">
        <div className="flex justify-between bg-zinc-800 rounded-lg p-4">
          <span>🏆 Best Product Launch</span>
          <span>Luxury Product Launch</span>
        </div>
        <div className="flex justify-between bg-zinc-800 rounded-lg p-4">
          <span>👑 Highest Attendance</span>
          <span>700 Guests</span>
        </div>
        <div className="flex justify-between bg-zinc-800 rounded-lg p-4">
          <span>💰 Highest Budget</span>
          <span>₹25,00,000</span>
        </div>
        <div className="flex justify-between bg-zinc-800 rounded-lg p-4">
          <span>⭐ Average Rating</span>
          <span>4.9 / 5</span>
        </div>
      </div>
    </div>
  </div>
)}
</div>
);
}