import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmSearchResult, type NpmSearchParams } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmSearchOptions extends Omit<NpmSearchParams, 'text'> {
  enabled?: boolean;
}

export function useNpmSearch(
  text: string,
  options: UseNpmSearchOptions = {}
): UseQueryResult<NpmSearchResult, Error> {
  const { enabled = true, ...rest } = options;
  const client = useMemo(() => new NpmClient(), []);

  const params: NpmSearchParams = { text, ...rest };

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    enabled: enabled && text.length > 0,
  });
}
