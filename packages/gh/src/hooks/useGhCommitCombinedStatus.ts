import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubCombinedStatus } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCommitCombinedStatusOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
}

/**
 * Fetches the combined commit status — an aggregation of all statuses for a ref.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubCombinedStatus}
 */
export function useGhCommitCombinedStatus(
  owner: string,
  repo: string,
  ref: string,
  options: UseGhCommitCombinedStatusOptions = {},
): UseQueryResult<GitHubCombinedStatus, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubCombinedStatus, Error>({
    queryKey: ghQueryKeys.commitCombinedStatus(owner, repo, ref),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).combinedStatus(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
