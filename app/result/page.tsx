'use client';

import { useState, useEffect } from 'react';
import { CozyCharacter } from '@/components/Character';
import CozyButton from '@/components/CozyButton';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { resetMission, getMissionDuration } from '@/lib/mission';
import { FloatingElements } from '@/components/FloatingElements';
import { getEquippedOutfit, unlockRandomOutfit, setPendingUnlock, unlockOutfit } from '@/lib/outfits';
import { addFlowers } from '@/lib/currency';
import { Flower } from 'lucide-react';

export default function ResultPage() {
    const router = useRouter();
    const [equippedId, setEquippedId] = useState('default');
    const [earnedFlowers, setEarnedFlowers] = useState(0);

    useEffect(() => {
        setEquippedId(getEquippedOutfit().id);

        // Calculate drop
        const durationMs = getMissionDuration();
        const durationMinutes = durationMs / (1000 * 60);

        // Reward Logic: 10 Flowers per minute (simple base rate)
        // e.g., 15m = 150 flowers
        const amount = Math.floor(durationMinutes * 10);
        setEarnedFlowers(amount);

        // Add to balance
        if (amount > 0) {
            addFlowers(amount);
        }

        // Random Drop Chance (For Epic/Legendary)
        // Delay slightly to ensure smooth mount
        const drop = unlockRandomOutfit(durationMinutes);
        if (drop) {
            unlockOutfit(drop.id); // <--- FIX: Actually save the unlock!
            setPendingUnlock(drop.id);
            // Note: We don't show it here, we let Home Page show it
        }

    }, []);

    const handleHome = () => {
        resetMission();
        router.push('/');
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-8 gap-8 text-center bg-[#FDFBF7]">
            <FloatingElements />

            {/* MAIN CARD */}
            <div className="w-full max-w-[320px] sm:max-w-sm bg-white rounded-3xl shadow-2xl shadow-blue-100/50 p-6 flex flex-col items-center space-y-4 border border-white">
                <div className="relative transform scale-90">
                    <CozyCharacter state="happy" size="md" outfitId={equippedId} />
                    <motion.div
                        className="absolute -top-4 -right-4 text-3xl"
                        animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎉
                    </motion.div>
                </div>

                <div className="text-center space-y-1">
                    <h1 className="text-xl font-bold text-stone-800">
                        Session Complete!
                    </h1>
                    <p className="text-xs text-stone-400">You did great today.</p>
                </div>

                {/* FLOWER REWARD */}
                <div className="w-full bg-pink-50 border border-pink-100 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-500 shadow-sm">
                        <Flower className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Rewards Earned</p>
                        <p className="text-base font-bold text-stone-700">{earnedFlowers} Flowers</p>
                    </div>
                </div>

                <div className="w-full bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                        🎁
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Surprise Gift</p>
                        <p className="text-base font-bold text-stone-700">100 IDRX</p>
                    </div>
                </div>

                <CozyButton onClick={handleHome} className="w-full rounded-xl py-3 text-sm shadow-none bg-stone-100 text-stone-600 hover:bg-stone-200">
                    Take another break
                </CozyButton>
            </div>

        </main>
    );
}
