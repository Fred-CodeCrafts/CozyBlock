'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Placeholder Lo-Fi Track (Broke For Free - Night Owl)
    const AUDIO_SRC = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3";

    useEffect(() => {
        // Attempt auto-play on mount
        const audio = audioRef.current;
        if (audio) {
            audio.volume = 0.3; // Low background volume
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false)); // Autoplay prevented
            }
        }
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} src={AUDIO_SRC} loop />
            <button
                onClick={toggleMute}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-stone-100 hover:bg-white transition-colors text-stone-600"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </div>
    );
}
