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
- [ ] `npm install` — verify workspace links resolve correctly
- [ ] Confirm `npmjs-api-client@1.2.0` and `gh-api-client@1.2.0` types are available
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

- [ ] `vite build` produces `dist/index.js` (ESM) + `dist/index.cjs` (CJS)
- [ ] `dist/index.d.ts` declaration file present
- [ ] `npm run typecheck` passes with zero errors

---

## Phase 2 — @api-hooks/gh

> Depends on: `gh-api-client` + `@tanstack/react-query ^5`

### 2.1 Confirm gh-api-client version

- [ ] Verify exact version of `gh-api-client` and pin it in `package.json`
- [ ] Review available methods and map them to hooks

### 2.2 Query key factory

- [ ] `src/keys/ghQueryKeys.ts` — structured key factory
  ```
  ghKeys.user(login)
  ghKeys.repo(owner, repo)
  ghKeys.repos(owner, options)
  ghKeys.issues(owner, repo, options)
  ghKeys.pullRequests(owner, repo, options)
  ghKeys.releases(owner, repo)
  ghKeys.release(owner, repo, tag)
  ```

### 2.3 Hooks

- [ ] `src/hooks/useGhUser.ts` — GitHub user profile
- [ ] `src/hooks/useGhRepo.ts` — single repository metadata
- [ ] `src/hooks/useGhRepos.ts` — list repos for a user/org
- [ ] `src/hooks/useGhIssues.ts` — list issues with filters
- [ ] `src/hooks/useGhPullRequests.ts` — list pull requests with filters
- [ ] `src/hooks/useGhReleases.ts` — list releases
- [ ] `src/hooks/useGhRelease.ts` — single release by tag

### 2.4 Auth support

- [ ] Decide auth strategy: token passed via hook options vs context provider
- [ ] If context: `src/context/GhAuthProvider.tsx`

### 2.5 Types

- [ ] `src/types.ts` — hook-specific option types

### 2.6 Tests

- [ ] Unit tests for each hook, mock `gh-api-client`
- [ ] Coverage ≥ 80%

### 2.7 Build

- [ ] Same dual ESM/CJS output as `@api-hooks/npm`

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
