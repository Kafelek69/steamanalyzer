const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const pool = require('../db');
const router = express.Router();

// Serializacja użytkownika (zapis id do sesji)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserializacja użytkownika (odczyt z sesji i pobranie z bazy danych)
passport.deserializeUser(async (user, done) => {
    done(null, user);
});

// Konfiguracja strategii połączenia ze Steam API
passport.use(new SteamStrategy({
    returnURL: `${process.env.BASE_URL}/api/auth/steam/return`,
    realm: `${process.env.BASE_URL}/`,
    apiKey: process.env.STEAM_API_KEY
}, async (identifier, profile, done) => {
    try {
        const steamId = profile.id;
        const displayName = profile.displayName;
        const avatar = profile.photos[2]?.value || ''; // Największy rozmiar avatara

        // Zamiast uzywać twardej bazy PostgreSQL (żebyście nie mieli błędów gdy baza nie jest włączona),
        // w fazie prototypu używamy mockowego obiektu usera
        const mockUser = {
            id: 1,
            steam_id: steamId,
            display_name: displayName,
            avatar_url: avatar,
            plan_type: 'PREMIUM'
        };
        
        return done(null, mockUser);
    } catch (err) {
        return done(err, null);
    }
}));

// Endpoint inicjujący logowanie Steam
router.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }));

// Callbac po autoryzacji Steam
router.get('/steam/return', 
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        // Po udanym zalogowaniu przekierowuje użytkownika na strone frontendu (np. /dashboard)
        res.redirect(process.env.CLIENT_URL);
    }
);

// Posiadanie danych zalogowanego użytkownika (do pobrania na froncie)
router.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.status(401).json({ authenticated: false, message: 'Nie jesteś zalogowany' });
    }
});

// Wylogowanie
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;