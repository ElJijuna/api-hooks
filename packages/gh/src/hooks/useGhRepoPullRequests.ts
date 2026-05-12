import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPullRequest, type GitHubPagedResponse, type PullRequestsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoPullRequestsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches pull requests for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubPullRequest>`
 */
export function useGhRepoPullRequests(
  owner: string,
  repo: string,
  params?: PullRequestsParams,
  options: UseGhRepoPullRequestsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubPullRequest>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubPullRequest>, Error>({
    queryKey: ghQueryKeys.repoPullRequests(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequests(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
