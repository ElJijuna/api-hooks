import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubTag, TagsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoTagsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches tags for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubTag>`
 */
export function useGhRepoTags(
  owner: string,
  repo: string,
  params?: TagsParams,
  options: UseGhRepoTagsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubTag>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubTag>, Error>({
    queryKey: ghQueryKeys.repoTags(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).tags(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
