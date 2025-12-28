'use client';

// Define keys for localStorage
const START_TIME_KEY = 'cozy_mission_start_time';
const STATUS_KEY = 'cozy_mission_status'; // 'idle' | 'waiting' | 'completed'
const POINTS_KEY = 'cozy_mission_points';

export type MissionStatus = 'idle' | 'waiting' | 'completed';

export const getMissionStatus = (): MissionStatus => {
    if (typeof window === 'undefined') return 'idle';
    return (localStorage.getItem(STATUS_KEY) as MissionStatus) || 'idle';
};

export const setMissionStatus = (status: MissionStatus) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STATUS_KEY, status);
};

export const getStartTime = (): number | null => {
    if (typeof window === 'undefined') return null;
    const time = localStorage.getItem(START_TIME_KEY);
    return time ? parseInt(time, 10) : null;
};

export const startMission = (durationMinutes: number = 0.5) => { // Default to short demo if not provided
    if (typeof window === 'undefined') return;
    const now = Date.now();
    localStorage.setItem(START_TIME_KEY, now.toString());
    localStorage.setItem(STATUS_KEY, 'waiting');
    localStorage.setItem('cozy_mission_duration', (durationMinutes * 60 * 1000).toString()); // Save as ms
    return now;
};

export const completeMission = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STATUS_KEY, 'completed');
    // Simple random rewards
    const oldPoints = parseInt(localStorage.getItem(POINTS_KEY) || '0', 10);
    const earned = 100;
    localStorage.setItem(POINTS_KEY, (oldPoints + earned).toString());
    // Clear start time
    localStorage.removeItem(START_TIME_KEY);
};

export const resetMission = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STATUS_KEY, 'idle');
    localStorage.removeItem(START_TIME_KEY);
};

export const getMissionDuration = (): number => {
    if (typeof window === 'undefined') return 10000; // Default 10s if missing
    const stored = localStorage.getItem('cozy_mission_duration');
    return stored ? parseInt(stored, 10) : 10000;
};
