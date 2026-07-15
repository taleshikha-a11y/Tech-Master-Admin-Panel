const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Modules/Collaborations.jsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleSaveItem = \(\) => \{\s*let nextList = \[\];\s*if \(editingItemId !== null\) \{\s*nextList = listData\.map\(item => String\(item\.id\) === String\(editingItemId\) \? \{ \.\.\.item, \.\.\.draftItem \} :[\s\S]*?setDraftItem\(\{\}\);\s*\};/;

const replacement = `const handleSaveItem = async () => {
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

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Fixed handleSaveItem!');
