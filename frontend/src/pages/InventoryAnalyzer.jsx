import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { formatItemNameWithCondition } from '../utils/floatHelpers';

// Komponent do pojedynczego paska postępu floata i dociągania go z backendu w locie
function ItemCard({ item }) {
    const { formatPrice, t } = useSettings();
    const [floatData, setFloatData] = useState({
        float: item.float,
        pattern: item.pattern,
        itemName: item.itemName,
        loading: !item.isNonWearable && item.float === null
    });

    useEffect(() => {
        let isMounted = true;
        
        async function fetchFloat() {
            if (!item.isNonWearable && item.float === null && item.inspectLink) {
                try {
                    // Szybki timeout po stronie klienta - 15s max (nie ma sensu dluzej czekac)
                    const res = await axios.get(`http://localhost:5000/api/inventory/float`, {
                        params: { inspectLink: item.inspectLink, baseName: item.itemName },
                        timeout: 15000
                    });
                    if (isMounted && res.data) {
                        setFloatData({
                            float: res.data.float,
                            pattern: res.data.pattern,
                            itemName: res.data.itemName,
                            loading: false
                        });
                    }
                } catch (e) {
                    if (isMounted) {
                        setFloatData(prev => ({ ...prev, loading: false }));
                    }
                }
            }
        }
        
        if (floatData.loading) {
            fetchFloat();
        }

        return () => { isMounted = false; };
    }, [item]);

    const displayFloat = floatData.float != null && !isNaN(floatData.float) ? Number(floatData.float).toFixed(6) : "N/A";
    const displayName = formatItemNameWithCondition(floatData.itemName, floatData.float);
    
    return (
        <div className="bg-brand-base border border-gray-700/50 rounded-lg overflow-hidden group hover:border-brand-accent transition-colors duration-300 relative flex flex-col h-full">
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 text-right items-end">
                <div className={`text-xs font-bold bg-gray-900/80 px-2 py-0.5 rounded ${
                    item.rarity === 'Covert' ? 'text-red-500' :
                    item.rarity === 'Classified' ? 'text-pink-500' :
                    item.rarity === 'Restricted' ? 'text-purple-500' :
                    item.rarity === 'Mil-Spec' ? 'text-blue-500' :
                    item.rarity === 'Industrial Grade' ? 'text-blue-300' :
                    item.rarity === 'Contraband' ? 'text-yellow-500' :
                    'text-gray-400'
                }`}>{item.rarity ? item.rarity.toUpperCase() : 'ZWYKŁY'}</div>
                {item.trend === "UP" && <div className="text-[10px] font-bold text-green-400 bg-green-900/50 px-2 py-0.5 rounded border border-green-500/50"><i className="fa-solid fa-arrow-trend-up"></i> ROŚNIE</div>}
                {item.trend === "DOWN" && <div className="text-[10px] font-bold text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/50"><i className="fa-solid fa-arrow-trend-down"></i> SPADA</div>}
            </div>
            
            <div className="h-32 bg-gradient-to-b from-gray-800 to-gray-900 flex justify-center items-center p-4 min-h-[128px]">
                <img src={item.imageUrl} alt={displayName} className="max-h-full max-w-full object-contain filter drop-shadow-lg" />
            </div>
            
            <div className="p-4 border-t border-gray-700 flex flex-col flex-1">
                <div className="font-bold truncate text-white mb-2 text-sm" title={displayName}>{displayName}</div>
                
                {!item.isNonWearable ? (
                    <div className="flex justify-between items-center text-xs mb-2">
                        <div className="text-gray-400">
                            Float: 
                            {floatData.loading ? (
                                <span className="text-brand-accent ml-1 animate-pulse"><i className="fa-solid fa-spinner fa-spin"></i></span>
                            ) : (
                                <span className="text-white font-mono ml-1">{displayFloat}</span>
                            )}
                        </div>
                        <div className="text-gray-400">
                            Seed: 
                            {floatData.loading ? (
                                <span className="text-brand-accent ml-1 animate-pulse"><i className="fa-solid fa-spinner fa-spin"></i></span>
                            ) : (
                                <span className="text-white font-mono ml-1">{floatData.pattern != null ? floatData.pattern : "N/A"}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-gray-500 italic mb-2">Brak parametru float</div>
                )}
                
                <div className="mt-auto pt-3 border-t border-gray-800 flex justify-between items-center text-lg">
                    <span className="text-gray-400 text-sm">{t('controls.priceEst')}:</span>
                    <span className="font-bold text-brand-accent">{formatPrice(item.price)}</span>
                </div>
            </div>
        </div>
    );
}

function InventoryAnalyzer() {
    const { formatPrice, t } = useSettings();
    const [target, setTarget] = useState('');
    const [inventoryData, setInventoryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!target) return;
        
        setLoading(true);
        setError(null);
        setInventoryData(null);

        try {
            const response = await axios.get('http://localhost:5000/api/inventory/analyze', {
                params: { target }
            });
            setInventoryData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Wystąpił błąd komunikacji z serwerem.");
        }
        
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 uppercase">
            <div className="cs-panel p-6 rounded shadow-lg text-center">
                <h1 className="text-3xl font-bold text-brand-text mb-2">
                    <i className="fa-solid fa-magnifying-glass-chart text-brand-accent mr-3"></i>
                    {t('inventory.title')} CS2
                </h1>
                <p className="text-brand-muted mb-6">Wprowadź SteamID64 lub link do profilu, aby wycenić swój ekwipunek i sprawdzić jego potencjał zysku.</p>
                
                <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <i className="fa-brands fa-steam absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                        <input 
                            type="text" 
                            value={target} 
                            onChange={(e) => setTarget(e.target.value)} 
                            placeholder="np. 76561198... lub https://steamcommunity.com/id/..." 
                            className="w-full pl-12 pr-4 py-4 bg-brand-base border border-gray-700 rounded text-white outline-none focus:border-brand-accent transition text-lg"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="px-8 py-4 bg-brand-base border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-base transition font-bold rounded shadow-lg disabled:opacity-50">
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "SKANUJ"}
                    </button>
                </form>

                {error && (
                    <div className="max-w-2xl mx-auto mt-6 bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded text-left">
                        <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                    </div>
                )}
            </div>

            {loading && (
                <div className="text-center py-20 text-brand-muted text-xl animate-pulse">
                    Trwa pobieranie przedmiotów ze Steam...
                </div>
            )}

            {inventoryData && !loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">ILOŚĆ SKANOWANYCH ITEMÓW</div>
                            <div className="text-4xl font-bold text-white">{inventoryData.itemsCount}</div>
                        </div>
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">{t('dashboard.totalValue') || 'ŁĄCZNA WARTOŚĆ RYNKOWA'}</div>
                            <div className="text-4xl font-bold text-brand-accent">{formatPrice(inventoryData.totalValue)}</div>
                        </div>
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">{t('dashboard.aiForecast')}</div>
                            <div className="text-2xl font-bold text-brand-accent mt-2">{inventoryData.prediction}</div>
                        </div>
                    </div>

                    <div className="cs-panel p-6 rounded">
                        <h2 className="text-2xl font-bold border-b border-brand-accent pb-2 mb-6 text-brand-text">
                            Zawartość inwentarza (Sortowane po cenie)
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {inventoryData.data.map((item, idx) => (
                                <ItemCard key={idx} item={item} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default InventoryAnalyzer;