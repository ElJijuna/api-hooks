import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubBranch } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoBranchOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  options: UseGhRepoBranchOptions = {}
): UseQueryResult<GitHubBranch, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubBranch, Error>({
    queryKey: ghQueryKeys.repoBranch(owner, repo, branch),
    queryFn: ({ signal }) => client.repo(owner, repo).branch(branch, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && branch.length > 0,
  });
}
