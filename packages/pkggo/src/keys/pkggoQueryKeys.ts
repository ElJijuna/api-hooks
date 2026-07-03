export const pkggoQueryKeys = {
  moduleLatest: (modulePath: string) => ['pkggo', 'module', modulePath, 'latest'] as const,
  moduleVersions: (modulePath: string) => ['pkggo', 'module', modulePath, 'versions'] as const,
  versionInfo: (modulePath: string, version: string) =>
    ['pkggo', 'module', modulePath, 'version', version, 'info'] as const,
  versionMod: (modulePath: string, version: string) =>
    ['pkggo', 'module', modulePath, 'version', version, 'mod'] as const,
  versionZip: (modulePath: string, version: string) =>
    ['pkggo', 'module', modulePath, 'version', version, 'zip'] as const,
} as const;
