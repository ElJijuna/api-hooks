export type {
  NuGetAutocompleteParams,
  NuGetAutocompleteResult,
  NuGetCatalogEntry,
  NuGetClientEvents,
  NuGetClientOptions,
  NuGetDependency,
  NuGetDependencyGroup,
  NuGetRegistrationIndex,
  NuGetRegistrationLeaf,
  NuGetRegistrationPage,
  NuGetSearchPackage,
  NuGetSearchParams,
  NuGetSearchResult,
  NuGetSearchVersion,
  RequestEvent,
} from 'nuget-api-client';
export type { UseNuGetSearchInfiniteOptions } from './hooks/useNuGetSearchInfinite.js';

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
