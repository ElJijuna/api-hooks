import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubWorkflowsResponse, type WorkflowsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoWorkflowsInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhRepoWorkflows`.
 *
 * Note: each page is a `GitHubWorkflowsResponse` envelope with `total_count` and `workflows`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params without `page`
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubWorkflowsResponse`
 */
export function useGhRepoWorkflowsInfinite(
  owner: string,
  repo: string,
  params?: Omit<WorkflowsParams, 'page'>,
  options: UseGhRepoWorkflowsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubWorkflowsResponse, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoWorkflowsInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).workflows({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, p) => acc + p.workflows.length, 0);
      return totalFetched < lastPage.total_count ? allPages.length + 1 : undefined;
    },
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
