const fs = require('fs');
let content = fs.readFileSync('frontend/src/context/SettingsContext.jsx', 'utf8');

content = content.replace(/const keys = path\.split\('\.'\);/, "if (!path) return '';\n            const keys = path.split('.');");

fs.writeFileSync('frontend/src/context/SettingsContext.jsx', content);
console.log('Fixed t() in SettingsContext');
