import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRelease } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoLatestReleaseOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Fetches the latest published release of a GitHub repository.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with {@link GitHubRelease}
 */
export function useGhRepoLatestRelease(
  owner: string,
  repo: string,
  options: UseGhRepoLatestReleaseOptions = {}
): UseQueryResult<GitHubRelease, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubRelease, Error>({
    queryKey: ghQueryKeys.repoLatestRelease(owner, repo),
    queryFn: ({ signal }) => client.repo(owner, repo).latestRelease(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
