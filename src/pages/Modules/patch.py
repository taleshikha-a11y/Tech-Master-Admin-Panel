import re

file_path = 'C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/FounderJourney.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { useDatabase } from '../../context/DatabaseContext';", "import { useEffect } from 'react';\nimport { getFounderJourneySettings, updateFounderJourneySettings, getFounderJourneyItems, createFounderJourneyItem, updateFounderJourneyItem, deleteFounderJourneyItem, toggleFounderJourneyItemStatus, publishFounderJourneyLive } from '../../Services/founderJourneyServices';")

# 2. Component init
init_old = '''export const FounderJourney = () => {
  const { db, updateSection } = useDatabase();
  const journeyData = db?.founderJourney || {};'''
init_new = '''export const FounderJourney = () => {
  const [journeyData, setJourneyData] = useState({});

  const fetchAll = async () => {
    try {
      const settingsRes = await getFounderJourneySettings();
      const itemsRes = await getFounderJourneyItems();
      const settings = settingsRes.data || {};
      const items = itemsRes.data || [];
      const newData = { ...settings };
      items.forEach(item => {
        if (!newData[item.type]) newData[item.type] = [];
        newData[item.type].push(item);
      });
      // Sort items by order
      Object.keys(newData).forEach(key => {
        if (Array.isArray(newData[key])) {
            newData[key].sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      });
      setJourneyData(newData);
      setHeroForm(newData.hero || {});
      setSettingsForm(newData.timelineSettings || {});
      setVisionForm(newData.futureVision || {});
      setSeoForm(newData.seo || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);'''
content = content.replace(init_old, init_new)

# 3. handleSingleSave
save_old = '''  const handleSingleSave = (sectionKey, data) => {
    updateSection('founderJourney', { [sectionKey]: data });
    showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
  };'''
save_new = '''  const handleSingleSave = async (sectionKey, data) => {
    try {
      await updateFounderJourneySettings({ [sectionKey]: data });
      showToast(`${sectionKey.toUpperCase()} section parameters updated successfully.`);
      fetchAll();
    } catch (err) {}
  };'''
content = content.replace(save_old, save_new)

# 4. updateSectionMeta
meta_old = '''  const updateSectionMeta = (secId, key, val) => {
    const currentSettings = journeyData.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    updateSection('founderJourney', { sectionSettings: updatedSettings });
    // Silent update, no toast notifications popped up!
  };'''
meta_new = '''  const updateSectionMeta = async (secId, key, val) => {
    const currentSettings = journeyData.sectionSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [secId]: {
        ...(currentSettings[secId] || { order: 1, status: "Active" }),
        [key]: val
      }
    };
    try {
      await updateFounderJourneySettings({ sectionSettings: updatedSettings });
      fetchAll();
    } catch (err) {}
  };'''
content = content.replace(meta_old, meta_new)

# 5. List Manager Saves
list_save_old = '''    const handleSaveItem = () => {
      let nextList = [];
      if (editingItemId) {
        nextList = listData.map(item => item.id === editingItemId ? { ...item, ...draftItem } : item);
        showToast("Item updated successfully.");
      } else {
        const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
        nextList = [...listData, newItem];
        showToast("New item created.");
      }
      updateSection('founderJourney', { [sectionKey]: nextList });
      setActiveEditorSection(null);
      setEditingItemId(null);
      setDraftItem({});
    };'''
list_save_new = '''    const handleSaveItem = async () => {
      try {
        if (editingItemId) {
          await updateFounderJourneyItem(editingItemId, { ...draftItem, type: sectionKey });
          showToast("Item updated successfully.");
        } else {
          await createFounderJourneyItem({ ...draftItem, type: sectionKey, status: draftItem.status || 'Active', order: listData.length + 1 });
          showToast("New item created.");
        }
        fetchAll();
        setActiveEditorSection(null);
        setEditingItemId(null);
        setDraftItem({});
      } catch (err) {
        showToast("Error saving item", "error");
      }
    };'''
content = content.replace(list_save_old, list_save_new)

# 6. List Manager Delete
del_old = '''    const handleDeleteItem = (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const nextList = listData.filter(item => item.id !== id);
        updateSection('founderJourney', { [sectionKey]: nextList });
        showToast("Item deleted.");
      }
    };'''
del_new = '''    const handleDeleteItem = async (id) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await deleteFounderJourneyItem(id);
          showToast("Item deleted.");
          fetchAll();
        } catch(err){}
      }
    };'''
content = content.replace(del_old, del_new)

# 7. List Manager Toggle Status
tog_old = '''    const handleToggleStatus = (id, currentStatus) => {
      const nextList = listData.map(item => item.id === id ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);
      updateSection('founderJourney', { [sectionKey]: nextList });
      // Silent update on toggle switch, no notifications popped up!
    };'''
tog_new = '''    const handleToggleStatus = async (id, currentStatus) => {
      try {
        await toggleFounderJourneyItemStatus(id);
        fetchAll();
      } catch(err){}
    };'''
content = content.replace(tog_old, tog_new)

# 8. List Manager Move (Optional: just refresh after move)
mov_old = '''    const handleMoveItem = (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        updateSection('founderJourney', { [sectionKey]: nextList });
      }
    };'''
mov_new = '''    const handleMoveItem = async (index, direction) => {
      const nextList = [...listData];
      const target = index + direction;
      if (target >= 0 && target < nextList.length) {
        const temp = nextList[index];
        nextList[index] = nextList[target];
        nextList[target] = temp;
        // update orders
        nextList.forEach((it, idx) => it.order = idx + 1);
        try {
           for (const it of nextList) {
               await updateFounderJourneyItem(it._id || it.id, { order: it.order, type: sectionKey });
           }
           fetchAll();
        } catch(err){}
      }
    };'''
content = content.replace(mov_old, mov_new)

# 9. List Items Rendering - Fix item.id to item._id in mapped elements
content = content.replace('item.id', '(item._id || item.id)')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
