import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmPerson } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageMaintainersOptions {
  enabled?: boolean;
}

export function useNpmPackageMaintainers(
  name: string,
  options: UseNpmPackageMaintainersOptions = {}
): UseQueryResult<NpmPerson[], Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmPerson[], Error>({
    queryKey: npmQueryKeys.packageMaintainers(name),
    queryFn: ({ signal }) => client.package(name).maintainers(signal),
    enabled: enabled && name.length > 0,
  });
}
