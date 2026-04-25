import { createContext, useContext, useMemo } from 'react';
import { NpmClient } from 'npmjs-api-client';

const NpmClientContext = createContext<NpmClient | null>(null);

export function NpmClientProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => new NpmClient(), []);
  return <NpmClientContext value={client}>{children}</NpmClientContext>;
}

export function useNpmClient(): NpmClient {
  const client = useContext(NpmClientContext);
  return client ?? new NpmClient();
}
