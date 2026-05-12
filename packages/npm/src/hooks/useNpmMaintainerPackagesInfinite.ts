
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type NpmSearchResult, type MaintainerPackagesParams } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmMaintainerPackagesInfiniteOptions extends Omit<MaintainerPackagesParams, 'from'> {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useNpmMaintainerPackages`.
 *
 * Each page is fetched by advancing the `from` offset. Call `fetchNextPage()` to
 * load the next batch. Results accumulate in `data.pages`.
 *
 * @param username - npm username (e.g. `'sindresorhus'`)
 * @param options - Same as `useNpmMaintainerPackages` options but without `from` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link NpmSearchResult}
 */
export function useNpmMaintainerPackagesInfinite(
  username: string,
  options: UseNpmMaintainerPackagesInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<NpmSearchResult, number>, Error> {
  const { enabled = true, ...rest } = options;
  const size = rest.size ?? 20;
  const client = useNpmClient();

  const baseParams = Object.keys(rest).length > 0 ? rest : undefined;

  return useInfiniteQuery({
    queryKey: npmQueryKeys.maintainerPackagesInfinite(username, baseParams),
    queryFn: ({ pageParam, signal }) =>
      client.maintainer(username).packages({ ...rest, from: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextFrom = lastPageParam + size;
      return nextFrom < lastPage.total ? nextFrom : undefined;
    },
    enabled: enabled && username.length > 0,
  });
}
