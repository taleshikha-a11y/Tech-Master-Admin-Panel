const fs = require('fs');
const file = 'C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import axios from 'axios'")) {
  content = content.replace("import React", "import axios from 'axios';\nimport React");
}

const saveItemRegex = /const handleSaveItem = async \(\) => \{[\s\S]*?showToast\("Error saving item\."\);\s*console\.error\([^)]+\);\s*\}\s*\};/;

const newHandleSaveItem = `const handleSaveItem = async () => {
      try {
        const baseURL = 'http://localhost:5000/api/v1';
        let savedItem;
        if (editingItemId) {
          if (selectedTab === 'campaigns') {
            if (sectionKey === 'campaignsList') savedItem = await axios.put(\`\${baseURL}/campaigns/\${editingItemId}\`, draftItem);
            if (sectionKey === 'lifecycle') savedItem = await axios.put(\`\${baseURL}/campaigns/lifecycle/\${editingItemId}\`, draftItem);
            if (sectionKey === 'successStories') savedItem = await axios.put(\`\${baseURL}/campaigns/success-stories/\${editingItemId}\`, draftItem);
          } else {
            if (sectionKey === 'products') savedItem = await axios.put(\`\${baseURL}/launches/products/\${editingItemId}\`, draftItem);
            if (sectionKey === 'initiatives') savedItem = await axios.put(\`\${baseURL}/launches/initiatives/\${editingItemId}\`, draftItem);
          }
          showToast("Item updated successfully.");
        } else {
          const newItem = { ...draftItem, status: draftItem.status || 'Active', order: listData.length + 1 };
          if (selectedTab === 'campaigns') {
            if (sectionKey === 'campaignsList') savedItem = await axios.post(\`\${baseURL}/campaigns\`, newItem);
            if (sectionKey === 'lifecycle') savedItem = await axios.post(\`\${baseURL}/campaigns/lifecycle\`, newItem);
            if (sectionKey === 'successStories') savedItem = await axios.post(\`\${baseURL}/campaigns/success-stories\`, newItem);
          } else {
            if (sectionKey === 'products') savedItem = await axios.post(\`\${baseURL}/launches/products\`, newItem);
            if (sectionKey === 'initiatives') savedItem = await axios.post(\`\${baseURL}/launches/initiatives\`, newItem);
          }
          showToast("New item created.");
        }
        await fetchData();
        setActiveEditorSection(null);
        setEditingItemId(null);
        setDraftItem({});
      } catch (error) {
        showToast("Error saving item.");
        console.error(error);
      }
    };`;

content = content.replace(saveItemRegex, newHandleSaveItem);

fs.writeFileSync(file, content);
console.log('Fixed Campaigns.jsx handleSaveItem with direct axios calls!');
