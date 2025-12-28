'use client';

import { motion } from 'framer-motion';

export function FloatingElements() {
    const elements = [
        { emoji: '🌿', x: '10%', y: '20%', duration: 4, delay: 0 },
        { emoji: '🍃', x: '85%', y: '15%', duration: 5, delay: 1 },
        { emoji: '☁️', x: '75%', y: '60%', duration: 6, delay: 0.5 },
        { emoji: '🌸', x: '20%', y: '70%', duration: 4.5, delay: 1.5 },
        { emoji: '✨', x: '90%', y: '80%', duration: 3, delay: 2 },
        { emoji: '🌙', x: '5%', y: '50%', duration: 5.5, delay: 0.8 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {elements.map((el, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl opacity-30 select-none"
                    style={{ left: el.x, top: el.y }}
                    animate={{
                        y: [-10, 10, -10],
                        rotate: [-5, 5, -5],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: el.duration,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {el.emoji}
                </motion.div>
            ))}
        </div>
    );
}
