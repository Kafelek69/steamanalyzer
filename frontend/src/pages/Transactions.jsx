import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Transactions() {
    const { user, clearTransactions } = useAuth();
    const { formatPrice } = useSettings();

    if (!user) {
        return <div className="text-center py-20 text-brand-muted text-xl font-bold">Musisz się zalogować by podejrzeć transakcje.</div>;
    }

    const transactions = user?.transactions || [];

    return (
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-fadeIn pb-12">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Historia Transakcji</h1>
                    <p className="text-gray-500 text-sm mt-1">Przeglądaj wszystkie swoje zakupy i sprzedaże z rynku P2P.</p>
                </div>
                {transactions.length > 0 && (
                    <button 
                        onClick={clearTransactions} 
                        className="text-sm font-bold text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 transition-colors px-4 py-2 rounded shadow-md"
                    >
                        <i className="fa-solid fa-trash-can mr-2"></i>Wyczyść historię
                    </button>
                )}
            </div>

            <div className="flex flex-col rounded-xl overflow-hidden bg-[#13151b] border border-gray-800 cs-panel p-8 min-h-[400px]">
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-500 text-sm">
                                    <th className="pb-4 font-semibold">Data</th>
                                    <th className="pb-4 font-semibold">Typ</th>
                                    <th className="pb-4 font-semibold">Przedmiot / Opis</th>
                                    <th className="pb-4 text-right font-semibold">Kwota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 text-sm text-gray-400">{tx.date}</td>
                                        <td className="py-5 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                tx.type === 'Purchase' ? 'bg-red-500/10 text-red-500' : 
                                                tx.type === 'Sale' ? 'bg-green-500/10 text-green-500' : 
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {tx.type === 'Purchase' ? 'Kupno' : tx.type === 'Sale' ? 'Sprzedaż' : tx.type}
                                            </span>
                                        </td>
                                        <td className="py-5 text-sm font-semibold text-gray-200">{tx.item}</td>
                                        <td className={`py-5 text-sm font-bold text-right ${tx.price > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {tx.price > 0 ? '+' : ''}{formatPrice(tx.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                        <i className="fa-solid fa-receipt text-6xl text-gray-800 mb-6"></i>
                        <p className="text-gray-400 text-lg font-semibold">Brak historii transakcji.</p>
                        <p className="text-gray-600 text-sm mt-2 max-w-md text-center">Nie dokonałeś jeszcze żadnych operacji na rynku P2P. Gdy kupisz lub sprzedasz przedmiot, historia pojawi się w tym miejscu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}