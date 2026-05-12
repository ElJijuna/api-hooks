import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubCommit, type GitHubPagedResponse, type CommitsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoCommitsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches commits for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCommit>`
 */
export function useGhRepoCommits(
  owner: string,
  repo: string,
  params?: CommitsParams,
  options: UseGhRepoCommitsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubCommit>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubCommit>, Error>({
    queryKey: ghQueryKeys.repoCommits(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commits(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
