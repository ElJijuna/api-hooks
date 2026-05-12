import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type GitHubPagedResponse, type ForksParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoForksOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches forks for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhRepoForks(
  owner: string,
  repo: string,
  params?: ForksParams,
  options: UseGhRepoForksOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.repoForks(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).forks(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
