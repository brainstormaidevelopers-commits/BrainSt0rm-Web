
import React from 'react';
import { LayoutDashboard, LogOut, Terminal, Gamepad2, Share2, MessageSquare, BookOpen, Fingerprint } from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogout: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onViewChange, currentView }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'CORE' },
    { id: 'arcade', icon: Gamepad2, label: 'ARCADE' },
    { id: 'swarm', icon: Share2, label: 'SWARM' },
    { id: 'uplink', icon: MessageSquare, label: 'UPLINK' },
    { id: 'vault', icon: BookOpen, label: 'VAULT' },
  ];

  return (
    <aside className="w-16 bg-black border-r border-[#00ff00]/20 flex flex-col items-center py-6 shrink-0 z-50">
      <div className="mb-10">
        <Terminal className="w-6 h-6 text-[#00ff00]" />
      </div>

      <nav className="flex-1 flex flex-col gap-8">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-2 transition-all relative group ${
              currentView === item.id ? 'bg-[#00ff00] text-black' : 'text-[#004400] hover:text-[#00ff00]'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <div className="absolute left-full ml-4 px-2 py-1 bg-black border border-[#00ff00] text-[8px] font-bold uppercase tracking-widest hidden group-hover:block whitespace-nowrap z-50">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-6">
        {user && user.avatar_url && (
          <div className="w-8 h-8 border border-[#00ff00]/20 overflow-hidden grayscale">
            <img src={user.avatar_url} alt="Node" className="w-full h-full object-cover" />
          </div>
        )}
        <button 
          onClick={onLogout}
          className="p-2 text-red-900 hover:text-red-500 transition-all"
          title="DISCONNECT"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
