import type { QueryOverrides } from '../types.js';

export interface UseMavenQueryOptions {
  /** Disable the query. Also disabled when required params are empty. */
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions?: QueryOverrides<any>;
}
