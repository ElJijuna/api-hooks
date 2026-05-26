import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type PinnedItem } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserPinnedItemsOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a user's pinned repositories and gists (GraphQL).
 *
 * Each item in the array is either a `PinnedRepository` or a `PinnedGist`.
 *
 * @param login - GitHub username
 * @param options - Query options
 * @returns TanStack Query result with `PinnedItem[]`
 */
export function useGhUserPinnedItems(
  login: string,
  options: UseGhUserPinnedItemsOptions = {}
): UseQueryResult<PinnedItem[], Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<PinnedItem[], Error>({
    queryKey: ghQueryKeys.userPinnedItems(login),
    queryFn: ({ signal }) => client.user(login).pinnedItems(signal),
    enabled: enabled && login.length > 0,
  });
}
