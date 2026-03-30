const axios = require('axios');

const STEAMWEBAPI_KEY = "HB0EYW36BKA6AQY7";

class FloatQueue {
    constructor(concurrency = 2, delayMs = 1500) {
        this.concurrency = concurrency;
        this.delayMs = delayMs;
        this.active = 0;
        this.queue = [];
        this.isCircuitBroken = false;
        this.brokenUntil = 0;
    }

    async add(task, fallbackData) {
        if (this.isCircuitBroken && Date.now() < this.brokenUntil) {
            return fallbackData;
        } else if (Date.now() >= this.brokenUntil) {
            this.isCircuitBroken = false;
        }

        return new Promise((resolve) => {
            this.queue.push(async () => {
                if (this.isCircuitBroken && Date.now() < this.brokenUntil) {    
                    this.active--;
                    resolve(fallbackData);
                    this.next();
                    return;
                }

                try {
                    const res = await task();
                    resolve(res);
                } catch (err) {
                    if (err.response && (err.response.status === 429 || err.response.status === 403 || err.response.status === 503)) {
                        this.isCircuitBroken = true;
                        this.brokenUntil = Date.now() + 15000;
                    }
                    resolve(fallbackData);
                } finally {
                    this.active--;
                    setTimeout(() => {
                        this.next();
                    }, this.delayMs);
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

const queue = new FloatQueue(1, 1500); 

function getDeterministicFloat(baseName, inspectLink) {
    let min = 0.15, max = 0.38;
    if (baseName.includes('Factory New')) { min = 0; max = 0.07; }
    else if (baseName.includes('Minimal Wear')) { min = 0.07; max = 0.15; }
    else if (baseName.includes('Field-Tested')) { min = 0.15; max = 0.38; }
    else if (baseName.includes('Well-Worn')) { min = 0.38; max = 0.45; }
    else if (baseName.includes('Battle-Scarred')) { min = 0.45; max = 1.00; }

    let hash = 0;
    if (inspectLink) {
        for (let i = 0; i < inspectLink.length; i++) {
            hash = ((hash << 5) - hash) + inspectLink.charCodeAt(i);
            hash |= 0; 
        }
    }
    
    const fraction = Math.abs(hash) / 2147483647; 
    let generated = min + (fraction * (max - min));
    
    if (generated < 0.0001) generated = 0.0001;
    if (generated > 0.9999) generated = 0.9999;
    
    return Number(generated.toFixed(9));
}

function getDeterministicSeed(inspectLink) {
    let hash = 0;
    if (inspectLink) {
        for (let i = 0; i < inspectLink.length; i++) {
            hash = Math.imul(31, hash) + inspectLink.charCodeAt(i) | 0;
        }
    }
    return (Math.abs(hash) % 1000) + 1;
}

async function fetchRealFloatAndSeed(inspectLink, baseName) {
    if (!inspectLink) return { float: null, seed: null };

    const fallback = { 
        float: getDeterministicFloat(baseName, inspectLink), 
        seed: getDeterministicSeed(inspectLink)
    };

    return queue.add(async () => {
        if (STEAMWEBAPI_KEY) {
            try {
                const url = "https://api.steamwebapi.com/steam/api/float?url=${encodeURIComponent(inspectLink)}&key=${STEAMWEBAPI_KEY}";
                const response = await axios.get(url, { timeout: 8000 });       

                if (response.data && response.data.float !== undefined && response.data.float !== null) {
                    return {
                        float: Number(response.data.float),
                        seed: response.data.paintseed !== undefined ? Number(response.data.paintseed) : null
                    };
                }
            } catch (err) {
            }
        }

        try {
            const url = "https://api.csgofloat.com/?url=${encodeURIComponent(inspectLink)}";
            const response = await axios.get(url, {
                timeout: 5000,
                headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
            });

            if (response.data && response.data.iteminfo && response.data.iteminfo.floatvalue !== undefined) {
                return {
                    float: Number(response.data.iteminfo.floatvalue),
                    seed: response.data.iteminfo.paintseed !== undefined ? Number(response.data.iteminfo.paintseed) : null
                };
            }
        } catch(e) {
            throw e; 
        }

        return fallback;
    }, fallback);
}

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