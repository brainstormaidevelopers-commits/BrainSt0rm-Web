
import { GitHubUser, Repository, FileNode } from '../types';

const BASE_URL = 'https://api.github.com';

export const githubService = {
  async fetchUser(token: string): Promise<GitHubUser> {
    const response = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user. Check your token.');
    return response.json();
  },

  async fetchRepos(token: string): Promise<Repository[]> {
    const response = await fetch(`${BASE_URL}/user/repos?sort=updated&per_page=100`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch repositories.');
    return response.json();
  },

  async fetchRepoContents(token: string, owner: string, repo: string, path: string = ''): Promise<FileNode[]> {
    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch contents.');
    return response.json();
  },

  async fetchFileContent(token: string, owner: string, repo: string, path: string): Promise<{ content: string; sha: string }> {
    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch file content.');
    const data = await response.json();
    // GitHub returns content as base64
    const content = data.content ? atob(data.content.replace(/\s/g, '')) : '';
    return { content, sha: data.sha };
  }
};
