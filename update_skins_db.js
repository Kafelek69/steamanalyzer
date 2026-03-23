const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/SkinsDatabase.jsx', 'utf8');

content = content.replace(
    /selectedWeapon === w \|\| \(selectedWeapon === '' && w === t\('skins\.weaponAll'\) \|\| t\('skins\.weaponAll'\)\)/g,
    "selectedWeapon === w || (selectedWeapon === '' && w === t('skins.weaponAll'))"
);

fs.writeFileSync('frontend/src/pages/SkinsDatabase.jsx', content);
console.log('SkinsDatabase fixed');
