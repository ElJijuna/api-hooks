import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubContent, type ContentParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoContentsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
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
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubContent | GitHubContent[], Error>({
    queryKey: ghQueryKeys.repoContents(owner, repo, path, params),
    queryFn: ({ signal }) => client.repo(owner, repo).contents(path, params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
