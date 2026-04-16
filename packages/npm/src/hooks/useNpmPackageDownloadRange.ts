import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmDownloadRange, type NpmDownloadPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageDownloadRangeOptions {
  period?: NpmDownloadPeriod;
  enabled?: boolean;
}

export function useNpmPackageDownloadRange(
  name: string,
  options: UseNpmPackageDownloadRangeOptions = {}
): UseQueryResult<NpmDownloadRange, Error> {
  const { period = 'last-month', enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmDownloadRange, Error>({
    queryKey: npmQueryKeys.packageDownloadRange(name, period),
    queryFn: ({ signal }) => client.package(name).downloadRange(period, signal),
    enabled: enabled && name.length > 0,
  });
}
