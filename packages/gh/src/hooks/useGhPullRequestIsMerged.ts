import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestIsMergedOptions {
  /** Disable the query. Also disabled when any required param is empty/falsy. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Checks whether a GitHub pull request has been merged.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with `boolean`
 */
export function useGhPullRequestIsMerged(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhPullRequestIsMergedOptions = {}
): UseQueryResult<boolean, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<boolean, Error>({
    queryKey: ghQueryKeys.pullRequestIsMerged(owner, repo, pullNumber),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequest(pullNumber).isMerged(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
