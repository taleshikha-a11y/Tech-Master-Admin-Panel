import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../utils/initialData';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('zenvora_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force fallback if blogs is empty or outdated (fewer than 6 posts)
        if (!parsed.blogs || parsed.blogs.length < 6) {
          parsed.blogs = initialData.blogs;
        }
        return parsed;
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

  // Sync Auth to localStorage
  useEffect(() => {
    localStorage.setItem('zenvora_auth', JSON.stringify(auth));
  }, [auth]);

  // Login handler
  const login = (email, password) => {
    // Check in database users table
    const usersList = db?.users || initialData?.users || [];
    const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      if (matchedUser.status === 'Suspended') {
        return { success: false, message: "This account has been suspended." };
      }
      // Simple mock password bypass or check if it matches 'admin123'
      if (password === 'admin123' || password === 'AkankshaDua2026') {
        const authData = { user: matchedUser, isLoggedIn: true };
        setAuth(authData);
        // Log last active update
        updateItem('users', matchedUser.id, { lastActive: new Date().toISOString() });
        return { success: true };
      }
      return { success: false, message: "Invalid password. (Use 'admin123' or 'AkankshaDua2026' for testing)" };
    }
    // Check default fallback admin
    if (email.toLowerCase() === 'admin@akankshadua.com' && (password === 'admin123' || password === 'AkankshaDua2026')) {
      const fallbackUser = {
        id: "usr-1",
        name: "Akanksha Dua",
        email: "admin@akankshadua.com",
        role: "Super Admin",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        status: "Active",
        lastActive: new Date().toISOString()
      };
      setAuth({ user: fallbackUser, isLoggedIn: true });
      return { success: true };
    }
    return { success: false, message: "User not found. Use 'admin@akankshadua.com' / 'admin123'" };
  };

  // Logout handler
  const logout = () => {
    setAuth({ user: null, isLoggedIn: false });
    localStorage.removeItem('zenvora_auth');
  };

  // Password change
  const changePassword = (currentPass, newPass) => {
    if (currentPass === 'admin123' || currentPass === 'AkankshaDua2026') {
      // Mock successful change
      return { success: true, message: "Password updated successfully." };
    }
    return { success: false, message: "Current password verification failed." };
  };

  // Forgot password mock
  const requestPasswordReset = (email) => {
    const matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser || email === 'admin@akankshadua.com') {
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

  // Update single object sections (Homepage, About, Settings, MissionVision)
  const updateSection = (sectionName, data) => {
    setDb(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        ...data
      }
    }));
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
      toggleStatus,
      updateSection,
      markNotificationRead,
      clearAllNotifications
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
