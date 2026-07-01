import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubWorkflowRunsResponse, WorkflowRunsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhRepoWorkflowRunsInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubWorkflowRunsResponse>;
}

/**
 * Infinite-scroll variant of `useGhRepoWorkflowRuns`.
 *
 * Note: each page is a `GitHubWorkflowRunsResponse` envelope with `total_count` and `workflow_runs`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubWorkflowRunsResponse`
 */
export function useGhRepoWorkflowRunsInfinite(
  owner: string,
  repo: string,
  params?: Omit<WorkflowRunsParams, 'page'>,
  options: UseGhRepoWorkflowRunsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubWorkflowRunsResponse, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoWorkflowRunsInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).workflowRuns({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, p) => acc + p.workflow_runs.length, 0);
      return totalFetched < lastPage.total_count ? allPages.length + 1 : undefined;
    },
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
