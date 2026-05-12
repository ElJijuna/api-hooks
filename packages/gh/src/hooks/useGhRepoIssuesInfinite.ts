import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubIssue, type GitHubPagedResponse, type IssuesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoIssuesInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhRepoIssues`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhRepoIssuesInfinite(
  owner: string,
  repo: string,
  params?: Omit<IssuesParams, 'page'>,
  options: UseGhRepoIssuesInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssue>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoIssuesInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).issues({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
