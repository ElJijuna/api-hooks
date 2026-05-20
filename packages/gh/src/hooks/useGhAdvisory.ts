import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoryOptions {
  /** Disable the query. Also disabled when `ghsaId` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a single global security advisory by its GHSA ID.
 *
 * @param ghsaId - The GHSA identifier (e.g. `'GHSA-xxxx-xxxx-xxxx'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubAdvisory}
 */
export function useGhAdvisory(
  ghsaId: string,
  options: UseGhAdvisoryOptions = {}
): UseQueryResult<GitHubAdvisory, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubAdvisory, Error>({
    queryKey: ghQueryKeys.advisory(ghsaId),
    queryFn: ({ signal }) => client.advisory(ghsaId, signal),
    enabled: enabled && ghsaId.length > 0,
  });
}
