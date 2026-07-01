# @api-hooks/gh

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

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

Wrap your application with `QueryClientProvider` and `GhClientProvider` at the root. Pass your GitHub token to `GhClientProvider` — all hooks will use it automatically.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GhClientProvider } from '@api-hooks/gh';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GhClientProvider options={{ token: 'ghp_yourPersonalAccessToken' }}>
        <YourApp />
      </GhClientProvider>
    </QueryClientProvider>
  );
}
```

If you don't need authentication (public API only), omit `options`:

```tsx
<GhClientProvider>
  <YourApp />
</GhClientProvider>
```

You can also pass a pre-configured `GitHubClient` instance directly:

```tsx
import { GitHubClient } from 'gh-api-client';

const client = new GitHubClient({ token: 'ghp_...', apiUrl: 'https://github.mycompany.com/api/v3' });

<GhClientProvider client={client}>
  <YourApp />
</GhClientProvider>
```

## Hooks

All query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

Hooks ending in `Infinite` return a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery) — use `data.pages`, `hasNextPage`, and `fetchNextPage()` to build infinite-scroll UIs.

### GraphQL hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhGraphql(query, variables?)` | Execute a GitHub GraphQL query | Typed GraphQL response |

### User hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhUser(login)`](#useghuserloin) | Public profile for a GitHub user | `GitHubUser` |
| [`useGhUserRepos(login, params?)`](#useghuserreposlogin-params) | Public repositories of a user | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhUserReposInfinite(login, params?)`](#useghuserreposinfinitelogin-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |
| `useGhCurrentUser()` | Authenticated user's own profile | `GitHubUser` |
| `useGhUserFollowers(login, params?)` | Followers of a user | `GitHubPagedResponse<GitHubUser>` |
| `useGhUserFollowersInfinite(login, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubUser>>` |
| `useGhUserFollowing(login, params?)` | Users a person is following | `GitHubPagedResponse<GitHubUser>` |
| `useGhUserFollowingInfinite(login, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubUser>>` |
| `useGhUserPublicEvents(login, params?)` | Public events performed by a user | `GitHubPagedResponse<GitHubEvent>` |
| `useGhUserOrganizations(login, params?)` | Public organizations for a user | `GitHubPagedResponse<GitHubOrganization>` |
| `useGhUserOrganizationsInfinite(login, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubOrganization>>` |
| `useGhUserSocialAccounts(login)` | Social accounts linked on a user profile | `SocialAccount[]` |
| `useGhUserContributionMap(login, params?)` | Contribution calendar (GraphQL) | `ContributionCalendar` |
| `useGhUserCommitContributionsByRepo(login)` | Commit contributions by repository (GraphQL) | `RepoContribution[]` |
| `useGhUserPrContributionsByRepo(login)` | Pull request contributions by repository (GraphQL) | `RepoContribution[]` |
| `useGhUserIssueContributionsByRepo(login)` | Issue contributions by repository (GraphQL) | `RepoContribution[]` |
| `useGhUserPinnedItems(login)` | Pinned repositories and gists (GraphQL) | `PinnedItem[]` |

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
| `useGhRepoLatestRelease(owner, name)` | Most recent published release | `GitHubRelease` |
| `useGhRepoWebhooks(owner, name, params?)` | Webhook list (requires admin token) | `GitHubPagedResponse<GitHubWebhook>` |
| `useGhRepoWebhooksInfinite(owner, name, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubWebhook>>` |
| `useGhRepoRaw(owner, name, path, params?)` | Raw file content as string | `string` |
| `useGhRepoMultipleRaw(owner, name, paths, params?)` | Multiple raw file contents keyed by path | `Record<string, string>` |
| `useGhRepoAdvisories(owner, name, params?)` | Repository security advisories | `GitHubPagedResponse<GitHubRepositoryAdvisory>` |
| `useGhRepoAdvisoriesInfinite(owner, name, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepositoryAdvisory>>` |
| `useGhRepoAdvisory(owner, name, ghsaId)` | Single repository advisory by GHSA ID | `GitHubRepositoryAdvisory` |
| `useGhRepoWorkflowRuns(owner, name, params?)` | GitHub Actions workflow runs | `GitHubWorkflowRunsResponse` |
| `useGhRepoWorkflowRunsInfinite(owner, name, params?)` | Infinite-scroll variant | `InfiniteData<GitHubWorkflowRunsResponse>` |
| `useGhRepoGitTree(owner, name, treeSha, params?)` | Git tree entries for a tree SHA or ref | `GitHubTree` |
| `useGhRepoLanguages(owner, name)` | Programming languages used, mapped to byte counts | `RepoLanguages` |
| `useGhRepoWorkflows(owner, name, params?)` | GitHub Actions workflow definitions | `GitHubWorkflowsResponse` |
| `useGhRepoWorkflowsInfinite(owner, name, params?)` | Infinite-scroll variant | `InfiniteData<GitHubWorkflowsResponse>` |
| `useGhRepoWorkflowRun(owner, name, runId)` | Single workflow run by ID | `GitHubWorkflowRun` |

### Repository hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhCreateFork(owner, name)` | Fork a repository | `GitHubRepository` |
| `useGhCreateIssue(owner, name)` | Create a new issue | `GitHubIssue` |
| `useGhCreateRepoWebhook(owner, name)` | Create a repository webhook | `GitHubWebhook` |
| `useGhUpdateRepoWebhook(owner, name)` | Update a repository webhook | `GitHubWebhook` |
| `useGhDeleteRepoWebhook(owner, name)` | Delete a repository webhook | `void` |
| `useGhCreateRepoAdvisory(owner, name)` | Create a draft repository advisory | `GitHubRepositoryAdvisory` |
| `useGhUpdateRepoAdvisory(owner, name)` | Update a repository advisory | `GitHubRepositoryAdvisory` |
| `useGhRequestRepoAdvisoryCve(owner, name)` | Request a CVE for a repository advisory | `GitHubRepositoryAdvisory` |
| `useGhCreateLabel(owner, name)` | Create a label — `mutate(data)` | `GitHubLabel` |
| `useGhUpdateLabel(owner, name)` | Update a label — `mutate({ name, data })` | `GitHubLabel` |
| `useGhDeleteLabel(owner, name)` | Delete a label — `mutate(name)` | `void` |
| `useGhCreateMilestone(owner, name)` | Create a milestone — `mutate(data)` | `GitHubMilestone` |
| `useGhUpdateMilestone(owner, name)` | Update a milestone — `mutate({ milestoneNumber, data })` | `GitHubMilestone` |
| `useGhDeleteMilestone(owner, name)` | Delete a milestone — `mutate(milestoneNumber)` | `void` |
| `useGhAddCollaborator(owner, name)` | Add a collaborator — `mutate({ username, data? })` | `void` |
| `useGhRemoveCollaborator(owner, name)` | Remove a collaborator — `mutate(username)` | `void` |
| `useGhCreateRelease(owner, name)` | Create a release — `mutate(data)` | `GitHubRelease` |
| `useGhUpdateRelease(owner, name)` | Update a release — `mutate({ releaseId, data })` | `GitHubRelease` |
| `useGhDeleteRelease(owner, name)` | Delete a release — `mutate(releaseId)` | `void` |
| `useGhCancelWorkflowRun(owner, name)` | Cancel a workflow run — `mutate(runId)` | `void` |
| `useGhTriggerWorkflow(owner, name)` | Trigger a workflow dispatch — `mutate({ workflowId, data })` | `void` |

### Issue hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhIssue(owner, name, number)`](#useghissueowner-name-number) | Single issue | `GitHubIssue` |
| [`useGhIssueComments(owner, name, number, params?)`](#useghissuecommentsowner-name-number-params) | Comments on an issue | `GitHubPagedResponse<GitHubIssueComment>` |
| [`useGhIssueCommentsInfinite(owner, name, number, params?)`](#useghissuecommentsinfiniteowner-name-number-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubIssueComment>>` |
| `useGhIssues(params?)` | Issues across all repos for the authenticated user | `GitHubPagedResponse<GitHubIssue>` |
| `useGhIssuesInfinite(params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubIssue>>` |

### Issue hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhAddIssueComment(owner, name, number)` | Add a comment to an issue — `mutate(body)` | `GitHubIssueComment` |
| `useGhUpdateIssue(owner, name, number)` | Update an issue (title, body, state, labels…) | `GitHubIssue` |

### Pull Request hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhPullRequest(owner, name, number)`](#useghpullrequestowner-name-number) | Single pull request | `GitHubPullRequest` |
| [`useGhPullRequestCommits(owner, name, number, params?)`](#useghpullrequestcommitsowner-name-number-params) | Commits in a PR | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhPullRequestFiles(owner, name, number, params?)`](#useghpullrequestfilesowner-name-number-params) | Files changed in a PR | `GitHubPagedResponse<GitHubPullRequestFile>` |
| [`useGhPullRequestReviews(owner, name, number, params?)`](#useghpullrequestreviews-owner-name-number-params) | Reviews on a PR | `GitHubPagedResponse<GitHubReview>` |
| [`useGhPullRequestReviewComments(owner, name, number, params?)`](#useghpullrequestreviewcommentsowner-name-number-params) | Review comments on a PR | `GitHubPagedResponse<GitHubReviewComment>` |
| `useGhPullRequestIsMerged(owner, name, number)` | Whether a PR has been merged | `boolean` |

### Pull Request hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhMergePullRequest(owner, name, number)` | Merge a pull request | `MergeResult` |
| `useGhCreatePullRequestReview(owner, name, number)` | Submit a review | `GitHubReview` |
| `useGhRequestReviewers(owner, name, number)` | Request reviewers | `GitHubPullRequest` |
| `useGhUpdatePullRequest(owner, name, number)` | Update title, body, or state | `GitHubPullRequest` |
| `useGhAddPullRequestComment(owner, name, number)` | Add an inline review comment | `GitHubReviewComment` |

### Commit hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhCommit(owner, name, ref)`](#useghcommitowner-name-ref) | Single commit | `GitHubCommit` |
| [`useGhCommitStatuses(owner, name, ref, params?)`](#useghcommitstatusesowner-name-ref-params) | Status checks for a commit | `GitHubPagedResponse<GitHubCommitStatus>` |
| [`useGhCommitCombinedStatus(owner, name, ref)`](#useghcommitcombinedstatusowner-name-ref) | Combined status for a commit | `GitHubCombinedStatus` |
| [`useGhCommitCheckRuns(owner, name, ref, params?)`](#useghcommitcheckrunsowner-name-ref-params) | Check runs for a commit | `GitHubPagedResponse<GitHubCheckRun>` |
| `useGhCommitComments(owner, name, ref, params?)` | Comments on a commit | `GitHubPagedResponse<GitHubCommitComment>` |
| `useGhCommitCommentsInfinite(owner, name, ref, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubCommitComment>>` |

### Commit hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhCreateCommitStatus(owner, name, ref)` | Create a commit status check | `GitHubCommitStatus` |
| `useGhAddCommitComment(owner, name, ref)` | Add a comment to a commit | `GitHubCommitComment` |

### Organization hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhOrg(name)`](#useghorgname) | Organization profile | `GitHubOrganization` |
| [`useGhOrgRepos(name, params?)`](#useghorgreposname-params) | Repositories in an organization | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhOrgReposInfinite(name, params?)`](#useghorgreposinfinitename-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |
| [`useGhOrgMembers(name, params?)`](#useghorgmembersname-params) | Members of an organization | `GitHubPagedResponse<GitHubUser>` |
| [`useGhOrgMembersInfinite(name, params?)`](#useghorgmembersinfinitename-params) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubUser>>` |

### Organization hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhCreateOrgRepo(name)` | Create a repository in an organization | `GitHubRepository` |

### Notification hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhNotifications(params?)` | Notifications for the authenticated user | `GitHubPagedResponse<GitHubNotification>` |
| `useGhNotificationsInfinite(params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubNotification>>` |

### Notification hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| `useGhMarkNotificationRead()` | Mark a notification thread as read — `mutate(threadId)` | `void` |
| `useGhMarkAllNotificationsRead()` | Mark all notifications as read | `void` |

### Search hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhSearchRepos(params)`](#useghsearchreposparams) | Search repositories | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhSearchReposInfinite(params)`](#useghsearchreposinfiniteparams) | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubRepository>>` |
| `useGhSearchIssues(params)` | Search issues and pull requests | `GitHubPagedResponse<GitHubIssue>` |
| `useGhSearchIssuesInfinite(params)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubIssue>>` |
| `useGhSearchUsers(params)` | Search users | `GitHubPagedResponse<GitHubUser>` |
| `useGhSearchUsersInfinite(params)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubUser>>` |
| `useGhSearchCode(params)` | Search code across repositories | `GitHubPagedResponse<GitHubCodeResult>` |
| `useGhSearchCodeInfinite(params)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GitHubCodeResult>>` |

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
| `useGhGistCommits(gistId, params?)` | Commit history of a gist | `GitHubPagedResponse<GistCommit>` |
| `useGhGistCommitsInfinite(gistId, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GistCommit>>` |
| `useGhGistForks(gistId, params?)` | Forks of a gist | `GitHubPagedResponse<GistFork>` |
| `useGhGistForksInfinite(gistId, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GistFork>>` |
| `useGhGistComments(gistId, params?)` | Comments on a gist | `GitHubPagedResponse<GistComment>` |
| `useGhGistCommentsInfinite(gistId, params?)` | Infinite-scroll variant | `InfiniteData<GitHubPagedResponse<GistComment>>` |
| `useGhGistIsStarred(gistId)` | Whether the authenticated user has starred the gist | `boolean` |

### Gist hooks — mutations

All mutation hooks return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useGhCreateGist()`](#useghcreategist) | Create a new gist | `GitHubGist` |
| [`useGhUpdateGist(gistId)`](#useghupdategistgistid) | Update an existing gist | `GitHubGist` |
| [`useGhDeleteGist(gistId)`](#useghdeletegistgistid) | Delete a gist | `void` |
| `useGhForkGist(gistId)` | Fork a gist | `GitHubGist` |
| `useGhStarGist(gistId)` | Star a gist | `void` |
| `useGhUnstarGist(gistId)` | Unstar a gist | `void` |
| `useGhAddGistComment(gistId)` | Add a comment to a gist | `GistComment` |
| `useGhUpdateGistComment(gistId)` | Update an existing gist comment | `GistComment` |
| `useGhDeleteGistComment(gistId)` | Delete a gist comment | `void` |

---

## API Reference

### `useGhGraphql(query, variables?)`

Executes a GitHub GraphQL query. Pass the expected response type as the generic parameter when you want typed `data`.

```tsx
import { useGhGraphql } from '@api-hooks/gh';

function ViewerLogin() {
  const { data } = useGhGraphql<{ viewer: { login: string } }>(
    `query Viewer { viewer { login } }`
  );

  return <span>{data?.viewer.login}</span>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `query` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserReposInfinite(login, params?)`

Infinite-scroll variant of `useGhUserRepos`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCurrentUser()`

Fetches the authenticated user's own profile. Requires a token set in `GhClientProvider`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserFollowers(login, params?)`

Fetches the followers of a GitHub user.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserFollowersInfinite(login, params?)`

Infinite-scroll variant of `useGhUserFollowers`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserFollowing(login, params?)`

Fetches the users that a GitHub user is following.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserFollowingInfinite(login, params?)`

Infinite-scroll variant of `useGhUserFollowing`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserPublicEvents(login, params?)`

Fetches the public events performed by a GitHub user.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserOrganizations(login, params?)`

Fetches the public organizations for a GitHub user.

```tsx
import { useGhUserOrganizations } from '@api-hooks/gh';

function UserOrganizations({ login }: { login: string }) {
  const { data } = useGhUserOrganizations(login, { per_page: 20 });

  return (
    <ul>
      {data?.values.map(org => (
        <li key={org.id}>{org.login}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserOrganizationsInfinite(login, params?)`

Infinite-scroll variant of `useGhUserOrganizations`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserSocialAccounts(login)`

Fetches the social accounts configured on a GitHub user's profile.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhUserContributionMap(login, params?)`

Fetches a user's contribution calendar via the GitHub GraphQL API. Requires a token set in `GhClientProvider`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `login` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoCommits(owner, name, params?)`

Fetches the commit list for a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoCommitsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoCommits`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoBranches(owner, name, params?)`

Fetches the branches of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoBranchesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoBranches`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoTags(owner, name, params?)`

Fetches the tags of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoTagsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoTags`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoReleasesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoReleases`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoForks(owner, name, params?)`

Fetches the forks of a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoForksInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoForks`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoContributors(owner, name, params?)`

Fetches the contributors of a repository. Each item includes `login`, `id`, `contributions`, `avatar_url`, and `html_url`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoContributorsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoContributors`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoIssues(owner, name, params?)`

Fetches the issues of a repository. Note: GitHub includes pull requests in this endpoint — filter them by checking for the absence of `pull_request` on each item.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoIssuesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoIssues`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoPullRequestsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoPullRequests`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoLatestRelease(owner, name)`

Fetches the most recent published release for a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoWebhooks(owner, name, params?)`

Fetches the webhooks configured for a repository. Requires a token with admin access set in `GhClientProvider`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoWebhooksInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoWebhooks`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoRaw(owner, name, path, params?)`

Fetches the raw content of a file as a string. Pass a `ref` in `params` to fetch from a specific branch, tag, or commit SHA.

```tsx
import { useGhRepoRaw } from '@api-hooks/gh';

function RawFile({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoRaw(owner, repo, '.github/CODEOWNERS');

  return <pre>{data}</pre>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `path` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoMultipleRaw(owner, name, paths, params?)`

Fetches the raw content of multiple files as a path-keyed object. Pass a `ref` in `params` to fetch from a specific branch, tag, or commit SHA.

```tsx
import { useGhRepoMultipleRaw } from '@api-hooks/gh';

function RawFiles({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoMultipleRaw(owner, repo, ['README.md', 'package.json'], {
    ref: 'main',
  });

  return (
    <div>
      {Object.entries(data ?? {}).map(([path, content]) => (
        <section key={path}>
          <h2>{path}</h2>
          <pre>{content}</pre>
        </section>
      ))}
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `paths` is empty or includes an empty path) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoAdvisories(owner, name, params?)`

Fetches the security advisories published in a repository.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoAdvisoriesInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoAdvisories`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoAdvisory(owner, name, ghsaId)`

Fetches a single repository security advisory by its GHSA ID.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ghsaId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoWorkflowRuns(owner, name, params?)`

Fetches GitHub Actions workflow runs for a repository. The response envelope includes `total_count` and `workflow_runs`.

```tsx
import { useGhRepoWorkflowRuns } from '@api-hooks/gh';

function WorkflowStatus({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoWorkflowRuns(owner, repo, { per_page: 5 });

  return (
    <ul>
      {data?.workflow_runs.map(run => (
        <li key={run.id}>
          {run.name} — {run.status} ({run.conclusion ?? 'in progress'})
        </li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoWorkflowRunsInfinite(owner, name, params?)`

Infinite-scroll variant of `useGhRepoWorkflowRuns`. Uses `total_count` to determine if more pages exist.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhRepoGitTree(owner, name, treeSha, params?)`

Fetches a Git tree for a repository. Pass `{ recursive: '1' }` to retrieve nested tree entries.

```tsx
import { useGhRepoGitTree } from '@api-hooks/gh';

function RepoTree({ owner, repo }: { owner: string; repo: string }) {
  const { data } = useGhRepoGitTree(owner, repo, 'main', { recursive: '1' });

  return (
    <ul>
      {data?.tree.map(item => (
        <li key={item.path}>{item.path}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `treeSha` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCreateFork(owner, name)`

Forks a repository into the authenticated user's account (or an organization).

```tsx
import { useGhCreateFork } from '@api-hooks/gh';

function ForkButton({ owner, repo }: { owner: string; repo: string }) {
  const { mutate, isPending } = useGhCreateFork(owner, repo);

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      Fork
    </button>
  );
}
```

---

### `useGhCreateIssue(owner, name)`

Creates a new issue in a repository.

```tsx
import { useGhCreateIssue } from '@api-hooks/gh';

function NewIssueForm({ owner, repo }: { owner: string; repo: string }) {
  const { mutate, isPending } = useGhCreateIssue(owner, repo);

  return (
    <button
      onClick={() => mutate({ title: 'Bug report', body: 'Something is broken.' })}
      disabled={isPending}
    >
      Submit
    </button>
  );
}
```

---

### `useGhCreateRepoWebhook(owner, name)`

Creates a webhook on a repository. Requires a token with repository admin access.

```tsx
import { useGhCreateRepoWebhook } from '@api-hooks/gh';

function CreateWebhookButton({ owner, repo }: { owner: string; repo: string }) {
  const { mutate, isPending } = useGhCreateRepoWebhook(owner, repo);

  return (
    <button
      onClick={() =>
        mutate({
          config: { url: 'https://example.com/webhook', content_type: 'json' },
          events: ['push'],
        })
      }
      disabled={isPending}
    >
      Create webhook
    </button>
  );
}
```

---

### `useGhUpdateRepoWebhook(owner, name)`

Updates a repository webhook. Call `mutate({ hookId, data })`.

---

### `useGhDeleteRepoWebhook(owner, name)`

Deletes a repository webhook. Call `mutate({ hookId })`.

---

### `useGhCreateRepoAdvisory(owner, name)`

Creates a draft security advisory in a repository.

---

### `useGhUpdateRepoAdvisory(owner, name)`

Updates a repository security advisory. Call `mutate({ ghsaId, data })`.

---

### `useGhRequestRepoAdvisoryCve(owner, name)`

Requests a CVE ID for a repository security advisory. Call `mutate({ ghsaId })`.

---

### `useGhIssue(owner, name, number)`

Fetches a single issue by number.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `number` is `0`) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhIssueComments(owner, name, number, params?)`

Fetches the comments on an issue.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhIssueCommentsInfinite(owner, name, number, params?)`

Infinite-scroll variant of `useGhIssueComments`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhIssues(params?)`

Fetches issues assigned to the authenticated user across all repositories (`GET /issues`). Note: GitHub includes pull requests in this endpoint — filter them by checking for the absence of `pull_request`.

```tsx
import { useGhIssues } from '@api-hooks/gh';

function MyIssues() {
  const { data } = useGhIssues({ filter: 'assigned', state: 'open' });
  const issues = data?.values.filter(i => !i.pull_request) ?? [];

  return (
    <ul>
      {issues.map(i => <li key={i.id}>#{i.number} {i.title}</li>)}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhIssuesInfinite(params?)`

Infinite-scroll variant of `useGhIssues`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequest(owner, name, number)`

Fetches a single pull request by number.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `number` is `0`) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequestCommits(owner, name, number, params?)`

Fetches the commits included in a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequestFiles(owner, name, number, params?)`

Fetches the files changed by a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequestReviews(owner, name, number, params?)`

Fetches the reviews submitted on a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequestReviewComments(owner, name, number, params?)`

Fetches the inline diff comments on a pull request.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhPullRequestIsMerged(owner, name, number)`

Returns `true` when the pull request has been merged.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `number` is `0`) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhMergePullRequest(owner, name, number)`

Merges a pull request.

```tsx
import { useGhMergePullRequest } from '@api-hooks/gh';

function MergeButton({ owner, repo, number }: { owner: string; repo: string; number: number }) {
  const { mutate, isPending } = useGhMergePullRequest(owner, repo, number);

  return (
    <button onClick={() => mutate({ merge_method: 'squash' })} disabled={isPending}>
      Merge
    </button>
  );
}
```

---

### `useGhCreatePullRequestReview(owner, name, number)`

Submits a review (approve, request changes, or comment) on a pull request.

---

### `useGhRequestReviewers(owner, name, number)`

Requests one or more reviewers for a pull request.

---

### `useGhUpdatePullRequest(owner, name, number)`

Updates the title, body, state, or base branch of a pull request.

---

### `useGhAddPullRequestComment(owner, name, number)`

Adds an inline review comment to a pull request diff.

---

### `useGhCommit(owner, name, ref)`

Fetches a single commit. `ref` can be a commit SHA, branch name, or tag name.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ref` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCommitStatuses(owner, name, ref, params?)`

Fetches the individual CI/CD statuses for a commit (Statuses API).

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCommitCheckRuns(owner, name, ref, params?)`

Fetches the GitHub Actions check runs for a commit.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCommitComments(owner, name, ref, params?)`

Fetches the comments posted on a commit.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ref` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCommitCommentsInfinite(owner, name, ref, params?)`

Infinite-scroll variant of `useGhCommitComments`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `ref` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCreateCommitStatus(owner, name, ref)`

Creates a status check (pending / success / failure / error) for a commit.

```tsx
import { useGhCreateCommitStatus } from '@api-hooks/gh';

function MarkStatus({ owner, repo, sha }: { owner: string; repo: string; sha: string }) {
  const { mutate } = useGhCreateCommitStatus(owner, repo, sha);

  return (
    <button onClick={() => mutate({ state: 'success', context: 'my-ci' })}>
      Mark success
    </button>
  );
}
```

---

### `useGhAddCommitComment(owner, name, ref)`

Adds a comment to a commit.

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhOrgRepos(name, params?)`

Fetches the repositories belonging to an organization.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhOrgReposInfinite(name, params?)`

Infinite-scroll variant of `useGhOrgRepos`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhOrgMembers(name, params?)`

Fetches the members of an organization.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhOrgMembersInfinite(name, params?)`

Infinite-scroll variant of `useGhOrgMembers`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhCreateOrgRepo(name)`

Creates a repository in an organization. Requires a token with permission to create organization repositories.

```tsx
import { useGhCreateOrgRepo } from '@api-hooks/gh';

function CreateOrgRepoButton({ org }: { org: string }) {
  const { mutate, isPending } = useGhCreateOrgRepo(org);

  return (
    <button
      onClick={() => mutate({ name: 'new-repo', private: true })}
      disabled={isPending}
    >
      Create repo
    </button>
  );
}
```

---

### `useGhNotifications(params?)`

Fetches notifications for the authenticated user. Requires a token set in `GhClientProvider`.

```tsx
import { useGhNotifications } from '@api-hooks/gh';

function NotificationBadge() {
  const { data } = useGhNotifications({ participating: true });
  const unread = data?.values.filter(n => n.unread) ?? [];

  return <span>{unread.length} unread</span>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhNotificationsInfinite(params?)`

Infinite-scroll variant of `useGhNotifications`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhMarkNotificationRead()`

Marks a single notification thread as read. Call `mutate(threadId)`.

```tsx
import { useGhMarkNotificationRead } from '@api-hooks/gh';

function NotificationItem({ threadId, title }: { threadId: string; title: string }) {
  const { mutate, isPending } = useGhMarkNotificationRead();

  return (
    <div>
      <span>{title}</span>
      <button onClick={() => mutate(threadId)} disabled={isPending}>
        Mark as read
      </button>
    </div>
  );
}
```

---

### `useGhMarkAllNotificationsRead()`

Marks all notifications as read.

```tsx
import { useGhMarkAllNotificationsRead } from '@api-hooks/gh';

function ClearAllButton() {
  const { mutate, isPending } = useGhMarkAllNotificationsRead();

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      Mark all as read
    </button>
  );
}
```

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhSearchIssues(params)`

Searches for issues and pull requests using [GitHub's search syntax](https://docs.github.com/en/search-github/searching-on-github/searching-for-issues-and-pull-requests). `params.q` is required. The response includes a `totalCount` field.

```tsx
import { useGhSearchIssues } from '@api-hooks/gh';

function IssueSearch({ query }: { query: string }) {
  const { data } = useGhSearchIssues({ q: `is:issue is:open ${query}` });

  return (
    <>
      <p>{data?.totalCount} issues found</p>
      <ul>
        {data?.values.map(i => <li key={i.id}>#{i.number} {i.title}</li>)}
      </ul>
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `params.q` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhSearchIssuesInfinite(params)`

Infinite-scroll variant of `useGhSearchIssues`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `params.q` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistCommits(gistId, params?)`

Fetches the commit history of a gist.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistCommitsInfinite(gistId, params?)`

Infinite-scroll variant of `useGhGistCommits`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistForks(gistId, params?)`

Fetches the forks of a gist.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistForksInfinite(gistId, params?)`

Infinite-scroll variant of `useGhGistForks`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistComments(gistId, params?)`

Fetches the comments on a gist.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistCommentsInfinite(gistId, params?)`

Infinite-scroll variant of `useGhGistComments`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistIsStarred(gistId)`

Returns `true` when the authenticated user has starred the gist. Requires a token set in `GhClientProvider`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `gistId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhForkGist(gistId)`

Forks a gist into the authenticated user's account.

---

### `useGhStarGist(gistId)`

Stars a gist on behalf of the authenticated user.

---

### `useGhUnstarGist(gistId)`

Unstars a gist on behalf of the authenticated user.

---

### `useGhAddGistComment(gistId)`

Adds a comment to a gist.

---

### `useGhUpdateGistComment(gistId)`

Updates an existing comment on a gist. Call `mutate({ commentId, body })`.

---

### `useGhDeleteGistComment(gistId)`

Deletes a comment from a gist. Call `mutate({ commentId })`.

---

### `useGhGists(params?, options?)`

Lists public gists, or all gists for the authenticated user when a token is set in `GhClientProvider`. Returns one page.

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhGistsInfinite(params?, options?)`

Infinite-scroll variant of `useGhGists`. Each call to `fetchNextPage()` fetches the next page using `nextPage` from the previous response. Results accumulate in `data.pages`.

```tsx
import { useGhGistsInfinite } from '@api-hooks/gh';

function InfiniteGistList() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGhGistsInfinite({ per_page: 10 });

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useGhAdvisoriesInfinite(params?)`

Infinite-scroll variant of `useGhAdvisories`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

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
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
