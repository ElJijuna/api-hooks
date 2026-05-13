import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepositoryAdvisory } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoAdvisoryOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
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
  options: UseGhRepoAdvisoryOptions = {}
): UseQueryResult<GitHubRepositoryAdvisory, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubRepositoryAdvisory, Error>({
    queryKey: ghQueryKeys.repoAdvisory(owner, repo, ghsaId),
    queryFn: ({ signal }) => client.repo(owner, repo).repoAdvisory(ghsaId, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ghsaId.length > 0,
  });
}
