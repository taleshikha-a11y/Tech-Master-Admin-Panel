const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
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

    // First replace the direct string variations (that we found earlier)
    content = content.replace(/"http:\/\/localhost:5000\/api"/g, "import.meta.env.VITE_API_URL");
    content = content.replace(/'http:\/\/localhost:5000\/api\/faq'/g, "`${import.meta.env.VITE_API_URL}/faq`");
    content = content.replace(/"http:\/\/localhost:5000\/api\/testimonials"/g, "`${import.meta.env.VITE_API_URL}/testimonials`");
    content = content.replace(/'http:\/\/localhost:3000\/api'/g, "import.meta.env.VITE_API_URL");
    
    // Some static ones that might not be in template strings initially
    content = content.replace(/'http:\/\/localhost:5000\/api\/v1\/homepage\/sync'/g, "`${import.meta.env.VITE_API_URL}/v1/homepage/sync`");
    content = content.replace(/'http:\/\/localhost:5000\/api\/homepage\/sync'/g, "`${import.meta.env.VITE_API_URL}/homepage/sync`");
    content = content.replace(/'http:\/\/localhost:5000\/api\/v1\/upload'/g, "`${import.meta.env.VITE_API_URL}/v1/upload`");

    // Replace all other occurrences that might be in template literals
    // i.e., `http://localhost:5000/api/...` -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/http:\/\/localhost:5000\/api/g, "${import.meta.env.VITE_API_URL}");

    // Also fix any stragglers where we ended up with '${import.meta.env.VITE_API_URL}' inside single or double quotes
    // For example, if it was 'http://localhost:5000/api/seo' and became '${import.meta.env.VITE_API_URL}/seo'
    content = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL\}(.*?)'/g, "`\\${import.meta.env.VITE_API_URL}$1`");
    content = content.replace(/"\$\{import\.meta\.env\.VITE_API_URL\}(.*?)"/g, "`\\${import.meta.env.VITE_API_URL}$1`");

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        modifiedCount++;
        console.log('Modified:', f);
    }
});

console.log('Total modified files:', modifiedCount);
