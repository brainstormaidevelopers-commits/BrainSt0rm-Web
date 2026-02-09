import React from 'react';
import { FileNode } from '../types';
import { ChevronLeft } from 'lucide-react';

interface FileTreeProps {
  files: FileNode[];
  onNavigate: (path: string) => void;
  onOpenFile: (file: FileNode) => void;
  currentPath: string;
}

const FileTree: React.FC<FileTreeProps> = ({ files, onNavigate, onOpenFile, currentPath }) => {
  const goBack = () => {
    const parts = currentPath.split('/');
    parts.pop();
    onNavigate(parts.join('/'));
  };

  return (
    <div className="flex flex-col h-full text-[11px]">
      <div className="p-3 border-b border-[#00ff00]/20 flex items-center justify-between opacity-60">
        <span className="uppercase tracking-widest font-bold">Explorer</span>
        {currentPath && (
          <button 
            onClick={goBack}
            className="border-none p-0 hover:bg-transparent hover:text-white"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 && (
          <div className="p-4 text-center italic opacity-30">Empty Node</div>
        )}
        {files.sort((a, b) => (a.type === 'dir' ? -1 : 1)).map(node => (
          <button
            key={node.sha}
            onClick={() => node.type === 'dir' ? onNavigate(node.path) : onOpenFile(node)}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#00ff00]/10 text-left transition-colors group border-none"
          >
            <span className="opacity-40">
              {node.type === 'dir' ? '[+]' : ' - '}
            </span>
            <span className="truncate flex-1 uppercase tracking-tighter group-hover:text-white">{node.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileTree;