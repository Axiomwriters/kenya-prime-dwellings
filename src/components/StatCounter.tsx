
import { useState, useEffect } from "react";

interface StatCounterProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
    bgColor: string;
    suffix?: string;
}

export const StatCounter = ({ icon, value, label, color, bgColor, suffix = "" }: StatCounterProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Initial Load Animation (Fast Count Up)
        let startTimestamp: number | null = null;
        const duration = 2000; // 2 seconds for initial count

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function for "Smart Rotation" feel (OutExpo)
            const easeOutExpo = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            };

            setCount(Math.floor(easeOutExpo(progress) * value));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);

        // Real-time "Live" updates simulation
        // Occasionally increment the count to show "activity"
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance to update
                setCount(prev => prev + 1);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [value]);

    return (
        <div className="flex items-center gap-3 animate-fade-in">
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div className="text-left">
                <p className="font-bold text-foreground min-w-[60px] tabular-nums transition-all duration-300">
                    {count.toLocaleString()}{suffix}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
};
