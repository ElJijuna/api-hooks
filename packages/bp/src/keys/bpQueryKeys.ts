export const bpQueryKeys = {
  packageSize: (name: string) => ['bp', 'package', name, 'size'] as const,
  packageVersionSize: (name: string, version: string) => ['bp', 'package', name, 'size', version] as const,
  packageHistory: (name: string) => ['bp', 'package', name, 'history'] as const,
} as const;
