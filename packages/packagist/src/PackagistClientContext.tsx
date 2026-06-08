import { PackagistClient, type PackagistClientOptions } from 'php-packagist-api-client';
import { createContext, useContext, useMemo } from 'react';

const PackagistClientContext = createContext<PackagistClient | null>(null);

export interface PackagistClientProviderProps {
  children: React.ReactNode;
  client?: PackagistClient;
  options?: PackagistClientOptions;
}

export const PackagistClientProvider = ({
  children,
  client: providedClient,
  options,
}: PackagistClientProviderProps) => {
  const client = useMemo(
    () => providedClient ?? new PackagistClient(options),
    [providedClient, options],
  );

  return <PackagistClientContext value={client}>{children}</PackagistClientContext>;
};

export function usePackagistClient(): PackagistClient {
  const client = useContext(PackagistClientContext);
  return client ?? new PackagistClient();
}
