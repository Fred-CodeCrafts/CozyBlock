import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Lock, Flower } from 'lucide-react';
import { OUTFITS, Outfit, getUnlockedOutfits, equipOutfit, getEquippedOutfit, unlockOutfit } from '@/lib/outfits';
import { CozyCharacter } from './Character';
import { playClick } from '@/lib/sounds';
import { getFlowers, spendFlowers } from '@/lib/currency';

interface ClosetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ClosetModal({ isOpen, onClose }: ClosetModalProps) {
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string>('default');
    const [currentEquipped, setCurrentEquipped] = useState<string>('default');
    const [flowers, setFlowers] = useState(0);

    const updateState = () => {
        setUnlockedIds(getUnlockedOutfits());
        const equipped = getEquippedOutfit();
        setCurrentEquipped(equipped.id);
        setFlowers(getFlowers());
    };

    useEffect(() => {
        if (isOpen) {
            updateState();
            // Ensure selected has a fallback
            if (selectedId === 'default') {
                const equipped = getEquippedOutfit();
                setSelectedId(equipped.id);
            }
        }
    }, [isOpen]);

    const handleSelect = (id: string) => {
        playClick();
        setSelectedId(id);
    };

    const handleEquip = () => {
        playClick();
        equipOutfit(selectedId);
        setCurrentEquipped(selectedId);
    };

    const handlePurchase = () => {
        const outfit = OUTFITS.find(o => o.id === selectedId);
        if (!outfit) return;

        if (spendFlowers(outfit.price)) {
            playClick(); // Success sound ideally
            unlockOutfit(outfit.id);
            updateState(); // Refresh unlocked list and balance
        } else {
            // maybe shake animation or error sound
            console.log("Not enough flowers");
        }
    };

    const selectedOutfit = OUTFITS.find(o => o.id === selectedId) || OUTFITS[0];
    const isLocked = !unlockedIds.includes(selectedId);
    const canAfford = flowers >= selectedOutfit.price;

    const nextOutfit = () => {
        const idx = OUTFITS.findIndex(o => o.id === selectedId);
        const next = (idx + 1) % OUTFITS.length;
        setSelectedId(OUTFITS[next].id);
        playClick();
    };

    const prevOutfit = () => {
        const idx = OUTFITS.findIndex(o => o.id === selectedId);
        const prev = (idx - 1 + OUTFITS.length) % OUTFITS.length;
        setSelectedId(OUTFITS[prev].id);
        playClick();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-[95%] max-w-sm bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-stone-800">Closet</h2>
                                <div className="flex items-center gap-1 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                                    <Flower className="w-3 h-3 text-pink-500" />
                                    <span className="text-xs font-bold text-pink-700">{flowers}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-stone-500" />
                            </button>
                        </div>

                        {/* Main Preview Area */}
                        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white relative min-h-[300px]">
                            {/* Arrows */}
                            <button onClick={prevOutfit} className="absolute left-2 p-1.5 bg-white shadow-sm border rounded-full text-stone-400 hover:text-stone-800 z-10 transition-transform hover:scale-110">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextOutfit} className="absolute right-2 p-1.5 bg-white shadow-sm border rounded-full text-stone-400 hover:text-stone-800 z-10 transition-transform hover:scale-110">
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Character */}
                            <div className={`transition-all duration-300 transform scale-90 ${isLocked ? 'grayscale opacity-80' : ''}`}>
                                <CozyCharacter state="happy" size="md" outfitId={selectedId} />
                            </div>

                            {/* Info */}
                            <div className="mt-4 text-center space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                    <h3 className="text-base font-bold text-stone-800">{selectedOutfit.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                                        ${selectedOutfit.rarity === 'legendary' ? 'bg-purple-100 text-purple-600' :
                                            selectedOutfit.rarity === 'epic' ? 'bg-pink-100 text-pink-600' :
                                                selectedOutfit.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-stone-100 text-stone-500'}
                                    `}>
                                        {selectedOutfit.rarity}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-400 max-w-[200px] leading-tight">{selectedOutfit.description}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-white border-t border-stone-100 flex flex-col gap-3">
                            {isLocked ? (
                                selectedOutfit.price < 0 ? (
                                    // Not Buyable - Mission Reward
                                    <div className="w-full py-3 rounded-xl font-bold bg-stone-100 text-stone-500 flex items-center justify-center gap-2 cursor-help" title="Find this by completing missions!">
                                        <Lock className="w-4 h-4 opacity-50" />
                                        <span>Mission Reward</span>
                                    </div>
                                ) : (
                                    // Buyable
                                    <button
                                        onClick={handlePurchase}
                                        disabled={!canAfford}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                            ${canAfford
                                                ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-lg hover:shadow-pink-200'
                                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
                                        `}
                                    >
                                        {canAfford ? <Lock className="w-4 h-4 opacity-50" /> : <Lock className="w-4 h-4" />}
                                        {canAfford ? `Buy for ${selectedOutfit.price}` : `Need ${selectedOutfit.price}`} <Flower className="w-4 h-4" />
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={handleEquip}
                                    disabled={currentEquipped === selectedId}
                                    className={`w-full py-3 rounded-xl font-bold transition-all
                                        ${currentEquipped === selectedId
                                            ? 'bg-green-100 text-green-700 cursor-default'
                                            : 'bg-stone-800 text-white hover:bg-stone-700 shadow-lg hover:shadow-xl active:scale-95'}
                                    `}
                                >
                                    {currentEquipped === selectedId ? 'Equipped' : 'Wear Outfit'}
                                </button>
                            )}

                            {/* Mini Grid */}
                            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar justify-center">
                                {OUTFITS.map((o) => {
                                    const unlocked = unlockedIds.includes(o.id);
                                    const active = selectedId === o.id;
                                    return (
                                        <button
                                            key={o.id}
                                            onClick={() => handleSelect(o.id)}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all bg-gradient-to-br ${o.visuals.bodyColor}
                                                ${active ? 'border-stone-800 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}
                                                ${!unlocked ? 'opacity-50 grayscale' : ''}
                                            `}
                                        >
                                            {currentEquipped === o.id && unlocked && <div className="w-2 h-2 bg-stone-800 rounded-full" />}
                                            {!unlocked && <Lock className="w-3 h-3 text-white drop-shadow-md" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
