const fs = require('fs');
const content = fs.readFileSync('C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx', 'utf8');

let stack = [];
let inString = false;
let stringChar = '';
let line = 1;

for (let i = 0; i < content.length; i++) {
  const c = content[i];
  if (c === '\n') line++;
  
  if (inString) {
    if (c === stringChar && content[i-1] !== '\\') inString = false;
  } else {
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; }
    else if (c === '{') stack.push(line);
    else if (c === '}') stack.pop();
  }
}
console.log('Unclosed braces opened on lines:', stack);
