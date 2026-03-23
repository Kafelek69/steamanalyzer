import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { formatItemNameWithCondition } from '../utils/floatHelpers';

function EnhancedMarket() {
    const { formatPrice, language, t } = useSettings();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [start, setStart] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    
    // Stany dla rozbudowanych filtrów rynkowych
    const [filters, setFilters] = useState({
        minPrice: '', maxPrice: '',
        wearMin: '', wearMax: '',
        isStatTrak: false, isSouvenir: false,
        weapon: '', rarity: '',
        hasStickers: false, hasCharms: false,
        pattern: '',
        sortBy: 'popular'
    });

    const fetchListings = async (isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true);
            setStart(0);
        } else {
            setLoadingMore(true);
        }

        const currentStart = isLoadMore ? start + 100 : 0;

        try {
            const response = await axios.get('http://localhost:5000/api/marketplace-steam/listings', {
                params: { ...filters, start: currentStart, count: 100 }
            });
            
            if (isLoadMore) {
                setListings(prev => [...prev, ...response.data.data]);
            } else {
                setListings(response.data.data);
            }
            
            setTotalCount(response.data.total_steam_count || 0);
            setStart(currentStart);
        } catch (error) {
            console.error("Błąd pobierania ofert:", error);
        }
        
        setLoading(false);
        setLoadingMore(false);
    };

    useEffect(() => {
        fetchListings();
    }, []); // Początkowe ładowanie

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="grid grid-cols-12 gap-6 uppercase">
            {/* Sidebar (Filtry) - col-span-3 */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="cs-panel p-5 rounded">
                    <h2 className="text-2xl font-bold border-b border-brand-accent pb-2 mb-4 text-brand-text flex items-center justify-between">
                        <span>{t('market.filters')}</span>
                        <i className="fa-solid fa-filter text-brand-accent text-sm"></i>
                    </h2>
                    
                    {/* {t('market.sort')} */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.sort')}</label>
                        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                            <option value="popular">Najpopularniejsze</option>
                            <option value="price_asc">Cena (Rosnąco)</option>
                            <option value="price_desc">Cena (Malejąco)</option>
                            <option value="wear_asc">Float / Zużycie (Rosnąco)</option>
                            <option value="wear_desc">Float / Zużycie (Malejąco)</option>
                        </select>
                    </div>

                    {/* Cena */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.price') || 'Cena'}</label>
                        <div className="flex gap-2">
                            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder={t('market.minPrice')} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder={t('market.maxPrice')} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                        </div>
                    </div>

                    {/* Zużycie (Wear - Float) */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.floatRange') || 'Zużycie (Float 0.0 - 1.0)'}</label>
                        <div className="flex gap-2">
                            <input type="number" step="0.01" name="wearMin" value={filters.wearMin} onChange={handleFilterChange} placeholder="0.00" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                            <input type="number" step="0.01" name="wearMax" value={filters.wearMax} onChange={handleFilterChange} placeholder="1.00" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                        </div>
                    </div>

                    {/* Broń */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.weapon')}</label>
                        <select name="weapon" value={filters.weapon} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                            <option value="">{t('market.weaponAll')}</option>
                            <optgroup label="Pistolety">
                                <option value="Glock-18">Glock-18</option>
                                <option value="USP-S">USP-S</option>
                                <option value="P2000">P2000</option>
                                <option value="P250">P250</option>
                                <option value="Dual Berettas">Dual Berettas</option>
                                <option value="Tec-9">Tec-9</option>
                                <option value="Five-SeveN">Five-SeveN</option>
                                <option value="CZ75-Auto">CZ75-Auto</option>
                                <option value="Desert Eagle">Desert Eagle</option>
                                <option value="R8 Revolver">R8 Revolver</option>
                            </optgroup>
                            <optgroup label="Karabiny">
                                <option value="Galil AR">Galil AR</option>
                                <option value="FAMAS">FAMAS</option>
                                <option value="AK-47">AK-47</option>
                                <option value="M4A4">M4A4</option>
                                <option value="M4A1-S">M4A1-S</option>
                                <option value="SG 553">SG 553</option>
                                <option value="AUG">AUG</option>
                                <option value="AWP">AWP</option>
                                <option value="SSG 08">SSG 08</option>
                                <option value="G3SG1">G3SG1</option>
                                <option value="SCAR-20">SCAR-20</option>
                            </optgroup>
                            <optgroup label="PM-y">
                                <option value="MAC-10">MAC-10</option>
                                <option value="MP9">MP9</option>
                                <option value="MP7">MP7</option>
                                <option value="MP5-SD">MP5-SD</option>
                                <option value="UMP-45">UMP-45</option>
                                <option value="P90">P90</option>
                                <option value="PP-Bizon">PP-Bizon</option>
                            </optgroup>
                            <optgroup label="Ciężkie">
                                <option value="Nova">Nova</option>
                                <option value="XM1014">XM1014</option>
                                <option value="MAG-7">MAG-7</option>
                                <option value="Sawed-Off">Sawed-Off</option>
                                <option value="M249">M249</option>
                                <option value="Negev">Negev</option>
                            </optgroup>
                            <optgroup label="Noże">
                                <option value="Karambit">Karambit</option>
                                <option value="M9 Bayonet">M9 Bayonet</option>
                                <option value="Bayonet">Bayonet</option>
                                <option value="Butterfly Knife">Nóż motylkowy (Butterfly)</option>
                                <option value="Skeleton Knife">Nóż szkieletowy (Skeleton)</option>
                                <option value="Talon Knife">Szpon (Talon)</option>
                                <option value="Nomad Knife">Nóż nomady (Nomad)</option>
                                <option value="Survival Knife">Nóż survivalowy (Survival)</option>
                                <option value="Paracord Knife">Nóż z linką (Paracord)</option>
                                <option value="Ursus Knife">Nóż Ursus</option>
                                <option value="Stiletto Knife">Nóż klasyczny (Stiletto)</option>
                                <option value="Navaja Knife">Navaja</option>
                                <option value="Huntsman Knife">Nóż myśliwski (Huntsman)</option>
                                <option value="Bowie Knife">Nóż Bowie</option>
                                <option value="Falchion Knife">Nóż falcjon (Falchion)</option>
                                <option value="Shadow Daggers">Sztylety Cienia (Shadow Daggers)</option>
                                <option value="Gut Knife">Nóż z hakiem (Gut)</option>
                                <option value="Flip Knife">Nóż składany (Flip)</option>
                                <option value="Classic Knife">Nóż klasyczny CS:GO (Classic)</option>
                                <option value="Kukri Knife">Nóż Kukri</option>
                            </optgroup>
                            <optgroup label="Rękawice">
                                <option value="Hand Wraps">Owijki (Hand Wraps)</option>
                                <option value="Moto Gloves">Rękawice motocyklowe (Moto Gloves)</option>
                                <option value="Specialist Gloves">Rękawice specjalistyczne (Specialist Gloves)</option>
                                <option value="Sport Gloves">Rękawice sportowe (Sport Gloves)</option>
                                <option value="Bloodhound Gloves">Rękawice Bloodhound (Bloodhound Gloves)</option>
                                <option value="Driver Gloves">Rękawice samochodowe (Driver Gloves)</option>
                                <option value="Hydra Gloves">Rękawice Hydra (Hydra Gloves)</option>
                                <option value="Broken Fang Gloves">Rękawice Broken Fang</option>
                            </optgroup>
                            <optgroup label="Inne">
                                <option value="Case">Skrzynki (Cases)</option>
                                <option value="Capsule">Kapsuły (Capsules)</option>
                                <option value="Agent">Agenci (Agents)</option>
                                <option value="Music Kit">Zestawy muzyczne (Music Kits)</option>
                                <option value="Graffiti">Graffiti</option>
                                <option value="Patch">Naszywki (Patches)</option>
                                <option value="Pin">Przypinki (Pins)</option>
                                <option value="Pass">Przepustki (Passes)</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Rzadkość */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.rarity')}</label>
                        <select name="rarity" value={filters.rarity} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                            <option value="">{t('market.rarityAll')}</option>
                            <option value="Consumer Grade" className="text-gray-400">Consumer Grade</option>
                            <option value="Industrial Grade" className="text-blue-300">Industrial Grade</option>
                            <option value="Mil-Spec" className="text-blue-600">Mil-Spec</option>
                            <option value="Restricted" className="text-purple-500">Restricted</option>
                            <option value="Classified" className="text-pink-500">Classified</option>
                            <option value="Covert" className="text-red-500">Covert</option>
                            <option value="Contraband" className="text-yellow-600">Contraband</option>
                        </select>
                    </div>

                    {/* Pattern */}
                    <div className="mb-4">
                        <label className="block text-brand-muted text-sm font-bold mb-2">{t('market.patternLabel') || 'Pattern'}</label>
                        <input type="number" name="pattern" value={filters.pattern} onChange={handleFilterChange} placeholder={t('market.pattern')} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                    </div>

                    {/* Checkboxy (StatTrak, Souvenir, Naklejki) */}
                    <div className="flex flex-col gap-3 mt-6 mb-4 border-t border-gray-700 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                            <input type="checkbox" name="isStatTrak" checked={filters.isStatTrak} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                            <span className="text-orange-400 font-bold">StatTrak™</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                            <input type="checkbox" name="isSouvenir" checked={filters.isSouvenir} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                            <span className="text-yellow-400 font-bold">{t('market.souvenir')}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                            <input type="checkbox" name="hasStickers" checked={filters.hasStickers} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                            <span className="text-white">{t('market.stickers')}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                            <input type="checkbox" name="hasCharms" checked={filters.hasCharms} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                            <span className="text-white">{t('market.charms')}</span>
                        </label>
                    </div>

                    <button onClick={() => fetchListings(false)} className="w-full py-3 mt-2 cs-button text-brand-base font-bold text-lg rounded shadow-lg">
                        {t('market.filterAction') || 'FILTRUJ'}
                    </button>
                </div>
            </div>

            {/* Sklep (Lista Skinów) - col-span-9 */}
            <div className="col-span-12 lg:col-span-9">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-text">{t('market.proOffers') || 'OFERTY PRO'}</h2>
                        <div className="text-brand-accent font-semibold tracking-wider text-xs md:text-sm">{t('market.realtimeScan') || 'SKANOWANIE W CZASIE RZECZYWISTYM'}</div>
                    </div>
                    <div className="text-brand-muted font-bold md:text-right">
                        <div>{t('market.found') || 'Znaleziono:'} <span className="text-brand-accent">{totalCount}</span> {t('market.items') || 'przedmiotów'}</div>
                        <div className="text-xs mt-1 text-gray-500">{t('market.displayed') || 'Wyświetlono:'} {listings.length}</div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-brand-muted text-xl animate-pulse">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> {t('market.searchingSteam') || 'Przeszukiwanie...'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {listings.map((item, idx) => (
                            <div key={idx} className="cs-panel rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                {/* Górny base skina */}
                                <div className="h-32 bg-gradient-to-b from-gray-800 to-gray-900 relative flex justify-center items-center p-4">
                                    {/* Oznaczenia specjalne */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {item.isStatTrak && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded font-bold border border-orange-500/50">STATTRAK™</span>}
                                        {item.isSouvenir && <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded font-bold border border-yellow-500/50">SOUVENIR</span>}
                                    </div>
                                    <div className={`absolute top-2 right-2 text-xs font-bold ${
                                        item.rarity === 'Covert' ? 'text-red-500' :
                                        item.rarity === 'Classified' ? 'text-pink-500' :
                                        item.rarity === 'Restricted' ? 'text-purple-500' :
                                        item.rarity === 'Mil-Spec' ? 'text-blue-500' :
                                        item.rarity === 'Industrial Grade' ? 'text-blue-300' :
                                        item.rarity === 'Contraband' ? 'text-yellow-500' :
                                        'text-gray-400'
                                    }`}>
                                        {item.rarity.toUpperCase()}
                                    </div>
                                    <img src={item.imageUrl || "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyUH68Rli-3D9N2s2QO2qA5tYWnyJYDGdwRqYVyErAPtxeq808DoupXOyyM17CI8pSGKmB3j/360fx360f"} alt={item.itemName} className="h-full object-contain filter drop-shadow-lg" />
                                </div>
                                
                                {/* Info */}
                                <div className="p-4 border-t border-gray-700/50">
                                    <div className="text-xl font-bold truncate text-white">{formatItemNameWithCondition(item.itemName, item.float)}</div>
                                    
                                    {!item.isNonWearable && (
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-brand-muted text-sm">Float: <span className="text-white font-mono">{(typeof item.float === "number" ? item.float.toFixed(6) : "N/A")}</span></div>
                                            {item.pattern !== null && <div className="text-brand-muted text-sm">Seed: <span className="text-white font-mono">{item.pattern}</span></div>}
                                        </div>
                                    )}

                                    {/* Naklejki wizualizacja */}
                                    {item.stickers && item.stickers.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-800 flex gap-2 overflow-x-auto">
                                            {item.stickers.map((st, i) => (
                                                <div key={i} className="bg-gray-800 rounded px-2 py-1 flex items-center justify-center text-[10px] text-gray-300 border border-gray-700 flex-shrink-0" title={st.name}>
                                                    <i className="fa-solid fa-note-sticky text-brand-accent mr-1"></i>
                                                    {st.name.substring(0, 15)}...
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Charmsy wizualizacja */}
                                    {item.charms && item.charms.length > 0 && (
                                        <div className="mt-2 flex gap-2">
                                            <span className="bg-gray-800/80 rounded px-2 text-[10px] text-pink-400 border border-pink-900/50 flex items-center gap-1">
                                                <i className="fa-solid fa-link"></i> Charm: {item.charms[0].name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Cena i Akcja */}
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="text-2xl font-bold text-brand-accent">{formatPrice(item.price)}</div>
                                        <a href={item.marketUrl} target="_blank" rel="noreferrer" className="px-4 py-1.5 bg-brand-base border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-base transition font-bold rounded">
                                            {t('controls.buySteam')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {!loading && listings.length > 0 && listings.length < totalCount && (
                    <div className="mt-8 flex justify-center">
                        <button 
                            onClick={() => fetchListings(true)} 
                            disabled={loadingMore}
                            className={`px-8 py-3 bg-gray-800 border border-brand-accent text-brand-accent font-bold rounded shadow-lg transition ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-accent hover:text-brand-base'}`}
                        >
                            {loadingMore ? (
                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> POBIERANIE KOLEJNYCH...</>
                            ) : (
                                <>POKAŻ WIĘCEJ SKINÓW</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EnhancedMarket;
