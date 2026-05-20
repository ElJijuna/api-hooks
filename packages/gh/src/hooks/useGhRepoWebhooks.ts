import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GitHubWebhook, type WebhooksParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoWebhooksOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches webhooks configured for a GitHub repository.
 *
 * Requires a token with `repo` admin scope.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param params - Optional pagination params
 * @param options - Query options including the required `token`
 * @returns TanStack Query result with a paged list of {@link GitHubWebhook}
 */
export function useGhRepoWebhooks(
  owner: string,
  repo: string,
  params?: WebhooksParams,
  options: UseGhRepoWebhooksOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubWebhook>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubWebhook>, Error>({
    queryKey: ghQueryKeys.repoWebhooks(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).webhooks(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
