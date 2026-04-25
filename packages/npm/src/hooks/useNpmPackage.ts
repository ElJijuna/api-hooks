import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmPackument } from 'npmjs-api-client';
import { useNpmClient } from '../NpmClientContext.js';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageOptions {
  enabled?: boolean;
}

export function useNpmPackage(
  name: string,
  options: UseNpmPackageOptions = {}
): UseQueryResult<NpmPackument, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackument, Error>({
    queryKey: npmQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    enabled: enabled && name.length > 0,
  });
}
