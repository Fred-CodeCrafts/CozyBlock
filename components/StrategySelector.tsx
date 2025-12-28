'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Strategy, STRATEGIES } from '@/lib/strategies';
import { ChevronRight, X } from 'lucide-react';

interface StrategySelectorProps {
    selectedId: string;
    onSelect: (strategy: Strategy) => void;
}

export default function StrategySelector({ selectedId, onSelect }: StrategySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedStrategy = STRATEGIES.find(s => s.id === selectedId);

    const handleSelect = (strategy: Strategy) => {
        onSelect(strategy);
        setIsOpen(false);
    };

    return (
        <>

            {/* TRIGGER BUTTON (COMPACT) */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full max-w-[200px] mx-auto bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full py-1 px-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all gap-2"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-bold text-stone-600 text-xs truncate max-w-[120px]">
                        {selectedStrategy ? selectedStrategy.name : 'Strategy'}
                    </span>
                </div>
                <ChevronRight className="w-3 h-3 text-stone-400" />
            </button>

            {/* POPUP MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-3xl p-4 w-full max-w-sm shadow-2xl relative z-10 flex flex-col max-h-[80vh]"
                        >
                            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                <h3 className="font-bold text-lg text-stone-800">Select Vault Strategy</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
                                >
                                    <X className="w-4 h-4 text-stone-600" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {STRATEGIES.map((strategy) => (
                                    <button
                                        key={strategy.id}
                                        onClick={() => handleSelect(strategy)}
                                        className={`
                                            relative p-3 rounded-2xl border-2 text-left transition-all
                                            ${selectedId === strategy.id
                                                ? `${strategy.color} shadow-md scale-[1.02]`
                                                : 'bg-stone-50 border-transparent hover:bg-white hover:border-stone-200 text-stone-500'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm">{strategy.name}</h4>
                                            <span className="text-xs font-mono font-bold bg-white/50 px-2 py-1 rounded-md">
                                                {strategy.apy}
                                            </span>
                                        </div>

                                        <p className="text-xs opacity-80 mb-2">{strategy.description}</p>

                                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider border-t border-black/5 pt-2 mt-auto">
                                            <span>{strategy.riskLevel} Risk</span>
                                            <span className="opacity-60">{strategy.technicalDescription}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
