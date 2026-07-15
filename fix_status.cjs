const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/tales/Downloads/Tech-master-main (1)/Tech-master-main/TechMasterSher/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('item.status === "Active"')) {
    content = content.replace(/item\.status === "Active"/g, '(item.status === "Active" || item.status === true || String(item.status).toLowerCase() === "true")');
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + file);
  }
}
