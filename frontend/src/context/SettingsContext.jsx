import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { translations } from '../utils/translations';

const SettingsContext = createContext();

export function useSettings() {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
    const { user } = useAuth();

    const getSetting = (key, defaultVal) => {
        const prefix = user ?  'user_' + user.steam_id + '_' : '';
        const val = localStorage.getItem(prefix + key) || localStorage.getItem(key);
        if (val === 'undefined' || val === 'null' || val === null) return defaultVal;
        return val;
    };

    const [theme, setTheme] = useState('dark');
    const [currency, setCurrency] = useState('PLN');
    const [language, setLanguage] = useState('PL');

    useEffect(() => {
        setTheme(getSetting('theme', 'dark'));
        
        let savedCurrency = getSetting('currency', 'PLN');
        if (!['PLN', 'EUR', 'USD'].includes(savedCurrency)) savedCurrency = 'PLN';
        setCurrency(savedCurrency);
        
        let savedLang = getSetting('language', 'PL');
        if (!['PL', 'EN'].includes(savedLang)) savedLang = 'PL';
        setLanguage(savedLang);
    }, [user]);

    const saveSetting = (key, val) => {
        const prefix = user ? 'user_' + user.steam_id + '_' : '';
        localStorage.setItem(prefix + key, val);
        if (!user) localStorage.setItem(key, val);
    };

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
        }
        saveSetting('theme', theme);
    }, [theme, user]);

    useEffect(() => {
        if (['PLN', 'EUR', 'USD'].includes(currency)) {
            saveSetting('currency', currency);
        }
    }, [currency, user]);

    useEffect(() => {
        if (['PL', 'EN'].includes(language)) {
            saveSetting('language', language);
        }
    }, [language, user]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const formatPrice = (amountPLN) => {
        try {
            const amount = parseFloat(amountPLN) || 0;
            const rates = { PLN: 1, EUR: 0.23, USD: 0.25 };
            const safeCurrency = Object.keys(rates).includes(currency) ? currency : 'PLN';
            const converted = amount * rates[safeCurrency];
            return new Intl.NumberFormat(language === 'EN' ? 'en-US' : 'pl-PL', {
                style: 'currency',
                currency: safeCurrency
            }).format(converted);
        } catch (err) {
            console.error(err);
            return amountPLN + ' PLN';
        }
    };

    const t = (path) => {
        try {
            if (!path) return '';
            const keys = path.split('.');
            let current = translations[language && translations[language] ? language : 'PL'];
            for (const key of keys) {
                if (!current || current[key] === undefined) return path;
                current = current[key];
            }
            return current;
        } catch (err) {
            return path;
        }
    };

    return (
        <SettingsContext.Provider value={{
            theme, toggleTheme,
            currency, setCurrency,
            language, setLanguage,
            formatPrice, t
        }}>
            {children}
        </SettingsContext.Provider>
    );
}
