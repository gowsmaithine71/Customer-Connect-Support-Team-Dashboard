import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetDate, slaLimit, onBreach }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isBreached, setIsBreached] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        setIsBreached(true);
        onBreach?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onBreach]);

  const getColorClass = () => {
    if (isBreached) return 'text-red-400';
    if (timeLeft.hours < 1) return 'text-red-400';
    if (timeLeft.hours < 2) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className={`flex items-center gap-2 ${getColorClass()}`}>
      <Clock className="w-4 h-4" />
      <span className="font-mono text-lg font-bold">
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
}
