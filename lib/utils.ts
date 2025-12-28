import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Thetanuts Integration
export async function startHiddenReward(): Promise<{ txHash: string }> {
  console.log("Mocking Thetanuts hidden reward transaction...");
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Return a fake hash
  return {
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  };
}
