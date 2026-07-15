const fs = require('fs');
const file = 'C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Collaborations.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex1 = /const handleSingleSave = \(sectionKey, data\) => \{\s*updateSection\('collaborationsPage', \{ \[sectionKey\]: data \}\);\s*showToast\([\s\S]*?\);\s*\};/;
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
content = content.replace(regex1, newHandleSingleSave);

const regex2 = /const updateSectionMeta = \(secId, key, val\) => \{\s*const currentSettings[\s\S]*?updateSection\('collaborationsPage', \{ sectionSettings: updatedSettings \}\);\s*\};/;
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
content = content.replace(regex2, newUpdateMeta);

fs.writeFileSync(file, content);
console.log('Fixed handleSingleSave and updateSectionMeta!');
