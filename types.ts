
export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type UserRank = 'NEURON' | 'SCOUT' | 'ARCHITECT' | 'PRIME' | 'ANON';

export interface AppState {
  githubToken: string | null;
  user: GitHubUser | null;
  isGuest: boolean;
  xp: number;
  rank: UserRank;
  repos: Repository[];
  selectedRepo: Repository | null;
  currentPath: string;
  fileTree: FileNode[];
  selectedFile: {
    path: string;
    content: string;
    sha: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  theme: 'dark' | 'light';
}
