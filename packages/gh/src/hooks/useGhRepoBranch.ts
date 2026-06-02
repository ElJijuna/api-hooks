import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubBranch } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoBranchOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
}

/**
 * Fetches a specific branch from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param branch - Branch name (e.g. `'main'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubBranch}
 */
export function useGhRepoBranch(
  owner: string,
  repo: string,
  branch: string,
  options: UseGhRepoBranchOptions = {},
): UseQueryResult<GitHubBranch, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubBranch, Error>({
    queryKey: ghQueryKeys.repoBranch(owner, repo, branch),
    queryFn: ({ signal }) => client.repo(owner, repo).branch(branch, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && branch.length > 0,
  });
}
