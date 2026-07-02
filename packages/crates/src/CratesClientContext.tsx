import { CratesClient, type CratesClientOptions } from 'crates-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const CratesClientContext = createContext<CratesClient | null>(null);

export interface CratesClientProviderProps {
  children: ReactNode;
  client?: CratesClient;
  options?: CratesClientOptions;
}

export const CratesClientProvider = ({
  children,
  client: providedClient,
  options,
}: CratesClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new CratesClient(options),
    [providedClient, options],
  );

  return <CratesClientContext value={client}>{children}</CratesClientContext>;
};

export function useCratesClient(): CratesClient {
  const client = useContext(CratesClientContext);
  return client ?? new CratesClient();
}
