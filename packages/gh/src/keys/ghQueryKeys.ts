export const ghQueryKeys = {
  user: (login: string) => ['gh', 'user', login] as const,
  gist: (gistId: string) => ['gh', 'gist', gistId] as const,
} as const;
