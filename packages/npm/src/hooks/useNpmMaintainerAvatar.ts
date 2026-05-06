
import { useNpmClient } from '../NpmClientContext.js';

/**
 * Returns the public avatar URL for an npm user.
 *
 * No API call is made — the URL is derived synchronously from the username.
 *
 * @param username - npm username (e.g. `'sindresorhus'`)
 * @returns Avatar image URL served by npmjs.com
 */
export function useNpmMaintainerAvatar(username: string): string {
  const client = useNpmClient();
  return client.maintainer(username).avatar();
}
