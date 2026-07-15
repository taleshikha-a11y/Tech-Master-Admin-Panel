const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/Modules/Collaborations.jsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import React, { useState, useEffect }')) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
}

const componentStart = content.indexOf('export default function Collaborations() {');
if (componentStart !== -1) {
  const afterComponentStart = content.indexOf('{', componentStart) + 1;
  const injectUseEffect = `
    useEffect(() => {
      api.getCollaboration().then(res => {
        if (res.data && res.data.data) {
          updateSection('collaborationsPage', res.data.data);
        }
      }).catch(err => console.error('Failed to load collaborations from backend', err));
    }, []);`;
  
  if (!content.includes('api.getCollaboration()')) {
    content = content.slice(0, afterComponentStart) + injectUseEffect + content.slice(afterComponentStart);
  }
}

fs.writeFileSync(file, content);
console.log('Added useEffect to Collaborations.jsx!');
