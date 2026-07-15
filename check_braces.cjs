const fs = require('fs');
const content = fs.readFileSync('C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx', 'utf8');
let openBraces = 0;
let openParens = 0;
let openBrackets = 0;
let inString = false;
let stringChar = '';
for (let i = 0; i < content.length; i++) {
  const c = content[i];
  if (inString) {
    if (c === stringChar && content[i-1] !== '\\') inString = false;
  } else {
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; }
    else if (c === '{') openBraces++;
    else if (c === '}') openBraces--;
    else if (c === '(') openParens++;
    else if (c === ')') openParens--;
    else if (c === '[') openBrackets++;
    else if (c === ']') openBrackets--;
  }
}
console.log('Braces:', openBraces, 'Parens:', openParens, 'Brackets:', openBrackets);
