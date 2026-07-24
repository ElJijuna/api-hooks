import { PyPIClient, type PyPIClientOptions } from 'pypi-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const PyPIClientContext = createContext<PyPIClient | null>(null);

export interface PyPIClientProviderProps {
  children: ReactNode;
  client?: PyPIClient;
  options?: PyPIClientOptions;
}

export const PyPIClientProvider = ({
  children,
  client: providedClient,
  options,
}: PyPIClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new PyPIClient(options),
    [providedClient, options],
  );

  return <PyPIClientContext value={client}>{children}</PyPIClientContext>;
};

export function usePyPIClient(): PyPIClient {
  const client = useContext(PyPIClientContext);
  return client ?? new PyPIClient();
}
