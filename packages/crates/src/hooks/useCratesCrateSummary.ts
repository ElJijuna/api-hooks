import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CrateResult } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { UseCratesQueryOptions } from './options.js';

/**
 * Fetches crate metadata plus its included versions, keywords, and categories.
 *
 * @param name - Crate name (e.g. `'serde'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link CrateResult}
 */
export function useCratesCrateSummary(
  name: string,
  options: UseCratesQueryOptions = {},
): UseQueryResult<CrateResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useCratesClient();

  return useQuery<CrateResult, Error>({
    queryKey: cratesQueryKeys.crateSummary(name),
    queryFn: ({ signal }) => client.crate(name).summary(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
