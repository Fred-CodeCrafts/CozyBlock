'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { CozyCharacter } from '@/components/Character';
import WalletWrapper from '@/components/WalletWrapper';
import CozyButton from '@/components/CozyButton';
import { FloatingElements } from '@/components/FloatingElements';
import { startMission } from '@/lib/mission';
import { Shirt, Flower, RotateCcw } from 'lucide-react';
import ClosetModal from '@/components/ClosetModal';
import { getEquippedOutfit, getPendingUnlock, clearPendingUnlock, equipOutfit, Outfit } from '@/lib/outfits';
import { getFlowers } from '@/lib/currency';
import { AnimatePresence, motion } from 'framer-motion';
import StrategySelector from '@/components/StrategySelector';
import { saveStrategy, STRATEGIES } from '@/lib/strategies';

const DURATIONS = [
  { label: '15m', value: 15 },
  { label: '1h', value: 60 },
  { label: '4h', value: 240 },
];

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [duration, setDuration] = useState(15);
  const [outfitId, setOutfitId] = useState('default');
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0].id);
  const [isClosetOpen, setIsClosetOpen] = useState(false);
  const [flowers, setFlowers] = useState(0);
  const [newUnlock, setNewUnlock] = useState<Outfit | null>(null);

  useEffect(() => {
    setMounted(true);
    setOutfitId(getEquippedOutfit().id);
    setFlowers(getFlowers());

    // Check for pending unlocks from mission result
    const pending = getPendingUnlock();
    if (pending) {
      setNewUnlock(pending);
      clearPendingUnlock();
    }

    const handleUpdates = () => {
      setOutfitId(getEquippedOutfit().id);
      setFlowers(getFlowers());
    };

    window.addEventListener('outfit-changed', handleUpdates);
    window.addEventListener('flowers-changed', handleUpdates);

    return () => {
      window.removeEventListener('outfit-changed', handleUpdates);
      window.removeEventListener('flowers-changed', handleUpdates);
    };
  }, []);

  const handleStartMission = () => {
    console.log('Starting mission with duration:', duration);
    startMission(duration);
    router.push('/waiting');
  };

  const handleEquipAndClose = () => {
    if (newUnlock) {
      equipOutfit(newUnlock.id); // Triggers update via event
      setNewUnlock(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingElements />

      {/* UNLOCK OVERLAY */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-6 shadow-2xl skew-y-1">
              <h2 className="text-2xl font-bold text-stone-800 animate-pulse">New Style Unlocked!</h2>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-100 rounded-full blur-xl opacity-50 animate-pulse" />
                <CozyCharacter state="celebrating" size="md" outfitId={newUnlock.id} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-stone-800">{newUnlock.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold tracking-wider
                            ${newUnlock.rarity === 'legendary' ? 'bg-purple-100 text-purple-600' :
                    newUnlock.rarity === 'epic' ? 'bg-pink-100 text-pink-600' :
                      newUnlock.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                        'bg-stone-100 text-stone-500'}
                        `}>
                  {newUnlock.rarity}
                </span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleEquipAndClose}
                  className="w-full py-3 bg-stone-800 text-white rounded-xl font-bold shadow-lg hover:bg-stone-700"
                >
                  Wear It Now
                </button>
                <button
                  onClick={() => setNewUnlock(null)}
                  className="w-full py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CURRENCY DISPLAY */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
        <Flower className="w-4 h-4 text-pink-500" />
        <span className="font-bold text-stone-700">{flowers}</span>
      </div>

      {/* CLOSET BUTTON */}
      <button
        onClick={() => setIsClosetOpen(true)}
        className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-sm border border-stone-100 text-stone-400 hover:text-stone-600 transition-all z-20"
      >
        <Shirt className="w-5 h-5" />
      </button>

      <ClosetModal isOpen={isClosetOpen} onClose={() => setIsClosetOpen(false)} />

      <main className="relative flex flex-col items-center gap-4 z-10 w-full max-w-[320px] sm:max-w-sm text-center">
        {/* ... Header ... */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">
            Cozy Block
          </h1>
          <p className="text-stone-500 text-base">
            Relax. Wait. Pudding.
          </p>
        </div>

        {/* Character */}
        <div className="py-2">
          <CozyCharacter state={isConnected ? "happy" : "resting"} size="md" outfitId={outfitId} />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-2 w-full">



          {/* Duration Selector */}
          {isConnected && (
            <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-stone-200/50">
              {DURATIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-all
                    ${duration === opt.value
                      ? 'bg-white shadow-sm text-stone-800'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'}
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Strategy Selector */}
          {isConnected && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <StrategySelector
                selectedId={selectedStrategy}
                onSelect={(s) => {
                  setSelectedStrategy(s.id);
                  saveStrategy(s.id);
                }}
              />
            </div>
          )}

          {/* Wallet Connection */}
          <WalletWrapper className={isConnected ? "scale-90 opacity-80 hover:opacity-100 transition-opacity" : ""} />

          {/* Start Button (only if connected) */}
          {isConnected && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center pt-2">
              <CozyButton
                onClick={handleStartMission}
                className="w-full max-w-[200px] py-3 text-base shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-200/60"
              >
                Start Mission
              </CozyButton>
            </div>
          )}

          {/* Helper Text */}
          {!isConnected && (
            <p className="text-xs text-stone-400 mt-1">
              Connect your wallet to begin your journey
            </p>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="absolute bottom-3 flex flex-col items-center gap-2 text-stone-400 text-sm">
        <div>
          <a href="https://github.com/Fred-CodeCrafts/CozyBlock" target="_blank" className="hover:text-stone-600 transition-colors">Documentation</a>
          <span className="mx-2">•</span>
          <a
            href="https://www.linkedin.com/in/heyfrederickgw/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-600 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>

      {/* Reset Demo Button (Bottom Left) */}
      <button
        onClick={() => {
          if (confirm('Reset everything for demo?')) {
            localStorage.clear();
            window.location.reload();
          }
        }}
        className="absolute bottom-4 left-4 p-2 opacity-40 hover:opacity-100 transition-all z-50 text-red-400"
        title="Reset Demo"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
