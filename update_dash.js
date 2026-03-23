const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

content = content.replace('?? PROGNOZY AI (BETA)', "{t('dashboard.aiForecasts')}");
content = content.replace('Wzrost o 12% do pt', "{t('dashboard.growth')}");
content = content.replace('TYLKO PREMIUM', "{t('dashboard.premiumOnly')}");
content = content.replace('>Spadek<', ">{t('dashboard.drop')}<");
content = content.replace('?? ANOMALIE RYNKOWE', "{t('dashboard.marketAnomalies')}");
content = content.replace('Limit: 2/5', "{t('dashboard.limit')}");
content = content.replace('Sprzedano 8,421 szt. w 6h...', "{t('dashboard.volumeSold')}");
content = content.replace('ANALIZA TRENDÓW', "{t('dashboard.trendAnalysis')}");
content = content.replace('INDEKS 50 NAJPOPULARNIEJSZYCH SKÓREK', "{t('dashboard.top50Index')}");
content = content.replace('REKRUT (DARMOWY)', "{t('dashboard.recruit')}");
content = content.replace('?? Podstawowa analiza cen', "{t('dashboard.basicAnalysis')}");
content = content.replace('?? 5 powiadomieñ/tydz', "{t('dashboard.alertsWeek')}");
content = content.replace('? Brak prognoz AI', "{t('dashboard.noAi')}");
content = content.replace('AKTUALNY PLAN', "{t('dashboard.currentPlan')}");
content = content.replace("{language === 'EN' ? 'MTH' : 'MIES'}", "{t('dashboard.month')}");
content = content.replace('PREMIUM<', "{t('dashboard.premium')}<");
content = content.replace('?? Nielimitowane powiadomienia', "{t('dashboard.unlimitedAlerts')}");
content = content.replace('?? Pe³ne prognozy AI', "{t('dashboard.fullAi')}");
content = content.replace('?? Wykresy wszechczasów', "{t('dashboard.allTimeCharts')}");
content = content.replace('>UPGRADE<', ">{t('dashboard.upgrade')}<");

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', content);
console.log('Dashboard updated');
