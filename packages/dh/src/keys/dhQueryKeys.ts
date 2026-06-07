export const dhQueryKeys = {
  // Repository
  repository: (namespace: string, name: string) => ['dh', 'repository', namespace, name] as const,
  repositoryTags: (namespace: string, name: string, params?: object) =>
    ['dh', 'repository', namespace, name, 'tags', params] as const,
  repositoryTagsInfinite: (namespace: string, name: string, params?: object) =>
    ['dh', 'repository', namespace, name, 'tags', 'infinite', params] as const,

  // User
  user: (username: string) => ['dh', 'user', username] as const,
  userRepositories: (username: string, params?: object) =>
    ['dh', 'user', username, 'repositories', params] as const,
  userRepositoriesInfinite: (username: string, params?: object) =>
    ['dh', 'user', username, 'repositories', 'infinite', params] as const,

  // Org
  org: (orgname: string) => ['dh', 'org', orgname] as const,

  // Search
  search: (params: object) => ['dh', 'search', params] as const,
  searchInfinite: (params: object) => ['dh', 'search', 'infinite', params] as const,
} as const;
