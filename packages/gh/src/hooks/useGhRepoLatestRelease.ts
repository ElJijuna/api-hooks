import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubRelease } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoLatestReleaseOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
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
  options: UseGhRepoLatestReleaseOptions = {},
): UseQueryResult<GitHubRelease, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubRelease, Error>({
    queryKey: ghQueryKeys.repoLatestRelease(owner, repo),
    queryFn: ({ signal }) => client.repo(owner, repo).latestRelease(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
