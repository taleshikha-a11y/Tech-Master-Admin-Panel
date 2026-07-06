import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, Edit2, Trash2, Layers } from "lucide-react";

const dummyServices = [
  {
    id: 1,
    title: "Luxury Brand Strategy",
    category: "Branding",
    desc: "We craft premium brand identity systems, positioning strategy, and visual storytelling that elevate your brand into a luxury market presence.",
  },
  {
    id: 2,
    title: "Social Media Growth Engine",
    category: "Digital Marketing",
    desc: "High-performance social media scaling system with content strategy, engagement optimization, and audience targeting for explosive growth.",
  },
  {
    id: 3,
    title: "Website UI/UX Design",
    category: "Design",
    desc: "Modern, conversion-focused UI/UX design systems with luxury aesthetics, smooth interactions, and user-centric architecture.",
  },
  {
    id: 4,
    title: "Campaign & Launch Strategy",
    category: "Marketing",
    desc: "End-to-end product launch planning including creative campaigns, influencer integration, and market execution strategy.",
  },
  {
    id: 5,
    title: "Content Production Studio",
    category: "Media",
    desc: "High-quality content creation including reels, brand shoots, storytelling videos, and luxury visual production.",
  },
];  

const featureToSection = {
  "Service List": "serviceList",
  "What We Do": "whatWeDo",
  "Categories": "categories",
  "Service Gallery": "gallery",
  "Process": "process",
};

export default function Services({ activeSubFeature }) {

  const [activeSection, setActiveSection] = useState("serviceList");
  const [services, setServices] = useState(dummyServices);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "",
  });

  useEffect(() => {
    if (activeSubFeature) {
      const section = featureToSection[activeSubFeature];
      if (section) setActiveSection(section);
    }
  }, [activeSubFeature]);

  const resetForm = () => {
    setFormData({ title: "", desc: "", category: "" });
    setEditing(null);
  };

  const handleSave = () => {
    if (editing) {
      // UPDATE
      setServices((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      // ADD
      setServices([
        ...services,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen p-8 text-white bg-black">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-serif text-yellow-400">
          Services CMS
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {services.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.01 }}
            className="flex justify-between items-center p-5 rounded-xl bg-zinc-900 border border-zinc-800"
          >

            <div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-zinc-400 text-sm">{s.desc}</p>
              <span className="text-xs text-yellow-400">
                {s.category}
              </span>
            </div>

            <div className="flex gap-2">

              {/* VIEW */}
              <button
                onClick={() => setViewItem(s)}
                className="p-2 bg-zinc-800 rounded"
              >
                <Eye size={16} />
              </button>

              {/* EDIT */}
              <button
                onClick={() => {
                  setEditing(s);
                  setFormData({
                    title: s.title,
                    desc: s.desc,
                    category: s.category,
                  });
                  setShowForm(true);
                }}
                className="p-2 bg-zinc-800 rounded"
              >
                <Edit2 size={16} />
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 bg-red-700 rounded"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </motion.div>
        ))}

      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-[420px] p-6 rounded-2xl bg-zinc-900 border border-yellow-500/20">

              <h2 className="text-xl text-yellow-400 mb-4">
                {editing ? "Edit Service" : "Add Service"}
              </h2>

              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-3 mb-3 bg-zinc-800 rounded"
              />

              <input
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                placeholder="Description"
                className="w-full p-3 mb-3 bg-zinc-800 rounded"
              />

              <input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Category"
                className="w-full p-3 mb-4 bg-zinc-800 rounded"
              />

              <button
                onClick={handleSave}
                className="w-full py-3 bg-yellow-400 text-black rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="w-full mt-2 text-zinc-400 text-sm"
              >
                Cancel
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewItem && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-[400px] p-6 rounded-2xl bg-zinc-900 border border-yellow-500/20">

              <h2 className="text-xl text-yellow-400 mb-3">
                {viewItem.title}
              </h2>

              <p className="text-zinc-400 mb-2">
                {viewItem.desc}
              </p>

              <span className="text-yellow-400 text-sm">
                {viewItem.category}
              </span>

              <button
                onClick={() => setViewItem(null)}
                className="w-full mt-5 py-2 bg-yellow-400 text-black rounded-lg"
              >
                Close
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}