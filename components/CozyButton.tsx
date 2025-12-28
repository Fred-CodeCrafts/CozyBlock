import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { playClick } from '@/lib/sounds';

interface CozyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export default function CozyButton({
    children,
    className = '',
    variant = 'primary',
    onClick,
    ...props
}: CozyButtonProps) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playClick();
        onClick?.(e);
    };

    return (
        <button
            {...props}
            onClick={handleClick}
            className={cn(
                "px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95 shadow-md",
                variant === 'primary'
                    ? "bg-stone-800 text-white hover:bg-stone-700"
                    : "bg-white text-stone-800 hover:bg-stone-100",
                className
            )}
        >
            {children}
        </button>
    );
}
