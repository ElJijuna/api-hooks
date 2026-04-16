export const npmQueryKeys = {
  package: (name: string) => ['npm', 'package', name] as const,
  packageVersion: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version] as const,
  packageVersions: (name: string) =>
    ['npm', 'package', name, 'versions'] as const,
  packageDistTags: (name: string) =>
    ['npm', 'package', name, 'dist-tags'] as const,
  packageMaintainers: (name: string) =>
    ['npm', 'package', name, 'maintainers'] as const,
} as const;
