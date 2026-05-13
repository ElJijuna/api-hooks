import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, UserResource, type GitHubPagedResponse } from 'gh-api-client';

type GitHubEvent = Awaited<ReturnType<UserResource['publicEvents']>>['values'][0];
type EventsParams = Parameters<UserResource['publicEvents']>[0];
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserPublicEventsOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Fetches public events performed by a GitHub user.
 *
 * @param login - GitHub username
 * @param params - Optional pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GitHubEvent}
 */
export function useGhUserPublicEvents(
  login: string,
  params?: EventsParams,
  options: UseGhUserPublicEventsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubEvent>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubEvent>, Error>({
    queryKey: ghQueryKeys.userPublicEvents(login, params),
    queryFn: ({ signal }) => client.user(login).publicEvents(params, signal),
    enabled: enabled && login.length > 0,
  });
}
