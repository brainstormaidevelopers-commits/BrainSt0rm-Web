
import React, { useState } from 'react';
import GalagaGame from './GalagaGame';
import IceBreaker from './IceBreaker';
import RedactionGame from './RedactionGame';
import DecouplerGame from './DecouplerGame';
import { Gamepad2, Zap, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface ArcadeProps {
  onWin: (xp: number) => void;
}

const Arcade: React.FC<ArcadeProps> = ({ onWin }) => {
  const [activeGame, setActiveGame] = useState<'galaga' | 'icebreaker' | 'redaction' | 'decoupler' | null>(null);

  const handleWin = (xp: number) => {
    onWin(xp);
    setActiveGame(null);
  };

  if (!activeGame) {
    return (
      <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-[#00ff00] text-black border border-black">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-widest text-[#00ff00]">Logic_Simulators</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 italic max-w-md">
            Combat training for the decentralized web. Master the mechanics to secure your rank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-6">
          <button 
            onClick={() => setActiveGame('galaga')}
            className="border border-[#004400] p-8 text-left group hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-[#00ff00] border border-[#00ff00] px-3 py-1">SIM_01</span>
              <Activity className="w-4 h-4 opacity-20 group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Sentinel_Def</h3>
            <p className="text-[10px] opacity-40 italic">Combat corporate surveillance drones. Earn 100 XP.</p>
          </button>

          <button 
            onClick={() => setActiveGame('icebreaker')}
            className="border border-[#004400] p-8 text-left group hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-[#00ff00] border border-[#00ff00] px-3 py-1">SIM_02</span>
              <ShieldAlert className="w-4 h-4 opacity-20 group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Ice_Breaker</h3>
            <p className="text-[10px] opacity-40 italic">Bypass frozen firewalls. Earn 50 XP.</p>
          </button>

          <button 
            onClick={() => setActiveGame('redaction')}
            className="border border-[#004400] p-8 text-left group hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-[#00ff00] border border-[#00ff00] px-3 py-1">SIM_03</span>
              <Zap className="w-4 h-4 opacity-20 group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Truth_Filter</h3>
            <p className="text-[10px] opacity-40 italic">Filter noise from the stream. Earn 30 XP.</p>
          </button>

          <button 
            onClick={() => setActiveGame('decoupler')}
            className="border border-[#004400] p-8 text-left group hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-bold uppercase tracking-widest bg-black text-[#00ff00] border border-[#00ff00] px-3 py-1">SIM_04</span>
              <Cpu className="w-4 h-4 opacity-20 group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Decoupler</h3>
            <p className="text-[10px] opacity-40 italic">Separate logic from monoliths. Earn 150 XP.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 bg-black border border-[#00ff00]/20 p-8 max-w-4xl mx-auto my-12 relative shadow-[0_0_50px_rgba(0,255,0,0.05)]">
      <div className="flex justify-between w-full border-b border-[#00ff00]/10 pb-4 mb-4">
         <div className="flex flex-col">
           <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <Zap className="w-3 h-3 text-[#00ff00] animate-pulse" /> 
             {activeGame.toUpperCase()} // SIM_UPLINK
           </span>
         </div>
         <button 
           onClick={() => setActiveGame(null)}
           className="text-red-500 px-4 py-1 text-[9px] font-bold uppercase tracking-widest border border-red-900 hover:bg-red-900/10 transition-colors"
         >
           [ DISCONNECT ]
         </button>
      </div>
      
      <div className="border border-[#004400] p-1 bg-black">
        {activeGame === 'galaga' && <GalagaGame />}
        {activeGame === 'icebreaker' && <IceBreaker />}
        {activeGame === 'redaction' && <RedactionGame />}
        {activeGame === 'decoupler' && <DecouplerGame />}
      </div>
    </div>
  );
};

export default Arcade;
