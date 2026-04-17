import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';

export function useGhDeleteGist(
  gistId: string
): UseMutationResult<void, Error, void> {
  const client = useMemo(() => new GitHubClient(), []);

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).delete(),
  });
}
