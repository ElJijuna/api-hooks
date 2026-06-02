import { createContext, useContext, useMemo } from 'react';
import { NpmClient, type NpmClientOptions } from 'npmjs-api-client';

const NpmClientContext = createContext<NpmClient | null>(null);

export interface NpmClientProviderProps {
  children: React.ReactNode;
  client?: NpmClient;
  options?: NpmClientOptions;
}

export function NpmClientProvider({
  children,
  client: providedClient,
  options,
}: NpmClientProviderProps) {
  const client = useMemo(() => providedClient ?? new NpmClient(options), [providedClient, options]);

  return <NpmClientContext value={client}>{children}</NpmClientContext>;
}

export function useNpmClient(): NpmClient {
  const client = useContext(NpmClientContext);
  return client ?? new NpmClient();
}
