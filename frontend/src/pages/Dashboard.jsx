import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Auto imports all controllers etc.
import { useSettings } from '../context/SettingsContext';

function Dashboard() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { formatPrice, language, t } = useSettings();

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.5)');   
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'],
                datasets: [{
                    label: 'Średnia cena (PLN)',
                    data: [120, 125, 123, 140, 135, 150, 148],
                    borderColor: '#f97316',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#f97316',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f97316',
                        titleFont: { family: 'Rajdhani', size: 16, weight: 'bold' },
                        bodyFont: { family: 'Rajdhani', size: 14 },
                        borderColor: '#f97316',
                        borderWidth: 1,
                        padding: 10
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Rajdhani', size: 14, weight: 'bold' } }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Rajdhani', size: 14, weight: 'bold' } }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6 uppercase">
            {/* Left Column: AI Predictions & Alerts */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* AI Forecast */}
                <div className="cs-panel p-6 rounded">
                    <h2 className="text-2xl font-bold border-b border-brand-accent pb-2 mb-4">🤖 PROGNOZY AI (BETA)</h2>
                    
                    <div className="bg-brand-base p-4 rounded border-l-4 border-green-500 mb-4">
                        <div className="text-brand-muted text-sm">AK-47 | REDLINE (FIELD-TESTED)</div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-2xl font-bold">{formatPrice(124.50)}</div>
                            <div className="text-green-500 font-bold flex items-center gap-1">
                                {t('dashboard.growth')}
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-base p-4 rounded border-l-4 border-red-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
                            <span className="text-brand-accent font-bold tracking-widest bg-black px-4 py-1 rounded border border-brand-accent">{t('dashboard.premiumOnly')}</span>
                        </div>
                        <div className="text-brand-muted text-sm">AWP | ASIIMOV (BATTLE-SCARRED)</div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-2xl font-bold">??? {formatPrice(0).replace(/[0-9.,]/g, '')}</div>
                            <div className="text-red-500 font-bold flex items-center gap-1">{t('dashboard.drop')}</div>
                        </div>
                    </div>
                </div>

                {/* Anomaly Alerts */}
                <div className="cs-panel p-6 rounded flex-1">
                    <div className="flex justify-between items-center border-b border-brand-accent pb-2 mb-4">
                        <h2 className="text-2xl font-bold">⚠️ ANOMALIE RYNKOWE</h2>
                        <span className="text-sm bg-brand-base px-2 py-1 rounded text-brand-muted">{t('dashboard.limit')}</span>
                    </div>
                    
                    <ul className="space-y-3">
                        <li className="p-3 bg-brand-base/50 rounded border border-brand-accent/30 animate-pulse">
                            <div className="text-brand-accent flex items-center justify-between font-bold">
                                <span>M4A1-S | PRINTSTREAM</span>
                                <span>+312% WOLUMENU</span>
                            </div>
                            <div className="text-sm text-brand-muted mt-1">{t('dashboard.volumeSold')}</div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Column: Chart & Pricing */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                {/* Main Chart */}
                <div className="cs-panel p-6 rounded relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">ANALIZA TRENDÓW</h2>
                            <div className="text-brand-accent font-semibold tracking-wider text-xs md:text-sm">INDEKS 50 NAJPOPULARNIEJSZYCH SKÓREK</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1 bg-brand-base border border-brand-accent text-brand-accent rounded hover:bg-brand-accent hover:text-brand-base transition text-sm">24H</button>
                            <button className="px-3 py-1 bg-brand-accent text-brand-base font-bold rounded text-sm">7D</button>
                            <button className="px-3 py-1 bg-brand-base border border-gray-600 text-gray-400 rounded cursor-not-allowed text-sm">1M 🔒</button>
                        </div>
                    </div>
                    <div className="relative h-80 w-full">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Subscriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="cs-panel p-6 rounded flex flex-col justify-between border-gray-600">
                        <div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">{t('dashboard.recruit')}</h3>
                            <div className="text-3xl font-bold mb-4">{formatPrice(0)}</div>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>✔️ Podstawowa analiza cen</li>
                                <li>✔️ 5 powiadomień/tydz</li>
                                <li className="text-gray-600">❌ Brak prognoz AI</li>
                            </ul>
                        </div>
                        <button className="w-full mt-6 py-2 bg-gray-700 text-white rounded font-bold hover:bg-gray-600 transition">{t('dashboard.currentPlan')}</button>
                    </div>

                    <div className="cs-panel p-6 rounded border-brand-accent flex flex-col justify-between" style={{boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)'}}>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-brand-accent">GLOBAL ELITE</h3>
                                <span className="bg-brand-accent text-brand-base px-2 py-1 text-xs font-bold rounded">{t('dashboard.premium')}</span>
                            </div>
                            <div className="text-3xl font-bold mb-4">{formatPrice(29.99)} <span className="text-sm text-brand-muted font-normal">/ {t('dashboard.month')}</span></div>
                            <ul className="space-y-2 text-sm text-white">
                                <li>✔️ Nielimitowane powiadomienia</li>
                                <li>✔️ Pełne prognozy AI</li>
                                <li>✔️ Wykresy wszechczasów</li>
                            </ul>
                        </div>
                        <button className="w-full mt-6 py-2 cs-button text-brand-base rounded font-bold text-lg">{t('dashboard.upgrade')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;