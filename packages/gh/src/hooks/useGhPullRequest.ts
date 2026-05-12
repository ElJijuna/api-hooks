import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPullRequest } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches a single pull request from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubPullRequest}
 */
export function useGhPullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhPullRequestOptions = {}
): UseQueryResult<GitHubPullRequest, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPullRequest, Error>({
    queryKey: ghQueryKeys.pullRequest(owner, repo, pullNumber),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequest(pullNumber).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
