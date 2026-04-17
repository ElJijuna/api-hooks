import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type UpdateGistData } from 'gh-api-client';

export function useGhUpdateGist(
  gistId: string
): UseMutationResult<GitHubGist, Error, UpdateGistData> {
  const client = useMemo(() => new GitHubClient(), []);

  return useMutation<GitHubGist, Error, UpdateGistData>({
    mutationFn: (data) => client.gist(gistId).update(data),
  });
}
