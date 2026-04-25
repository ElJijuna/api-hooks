
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmPerson } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageMaintainersOptions {
  enabled?: boolean;
}

export function useNpmPackageMaintainers(
  name: string,
  options: UseNpmPackageMaintainersOptions = {}
): UseQueryResult<NpmPerson[], Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPerson[], Error>({
    queryKey: npmQueryKeys.packageMaintainers(name),
    queryFn: ({ signal }) => client.package(name).maintainers(signal),
    enabled: enabled && name.length > 0,
  });
}
