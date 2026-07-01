import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CheckRunsParams, GitHubCheckRun, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhCommitCheckRunsOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubCheckRun>>;
}

/**
 * Fetches GitHub Actions check runs for a commit.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCheckRun>`
 */
export function useGhCommitCheckRuns(
  owner: string,
  repo: string,
  ref: string,
  params?: CheckRunsParams,
  options: UseGhCommitCheckRunsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubCheckRun>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubCheckRun>, Error>({
    queryKey: ghQueryKeys.commitCheckRuns(owner, repo, ref, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).checkRuns(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
