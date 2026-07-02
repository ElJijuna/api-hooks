import { MavenClient, type MavenClientOptions } from 'maven-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const MavenClientContext = createContext<MavenClient | null>(null);

export interface MavenClientProviderProps {
  children: ReactNode;
  client?: MavenClient;
  options?: MavenClientOptions;
}

export const MavenClientProvider = ({
  children,
  client: providedClient,
  options,
}: MavenClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new MavenClient(options),
    [providedClient, options],
  );

  return <MavenClientContext value={client}>{children}</MavenClientContext>;
};

export function useMavenClient(): MavenClient {
  const client = useContext(MavenClientContext);
  return client ?? new MavenClient();
}
