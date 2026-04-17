import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { OsvClient, type OsvBatchQuery, type OsvBatchQueryResult } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvQueryBatchOptions {
  enabled?: boolean;
}

export function useOsvQueryBatch(
  queries: OsvBatchQuery[],
  options: UseOsvQueryBatchOptions = {}
): UseQueryResult<OsvBatchQueryResult, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvBatchQueryResult, Error>({
    queryKey: osvQueryKeys.queryBatch(queries),
    queryFn: () => client.queryBatch(queries),
    enabled: enabled && queries.length > 0,
  });
}
