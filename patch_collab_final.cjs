const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Modules/Collaborations.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes("import * as api from '../../Services/collabrationServices';")) {
  content = content.replace(
    "import { useDatabase } from '../../context/DatabaseContext';",
    "import { useDatabase } from '../../context/DatabaseContext';\nimport * as api from '../../Services/collabrationServices';"
  );
}

// 1. Fix handleSingleSave
const handleSingleSaveStart = content.indexOf("const handleSingleSave = (sectionKey, data) => {");
if (handleSingleSaveStart !== -1) {
  const handleSingleSaveEnd = content.indexOf("};", handleSingleSaveStart) + 2;
  const newHandleSingleSave = `const handleSingleSave = async (sectionKey, data) => {
    try {
      if (sectionKey === 'hero') await api.updateHero(data);
      if (sectionKey === 'history') await api.updateHistory(data);
      if (sectionKey === 'seo') await api.updateSeo(data);
      updateSection('collaborationsPage', { [sectionKey]: data });
      showToast(\`\${sectionKey.toUpperCase()} section parameters updated successfully.\`);
    } catch (err) {
      console.error(err);
      showToast('Error saving ' + sectionKey, 'error');
    }
  };`;
  content = content.slice(0, handleSingleSaveStart) + newHandleSingleSave + content.slice(handleSingleSaveEnd);
}

// 2. Fix updateSectionMeta
const updateMetaStart = content.indexOf("const updateSectionMeta = (secId, key, val) => {");
if (updateMetaStart !== -1) {
  const updateMetaEnd = content.indexOf("};", updateMetaStart) + 2;
  const newUpdateMeta = `const updateSectionMeta = async (secId, key, val) => {
    const currentSettings = collaborationsPage.sectionSettings || {};
    const secSettings = { ...(currentSettings[secId] || { order: 1, status: "Active" }), [key]: val };
    const updatedSettings = { ...currentSettings, [secId]: secSettings };
    try {
      await api.updateSectionSettings({ section: secId, settings: secSettings });
      updateSection('collaborationsPage', { sectionSettings: updatedSettings });
    } catch (err) {
      console.error(err);
      showToast('Error saving settings', 'error');
    }
  };`;
  content = content.slice(0, updateMetaStart) + newUpdateMeta + content.slice(updateMetaEnd);
}

// 3. Fix renderListManager to include getApiFuncs
const renderListManagerStart = content.indexOf("const renderListManager = ({ sectionKey, fields = [], displayColumns = [] }) => {");
if (renderListManagerStart !== -1) {
  const renderListManagerBodyStart = renderListManagerStart + "const renderListManager = ({ sectionKey, fields = [], displayColumns = [] }) => {".length;
  const injectGetApiFuncs = `
    const getApiFuncs = () => {
      switch (sectionKey) {
        case 'brandCarousel': return { add: api.addBrand, update: api.updateBrand, delete: api.deleteBrand };
        case 'partners': return { add: api.addPartner, update: api.updatePartner, delete: api.deletePartner };
        case 'metrics': return { add: api.addMetric, update: api.updateMetric, delete: api.deleteMetric };
        case 'campaigns': return { add: api.addCampaign, update: api.updateCampaign, delete: api.deleteCampaign };
        case 'process': return { add: api.addProcess, update: api.updateProcess, delete: api.deleteProcess };
        case 'testimonials': return { add: api.addTestimonial, update: api.updateTestimonial, delete: api.deleteTestimonial };
        default: return null;
      }
    };`;
  content = content.slice(0, renderListManagerBodyStart) + injectGetApiFuncs + content.slice(renderListManagerBodyStart);
}

// 4. Fix handleSaveItem inside renderListManager
const handleSaveItemStart = content.indexOf("const handleSaveItem = () => {");
if (handleSaveItemStart !== -1) {
  const handleSaveItemEnd = content.indexOf("};", handleSaveItemStart + 100) + 2;
  const newHandleSaveItem = `const handleSaveItem = async () => {
      let nextList = [];
      try {
        const funcs = getApiFuncs();
        let savedItem;
        
        if (editingItemId !== null) {
          if (funcs) {
            const currentItem = listData.find(item => String(item.id) === String(editingItemId) || String(item._id) === String(editingItemId));
            const res = await funcs.update(currentItem._id || currentItem.id, draftItem);
            savedItem = res.data.data;
          } else {
            savedItem = { ...listData.find(item => String(item.id) === String(editingItemId)), ...draftItem };
          }
          nextList = listData.map(item => String(item.id) === String(editingItemId) || String(item._id) === String(editingItemId) ? savedItem : item);
          showToast("Item updated successfully.");
        } else {
          const newItemData = { ...draftItem, status: draftItem.status || 'Active', order: listData.length + 1 };
          if (funcs) {
            const res = await funcs.add(newItemData);
            savedItem = res.data.data;
          } else {
            savedItem = { ...newItemData, id: \`item-\${Date.now()}\` };
          }
          nextList = [...listData, savedItem];
          showToast("New item created.");
        }
        updateSection('collaborationsPage', { [sectionKey]: nextList });
        setActiveEditorSection(null);
        setEditingItemId(null);
        setDraftItem({});
      } catch (err) {
        console.error(err);
        showToast("Error saving item", "error");
      }
    };`;
  content = content.slice(0, handleSaveItemStart) + newHandleSaveItem + content.slice(handleSaveItemEnd);
}

// 5. Fix delete confirmation at the bottom
const deleteConfirmStart = content.indexOf(`onConfirm={() => {
          deleteNestedItem("collaborationsPage", deletingSection, deletingItemId);`);
if (deleteConfirmStart !== -1) {
  const deleteConfirmEnd = content.indexOf("}}", deleteConfirmStart) + 2;
  const newDeleteConfirm = `onConfirm={async () => {
          try {
            const getApiFuncsForDel = (section) => {
              switch (section) {
                case 'brandCarousel': return { delete: api.deleteBrand };
                case 'partners': return { delete: api.deletePartner };
                case 'metrics': return { delete: api.deleteMetric };
                case 'campaigns': return { delete: api.deleteCampaign };
                case 'process': return { delete: api.deleteProcess };
                case 'testimonials': return { delete: api.deleteTestimonial };
                default: return null;
              }
            };
            const funcs = getApiFuncsForDel(deletingSection);
            if (funcs) {
              const listData = collaborationsPage[deletingSection] || [];
              const item = listData.find(it => String(it.id) === String(deletingItemId) || String(it._id) === String(deletingItemId));
              if (item) {
                await funcs.delete(item._id || item.id);
              }
            }
            deleteNestedItem("collaborationsPage", deletingSection, deletingItemId);
            showToast("Record deleted successfully.");
          } catch (err) {
            console.error(err);
            showToast("Error deleting record.", "error");
          } finally {
            setDeletingItemId(null);
            setDeletingSection(null);
          }
        }}`;
  content = content.slice(0, deleteConfirmStart) + newDeleteConfirm + content.slice(deleteConfirmEnd);
}

fs.writeFileSync(filePath, content);
console.log('Successfully patched Collaborations.jsx with AST-like precision!');
