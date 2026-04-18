import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type GitHubPagedResponse, type GistsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistsOptions {
  enabled?: boolean;
  token?: string;
}

export function useGhGists(
  params?: GistsParams,
  options: UseGhGistsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubGist>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubGist>, Error>({
    queryKey: ghQueryKeys.gists(params),
    queryFn: ({ signal }) => client.listGists(params, signal),
    enabled,
  });
}
