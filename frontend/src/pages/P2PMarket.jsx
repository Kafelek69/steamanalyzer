import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatItemNameWithCondition } from '../utils/floatHelpers';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export default function P2PMarket() {
  const { formatPrice, language, t } = useSettings();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
    const { user, loginWithSteam, updateBalance, addTransaction } = useAuth();
  const [showSellModal, setShowSellModal] = useState(false);
  const [invItems, setInvItems] = useState([]);
  const [invLoading, setInvLoading] = useState(false);
  const [selectedInvItem, setSelectedInvItem] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [buyMessage, setBuyMessage] = useState(null);

  const [filters, setFilters] = useState({
      search: '', minPrice: '', maxPrice: '',
      wearMin: '', wearMax: '',
      isStatTrak: false, isSouvenir: false,
      weapon: '', rarity: '',
      hasStickers: false, hasCharms: false,
      pattern: '',
      sortBy: 'newest'
  });

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== false) {
            params.append(key, filters[key]);
        }
    });

    axios
      .get('http://localhost:5000/api/marketplace-p2p/listings?' + params.toString())
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, [filters.sortBy]);

  const handleOpenSellModal = async () => {
    if (!user) {
        alert("Zaloguj się przez Steam, aby wystawić przedmiot.");
        return;
    }
    setShowSellModal(true);
    if (invItems.length === 0) {
        setInvLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/inventory/analyze?target=${user.steam_id}`);
            const sortedItems = (res.data.data || []).sort((a,b) => b.price - a.price);
            setInvItems(sortedItems);
        } catch(e) {
            console.error(e);
        }
        setInvLoading(false);
    }
  };

  const handleListSubmit = async () => {
    if (!selectedInvItem || !sellPrice || isNaN(sellPrice)) return;
    try {
        const itemPayload = {
            name: selectedInvItem.itemName || selectedInvItem.name,
            img: selectedInvItem.imageUrl || selectedInvItem.img || selectedInvItem.icon_url,
            float: selectedInvItem.float,
            basePrice: selectedInvItem.price,
            pattern: selectedInvItem.pattern,
            wear_name: selectedInvItem.wear_name || selectedInvItem.rarity,
            isStatTrak: (selectedInvItem.itemName || selectedInvItem.name || '').includes('StatTrak'),
            isSouvenir: (selectedInvItem.itemName || selectedInvItem.name || '').includes('Souvenir')
        };
          await axios.post('http://localhost:5000/api/marketplace-p2p/list', {
              item: itemPayload,
              price: sellPrice,
              seller: { name: user.display_name, avatar: user.avatar_url }
          });
          addTransaction('Sale', itemPayload.name, sellPrice * 0.95);
          updateBalance(sellPrice * 0.95);
        setShowSellModal(false);
        setSellPrice('');
        setSelectedInvItem(null);
        fetchListings(); 
        setBuyMessage({ type: 'success', text: 'Przedmiot wystawiony pomyślnie!' });
        setTimeout(() => setBuyMessage(null), 3000);
    } catch(e){
        console.error(e);
    }
  };

  const handleFilterChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFilters(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  const handleBuy = (id, price, itemName) => {
    if (!user) {
        alert("Zaloguj się przez Steam, aby kupować na giełdzie.");
        return;
    }
    
    if (user.balance < price) {
        setBuyMessage({ type: 'error', text: 'Niewystarczający wirtualny balans na koncie!' });
        setTimeout(() => setBuyMessage(null), 3000);
        return;
    }

    axios
      .post('http://localhost:5000/api/marketplace-p2p/buy/' + id)
      .then((res) => {
        updateBalance(-price);
          addTransaction('Purchase', itemName || 'Unknown Item', -price);
        setBuyMessage({ type: 'success', text: res.data.message });
        fetchListings();
        setTimeout(() => setBuyMessage(null), 5000);
      })
      .catch((err) => {
        setBuyMessage({
          type: 'error',
          text: err.response?.data?.error || 'Wystąpił błąd podczas zakupów.',
        });
        setTimeout(() => setBuyMessage(null), 5000);
      });
  };

  return (
    <div className="grid grid-cols-12 gap-6 uppercase animate-fadeIn">
        {/* Sidebar (Filtry) - col-span-3 */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <div className="cs-panel p-5 rounded">
                <h2 className="text-2xl font-bold border-b border-brand-accent pb-2 mb-4 text-brand-text flex items-center justify-between">
                    <span>ZAAWANSOWANE FILTRY</span>
                    <i className="fa-solid fa-filter text-brand-accent text-sm"></i>
                </h2>
                
                {/* Wyszukiwarka tekstowa */}
                <div className="mb-4">
                    <label className="block text-brand-muted text-sm font-bold mb-2">Szukaj Przedmiotu</label>
                    <input type="text" name="search" value={filters.search} onChange={handleFilterChange} onKeyDown={(e) => e.key==='Enter' && fetchListings()} placeholder="np. Karambit | Doppler" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                </div>

                {/* Sortowanie */}
                <div className="mb-4">
                    <label className="block text-brand-muted text-sm font-bold mb-2">Sortowanie</label>
                    <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                        <option value="newest">Najnowsze</option>
                        <option value="price_asc">Cena (Rosnąco)</option>
                        <option value="price_desc">Cena (Malejąco)</option>
                        <option value="wear_asc">Float / Zużycie (Rosnąco)</option>
                        <option value="wear_desc">Float / Zużycie (Malejąco)</option>
                    </select>
                </div>

                {/* Cena */}
                <div className="mb-4">
                  <label className="block text-brand-muted text-sm font-bold mb-2">{t('controls.price')}</label>
                    <div className="flex gap-2">
                        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="MIN" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="MAX" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                    </div>
                </div>

                {/* Zużycie (Wear - Float) */}
                <div className="mb-4">
                    <label className="block text-brand-muted text-sm font-bold mb-2">Zużycie (Float 0.0 - 1.0)</label>
                    <div className="flex gap-2">
                        <input type="number" step="0.01" name="wearMin" value={filters.wearMin} onChange={handleFilterChange} placeholder="0.00" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                        <input type="number" step="0.01" name="wearMax" value={filters.wearMax} onChange={handleFilterChange} placeholder="1.00" className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition" />
                    </div>
                </div>

                {/* Broń */}
                <div className="mb-4">
                    <label className="block text-brand-muted text-sm font-bold mb-2">Broń</label>
                    <select name="weapon" value={filters.weapon} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                        <option value="">Wszystko (Puste)</option>
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
                      <label className="block text-brand-muted text-sm font-bold mb-2">Rzadkość</label>
                      <select name="rarity" value={filters.rarity} onChange={handleFilterChange} className="w-full bg-brand-base border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-accent transition appearance-none">
                          <option value="">Każda rzadkość</option>
                          <option value="Consumer Grade" className="text-gray-400">Consumer Grade</option>
                          <option value="Industrial Grade" className="text-blue-300">Industrial Grade</option>
                          <option value="Mil-Spec" className="text-blue-600">Mil-Spec</option>
                          <option value="Restricted" className="text-purple-500">Restricted</option>
                          <option value="Classified" className="text-pink-500">Classified</option>
                          <option value="Covert" className="text-red-500">Covert</option>
                          <option value="Contraband" className="text-yellow-600">Contraband</option>
                      </select>
                  </div>

                  {/* Checkboxy (StatTrak, Souvenir, Naklejki) */}
                  <div className="flex flex-col gap-3 mt-6 mb-4 border-t border-gray-700 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                          <input type="checkbox" name="isStatTrak" checked={filters.isStatTrak} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                          <span className="text-orange-400 font-bold">StatTrak™</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                          <input type="checkbox" name="isSouvenir" checked={filters.isSouvenir} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                          <span className="text-yellow-400 font-bold">Souvenir pamiątka</span>
                      </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                        <input type="checkbox" name="hasStickers" checked={filters.hasStickers} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                        <span className="text-white">Posiada Naklejki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition">
                        <input type="checkbox" name="hasCharms" checked={filters.hasCharms} onChange={handleFilterChange} className="w-4 h-4 accent-brand-accent bg-gray-800 border-gray-700 rounded" />
                        <span className="text-white">Posiada Charmsy (Breloki)</span>
                    </label>
                </div>

                <button onClick={() => fetchListings()} className="w-full py-3 mt-2 cs-button text-brand-base font-bold text-lg rounded shadow-lg">
                    FILTRUJ Rynek
                </button>
            </div>
        </div>

        {/* Sklep (Lista Skinów) - col-span-9 */}
        <div className="col-span-12 lg:col-span-9">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand-text">MARKET P2P</h2>
                    <div className="text-brand-accent font-semibold tracking-wider text-xs md:text-sm">KUPUJ BEZPOŚREDNIO OD GRACZY BEZ PROWIZJI</div>
                </div>
                <div className="text-brand-muted font-bold md:text-right flex flex-col items-end gap-2">
                    <div>OFERTY P2P: <span className="text-brand-accent">{items.length}</span></div>
                    <button 
                        onClick={handleOpenSellModal}
                        className="bg-brand-accent hover:bg-orange-600 text-brand-base px-6 py-2 rounded font-bold uppercase transition-colors"
                    >
                        + Wystaw przedmiot
                    </button>
                </div>
            </div>

            {buyMessage && (
                <div className={`p-4 mb-6 rounded font-semibold text-center uppercase text-sm animate-pulse 
                    ${buyMessage.type === 'success' ? 'bg-green-600 bg-opacity-20 text-green-400 border border-green-500' : 'bg-red-600 bg-opacity-20 text-red-400 border border-red-500'}
                `}>
                    {buyMessage.text}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-brand-muted text-xl animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> Odświeżanie ofert P2P..
                </div>
            ) : items.length === 0 ? (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                    <div className="text-4xl mb-4">🛒</div>
                    Odśwież filtry, aby znaleźć oferty P2P.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((listing) => (
                        <div key={listing.id} className="cs-panel rounded-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300 relative">
                            
                            {/* Header: Sprzedawca */}
                            <div className="p-3 bg-gray-900 bg-opacity-80 flex items-center justify-between border-b border-gray-700/50 absolute top-0 left-0 right-0 z-10">
                                <div className="flex items-center gap-2">
                                    <img src={listing.seller.avatar} alt={listing.seller.name} className="w-6 h-6 rounded-full border border-gray-600" />
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-200">{listing.seller.name}</div>
                                        <div className="text-[9px] text-green-400">Zaufanie: {listing.seller.trustLevel}%</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-500">{new Date(listing.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>

                            {/* Górny base skina */}
                            <div className="h-40 pt-10 bg-gradient-to-b from-gray-800 to-gray-900 relative flex justify-center items-center p-4">
                                {/* Oznaczenia specjalne */}
                                <div className="absolute top-12 left-2 flex flex-col gap-1 z-10">
                                    {listing.item.isStatTrak && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded font-bold border border-orange-500/50">STATTRAK™</span>}
                                    {listing.item.isSouvenir && <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded font-bold border border-yellow-500/50">SOUVENIR</span>}
                                </div>
                                <div className={`absolute top-12 right-2 text-xs font-bold z-10 uppercase 
                                    ${listing.item.rarity === 'Covert' ? 'text-red-500' : 
                                      listing.item.rarity === 'Classified' ? 'text-pink-500' : 
                                      listing.item.rarity === 'Restricted' ? 'text-purple-500' : 'text-blue-500'}
                                `}>
                                    {listing.item.rarity}
                                </div>
                                
                                <img src={listing.item.img} alt={listing.item.name} className="h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,140,0,0.3)] transition-all" />
                            </div>
                            
                            {/* Info */}
                            <div className="p-4 border-t border-gray-700/50">
                                <div className="text-lg font-bold truncate text-white" title={listing.item.name}>{formatItemNameWithCondition(listing.item.name, listing.item.float)}</div>
                                
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-brand-muted text-sm">Float: <span className="text-white font-mono">{(typeof listing.item.float === "number" ? listing.item.float.toFixed(6) : "N/A")}</span></div>
                                    <div className="text-brand-muted text-sm">Seed: <span className="text-white font-mono">{listing.item.pattern}</span></div>
                                </div>

                                {/* Naklejki wizualizacja */}
                                {listing.item.stickers && listing.item.stickers.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-800 flex gap-2 overflow-x-auto custom-scrollbar">
                                        {listing.item.stickers.map((st, i) => (
                                            <div key={i} className="bg-gray-800 rounded px-2 py-1 flex items-center justify-center text-[10px] text-gray-300 border border-gray-700 flex-shrink-0" title={st.name}>
                                                <i className="fa-solid fa-note-sticky text-brand-accent mr-1"></i>
                                                {st.name.substring(0, 15)}...
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Charmsy wizualizacja */}
                                {listing.item.charms && listing.item.charms.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                        {listing.item.charms.map((ch, i) => (
                                            <span key={i} className="bg-gray-800/80 rounded px-2 text-[10px] text-pink-400 border border-pink-900/50 flex items-center gap-1">
                                                <i className="fa-solid fa-link"></i> Charm: {ch.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Cena i Akcja */}
                                <div className="mt-4 pt-3 flex justify-between items-center border-t border-gray-700/30">
                                    <div className="border-l-2 border-brand-accent pl-2">
                                        <div className="text-[10px] text-gray-500 font-bold leading-none mb-1">OFERTA P2P</div>
                                          <div className="text-xl font-bold text-brand-accent">{formatPrice(listing.price)}</div>
                                    </div>
                                    <button onClick={() => handleBuy(listing.id, listing.price, listing.item.name)} className="px-6 py-2 bg-brand-accent text-brand-base hover:bg-orange-600 transition font-bold rounded shadow-[0_0_10px_rgba(255,140,0,0.3)] transform active:scale-95 text-sm uppercase">
                                          {t('controls.buyP2P')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Modal Sprzedaży */}
        {showSellModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#111318] border border-brand-accent/30 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col uppercase">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-[#111318]">
                        <h2 className="text-2xl font-bold text-white">Wystaw Przedmiot</h2>
                        <button onClick={() => setShowSellModal(false)} className="text-gray-400 hover:text-white">
                            <i className="fa-solid fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        {!selectedInvItem ? (
                            <>
                                <h3 className="text-brand-accent font-bold mb-4">Wybierz przedmiot z ekwipunku</h3>
                                {invLoading ? (
                                    <div className="text-center py-12 text-brand-muted">
                                        <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-brand-accent"></i>
                                        <p>Wczytywanie ekwipunku Steam...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {invItems.length === 0 && !invLoading && (
                                            <div className="col-span-full py-8 text-center text-gray-500">
                                                Brak zbywalnych przedmiotów w ekwipunku.
                                            </div>
                                        )}
                                        {invItems.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => setSelectedInvItem(item)}
                                                className="cs-panel p-3 rounded cursor-pointer hover:border-brand-accent transition-colors flex flex-col items-center text-center"
                                            >
                                                <img src={item.imageUrl || item.icon_url || item.img} alt={item.itemName || item.name} className="w-24 h-24 object-contain mb-2 drop-shadow-lg" />
                                                <div className="text-xs font-bold w-full truncate mb-1">{formatItemNameWithCondition((item.itemName || item.name), item.float)}</div>
                                                <div className="text-brand-muted text-[10px] mb-2">{item.rarity || item.wear_name || 'Brak'}</div>
                                                <div className="text-brand-accent font-bold mt-auto">{formatPrice(item.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3">
                                    <div className="cs-panel p-4 rounded text-center h-full flex flex-col items-center">
                                        <img src={selectedInvItem.imageUrl || selectedInvItem.icon_url || selectedInvItem.img} alt={selectedInvItem.itemName || selectedInvItem.name} className="w-48 h-48 object-contain mb-4" />
                                        <div className="font-bold text-lg">{selectedInvItem.itemName || selectedInvItem.name}</div>
                                        <div className="text-brand-muted text-sm my-2">Sugerowana cena: <span className="text-white">{formatPrice(selectedInvItem.price)}</span></div>
                                        <button onClick={() => setSelectedInvItem(null)} className="mt-auto text-xs text-brand-accent hover:underline">
                                            <i className="fa-solid fa-arrow-left mr-1"></i> Zmień przedmiot
                                        </button>
                                    </div>
                                </div>
                                <div className="md:w-2/3 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold mb-6">Ustal Cenę</h3>
                                    
                                    <div className="mb-4">
                                        <label className="block text-brand-muted text-sm font-bold mb-2">Cena sprzedaży (PLN)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold">PLN</span>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                min="0.1"
                                                value={sellPrice}
                                                onChange={(e) => setSellPrice(e.target.value)}
                                                className="w-full bg-brand-base border border-gray-700 text-white p-3 pl-14 rounded focus:outline-none focus:border-brand-accent"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-brand-base border border-gray-800 p-4 rounded mb-6">
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="text-brand-muted">Prowizja Marketu (5%):</span>
                                            <span className="text-red-400">-{sellPrice ? (sellPrice * 0.05).toFixed(2) : '0.00'} PLN</span>
                                        </div>
                                        <div className="flex justify-between font-bold border-t border-gray-800 pt-2 mt-2">
                                            <span>Otrzymasz:</span>
                                            <span className="text-green-400">{sellPrice ? (sellPrice * 0.95).toFixed(2) : '0.00'} PLN</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleListSubmit}
                                        disabled={!sellPrice || isNaN(sellPrice) || Number(sellPrice) <= 0}
                                        className="w-full bg-brand-accent hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-brand-base font-bold py-4 rounded transition-colors text-lg"
                                    >
                                        POTWIERDŹ I WYSTAW
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}
