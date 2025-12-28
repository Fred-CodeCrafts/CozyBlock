export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Outfit {
    id: string;
    name: string;
    rarity: Rarity;
    description: string;
    price: number;
    visuals: {
        bodyColor?: string; // Tailwind class or hex
        accessories?: 'hat' | 'glasses' | 'scarf' | 'crown' | 'headphones' | 'none';
        accessoryColor?: string;
    };
}

export const OUTFITS: Outfit[] = [
    {
        id: 'default',
        name: 'Classic Pudding',
        rarity: 'common',
        description: 'Just your regular comfortable self.',
        price: 0,
        visuals: { bodyColor: 'from-amber-100 to-amber-200', accessories: 'none' }
    },
    {
        id: 'cool_cat',
        name: 'Cool Cat',
        rarity: 'common',
        description: 'Stay chill.',
        price: 150,
        visuals: { bodyColor: 'from-blue-100 to-blue-200', accessories: 'glasses' }
    },
    {
        id: 'winter_cozy',
        name: 'Shy Pudding',
        rarity: 'rare',
        description: 'Warm and snug.',
        price: 300,
        visuals: { bodyColor: 'from-stone-100 to-stone-200', accessories: 'scarf' }
    },
    {
        id: 'party_pudding',
        name: 'Party Pudding',
        rarity: 'epic',
        description: 'Ready to celebrate!',
        price: -1, // Not buyable
        visuals: { bodyColor: 'from-pink-100 to-pink-200', accessories: 'hat' }
    },
    {
        id: 'royal_highness',
        name: 'Royal Highness',
        rarity: 'legendary',
        description: 'Bow down to the cuteness.',
        price: -1, // Not buyable
        visuals: { bodyColor: 'from-purple-100 to-purple-200', accessories: 'crown' }
    },
    {
        id: 'gamer_mode',
        name: 'Gamer Mode',
        rarity: 'rare',
        description: 'Focus +100',
        price: 400,
        visuals: { bodyColor: 'from-green-100 to-green-200', accessories: 'headphones' }
    },
    {
        id: 'dark_mode',
        name: 'Midnight',
        rarity: 'epic',
        description: 'Embrace the night.',
        price: -1, // Not buyable
        visuals: { bodyColor: 'from-slate-700 to-slate-900', accessories: 'none' }
    },
    {
        id: 'golden_god',
        name: 'Midas Touch',
        rarity: 'legendary',
        description: 'Pure gold.',
        price: -1, // Not buyable
        visuals: { bodyColor: 'from-yellow-300 to-yellow-500', accessories: 'crown' }
    }
];

// Storage Keys
const UNLOCKED_KEY = 'cozy_outfits_unlocked';
const EQUIPPED_KEY = 'cozy_outfit_equipped';
const PENDING_UNLOCK_KEY = 'cozy_pending_unlock';

export const getUnlockedOutfits = (): string[] => {
    if (typeof window === 'undefined') return ['default'];
    const stored = localStorage.getItem(UNLOCKED_KEY);
    return stored ? JSON.parse(stored) : ['default'];
};

export const getEquippedOutfit = (): Outfit => {
    if (typeof window === 'undefined') return OUTFITS[0];
    const id = localStorage.getItem(EQUIPPED_KEY) || 'default';
    return OUTFITS.find(o => o.id === id) || OUTFITS[0];
};

export const equipOutfit = (id: string) => {
    localStorage.setItem(EQUIPPED_KEY, id);
    // Dispatch event for UI updates
    window.dispatchEvent(new Event('outfit-changed'));
};

const saveUnlocked = (ids: string[]) => {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(ids));
};

export const unlockOutfit = (id: string) => {
    const unlocked = getUnlockedOutfits();
    if (!unlocked.includes(id)) {
        saveUnlocked([...unlocked, id]);
    }
};

export const getPendingUnlock = (): Outfit | null => {
    if (typeof window === 'undefined') return null;
    const id = localStorage.getItem(PENDING_UNLOCK_KEY);
    if (!id) return null;
    return OUTFITS.find(o => o.id === id) || null;
};

export const setPendingUnlock = (id: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PENDING_UNLOCK_KEY, id);
};

export const clearPendingUnlock = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PENDING_UNLOCK_KEY);
};

export const unlockRandomOutfit = (durationMinutes: number): Outfit | null => {
    const unlocked = getUnlockedOutfits();
    // Pool: Items that are NOT buyable (price < 0) and NOT unlocked
    const pool = OUTFITS.filter(o => o.price < 0 && !unlocked.includes(o.id));

    if (pool.length === 0) return null;

    // Drop Chance Calculation
    // Base chance greatly increased to 50% for visibility
    // e.g. 15m = 50% + small bonus
    let chance = 0.5 + (durationMinutes * 0.005);
    if (chance > 1.0) chance = 1.0; // Cap at 100%

    if (Math.random() > chance) return null;

    // Pick random from pool
    const winner = pool[Math.floor(Math.random() * pool.length)];

    // NOTE: We do NOT instantly unlock it here. We return it so the caller can setPendingUnlock.
    return winner;
};
