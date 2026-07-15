const fs = require('fs');
const file = 'C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx';
let content = fs.readFileSync(file, 'utf8');

const saveItemRegex = /const handleSaveItem = async \(\) => \{[\s\S]*?setActiveEditorSection\(null\);\s*\}\s*catch \([^)]+\) \{\s*showToast\("Error saving item\."\);\s*console\.error\([^)]+\);\s*\}\s*\};/;

const newHandleSaveItem = `const handleSaveItem = async () => {
      try {
        let savedItem;
        if (editingItemId) {
          if (selectedTab === 'campaigns') {
            if (sectionKey === 'campaignsList') savedItem = await updateCampaignItem(editingItemId, draftItem);
            if (sectionKey === 'lifecycle') savedItem = await updateCampaignLifecycle(editingItemId, draftItem);
            if (sectionKey === 'successStories') savedItem = await updateCampaignSuccessStory(editingItemId, draftItem);
          } else {
            if (sectionKey === 'products') savedItem = await updateLaunchProduct(editingItemId, draftItem);
            if (sectionKey === 'initiatives') savedItem = await updateLaunchInitiative(editingItemId, draftItem);
          }
          showToast("Item updated successfully.");
        } else {
          const newItem = { ...draftItem, status: draftItem.status || 'Active', order: listData.length + 1 };
          if (selectedTab === 'campaigns') {
            if (sectionKey === 'campaignsList') savedItem = await createCampaignItem(newItem);
            if (sectionKey === 'lifecycle') savedItem = await createCampaignLifecycle(newItem);
            if (sectionKey === 'successStories') savedItem = await createCampaignSuccessStory(newItem);
          } else {
            if (sectionKey === 'products') savedItem = await createLaunchProduct(newItem);
            if (sectionKey === 'initiatives') await createLaunchInitiative(newItem);
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

const deleteConfirmRegex = /<ConfirmModal\s*isOpen=\{!!deletingItemId\}[\s\S]*?onConfirm=\{\(\) => \{[\s\S]*?console\.error\(error\);\s*\}\s*\}\}/;

const newDeleteConfirm = `<ConfirmModal 
        isOpen={!!deletingItemId}
        title="Delete Record"
        message="Are you sure you want to delete this record? This cannot be undone."
        onCancel={() => { setDeletingItemId(null); setDeletingSection(null); }}
        onConfirm={async () => {
          try {
            if (selectedTab === 'campaigns') {
              if (deletingSection === 'campaignsList') await deleteCampaignItem(deletingItemId);
              if (deletingSection === 'lifecycle') await deleteCampaignLifecycle(deletingItemId);
              if (deletingSection === 'successStories') await deleteCampaignSuccessStory(deletingItemId);
            } else {
              if (deletingSection === 'products') await deleteLaunchProduct(deletingItemId);
              if (deletingSection === 'initiatives') await deleteLaunchInitiative(deletingItemId);
            }
            showToast("Record deleted successfully.");
            await fetchData();
          } catch (error) {
            showToast("Error deleting record.");
            console.error(error);
          } finally {
            setDeletingItemId(null);
            setDeletingSection(null);
          }
        }}`;

content = content.replace(deleteConfirmRegex, newDeleteConfirm);

fs.writeFileSync(file, content);
console.log('Fixed Campaigns.jsx handleSaveItem and deleteConfirm!');
