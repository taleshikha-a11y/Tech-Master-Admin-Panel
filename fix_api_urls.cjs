const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcPath).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx'));

let modifiedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    const fileName = path.basename(f);
    
    if (fileName === 'api.js') {
        content = content.replace('baseURL: import.meta.env.VITE_API_URL,', 'baseURL: `${import.meta.env.VITE_API_URL}/api`,');
    } else {
        content = content.replace(/\$\{import\.meta\.env\.VITE_API_URL\}\//g, '${import.meta.env.VITE_API_URL}/api/');
        content = content.replace('const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL;', 'const API_URL = `${import.meta.env.VITE_API_URL}/api`;');
    }

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        modifiedCount++;
        console.log('Modified:', f);
    }
});

console.log('Total modified files:', modifiedCount);
