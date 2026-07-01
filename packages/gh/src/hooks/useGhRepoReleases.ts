import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubRelease, ReleasesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoReleasesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubRelease>>;
}

/**
 * Fetches releases for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubRelease>`
 */
export function useGhRepoReleases(
  owner: string,
  repo: string,
  params?: ReleasesParams,
  options: UseGhRepoReleasesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubRelease>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRelease>, Error>({
    queryKey: ghQueryKeys.repoReleases(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).releases(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
