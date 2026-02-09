import React from 'react';
import { Copy, Terminal } from 'lucide-react';

interface CodeCanvasProps {
  file: {
    path: string;
    content: string;
    sha: string;
  } | null;
  repoName: string;
}

const CodeCanvas: React.FC<CodeCanvasProps> = ({ file, repoName }) => {
  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black">
        <Terminal className="w-10 h-10 text-[#004400] mb-4" />
        <h3 className="text-[#004400] font-bold uppercase tracking-[0.3em] text-xs">Awaiting Node selection</h3>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="h-10 border-b border-[#00ff00]/10 px-4 flex items-center justify-between bg-black">
        <span className="text-[9px] font-bold uppercase tracking-widest truncate opacity-60">
          {repoName} / {file.path}
        </span>
        <button 
          onClick={handleCopy}
          className="p-1 border-none hover:bg-transparent"
          title="COPY_SOURCE"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-xs leading-relaxed text-[#00ff00]/80 whitespace-pre-wrap font-mono">
          {file.content || "// NO_DATA_DETECTED //"}
        </pre>
      </div>
      <div className="h-6 border-t border-[#00ff00]/10 px-4 flex items-center justify-between text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">
        <span>SHA: {file.sha.substring(0, 12)}</span>
        <span>STORM_PROTOCOL_V1</span>
      </div>
    </div>
  );
};

export default CodeCanvas;