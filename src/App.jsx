import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { MediaProvider } from './context/MediaContext';
import { Layout } from './components/Layout';
import { AuthContainer } from './pages/Auth/AuthContainer';
import { Dashboard } from './pages/Dashboard/Dashboard';

// Modules
import { Homepage } from './pages/Modules/Homepage';
import { About } from './pages/Modules/About';
import { FounderJourney } from './pages/Modules/FounderJourney';
import { MissionVision } from './pages/Modules/MissionVision';
import { Careers } from './pages/Modules/Careers';
import { FAQContact } from './pages/Modules/FAQContact';
import { Analytics } from './pages/Modules/Analytics';
import { WebsiteSettings } from './pages/Modules/WebsiteSettings';
import { GenericCRUD } from './pages/Modules/GenericCRUD';
import Collaborations from './pages/Modules/Collaborations';
import { Campaigns } from './pages/Modules/Campaigns';
import { MediaCoverage } from './pages/Modules/MediaCoverage';
import { Blogs } from './pages/Modules/Blogs';
import { SEOManagement } from './pages/Modules/SEOManagement';
import { UserManagement } from './pages/Modules/UserManagement';
import { AdminProfile } from './pages/Modules/AdminProfile';
import { WhatWeDo } from './pages/Modules/WhatWeDo';
import { Testimonials } from './pages/Modules/Testimonials';
import { Portfolio } from './pages/Modules/Portfolio';
import Events from './pages/Modules/Events';
import { FAQ } from './pages/Modules/FAQ';
import { Contact } from './pages/Modules/Contact';

import { schemas } from './utils/schemas';
import Services from './pages/Modules/Services';

function AppContent() {
  const context = useDatabase();
  const { auth, db } = context || { auth: { isLoggedIn: false }, db: {} }; // avoid crashes if provider is missing

  const [currentView, setCurrentView] = useState('dashboard');
  const isAuthenticated = Boolean(auth?.isLoggedIn || JSON.parse(localStorage.getItem('zenvora_auth') || '{}')?.isLoggedIn);



  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={() => setCurrentView('dashboard')} />;
  }

  const renderView = () => {
    switch (currentView) {

      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;

      case 'homepage':
        return <Homepage setCurrentView={setCurrentView} />;

      case 'about':
        return <About />;

      case 'founder-journey':
        return <FounderJourney />;

      case 'mission-vision':
        return <MissionVision />;

      case 'what-we-do':
        return <WhatWeDo />;

      case 'services':
        return <Services />;

   // App.jsx mein ye case add karein
case 'career': 
case 'job-openings':
case 'resume-management':
  return <Careers/>; // Agar aapne Careers component banaya hai toh <Careers /> likhein

      case 'enquiries':
      case 'faq-contact':
        return <FAQContact setCurrentView={setCurrentView} />;

      case 'faq':
        return <FAQ />;

      case 'contact':
        return <Contact />;

      case 'analytics':
        return <Analytics />;

      case 'settings':
      case 'website-settings':
        return <WebsiteSettings setCurrentView={setCurrentView} />;

      // ✅ FIXED COLLABORATIONS
      case 'brand-collaborations':
        return <Collaborations />;

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

      case 'portfolio':
              return <Portfolio />;


      case 'media-coverage':
        return <MediaCoverage />;

      case 'testimonials':
        return <Testimonials />;
        

      case 'blog':
        return <Blogs />;

      case 'seo':
      case 'seo-management':
        return <SEOManagement />;

      case 'users':
      case 'user-management':
        return <UserManagement />;

      case 'profile':
        return <AdminProfile />;

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
    </>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <MediaProvider>
        <AppContent />
      </MediaProvider>
    </DatabaseProvider>
  );
}

export default App;