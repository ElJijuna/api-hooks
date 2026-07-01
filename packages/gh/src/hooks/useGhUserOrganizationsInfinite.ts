import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubOrganization, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { UserOrganizationsParams } from './useGhUserOrganizations.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhUserOrganizationsInfiniteOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubOrganization>>;
}

/**
 * Infinite-scroll variant of `useGhUserOrganizations`.
 *
 * @param login - GitHub username
 * @param params - Optional pagination params without `page`
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of organizations
 */
export function useGhUserOrganizationsInfinite(
  login: string,
  params?: Omit<UserOrganizationsParams, 'page'>,
  options: UseGhUserOrganizationsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubOrganization>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.userOrganizationsInfinite(login, params),
    queryFn: ({ pageParam, signal }) =>
      client.user(login).organizations({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
