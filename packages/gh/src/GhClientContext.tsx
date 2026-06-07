import { GitHubClient, type GitHubClientOptions } from 'gh-api-client';
import { createContext, useContext, useMemo } from 'react';

const GhClientContext = createContext<GitHubClient | null>(null);

export interface GhClientProviderProps {
  children: React.ReactNode;
  client?: GitHubClient;
  options?: GitHubClientOptions;
}

export const GhClientProvider = ({
  children,
  client: providedClient,
  options,
}: GhClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new GitHubClient(options),
    [providedClient, options],
  );

  return <GhClientContext value={client}>{children}</GhClientContext>;
};

export function useGhClient(): GitHubClient {
  const client = useContext(GhClientContext);
  return client ?? new GitHubClient();
}
