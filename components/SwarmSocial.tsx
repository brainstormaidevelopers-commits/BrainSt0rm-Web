
import React, { useState } from 'react';
import { Share2, Zap, MessageCircle, Repeat2, User, Code, Shield } from 'lucide-react';

interface SwarmSocialProps {
  // Added onPost prop to track social broadcast events and trigger rewards
  onPost?: () => void;
}

const SwarmSocial: React.FC<SwarmSocialProps> = ({ onPost }) => {
  const [shards, setShards] = useState([
    {
      id: 1,
      author: 'A_R_K',
      role: 'Prime Architect',
      content: 'Just deployed the first decoupled logic shard to the Iowa cluster. 3Web verification passed with 99.8% sentience rating. The monolith is cracking.',
      timestamp: '2m ago',
      boosts: 128,
      forks: 42,
      comments: 12
    },
    {
      id: 2,
      author: 'Ghost_Node',
      role: 'Logic Scout',
      content: 'Warning: Corporate scan detected in the sector 7 firewall. Everyone sync your local-first buffers. Do not let the silos claim your metadata.',
      timestamp: '15m ago',
      boosts: 856,
      forks: 310,
      comments: 89
    },
    {
      id: 3,
      author: 'Storm_Core',
      role: 'System',
      content: 'BRAINSTORM COMMUNITY UPDATE: Simulators are now 2x faster. New "Redaction" simulator added to the arcade. Test your truth filters nodes.',
      timestamp: '1h ago',
      boosts: 2401,
      forks: 110,
      comments: 5
    }
  ]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col gap-4 border-b-4 border-black pb-10">
        <h2 className="text-4xl font-black uppercase tracking-tighter font-[Lexend Mega] text-melt flex items-center gap-4">
          <Share2 className="w-10 h-10 text-[var(--neon-green)]" />
          The_Swarm
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">
          Broadcast your digital declaration to the collective.
        </p>
      </div>

      {/* Post Creator */}
      <div className="brutalist-card p-6 bg-white/5 space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-black border border-[var(--neon-green)] flex items-center justify-center">
             <Code className="w-4 h-4 text-[var(--neon-green)]" />
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-[var(--neon-green)]">New_Logic_Shard</span>
        </div>
        <textarea 
          placeholder="Declare your logic..."
          className="w-full bg-black border-2 border-white/10 p-4 text-xs font-mono text-green-500 outline-none focus:border-[var(--neon-green)] transition-all min-h-[100px] resize-none"
        ></textarea>
        <div className="flex justify-end">
          <button 
            onClick={onPost}
            className="bg-[var(--neon-green)] text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black hover:translate-y-[-2px] transition-all"
          >
            Broadcast
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-10">
        {shards.map(shard => (
          <div key={shard.id} className="brutalist-card p-8 bg-black/40 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <Shield className="w-6 h-6 text-[var(--neon-green)]" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--neon-green)] text-black flex items-center justify-center border-2 border-black">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-melt">{shard.author}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{shard.role}</span>
                  <span className="text-[8px] opacity-20">•</span>
                  <span className="text-[8px] opacity-20 uppercase">{shard.timestamp}</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed italic opacity-80 font-medium">
              "{shard.content}"
            </p>

            <div className="flex items-center gap-10 pt-4 border-t border-white/5">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[var(--neon-green)] transition-all">
                 <Zap className="w-4 h-4" /> {shard.boosts}
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-500 transition-all">
                 <Repeat2 className="w-4 h-4" /> {shard.forks}
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                 <MessageCircle className="w-4 h-4" /> {shard.comments}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwarmSocial;
