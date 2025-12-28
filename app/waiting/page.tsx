'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CozyCharacter } from '@/components/Character';
import { completeMission, getMissionDuration, getStartTime } from '@/lib/mission';
import { playSuccess } from '@/lib/sounds';
import { motion } from 'framer-motion';
import { Sparkles, Volume2 } from 'lucide-react';
import { FloatingElements } from '@/components/FloatingElements';

export default function WaitingPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");
    const [message, setMessage] = useState("Pudding is gathering energy...");
    const [dreamText, setDreamText] = useState("Drifting into a soft dream...");
    const [isDreamLoading, setIsDreamLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [outfitId, setOutfitId] = useState('default');
    const [isSkipping, setIsSkipping] = useState(false);
    const [activeStrategy, setActiveStrategy] = useState<any>(null);

    useEffect(() => {
        // Load strategy
        import('@/lib/strategies').then(mod => {
            setActiveStrategy(mod.getStrategy());
        });
        // Get stored start time or default to now (should be set by page.tsx)
        const storedStart = getStartTime();
        const startTime = storedStart || Date.now();

        // Load outfit
        import('@/lib/outfits').then(mod => {
            setOutfitId(mod.getEquippedOutfit().id);
        });

        // Get dynamic duration
        const duration = getMissionDuration();

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const remaining = Math.max(0, duration - elapsed);

            // Calculate progress
            const pct = Math.min((elapsed / duration) * 100, 100);
            setProgress(pct);

            // Format remaining time
            const seconds = Math.floor((remaining / 1000) % 60);
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);
            const hours = Math.floor((remaining / (1000 * 60 * 60)));
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            if (remaining <= 0) {
                clearInterval(interval);
                completeMission();
                playSuccess();
                router.push('/result');
            }
        }, 100); // Update frequently for smooth progress

        return () => clearInterval(interval);
    }, [router]);

    const handleSkip = () => {
        if (isSkipping) return;
        setIsSkipping(true);
        completeMission();
        playSuccess();
        router.push('/result');
    };

    // Dynamic messages
    useEffect(() => {
        const msgs = [
            "Your buddy is finding their zen...",
            "Growing patience...",
            "Just a little longer...",
            "Deep breaths...",
        ];
        const msgTimer = setInterval(() => {
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        }, 3000);
        return () => clearInterval(msgTimer);
    }, []);

    // Placeholder for Gemini logic if keys were available, kept to match requested UI structure
    const generateDream = () => {
        setIsDreamLoading(true);
        setTimeout(() => {
            const dreams = [
                "floating on a cloud of vanilla foam...",
                "chasing fireflies in a warm meadow...",
                "sleeping under a blanket of stars...",
                "listening to the quiet rain outside..."
            ];
            setDreamText(dreams[Math.floor(Math.random() * dreams.length)]);
            setIsDreamLoading(false);
        }, 800);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 relative">
            <FloatingElements />
            {/* HEADER */}
            <div className="fixed top-0 w-full max-w-md p-4 flex justify-between items-center z-10">
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-stone-100">
                    <span className="text-sm font-medium text-stone-500">Wait Mode</span>
                </div>

                {/* Demo Skip Button */}
                <button
                    onClick={handleSkip}
                    disabled={isSkipping}
                    className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-400 hover:bg-stone-100 hover:text-stone-600 border border-transparent hover:border-stone-200 transition-all disabled:opacity-50"
                >
                    {isSkipping ? 'Skipping...' : 'Skip (Demo)'}
                </button>
            </div>

            {/* MAIN CARD */}
            <div className="w-full max-w-[320px] sm:max-w-sm bg-white rounded-3xl shadow-2xl shadow-blue-100/50 p-6 sm:p-8 flex flex-col items-center space-y-6 sm:space-y-8 border border-white">

                <div className="text-center space-y-2 animate-in fade-in zoom-in duration-500">
                    <h2 className="text-xl font-medium text-stone-700">Shhh... resting.</h2>
                    <p className="text-stone-400 text-sm">{message}</p>
                </div>

                <CozyCharacter state="sleeping" size="md" outfitId={outfitId} />

                <div className="w-full space-y-2">
                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary transition-all duration-300 ease-linear rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-[#FFB775] px-1 font-medium">
                        <span className="font-mono">{timeLeft} remaining</span>
                        <span>Just a moment</span>
                    </div>
                </div>

                {/* GEMINI-POWERED COZY THOUGHTS UI */}
                <div className="p-4 bg-blue-50 rounded-xl text-center w-full transition-all">

                    {/* Strategy Badge */}
                    <div className="flex justify-center mb-2">
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Strategy: {activeStrategy?.name || 'Loading...'}
                        </span>
                    </div>

                    <div className="min-h-[3rem] flex items-center justify-center">
                        {isDreamLoading ? (
                            <Sparkles className="w-4 h-4 text-blue-300 animate-spin" />
                        ) : (
                            <p className="text-sm text-blue-500 italic font-medium leading-relaxed">
                                "{dreamText}"
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center mt-3 space-x-4 border-t border-blue-100/50 pt-2">
                        <button
                            onClick={generateDream}
                            className="text-xs flex items-center space-x-1 text-slate-400 hover:text-blue-500 transition-colors"
                            title="New dream"
                        >
                            <Sparkles className="w-3 h-3" />
                            <span>New Dream</span>
                        </button>

                        <button
                            className={`text-xs flex items-center space-x-1 transition-colors ${isSpeaking ? 'text-blue-500 animate-pulse' : 'text-slate-400 hover:text-blue-500'}`}
                            title="Listen (Mock)"
                            disabled={isSpeaking}
                        >
                            <Volume2 className="w-3 h-3" />
                            <span>{isSpeaking ? 'Listening...' : 'Listen'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 text-[10px] text-stone-300">
                Powered by Base L2 • OnchainKit • Gemini AI • Thetanuts
            </div>
        </main>
    );
}
