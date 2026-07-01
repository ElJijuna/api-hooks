import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useDhClient } from '../DhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface DockerHubLoginVariables {
  username: string;
  password: string;
}

export interface UseDockerHubLoginOptions {
  mutationOptions?: MutationOverrides<string, DockerHubLoginVariables>;
}

/**
 * Authenticates against Docker Hub and returns a JWT token.
 *
 * Pass the returned token to `DhClientProvider` via `options={{ token }}` to make
 * authenticated requests.
 *
 * Uses `useMutation` — call `mutate({ username, password })` to trigger login.
 *
 * @returns TanStack Mutation result with the JWT token string
 */
export function useDockerHubLogin(
  options: UseDockerHubLoginOptions = {},
): UseMutationResult<string, Error, DockerHubLoginVariables> {
  const { mutationOptions } = options;
  const client = useDhClient();

  return useMutation<string, Error, DockerHubLoginVariables>({
    mutationFn: ({ username, password }) => client.login(username, password),
    ...mutationOptions,
  });
}
