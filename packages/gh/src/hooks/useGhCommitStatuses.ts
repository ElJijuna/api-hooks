import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CommitStatusesParams, GitHubCommitStatus, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhCommitStatusesOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubCommitStatus>>;
}

/**
 * Fetches the individual commit statuses (from CI/CD systems via the Statuses API).
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCommitStatus>`
 */
export function useGhCommitStatuses(
  owner: string,
  repo: string,
  ref: string,
  params?: CommitStatusesParams,
  options: UseGhCommitStatusesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubCommitStatus>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubCommitStatus>, Error>({
    queryKey: ghQueryKeys.commitStatuses(owner, repo, ref, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).statuses(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
