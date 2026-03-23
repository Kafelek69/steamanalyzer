const axios = require('axios');
const cron = require('node-cron');
const pool = require('../db');

// Odpytuje oficjalny system Steama dla cen
// Steam często nakłada "Rate Limits" (błąd 429 Too Many Requests), dlatego to zadanie 
// musi być wykonywane powoli i w odstępach.
async function fetchSkinPrice(marketHashName) {
    // currency 6 = PLN, 1 = USD, 3 = EUR
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=6&market_hash_name=${encodeURIComponent(marketHashName)}`;
    
    try {
        const response = await axios.get(url);
        if (response.data.success) {
            // Steam zwraca np. '123,45 zł' - konwertujemy to do czystej liczby typ double (np 123.45)
            const parsePrice = (priceStr) => {
                if (!priceStr) return null;
                return parseFloat(priceStr.replace(/,/g, '.').replace(/[^\d.-]/g, ''));
            };

            const parseVolume = (volStr) => {
                if (!volStr) return 0;
                return parseInt(volStr.replace(/,/g, ''));
            };

            return {
                lowest_price: parsePrice(response.data.lowest_price),
                median_price: parsePrice(response.data.median_price),
                volume: parseVolume(response.data.volume)
            };
        }
    } catch (error) {
        console.error(`Błąd pobierania danych dla [${marketHashName}]:`, error.response ? error.response.statusText : error.message);
    }
    
    return null;
}

// Analizator anomalii dla skina weryfikujący czy powiadomić graczy
async function checkAnomalies(skinId, marketHashName, currentVolume, currentPrice) {
    // Pobieramy dane sprzed tygodnia (przykład dla porównania: "czy sprzedaje się 300x bardziej niż przed tygodniem")
    const pastDataQuery = await pool.query(
        `SELECT AVG(volume) as avg_weekly_volume, AVG(lowest_price) as avg_price 
         FROM skin_price_history 
         WHERE skin_id = $1 
         AND timestamp >= NOW() - INTERVAL '7 days' 
         AND timestamp < NOW() - INTERVAL '1 day'`, 
        [skinId]
    );

    const pastData = pastDataQuery.rows[0];
    if (pastData && pastData.avg_weekly_volume > 0) {
        const avgVol = parseFloat(pastData.avg_weekly_volume);
        const ratio = currentVolume / avgVol;

        // Jeśli wolumen dzisiejszy jest np. o 300% większy (czyli ratio >= 3)
        if (ratio >= 3) {
            console.log(`🚨 ANOMALIA WYKRYTA dla ${marketHashName}! Wzrost wolumenu o ${(ratio * 100).toFixed(0)}%`);
            
            // Zapis do tabeli anomalii, z której nasza strona internetowa i WebSocket będzie strzelać powiadomieniami 
            await pool.query(
                `INSERT INTO anomalies (skin_id, reason, previous_volume, new_volume) 
                 VALUES ($1, $2, $3, $4)`,
                [skinId, 'WOLUMEN +300%', avgVol, currentVolume]
            );
        }
    }
}

// Skrypt asynchroniczny, odpalany np. co godzinę "0 * * * *"
const startSteamScraper = () => {
    // Do testów odpalamy to np. raz dziennie każdego dnia po północy '0 0 * * *' albo co godzine
    // Teraz ustawiłem cron na: każdą pełną godzinę.
    cron.schedule('0 * * * *', async () => {
        console.log("🔄 Rozpoczynam pobieranie cen z giełdy Steam...");

        // Pobieramy skiny obserwowalne / popularne aby nie zabijać API Steama
        // Docelowo może to wchodzić z proxy
        const skinsQuery = await pool.query('SELECT id, market_hash_name FROM skins ORDER BY id ASC');
        const skins = skinsQuery.rows;

        for (let skin of skins) {
            // Pauza 5 sekund między strzałami. (Steam pozwala na ok 20-30 zapytan na minute z jednego IP przed banem)
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            console.log(`Pobieranie: ${skin.market_hash_name}...`);
            const data = await fetchSkinPrice(skin.market_hash_name);

            if (data) {
                // Dodajemy historie do bazdy
                await pool.query(
                    `INSERT INTO skin_price_history (skin_id, lowest_price, median_price, volume) 
                     VALUES ($1, $2, $3, $4)`,
                    [skin.id, data.lowest_price, data.median_price, data.volume]
                );
                
                // Odpalamy analizer zlecający powiadomienia
                await checkAnomalies(skin.id, skin.market_hash_name, data.volume, data.lowest_price);
            }
        }
        console.log("✅ Zakończono asynchroniczne pobieranie cen Steam.");
    });
};

module.exports = { startSteamScraper };
