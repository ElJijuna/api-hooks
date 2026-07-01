import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubTree, GitTreeParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoGitTreeOptions {
  /** Disable the query. Also disabled when required params are empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubTree>;
}

/**
 * Fetches a Git tree from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param treeSha - Tree SHA or ref
 * @param params - Optional params (`recursive: '1'`)
 * @param options - Query options
 * @returns TanStack Query result with the Git tree
 */
export function useGhRepoGitTree(
  owner: string,
  repo: string,
  treeSha: string,
  params?: GitTreeParams,
  options: UseGhRepoGitTreeOptions = {},
): UseQueryResult<GitHubTree, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubTree, Error>({
    queryKey: ghQueryKeys.repoGitTree(owner, repo, treeSha, params),
    queryFn: ({ signal }) => client.repo(owner, repo).gitTree(treeSha, params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && treeSha.length > 0,
  });
}
