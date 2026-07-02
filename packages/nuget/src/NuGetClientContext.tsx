import { NuGetClient, type NuGetClientOptions } from 'nuget-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const NuGetClientContext = createContext<NuGetClient | null>(null);

export interface NuGetClientProviderProps {
  children: ReactNode;
  client?: NuGetClient;
  options?: NuGetClientOptions;
}

export const NuGetClientProvider = ({
  children,
  client: providedClient,
  options,
}: NuGetClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new NuGetClient(options),
    [providedClient, options],
  );

  return <NuGetClientContext value={client}>{children}</NuGetClientContext>;
};

export function useNuGetClient(): NuGetClient {
  const client = useContext(NuGetClientContext);
  return client ?? new NuGetClient();
}
