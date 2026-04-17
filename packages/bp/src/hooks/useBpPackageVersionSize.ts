import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type BundleSize } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageVersionSizeOptions {
  enabled?: boolean;
}

export function useBpPackageVersionSize(
  name: string,
  version: string,
  options: UseBpPackageVersionSizeOptions = {}
): UseQueryResult<BundleSize, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<BundleSize, Error>({
    queryKey: bpQueryKeys.packageVersionSize(name, version),
    queryFn: ({ signal }) => client.package(name).size(version, signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
