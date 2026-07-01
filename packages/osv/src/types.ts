export type {
  OsvAffected,
  OsvBatchQuery,
  OsvBatchQueryResult,
  OsvBatchResultEntry,
  OsvCredit,
  OsvEcosystem,
  OsvPackageIdentifier,
  OsvQueryParams,
  OsvQueryResult,
  OsvRange,
  OsvRangeEvent,
  OsvReference,
  OsvSeverity,
  OsvVulnerability,
} from 'osv-api-client';
export type { UseOsvQueryOptions } from './hooks/useOsvQuery.js';
export type { UseOsvQueryBatchOptions } from './hooks/useOsvQueryBatch.js';
export type { UseOsvVulnOptions } from './hooks/useOsvVuln.js';

import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

export type QueryOverrides<TData> = Omit<
  UseQueryOptions<TData, Error>,
  'queryKey' | 'queryFn' | 'enabled'
>;

export type InfiniteQueryOverrides<TData, TPageParam = number> = Omit<
  UseInfiniteQueryOptions<TData, Error, InfiniteData<TData, TPageParam>, QueryKey, TPageParam>,
  'queryKey' | 'queryFn' | 'enabled' | 'initialPageParam' | 'getNextPageParam'
>;

export type MutationOverrides<TData, TVariables, TContext = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  'mutationFn'
>;
