const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Analizer rynku: Przewidywania AI 24h / 7d / Wszystkie powiadomienia." });
});

module.exports = router;
