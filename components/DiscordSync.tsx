import React from 'react';
import { MessageSquare, ExternalLink, Users, Zap, ShieldCheck, Activity } from 'lucide-react';

const DiscordSync: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-16">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="p-6 bg-[#5865F2] text-white border-4 border-black shadow-[10px_10px_0px_var(--border-color)]">
          <MessageSquare className="w-16 h-16" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter font-[Lexend Mega] text-melt">Discord_Uplink</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">
          Synchronize your node with the STORM collective real-time swarm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="brutalist-card p-10 bg-[#5865F2]/10 border-[#5865F2] space-y-8 flex flex-col">
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-widest font-[Lexend Mega]">The_Haven</h3>
            <p className="text-sm font-bold italic opacity-70 leading-relaxed">
              Our Discord is more than a server. It is the primary cognitive bridge where architects share logic, debug shards, and organize the 3Web revolution.
            </p>
          </div>
          <div className="mt-auto pt-10">
            <a 
              href="https://discord.gg/your-link-here" 
              target="_blank" 
              className="flex items-center justify-center gap-4 bg-[#5865F2] text-white py-4 font-black uppercase tracking-widest border-4 border-black hover:translate-y-[-4px] transition-all shadow-[6px_6px_0px_black]"
            >
              JOIN_THE_SWARM <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="brutalist-card p-10 bg-black space-y-8 border-white/10">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-40 border-b border-white/10 pb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500 animate-pulse" /> Live_Event_Monitor
          </h3>
          <div className="space-y-4 font-mono text-[10px]">
             <div className="flex gap-4 opacity-60">
                <span className="text-blue-500">[14:22]</span>
                <span className="text-white">NODE_KORE joined #architecture</span>
             </div>
             <div className="flex gap-4 opacity-60">
                <span className="text-blue-500">[14:25]</span>
                <span className="text-white">SHARD_ID_0x7F broadcasted in #dev-feed</span>
             </div>
             <div className="flex gap-4 text-[var(--neon-green)]">
                <span className="text-blue-500">[14:31]</span>
                <span className="font-bold">SYSTEM: New 3Web Protocol release finalized</span>
             </div>
             <div className="flex gap-4 opacity-40">
                <span className="text-blue-500">[14:35]</span>
                <span className="text-white">GHOST_USER is typing...</span>
             </div>
          </div>
        </div>
      </div>

      <div className="brutalist-card p-12 bg-white/5 border-2 border-dashed border-white/20">
         <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-[var(--neon-green)] text-black flex items-center justify-center shrink-0 border-2 border-black shadow-[4px_4px_0px_black]">
               <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-4">
               <h4 className="text-xl font-black uppercase tracking-widest">Webhook_Automation</h4>
               <p className="text-xs font-bold opacity-60 leading-relaxed italic">
                 Connect your GitHub repository to our Discord logic-monitor. Receive automated sentience reports and architectural audits directly in your private channel.
               </p>
               <button className="text-[10px] font-black uppercase tracking-widest text-[var(--neon-green)] underline underline-offset-4">
                 Configure_Integration_v1.0
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DiscordSync;