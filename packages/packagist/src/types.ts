export type {
  DownloadStats,
  Maintainer,
  MetadataChange,
  MetadataChangesOptions,
  MetadataChangesResponse,
  MetadataOptions,
  PackageAuthor,
  PackageData,
  PackageDist,
  PackageListEntry,
  PackageListOptions,
  PackageListResponse,
  PackageMetadataResponse,
  PackageMutationResponse,
  PackageName,
  PackageResponse,
  PackageSource,
  PackageStatsResponse,
  PackageSummary,
  PackageUpdateResponse,
  PackageVersion,
  PackagistClientEvents,
  PackagistClientOptions,
  PopularPackagesOptions,
  PopularPackagesResponse,
  RequestEvent,
  SearchPackagesOptions,
  SearchPackagesResponse,
  SecurityAdvisoriesOptions,
  SecurityAdvisoriesResponse,
  SecurityAdvisory,
  SecurityAdvisorySource,
  StatisticsResponse,
} from 'php-packagist-api-client';

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
