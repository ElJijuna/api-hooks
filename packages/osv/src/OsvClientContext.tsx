import { OsvClient, type OsvClientOptions } from 'osv-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const OsvClientContext = createContext<OsvClient | null>(null);

export interface OsvClientProviderProps {
  children: ReactNode;
  client?: OsvClient;
  options?: OsvClientOptions;
}

export const OsvClientProvider = ({
  children,
  client: providedClient,
  options,
}: OsvClientProviderProps) => {
  const client = useMemo(() => providedClient ?? new OsvClient(options), [providedClient, options]);

  return <OsvClientContext value={client}>{children}</OsvClientContext>;
};

export function useOsvClient(): OsvClient {
  const client = useContext(OsvClientContext);
  return client ?? new OsvClient();
}
