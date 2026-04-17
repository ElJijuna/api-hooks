import type { OsvBatchQuery, OsvQueryParams } from 'osv-api-client';

export const osvQueryKeys = {
  vuln: (id: string) => ['osv', 'vuln', id] as const,
  query: (params: OsvQueryParams) => ['osv', 'query', params] as const,
  queryBatch: (queries: OsvBatchQuery[]) => ['osv', 'queryBatch', queries] as const,
} as const;
