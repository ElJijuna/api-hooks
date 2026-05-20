import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { CommitResource, type GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentsParams = Parameters<CommitResource['comments']>[0];

export interface UseGhCommitCommentsOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
}

/**
 * Fetches comments for a specific commit.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA
 * @param params - Optional pagination/filter params
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubPagedResponse}<{@link GitHubCommitComment}>
 */
export function useGhCommitComments(
  owner: string,
  repo: string,
  ref: string,
  params?: CommitCommentsParams,
  options: UseGhCommitCommentsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubCommitComment>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubCommitComment>, Error>({
    queryKey: ghQueryKeys.commitComments(owner, repo, ref, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).comments(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
