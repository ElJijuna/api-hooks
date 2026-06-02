import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmMaintainerAvatarOptions {
  enabled?: boolean;
}

/**
 * Returns the public avatar URL for an npm user.
 *
 * @param username - npm username (e.g. `'sindresorhus'`)
 * @returns TanStack Query result with the user's Gravatar URL when a public email is available
 */
export function useNpmMaintainerAvatar(
  username: string,
  options: UseNpmMaintainerAvatarOptions = {},
): UseQueryResult<string | undefined, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<string | undefined, Error>({
    queryKey: npmQueryKeys.maintainerAvatar(username),
    queryFn: ({ signal }) => client.maintainer(username).avatar(signal),
    enabled: enabled && username.length > 0,
  });
}
