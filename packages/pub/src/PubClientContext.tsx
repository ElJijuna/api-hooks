import { PubClient, type PubClientOptions } from 'pub-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const PubClientContext = createContext<PubClient | null>(null);

export interface PubClientProviderProps {
  children: ReactNode;
  client?: PubClient;
  options?: PubClientOptions;
}

export const PubClientProvider = ({
  children,
  client: providedClient,
  options,
}: PubClientProviderProps) => {
  const client = useMemo(() => providedClient ?? new PubClient(options), [providedClient, options]);

  return <PubClientContext value={client}>{children}</PubClientContext>;
};

export function usePubClient(): PubClient {
  const client = useContext(PubClientContext);
  return client ?? new PubClient();
}
