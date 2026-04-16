export const ghQueryKeys = {
  user: (login: string) => ['gh', 'user', login] as const,
} as const;
