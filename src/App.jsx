import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Layout } from './components/Layout';
import { AuthContainer } from './pages/Auth/AuthContainer';
import { Dashboard } from './pages/Dashboard/Dashboard';

// Modules
import { Homepage } from './pages/Modules/Homepage';
import { About } from './pages/Modules/About';
import { FounderJourney } from './pages/Modules/FounderJourney';
import { MissionVision } from './pages/Modules/MissionVision';
import { Careers } from './pages/Modules/Careers';
import { ContactEnquiries } from './pages/Modules/ContactEnquiries';
import { Analytics } from './pages/Modules/Analytics';
import { WebsiteSettings } from './pages/Modules/WebsiteSettings';
import { GenericCRUD } from './pages/Modules/GenericCRUD';
import Collaborations from './pages/Modules/Collaborations';
import { Campaigns } from './pages/Modules/Campaigns';
import { MediaCoverage } from './pages/Modules/MediaCoverage';
import { Blogs } from './pages/Modules/Blogs';
import { Testimonials } from './pages/Modules/Testimonials';
import { Gallery } from './pages/Modules/Gallery';
import { Portfolio } from './pages/Modules/Portfolio';
import Events from './pages/Modules/Events';

import { schemas } from './utils/schemas';
import Services from './pages/Modules/Services';

function AppContent() {
  const context = useDatabase();
  const { auth, db } = context || { auth: { isLoggedIn: false }, db: {} }; // avoid crashes if provider is missing

  const [currentView, setCurrentView] = useState('dashboard');

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  if (!auth.isLoggedIn) {
    return <AuthContainer />;
  }

  const renderView = () => {
    switch (currentView) {

      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;

      case 'homepage':
        return <Homepage />;

      case 'about':
        return <About />;

      case 'founder-journey':
        return <FounderJourney />;

      case 'mission-vision':
        return <MissionVision />;

      case 'services':
        return <Services />;

   // App.jsx mein ye case add karein
case 'career': 
case 'job-openings':
case 'resume-management':
  return <Careers/>; // Agar aapne Careers component banaya hai toh <Careers /> likhein

      case 'enquiries':
        return <ContactEnquiries />;

      case 'analytics':
        return <Analytics />;

      case 'settings':
        return <WebsiteSettings />;

      // ✅ FIXED COLLABORATIONS
      case 'brand-collaborations':
        return (
          <Collaborations
            itemsList={db?.collaborations || []}   // ✅ safe fallback
            handleOpenAddForm={() => setShowFormModal(true)}
            setDeleteId={setDeleteId}
            setEditingItem={setEditingItem}
            setShowFormModal={setShowFormModal}
          />
        );

      // ❌ FIXED TYPO (Campaigns)
      case 'campaign-product':
        return <Campaigns />;

      case 'product-launches':
        return (
          <GenericCRUD
            collection="launches"
            title="Product Launches"
            schema={schemas.launches}
          />
        );

case 'events':
  return <Events />;

      case 'portfolio-gallery':
        return <Portfolio />;

      case 'gallery':
        return <Gallery />;

      case 'media-coverage':
        return <MediaCoverage />;

      case 'testimonials':
        return <Testimonials />;
        

      case 'blog':
        return <Blogs />;

      case 'seo':
        return (
          <GenericCRUD
            collection="seo"
            title="SEO Page Settings"
            schema={schemas.seo}
          />
        );

      case 'users':
        return (
          <GenericCRUD
            collection="users"
            title="Administrative Access Accounts"
            schema={schemas.users}
          />
        );

      default:
        return (
          <div className="text-center p-12">
            <h2 className="text-xl font-serif text-zinc-400">
              Module Under Construction
            </h2>
            <p className="text-xs text-zinc-500 mt-2">
              The selected administrative module is loading shortly.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        {renderView()}
      </Layout>

      {/* ✅ SIMPLE MODAL FIX (so Add button works) */}
     {showFormModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-zinc-900 p-6 rounded-xl w-[500px] text-white">

      <h2 className="text-lg mb-5 font-semibold">
        {editingItem ? "Edit Collaboration" : "Add Collaboration"}
      </h2>

      {/* Brand Name */}
      <input
        type="text"
        placeholder="Brand Name"
        defaultValue={editingItem?.brandName || ""}
        className="w-full mb-3 p-2 bg-zinc-800 rounded outline-none"
      />

      {/* Campaign Name */}
      <input
        type="text"
        placeholder="Campaign Name"
        defaultValue={editingItem?.campaignName || ""}
        className="w-full mb-3 p-2 bg-zinc-800 rounded outline-none"
      />

      {/* Description */}
      <textarea
        placeholder="Short Description"
        defaultValue={editingItem?.shortDesc || ""}
        className="w-full mb-3 p-2 bg-zinc-800 rounded outline-none"
      />

      {/* Status */}
      <select
        defaultValue={editingItem?.status || "Active"}
        className="w-full mb-5 p-2 bg-zinc-800 rounded outline-none"
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
            setShowFormModal(false);
            setEditingItem(null);
          }}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log("SAVE CLICKED");

            // yaha tum save logic lagaoge later
            setShowFormModal(false);
            setEditingItem(null);
          }}
          className="px-4 py-2 bg-yellow-400 text-black rounded"
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}
    </>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;