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

All query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

Hooks ending in `Infinite` return a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery) — use `data.pages`, `hasNextPage`, and `fetchNextPage()` to build infinite-scroll UIs.

### User hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhUser(login)`](#useghuserloin) | Public profile for a GitHub user | `GitHubUser` |
| [`useGhUserRepos(login, params?)`](#useghuserreposlogin-params) | Public repositories of a user | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhUserReposInfinite(login, params?)`](#useghuserreposinfinitelogin-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |

### Repository hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhRepo(owner, name)`](#useghreoowner-name) | Repository metadata | `GitHubRepository` |
| [`useGhRepoCommits(owner, name, params?)`](#useghrepocommitsowner-name-params) | Commit list | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhRepoCommitsInfinite(owner, name, params?)`](#useghrepocommitsinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubCommit>>` |
| [`useGhRepoBranches(owner, name, params?)`](#useghrepobranchesowner-name-params) | Branch list | `GitHubPagedResponse<GitHubBranch>` |
| [`useGhRepoBranchesInfinite(owner, name, params?)`](#useghrepobranchesinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubBranch>>` |
| [`useGhRepoBranch(owner, name, branch)`](#useghrepobranchowner-name-branch) | Single branch | `GitHubBranch` |
| [`useGhRepoTags(owner, name, params?)`](#useghrepotagsowner-name-params) | Tag list | `GitHubPagedResponse<GitHubTag>` |
| [`useGhRepoTagsInfinite(owner, name, params?)`](#useghrepotagsinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubTag>>` |
| [`useGhRepoReleases(owner, name, params?)`](#useghreporeleasesowner-name-params) | Release list | `GitHubPagedResponse<GitHubRelease>` |
| [`useGhRepoReleasesInfinite(owner, name, params?)`](#useghreporeleasesinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRelease>>` |
| [`useGhRepoForks(owner, name, params?)`](#useghrepoforksowner-name-params) | Fork list | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhRepoForksInfinite(owner, name, params?)`](#useghrepoforksinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |
| [`useGhRepoContents(owner, name, path?, params?)`](#useghrepocontentsowner-name-path-params) | File or directory contents | `GitHubContent \| GitHubContent[]` |
| [`useGhRepoTopics(owner, name)`](#useghrepotopicsowner-name) | Repository topic tags | `string[]` |
| [`useGhRepoContributors(owner, name, params?)`](#useghrepocontributorsowner-name-params) | Contributor list | `GitHubPagedResponse<GitHubContributor>` |
| [`useGhRepoContributorsInfinite(owner, name, params?)`](#useghrepocontributorsinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubContributor>>` |
| [`useGhRepoIssues(owner, name, params?)`](#useghrepoissuesowner-name-params) | Issue list | `GitHubPagedResponse<GitHubIssue>` |
| [`useGhRepoIssuesInfinite(owner, name, params?)`](#useghrepoissuesinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubIssue>>` |
| [`useGhRepoPullRequests(owner, name, params?)`](#useghrepopullrequestsowner-name-params) | Pull request list | `GitHubPagedResponse<GitHubPullRequest>` |
| [`useGhRepoPullRequestsInfinite(owner, name, params?)`](#useghrepopullrequestsinfiniteowner-name-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubPullRequest>>` |

### Issue hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhIssue(owner, name, number)`](#useghissueowner-name-number) | Single issue | `GitHubIssue` |
| [`useGhIssueComments(owner, name, number, params?)`](#useghissuecommentsowner-name-number-params) | Comments on an issue | `GitHubPagedResponse<GitHubIssueComment>` |
| [`useGhIssueCommentsInfinite(owner, name, number, params?)`](#useghissuecommentsinfiniteowner-name-number-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubIssueComment>>` |

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
| [`useGhOrgReposInfinite(name, params?)`](#useghorgreposinfinitename-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |
| [`useGhOrgMembers(name, params?)`](#useghorgmembersname-params) | Members of an organization | `GitHubPagedResponse<GitHubUser>` |
| [`useGhOrgMembersInfinite(name, params?)`](#useghorgmembersinfinitename-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubUser>>` |

### Search hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhSearchRepos(params)`](#useghsearchreposparams) | Search repositories | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhSearchReposInfinite(params)`](#useghsearchreposinfiniteparams) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |

### Advisory hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhAdvisories(params?)`](#useghadvisoriesparams) | List global security advisories | `GitHubPagedResponse<GitHubAdvisory>` |
| [`useGhAdvisoriesInfinite(params?)`](#useghadvisoriesinfiniteparams) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubAdvisory>>` |
| [`useGhAdvisory(ghsaId)`](#useghadvisoryghsaid) | Single advisory by GHSA ID | `GitHubAdvisory` |
| [`useGhAdvisoryByCve(cveId)`](#useghadvisorybycvecveid) | Advisory by CVE ID | `GitHubAdvisory \| null` |

### Gist hooks — queries

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhGists(params?)`](#useghgistsparams) | List gists (one page) | `GitHubPagedResponse<GitHubGist>` |
| [`useGhGistsInfinite(params?)`](#useghgistsinfiniteparams) | Infinite-scroll variant of `useGhGists` | `InfiniteData<GitHubPagedResponse<GitHubGist>>` |
| [`useGhGist(gistId)`](#useghgistgistid) | Single gist by ID | `GitHubGist` |

### Gist hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhCreateGist()`](#useghcreategist) | Create a new gist | `GitHubGist` |
| [`useGhUpdateGist(gistId)`](#useghupdategistgistid) | Update an existing gist | `GitHubGist` |
| [`useGhDeleteGist(gistId)`](#useghdeletegistgistid) | Delete a gist | `void` |

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

Fetches the public repositories of a GitHub user.

```tsx
import { useGhUserRepos } from '@api-hooks/gh';

function UserRepoList({ login }: { login: string }) {
  const { data } = useGhUserRepos(login, { sort: 'updated', per_page: 20 });

  return (
    <ul>
      {data?.values.map(r => <li key={r.id}>{r.full_name}</li>)}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhUserReposInfinite(login, params?)`

Infinite-scroll variant of `useGhUserRepos`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepo(owner, name)`

Fetches a repository's metadata.

```tsx
import { useGhRepo } from '@api-hooks/gh';

function RepoCard({ owner, name }: { owner: string; name: string }) {
  const { data } = useGhRepo(owner, name);

  return <p>{data?.description}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `owner` or `name` is empty) |
| `token` | `string` | — | GitHub personal access token — required for private repositories |

---

### `useGhRepoCommits(owner, name, params?)`

Fetches the commit list for a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoCommitsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoCommits`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoBranches(owner, name, params?)`

Fetches the branches of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoBranchesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoBranches`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoBranch(owner, name, branch)`

Fetches a single branch by name.

```tsx
import { useGhRepoBranch } from '@api-hooks/gh';

function BranchInfo({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoBranch(owner, repo, 'main');

  return <p>Latest SHA: {data?.commit.sha}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `branch` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoTags(owner, name, params?)`

Fetches the tags of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoTagsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoTags`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoReleases(owner, name, params?)`

Fetches the releases of a repository.

```tsx
import { useGhRepoReleases } from '@api-hooks/gh';

function ReleaseList({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoReleases(owner, repo, { per_page: 5 });

  return (
    <ul>
      {data?.values.map(r => (
        <li key={r.id}>
          <a href={r.html_url}>{r.tag_name}</a>
        </li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoReleasesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoReleases`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoForks(owner, name, params?)`

Fetches the forks of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoForksInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoForks`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoContents(owner, name, path?, params?)`

Fetches the contents of a file or directory. Returns a single `GitHubContent` for files, or an array for directories. Pass a `ref` in `params` to fetch from a specific branch, tag, or commit SHA.

```tsx
import { useGhRepoContents } from '@api-hooks/gh';

function FileViewer({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoContents(owner, repo, 'README.md');
  const file = Array.isArray(data) ? null : data;

  return file ? <pre>{atob(file.content ?? '')}</pre> : null;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoTopics(owner, name)`

Fetches the topic tags for a repository.

```tsx
import { useGhRepoTopics } from '@api-hooks/gh';

function TopicBadges({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoTopics(owner, repo);

  return (
    <div>
      {data?.map(t => <span key={t}>{t}</span>)}
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoContributors(owner, name, params?)`

Fetches the contributors of a repository. Each item includes `login`, `id`, `contributions`, `avatar_url`, and `html_url`. The `GitHubContributor` type is exported from `@api-hooks/gh`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoContributorsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoContributors`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoIssues(owner, name, params?)`

Fetches the issues of a repository. Note: GitHub includes pull requests in this endpoint — filter them by checking for the absence of `pull_request` on each item.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoIssuesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoIssues`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoPullRequests(owner, name, params?)`

Fetches the pull requests of a repository.

```tsx
import { useGhRepoPullRequests } from '@api-hooks/gh';

function OpenPRs({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoPullRequests(owner, repo, { state: 'open' });

  return (
    <ul>
      {data?.values.map(pr => (
        <li key={pr.id}>#{pr.number} {pr.title}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhRepoPullRequestsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoPullRequests`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhIssue(owner, name, number)`

Fetches a single issue by number.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `number` is `0`) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhIssueComments(owner, name, number, params?)`

Fetches the comments on an issue.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhIssueCommentsInfinite(owner, name, number, params?)`

Infinite-scroll variant of `useGhIssueComments`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhPullRequest(owner, name, number)`

Fetches a single pull request by number.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `number` is `0`) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhPullRequestCommits(owner, name, number, params?)`

Fetches the commits included in a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhPullRequestFiles(owner, name, number, params?)`

Fetches the files changed by a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhPullRequestReviews(owner, name, number, params?)`

Fetches the reviews submitted on a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhPullRequestReviewComments(owner, name, number, params?)`

Fetches the inline diff comments on a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhCommit(owner, name, ref)`

Fetches a single commit. `ref` can be a commit SHA, branch name, or tag name.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ref` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhCommitStatuses(owner, name, ref, params?)`

Fetches the individual CI/CD statuses for a commit (Statuses API).

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhCommitCombinedStatus(owner, name, ref)`

Fetches the combined (aggregated) status for a commit.

```tsx
import { useGhCommitCombinedStatus } from '@api-hooks/gh';

function CommitStatus({ owner, repo, sha }: { owner: string; repo: string; sha: string }) {
  const { data } = useGhCommitCombinedStatus(owner, repo, sha);

  return <span>{data?.state}</span>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhCommitCheckRuns(owner, name, ref, params?)`

Fetches the GitHub Actions check runs for a commit.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhOrg(name)`

Fetches an organization's public profile.

```tsx
import { useGhOrg } from '@api-hooks/gh';

function OrgCard({ org }: { org: string }) {
  const { data } = useGhOrg(org);

  return <p>{data?.description}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhOrgRepos(name, params?)`

Fetches the repositories belonging to an organization.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token — required for private repositories |

---

### `useGhOrgReposInfinite(name, params?)`

Infinite-scroll variant of `useGhOrgRepos`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhOrgMembers(name, params?)`

Fetches the members of an organization.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhOrgMembersInfinite(name, params?)`

Infinite-scroll variant of `useGhOrgMembers`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhSearchRepos(params)`

Searches for repositories using [GitHub's search syntax](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories). `params.q` is required. The response includes a `totalCount` field.

```tsx
import { useGhSearchRepos } from '@api-hooks/gh';

function RepoSearch({ query }: { query: string }) {
  const { data } = useGhSearchRepos({ q: query, sort: 'stars', per_page: 10 });

  return (
    <>
      <p>{data?.totalCount} results</p>
      <ul>
        {data?.values.map(r => <li key={r.id}>{r.full_name}</li>)}
      </ul>
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `params.q` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhSearchReposInfinite(params)`

Infinite-scroll variant of `useGhSearchRepos`.

```tsx
import { useGhSearchReposInfinite } from '@api-hooks/gh';

function InfiniteRepoSearch({ query }: { query: string }) {
  const { data, hasNextPage, fetchNextPage } =
    useGhSearchReposInfinite({ q: query, sort: 'stars' });

  const repos = data?.pages.flatMap(p => p.values) ?? [];

  return (
    <>
      <ul>{repos.map(r => <li key={r.id}>{r.full_name}</li>)}</ul>
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `params.q` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhGists(params?, options?)`

Lists public gists, or all gists for the authenticated user when a `token` is provided. Returns one page.

```tsx
import { useGhGists } from '@api-hooks/gh';

function GistList() {
  const { data } = useGhGists({ per_page: 10 });

  return (
    <ul>
      {data?.values.map(g => (
        <li key={g.id}>{g.description ?? g.id}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token — required to list secret gists |

---

### `useGhGistsInfinite(params?, options?)`

Infinite-scroll variant of `useGhGists`. Each call to `fetchNextPage()` fetches the next page using `nextPage` from the previous response. Results accumulate in `data.pages`.

```tsx
import { useGhGistsInfinite } from '@api-hooks/gh';

function InfiniteGistList() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGhGistsInfinite({ per_page: 10 }, { token: 'ghp_...' });

  const allGists = data?.pages.flatMap(p => p.values) ?? [];

  return (
    <>
      <ul>
        {allGists.map(g => (
          <li key={g.id}>{g.description ?? g.id}</li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token — required to list secret gists |

---

### `useGhGist(gistId)`

Fetches a single gist by ID.

```tsx
import { useGhGist } from '@api-hooks/gh';

function GistViewer({ gistId }: { gistId: string }) {
  const { data, isLoading, isError } = useGhGist(gistId);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Gist not found.</p>;

  return (
    <div>
      <h2>{data.description ?? gistId}</h2>
      <a href={data.html_url}>View on GitHub</a>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |

---

### `useGhCreateGist()`

Creates a new gist.

```tsx
import { useGhCreateGist } from '@api-hooks/gh';

function NewGistForm() {
  const { mutate, isPending, isSuccess, data } = useGhCreateGist();

  const handleSubmit = () => {
    mutate({
      files: { 'hello.txt': { content: 'Hello, world!' } },
      description: 'My gist',
      public: true,
    });
  };

  if (isSuccess) return <a href={data.html_url}>Gist created</a>;

  return <button onClick={handleSubmit} disabled={isPending}>Create</button>;
}
```

---

### `useGhUpdateGist(gistId)`

Updates an existing gist.

```tsx
import { useGhUpdateGist } from '@api-hooks/gh';

function EditGist({ gistId }: { gistId: string }) {
  const { mutate, isPending } = useGhUpdateGist(gistId);

  return (
    <button
      onClick={() => mutate({ description: 'Updated description' })}
      disabled={isPending}
    >
      Save
    </button>
  );
}
```

---

### `useGhDeleteGist(gistId)`

Deletes a gist.

```tsx
import { useGhDeleteGist } from '@api-hooks/gh';

function DeleteButton({ gistId }: { gistId: string }) {
  const { mutate, isPending } = useGhDeleteGist(gistId);

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      Delete
    </button>
  );
}
```

---

### `useGhAdvisories(params?)`

Lists global security advisories from the [GitHub Advisory Database](https://github.com/advisories). Filter by `severity`, `ecosystem`, `cve_id`, `ghsa_id`, `cwe_id`, and more.

```tsx
import { useGhAdvisories } from '@api-hooks/gh';

function CriticalAdvisories() {
  const { data } = useGhAdvisories({ severity: 'critical', per_page: 10 });

  return (
    <ul>
      {data?.values.map(a => (
        <li key={a.ghsa_id}>{a.ghsa_id} — {a.summary}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhAdvisoriesInfinite(params?)`

Infinite-scroll variant of `useGhAdvisories`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhAdvisory(ghsaId)`

Fetches a single global security advisory by its GHSA ID.

```tsx
import { useGhAdvisory } from '@api-hooks/gh';

function AdvisoryDetail({ ghsaId }: { ghsaId: string }) {
  const { data, isLoading } = useGhAdvisory(ghsaId);

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h2>{data?.ghsa_id}</h2>
      <p>CVE: {data?.cve_id ?? '—'}</p>
      <p>Severity: {data?.severity}</p>
      <p>{data?.summary}</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ghsaId` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

### `useGhAdvisoryByCve(cveId)`

Fetches a global security advisory by its CVE ID. Returns `null` when no advisory exists for the given CVE.

```tsx
import { useGhAdvisoryByCve } from '@api-hooks/gh';

function CveDetail({ cveId }: { cveId: string }) {
  const { data, isLoading } = useGhAdvisoryByCve(cveId);

  if (isLoading) return <p>Loading…</p>;
  if (!data) return <p>No advisory found for {cveId}.</p>;

  return (
    <div>
      <h2>{cveId}</h2>
      <p>GHSA: {data.ghsa_id}</p>
      <p>Severity: {data.severity}</p>
      <p>{data.summary}</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `cveId` is empty) |
| `token` | `string` | — | GitHub personal access token |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
