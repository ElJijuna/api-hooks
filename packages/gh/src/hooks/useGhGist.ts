import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistOptions {
  enabled?: boolean;
  token?: string;
}

export function useGhGist(
  gistId: string,
  options: UseGhGistOptions = {}
): UseQueryResult<GitHubGist, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubGist, Error>({
    queryKey: ghQueryKeys.gist(gistId),
    queryFn: ({ signal }) => client.gist(gistId).get(signal),
    enabled: enabled && gistId.length > 0,
  });
}
