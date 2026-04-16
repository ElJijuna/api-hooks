export const bpQueryKeys = {
  packageSize: (name: string) => ['bp', 'package', name, 'size'] as const,
} as const;
