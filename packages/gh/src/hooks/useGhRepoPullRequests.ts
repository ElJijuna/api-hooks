import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubPullRequest, PullRequestsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoPullRequestsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
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
  options: UseGhRepoPullRequestsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubPullRequest>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubPullRequest>, Error>({
    queryKey: ghQueryKeys.repoPullRequests(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequests(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
