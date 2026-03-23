import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Profile() {
    const { user, clearTransactions } = useAuth();
    const { formatPrice } = useSettings();
    const [activeTab, setActiveTab] = useState('Personal Info');
    const [showEarnings, setShowEarnings] = useState(true);

    const tabs = ['Personal Info', 'Buy Orders', 'Auto-Bids', 'Trades', 'Offers', 'Notifications', 'Developers'];
    
    const transactions = user?.transactions || [];
    const sales = transactions.filter(t => t.type === 'Sale').reduce((acc, t) => acc + parseFloat(t.price), 0);
    const purchases = transactions.filter(t => t.type === 'Purchase').reduce((acc, t) => acc + Math.abs(parseFloat(t.price)), 0);
    const net = sales - purchases;
    
    // Removed Mock Data
    

    if (!user) {
        return <div className="text-center py-20 text-brand-muted text-xl font-bold">Musisz się zalogować by podejrzeć profil.</div>;
    }

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-fadeIn pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info Card */}
                <div className="cs-panel p-6 rounded-xl flex flex-col justify-between bg-[#13151b] border-gray-800">
                    <div className="flex items-start gap-4 mb-4">
                        <img src={user.avatar_url || 'https://via.placeholder.com/80'} alt="avatar" className="w-20 h-20 rounded-md object-cover shadow-lg" />
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">{user.display_name || user.username || 'User'}</h1>
                            <div className="flex gap-2 mb-2">
                                <span className="bg-blue-900/20 text-blue-400 text-xs px-3 py-1 rounded font-semibold border border-blue-800/40">Verified</span>
                                <span className="bg-green-900/20 text-green-500 text-xs px-3 py-1 rounded font-semibold border border-green-800/40">Seller</span>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 self-start bg-[#1e2129] hover:bg-[#252a36] text-white text-sm font-semibold py-2 px-5 rounded-md transition-colors flex items-center gap-2">
                        Complete KYC <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>

                {/* Earnings Card */}
                <div className="cs-panel p-6 rounded-xl bg-[#13151b] border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-white">Earnings</h2>
                        <i 
                            className={"fa-solid text-gray-500 cursor-pointer hover:text-white transition-colors " + (showEarnings ? 'fa-eye' : 'fa-eye-slash')} 
                            onClick={() => setShowEarnings(!showEarnings)}
                        ></i>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-gray-800/50 pb-3">
                            <span className="text-brand-muted font-semibold text-sm">Sales</span>
                            <span className="text-gray-200 font-bold">{showEarnings ? formatPrice(sales) : 'PLN ***'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-800/50 pb-3">
                            <span className="text-brand-muted font-semibold text-sm">Purchases</span>
                            <span className="text-gray-200 font-bold">{showEarnings ? formatPrice(purchases) : 'PLN ***'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-brand-muted font-semibold text-sm">Net</span>
                            <span className="text-gray-200 font-bold">{showEarnings ? formatPrice(net) : 'PLN ***'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Standing */}
            <div className="cs-panel p-8 rounded-xl bg-[#13151b] border-gray-800">
                <div className="flex justify-between items-end mb-14">
                    <h2 className="text-2xl font-bold text-white">Account Standing</h2>
                    <span className="text-xs font-semibold text-gray-500">No recent restrictions</span>
                </div>

                <div className="relative flex justify-between items-center w-full px-2 md:px-8">
                    <div className="absolute left-10 md:left-16 right-10 md:right-16 top-1/2 -translate-y-1/2 h-1 flex rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600/60 w-1/4"></div>
                        <div className="h-full bg-gray-800/80 w-3/4"></div>
                    </div>

                    <div className="relative flex flex-col items-center gap-3 z-10 w-20">
                        <div className="w-7 h-7 rounded-full bg-[#13151b] border-2 border-green-500/50 flex items-center justify-center text-green-500 text-xs">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">Excellent</span>
                    </div>

                    <div className="relative flex flex-col items-center gap-3 z-10 w-20 translate-y-[-6px]">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                            <i className="fa-solid fa-thumbs-up"></i>
                        </div>
                        <span className="text-sm font-bold text-white">Good</span>
                    </div>

                    <div className="relative flex flex-col items-center gap-3 z-10 w-20">
                        <div className="w-7 h-7 rounded-full bg-[#13151b] border-2 border-gray-700 flex items-center justify-center text-yellow-600/40 text-xs">
                            <i className="fa-regular fa-face-frown"></i>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600">Poor</span>
                    </div>

                    <div className="relative flex flex-col items-center gap-3 z-10 w-20">
                        <div className="w-7 h-7 rounded-full bg-[#13151b] border-2 border-gray-700 flex items-center justify-center text-orange-500/40 text-xs">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600">At Risk</span>
                    </div>

                    <div className="relative flex flex-col items-center gap-3 z-10 w-20">
                        <div className="w-7 h-7 rounded-full bg-[#13151b] border-2 border-gray-700 flex items-center justify-center text-red-500/40 text-xs">
                            <i className="fa-solid fa-ban"></i>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600">Banned</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#13151b] border border-gray-800 cs-panel">
                <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-800 bg-[#0f1115]">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === tab ? 'text-white border-white bg-[#1a1d24]' : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#15171d]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">{activeTab}</h3>
                        {activeTab === 'Transactions' && transactions.length > 0 && (
                            <button 
                                onClick={clearTransactions} 
                                className="text-xs font-bold text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 transition-colors px-3 py-1.5 rounded"
                            >
                                <i className="fa-solid fa-trash-can mr-2"></i>Wyczyść
                            </button>
                        )}
                    </div>
                    
                    {activeTab === 'Personal Info' ? (
                        <div className="space-y-4 text-gray-400 text-sm">
                            <p className="font-semibold text-gray-200">User Identification:</p>
                            <p>Steam ID: <span className="text-white bg-gray-800 px-2 py-1 rounded text-xs">{user.steam_id || '76561198000000000'}</span></p>
                            <p>Joined: <span className="text-white">Mar 2026</span></p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Wygląda na to, że nie masz jeszcze żadnych historii dla tej sekcji.</p>
                    )}
                </div>
            </div>
        </div>
    );
}