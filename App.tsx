
import React, { useState, useEffect } from 'react';
import { githubService } from './services/githubService';
import { geminiService } from './services/geminiService';
import { AppState, Repository, FileNode, ChatMessage, UserRank } from './types';
import Sidebar from './components/Sidebar';
import MissionBriefs from './components/MissionBriefs';
import FileTree from './components/FileTree';
import CodeCanvas from './components/CodeCanvas';
import AIChat from './components/AIChat';
import EthosLanding from './components/EthosLanding';
import Arcade from './components/Arcade';
import SwarmSocial from './components/SwarmSocial';
import DiscordSync from './components/DiscordSync';
import DigitalClock from './components/DigitalClock';

type MainView = 'landing' | 'dashboard' | 'connect' | 'arcade' | 'swarm' | 'uplink' | 'vault';

const App: React.FC = () => {
  const [view, setView] = useState<MainView>('landing');
  const [state, setState] = useState<AppState>({
    githubToken: localStorage.getItem('gh_token'),
    user: null,
    isGuest: false,
    xp: parseInt(localStorage.getItem('storm_xp') || '0'),
    rank: 'ANON',
    repos: [],
    selectedRepo: null,
    currentPath: '',
    fileTree: [],
    selectedFile: null,
    isLoading: false,
    error: null,
    theme: 'dark'
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    if (state.githubToken) {
      handleInitialLoad(state.githubToken);
    }
    updateRank();
  }, [state.xp]);

  const updateRank = () => {
    let newRank: UserRank = 'ANON';
    if (state.xp > 5000) newRank = 'PRIME';
    else if (state.xp > 2000) newRank = 'ARCHITECT';
    else if (state.xp > 500) newRank = 'SCOUT';
    else if (state.xp > 0) newRank = 'NEURON';
    
    if (state.isGuest && state.xp < 500) newRank = 'ANON';
    
    setState(prev => ({ ...prev, rank: newRank }));
    localStorage.setItem('storm_xp', state.xp.toString());
  };

  const addXP = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleInitialLoad = async (token: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, isGuest: false }));
    try {
      const user = await githubService.fetchUser(token);
      const repos = await githubService.fetchRepos(token);
      setState(prev => ({ ...prev, user, repos, isLoading: false }));
      addXP(100); // XP for successful uplink
      if (view === 'connect' || view === 'landing') setView('dashboard');
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false, githubToken: null }));
      localStorage.removeItem('gh_token');
      setView('connect');
    }
  };

  const handleGuestEntry = () => {
    setState(prev => ({ 
      ...prev, 
      isGuest: true, 
      user: { login: 'GUEST_NODE', name: 'Anonymous Agent', avatar_url: '', html_url: '' } 
    }));
    setView('arcade');
    addXP(10);
  };

  const handleConnect = () => {
    if (!tokenInput.trim()) return;
    localStorage.setItem('gh_token', tokenInput);
    setState(prev => ({ ...prev, githubToken: tokenInput }));
    handleInitialLoad(tokenInput);
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_token');
    setState(prev => ({
      ...prev,
      githubToken: null,
      user: null,
      isGuest: false,
      repos: [],
      selectedRepo: null,
      currentPath: '',
      fileTree: [],
      selectedFile: null,
    }));
    setChatHistory([]);
    setView('landing');
  };

  const selectRepo = async (repo: Repository) => {
    setState(prev => ({ ...prev, isLoading: true, selectedRepo: repo, currentPath: '', selectedFile: null }));
    try {
      const contents = await githubService.fetchRepoContents(state.githubToken!, repo.owner.login, repo.name);
      setState(prev => ({ ...prev, fileTree: contents, isLoading: false }));
      addXP(50);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const navigateTo = async (path: string) => {
    if (!state.selectedRepo) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const contents = await githubService.fetchRepoContents(
        state.githubToken!, 
        state.selectedRepo.owner.login, 
        state.selectedRepo.name, 
        path
      );
      setState(prev => ({ ...prev, fileTree: contents, currentPath: path, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const openFile = async (file: FileNode) => {
    if (!state.selectedRepo) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { content, sha } = await githubService.fetchFileContent(
        state.githubToken!,
        state.selectedRepo.owner.login,
        state.selectedRepo.name,
        file.path
      );
      setState(prev => ({
        ...prev,
        selectedFile: { path: file.path, content, sha },
        isLoading: false
      }));
      addXP(5);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  if (view === 'landing') {
    return (
      <EthosLanding 
        onEnter={() => setView(state.githubToken ? 'dashboard' : 'connect')} 
        onGuest={handleGuestEntry}
        onNavigate={() => {}}
        theme="dark" 
      />
    );
  }

  if (view === 'connect') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-black">
        <div className="max-w-md w-full border border-[#00ff00]/40 p-12 space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-xl font-bold uppercase tracking-widest text-[#00ff00]">AUTH_UPLINK</h1>
            <p className="text-[10px] text-[#00cc00]/60 uppercase tracking-[0.3em]">Direct GitHub Protocol Required.</p>
          </div>
          <div className="space-y-6">
            <input 
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="GITHUB_PAT"
              className="w-full px-4 py-3 bg-black border border-[#00ff00]/40 text-[#00ff00] text-sm"
            />
            <button onClick={handleConnect} className="w-full font-bold py-4 tracking-[0.2em] text-sm">INITIALIZE</button>
            <button onClick={handleGuestEntry} className="w-full text-[10px] opacity-40 hover:opacity-100 uppercase tracking-widest">Proceed as Guest</button>
          </div>
          {state.error && <p className="text-red-500 text-[10px] text-center uppercase">{state.error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-black text-[#00ff00]">
      <Sidebar 
        user={state.user} 
        onLogout={handleLogout} 
        onViewChange={(v: any) => setView(v)}
        currentView={view}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden border-l border-[#00ff00]/20">
        <header className="h-14 border-b border-[#00ff00]/20 flex items-center justify-between px-6 shrink-0 bg-black/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">STORM://{state.rank}</span>
              <span className="text-[8px] opacity-40 uppercase tracking-tighter">XP: {state.xp.toLocaleString()}</span>
            </div>
            <span className="text-[#00ff00]/20">|</span>
            <div className="hidden md:flex items-center gap-4">
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                {state.selectedRepo ? state.selectedRepo.name : view.toUpperCase()}
               </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <DigitalClock />
            <div className="text-[10px] opacity-40 uppercase tracking-widest">
              {state.isLoading ? 'SYNCING...' : 'STABLE'}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {view === 'dashboard' && (
              !state.selectedRepo ? (
                <MissionBriefs repos={state.repos} onSelect={selectRepo} />
              ) : (
                <div className="h-full flex overflow-hidden">
                  <div className="w-64 border-r border-[#00ff00]/20 flex flex-col overflow-hidden shrink-0">
                    <FileTree 
                      files={state.fileTree} 
                      onNavigate={navigateTo} 
                      onOpenFile={openFile}
                      currentPath={state.currentPath}
                    />
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col border-r border-[#00ff00]/20 overflow-hidden">
                      <CodeCanvas 
                        file={state.selectedFile} 
                        repoName={state.selectedRepo.name}
                      />
                    </div>
                    <div className="w-80 flex flex-col shrink-0 bg-black">
                      <AIChat 
                        selectedFile={state.selectedFile}
                        history={chatHistory}
                        setHistory={setChatHistory}
                        onAction={() => addXP(20)}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
            {view === 'arcade' && <div className="p-8"><Arcade onWin={() => addXP(100)} /></div>}
            {view === 'swarm' && <SwarmSocial onPost={() => addXP(15)} />}
            {view === 'uplink' && <DiscordSync />}
            {view === 'vault' && (
              <div className="p-20 text-center space-y-10">
                <h2 className="text-3xl font-bold uppercase tracking-[0.4em]">STORM_MANIFESTO</h2>
                <p className="max-w-2xl mx-auto text-sm leading-relaxed opacity-60 italic">
                  "The node is a citizen. The logic is a declaration. We build in the shadows to illuminate the cluster. Connect your shards, earn your rank, protect the truth."
                </p>
                <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                   {['ALTRUISM', 'Sovereignty', 'Performance', 'Decoupled'].map(t => (
                     <div key={t} className="p-6 border border-[#004400] uppercase text-[10px] tracking-widest">{t}</div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
