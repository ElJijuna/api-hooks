import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { OsvClient, type OsvVulnerability } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvVulnOptions {
  enabled?: boolean;
}

export function useOsvVuln(
  id: string,
  options: UseOsvVulnOptions = {}
): UseQueryResult<OsvVulnerability, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvVulnerability, Error>({
    queryKey: osvQueryKeys.vuln(id),
    queryFn: () => client.vuln(id).get(),
    enabled: enabled && id.length > 0,
  });
}
