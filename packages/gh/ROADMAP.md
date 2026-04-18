# @api-hooks/gh — ROADMAP

Hooks built on [`gh-api-client`](https://www.npmjs.com/package/gh-api-client) + `@tanstack/react-query`.

---

## User hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ [`useGhUser(login)`](https://github.com/ElJijuna/api-hooks/issues/19) | `gh.user(login).get()` | `GitHubUser` |
| [`useGhUserRepos(login, params?)`](https://github.com/ElJijuna/api-hooks/issues/18) | `gh.user(login).repos(params)` | `GitHubPagedResponse<GitHubRepository>` |

## Repository hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhRepo(owner, name)`](https://github.com/ElJijuna/api-hooks/issues/20) | `gh.repo(owner, name).get()` | `GitHubRepository` |
| [`useGhRepoCommits(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/22) | `gh.repo(owner, name).commits(params)` | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhRepoBranches(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/23) | `gh.repo(owner, name).branches(params)` | `GitHubPagedResponse<GitHubBranch>` |
| [`useGhRepoBranch(owner, name, branch)`](https://github.com/ElJijuna/api-hooks/issues/21) | `gh.repo(owner, name).branch(branch)` | `GitHubBranch` |
| [`useGhRepoTags(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/27) | `gh.repo(owner, name).tags(params)` | `GitHubPagedResponse<GitHubTag>` |
| [`useGhRepoReleases(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/24) | `gh.repo(owner, name).releases(params)` | `GitHubPagedResponse<GitHubRelease>` |
| [`useGhRepoForks(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/26) | `gh.repo(owner, name).forks(params)` | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhRepoContents(owner, name, path?, params?)`](https://github.com/ElJijuna/api-hooks/issues/25) | `gh.repo(owner, name).contents(path, params)` | `GitHubContent \| GitHubContent[]` |
| [`useGhRepoTopics(owner, name)`](https://github.com/ElJijuna/api-hooks/issues/29) | `gh.repo(owner, name).topics()` | `string[]` |
| [`useGhRepoContributors(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/30) | `gh.repo(owner, name).contributors(params)` | `GitHubPagedResponse<GitHubUser>` |
| [`useGhRepoIssues(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/28) | `gh.repo(owner, name).issues(params)` | `GitHubPagedResponse<GitHubIssue>` |
| [`useGhRepoPullRequests(owner, name, params?)`](https://github.com/ElJijuna/api-hooks/issues/31) | `gh.repo(owner, name).pullRequests(params)` | `GitHubPagedResponse<GitHubPullRequest>` |

## Issue hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhIssue(owner, name, number)`](https://github.com/ElJijuna/api-hooks/issues/33) | `gh.repo(owner, name).issue(number).get()` | `GitHubIssue` |
| [`useGhIssueComments(owner, name, number, params?)`](https://github.com/ElJijuna/api-hooks/issues/32) | `gh.repo(owner, name).issue(number).comments()` | `GitHubPagedResponse<GitHubIssueComment>` |

## Pull Request hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhPullRequest(owner, name, number)`](https://github.com/ElJijuna/api-hooks/issues/34) | `gh.repo(owner, name).pullRequest(number).get()` | `GitHubPullRequest` |
| [`useGhPullRequestCommits(owner, name, number, params?)`](https://github.com/ElJijuna/api-hooks/issues/35) | `gh.repo(owner, name).pullRequest(number).commits(params)` | `GitHubPagedResponse<GitHubCommit>` |
| [`useGhPullRequestFiles(owner, name, number, params?)`](https://github.com/ElJijuna/api-hooks/issues/38) | `gh.repo(owner, name).pullRequest(number).files(params)` | `GitHubPagedResponse<GitHubPullRequestFile>` |
| [`useGhPullRequestReviews(owner, name, number, params?)`](https://github.com/ElJijuna/api-hooks/issues/39) | `gh.repo(owner, name).pullRequest(number).reviews(params)` | `GitHubPagedResponse<GitHubReview>` |
| [`useGhPullRequestReviewComments(owner, name, number, params?)`](https://github.com/ElJijuna/api-hooks/issues/37) | `gh.repo(owner, name).pullRequest(number).reviewComments(params)` | `GitHubPagedResponse<GitHubReviewComment>` |

## Commit hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhCommit(owner, name, ref)`](https://github.com/ElJijuna/api-hooks/issues/36) | `gh.repo(owner, name).commit(ref).get()` | `GitHubCommit` |
| [`useGhCommitStatuses(owner, name, ref, params?)`](https://github.com/ElJijuna/api-hooks/issues/41) | `gh.repo(owner, name).commit(ref).statuses(params)` | `GitHubPagedResponse<GitHubCommitStatus>` |
| [`useGhCommitCombinedStatus(owner, name, ref)`](https://github.com/ElJijuna/api-hooks/issues/43) | `gh.repo(owner, name).commit(ref).combinedStatus()` | `GitHubCombinedStatus` |
| [`useGhCommitCheckRuns(owner, name, ref, params?)`](https://github.com/ElJijuna/api-hooks/issues/42) | `gh.repo(owner, name).commit(ref).checkRuns(params)` | `GitHubPagedResponse<GitHubCheckRun>` |

## Organization hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhOrg(name)`](https://github.com/ElJijuna/api-hooks/issues/40) | `gh.org(name).get()` | `GitHubOrganization` |
| [`useGhOrgRepos(name, params?)`](https://github.com/ElJijuna/api-hooks/issues/44) | `gh.org(name).repos(params)` | `GitHubPagedResponse<GitHubRepository>` |
| [`useGhOrgMembers(name, params?)`](https://github.com/ElJijuna/api-hooks/issues/45) | `gh.org(name).members(params)` | `GitHubPagedResponse<GitHubUser>` |

## Search hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| [`useGhSearchRepos(q, params?)`](https://github.com/ElJijuna/api-hooks/issues/46) | `gh.searchRepos({ q, ...params })` | `GitHubPagedResponse<GitHubRepository>` |

## Gist hooks — queries

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ [`useGhGists(params?)`](https://github.com/ElJijuna/api-hooks/issues/56) | `client.listGists(params?)` | `GitHubPagedResponse<GitHubGist>` |
| ✅ [`useGhGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/57) | `client.gist(gistId).get()` | `GitHubGist` |
| [`useGhGistCommits(gistId, params?)`](https://github.com/ElJijuna/api-hooks/issues/58) | `client.gist(gistId).commits(params?)` | `GitHubPagedResponse<GistCommit>` |
| [`useGhGistForks(gistId, params?)`](https://github.com/ElJijuna/api-hooks/issues/59) | `client.gist(gistId).forks(params?)` | `GitHubPagedResponse<GistFork>` |
| [`useGhGistComments(gistId, params?)`](https://github.com/ElJijuna/api-hooks/issues/60) | `client.gist(gistId).comments(params?)` | `GitHubPagedResponse<GistComment>` |
| [`useGhGistIsStarred(gistId)`](https://github.com/ElJijuna/api-hooks/issues/61) | `client.gist(gistId).isStarred()` | `boolean` |

## Gist hooks — mutations

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ [`useGhCreateGist()`](https://github.com/ElJijuna/api-hooks/issues/62) | `client.createGist(data)` | `GitHubGist` |
| ✅ [`useGhUpdateGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/63) | `client.gist(gistId).update(data)` | `GitHubGist` |
| ✅ [`useGhDeleteGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/64) | `client.gist(gistId).delete()` | `void` |
| [`useGhForkGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/65) | `client.gist(gistId).fork()` | `GitHubGist` |
| [`useGhStarGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/66) | `client.gist(gistId).star()` | `void` |
| [`useGhUnstarGist(gistId)`](https://github.com/ElJijuna/api-hooks/issues/66) | `client.gist(gistId).unstar()` | `void` |
| [`useGhAddGistComment(gistId)`](https://github.com/ElJijuna/api-hooks/issues/67) | `client.gist(gistId).addComment(data)` | `GistComment` |
| [`useGhUpdateGistComment(gistId)`](https://github.com/ElJijuna/api-hooks/issues/67) | `client.gist(gistId).updateComment(commentId, data)` | `GistComment` |
| [`useGhDeleteGistComment(gistId)`](https://github.com/ElJijuna/api-hooks/issues/67) | `client.gist(gistId).deleteComment(commentId)` | `void` |
