const axios = require('axios');

// Zoptymalizowana kolejka żeby ominąć błąd 429 Too Many Requests z csgofloat
class FloatQueue {
    constructor(concurrency = 1, delayMs = 1500) {
        this.concurrency = concurrency;
        this.delayMs = delayMs;
        this.active = 0;
        this.queue = [];
    }

    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const res = await task();
                    resolve(res);
                } catch (err) {
                    reject(err);
                } finally {
                    this.active--;
                    setTimeout(() => {
                        this.next();
                    }, this.delayMs); // Ważne: Opóźnienie by api.csgofloat nas nie zbanowało
                }
            });
            this.next();
        });
    }

    next() {
        if (this.active >= this.concurrency || this.queue.length === 0) return; 
        this.active++;
        const nextTask = this.queue.shift();
        nextTask();
    }
}

// Tylko 1 strzał na raz, odstęp 1.5 sekundy (bezpieczny limit dla csgofloat.com)
const queue = new FloatQueue(1, 1500);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchRealFloatAndSeed(inspectLink, retries = 3) {
    if (!inspectLink) return { float: null, seed: null };

    return queue.add(async () => {
        for (let i = 0; i < retries; i++) {
            try {
                const url = `https://api.csgofloat.com/?url=${encodeURIComponent(inspectLink)}`;
                const response = await axios.get(url, {
                    timeout: 8000,
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });

                if (response.data && response.data.iteminfo && response.data.iteminfo.floatvalue !== undefined) {
                    return {
                        float: Number(response.data.iteminfo.floatvalue),
                        seed: response.data.iteminfo.paintseed !== undefined ? Number(response.data.iteminfo.paintseed) : null
                    };
                }
                break; // Ustawione sukcesem, wychodzimy z petli
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    // Limitowany - czekaj i ponów
                    await sleep(2000 + (Math.random() * 2000));
                    continue; 
                } else if (error.response && error.response.status === 500) {
                    // Czasem serwer csgofloat ma chwilowe potknięcie - sprobuj ponownie
                    await sleep(1000);
                    continue;
                } else {
                    break;
                }
            }
        }
        return { float: null, seed: null };
    });
}

// Pomocnicza funkcja czyszcząca tag stanu broni
function applyWearBasedOnFloat(baseName, floatValue) {
    if (floatValue == null || isNaN(floatValue)) return baseName;
    
    let condition = '';
    if (floatValue >= 0.00 && floatValue < 0.07) condition = 'Factory New';
    else if (floatValue >= 0.07 && floatValue < 0.15) condition = 'Minimal Wear';
    else if (floatValue >= 0.15 && floatValue < 0.38) condition = 'Field-Tested';
    else if (floatValue >= 0.38 && floatValue < 0.45) condition = 'Well-Worn';
    else condition = 'Battle-Scarred';
    
    let cleanName = baseName.replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)/i, '');
    return cleanName + ' (' + condition + ')';
}

module.exports = {
    fetchRealFloatAndSeed,
    applyWearBasedOnFloat
};