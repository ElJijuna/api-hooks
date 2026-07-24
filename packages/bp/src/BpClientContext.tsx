import { BundlephobiaClient, type BundlephobiaClientOptions } from 'bundlephobia-api-client';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

const BpClientContext = createContext<BundlephobiaClient | null>(null);

export interface BpClientProviderProps {
  children: ReactNode;
  client?: BundlephobiaClient;
  options?: BundlephobiaClientOptions;
}

export const BpClientProvider = ({
  children,
  client: providedClient,
  options,
}: BpClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new BundlephobiaClient(options),
    [providedClient, options],
  );

  return <BpClientContext value={client}>{children}</BpClientContext>;
};

export function useBpClient(): BundlephobiaClient {
  const client = useContext(BpClientContext);
  return client ?? new BundlephobiaClient();
}
