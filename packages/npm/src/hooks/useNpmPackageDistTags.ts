
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmDistTags } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageDistTagsOptions {
  enabled?: boolean;
}

export function useNpmPackageDistTags(
  name: string,
  options: UseNpmPackageDistTagsOptions = {}
): UseQueryResult<NpmDistTags, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmDistTags, Error>({
    queryKey: npmQueryKeys.packageDistTags(name),
    queryFn: ({ signal }) => client.package(name).distTags(signal),
    enabled: enabled && name.length > 0,
  });
}
