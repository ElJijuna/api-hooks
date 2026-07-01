import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubWorkflowRun } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoWorkflowRunOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubWorkflowRun>;
}

/**
 * Fetches a single GitHub Actions workflow run by ID.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param runId - Workflow run ID
 * @param options - Query options
 * @returns TanStack Query result with `GitHubWorkflowRun`
 */
export function useGhRepoWorkflowRun(
  owner: string,
  repo: string,
  runId: number,
  options: UseGhRepoWorkflowRunOptions = {},
): UseQueryResult<GitHubWorkflowRun, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubWorkflowRun, Error>({
    queryKey: ghQueryKeys.repoWorkflowRun(owner, repo, runId),
    queryFn: ({ signal }) => client.repo(owner, repo).workflowRun(runId, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
