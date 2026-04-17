import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type SimilarPackages } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageSimilarOptions {
  enabled?: boolean;
}

export function useBpPackageSimilar(
  name: string,
  options: UseBpPackageSimilarOptions = {}
): UseQueryResult<SimilarPackages, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<SimilarPackages, Error>({
    queryKey: bpQueryKeys.packageSimilar(name),
    queryFn: ({ signal }) => client.package(name).similar(signal),
    enabled: enabled && name.length > 0,
  });
}
