const express = require('express');
const router = express.Router();

let p2pListings = [];
const mockUsers = [
    { name: "s1mple_fan", avatar: "https://avatars.steamstatic.com/b5bd56c1346484e565985b98ec342b404d026723_full.jpg" },
    { name: "pashabiceps_pl", avatar: "https://avatars.steamstatic.com/6c201646702e525164ca06a4b162f84a44bcf2cc_full.jpg" },
    { name: "Tense1983", avatar: "https://avatars.steamstatic.com/d83765e94b29bb6fd0bfefcb4a3e79e6fdd12328_full.jpg" },
    { name: "donk_enjoyer", avatar: "https://avatars.steamstatic.com/71ddfa3bb13ae60aa4ee436ff0125c115456f917_full.jpg" },
    { name: "NEO_BEAST", avatar: "https://avatars.steamstatic.com/e58f000b1a0adba1ac8cb5a3d085956041abcf18_full.jpg" },
    { name: "Kjaerbye", avatar: "https://avatars.steamstatic.com/956eb41e6c38b2bb4ef1173aa598eceadd7f5492_full.jpg" },
    { name: "GabeN_Himself", avatar: "https://avatars.steamstatic.com/8f8af05eb0dfb8d2bb2d9c02d187265be797fcb5_full.jpg" },
    { name: "OlofMeister", avatar: "https://avatars.steamstatic.com/f9c8f00b1a0adba1ac8cb5a3d085956041abcf18_full.jpg" }
];

const mockItems = [
    { name: "AK-47 | Redline (Field-Tested)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV092lnYmGmOHLPr7Vn35cpsBzi-rD84ig3FC1qEJuZ2n3cdTGdwVqM1CC_ADtxe_shJLq7cifnSZjvyg8pSGKsA_jJhg", basePrice: 45.50 },
    { name: "AWP | Asiimov (Field-Tested)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q4yCkP_gfeiHwz8DsoMh3u2Y9N6s3gaw_hI9amCicIQWdgY2MEGH8ljrxOu7gMC87cmdwXdiunQnsHndnAv330-Jd_dnhg", basePrice: 280.00 },
    { name: "? Butterfly Knife | Fade (Factory New)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1OrYYiRx0925noSPl_H_N4XEl3kEtsNzi7iS9t_00AThrko6Zz-gcteSdwU7aFzX-AG6le6-1Je974nOyHdimCkr5HzclhO0gA", basePrice: 13500.00 },
    { name: "M4A1-S | Printstream (Field-Tested)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09Kzm7-FmP7mDLbUkmJE5Ytzj-zF89ilxlCzqRVoa2H0J4bEIwZrYAjZrlTqwL26gsW87s-eyXFhvj5iuygXq0aQ9w", basePrice: 420.00 },
    { name: "Glock-18 | Fade (Factory New)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73cCxX7eOwmIWInOTxOr3UhD1Vv5Vwi-DGot_ziwGwqUYua2nxLNPHclBqZwzR_Fe_kbrsgZe5vcyYynph7nEks3jUgxj-rB80V60", basePrice: 4300.00 },
    { name: "Desert Eagle | Blaze (Minimal Wear)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxN4Tdn2xZ_Ish0u3A9Nmh2A22rktwYGvzLI7CcwdsaA2Eq1ftlOu5gJa7tZWfydnyxndnpGB8snzZ1xE_MQ", basePrice: 750.00 },
    { name: "? Karambit | Doppler (Factory New)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2OTEaRZn_82mhp2ImeXnL4TOkXlI_ct-i-rDrJShxkCy-EA4MjzyJYfDIFJpZgvRrFS3yO3rhZC87sidznRl63Ym-z-DyP2h82g", basePrice: 5120.00 },
    { name: "USP-S | Kill Confirmed (Factory New)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh-PmDLPIqW1Q5cZuh-nE8tP3jATg80RkMWv3INTHe1c9NV3R81jvwrvmgJ_tvJ_BnScwuyJz-z-DyORyH0Y", basePrice: 650.00 },
    { name: "AK-47 | Slate (Battle-Scarred)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09m5gZOMqPv9NLPF2G1XvceN88pmiLrHp9qn3VcwYm6nIIPEdgRrZA6CqFntxr_shsO-uJnKnHNlvyEl-z-DyOKM0P2O", basePrice: 8.50 },
    { name: "? Specialist Gloves | Crimson Kimono (Field-Tested)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfk2xX18l4jeHVu43zjQKxrkU9NjiiLNfBJFA8YVnVqFC7wru-hsPouMyamyRlv3Igsyvam0G_hx5OaeM", basePrice: 4200.00 },
    { name: "Souvenir AWP | Dragon Lore (Factory New)", img: "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FA957P3dcjFH7c6JhIW0m_7zO6_ummpD78A_3b_A8Nrw2lDm_hBsZjzwIICVIwI_ZV_V-ATrlO-8hMC4tcubmHJh6CEn5HzfgBw-Sg", basePrice: 500000.00 }
];

function generateMockListings() {
    p2pListings = [];
    for (let i = 0; i < 80; i++) {
        let seller = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        let baseItem = mockItems[Math.floor(Math.random() * mockItems.length)];
        
        // Ensure some items have stickers and charms
        const hasMockStickers = Math.random() > 0.6;
        const hasMockCharms = Math.random() > 0.8;
        
        let itemStickers = [];
        if (hasMockStickers) {
            itemStickers.push({ name: "Sticker | Titan (Holo) | Katowice 2014" });
        }
        
        let itemCharms = [];
        if (hasMockCharms) {
            itemCharms.push({ name: "Charm | Diamond" });
        }

        let isStatTrak = baseItem.name.includes("?") ? false : Math.random() > 0.7;
        let isSouvenir = baseItem.name.includes("Souvenir");
        if(isSouvenir) isStatTrak = false;

        let pName = isStatTrak ? "StatTrak™ " + baseItem.name : baseItem.name;
        let float = 0.5; if (baseItem.name.includes("Factory New")) { float = 0.001 + Math.random() * 0.068; } else if (baseItem.name.includes("Minimal Wear")) { float = 0.07 + Math.random() * 0.079; } else if (baseItem.name.includes("Field-Tested")) { float = 0.15 + Math.random() * 0.229; } else if (baseItem.name.includes("Well-Worn")) { float = 0.38 + Math.random() * 0.069; } else if (baseItem.name.includes("Battle-Scarred")) { float = 0.45 + Math.random() * 0.549; }
        
        let rarityLabel = baseItem.name.includes("?") ? "Covert" : "Classified";
        if (baseItem.name.includes("Redline") || baseItem.name.includes("Slate")) rarityLabel = "Restricted";
        if (baseItem.name.includes("Asiimov") || baseItem.name.includes("Printstream") || baseItem.name.includes("Kill Confirmed")) rarityLabel = "Covert";

        let p2pPrice = baseItem.basePrice * (0.85 + Math.random() * 0.15);
        if (isStatTrak) p2pPrice *= 1.5;

        p2pListings.push({
            id: 'P2P_' + Math.random().toString(36).substr(2, 9),
            seller: {
                name: seller.name + (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : ""),
                avatar: seller.avatar,
                trustLevel: Math.floor(Math.random() * 100)
            },
            item: {
                name: pName,
                img: baseItem.img,
                float: float,
                pattern: Math.floor(Math.random() * 1000),
                rarity: rarityLabel,
                isStatTrak: isStatTrak,
                isSouvenir: isSouvenir,
                stickers: itemStickers,
                charms: itemCharms
            },
            price: parseFloat(p2pPrice.toFixed(2)),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
        });
    }
}
generateMockListings();

router.get('/listings', (req, res) => {
    let { 
        search, minPrice, maxPrice, sortBy,
        wearMin, wearMax, isStatTrak, isSouvenir,
        weapon, rarity, hasStickers, hasCharms, pattern
    } = req.query;
    
    let results = [...p2pListings];

    if (search) results = results.filter(req => req.item.name.toLowerCase().includes(search.toLowerCase()));
    if (minPrice) results = results.filter(req => req.price >= parseFloat(minPrice));
    if (maxPrice) results = results.filter(req => req.price <= parseFloat(maxPrice));
    
    if (wearMin) results = results.filter(req => req.item.float >= parseFloat(wearMin));
    if (wearMax) results = results.filter(req => req.item.float <= parseFloat(wearMax));
    
    if (isStatTrak === 'true') results = results.filter(req => req.item.isStatTrak);
    if (isSouvenir === 'true') results = results.filter(req => req.item.isSouvenir);
    if (hasStickers === 'true') results = results.filter(req => req.item.stickers && req.item.stickers.length > 0);
    if (hasCharms === 'true') results = results.filter(req => req.item.charms && req.item.charms.length > 0);
    
    if (weapon) {
        results = results.filter(req => req.item.name.toLowerCase().includes(weapon.toLowerCase()));
    }
    
    if (rarity) {
        results = results.filter(req => req.item.rarity.toLowerCase() === rarity.toLowerCase());
    }

    if (pattern) {
        results = results.filter(req => req.item.pattern.toString() === pattern.toString());
    }

    if (sortBy === 'price_asc') results.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price);
    else if (sortBy === 'wear_asc') results.sort((a, b) => a.item.float - b.item.float);
    else if (sortBy === 'wear_desc') results.sort((a, b) => b.item.float - a.item.float);
    else results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(results);
});

router.post('/buy/:id', (req, res) => {
    const { id } = req.params;
    const index = p2pListings.findIndex(listing => listing.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Przedmiot zosta³ ju¿ sprzedany lub nie istnieje!" });
    }

    const boughtItem = p2pListings[index];
    p2pListings.splice(index, 1);

    res.json({ 
        success: true, 
        message: "Z powodzeniem zakupiono przedmiot " + boughtItem.item.name + " od gracza " + boughtItem.seller.name + "! Zap³acono " + boughtItem.price + " PLN.",
        item: boughtItem
    });
});

module.exports = router;


router.post('/list', (req, res) => {
    const { item, price, seller } = req.body;
    if (!item || !price) return res.status(400).json({error: 'Missing data'});

    const newListing = {
        id: Date.now().toString(),
        seller: seller || mockUsers[0],
        item: item,
        price: parseFloat(price),
        listedAt: new Date().toISOString(),
        discount: 0,
        provider: 'Local'
    };
    p2pListings.unshift(newListing);
    res.json({success: true, listing: newListing});
});
