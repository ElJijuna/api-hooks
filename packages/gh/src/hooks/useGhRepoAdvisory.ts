import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoAdvisoryOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubRepositoryAdvisory>;
}

/**
 * Fetches a single security advisory for a GitHub repository by GHSA ID.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param ghsaId - GHSA identifier (e.g. `'GHSA-1234-5678-9abc'`)
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with {@link GitHubRepositoryAdvisory}
 */
export function useGhRepoAdvisory(
  owner: string,
  repo: string,
  ghsaId: string,
  options: UseGhRepoAdvisoryOptions = {},
): UseQueryResult<GitHubRepositoryAdvisory, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubRepositoryAdvisory, Error>({
    queryKey: ghQueryKeys.repoAdvisory(owner, repo, ghsaId),
    queryFn: ({ signal }) => client.repo(owner, repo).repoAdvisory(ghsaId, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && ghsaId.length > 0,
  });
}
