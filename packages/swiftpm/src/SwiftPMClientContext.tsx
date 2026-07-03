import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { SwiftPMClient, type SwiftPMClientOptions } from 'swiftpm-api-client';

const SwiftPMClientContext = createContext<SwiftPMClient | null>(null);

export interface SwiftPMClientProviderProps {
  children: ReactNode;
  client?: SwiftPMClient;
  options?: SwiftPMClientOptions;
}

export const SwiftPMClientProvider = ({
  children,
  client: providedClient,
  options,
}: SwiftPMClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new SwiftPMClient(options),
    [providedClient, options],
  );

  return <SwiftPMClientContext value={client}>{children}</SwiftPMClientContext>;
};

export function useSwiftPMClient(): SwiftPMClient {
  const client = useContext(SwiftPMClientContext);
  return client ?? new SwiftPMClient();
}
