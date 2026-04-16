import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmUser } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmMaintainerOptions {
  enabled?: boolean;
}

export function useNpmMaintainer(
  username: string,
  options: UseNpmMaintainerOptions = {}
): UseQueryResult<NpmUser, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmUser, Error>({
    queryKey: npmQueryKeys.maintainer(username),
    queryFn: ({ signal }) => client.maintainer(username).info(signal),
    enabled: enabled && username.length > 0,
  });
}
