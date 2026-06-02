import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { ContentParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoMultipleRawOptions {
  /** Disable the query. Also disabled when required params are empty. */
  enabled?: boolean;
}

/**
 * Fetches the raw text content of multiple files in a GitHub repository.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param filePaths - Paths to files (e.g. `['README.md', 'src/index.ts']`)
 * @param params - Optional ref params (`ref` to specify branch/tag/commit)
 * @param options - Query options including optional `enabled`
 * @returns TanStack Query result with a map of file path to raw content
 */
export function useGhRepoMultipleRaw(
  owner: string,
  repo: string,
  filePaths: string[],
  params?: ContentParams,
  options: UseGhRepoMultipleRawOptions = {},
): UseQueryResult<Record<string, string>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<Record<string, string>, Error>({
    queryKey: ghQueryKeys.repoMultipleRaw(owner, repo, filePaths, params),
    queryFn: ({ signal }) => client.repo(owner, repo).multipleRaw(filePaths, params, signal),
    enabled:
      enabled &&
      owner.length > 0 &&
      repo.length > 0 &&
      filePaths.length > 0 &&
      filePaths.every((filePath) => filePath.length > 0),
  });
}
