export const bpQueryKeys = {
  packageSize: (name: string) => ['bp', 'package', name, 'size'] as const,
  packageVersionSize: (name: string, version: string) => ['bp', 'package', name, 'size', version] as const,
} as const;
