import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubPullRequest } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
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
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPullRequest, Error>({
    queryKey: ghQueryKeys.pullRequest(owner, repo, pullNumber),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequest(pullNumber).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
