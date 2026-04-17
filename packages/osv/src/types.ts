export type {
  OsvVulnerability,
  OsvQueryParams,
  OsvQueryResult,
  OsvBatchQuery,
  OsvBatchQueryResult,
  OsvBatchResultEntry,
  OsvAffected,
  OsvPackageIdentifier,
  OsvSeverity,
  OsvReference,
  OsvCredit,
  OsvRange,
  OsvRangeEvent,
  OsvEcosystem,
} from 'osv-api-client';

export type { UseOsvVulnOptions } from './hooks/useOsvVuln.js';
export type { UseOsvQueryOptions } from './hooks/useOsvQuery.js';
export type { UseOsvQueryBatchOptions } from './hooks/useOsvQueryBatch.js';
