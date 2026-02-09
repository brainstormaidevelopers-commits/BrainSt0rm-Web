
import React, { useState } from 'react';
import { Repository } from '../types';
import { Search, Star, Clock, ChevronRight, GitFork } from 'lucide-react';

interface RepoBrowserProps {
  repos: Repository[];
  onSelect: (repo: Repository) => void;
}

const RepoBrowser: React.FC<RepoBrowserProps> = ({ repos, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Repositories</h2>
            <p className="text-slate-500">Select a project to start building</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Filter repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map(repo => (
            <button
              key={repo.id}
              onClick={() => onSelect(repo)}
              className="group text-left bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <GitFork className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Star className="w-3.5 h-3.5" />
                  {repo.stargazers_count}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{repo.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
                {repo.description || "No description provided."}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {repo.language || 'Documentation'}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {new Date(repo.updated_at).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No repositories found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoBrowser;
