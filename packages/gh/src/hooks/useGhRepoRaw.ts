import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type ContentParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoRawOptions {
  /** Disable the query. Also disabled when required params are empty. */
  enabled?: boolean;
}

/**
 * Fetches the raw text content of a file in a GitHub repository.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param filePath - Path to the file (e.g. `'README.md'`, `'src/index.ts'`)
 * @param params - Optional ref params (`ref` to specify branch/tag/commit)
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with the raw file content as `string`
 */
export function useGhRepoRaw(
  owner: string,
  repo: string,
  filePath: string,
  params?: ContentParams,
  options: UseGhRepoRawOptions = {}
): UseQueryResult<string, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<string, Error>({
    queryKey: ghQueryKeys.repoRaw(owner, repo, filePath, params),
    queryFn: ({ signal }) => client.repo(owner, repo).raw(filePath, params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && filePath.length > 0,
  });
}
