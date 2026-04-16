import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmPackument } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageOptions {
  enabled?: boolean;
}

export function useNpmPackage(
  name: string,
  options: UseNpmPackageOptions = {}
): UseQueryResult<NpmPackument, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmPackument, Error>({
    queryKey: npmQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    enabled: enabled && name.length > 0,
  });
}
