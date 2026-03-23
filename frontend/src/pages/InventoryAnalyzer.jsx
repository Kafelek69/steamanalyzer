import { useState } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { formatItemNameWithCondition } from '../utils/floatHelpers';

function InventoryAnalyzer() {
    const { formatPrice, language, t } = useSettings();
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
            setError(err.response?.data?.error || "Wyst¹pi³ b³¹d komunikacji z serwerem.");
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
                <p className="text-brand-muted mb-6">WprowadŸ SteamID64 lub link do profilu, aby wyceniæ swój ekwipunek i sprawdziæ jego potencja³ zysku.</p>
                
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
                    {/* Statystyki Profilu */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">ILOŒÆ SKANOWANYCH ITEMÓW</div>
                            <div className="text-4xl font-bold text-white">{inventoryData.itemsCount}</div>
                        </div>
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">{t('dashboard.totalValue') || '£¥CZNA WARTOŒÆ RYNKOWA'}</div>
                            <div className="text-4xl font-bold text-brand-accent">{formatPrice(inventoryData.totalValue)}</div>
                        </div>
                        <div className="cs-panel p-6 rounded text-center border-b-4 border-brand-accent">
                            <div className="text-brand-muted font-bold mb-2">{t('dashboard.aiForecast')}</div>
                            <div className="text-2xl font-bold text-brand-accent mt-2">{inventoryData.prediction}</div>
                        </div>
                    </div>

                    {/* Lista Przedmiotów */}
                    <div className="cs-panel p-6 rounded">
                        <h2 className="text-2xl font-bold border-b border-brand-accent pb-2 mb-6 text-brand-text">
                            ZAWartoœæ Inwentarza (Sortowane po cenie)
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {inventoryData.data.map((item, idx) => (
                                <div key={idx} className="bg-brand-base border border-gray-700/50 rounded-lg overflow-hidden group hover:border-brand-accent transition-colors duration-300 relative">
                                    {/* Górne oznaczenia */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 text-right items-end">
                                        <div className={`text-xs font-bold bg-gray-900/80 px-2 py-0.5 rounded ${
                                            item.rarity === 'Covert' ? 'text-red-500' :
                                            item.rarity === 'Classified' ? 'text-pink-500' :
                                            item.rarity === 'Restricted' ? 'text-purple-500' :
                                            item.rarity === 'Mil-Spec' ? 'text-blue-500' :
                                            item.rarity === 'Industrial Grade' ? 'text-blue-300' :
                                            item.rarity === 'Contraband' ? 'text-yellow-500' :
                                            'text-gray-400'
                                        }`}>{item.rarity.toUpperCase()}</div>
                                        {item.trend === "UP" && <div className="text-[10px] font-bold text-green-400 bg-green-900/50 px-2 py-0.5 rounded border border-green-500/50"><i className="fa-solid fa-arrow-trend-up"></i> ROŒNIE</div>}
                                        {item.trend === "DOWN" && <div className="text-[10px] font-bold text-red-400 bg-red-900/50 px-2 py-0.5 rounded border border-red-500/50"><i className="fa-solid fa-arrow-trend-down"></i> SPADA</div>}
                                    </div>
                                    
                                    <div className="h-32 bg-gradient-to-b from-gray-800 to-gray-900 flex justify-center items-center p-4">
                                        <img src={item.imageUrl} alt={item.itemName} className="h-full object-contain filter drop-shadow-lg" />
                                    </div>
                                    
                                    <div className="p-4 border-t border-gray-700">
                                        <div className="font-bold truncate text-white mb-2" title={item.itemName}>{formatItemNameWithCondition(item.itemName, item.float)}</div>
                                        
                                        {!item.isNonWearable ? (
                                            <div className="flex justify-between items-center text-xs">
                                                <div className="text-gray-400">Float: <span className="text-white font-mono">{(typeof item.float === "number" ? item.float.toFixed(6) : "N/A")}</span></div>
                                                <div className="text-gray-400">Seed: <span className="text-white font-mono">{item.pattern}</span></div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500 italic">Brak parametru float</div>
                                        )}
                                        
                                        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-lg">
                                            <span className="text-gray-400 text-sm">{t('controls.priceEst')}:</span>
                                            <span className="font-bold text-brand-accent">{formatPrice(item.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default InventoryAnalyzer;
