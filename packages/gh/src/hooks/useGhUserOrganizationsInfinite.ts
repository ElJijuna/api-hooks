import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubOrganization, type GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import { type UserOrganizationsParams } from './useGhUserOrganizations.js';

export interface UseGhUserOrganizationsInfiniteOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
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
  options: UseGhUserOrganizationsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubOrganization>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.userOrganizationsInfinite(login, params),
    queryFn: ({ pageParam, signal }) =>
      client.user(login).organizations({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && login.length > 0,
  });
}
