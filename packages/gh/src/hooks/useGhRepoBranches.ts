import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { BranchesParams, GitHubBranch, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoBranchesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches branches for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubBranch>`
 */
export function useGhRepoBranches(
  owner: string,
  repo: string,
  params?: BranchesParams,
  options: UseGhRepoBranchesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubBranch>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubBranch>, Error>({
    queryKey: ghQueryKeys.repoBranches(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).branches(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
