export const npmQueryKeys = {
  package: (name: string) => ['npm', 'package', name] as const,
} as const;
