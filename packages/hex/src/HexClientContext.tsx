import { HexClient, type HexClientOptions } from 'hex-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const HexClientContext = createContext<HexClient | null>(null);

export interface HexClientProviderProps {
  children: ReactNode;
  client?: HexClient;
  options?: HexClientOptions;
}

export const HexClientProvider = ({
  children,
  client: providedClient,
  options,
}: HexClientProviderProps) => {
  const client = useMemo(() => providedClient ?? new HexClient(options), [providedClient, options]);

  return <HexClientContext value={client}>{children}</HexClientContext>;
};

export function useHexClient(): HexClient {
  const client = useContext(HexClientContext);
  return client ?? new HexClient();
}
