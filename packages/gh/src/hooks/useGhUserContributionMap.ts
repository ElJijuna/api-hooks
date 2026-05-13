import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type ContributionCalendar, type ContributionMapParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserContributionMapOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required (GraphQL API always requires auth). */
  token?: string;
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
  options: UseGhUserContributionMapOptions = {}
): UseQueryResult<ContributionCalendar, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<ContributionCalendar, Error>({
    queryKey: ghQueryKeys.userContributionMap(login, params),
    queryFn: ({ signal }) => client.user(login).contributionMap(params, signal),
    enabled: enabled && login.length > 0,
  });
}
