
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Terminal, Sparkles } from 'lucide-react';

interface AIChatProps {
  selectedFile: { path: string; content: string } | null;
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  // Add onAction prop to satisfy App.tsx requirements and support reward logic
  onAction?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ selectedFile, history, setHistory, onAction }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await geminiService.chatWithContext(
        [...history, userMsg], 
        selectedFile ? `File: ${selectedFile.path}\nContent:\n${selectedFile.content}` : undefined
      );
      setHistory(prev => [...prev, { role: 'model', text: response || 'ORACLE_SILENT', timestamp: Date.now() }]);
      // Trigger onAction callback to award XP in App state
      onAction?.();
    } catch (err: any) {
      setHistory(prev => [...prev, { role: 'model', text: `ERROR: ${err.message}`, timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || isTyping) return;
    setIsTyping(true);
    setHistory(prev => [...prev, { role: 'user', text: `CMD: ANALYZE ${selectedFile.path}`, timestamp: Date.now() }]);
    
    try {
      const response = await geminiService.analyzeCode(selectedFile.path, selectedFile.content);
      setHistory(prev => [...prev, { role: 'model', text: response || 'ANALYSIS_COMPLETE', timestamp: Date.now() }]);
      // Trigger onAction callback to award XP in App state
      onAction?.();
    } catch (err: any) {
      setHistory(prev => [...prev, { role: 'model', text: `ALERT: ${err.message}`, timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border-l border-[#00ff00]/10">
      <div className="h-10 border-b border-[#00ff00]/10 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">ORACLE_UPLINK</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[#00ff00] animate-pulse"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px] hide-scrollbar">
        {history.length === 0 && (
          <div className="p-3 border border-[#004400] opacity-40 italic">
            Waiting for input command. Oracle is listening to the cluster.
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center opacity-30 text-[8px] font-bold uppercase">
              <span>{msg.role === 'user' ? 'NODE' : 'ORACLE'}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className={`p-2 border ${msg.role === 'user' ? 'border-[#00ff00]/40' : 'border-[#004400]'} whitespace-pre-wrap`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-[9px] uppercase tracking-widest opacity-40 animate-pulse">
            Processing_Uplink...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#00ff00]/10">
        <button 
          onClick={handleAnalyze}
          disabled={!selectedFile || isTyping}
          className="w-full mb-3 flex items-center justify-center gap-2 py-2 text-[9px] uppercase tracking-widest border border-[#004400] hover:border-[#00ff00] disabled:opacity-20"
        >
          <Sparkles className="w-3 h-3" /> Scan_Shard
        </button>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="COMMAND..."
            className="flex-1 px-3 py-2 text-xs"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="px-3 border-[#004400] disabled:opacity-20"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
