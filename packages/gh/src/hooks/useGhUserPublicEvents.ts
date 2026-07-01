import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, UserResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

type GitHubEvent = Awaited<ReturnType<UserResource['publicEvents']>>['values'][0];
type EventsParams = Parameters<UserResource['publicEvents']>[0];

export interface UseGhUserPublicEventsOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubEvent>>;
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
  options: UseGhUserPublicEventsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubEvent>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubEvent>, Error>({
    queryKey: ghQueryKeys.userPublicEvents(login, params),
    queryFn: ({ signal }) => client.user(login).publicEvents(params, signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
