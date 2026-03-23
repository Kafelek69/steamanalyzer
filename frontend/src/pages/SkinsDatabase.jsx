import { useSettings } from '../context/SettingsContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function SkinsDatabase() {
    const { t } = useSettings();
    const [skins, setSkins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWeapon, setSelectedWeapon] = useState('');

    const weapons = [
        t('skins.weaponAll'),
        "AK-47", "M4A4", "M4A1-S", "AWP", "USP-S", "Glock-18", "Desert Eagle",
        "P2000", "P250", "Dual Berettas", "Tec-9", "Five-SeveN", "CZ75-Auto", "R8 Revolver",
        "FAMAS", "Galil AR", "AUG", "SG 553", "SSG 08", "G3SG1", "SCAR-20",
        "MAC-10", "MP9", "MP7", "MP5-SD", "UMP-45", "P90", "PP-Bizon",
        "Nova", "XM1014", "MAG-7", "Sawed-Off", "M249", "Negev",
        "Karambit", "Butterfly Knife", "M9 Bayonet", "Bayonet", "Talon Knife", "Skeleton Knife", "Nomad Knife", "Survival Knife", "Paracord Knife", "Classic Knife", "Kukri Knife", "Ursus Knife", "Stiletto Knife", "Navaja Knife", "Bowie Knife", "Huntsman Knife", "Falchion Knife", "Flip Knife", "Gut Knife", "Shadow Daggers",
        "Sport Gloves", "Specialist Gloves", "Moto Gloves", "Hand Wraps", "Driver Gloves", "Bloodhound Gloves", "Broken Fang Gloves", "Hydra Gloves",
        "Zeus x27"
    ];

    useEffect(() => {
        fetchSkins();
    }, [searchQuery, selectedWeapon]);

    const fetchSkins = async () => {
        setLoading(true);
        try {
            const params = { limit: 'all' };
            if (searchQuery) params.search = searchQuery;
            if (selectedWeapon && selectedWeapon !== t('skins.weaponAll')) params.weapon = selectedWeapon;

            const response = await axios.get('http://localhost:5000/api/database/skins', { params });
            setSkins(response.data.data);
        } catch (error) {
            console.error("Błąd ładowania bazy skórek:", error);
        }
        setLoading(false);
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'Covert': return 'text-red-500 border-red-500';
            case 'Classified': return 'text-pink-500 border-pink-500';
            case 'Restricted': return 'text-purple-500 border-purple-500';
            case 'Mil-Spec': return 'text-blue-500 border-blue-500';
            default: return 'text-gray-400 border-gray-400';
        }
    };

    return (
        <div className="flex flex-col gap-6 uppercase">
            {/* Header i Wyszukiwarka */}
            <div className="cs-panel p-6 rounded flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-brand-accent text-glow">{t('skins.title')}</h2>
                    <div className="text-brand-muted text-sm font-semibold tracking-widest mt-1">{t('skins.subtitle')}</div>
                </div>
                
                <div className="flex w-full md:w-1/2 gap-3">
                    <div className="relative w-full">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="{t('skins.search')}" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-brand-base border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white outline-none focus:border-brand-accent transition shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Szybkie Filtry Broni */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {weapons.map(w => (
                    <button 
                        key={w === 'Wszystkie' ? t('skins.weaponAll') : w}
                        onClick={() => setSelectedWeapon(w)}
                        className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition border ${
                            selectedWeapon === w || (selectedWeapon === '' && w === t('skins.weaponAll'))
                            ? 'bg-brand-accent text-brand-base border-brand-accent' 
                            : 'bg-brand-base text-gray-300 border-gray-700 hover:border-brand-accent hover:text-brand-accent'
                        }`}
                    >
                        {w === 'Wszystkie' ? t('skins.weaponAll') : w}
                    </button>
                ))}
            </div>

            {/* Galeria Skórek */}
            {loading ? (
                <div className="text-center py-20 text-brand-muted text-xl animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('skins.loading') || 'Ładowanie bazy danych...'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {skins.length > 0 ? skins.map(skin => (
                        <div key={skin.id} className="cs-panel rounded-lg overflow-hidden group cursor-pointer hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all">
                            {/* Obrazek skina */}
                            <div className="h-40 bg-gradient-to-b from-gray-800 to-[rgba(15,23,42,0.8)] relative flex justify-center items-center p-4">
                                <img loading="lazy" src={skin.image} alt={skin.name} className="h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            
                            {/* Opis */}
                            <div className={`p-4 border-t-2 ${getRarityColor(skin.rarity).split(' ')[1]}`}>
                                <div className="text-xs text-gray-400 font-bold mb-1">{skin.weapon}</div>
                                <div className="text-lg font-bold text-white truncate">{skin.name}</div>
                                <div className="mt-2 text-[10px] text-gray-500 truncate">{skin.collection}</div>
                                <div className={`mt-1 text-xs font-bold ${getRarityColor(skin.rarity).split(' ')[0]}`}>
                                    {skin.rarity.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-500 font-bold text-lg">
                            {t('skins.notFound') || 'Brak wyników'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SkinsDatabase;