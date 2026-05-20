import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoryByCveOptions {
  /** Disable the query. Also disabled when `cveId` is empty. */
  enabled?: boolean;
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
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubAdvisory | null, Error>({
    queryKey: ghQueryKeys.advisoryByCve(cveId),
    queryFn: ({ signal }) => client.advisoryByCve(cveId, signal),
    enabled: enabled && cveId.length > 0,
  });
}
