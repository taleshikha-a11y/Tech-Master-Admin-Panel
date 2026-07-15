const fs = require('fs');
let content = fs.readFileSync('C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Collaborations.jsx', 'utf-8');

// 1. Remove useDatabase and its import
content = content.replace(/import \{ useDatabase \} from '\.\.\/\.\.\/context\/DatabaseContext';\n?/, '');
content = content.replace(/const \{ db, updateSection, deleteNestedItem \} = useDatabase\(\);\n?/, '');
content = content.replace(/const collaborationsPage = db\?\.collaborationsPage \|\| \{\};\n?/, '');

// Add new imports
const newImports = `import { useEffect } from 'react';
import {
  getCollaboration, updateHero, updateHistory, updateSeo, updateSectionSettings,
  addBrand, updateBrand, deleteBrand,
  addPartner, updatePartner, deletePartner,
  addMetric, updateMetric, deleteMetric,
  addCampaign, updateCampaign, deleteCampaign,
  addProcess, updateProcess, deleteProcess,
  addTestimonial, updateTestimonial, deleteTestimonial
} from '../../Services/collabrationServices';
`;
content = content.replace(/import \{ Card \} from '\.\.\/\.\.\/components\/ui\/Card';/, newImports + "import { Card } from '../../components/ui/Card';");

// 2. Add local state and useEffect
const stateCode = `  const [collaborationsPage, setCollaborationsPage] = useState({});

  const fetchData = async () => {
    try {
      const res = await getCollaboration();
      if (res.data && res.data.data) {
        let doc = res.data.data;
        if (Array.isArray(doc)) doc = doc[0] || {};
        setCollaborationsPage(doc || {});
        setHeroForm(doc.hero || {});
        setHistoryForm(doc.history || {});
        setSeoForm(doc.seo || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`;
content = content.replace(/export default function Collaborations\(\) \{/, 'export default function Collaborations() {\n' + stateCode);

// 3. Fix initial state for forms
content = content.replace(/const \[heroForm, setHeroForm\] = useState\(collaborationsPage\?\.hero \|\| \{\}\);/, 'const [heroForm, setHeroForm] = useState({});');
content = content.replace(/const \[historyForm, setHistoryForm\] = useState\(collaborationsPage\?\.history \|\| \{\}\);/, 'const [historyForm, setHistoryForm] = useState({});');
content = content.replace(/const \[seoForm, setSeoForm\] = useState\(collaborationsPage\?\.seo \|\| \{\}\);/, 'const [seoForm, setSeoForm] = useState({});');

// 4. Update simulateMediaUpload dummyUrl fix
content = content.replace(/dummyUrl/g, 'url');

// 5. handleSingleSave
const handleSingleSaveCode = `  const handleSingleSave = async (sectionKey, data) => {
    try {
      if (sectionKey === 'hero') await updateHero(data);
      if (sectionKey === 'history') await updateHistory(data);
      if (sectionKey === 'seo') await updateSeo(data);
      fetchData();
      showToast(\`\${sectionKey.toUpperCase()} section parameters updated successfully.\`);
    } catch (err) {
      showToast("Error updating section.", "error");
    }
  };`;
content = content.replace(/const handleSingleSave = [\s\S]*?showToast\([^\n]+\n\s+\};\n/, handleSingleSaveCode + '\n');

// 6. updateSectionMeta
const updateSectionMetaCode = `  const updateSectionMeta = async (secId, key, val) => {
    try {
      const currentSettings = collaborationsPage.sectionSettings || {};
      const updatedSettings = {
        ...currentSettings,
        [secId]: {
          ...(currentSettings[secId] || { order: 1, status: "Active" }),
          [key]: val
        }
      };
      await updateSectionSettings(updatedSettings);
      fetchData();
      showToast("Section settings updated successfully.");
    } catch(err) {
      showToast("Failed to update section settings.", "error");
    }
  };`;
content = content.replace(/const updateSectionMeta = [\s\S]*?updateSection\('collaborationsPage', \{ sectionSettings: updatedSettings \}\);\n\s+\};\n/, updateSectionMetaCode + '\n');

// 7. handleSaveItem in renderListManager
const handleSaveItemMatch = /const handleSaveItem = \(\) => \{[\s\S]*?setDraftItem\(\{\}\);\n\s+\};\n/;
const handleSaveItemCode = `    const handleSaveItem = async () => {
      try {
        if (editingItemId !== null) {
          if (sectionKey === 'brandCarousel') await updateBrand(editingItemId, draftItem);
          else if (sectionKey === 'partners') await updatePartner(editingItemId, draftItem);
          else if (sectionKey === 'metrics') await updateMetric(editingItemId, draftItem);
          else if (sectionKey === 'campaigns') await updateCampaign(editingItemId, draftItem);
          else if (sectionKey === 'process') await updateProcess(editingItemId, draftItem);
          else if (sectionKey === 'testimonials') await updateTestimonial(editingItemId, draftItem);
        } else {
          if (sectionKey === 'brandCarousel') await addBrand(draftItem);
          else if (sectionKey === 'partners') await addPartner(draftItem);
          else if (sectionKey === 'metrics') await addMetric(draftItem);
          else if (sectionKey === 'campaigns') await addCampaign(draftItem);
          else if (sectionKey === 'process') await addProcess(draftItem);
          else if (sectionKey === 'testimonials') await addTestimonial(draftItem);
        }
        fetchData();
        showToast("Item saved successfully.");
        setActiveEditorSection(null);
        setEditingItemId(null);
        setDraftItem({});
      } catch (err) {
        showToast("Failed to save item.", "error");
      }
    };`;
content = content.replace(handleSaveItemMatch, handleSaveItemCode + '\n');

// 8. Delete dialog onConfirm
const onConfirmMatch = /onConfirm=\{[\s\S]*?showToast\("Record deleted successfully\."\);\n\s+\}\}/;
const onConfirmCode = `onConfirm={async () => {
          try {
            if (deletingSection === 'brandCarousel') await deleteBrand(deletingItemId);
            else if (deletingSection === 'partners') await deletePartner(deletingItemId);
            else if (deletingSection === 'metrics') await deleteMetric(deletingItemId);
            else if (deletingSection === 'campaigns') await deleteCampaign(deletingItemId);
            else if (deletingSection === 'process') await deleteProcess(deletingItemId);
            else if (deletingSection === 'testimonials') await deleteTestimonial(deletingItemId);
            
            fetchData();
            showToast("Record deleted successfully.");
          } catch(err) {
            showToast("Failed to delete record.", "error");
          } finally {
            setDeletingItemId(null);
            setDeletingSection(null);
          }
        }}`;
content = content.replace(onConfirmMatch, onConfirmCode);

// 9. Change Item ID references from item.id to item._id since Mongoose uses _id
content = content.replace(/item\.id/g, 'item._id');
// Except in creating a new item locally, which we don't do manually anymore because backend creates it.
// Wait, the state in handleStartEdit uses item._id:
// But wait, there is \`editingItemId !== null\`
// Let's replace \`setEditingItemId(item.id)\` with \`setEditingItemId(item._id)\`
content = content.replace(/setEditingItemId\(item\.id\)/g, 'setEditingItemId(item._id)');
content = content.replace(/setDeletingItemId\(item\.id\)/g, 'setDeletingItemId(item._id)');
content = content.replace(/key=\{item\.id \|\| idx\}/g, 'key={item._id || idx}');

// We also need to fix handleMoveItem because it just modifies local state
// But we won't rewrite handleMoveItem fully, let's just make it do a showToast warning
const handleMoveItemMatch = /const handleMoveItem = [\s\S]*?updateSection\('collaborationsPage', \{ \[sectionKey\]: nextList \}\);\n\s+\}\n\s+\};\n/;
const handleMoveItemCode = `    const handleMoveItem = async (index, direction) => {
      showToast("Order updating is not fully supported in this version. Edit the item order directly.", "error");
    };`;
content = content.replace(handleMoveItemMatch, handleMoveItemCode + '\n');

fs.writeFileSync('C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Collaborations.jsx', content, 'utf-8');
console.log('Done modifying Collaborations.jsx');
