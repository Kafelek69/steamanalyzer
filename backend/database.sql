-- Tworzenie tabeli uzytkownikow (logowanie przez Steam)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    plan_type VARCHAR(50) DEFAULT 'FREE', -- 'FREE' or 'PREMIUM'
    notify_count_this_week INT DEFAULT 0, -- Do sprawdzania darmowego limitu (5 na tydzień)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Baza wszystkich skorek z opcjami potrzebnymi pod potężne filtrowanie
CREATE TABLE IF NOT EXISTS skins (
    id SERIAL PRIMARY KEY,
    market_hash_name VARCHAR(255) NOT NULL UNIQUE,
    weapon VARCHAR(100),         -- np. 'M4A1-S', 'Karambit'
    skin_name VARCHAR(100),      -- np. 'Printstream', 'Fade'
    rarity VARCHAR(50),          -- np. 'Covert', 'Mil-Spec'
    collection VARCHAR(100),     -- np. 'The Fracture Collection'
    is_stattrak BOOLEAN DEFAULT false,
    is_souvenir BOOLEAN DEFAULT false
);

-- Przykładowe zapisywanie rynkowych ofert P2P
CREATE TABLE IF NOT EXISTS p2p_listings (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    skin_id INT REFERENCES skins(id) ON DELETE CASCADE,
    price_pln DECIMAL(10, 2) NOT NULL,
    wear_float DECIMAL(10, 9),    -- Float, np. 0.015
    pattern_seed INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historia cen pod wykresy i AI
CREATE TABLE IF NOT EXISTS skin_price_history (
    id SERIAL PRIMARY KEY,
    skin_id INT REFERENCES skins(id) ON DELETE CASCADE,
    lowest_price DECIMAL(10, 2),
    median_price DECIMAL(10, 2),
    volume INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela przechowujaca anomanlie ktorych my wyciagamy powiadomienia do userow
CREATE TABLE IF NOT EXISTS anomalies (
    id SERIAL PRIMARY KEY,
    skin_id INT REFERENCES skins(id) ON DELETE CASCADE,
    reason VARCHAR(255),
    previous_volume DECIMAL(10,2),
    new_volume DECIMAL(10,2),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);