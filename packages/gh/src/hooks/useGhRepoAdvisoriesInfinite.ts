import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GitHubRepositoryAdvisory, type RepoAdvisoriesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoAdvisoriesInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhRepoAdvisories`.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param params - Optional params (`RepoAdvisoriesParams` without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubRepositoryAdvisory>`
 */
export function useGhRepoAdvisoriesInfinite(
  owner: string,
  repo: string,
  params?: Omit<RepoAdvisoriesParams, 'page'>,
  options: UseGhRepoAdvisoriesInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubRepositoryAdvisory>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoAdvisoriesInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).repoAdvisories({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
