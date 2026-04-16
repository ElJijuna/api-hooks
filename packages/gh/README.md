# @api-hooks/gh

React hooks for the [GitHub REST API](https://docs.github.com/en/rest), built on [`gh-api-client`](https://www.npmjs.com/package/gh-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/gh)](https://www.npmjs.com/package/@api-hooks/gh)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/gh)](https://www.npmjs.com/package/@api-hooks/gh)
[![CI](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Requirements

| Peer dependency | Version |
| --------------- | ------- |
| `react` | `>=19.0.0` |
| `@tanstack/react-query` | `^5.0.0` |

## Installation

```bash
npm install @api-hooks/gh gh-api-client @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## Hooks

All hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

### User hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhUser(login)`](#useghuserloin) | Public profile for a GitHub user | `GitHubUser` |
| [`useGhUserRepos(login, params?)`](#useghuserreposlogin-params) | Public repositories of a user | `GitHubPagedResponse<GitHubRepository>` |

### Repository hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhRepo(owner, name)`](#useghreoowner-name) | Repository metadata | `GitHubRepository` |
| [`useGhRepoCommits(owner, name, params?)`](#useghrepocommitsowner-name-params) | Commit list | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhRepoBranches(owner, name, params?)`](#useghrepobrancho-owner-name-params) | Branch list | `GitHubPagedResponse<GitHubBranch>` |
| [`useGhRepoBranch(owner, name, branch)`](#useghrepobranchowner-name-branch) | Single branch | `GitHubBranch` |
| [`useGhRepoTags(owner, name, params?)`](#useghrepotagsowner-name-params) | Tag list | `GitHubPagedResponse<GitHubTag>` |
| [`useGhRepoReleases(owner, name, params?)`](#useghreporeleasesowner-name-params) | Release list | `GitHubPagedResponse<GitHubRelease>` |
| [`useGhRepoForks(owner, name, params?)`](#useghrepoforksowner-name-params) | Fork list | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhRepoContents(owner, name, path?, params?)`](#useghrepocontentsowner-name-path-params) | File or directory contents | `GitHubContent \| GitHubContent[]` |
| [`useGhRepoTopics(owner, name)`](#useghrepotopicsowner-name) | Repository topic tags | `string[]` |
| [`useGhRepoContributors(owner, name, params?)`](#useghrepocontributorsowner-name-params) | Contributor list | `GitHubPagedResponse<GitHubUser>` |
| [`useGhRepoIssues(owner, name, params?)`](#useghrepoissuesowner-name-params) | Issue list | `GitHubPagedResponse<GitHubIssue>` |
| [`useGhRepoPullRequests(owner, name, params?)`](#useghrepopullrequestsowner-name-params) | Pull request list | `GitHubPagedResponse<GitHubPullRequest>` |

### Issue hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhIssue(owner, name, number)`](#useghissueowner-name-number) | Single issue | `GitHubIssue` |
| [`useGhIssueComments(owner, name, number, params?)`](#useghissuecommentsowner-name-number-params) | Comments on an issue | `GitHubPagedResponse<GitHubIssueComment>` |

### Pull Request hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhPullRequest(owner, name, number)`](#useghpullrequestowner-name-number) | Single pull request | `GitHubPullRequest` |
| [`useGhPullRequestCommits(owner, name, number, params?)`](#useghpullrequestcommitsowner-name-number-params) | Commits in a PR | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhPullRequestFiles(owner, name, number, params?)`](#useghpullrequestfilesowner-name-number-params) | Files changed in a PR | `GitHubPagedResponse<GitHubPullRequestFile>` |
| [`useGhPullRequestReviews(owner, name, number, params?)`](#useghpullrequestreviews-owner-name-number-params) | Reviews on a PR | `GitHubPagedResponse<GitHubReview>` |
| [`useGhPullRequestReviewComments(owner, name, number, params?)`](#useghpullrequestreviewcommentsowner-name-number-params) | Review comments on a PR | `GitHubPagedResponse<GitHubReviewComment>` |

### Commit hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhCommit(owner, name, ref)`](#useghcommitowner-name-ref) | Single commit | `GitHubCommit` |
| [`useGhCommitStatuses(owner, name, ref, params?)`](#useghcommitstatusesowner-name-ref-params) | Status checks for a commit | `GitHubPagedResponse<GitHubCommitStatus>` |
| [`useGhCommitCombinedStatus(owner, name, ref)`](#useghcommitcombinedstatusowner-name-ref) | Combined status for a commit | `GitHubCombinedStatus` |
| [`useGhCommitCheckRuns(owner, name, ref, params?)`](#useghcommitcheckrunsowner-name-ref-params) | Check runs for a commit | `GitHubPagedResponse<GitHubCheckRun>` |

### Organization hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhOrg(name)`](#useghorgname) | Organization profile | `GitHubOrganization` |
| [`useGhOrgRepos(name, params?)`](#useghorgreposname-params) | Repositories in an organization | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhOrgMembers(name, params?)`](#useghorgmembersname-params) | Members of an organization | `GitHubPagedResponse<GitHubUser>` |

### Search hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhSearchRepos(q, params?)`](#useghsearchreposq-params) | Search repositories | `GitHubPagedResponse<GitHubRepository>` |

---

## API Reference

### `useGhUser(login)`

Fetches the public profile of a GitHub user.

```tsx
import { useGhUser } from '@api-hooks/gh';

function UserCard({ login }: { login: string }) {
  const { data, isLoading, isError } = useGhUser(login);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>User not found.</p>;

  return (
    <div>
      <img src={data.avatar_url} alt={data.login} width={64} />
      <h2>{data.name ?? data.login}</h2>
      <a href={data.html_url}>@{data.login}</a>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |

---

### `useGhUserRepos(login, params?)`

> Coming soon — tracked in [#18](https://github.com/ElJijuna/api-hooks/issues/18)

---

### `useGhRepo(owner, name)`

> Coming soon — tracked in [#20](https://github.com/ElJijuna/api-hooks/issues/20)

---

### `useGhRepoCommits(owner, name, params?)`

> Coming soon — tracked in [#22](https://github.com/ElJijuna/api-hooks/issues/22)

---

### `useGhRepoBranches(owner, name, params?)`

> Coming soon — tracked in [#23](https://github.com/ElJijuna/api-hooks/issues/23)

---

### `useGhRepoBranch(owner, name, branch)`

> Coming soon — tracked in [#21](https://github.com/ElJijuna/api-hooks/issues/21)

---

### `useGhRepoTags(owner, name, params?)`

> Coming soon — tracked in [#27](https://github.com/ElJijuna/api-hooks/issues/27)

---

### `useGhRepoReleases(owner, name, params?)`

> Coming soon — tracked in [#24](https://github.com/ElJijuna/api-hooks/issues/24)

---

### `useGhRepoForks(owner, name, params?)`

> Coming soon — tracked in [#26](https://github.com/ElJijuna/api-hooks/issues/26)

---

### `useGhRepoContents(owner, name, path?, params?)`

> Coming soon — tracked in [#25](https://github.com/ElJijuna/api-hooks/issues/25)

---

### `useGhRepoTopics(owner, name)`

> Coming soon — tracked in [#29](https://github.com/ElJijuna/api-hooks/issues/29)

---

### `useGhRepoContributors(owner, name, params?)`

> Coming soon — tracked in [#30](https://github.com/ElJijuna/api-hooks/issues/30)

---

### `useGhRepoIssues(owner, name, params?)`

> Coming soon — tracked in [#28](https://github.com/ElJijuna/api-hooks/issues/28)

---

### `useGhRepoPullRequests(owner, name, params?)`

> Coming soon — tracked in [#31](https://github.com/ElJijuna/api-hooks/issues/31)

---

### `useGhIssue(owner, name, number)`

> Coming soon — tracked in [#33](https://github.com/ElJijuna/api-hooks/issues/33)

---

### `useGhIssueComments(owner, name, number, params?)`

> Coming soon — tracked in [#32](https://github.com/ElJijuna/api-hooks/issues/32)

---

### `useGhPullRequest(owner, name, number)`

> Coming soon — tracked in [#34](https://github.com/ElJijuna/api-hooks/issues/34)

---

### `useGhPullRequestCommits(owner, name, number, params?)`

> Coming soon — tracked in [#35](https://github.com/ElJijuna/api-hooks/issues/35)

---

### `useGhPullRequestFiles(owner, name, number, params?)`

> Coming soon — tracked in [#38](https://github.com/ElJijuna/api-hooks/issues/38)

---

### `useGhPullRequestReviews(owner, name, number, params?)`

> Coming soon — tracked in [#39](https://github.com/ElJijuna/api-hooks/issues/39)

---

### `useGhPullRequestReviewComments(owner, name, number, params?)`

> Coming soon — tracked in [#37](https://github.com/ElJijuna/api-hooks/issues/37)

---

### `useGhCommit(owner, name, ref)`

> Coming soon — tracked in [#36](https://github.com/ElJijuna/api-hooks/issues/36)

---

### `useGhCommitStatuses(owner, name, ref, params?)`

> Coming soon — tracked in [#41](https://github.com/ElJijuna/api-hooks/issues/41)

---

### `useGhCommitCombinedStatus(owner, name, ref)`

> Coming soon — tracked in [#43](https://github.com/ElJijuna/api-hooks/issues/43)

---

### `useGhCommitCheckRuns(owner, name, ref, params?)`

> Coming soon — tracked in [#42](https://github.com/ElJijuna/api-hooks/issues/42)

---

### `useGhOrg(name)`

> Coming soon — tracked in [#40](https://github.com/ElJijuna/api-hooks/issues/40)

---

### `useGhOrgRepos(name, params?)`

> Coming soon — tracked in [#44](https://github.com/ElJijuna/api-hooks/issues/44)

---

### `useGhOrgMembers(name, params?)`

> Coming soon — tracked in [#45](https://github.com/ElJijuna/api-hooks/issues/45)

---

### `useGhSearchRepos(q, params?)`

> Coming soon — tracked in [#46](https://github.com/ElJijuna/api-hooks/issues/46)

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
