import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required to access secret gists. */
  token?: string;
}

/**
 * Fetches a single GitHub Gist by ID.
 *
 * Pass a `token` in options to access secret gists.
 *
 * @param gistId - Gist ID
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with {@link GitHubGist}
 */
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
