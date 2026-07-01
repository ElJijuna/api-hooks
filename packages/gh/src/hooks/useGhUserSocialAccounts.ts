import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SocialAccount } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhUserSocialAccountsOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<SocialAccount[]>;
}

/**
 * Fetches the social accounts configured on a GitHub user's profile.
 *
 * @param login - GitHub username
 * @param options - Query options
 * @returns TanStack Query result with social accounts
 */
export function useGhUserSocialAccounts(
  login: string,
  options: UseGhUserSocialAccountsOptions = {},
): UseQueryResult<SocialAccount[], Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<SocialAccount[], Error>({
    queryKey: ghQueryKeys.userSocialAccounts(login),
    queryFn: ({ signal }) => client.user(login).socialAccounts(signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
