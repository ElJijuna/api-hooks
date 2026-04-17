import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { OsvClient, type OsvQueryParams, type OsvQueryResult } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvQueryOptions {
  enabled?: boolean;
}

export function useOsvQuery(
  params: OsvQueryParams,
  options: UseOsvQueryOptions = {}
): UseQueryResult<OsvQueryResult, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvQueryResult, Error>({
    queryKey: osvQueryKeys.query(params),
    queryFn: () => client.query(params),
    enabled,
  });
}
