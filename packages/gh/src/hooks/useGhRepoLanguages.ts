import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

/** Maps language names to byte counts, as returned by the GitHub API. */
export type RepoLanguages = Record<string, number>;

export interface UseGhRepoLanguagesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the programming languages used in a GitHub repository.
 *
 * Returns an object mapping language names to byte counts.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param options - Query options
 * @returns TanStack Query result with `RepoLanguages` (e.g. `{ TypeScript: 12345, CSS: 678 }`)
 */
export function useGhRepoLanguages(
  owner: string,
  repo: string,
  options: UseGhRepoLanguagesOptions = {}
): UseQueryResult<RepoLanguages, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<RepoLanguages, Error>({
    queryKey: ghQueryKeys.repoLanguages(owner, repo),
    queryFn: ({ signal }) => client.repo(owner, repo).languages(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
