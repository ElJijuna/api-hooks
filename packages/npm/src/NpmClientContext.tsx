import { NpmClient, type NpmClientOptions } from 'npmjs-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const NpmClientContext = createContext<NpmClient | null>(null);

export interface NpmClientProviderProps {
  children: ReactNode;
  client?: NpmClient;
  options?: NpmClientOptions;
}

export const NpmClientProvider = ({
  children,
  client: providedClient,
  options,
}: NpmClientProviderProps) => {
  const client = useMemo(() => providedClient ?? new NpmClient(options), [providedClient, options]);

  return <NpmClientContext value={client}>{children}</NpmClientContext>;
};

export function useNpmClient(): NpmClient {
  const client = useContext(NpmClientContext);
  return client ?? new NpmClient();
}
