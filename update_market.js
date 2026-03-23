const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/EnhancedMarket.jsx', 'utf8');

// I also need to make sure t() is used for placeholders
content = content.replace(/'min'/g, "t('market.minPrice')");
content = content.replace(/'max'/g, "t('market.maxPrice')");
content = content.replace(/'Od \('/g, "t('market.floatMin')"); // wait, need to check actual strings...
