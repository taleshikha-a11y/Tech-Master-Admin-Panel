const fs = require('fs');
const content = fs.readFileSync('C:/Users/tales/OneDrive/Desktop/zenvora3d/src/pages/Modules/Campaigns.jsx', 'utf8').split('\n');

let depth = 0;
for (let i = 0; i < content.length; i++) {
  const line = content[i];
  
  // Count open/close braces on this line
  let open = 0;
  let close = 0;
  let inString = false;
  let strChar = '';
  for(let j=0; j<line.length; j++) {
    const c = line[j];
    if (inString) {
      if (c === strChar && line[j-1] !== '\\') inString = false;
    } else {
      if (c === '"' || c === "'" || c === '`') { inString = true; strChar = c; }
      else if (c === '{') open++;
      else if (c === '}') close++;
    }
  }
  
  if (close > open) depth -= (close - open);
  
  // Check indentation
  const indentMatch = line.match(/^ */);
  const indent = indentMatch ? indentMatch[0].length : 0;
  // Usually indent is 2 * depth
  if (line.trim().length > 0 && Math.abs(indent - (depth * 2)) > 4 && i > 25 && i < 1000) {
    console.log('Mismatch at line', i+1, 'Depth:', depth, 'Indent:', indent, line.substring(0, 40));
  }
  
  if (open > close) depth += (open - close);
}
