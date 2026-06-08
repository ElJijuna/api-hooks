import { DockerHubClient, type DockerHubClientOptions } from 'dockerhub-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const DhClientContext = createContext<DockerHubClient | null>(null);

export interface DhClientProviderProps {
  children: ReactNode;
  client?: DockerHubClient;
  options?: DockerHubClientOptions;
}

export const DhClientProvider = ({
  children,
  client: providedClient,
  options,
}: DhClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new DockerHubClient(options),
    [providedClient, options],
  );

  return <DhClientContext value={client}>{children}</DhClientContext>;
};

export function useDhClient(): DockerHubClient {
  const client = useContext(DhClientContext);
  return client ?? new DockerHubClient();
}
