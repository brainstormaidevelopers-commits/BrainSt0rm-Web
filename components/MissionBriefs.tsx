import React, { useState } from 'react';
import { Repository } from '../types';
import { Search, ChevronRight } from 'lucide-react';

interface MissionBriefsProps {
  repos: Repository[];
  onSelect: (repo: Repository) => void;
}

const MissionBriefs: React.FC<MissionBriefsProps> = ({ repos, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#00ff00]/20 pb-10">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-[#00ff00]">DIRECTIVES</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-1">Select logic shard for reconstruction</p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text"
            placeholder="FILTER_NODES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRepos.map(repo => (
          <div
            key={repo.id}
            onClick={() => onSelect(repo)}
            className="flex items-center justify-between p-4 border border-[#004400] hover:border-[#00ff00] hover:bg-[#00ff00]/5 cursor-pointer transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                {repo.name}
              </span>
              <span className="text-[10px] opacity-40 uppercase truncate max-w-md">
                {repo.description || "IDLE_DATA_BLOCK"}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] opacity-30 uppercase tracking-widest hidden md:block">
                {repo.language || 'DOCS'}
              </span>
              <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}

        {filteredRepos.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#004400]">
            <p className="text-[10px] uppercase opacity-40 tracking-widest">No matching directives found in cluster.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionBriefs;