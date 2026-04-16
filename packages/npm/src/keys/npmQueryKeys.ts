export const npmQueryKeys = {
  package: (name: string) => ['npm', 'package', name] as const,
  packageVersion: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version] as const,
} as const;
