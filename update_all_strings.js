const fs = require('fs');

const fixNav = () => {
    let content = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
    // already done but just in case
    fs.writeFileSync('frontend/src/components/Navbar.jsx', content, 'utf8');
};

const fixInventory = () => {
    let content = fs.readFileSync('frontend/src/pages/InventoryAnalyzer.jsx', 'utf8');
    content = content.replace(/ANALIZATOR EKWIPUNKU/g, "{t('inventory.title')}");
    content = content.replace(/Skaner Ekwipunku/g, "{t('inventory.title')}");
    content = content.replace(/SKANER EKWIPUNKU/g, "{t('inventory.title')}");
    content = content.replace(/Wprowadź SteamID lub Trade URL/g, "{t('inventory.inputPlaceholder')}");
    content = content.replace(/'SteamID, Profil URL lub Trade URL\.\.\.'/g, "t('inventory.inputPlaceholder')");
    content = content.replace(/>SKANUJ</g, ">{t('inventory.scanBtn')}<");
    content = content.replace(/CAŁKOWITA WARTOŚĆ/g, "{t('inventory.totalValue')}");
    content = content.replace(/WARTOŚĆ ZBYWALNA/g, "{t('inventory.tradableValue')}");
    content = content.replace(/POTENCJAŁ ZYSKU/g, "{t('inventory.profitPotential')}");
    content = content.replace(/Zbywalne za/g, "{t('inventory.tradableIn')}");
    content = content.replace(/>Zbywalne</g, ">{t('inventory.tradableNow')}<");
    content = content.replace(/dni/g, "{t('inventory.days')}");
    content = content.replace(/Wycena AI/g, "{t('inventory.aiValuation')}");
    content = content.replace(/Wycena Steam/g, "{t('inventory.steamValuation')}");
    content = content.replace(/Analizuj rynek Steam/g, "{t('inventory.analyzeSteam')}");
    content = content.replace(/Szukaj na rynkach P2P/g, "{t('inventory.analyzeP2P')}");
    content = content.replace(/Nie znaleziono przedmiotów w ekwipunku\./g, "{t('inventory.noItems') || 'Nie znaleziono przedmiotów'}");
    content = content.replace(/Skanowanie ekwipunku\.\.\./g, "{t('inventory.loading') || 'Skanowanie ekwipunku...'}");
    fs.writeFileSync('frontend/src/pages/InventoryAnalyzer.jsx', content, 'utf8');
};

const fixP2P = () => {
    let content = fs.readFileSync('frontend/src/pages/P2PMarket.jsx', 'utf8');
    content = content.replace(/RYNEK P2P/g, "{t('p2p.title')}");
    content = content.replace(/AGREGATOR P2P/g, "{t('p2p.title')}");
    content = content.replace(/ZNAJDŹ NAJLEPSZE OFERTY Z RÓŻNYCH PLATFORM/g, "{t('p2p.bestDeals')}");
    content = content.replace(/ZNIŻKA/g, "{t('p2p.discount')}");
    content = content.replace(/KUP TERAZ/g, "{t('p2p.buyNow')}");
    content = content.replace(/Potencjalny zysk/g, "{t('p2p.profit')}");
    content = content.replace(/ZWERYFIKOWANY SPRZEDAWCA/g, "{t('p2p.trusted')}");
    content = content.replace(/Porównaj ceny/g, "{t('p2p.compare')}");
    content = content.replace(/>Wyszukaj\.\.\.</g, ">{t('p2p.search') || 'Wyszukaj'}<");
    fs.writeFileSync('frontend/src/pages/P2PMarket.jsx', content, 'utf8');
};

const fixMarket = () => {
    let content = fs.readFileSync('frontend/src/pages/EnhancedMarket.jsx', 'utf8');
    content = content.replace(/ZAAWANSOWANE FILTRY/g, "{t('market.filters')}");
    content = content.replace(/Sortowanie/g, "{t('market.sort')}");
    content = content.replace(/>Cena</g, ">{t('market.price') || 'Cena'}<");
    // Placeholders
    content = content.replace(/placeholder="MIN"/g, "placeholder={t('market.minPrice')}");
    content = content.replace(/placeholder="MAX"/g, "placeholder={t('market.maxPrice')}");
    content = content.replace(/Zużycie \(Float 0\.0 - 1\.0\)/g, "{t('market.floatRange') || 'Zużycie (Float 0.0 - 1.0)'}");
    content = content.replace(/>Broń</g, ">{t('market.weapon')}<");
    content = content.replace(/Wszystko \(Puste\)/g, "{t('market.weaponAll')}");
    content = content.replace(/>Rzadkość</g, ">{t('market.rarity')}<");
    content = content.replace(/Każda rzadkość/g, "{t('market.rarityAll')}");
    content = content.replace(/Pattern \(Seed np\. Case Hardened\)/g, "{t('market.patternLabel') || 'Pattern'}");
    content = content.replace(/placeholder="np\. 661"/g, "placeholder={t('market.pattern')}");
    content = content.replace(/Souvenir pamiątka/g, "{t('market.souvenir')}");
    content = content.replace(/Posiada Naklejki/g, "{t('market.stickers')}");
    content = content.replace(/Posiada Charmsy \(Breloki\)/g, "{t('market.charms')}");
    content = content.replace(/FILTRUJ Rynek/g, "{t('market.filterAction') || 'FILTRUJ'}");
    content = content.replace(/OFERTY RYNKU PRO/g, "{t('market.proOffers') || 'OFERTY PRO'}");
    content = content.replace(/SKANOWANIE FLOATÓW W CZASIE RZECZYWISTYM/g, "{t('market.realtimeScan') || 'SKANOWANIE W CZASIE RZECZYWISTYM'}");
    content = content.replace(/Znaleziono:/g, "{t('market.found') || 'Znaleziono:'}");
    content = content.replace(/przedmiotów/g, "{t('market.items') || 'przedmiotów'}");
    content = content.replace(/Wyświetlono:/g, "{t('market.displayed') || 'Wyświetlono:'}");
    content = content.replace(/Przeszukiwanie bazy Steam\.\.\./g, "{t('market.searchingSteam') || 'Przeszukiwanie...'}");
    fs.writeFileSync('frontend/src/pages/EnhancedMarket.jsx', content, 'utf8');
};

const fixSkins = () => {
    let content = fs.readFileSync('frontend/src/pages/SkinsDatabase.jsx', 'utf8');
    content = content.replace(/BAZA SKÓREK/g, "{t('skins.title')}");
    content = content.replace(/WSZYSTKIE PRZEDMIOTY CS2 W JEDNYM MIEJSCU/g, "{t('skins.subtitle')}");
    content = content.replace(/Szukaj broni lub skina\.\.\./g, "{t('skins.search')}");
    content = content.replace(/"Wszystkie"/g, "t('skins.weaponAll') || 'Wszystkie'");
    content = content.replace(/'Wszystkie'/g, "t('skins.weaponAll') || 'Wszystkie'");
    content = content.replace(/'Wszystkie'/g, "t('skins.weaponAll') || 'Wszystkie'");
    content = content.replace(/{w}/g, "{w === 'Wszystkie' ? t('skins.weaponAll') || 'Wszystkie' : w}");
    content = content.replace(/Ładowanie bazy danych\.\.\./g, "{t('skins.loading') || 'Ładowanie bazy danych...'}");
    content = content.replace(/NIE ZNALEZIONO SKÓREK PASUJĄCYCH DO KRYTERIÓW/g, "{t('skins.notFound') || 'Brak wyników'}");
    fs.writeFileSync('frontend/src/pages/SkinsDatabase.jsx', content, 'utf8');
};

try {
    fixInventory();
    fixP2P();
    fixMarket();
    fixSkins();
    console.log('All replacements done');
} catch (e) {
    console.error('Error:', e);
}
