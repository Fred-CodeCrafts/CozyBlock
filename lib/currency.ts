
const FLOWERS_KEY = 'cozy_flowers_balance';

export const getFlowers = (): number => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(FLOWERS_KEY);
    return stored ? parseInt(stored, 10) : 0;
};

export const addFlowers = (amount: number) => {
    const current = getFlowers();
    const newBalance = current + amount;
    localStorage.setItem(FLOWERS_KEY, newBalance.toString());
    window.dispatchEvent(new Event('flowers-changed'));
};

export const spendFlowers = (amount: number): boolean => {
    const current = getFlowers();
    if (current < amount) return false;

    const newBalance = current - amount;
    localStorage.setItem(FLOWERS_KEY, newBalance.toString());
    window.dispatchEvent(new Event('flowers-changed'));
    return true;
};
