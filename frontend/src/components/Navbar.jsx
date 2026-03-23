import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, loginWithSteam, logout, updateBalance } = useAuth();
    const { theme, toggleTheme, currency, setCurrency, language, setLanguage, t } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 cs-panel p-4 rounded md:gap-4 w-full relative z-[100]">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-accent flex items-center justify-center font-bold text-lg md:text-xl rounded-sm text-brand-base shrink-0">
                        MA
                    </div>
                    <h1 className="text-xl md:text-3xl font-bold tracking-widest text-brand-accent text-glow">
                        MARKET<span className="text-brand-text">ANALYZER</span>
                    </h1>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-400 hover:text-brand-text focus:outline-none text-2xl pl-4">
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>

            <div className={`${isOpen ? 'flex' : 'hidden'} mt-4 md:mt-0 md:flex flex-col xl:flex-row justify-center lg:justify-end gap-2 xl:gap-4 items-center font-semibold text-xs md:text-sm uppercase w-full md:w-auto`}>
                <div className="flex flex-col lg:flex-row items-center gap-2 xl:gap-4 w-full lg:w-auto">
                    <Link to="/" onClick={() => setIsOpen(false)} className="w-full lg:w-auto text-center hover:text-brand-accent transition-colors py-2 lg:py-0 border-b border-gray-700/50 lg:border-none">{t('nav.dashboard')}</Link>
                    <Link to="/inventory" onClick={() => setIsOpen(false)} className="w-full lg:w-auto text-center hover:text-brand-accent transition-colors py-2 lg:py-0 border-b border-gray-700/50 lg:border-none">{t('nav.inventory')} <i className="fa-solid fa-magnifying-glass ml-1"></i></Link>
                    <Link to="/market" onClick={() => setIsOpen(false)} className="w-full lg:w-auto text-center hover:text-brand-accent transition-colors py-2 lg:py-0 border-b border-gray-700/50 lg:border-none">{t('nav.market')} <i className="fa-solid fa-fire text-sm ml-1"></i></Link>
                    <Link to="/p2p-market" onClick={() => setIsOpen(false)} className="w-full lg:w-auto text-center hover:text-brand-accent transition-colors py-2 lg:py-0 border-b border-gray-700/50 lg:border-none">{t('nav.p2p')} <i className="fa-solid fa-users text-sm ml-1"></i></Link>
                    <Link to="/skins" onClick={() => setIsOpen(false)} className="w-full lg:w-auto text-center hover:text-brand-accent transition-colors py-2 lg:py-0 border-b border-gray-700/50 lg:border-none">{t('nav.skins')}</Link>
                </div>

                <div className="flex items-center gap-3 my-2 lg:my-0 bg-brand-base/50 p-2 rounded border border-gray-700/50">
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent text-brand-text font-bold outline-none cursor-pointer text-xs">
                        <option className="bg-brand-base" value="PLN">PLN</option>
                        <option className="bg-brand-base" value="EUR">EUR</option>
                        <option className="bg-brand-base" value="USD">USD</option>
                    </select>

                    <div className="w-px h-4 bg-gray-600"></div>

                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-brand-text font-bold outline-none cursor-pointer text-xs">
                        <option className="bg-brand-base" value="PL">PL</option>
                        <option className="bg-brand-base" value="EN">EN</option>
                    </select>

                    <div className="w-px h-4 bg-gray-600"></div>

                    <button onClick={toggleTheme} className="text-brand-text hover:text-brand-accent transition-colors p-1" title={t('controls.themeDark')}>
                        {theme === 'dark' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                    </button>
                </div>

                {user ? (
                    <div className="relative group mt-2 md:mt-0 w-full md:w-auto z-50">
                        <div className="flex items-center justify-between md:justify-center gap-2 md:gap-3 bg-brand-card p-2 md:px-3 rounded border border-gray-700 cursor-pointer hover:border-brand-accent transition-colors">
                            <div className="flex items-center gap-2">
                                <img src={user.avatar_url} alt="avatar" className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-gray-200 truncate leading-none mb-1">{user.display_name}</span>
                                    <span className="text-[10px] text-green-400 font-bold leading-none">{user.balance?.toFixed(2)} PLN</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-chevron-down text-xs text-gray-400 ml-1"></i>
                        </div>
                        
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#111318] border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                            <Link to="/profile" className="px-4 py-3 text-xs font-bold text-gray-300 hover:bg-brand-accent hover:text-white transition-colors border-b border-gray-800 flex items-center">
                                <i className="fa-solid fa-user w-5 text-center mr-2 text-brand-muted"></i> PROFIL
                            </Link>
                            <button onClick={() => updateBalance(100)} className="text-left px-4 py-3 text-xs font-bold text-green-400 hover:bg-brand-accent hover:text-white transition-colors border-b border-gray-800 flex items-center">
                                <i className="fa-solid fa-plus w-5 text-center mr-2"></i> DODAJ BALANS
                            </button>
                            <button onClick={() => alert('Wypłata wkrótce!')} className="text-left px-4 py-3 text-xs font-bold text-gray-300 hover:bg-brand-accent hover:text-white transition-colors border-b border-gray-800 flex items-center">
                                <i className="fa-solid fa-money-bill-wave w-5 text-center mr-2 text-brand-muted"></i> WYPŁAĆ BALANS
                            </button>
                            <Link to="/my-listings" className="px-4 py-3 text-xs font-bold text-gray-300 hover:bg-brand-accent hover:text-white transition-colors border-b border-gray-800 flex items-center">
                                <i className="fa-solid fa-tags w-5 text-center mr-2 text-brand-muted"></i> MOJE WYSTAWIONE PRZEDMIOTY
                            </Link>
                            <Link to="/transactions" className="px-4 py-3 text-xs font-bold text-gray-300 hover:bg-brand-accent hover:text-white transition-colors border-b border-gray-800 flex items-center">
                                <i className="fa-solid fa-clock-rotate-left w-5 text-center mr-2 text-brand-muted"></i> HISTORIA TRANSAKCJI
                            </Link>
                            <button onClick={logout} className="text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center">
                                <i className="fa-solid fa-right-from-bracket w-5 text-center mr-2"></i> WYLOGUJ
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={loginWithSteam} className="cs-button w-full md:w-auto text-brand-base font-bold text-xs md:text-sm px-4 md:px-8 py-3 md:py-2 flex items-center justify-center gap-2 mt-2 md:mt-0">
                        <i className="fa-brands fa-steam"></i> {t('nav.login')}
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
