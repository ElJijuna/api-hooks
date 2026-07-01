import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubOrganization, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UserOrganizationsParams {
  per_page?: number;
  page?: number;
}

export interface UseGhUserOrganizationsOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubOrganization>>;
}

/**
 * Fetches public organizations for a GitHub user.
 *
 * @param login - GitHub username
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with a paged list of organizations
 */
export function useGhUserOrganizations(
  login: string,
  params?: UserOrganizationsParams,
  options: UseGhUserOrganizationsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubOrganization>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubOrganization>, Error>({
    queryKey: ghQueryKeys.userOrganizations(login, params),
    queryFn: ({ signal }) => client.user(login).organizations(params, signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
