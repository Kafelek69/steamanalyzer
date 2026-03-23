const fs = require('fs');

const files = [
    'frontend/src/pages/Dashboard.jsx',
    'frontend/src/pages/EnhancedMarket.jsx',
    'frontend/src/pages/InventoryAnalyzer.jsx',
    'frontend/src/pages/P2PMarket.jsx',
    'frontend/src/pages/SkinsDatabase.jsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Make sure useSettings is imported
    if (!content.includes('useSettings')) {
        content = "import { useSettings } from '../context/SettingsContext';\n" + content;
    }

    // Attempt to inject t into component
    const componentMatch = content.match(/function\s+(\w+)\s*\(\)\s*\{/);
    if (componentMatch) {
        const funcStart = componentMatch[0];
        // check if t is destructured
        const afterFunc = content.substring(content.indexOf(funcStart) + funcStart.length, content.indexOf(funcStart) + funcStart.length + 200);
        if (!afterFunc.includes('const {') || !afterFunc.includes(' t ')) {
            // add it correctly
            // We'll replace the function start to inject it
            if(afterFunc.includes('const { formatPrice, language } = useSettings();')){
                content = content.replace('const { formatPrice, language } = useSettings();', 'const { formatPrice, language, t } = useSettings();');
            } else if (afterFunc.includes('const { formatPrice } = useSettings();')) {
                content = content.replace('const { formatPrice } = useSettings();', 'const { formatPrice, t } = useSettings();');
            } else if (!afterFunc.includes('useSettings()')) {
                content = content.replace(funcStart, funcStart + "\n    const { t } = useSettings();");
            }
        }
    }

    // Fix the repeated t() stuff
    content = content.replace(/t\('skins\.weaponAll'\) \|\| t\('skins\.weaponAll'\) \|\| t\('skins\.weaponAll'\) \|\| 'Wszystkie'/g, "t('skins.weaponAll')");
    content = content.replace(/t\('skins\.weaponAll'\) \|\| 'Wszystkie'/g, "t('skins.weaponAll')");

    fs.writeFileSync(file, content, 'utf8');
});
console.log('useSettings and cleanups applied');
