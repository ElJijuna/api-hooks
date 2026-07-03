export type {
  HexClientEvents,
  HexClientOptions,
  HexPackage,
  HexPackageMeta,
  HexPackageRelease,
  HexPackageSearchParams,
  HexRelease,
  HexReleaseMeta,
  HexReleasePublisher,
  HexReleaseRetirement,
  RequestEvent,
} from 'hex-api-client';
export type { UseHexPackagesInfiniteOptions } from './hooks/useHexPackagesInfinite.js';

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
