import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubContent, type ContentParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoContentsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the contents of a file or directory in a GitHub repository.
 *
 * Returns a single `GitHubContent` for files, or an array for directories.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - Path to file or directory (omit for root)
 * @param params - Optional params (e.g. `ref` for a specific branch/tag/SHA)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubContent | GitHubContent[]`
 */
export function useGhRepoContents(
  owner: string,
  repo: string,
  path?: string,
  params?: ContentParams,
  options: UseGhRepoContentsOptions = {}
): UseQueryResult<GitHubContent | GitHubContent[], Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubContent | GitHubContent[], Error>({
    queryKey: ghQueryKeys.repoContents(owner, repo, path, params),
    queryFn: ({ signal }) => client.repo(owner, repo).contents(path, params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
