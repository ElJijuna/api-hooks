
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmDownloadRange, type NpmDownloadPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageDownloadRangeOptions {
  period?: NpmDownloadPeriod;
  enabled?: boolean;
}

export function useNpmPackageDownloadRange(
  name: string,
  options: UseNpmPackageDownloadRangeOptions = {}
): UseQueryResult<NpmDownloadRange, Error> {
  const { period = 'last-month', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmDownloadRange, Error>({
    queryKey: npmQueryKeys.packageDownloadRange(name, period),
    queryFn: ({ signal }) => client.package(name).downloadRange(period, signal),
    enabled: enabled && name.length > 0,
  });
}
