import { PkgGoClient, type PkgGoClientOptions } from 'pkggo-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const PkgGoClientContext = createContext<PkgGoClient | null>(null);

export interface PkgGoClientProviderProps {
  children: ReactNode;
  client?: PkgGoClient;
  options?: PkgGoClientOptions;
}

export const PkgGoClientProvider = ({
  children,
  client: providedClient,
  options,
}: PkgGoClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new PkgGoClient(options),
    [providedClient, options],
  );

  return <PkgGoClientContext value={client}>{children}</PkgGoClientContext>;
};

export function usePkgGoClient(): PkgGoClient {
  const client = useContext(PkgGoClientContext);
  return client ?? new PkgGoClient();
}
