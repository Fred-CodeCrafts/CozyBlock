import { motion, type Transition } from 'framer-motion';
import { OUTFITS, Outfit } from '@/lib/outfits';
import { useMemo } from 'react';

interface CozyCharacterProps {
    state: 'idle' | 'resting' | 'happy' | 'celebrating' | 'sleeping';
    size?: 'sm' | 'md' | 'lg';
    outfitId?: string;
}

type AnimationConfig = {
    y?: number[];
    rotate?: number[];
    scale?: number[];
    transition: Transition;
};

export function CozyCharacter({ state, size = 'lg', outfitId = 'default' }: CozyCharacterProps) {
    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-40 h-40',
        lg: 'w-56 h-56',
    };

    const outfit = useMemo(() => OUTFITS.find(o => o.id === outfitId) || OUTFITS[0], [outfitId]);

    const getAnimation = (): AnimationConfig => {
        switch (state) {
            case 'resting':
                return {
                    y: [0, -5, 0],
                    rotate: [-1, 1, -1],
                    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
                };
            case 'sleeping':
                return {
                    y: [0, 2, 0],
                    scale: [1, 1.01, 1],
                    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
                };
            case 'happy':
                return {
                    y: [0, -8, 0],
                    scale: [1, 1.02, 1],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
                };
            case 'celebrating':
                return {
                    y: [0, -15, 0],
                    rotate: [-5, 5, -5],
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
                };
            default:
                return {
                    y: [0, -8, 0],
                    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
                };
        }
    };

    const scaleMap = {
        sm: 0.6,
        md: 1,
        lg: 1.4,
    };

    // Cute kitten emoji-style character using CSS/SVG
    return (
        <motion.div
            className={`${sizeClasses[size]} relative flex items-center justify-center`}
            animate={getAnimation()}
        >
            {/* Glow effect behind character */}
            <div className={`absolute inset-0 rounded-full bg-primary/10 blur-2xl`} />

            {/* Zzz Animation for sleeping */}
            {state === 'sleeping' && (
                <div className="absolute -top-8 right-0 font-bold text-primary/60 text-2xl z-20">
                    <motion.div
                        animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, 10] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        className="absolute"
                    >
                        Zzz
                    </motion.div>
                </div>
            )}

            {/* Main character container */}
            <div className="relative" style={{ transform: `scale(${scaleMap[size]})`, transformOrigin: 'center center' }}>
                {/* Body - DYNAMIC COLOR */}
                <div className={`relative w-40 h-44 bg-gradient-to-b ${outfit.visuals.bodyColor} rounded-[60%_60%_50%_50%] shadow-soft`}>
                    {/* Inner body highlight */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-to-b from-white/40 to-transparent rounded-full opacity-80" />

                    {/* Ears */}
                    <div className={`absolute -top-4 left-4 w-10 h-12 bg-gradient-to-b ${outfit.visuals.bodyColor} rounded-[50%_50%_0_0] rotate-[-20deg] shadow-sm`}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-6 bg-pink-200/50 rounded-[50%_50%_0_0]" />
                    </div>
                    <div className={`absolute -top-4 right-4 w-10 h-12 bg-gradient-to-b ${outfit.visuals.bodyColor} rounded-[50%_50%_0_0] rotate-[20deg] shadow-sm`}>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-6 bg-pink-200/50 rounded-[50%_50%_0_0]" />
                    </div>

                    {/* Face */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full z-10">
                        {/* Eyes */}
                        <div className="flex justify-center gap-8">
                            {state === 'sleeping' ? (
                                <>
                                    <div className="w-5 h-2 border-b-2 border-gray-700/80 rounded-full" />
                                    <div className="w-5 h-2 border-b-2 border-gray-700/80 rounded-full" />
                                </>
                            ) : (
                                <>
                                    <div className="w-5 h-6 bg-gray-800 rounded-full relative">
                                        <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                    <div className="w-5 h-6 bg-gray-800 rounded-full relative">
                                        <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ACCESSORIES - Glasses */}
                        {outfit.visuals.accessories === 'glasses' && (
                            <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-28 flex justify-center gap-4">
                                <div className="w-10 h-10 border-4 border-gray-800 rounded-full bg-blue-900/20 backdrop-blur-[1px]" />
                                <div className="w-10 h-10 border-4 border-gray-800 rounded-full bg-blue-900/20 backdrop-blur-[1px]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-gray-800" />
                            </div>
                        )}

                        {/* Nose */}
                        <div className="flex justify-center mt-3">
                            <div className="w-3 h-2 bg-pink-300 rounded-full" />
                        </div>

                        {/* Mouth */}
                        <div className="flex justify-center mt-1">
                            {state === 'celebrating' || state === 'happy' ? (
                                <div className="w-8 h-4 border-b-4 border-gray-700/80 rounded-b-full" />
                            ) : (
                                <div className="flex gap-1">
                                    <div className="w-3 h-2 border-b-2 border-r-2 border-gray-700/80 rounded-br-full" />
                                    <div className="w-3 h-2 border-b-2 border-l-2 border-gray-700/80 rounded-bl-full" />
                                </div>
                            )}
                        </div>

                        {/* Cheeks */}
                        <div className="absolute top-8 left-2 w-5 h-3 bg-pink-300 rounded-full opacity-40 blur-sm" />
                        <div className="absolute top-8 right-2 w-5 h-3 bg-pink-300 rounded-full opacity-40 blur-sm" />
                    </div>

                    {/* Paws */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-4">
                        <div className={`w-8 h-6 bg-gradient-to-t ${outfit.visuals.bodyColor} rounded-full shadow-sm`} />
                        <div className={`w-8 h-6 bg-gradient-to-t ${outfit.visuals.bodyColor} rounded-full shadow-sm`} />
                    </div>
                </div>

                {/* ACCESSORIES - Hat */}
                {outfit.visuals.accessories === 'hat' && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 flex flex-col items-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
                        <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-purple-500" />
                    </div>
                )}
                {/* ACCESSORIES - Crown */}
                {outfit.visuals.accessories === 'crown' && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl filter drop-shadow-md">
                        👑
                    </div>
                )}
                {/* ACCESSORIES - Headset */}
                {outfit.visuals.accessories === 'headphones' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none">
                        <div className="w-full h-full relative">
                            <div className="absolute bottom-0 left-[-10px] w-12 h-16 bg-red-500 rounded-2xl border-2 border-gray-800" />
                            <div className="absolute bottom-0 right-[-10px] w-12 h-16 bg-red-500 rounded-2xl border-2 border-gray-800" />
                        </div>
                    </div>
                )}
                {/* ACCESSORIES - Scarf */}
                {outfit.visuals.accessories === 'scarf' && (
                    <div className="absolute top-[85px] left-1/2 -translate-x-1/2 w-44 h-12 bg-red-400 rounded-full border-4 border-red-500 z-20 shadow-sm flex items-center justify-center">
                        <div className="w-full h-full border-dashed border-white border-2 rounded-full opacity-50" />
                    </div>
                )}

                {/* Tail */}
                <motion.div
                    className={`absolute -right-6 bottom-4 w-6 h-16 bg-gradient-to-t ${outfit.visuals.bodyColor} rounded-full origin-bottom`}
                    animate={{ rotate: state === 'happy' || state === 'celebrating' ? [-20, 20, -20] : [-10, 10, -10] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Floating elements for celebrating */}
            {state === 'celebrating' && (
                <>
                    <motion.div className="absolute -top-4 -left-4 text-2xl" animate={{ y: [-5, 5], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>✨</motion.div>
                </>
            )}
        </motion.div>
    );
}
