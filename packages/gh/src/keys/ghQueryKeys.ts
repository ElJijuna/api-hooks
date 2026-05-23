export const ghQueryKeys = {
  // User
  user: (login: string) => ['gh', 'user', login] as const,
  userRepos: (login: string, params?: object) => ['gh', 'user', login, 'repos', params] as const,
  userReposInfinite: (login: string, params?: object) => ['gh', 'user', login, 'repos', 'infinite', params] as const,

  // Repo
  repo: (owner: string, repo: string) => ['gh', 'repo', owner, repo] as const,
  repoCommits: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'commits', params] as const,
  repoCommitsInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'commits', 'infinite', params] as const,
  repoBranches: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'branches', params] as const,
  repoBranchesInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'branches', 'infinite', params] as const,
  repoBranch: (owner: string, repo: string, branch: string) => ['gh', 'repo', owner, repo, 'branches', branch] as const,
  repoTags: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'tags', params] as const,
  repoTagsInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'tags', 'infinite', params] as const,
  repoReleases: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'releases', params] as const,
  repoReleasesInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'releases', 'infinite', params] as const,
  repoForks: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'forks', params] as const,
  repoForksInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'forks', 'infinite', params] as const,
  repoContents: (owner: string, repo: string, path?: string, params?: object) => ['gh', 'repo', owner, repo, 'contents', path, params] as const,
  repoTopics: (owner: string, repo: string) => ['gh', 'repo', owner, repo, 'topics'] as const,
  repoContributors: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'contributors', params] as const,
  repoContributorsInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'contributors', 'infinite', params] as const,
  repoIssues: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'issues', params] as const,
  repoIssuesInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'issues', 'infinite', params] as const,
  repoPullRequests: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'pulls', params] as const,
  repoPullRequestsInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'pulls', 'infinite', params] as const,

  // Issue
  issue: (owner: string, repo: string, issueNumber: number) => ['gh', 'repo', owner, repo, 'issue', issueNumber] as const,
  issueComments: (owner: string, repo: string, issueNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'issue', issueNumber, 'comments', params] as const,
  issueCommentsInfinite: (owner: string, repo: string, issueNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'issue', issueNumber, 'comments', 'infinite', params] as const,

  // Pull Request
  pullRequest: (owner: string, repo: string, pullNumber: number) => ['gh', 'repo', owner, repo, 'pull', pullNumber] as const,
  pullRequestCommits: (owner: string, repo: string, pullNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'pull', pullNumber, 'commits', params] as const,
  pullRequestFiles: (owner: string, repo: string, pullNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'pull', pullNumber, 'files', params] as const,
  pullRequestReviews: (owner: string, repo: string, pullNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'pull', pullNumber, 'reviews', params] as const,
  pullRequestReviewComments: (owner: string, repo: string, pullNumber: number, params?: object) => ['gh', 'repo', owner, repo, 'pull', pullNumber, 'review-comments', params] as const,

  // Commit
  commit: (owner: string, repo: string, ref: string) => ['gh', 'repo', owner, repo, 'commit', ref] as const,
  commitStatuses: (owner: string, repo: string, ref: string, params?: object) => ['gh', 'repo', owner, repo, 'commit', ref, 'statuses', params] as const,
  commitCombinedStatus: (owner: string, repo: string, ref: string) => ['gh', 'repo', owner, repo, 'commit', ref, 'status'] as const,
  commitCheckRuns: (owner: string, repo: string, ref: string, params?: object) => ['gh', 'repo', owner, repo, 'commit', ref, 'check-runs', params] as const,

  // Org
  org: (orgName: string) => ['gh', 'org', orgName] as const,
  orgRepos: (orgName: string, params?: object) => ['gh', 'org', orgName, 'repos', params] as const,
  orgReposInfinite: (orgName: string, params?: object) => ['gh', 'org', orgName, 'repos', 'infinite', params] as const,
  orgMembers: (orgName: string, params?: object) => ['gh', 'org', orgName, 'members', params] as const,
  orgMembersInfinite: (orgName: string, params?: object) => ['gh', 'org', orgName, 'members', 'infinite', params] as const,

  // Search
  searchRepos: (params: object) => ['gh', 'search', 'repos', params] as const,
  searchReposInfinite: (params: object) => ['gh', 'search', 'repos', 'infinite', params] as const,

  // Advisory
  advisories: (params?: object) => ['gh', 'advisories', params] as const,
  advisoriesInfinite: (params?: object) => ['gh', 'advisories', 'infinite', params] as const,
  advisory: (ghsaId: string) => ['gh', 'advisory', ghsaId] as const,
  advisoryByCve: (cveId: string) => ['gh', 'advisory', 'cve', cveId] as const,

  // Gist
  gist: (gistId: string) => ['gh', 'gist', gistId] as const,
  gists: (params?: object) => ['gh', 'gists', params] as const,
  gistsInfinite: (params?: object) => ['gh', 'gists', 'infinite', params] as const,
  gistCommits: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'commits', params] as const,
  gistCommitsInfinite: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'commits', 'infinite', params] as const,
  gistForks: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'forks', params] as const,
  gistForksInfinite: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'forks', 'infinite', params] as const,
  gistComments: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'comments', params] as const,
  gistCommentsInfinite: (gistId: string, params?: object) => ['gh', 'gist', gistId, 'comments', 'infinite', params] as const,
  gistIsStarred: (gistId: string) => ['gh', 'gist', gistId, 'starred'] as const,

  // Current user
  currentUser: () => ['gh', 'current-user'] as const,

  // User extended
  userFollowers: (login: string, params?: object) => ['gh', 'user', login, 'followers', params] as const,
  userFollowersInfinite: (login: string, params?: object) => ['gh', 'user', login, 'followers', 'infinite', params] as const,
  userFollowing: (login: string, params?: object) => ['gh', 'user', login, 'following', params] as const,
  userFollowingInfinite: (login: string, params?: object) => ['gh', 'user', login, 'following', 'infinite', params] as const,
  userPublicEvents: (login: string, params?: object) => ['gh', 'user', login, 'events', params] as const,
  userContributionMap: (login: string, params?: object) => ['gh', 'user', login, 'contributions', params] as const,

  // Repo extended
  repoLatestRelease: (owner: string, repo: string) => ['gh', 'repo', owner, repo, 'releases', 'latest'] as const,
  repoWebhooks: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'webhooks', params] as const,
  repoWebhooksInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'webhooks', 'infinite', params] as const,
  repoRaw: (owner: string, repo: string, filePath: string, params?: object) => ['gh', 'repo', owner, repo, 'raw', filePath, params] as const,
  repoMultipleRaw: (owner: string, repo: string, filePaths: string[], params?: object) => ['gh', 'repo', owner, repo, 'raw', filePaths, params] as const,
  repoAdvisories: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'advisories', params] as const,
  repoAdvisoriesInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'advisories', 'infinite', params] as const,
  repoAdvisory: (owner: string, repo: string, ghsaId: string) => ['gh', 'repo', owner, repo, 'advisory', ghsaId] as const,

  // Pull Request extended
  pullRequestIsMerged: (owner: string, repo: string, pullNumber: number) => ['gh', 'repo', owner, repo, 'pull', pullNumber, 'merged'] as const,

  // Commit extended
  commitComments: (owner: string, repo: string, ref: string, params?: object) => ['gh', 'repo', owner, repo, 'commit', ref, 'comments', params] as const,
  commitCommentsInfinite: (owner: string, repo: string, ref: string, params?: object) => ['gh', 'repo', owner, repo, 'commit', ref, 'comments', 'infinite', params] as const,

  // Notifications
  notifications: (params?: object) => ['gh', 'notifications', params] as const,
  notificationsInfinite: (params?: object) => ['gh', 'notifications', 'infinite', params] as const,

  // Cross-repo issues
  issues: (params?: object) => ['gh', 'issues', params] as const,
  issuesInfinite: (params?: object) => ['gh', 'issues', 'infinite', params] as const,

  // Search issues
  searchIssues: (params: object) => ['gh', 'search', 'issues', params] as const,
  searchIssuesInfinite: (params: object) => ['gh', 'search', 'issues', 'infinite', params] as const,

  // Workflow runs
  repoWorkflowRuns: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'workflow-runs', params] as const,
  repoWorkflowRunsInfinite: (owner: string, repo: string, params?: object) => ['gh', 'repo', owner, repo, 'workflow-runs', 'infinite', params] as const,
} as const;
