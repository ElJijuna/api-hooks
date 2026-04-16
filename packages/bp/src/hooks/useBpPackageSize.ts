import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type BundleSize } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageSizeOptions {
  enabled?: boolean;
}

export function useBpPackageSize(
  name: string,
  options: UseBpPackageSizeOptions = {}
): UseQueryResult<BundleSize, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<BundleSize, Error>({
    queryKey: bpQueryKeys.packageSize(name),
    queryFn: ({ signal }) => client.package(name).size(undefined, signal),
    enabled: enabled && name.length > 0,
  });
}
