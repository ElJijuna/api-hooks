import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type UpdateGistData } from 'gh-api-client';

export interface UseGhUpdateGistOptions {
  token?: string;
}

export function useGhUpdateGist(
  gistId: string,
  options: UseGhUpdateGistOptions = {}
): UseMutationResult<GitHubGist, Error, UpdateGistData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubGist, Error, UpdateGistData>({
    mutationFn: (data) => client.gist(gistId).update(data),
  });
}
