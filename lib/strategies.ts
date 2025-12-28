export interface Strategy {
    id: string;
    name: string;
    description: string;
    technicalDescription: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    apy: string;
    color: string;
}

export const STRATEGIES: Strategy[] = [
    {
        id: 'safe',
        name: 'Safe & Warm',
        description: 'Cozy up with a steady yield.',
        technicalDescription: 'Covered Call Vault',
        riskLevel: 'Low',
        apy: '5-12%',
        color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
        id: 'spicy',
        name: 'Spicy & Bold',
        description: 'A little adventure for more treat.',
        technicalDescription: 'Put Selling Vault',
        riskLevel: 'Medium',
        apy: '15-25%',
        color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
        id: 'degen',
        name: 'Degen Mode',
        description: 'High risk, high pudding.',
        technicalDescription: 'Exotic Options Vault',
        riskLevel: 'High',
        apy: '50%+',
        color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
];

const STRATEGY_KEY = 'cozy_strategy';

export function saveStrategy(strategyId: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STRATEGY_KEY, strategyId);
    }
}

export function getStrategy(): Strategy | undefined {
    if (typeof window !== 'undefined') {
        const id = localStorage.getItem(STRATEGY_KEY);
        return STRATEGIES.find(s => s.id === id) || STRATEGIES[0];
    }
    return STRATEGIES[0];
}
