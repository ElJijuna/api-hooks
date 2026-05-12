import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubAdvisory } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoryByCveOptions {
  /** Disable the query. Also disabled when `cveId` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Fetches a global security advisory by its CVE ID.
 *
 * Returns `null` when no advisory is found for the given CVE ID.
 *
 * @param cveId - The CVE identifier (e.g. `'CVE-2021-44228'`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubAdvisory | null`
 */
export function useGhAdvisoryByCve(
  cveId: string,
  options: UseGhAdvisoryByCveOptions = {}
): UseQueryResult<GitHubAdvisory | null, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubAdvisory | null, Error>({
    queryKey: ghQueryKeys.advisoryByCve(cveId),
    queryFn: ({ signal }) => client.advisoryByCve(cveId, signal),
    enabled: enabled && cveId.length > 0,
  });
}
