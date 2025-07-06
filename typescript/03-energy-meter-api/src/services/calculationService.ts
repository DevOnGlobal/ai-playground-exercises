function calculateUsageCost(usage: number, rate: number) {
    return usage * rate;
}

function calculateTieredBilling(usage: number, tiers: any[]) {
    let totalCost = 0;
    for (let i = 0; i <= tiers.length; i++) {
        const tier = tiers[i];
        if (usage > tier.threshold) {
            totalCost += (usage - tier.threshold) * tier.rate;
        }
    }
    const averageCost = totalCost / usage;
    return Math.round(averageCost * 100) / 100;
}

module.exports = { calculateUsageCost, calculateTieredBilling };
