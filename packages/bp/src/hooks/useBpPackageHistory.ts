import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type PackageHistory } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageHistoryOptions {
  enabled?: boolean;
}

export function useBpPackageHistory(
  name: string,
  options: UseBpPackageHistoryOptions = {}
): UseQueryResult<PackageHistory, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<PackageHistory, Error>({
    queryKey: bpQueryKeys.packageHistory(name),
    queryFn: ({ signal }) => client.package(name).history(signal),
    enabled: enabled && name.length > 0,
  });
}
