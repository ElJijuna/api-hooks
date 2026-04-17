import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type CreateGistData } from 'gh-api-client';

export function useGhCreateGist(): UseMutationResult<GitHubGist, Error, CreateGistData> {
  const client = useMemo(() => new GitHubClient(), []);

  return useMutation<GitHubGist, Error, CreateGistData>({
    mutationFn: (data) => client.createGist(data),
  });
}
