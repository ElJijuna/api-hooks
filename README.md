# api-hooks

A collection of React hooks for popular APIs, built on [`@tanstack/react-query`](https://tanstack.com/query).

[![CI](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Packages

### [`@api-hooks/npm`](packages/npm#readme)

React hooks for the [npm registry API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md).

[![npm](https://img.shields.io/npm/v/@api-hooks/npm)](https://www.npmjs.com/package/@api-hooks/npm)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/npm)](https://www.npmjs.com/package/@api-hooks/npm)

| Hook | Returns |
| ---- | ------- |
| `useNpmPackage(name)` | `NpmPackument` |
| `useNpmPackageVersion(name, version)` | `NpmPackageVersion` |
| `useNpmPackageLatest(name)` | `NpmPackageVersion` |
| `useNpmPackageVersions(name)` | `NpmPackageVersion[]` |
| `useNpmPackageDistTags(name)` | `NpmDistTags` |
| `useNpmPackageMaintainers(name)` | `NpmPerson[]` |
| `useNpmPackageDownloads(name, options?)` | `NpmDownloadPoint` |
| `useNpmPackageDownloadRange(name, options?)` | `NpmDownloadRange` |
| `useNpmMaintainer(username)` | `NpmUser` |
| `useNpmMaintainerPackages(username, options?)` | `NpmSearchResult` |
| `useNpmSearch(text, options?)` | `NpmSearchResult` |

---

### [`@api-hooks/gh`](packages/gh#readme)

React hooks for the [GitHub REST API](https://docs.github.com/en/rest).

[![npm](https://img.shields.io/npm/v/@api-hooks/gh)](https://www.npmjs.com/package/@api-hooks/gh)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/gh)](https://www.npmjs.com/package/@api-hooks/gh)

| Hook | Returns |
| ---- | ------- |
| `useGhUser(login)` | `GitHubUser` |
| `useGhUserRepos(login, params?)` | `GitHubPagedResponse<GitHubRepository>` |
| `useGhRepo(owner, name)` | `GitHubRepository` |
| `useGhRepoCommits(owner, name, params?)` | `GitHubPagedResponse<GitHubCommit>` |
| `useGhRepoBranches(owner, name, params?)` | `GitHubPagedResponse<GitHubBranch>` |
| `useGhRepoBranch(owner, name, branch)` | `GitHubBranch` |
| `useGhRepoTags(owner, name, params?)` | `GitHubPagedResponse<GitHubTag>` |
| `useGhRepoReleases(owner, name, params?)` | `GitHubPagedResponse<GitHubRelease>` |
| `useGhRepoForks(owner, name, params?)` | `GitHubPagedResponse<GitHubRepository>` |
| `useGhRepoContents(owner, name, path?, params?)` | `GitHubContent \| GitHubContent[]` |
| `useGhRepoTopics(owner, name)` | `string[]` |
| `useGhRepoContributors(owner, name, params?)` | `GitHubPagedResponse<GitHubUser>` |
| `useGhRepoIssues(owner, name, params?)` | `GitHubPagedResponse<GitHubIssue>` |
| `useGhRepoPullRequests(owner, name, params?)` | `GitHubPagedResponse<GitHubPullRequest>` |
| `useGhIssue(owner, name, number)` | `GitHubIssue` |
| `useGhIssueComments(owner, name, number, params?)` | `GitHubPagedResponse<GitHubIssueComment>` |
| `useGhPullRequest(owner, name, number)` | `GitHubPullRequest` |
| `useGhPullRequestCommits(owner, name, number, params?)` | `GitHubPagedResponse<GitHubCommit>` |
| `useGhPullRequestFiles(owner, name, number, params?)` | `GitHubPagedResponse<GitHubPullRequestFile>` |
| `useGhPullRequestReviews(owner, name, number, params?)` | `GitHubPagedResponse<GitHubReview>` |
| `useGhPullRequestReviewComments(owner, name, number, params?)` | `GitHubPagedResponse<GitHubReviewComment>` |
| `useGhCommit(owner, name, ref)` | `GitHubCommit` |
| `useGhCommitStatuses(owner, name, ref, params?)` | `GitHubPagedResponse<GitHubCommitStatus>` |
| `useGhCommitCombinedStatus(owner, name, ref)` | `GitHubCombinedStatus` |
| `useGhCommitCheckRuns(owner, name, ref, params?)` | `GitHubPagedResponse<GitHubCheckRun>` |
| `useGhOrg(name)` | `GitHubOrganization` |
| `useGhOrgRepos(name, params?)` | `GitHubPagedResponse<GitHubRepository>` |
| `useGhOrgMembers(name, params?)` | `GitHubPagedResponse<GitHubUser>` |
| `useGhSearchRepos(q, params?)` | `GitHubPagedResponse<GitHubRepository>` |

---

### [`@api-hooks/bp`](packages/bp#readme)

React hooks for the [Bundlephobia API](https://bundlephobia.com).

[![npm](https://img.shields.io/npm/v/@api-hooks/bp)](https://www.npmjs.com/package/@api-hooks/bp)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/bp)](https://www.npmjs.com/package/@api-hooks/bp)

| Hook | Returns |
| ---- | ------- |
| `useBpPackageSize(name, options?)` | `BundleSize` |
| `useBpPackageVersionSize(name, version, options?)` | `BundleSize` |
| `useBpPackageHistory(name, options?)` | `PackageHistory` |
| `useBpPackageSimilar(name, options?)` | `SimilarPackages` |

---

## Requirements

All packages require the following peer dependencies:

| Peer dependency | Version |
| --------------- | ------- |
| `react` | `>=19.0.0` |
| `@tanstack/react-query` | `^5.0.0` |

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
