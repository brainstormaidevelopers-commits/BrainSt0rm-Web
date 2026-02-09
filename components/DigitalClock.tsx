import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1 font-mono text-xl font-black text-[var(--neon-green)] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)] px-4 py-1 border-2 border-[var(--neon-green)] bg-black/80">
      <span className="text-white opacity-40 text-[10px] mr-2">STORM_TIME</span>
      <span>{format(time.getHours())}</span>
      <span className="animate-pulse">:</span>
      <span>{format(time.getMinutes())}</span>
      <span className="text-sm opacity-60 ml-1">{format(time.getSeconds())}</span>
    </div>
  );
};

export default DigitalClock;