import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type CreateGistData } from 'gh-api-client';

export interface UseGhCreateGistOptions {
  token?: string;
}

export function useGhCreateGist(options: UseGhCreateGistOptions = {}): UseMutationResult<GitHubGist, Error, CreateGistData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubGist, Error, CreateGistData>({
    mutationFn: (data) => client.createGist(data),
  });
}
