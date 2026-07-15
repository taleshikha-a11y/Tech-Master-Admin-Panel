const fs = require('fs');
const file = 'C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetString = `const handleSaveItem = async () => {
      try {
        let savedItem;`;

const replacementString = `const handleSaveItem = async () => {
      try {
        alert("Debug: sectionKey=" + sectionKey + ", selectedTab=" + selectedTab);
        console.log("Saving: ", { sectionKey, selectedTab, draftItem, editingItemId });
        let savedItem;`;

content = content.replace(targetString, replacementString);
fs.writeFileSync(file, content);
console.log('Injected alert into handleSaveItem!');
