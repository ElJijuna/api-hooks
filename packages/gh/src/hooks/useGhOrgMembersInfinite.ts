import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubUser, type GitHubPagedResponse, type OrgMembersParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgMembersInfiniteOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhOrgMembers`.
 *
 * @param orgName - Organization login name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubUser>`
 */
export function useGhOrgMembersInfinite(
  orgName: string,
  params?: Omit<OrgMembersParams, 'page'>,
  options: UseGhOrgMembersInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubUser>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.orgMembersInfinite(orgName, params),
    queryFn: ({ pageParam, signal }) =>
      client.org(orgName).members({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && orgName.length > 0,
  });
}
