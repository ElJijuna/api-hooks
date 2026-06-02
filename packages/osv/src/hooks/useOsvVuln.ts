import { useMemo } from 'react';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { OsvClient, type OsvVulnerability } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvVulnOptions {
  /** Disable the query. Also disabled when `id` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a single vulnerability record by its OSV ID (e.g. `'GHSA-1234-5678-9012'`, `'CVE-2021-44228'`).
 *
 * @param id - OSV vulnerability ID
 * @param options - Query options
 * @returns TanStack Query result with {@link OsvVulnerability}
 */
export function useOsvVuln(
  id: string,
  options: UseOsvVulnOptions = {},
): UseQueryResult<OsvVulnerability, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvVulnerability, Error>({
    queryKey: osvQueryKeys.vuln(id),
    queryFn: () => client.vuln(id).get(),
    enabled: enabled && id.length > 0,
  });
}
