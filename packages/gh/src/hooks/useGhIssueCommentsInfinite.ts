import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubIssueComment, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssueCommentsInfiniteOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhIssueComments`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssueComment>`
 */
export function useGhIssueCommentsInfinite(
  owner: string,
  repo: string,
  issueNumber: number,
  params?: Omit<PaginationParams & { since?: string }, 'page'>,
  options: UseGhIssueCommentsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssueComment>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.issueCommentsInfinite(owner, repo, issueNumber, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).issue(issueNumber).comments({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && owner.length > 0 && repo.length > 0 && issueNumber > 0,
  });
}
