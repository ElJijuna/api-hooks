import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { CommitResource, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentsParams = Parameters<CommitResource['comments']>[0];

export interface UseGhCommitCommentsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhCommitComments`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA
 * @param params - Optional params without `page`
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubCommitComment>`
 */
export function useGhCommitCommentsInfinite(
  owner: string,
  repo: string,
  ref: string,
  params?: Omit<NonNullable<CommitCommentsParams>, 'page'>,
  options: UseGhCommitCommentsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubCommitComment>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.commitCommentsInfinite(owner, repo, ref, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).commit(ref).comments({ ...params, page: pageParam } as PaginationParams, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
