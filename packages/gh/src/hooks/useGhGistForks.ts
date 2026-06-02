import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GistFork, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistForksOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the forks of a GitHub Gist.
 *
 * @param gistId - Gist ID
 * @param params - Optional pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GistFork}
 */
export function useGhGistForks(
  gistId: string,
  params?: PaginationParams,
  options: UseGhGistForksOptions = {},
): UseQueryResult<GitHubPagedResponse<GistFork>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GistFork>, Error>({
    queryKey: ghQueryKeys.gistForks(gistId, params),
    queryFn: ({ signal }) => client.gist(gistId).forks(params, signal),
    enabled: enabled && gistId.length > 0,
  });
}
