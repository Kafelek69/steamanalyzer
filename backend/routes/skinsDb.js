const express = require('express');
const router = express.Router();
const axios = require('axios');

let mockSkinsDB = [];

// Pobiera dynamicznie z zewnętrznego publicznego API wszystkie skiny CS2
async function fetchAllSkins() {
    try {
        console.log('Fetching ALL CS2 skins from public API...');
        const res = await axios.get('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');
        
        let counter = 1;
        mockSkinsDB = res.data.map(skin => {
            let rarityName = skin.rarity ? skin.rarity.name : 'Consumer Grade';
            if (rarityName === 'Mil-Spec Grade') rarityName = 'Mil-Spec';
            
            return {
                id: counter++,
                weapon: skin.weapon ? skin.weapon.name : 'Unknown',
                name: skin.pattern ? skin.pattern.name : 'Vanilla',
                rarity: rarityName,
                collection: skin.collections && skin.collections.length > 0 
                                ? skin.collections[0].name 
                                : (skin.crates && skin.crates.length > 0 ? skin.crates[0].name : 'Nieznana Kolekcja'),
                image: skin.image || 'https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyUH68Rli-3D9N2s2QO2qA5tYWnyJYDGdwRqYVyErAPtxeq808DoupXOyyM17CI8pSGKmB3j/360fx360f'
            };
        });
        
        console.log(`Loaded ${mockSkinsDB.length} skins from API into database.`);
    } catch (error) {
        console.error('Failed to fetch CSGO skins from API', error.message);
    }
}

fetchAllSkins();

router.get('/', (req, res) => {
    try {
        const { search, weapon } = req.query;
        let filteredSkins = mockSkinsDB;

        if (search) {
            filteredSkins = filteredSkins.filter(s => 
                s.name.toLowerCase().includes(search.toLowerCase()) || 
                s.weapon.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (weapon) {
            filteredSkins = filteredSkins.filter(s => s.weapon === weapon);
        }

        // Limit do 500 sztuk jednorazowo, żeby nie przeciążyć połączenia sieciowego Steam static images
        const limitStr = req.query.limit || 500;
        const maxResults = limitStr === 'all' ? filteredSkins.length : parseInt(limitStr, 10);
        const resultsToSend = filteredSkins.slice(0, maxResults);

        res.json({ 
            data: resultsToSend,
            totalItems: filteredSkins.length,
            showing: resultsToSend.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:skinId', (req, res) => {
    const skin = mockSkinsDB.find(s => s.id == req.params.skinId);
    if (!skin) return res.status(404).json({ message: 'Nie znaleziono skina' });
    res.json({ data: skin });
});

module.exports = router;
