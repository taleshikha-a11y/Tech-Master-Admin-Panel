const fs = require('fs');

// 1. Fix About.tsx
let file = 'C:/Users/tales/Downloads/Tech-master-main (1)/Tech-master-main/TechMasterSher/src/pages/About.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('import teamData from "../data/team.json";\n', '');
content = content.replace('import { LuxuryCard } from "../components/LuxuryCard";\n', '');
content = content.replace(/value\.\(feature as any\)\.icon/g, '((feature as any).icon || (feature as any).image)');
content = content.replace(/feature\.icon/g, '((feature as any).icon || (feature as any).image)');
content = content.replace(/aboutData\?\.founder\?\.imageUrl/g, '(aboutData?.founder as any)?.imageUrl');
fs.writeFileSync(file, content);

// 2. Fix Blog.tsx
file = 'C:/Users/tales/Downloads/Tech-master-main (1)/Tech-master-main/TechMasterSher/src/pages/Blog.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/blogData\?\.blogCategories/g, '(blogData as any)?.blogCategories');
content = content.replace(/blogData\?\.blogSEO/g, '(blogData as any)?.blogSEO');
content = content.replace(/blogData\?\.latestInsights/g, '(blogData as any)?.latestInsights');
fs.writeFileSync(file, content);

// 3. Fix Mission.tsx
file = 'C:/Users/tales/Downloads/Tech-master-main (1)/Tech-master-main/TechMasterSher/src/pages/Mission.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace('const { hero, cta, roadmap, seo } = (missionData as any) || {};', 'const { hero, roadmap, seo } = (missionData as any) || {};');
fs.writeFileSync(file, content);

// 4. Fix Services.tsx
file = 'C:/Users/tales/Downloads/Tech-master-main (1)/Tech-master-main/TechMasterSher/src/pages/Services.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/hero\?.backgroundGlow/g, '(hero as any)?.backgroundGlow');
content = content.replace(/hero\.backgroundGlow/g, '(hero as any)?.backgroundGlow');
content = content.replace(/setHoveredService\(service\.id\)/g, 'setHoveredService(Number(service.id))');
fs.writeFileSync(file, content);

console.log('Fixed TS Errors!');
