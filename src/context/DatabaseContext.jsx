import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../utils/initialData';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('zenvora_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = {
          ...initialData,
          ...parsed,
          homepage: {
            ...initialData.homepage,
            ...(parsed.homepage || {})
          },
          about: {
            ...initialData.about,
            ...(parsed.about || {})
          },
          founderJourney: {
            ...initialData.founderJourney,
            ...(parsed.founderJourney || {})
          },
          missionVision: {
            ...initialData.missionVision,
            ...(parsed.missionVision || {})
          },
          whatWeDo: {
            ...initialData.whatWeDo,
            ...(parsed.whatWeDo || {})
          },
          servicesPage: {
            ...initialData.servicesPage,
            ...(parsed.servicesPage || {})
          },
          collaborationsPage: {
            ...initialData.collaborationsPage,
            ...(parsed.collaborationsPage || {})
          },
          campaignsPage: {
            ...initialData.campaignsPage,
            ...(parsed.campaignsPage || {})
          },
          launchesPage: {
            ...initialData.launchesPage,
            ...(parsed.launchesPage || {})
          },
          eventsPage: {
            ...initialData.eventsPage,
            ...(parsed.eventsPage || {})
          }
        };
        
        // On-the-fly sanitisation to ensure lists use native arrays and have unique IDs
        if (merged.servicesPage) {
          const cleanList = (list) => (list || []).map((item, idx) => ({
            ...item,
            id: item.id || `item-${Date.now()}-${idx}`,
            features: typeof item.features === 'string' ? item.features.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(item.features) ? item.features : []),
            benefits: typeof item.benefits === 'string' ? item.benefits.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(item.benefits) ? item.benefits : []),
            process: typeof item.process === 'string' ? item.process.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(item.process) ? item.process : []),
            gallery: typeof item.gallery === 'string' ? item.gallery.split(',').map(s => s.trim()).filter(Boolean).map(url => ({ url })) : (Array.isArray(item.gallery) ? item.gallery : [])
          }));
          
          merged.servicesPage.mainServices = cleanList(merged.servicesPage.mainServices);
          merged.servicesPage.advancedServices = cleanList(merged.servicesPage.advancedServices);
        }
        
        // On-the-fly sanitisation for collaborations schema alignment
        if (merged.collaborations) {
          merged.collaborations = merged.collaborations.map((item, idx) => ({
            ...item,
            id: item.id || `collab-${idx + 1}`,
            brandName: item.brandName || "Brand",
            campaignName: item.campaignName || "Campaign",
            logoUrl: item.logoUrl || "",
            bannerImageUrl: item.bannerImageUrl || item.logoUrl || "",
            collabType: item.collabType || "Campaign",
            status: item.status || (item.isActive !== false ? "Active" : "Inactive"),
            featured: item.featured !== undefined ? item.featured : (idx < 3),
            shortDesc: item.shortDesc || item.campaignDescription || "Description not provided.",
            reachMetric: item.reachMetric || (item.kpis?.[0]?.value || "1.2M"),
            impressionsMetric: item.impressionsMetric || (item.kpis?.[1]?.value || "3.4M"),
            engagementMetric: item.engagementMetric || (item.kpis?.[2]?.value || "4.8%"),
            conversionsMetric: item.conversionsMetric || (item.metrics?.split(',')?.[1]?.trim() || "+18%"),
            services: Array.isArray(item.services) ? item.services : ["Brand Strategy", "Cinematic Production", "Interactive Storytelling"],
            websiteUrl: item.websiteUrl || item.showcaseUrl || "",
            socialMediaUrl: item.socialMediaUrl || "",
            collabDate: item.collabDate || "2026-06-01",
            challenge: item.challenge || "Increase online reach and build brand affinity among HNW developer communities.",
            solution: item.solution || "Created a series of high-production cinematic developer guides and showcase configurators.",
            result: item.result || "Reached over 2M views with an engagement rate exceeding industry benchmarks.",
            testimonialContent: item.testimonialContent || "TechMaster's creative integration was stellar. We saw a substantial uplift in adoption and brand affinity.",
            clientName: item.clientName || "Sarah Jenkins",
            designation: item.designation || "Director of Marketing",
            galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : (item.productImages || []),
            videoUrl: item.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }));
        }

        // On-the-fly sanitisation for Contact, FAQ & SEO Arrays (Fixes object corruption)
        ['contactFormFields', 'contactCategoriesSetup', 'contactSocialLinksSetup', 'faqCategories', 'pageSEO'].forEach(key => {
          if (merged[key] && !Array.isArray(merged[key])) {
             merged[key] = Object.values(merged[key]);
             if (merged[key].length === 0) {
               merged[key] = initialData[key] || [];
             }
          }
        });
        
        if (merged.globalSEO?.socialLinks && !Array.isArray(merged.globalSEO.socialLinks)) {
           merged.globalSEO.socialLinks = Object.values(merged.globalSEO.socialLinks);
        }

        // Force fallback if blogs is empty or outdated (fewer than 6 posts)
        if (!merged.blogs || merged.blogs.length < 6) {
          merged.blogs = initialData.blogs;
        }
        return merged;
      } catch (e) {
        console.error("Failed to parse saved database, resetting.", e);
      }
    }
    return initialData;
  });

  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('zenvora_auth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth); // { user, isLoggedIn: true }
      } catch (e) {}
    }
    return { user: null, isLoggedIn: false };
  });

  const [notifications, setNotifications] = useState([
    { id: "not-1", text: "New booking enquiry from Gabriella Rossi (Dolce & Gabbana)", type: "enquiry", unread: true, time: "2 hours ago" },
    { id: "not-2", text: "Resume uploaded by Rohan Varma for Editor opening", type: "career", unread: true, time: "4 hours ago" },
    { id: "not-3", text: "System Auto-Backup completed successfully", type: "system", unread: false, time: "Yesterday" }
  ]);

  // Sync DB to localStorage
  useEffect(() => {
    localStorage.setItem('zenvora_db', JSON.stringify(db));
  }, [db]);

  const persistAuth = (nextAuth) => {
    setAuth(nextAuth);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenvora_auth', JSON.stringify(nextAuth));
    }
  };

  // Login handler
  const login = (email = 'admin@techmaster.com', password = 'admin123') => {
    const safeEmail = (email || 'admin@techmaster.com').toLowerCase();
    const safePassword = (password || 'admin123').toString();
    const validPasswords = ['admin123', 'TechMasterDua2026'];

    if (!validPasswords.includes(safePassword)) {
      return { success: false, message: 'Incorrect access key.' };
    }

    // Check in database users table
    const usersList = db?.users || initialData?.users || [];
    const matchedUser = usersList.find(u => u.email.toLowerCase() === safeEmail);
    if (matchedUser) {
      if (matchedUser.status === 'Suspended') {
        return { success: false, message: "This account has been suspended." };
      }
      const authData = { user: matchedUser, isLoggedIn: true };
      persistAuth(authData);
      try {
        updateItem('users', matchedUser.id, { lastActive: new Date().toISOString() });
      } catch (e) {
        console.error("Last active log skipped:", e);
      }
      return { success: true };
    }

    // Default fallback admin
    const fallbackUser = {
      id: "usr-1",
      name: "TechMaster",
      email: "admin@techmaster.com",
      role: "Super Admin",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      status: "Active",
      lastActive: new Date().toISOString()
    };
    persistAuth({ user: fallbackUser, isLoggedIn: true });
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    persistAuth({ user: null, isLoggedIn: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zenvora_auth');
    }
  };

  // Profile update handler
  const updateProfile = (updatedFields) => {
    setAuth(prev => {
      if (!prev.isLoggedIn || !prev.user) return prev;
      const updatedUser = { ...prev.user, ...updatedFields };
      return {
        ...prev,
        user: updatedUser
      };
    });
    // Also update in db.users list
    if (auth.user) {
      setDb(prev => {
        const list = prev.users || [];
        const updatedList = list.map(item => {
          if (item.id === auth.user.id) {
            return { ...item, ...updatedFields };
          }
          return item;
        });
        return {
          ...prev,
          users: updatedList
        };
      });
    }
  };

  // Password change
  const changePassword = (currentPass, newPass) => {
    if (currentPass === 'admin123' || currentPass === 'TechMasterDua2026') {
      // Mock successful change
      return { success: true, message: "Password updated successfully." };
    }
    return { success: false, message: "Current password verification failed." };
  };

  // Forgot password mock
  const requestPasswordReset = (email) => {
    const matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser || email === 'admin@techmaster.com') {
      return { success: true, message: "Reset link/code sent to your registered email address." };
    }
    return { success: false, message: "Email address not registered." };
  };

  // Generic CRUD: Add
  const addItem = (collection, item) => {
    setDb(prev => {
      const list = prev[collection] || [];
      const newItem = {
        id: `${collection.slice(0, 3)}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isActive: true,
        ...item
      };
      return {
        ...prev,
        [collection]: [newItem, ...list]
      };
    });
  };

  // Generic CRUD: Update
  const updateItem = (collection, id, updatedFields) => {
    setDb(prev => {
      const list = prev[collection] || [];
      const updatedList = list.map(item => {
        if (item.id === id) {
          return { ...item, ...updatedFields };
        }
        return item;
      });
      return {
        ...prev,
        [collection]: updatedList
      };
    });
  };

  // Generic CRUD: Delete
  const deleteItem = (collection, id) => {
    setDb(prev => {
      const list = prev[collection] || [];
      return {
        ...prev,
        [collection]: list.filter(item => item.id !== id)
      };
    });
  };

  // Delete Nested Item (Helper for Services)
  const deleteNestedItem = (sectionName, listKey, id) => {
    console.log("deleteNestedItem called for:", sectionName, listKey, id);
    setDb(prev => {
      const list = prev[sectionName]?.[listKey] || [];
      const updatedList = list.filter(item => String(item.id) !== String(id));
      console.log("deleteNestedItem original list length:", list.length, "updated list length:", updatedList.length);
      return {
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          [listKey]: updatedList
        }
      };
    });
  };

  // Quick Status Toggle
  const toggleStatus = (collection, id) => {
    setDb(prev => {
      const list = prev[collection] || [];
      const updatedList = list.map(item => {
        if (item.id === id) {
          // Check if it's resumes where status is text, or other items where status is boolean
          if (collection === 'resumes') {
            const nextStatus = item.status === 'New' ? 'Reviewed' : item.status === 'Reviewed' ? 'Rejected' : 'New';
            return { ...item, status: nextStatus };
          }
          if (collection === 'enquiries') {
            const nextStatus = item.status === 'Unread' ? 'Read' : 'Unread';
            return { ...item, status: nextStatus };
          }
          // Default: Boolean isActive toggle
          return { ...item, isActive: !item.isActive };
        }
        return item;
      });
      return {
        ...prev,
        [collection]: updatedList
      };
    });
  };

  const updateSection = (sectionName, data) => {
    console.log("updateSection called for section:", sectionName, "with data:", data);
    setDb(prev => {
      const isArray = Array.isArray(data);
      const nextState = {
        ...prev,
        [sectionName]: isArray ? data : {
          ...prev[sectionName],
          ...data
        }
      };
      console.log("Database nextState resolved to:", nextState);
      return nextState;
    });
  };

  // Mark notification as read
  const markNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DatabaseContext.Provider value={{
      db,
      auth,
      notifications,
      login,
      logout,
      changePassword,
      requestPasswordReset,
      addItem,
      updateItem,
      deleteItem,
      deleteNestedItem,
      toggleStatus,
      updateSection,
      updateProfile,
      markNotificationRead,
      clearAllNotifications
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
