import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubRepository, type GitHubPagedResponse, type SearchReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchReposOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
}

/**
 * Searches for GitHub repositories using GitHub's search syntax.
 *
 * @param params - Search params. `q` is required (e.g. `'language:typescript stars:>1000'`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubRepository>` (includes `totalCount`)
 */
export function useGhSearchRepos(
  params: SearchReposParams,
  options: UseGhSearchReposOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.searchRepos(params),
    queryFn: ({ signal }) => client.searchRepos(params, signal),
    enabled: enabled && params.q.length > 0,
  });
}
