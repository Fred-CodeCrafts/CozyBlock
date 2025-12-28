export const playClick = () => {
    // Soft click sound (Source: use-sound / Josh W Comeau)
    try {
        const audio = new Audio('https://raw.githubusercontent.com/joshwcomeau/use-sound/master/stories/sounds/pop-down.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed', e));
    } catch (err) {
        console.error("Audio creation failed", err);
    }
};

export const playSuccess = () => {
    // Gentle chime/success sound
    const audio = new Audio('https://raw.githubusercontent.com/joshwcomeau/use-sound/master/stories/sounds/pop-up-on.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => console.log('Audio play failed', e));
};

export const playHover = () => {
    // Very subtle hover tick (optional, might be annoying if too loud)
    // const audio = new Audio('...'); // Keeping it simple for now
};
