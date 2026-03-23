require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Konfiguracja sesji dla logowania Steam
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ustaw na `true` jeśli będziesz używać HTTPS w produkcji
}));

// Inicjalizacja Passporta
app.use(passport.initialize());
app.use(passport.session());

// Middleware
// Akceptuje języki z nagłówków (pl, en(default), ru, zh, uk, sv)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Przepuszczaj porty Vite
    credentials: true                // Wymagane dla pasujących ciasteczek sesyjnych
}));
app.use(express.json());

app.use((req, res, next) => {
    const lang = req.headers['accept-language'] || 'en';
    req.lang = lang; // Możemy to przekazywać do bazy/modeli
    next();
});

// Importy tras (Routers) dla każdej podstrony
const authRoutes = require('./routes/auth');
const analyzerRoutes = require('./routes/analyzer');
const inventoryRoutes = require('./routes/inventory');
const p2pMarketRoutes = require('./routes/marketP2p');
const steamMarketRoutes = require('./routes/marketSteam');

// Import Service do asynchronicznego pobierania danych ze Steama
const { startSteamScraper } = require('./services/steamFetcher');

// 0. Autoryzacja Steam (OpenID)
app.use('/api/auth', authRoutes);

// 1. Analizer Rynku (wykresy, przewidywania)
app.use('/api/analyzer', analyzerRoutes); 

// 2. Baza Danych Skórek
const skinsDbRoutes = require('./routes/skinsDb');
app.use('/api/database/skins', skinsDbRoutes);

// 3. Analizator Ekwipunku
app.use('/api/inventory', inventoryRoutes);

// 4. Marketplace: Gracze dla Graczy
app.use('/api/marketplace-p2p', p2pMarketRoutes); 

// 5. Lepszy Steam Market (Filtrowanie ofert ze Steam z dokładnymi filtrami)
app.use('/api/marketplace-steam', steamMarketRoutes); 

app.get('/', (req, res) => {
    res.json({ message: 'Steam Market Analyzer API is running!' });
});

// Uruchomienie skryptów tła
startSteamScraper();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
