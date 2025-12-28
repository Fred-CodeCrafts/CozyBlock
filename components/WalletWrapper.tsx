import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';

interface WalletWrapperProps {
    className?: string;
}

export default function WalletWrapper({ className = "" }: WalletWrapperProps) {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({
        address,
        token: '0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22', // IDRX on Base
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // 1. If Connected -> Show Custom Green UI
    if (isConnected) {
        return (
            <div className={`flex items-center gap-4 ${className}`}>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-green-700 text-sm">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    {balance && (
                        <span className="text-xs text-green-600/80">
                            {Number(balance.formatted).toFixed(4)} {balance.symbol}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => disconnect()}
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    // 2. If Disconnected -> Show Custom Connect Button
    return (
        <div className={`flex justify-center ${className}`}>
            <button
                onClick={() => connect({ connector: injected() })}
                className="bg-stone-800 text-white hover:bg-stone-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
            >
                <span>Connect Wallet</span>
            </button>
        </div>
    );
}
