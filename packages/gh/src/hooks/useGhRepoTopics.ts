import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoTopicsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the topics for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param options - Query options
 * @returns TanStack Query result with `string[]`
 */
export function useGhRepoTopics(
  owner: string,
  repo: string,
  options: UseGhRepoTopicsOptions = {}
): UseQueryResult<string[], Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<string[], Error>({
    queryKey: ghQueryKeys.repoTopics(owner, repo),
    queryFn: ({ signal }) => client.repo(owner, repo).topics(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
