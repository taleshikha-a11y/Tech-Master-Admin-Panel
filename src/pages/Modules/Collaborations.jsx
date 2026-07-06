import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Handshake,
  Building2,
  Star,
  BarChart3,
  LayoutGrid,
  Table2,
  CheckCircle2,
  Globe,
  X,
  Calendar,
} from "lucide-react";

import { Button } from "../../components/ui/Button";

const Collaborations = ({
  itemsList = [],
  handleOpenAddForm,
  setDeleteId,
  setEditingItem,
  setShowFormModal,
}) => {

  /* ===========================
        STATES
  =========================== */

  const [viewItem, setViewItem] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [featuredFilter, setFeaturedFilter] = useState("All");

  const [viewMode, setViewMode] = useState("grid");

  /* ===========================
        DATA
  =========================== */

  const data = Array.isArray(itemsList)
    ? itemsList
    : [];

  /* ===========================
        FILTER
  =========================== */

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      const matchSearch =
        item.brandName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        item.campaignName
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All"
          ? true
          : item.status === statusFilter;

      const matchType =
        typeFilter === "All"
          ? true
          : item.collabType === typeFilter;

      const matchFeatured =
        featuredFilter === "All"
          ? true
          : featuredFilter === "Featured"
          ? item.featured
          : !item.featured;

      return (
        matchSearch &&
        matchStatus &&
        matchType &&
        matchFeatured
      );

    });

  }, [
    data,
    search,
    statusFilter,
    typeFilter,
    featuredFilter,
  ]);

  /* ===========================
        DASHBOARD DATA
  =========================== */

  const total = data.length;

  const activeBrands =
    data.filter(
      (item) => item.status === "Active"
    ).length;

  const featured =
    data.filter(
      (item) => item.featured
    ).length;

  const caseStudies =
    data.filter(
      (item) => item.challenge
    ).length;

  /* ===========================
        RETURN START
  =========================== */

  return (

    <div className="space-y-8">

      {/* PART 2 STARTS FROM HERE */}
            {/* ========================= HEADER ========================= */}

      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8">

        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-yellow-500/5 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10">

              <Handshake className="w-4 h-4 text-yellow-400" />

              <span className="text-xs uppercase tracking-[3px] text-yellow-400 font-semibold">
                Brand Management
              </span>

            </div>

            <h1 className="mt-6 text-2xl lg:text-2xl font-serif text-white">

              Brand <span className="text-yellow-400">Collaborations</span>

            </h1>

            <p className="mt-4 max-w-sm text-zinc-400 leading-7">

              Manage brand partnerships, campaigns, featured collaborations,
              success stories, client testimonials and performance reports
              from one dashboard.

            </p>

          </div>

          <div>

            <Button
              onClick={handleOpenAddForm}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />

              Add Collaboration

            </Button>

          </div>

        </div>

      </div>

      {/* ========================= DASHBOARD ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Total Collaborations"
          value={total}
          icon={<Handshake size={24} />}
        />

        <DashboardCard
          title="Active Brands"
          value={activeBrands}
          icon={<Building2 size={24} />}
        />

        <DashboardCard
          title="Featured Brands"
          value={featured}
          icon={<Star size={24} />}
        />

        <DashboardCard
          title="Case Studies"
          value={caseStudies}
          icon={<BarChart3 size={24} />}
        />

      </div>

      {/* ========================= FILTER BAR ========================= */}

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6">

        <div className="grid lg:grid-cols-6 gap-4">

          {/* Search */}

          <div className="lg:col-span-2 relative">

            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />

            <input
              type="text"
              placeholder="Search Brand or Campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:border-yellow-500 outline-none"
            />

          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white px-3"
          >

            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>

          </select>

          {/* Type */}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white px-3"
          >

            <option>All</option>
            <option>Campaign</option>
            <option>Promotion</option>
            <option>Event</option>

          </select>

          {/* Featured */}

          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white px-3"
          >

            <option>All</option>
            <option>Featured</option>
            <option>Normal</option>

          </select>

          {/* View Toggle */}

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setViewMode("grid")}
              className={`h-12 rounded-xl flex items-center justify-center transition ${
                viewMode === "grid"
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >

              <LayoutGrid size={20} />

            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`h-12 rounded-xl flex items-center justify-center transition ${
                viewMode === "table"
                  ? "bg-yellow-400 text-black"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >

              <Table2 size={20} />

            </button>

          </div>

        </div>

      </div>

      {/* PART 3 STARTS FROM HERE */}
      {/* ===================== GRID VIEW ===================== */}

{viewMode === "grid" && (

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

    {filteredData.length === 0 && (

      <div className="col-span-full rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center">

        <Handshake className="mx-auto w-14 h-14 text-yellow-400 mb-4" />

        <h3 className="text-2xl text-white font-serif">
          No Collaboration Found
        </h3>

        <p className="text-zinc-500 mt-3">
          Try changing filters or add a new collaboration.
        </p>

      </div>

    )}

    {filteredData.map((item) => (

      <motion.div
        key={item.id}
        whileHover={{ y: -8 }}
        transition={{ duration: .3 }}
        className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 hover:border-yellow-500/40 duration-300"
      >

        {/* Banner */}

        <div className="relative h-52 overflow-hidden">

          <img
            src={item.bannerImageUrl || item.logoUrl}
            alt=""
            className="w-full h-full object-cover hover:scale-110 duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"/>

          <div className="absolute top-4 left-4 flex gap-2">

            {item.featured && (

              <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-[11px] font-bold">

                Featured

              </span>

            )}

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                item.status === "Active"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {item.status}
            </span>

          </div>

        </div>

        {/* Body */}

        <div className="p-6">

          <div className="flex items-center gap-4">

            <img
              src={item.logoUrl}
              className="w-16 h-16 rounded-full border border-zinc-700 object-cover"
            />

            <div>

              <h3 className="text-xl text-white font-semibold">
                {item.brandName}
              </h3>

              <p className="text-zinc-500 text-sm">
                {item.campaignName}
              </p>

            </div>

          </div>

          <p className="mt-5 text-sm text-zinc-400 leading-7 line-clamp-3">

            {item.shortDesc}

          </p>

          {/* Metrics */}

          <div className="grid grid-cols-3 gap-3 mt-6">

            <div className="rounded-xl bg-zinc-900 p-3 text-center">

              <p className="text-[11px] text-zinc-500">
                Reach
              </p>

              <h4 className="text-white font-bold mt-1">
                {item.reachMetric}
              </h4>

            </div>

            <div className="rounded-xl bg-zinc-900 p-3 text-center">

              <p className="text-[11px] text-zinc-500">
                Engagement
              </p>

              <h4 className="text-white font-bold mt-1">
                {item.engagementMetric}
              </h4>

            </div>

            <div className="rounded-xl bg-zinc-900 p-3 text-center">

              <p className="text-[11px] text-zinc-500">
                Conversion
              </p>

              <h4 className="text-white font-bold mt-1">
                {item.conversionsMetric}
              </h4>

            </div>

          </div>

          {/* Services */}

          <div className="flex flex-wrap gap-2 mt-5">

            {(item.services || []).map((service, index) => (

              <span
                key={index}
                className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300"
              >
                {service}
              </span>

            ))}

          </div>

          {/* Website */}

          {item.websiteUrl && (

            <a
              href={item.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-yellow-400 text-sm"
            >

              <Globe size={16} />

              Visit Website

            </a>

          )}

          {/* Buttons */}

          <div className="grid grid-cols-3 gap-3 mt-7">

            <Button
              onClick={() => setViewItem(item)}
              className="bg-zinc-900 border border-zinc-700"
            >
              <Eye size={18}/>
            </Button>

            <Button
              onClick={() => {
                setEditingItem(item);
                setShowFormModal(true);
              }}
              className="bg-zinc-900 border border-zinc-700"
            >
              <Edit2 size={18}/>
            </Button>

            <Button
              onClick={() => setDeleteId(item.id)}
              className="bg-red-900/20 border border-red-700 text-red-400"
            >
              <Trash2 size={18}/>
            </Button>

          </div>

        </div>

      </motion.div>

    ))}

  </div>

)}
{/* ===================== TABLE VIEW ===================== */}

{viewMode === "table" && (

<div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">

<div className="overflow-x-auto">

<table className="w-full">

<thead className="bg-zinc-900 border-b border-zinc-800">

<tr className="text-left text-xs uppercase tracking-widest text-zinc-500">

<th className="px-6 py-5">Brand</th>

<th>Campaign</th>

<th>Type</th>

<th>Date</th>

<th>Status</th>

<th>Featured</th>

<th className="text-center">Actions</th>

</tr>

</thead>

<tbody>

{filteredData.length === 0 ? (

<tr>

<td
colSpan={7}
className="text-center py-16 text-zinc-500"
>

No Collaboration Found

</td>

</tr>

) : (

filteredData.map((item) => (

<tr
key={item.id}
className="border-b border-zinc-800 hover:bg-zinc-900/60 transition"
>

<td className="px-6 py-5">

<div className="flex items-center gap-4">

<img
src={item.logoUrl}
alt=""
className="w-14 h-14 rounded-full border border-zinc-700 object-cover"
/>

<div>

<h4 className="text-white font-semibold">

{item.brandName}

</h4>

<p className="text-zinc-500 text-xs">

{item.websiteUrl}

</p>

</div>

</div>

</td>

<td className="text-zinc-300">

{item.campaignName}

</td>

<td>

<span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-yellow-400">

{item.collabType}

</span>

</td>

<td className="text-zinc-400">

<div className="flex items-center gap-2">

<Calendar size={14}/>

{item.collabDate}

</div>

</td>

<td>

<span
className={`px-3 py-1 rounded-full text-xs font-semibold ${
item.status==="Active"
? "bg-green-600 text-white"
: "bg-red-600 text-white"
}`}
>

{item.status}

</span>

</td>

<td>

{item.featured ? (

<CheckCircle2
size={20}
className="text-yellow-400"
/>

) : (

<span className="text-zinc-600">
—
</span>

)}

</td>

<td>

<div className="flex justify-center gap-2">

<Button
onClick={()=>setViewItem(item)}
className="bg-zinc-900 border border-zinc-700"
>

<Eye size={16}/>

</Button>

<Button
onClick={()=>{
setEditingItem(item);
setShowFormModal(true);
}}
className="bg-zinc-900 border border-zinc-700"
>

<Edit2 size={16}/>

</Button>

<Button
onClick={()=>setDeleteId(item.id)}
className="bg-red-900/20 border border-red-700 text-red-400"
>

<Trash2 size={16}/>

</Button>

</div>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

)}
{/* ===================== VIEW MODAL ===================== */}

<AnimatePresence>

  {viewItem && (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg overflow-y-auto"
    >

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: .35 }}
        className="max-w-7xl mx-auto p-6 lg:p-10"
      >

        {/* Close */}

        <div className="flex justify-end mb-5">

          <button
            onClick={() => setViewItem(null)}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 hover:border-yellow-400 duration-300 flex items-center justify-center"
          >

            <X className="w-5 h-5 text-white" />

          </button>

        </div>

        {/* Banner */}

        <div className="relative rounded-3xl overflow-hidden border border-zinc-800">

          <img
            src={viewItem.bannerImageUrl || viewItem.logoUrl}
            alt=""
            className="w-full h-[420px] object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-8 left-8 flex items-center gap-5">

            <img
              src={viewItem.logoUrl}
              alt=""
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />

            <div>

              <h1 className="text-5xl font-serif text-white">

                {viewItem.brandName}

              </h1>

              <p className="text-zinc-300 mt-2">

                {viewItem.campaignName}

              </p>

              <div className="flex gap-3 mt-4">

                <span className="px-4 py-1 rounded-full bg-yellow-400 text-black font-semibold">

                  {viewItem.collabType}

                </span>

                <span
                  className={`px-4 py-1 rounded-full ${
                    viewItem.status === "Active"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >

                  {viewItem.status}

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Overview */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          <div className="lg:col-span-2 rounded-3xl bg-zinc-950 border border-zinc-800 p-8">

            <h2 className="text-2xl font-serif text-white mb-5">

              Collaboration Overview

            </h2>

            <p className="text-zinc-400 leading-8">

              {viewItem.shortDesc}

            </p>

          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-8">

            <h3 className="text-white font-semibold mb-6">

              Quick Details

            </h3>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-zinc-500">
                  Campaign
                </span>

                <span className="text-white">
                  {viewItem.campaignName}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-500">
                  Date
                </span>

                <span className="text-white">
                  {viewItem.collabDate}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-500">
                  Website
                </span>

                <a
                  href={viewItem.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-400"
                >

                  Visit

                </a>

              </div>

            </div>

          </div>

        </div>
                {/* ================= SUCCESS METRICS ================= */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Reach
            </p>
            <h2 className="text-3xl font-bold text-white mt-3">
              {viewItem.reachMetric || "0"}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Impressions
            </p>
            <h2 className="text-3xl font-bold text-white mt-3">
              {viewItem.impressionsMetric || "0"}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Engagement
            </p>
            <h2 className="text-3xl font-bold text-white mt-3">
              {viewItem.engagementMetric || "0"}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Conversion
            </p>
            <h2 className="text-3xl font-bold text-white mt-3">
              {viewItem.conversionsMetric || "0"}
            </h2>
          </div>

        </div>

        {/* ================= CASE STUDY ================= */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">

            <h3 className="text-yellow-400 font-semibold mb-4">
              Challenge
            </h3>

            <p className="text-zinc-400 leading-7">
              {viewItem.challenge || "-"}
            </p>

          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">

            <h3 className="text-yellow-400 font-semibold mb-4">
              Solution
            </h3>

            <p className="text-zinc-400 leading-7">
              {viewItem.solution || "-"}
            </p>

          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">

            <h3 className="text-yellow-400 font-semibold mb-4">
              Result
            </h3>

            <p className="text-zinc-400 leading-7">
              {viewItem.result || "-"}
            </p>

          </div>

        </div>

        {/* ================= TESTIMONIAL ================= */}

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

          <h2 className="text-2xl font-serif text-white mb-6">
            Client Testimonial
          </h2>

          <p className="italic text-zinc-300 text-lg leading-8">
            "{viewItem.testimonialContent}"
          </p>

          <div className="mt-6">

            <h4 className="text-white font-semibold">
              {viewItem.clientName}
            </h4>

            <p className="text-zinc-500">
              {viewItem.designation}
            </p>

          </div>

        </div>

        {/* ================= GALLERY ================= */}

        {(viewItem.galleryImages || []).length > 0 && (

          <div className="mt-8">

            <h2 className="text-2xl font-serif text-white mb-6">
              Gallery
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

              {viewItem.galleryImages.map((img, index) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  className="rounded-2xl border border-zinc-800 h-60 w-full object-cover hover:scale-105 duration-300"
                />

              ))}

            </div>

          </div>

        )}
                {/* ================= CAMPAIGN VIDEO ================= */}

        {viewItem.videoUrl && (

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-serif text-white mb-6">
              Campaign Video
            </h2>

            <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-800">

              <iframe
                src={viewItem.videoUrl}
                title="Campaign Video"
                className="w-full h-full"
                allowFullScreen
              />

            </div>

          </div>

        )}

        {/* ================= SERVICES ================= */}

        {(viewItem.services || []).length > 0 && (

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-serif text-white mb-6">
              Services Provided
            </h2>

            <div className="flex flex-wrap gap-3">

              {viewItem.services.map((service, index) => (

                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-300"
                >
                  {service}
                </span>

              ))}

            </div>

          </div>

        )}

        {/* ================= SOCIAL LINKS ================= */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">

            <h3 className="text-xl font-semibold text-white mb-4">
              Website
            </h3>

            <a
              href={viewItem.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-yellow-400 break-all hover:underline"
            >
              {viewItem.websiteUrl || "-"}
            </a>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7">

            <h3 className="text-xl font-semibold text-white mb-4">
              Social Media
            </h3>

            <a
              href={viewItem.socialMediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-yellow-400 break-all hover:underline"
            >
              {viewItem.socialMediaUrl || "-"}
            </a>

          </div>

        </div>

        {/* ================= PARTNERSHIP TIMELINE ================= */}

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

          <h2 className="text-2xl font-serif text-white mb-8">
            Partnership Journey
          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            {[
              "Discussion",
              "Planning",
              "Execution",
              "Results",
            ].map((step, index) => (

              <div
                key={index}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-center"
              >

                <div className="w-14 h-14 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center mx-auto mb-4">

                  {index + 1}

                </div>

                <h4 className="text-white font-semibold">

                  {step}

                </h4>

              </div>

            ))}

          </div>

        </div>

      </motion.div>

    </motion.div>

  )}

</AnimatePresence>

</div>

);

};

/* ================= DASHBOARD CARD ================= */

const DashboardCard = ({ title, value, icon }) => (

  <motion.div
    whileHover={{ y: -5 }}
    className="rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl p-6"
  >

    <div className="flex items-center justify-between">

      <div>

        <p className="text-xs uppercase tracking-widest text-zinc-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold text-white mt-3">
          {value}
        </h2>

      </div>

      <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">

        {icon}

      </div>

    </div>

  </motion.div>

);

export default Collaborations;