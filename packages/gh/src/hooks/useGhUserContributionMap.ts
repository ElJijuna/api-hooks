import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { ContributionCalendar, ContributionMapParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserContributionMapOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the annual contribution calendar for a GitHub user.
 *
 * Uses the GitHub GraphQL API internally. A token is required — any valid token
 * works to query another user's public contributions.
 *
 * @param login - GitHub username
 * @param params - Optional date range (`from` and `to` as ISO 8601 strings)
 * @param options - Query options including the required `token`
 * @returns TanStack Query result with {@link ContributionCalendar}
 */
export function useGhUserContributionMap(
  login: string,
  params?: ContributionMapParams,
  options: UseGhUserContributionMapOptions = {},
): UseQueryResult<ContributionCalendar, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<ContributionCalendar, Error>({
    queryKey: ghQueryKeys.userContributionMap(login, params),
    queryFn: ({ signal }) => client.user(login).contributionMap(params, signal),
    enabled: enabled && login.length > 0,
  });
}
