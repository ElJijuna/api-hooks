# ROADMAP — api-hooks

Collection of React hooks built on `@tanstack/react-query` for consuming public APIs.

**Packages**
| Package | Source client | Status |
|---|---|---|
| `@api-hooks/npm` | `npmjs-api-client@^1.2.0` | skeleton |
| `@api-hooks/gh` | `gh-api-client` | skeleton |

---

## Phase 0 — Project setup

- [x] Init git repo + LICENSE
- [x] Root `package.json` with npm workspaces (`packages/*`)
- [x] `tsconfig.base.json` (strict, composite, ESNext/bundler)
- [x] `jest.config.base.ts` (SWC transformer, jsdom, coverage thresholds)
- [x] `.gitignore`
- [x] `.github/workflows/ci.yml` (typecheck → test → build, Node 20 & 22)
- [x] `.github/workflows/release.yml` (publish on `v*` tag)
- [x] `packages/npm` skeleton (package.json / tsconfig / vite.config / jest.config / src stubs)
- [x] `packages/gh` skeleton (package.json / tsconfig / vite.config / jest.config / src stubs)
- [x] `npm install` — workspace links resueltos correctamente
- [x] Versiones confirmadas: `npmjs-api-client@1.2.0` / `gh-api-client@1.2.0`
- [ ] Commit initial structure

---

## Phase 1 — @api-hooks/npm

> Depends on: `npmjs-api-client@^1.2.0` + `@tanstack/react-query ^5`

### 1.1 Query key factory

- [ ] `src/keys/npmQueryKeys.ts` — structured key factory for all npm queries
  ```
  npmKeys.package(name)
  npmKeys.packageVersion(name, version)
  npmKeys.search(query, options)
  npmKeys.downloads(name, period)
  npmKeys.downloadsRange(name, start, end)
  ```

### 1.2 Hooks

| Método del cliente | Retorna | Hook |
|---|---|---|
| `npm.package(name)` | `NpmPackument` | `useNpmPackage(name)` |
| `npm.package(name).version(ver)` | `NpmPackageVersion` | `useNpmPackageVersion(name, version)` |
| `npm.package(name).latest()` | `NpmPackageVersion` | `useNpmPackageLatest(name)` |
| `npm.package(name).versions()` | `NpmPackageVersion[]` | `useNpmPackageVersions(name)` |
| `npm.package(name).maintainers()` | `NpmPerson[]` | `useNpmPackageMaintainers(name)` |
| `npm.package(name).distTags()` | `NpmDistTags` | `useNpmDistTags(name)` |
| `npm.package(name).downloads(period?)` | `NpmDownloadPoint` | `useNpmDownloads(name, period?)` |
| `npm.package(name).downloadRange(period?)` | `NpmDownloadRange` | `useNpmDownloadRange(name, period?)` |
| `npm.search(params)` | `NpmSearchResult` | `useNpmSearch(params)` |
| `npm.maintainer(username).info()` | `NpmUser` | `useNpmMaintainer(username)` |
| `npm.maintainer(username).packages(params?)` | `NpmSearchResult` | `useNpmMaintainerPackages(username, params?)` |

- [ ] Implementar cada hook de la tabla (uno por archivo en `src/hooks/`)

### 1.3 Types

- [ ] `src/types.ts` — hook-specific option types (extend / re-export from `npmjs-api-client`)

### 1.4 Tests

- [ ] Unit tests for each hook using `@testing-library/react` + mock `npmjs-api-client`
- [ ] Coverage ≥ 80% (branches, functions, lines, statements)

### 1.5 Build

- [ ] `vite build` — ESM con `preserveModules`, un archivo por hook (tree-shakeable)
- [ ] `dist/index.d.ts` declaration file present
- [ ] `npm run typecheck` passes with zero errors

---

## Phase 2 — @api-hooks/gh

> Depends on: `gh-api-client` + `@tanstack/react-query ^5`
> `GitHubClient` requiere `token` — decidir estrategia de auth antes de implementar hooks.

### 2.1 Auth

- [ ] **DECISIÓN:** estrategia de auth — token por context provider vs prop por hook
  - Opción A — context provider: `src/context/GhClientProvider.tsx` provee instancia de `GitHubClient`
  - Opción B — prop por hook: cada hook recibe `{ token }` y crea su propio cliente
- [ ] Implementar según decisión anterior

### 2.2 Query key factory

- [ ] `src/keys/ghQueryKeys.ts` — structured key factory para todos los recursos

### 2.3 Hooks — queries

#### `gh.currentUser()` / `gh.user(login)` / `gh.org(name)`

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.currentUser()` | `GitHubUser` | `useGhCurrentUser()` |
| `gh.user(login)` | `GitHubUser` | `useGhUser(login)` |
| `gh.user(login).repos(params?)` | `Paged<GitHubRepository>` | `useGhUserRepos(login, params?)` |
| `gh.user(login).following(params?)` | `Paged<GitHubUser>` | `useGhUserFollowing(login, params?)` |
| `gh.user(login).followers(params?)` | `Paged<GitHubUser>` | `useGhUserFollowers(login, params?)` |
| `gh.org(name)` | `GitHubOrganization` | `useGhOrg(name)` |
| `gh.org(name).repos(params?)` | `Paged<GitHubRepository>` | `useGhOrgRepos(name, params?)` |
| `gh.org(name).members(params?)` | `Paged<GitHubUser>` | `useGhOrgMembers(name, params?)` |

#### `gh.repo(owner, name)` — repositorio

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.repo(owner, name)` | `GitHubRepository` | `useGhRepo(owner, name)` |
| `gh.repo(owner, name).branches(params?)` | `Paged<GitHubBranch>` | `useGhBranches(owner, name, params?)` |
| `gh.repo(owner, name).branch(branch)` | `GitHubBranch` | `useGhBranch(owner, name, branch)` |
| `gh.repo(owner, name).tags(params?)` | `Paged<GitHubTag>` | `useGhTags(owner, name, params?)` |
| `gh.repo(owner, name).topics()` | `string[]` | `useGhTopics(owner, name)` |
| `gh.repo(owner, name).contributors(params?)` | `Paged<Contributor>` | `useGhContributors(owner, name, params?)` |
| `gh.repo(owner, name).forks(params?)` | `Paged<GitHubRepository>` | `useGhForks(owner, name, params?)` |
| `gh.repo(owner, name).contents(path?, params?)` | `GitHubContent \| GitHubContent[]` | `useGhContents(owner, name, path?, params?)` |
| `gh.repo(owner, name).raw(filePath, params?)` | `string` | `useGhRaw(owner, name, filePath, params?)` |
| `gh.repo(owner, name).webhooks(params?)` | `Paged<GitHubWebhook>` | `useGhWebhooks(owner, name, params?)` |

#### `gh.repo(owner, name)` — releases

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.repo(owner, name).releases(params?)` | `Paged<GitHubRelease>` | `useGhReleases(owner, name, params?)` |
| `gh.repo(owner, name).latestRelease()` | `GitHubRelease` | `useGhLatestRelease(owner, name)` |

#### `gh.repo(owner, name)` — issues

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.repo(owner, name).issues(params?)` | `Paged<GitHubIssue>` | `useGhIssues(owner, name, params?)` |
| `gh.repo(owner, name).issue(number)` | `GitHubIssue` | `useGhIssue(owner, name, number)` |
| `gh.repo(owner, name).issue(number).comments(params?)` | `Paged<GitHubIssueComment>` | `useGhIssueComments(owner, name, number, params?)` |

#### `gh.repo(owner, name)` — pull requests

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.repo(owner, name).pullRequests(params?)` | `Paged<GitHubPullRequest>` | `useGhPullRequests(owner, name, params?)` |
| `gh.repo(owner, name).pullRequest(number)` | `GitHubPullRequest` | `useGhPullRequest(owner, name, number)` |
| `gh.repo(owner, name).pullRequest(number).commits(params?)` | `Paged<GitHubCommit>` | `useGhPullRequestCommits(owner, name, number, params?)` |
| `gh.repo(owner, name).pullRequest(number).files(params?)` | `Paged<GitHubPullRequestFile>` | `useGhPullRequestFiles(owner, name, number, params?)` |
| `gh.repo(owner, name).pullRequest(number).reviews(params?)` | `Paged<GitHubReview>` | `useGhPullRequestReviews(owner, name, number, params?)` |
| `gh.repo(owner, name).pullRequest(number).reviewComments(params?)` | `Paged<GitHubReviewComment>` | `useGhPullRequestReviewComments(owner, name, number, params?)` |
| `gh.repo(owner, name).pullRequest(number).isMerged()` | `boolean` | `useGhPullRequestIsMerged(owner, name, number)` |

#### `gh.repo(owner, name)` — commits

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.repo(owner, name).commits(params?)` | `Paged<GitHubCommit>` | `useGhCommits(owner, name, params?)` |
| `gh.repo(owner, name).commit(ref)` | `GitHubCommit` | `useGhCommit(owner, name, ref)` |
| `gh.repo(owner, name).commit(ref).statuses(params?)` | `Paged<GitHubCommitStatus>` | `useGhCommitStatuses(owner, name, ref, params?)` |
| `gh.repo(owner, name).commit(ref).combinedStatus()` | `GitHubCombinedStatus` | `useGhCommitCombinedStatus(owner, name, ref)` |
| `gh.repo(owner, name).commit(ref).checkRuns(params?)` | `Paged<GitHubCheckRun>` | `useGhCommitCheckRuns(owner, name, ref, params?)` |

#### Search

| Método del cliente | Retorna | Hook |
|---|---|---|
| `gh.searchRepos(params)` | `Paged<GitHubRepository>` | `useGhSearchRepos(params)` |

### 2.4 Hooks — mutations (`useMutation`)

| Método del cliente | Hook |
|---|---|
| `gh.org(name).createRepo(data)` | `useGhCreateOrgRepo(name)` |
| `gh.repo(owner, name).createFork(data?)` | `useGhCreateFork(owner, name)` |
| `gh.repo(owner, name).createIssue(data)` | `useGhCreateIssue(owner, name)` |
| `gh.repo(owner, name).createWebhook(data)` | `useGhCreateWebhook(owner, name)` |
| `gh.repo(owner, name).updateWebhook(hookId, data)` | `useGhUpdateWebhook(owner, name)` |
| `gh.repo(owner, name).deleteWebhook(hookId)` | `useGhDeleteWebhook(owner, name)` |

- [ ] Implementar cada hook de queries (uno por archivo en `src/hooks/`)
- [ ] Implementar cada hook de mutations

### 2.5 Types

- [ ] `src/types.ts` — hook-specific option types (re-export desde `gh-api-client`)

### 2.6 Tests

- [ ] Unit tests para cada hook, mock `gh-api-client`
- [ ] Coverage ≥ 80%

### 2.7 Build

- [ ] `vite build` — ESM con `preserveModules`, un archivo por hook
- [ ] `npm run typecheck` sin errores

---

## Phase 3 — CI hardening & DX

- [ ] Add `publint` to validate package exports before publish
- [ ] Add `@arethetypeswrong/cli` to verify dual CJS/ESM type resolution
- [ ] Add `size-limit` to track bundle size per package
- [ ] Lint with `eslint` + `typescript-eslint` flat config at root level
- [ ] Prettier config at root level
- [ ] Pre-commit hooks via `simple-git-hooks` + `lint-staged`
- [ ] Add `CONTRIBUTING.md` with workspace setup instructions

---

## Phase 4 — Release

- [ ] Choose versioning strategy: independent vs fixed (recommend independent)
- [ ] Set up `changesets` for changelog generation
- [ ] Configure `NPM_TOKEN` secret in GitHub repo settings
- [ ] Tag `v0.1.0` and verify release workflow publishes both packages
- [ ] Add npm badges to README

---

## Backlog / Future packages

> New packages follow the same skeleton: package.json / tsconfig / vite.config / jest.config / src stubs

| Idea | Notes |
|---|---|
| `@api-hooks/github-search` | dedicated search hooks (repos, code, users) |
| `@api-hooks/npm-bulk` | parallel queries for multiple packages |
| Storybook playground | interactive hook explorer for all packages |
