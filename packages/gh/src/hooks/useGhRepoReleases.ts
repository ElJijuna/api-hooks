import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRelease, type GitHubPagedResponse, type ReleasesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoReleasesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  options: UseGhRepoReleasesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRelease>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubRelease>, Error>({
    queryKey: ghQueryKeys.repoReleases(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).releases(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
