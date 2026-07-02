# api-hooks

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

A collection of React hooks for popular APIs, built on [`@tanstack/react-query`](https://tanstack.com/query).

[![CI](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Packages

| Package | Summary | Links |
| ------- | ------- | ----- |
| [`@api-hooks/npm`](packages/npm#readme) | React hooks for npm registry packages, versions, downloads, scores, maintainers, orgs, users, search, and audit workflows. | [README](packages/npm#readme) · [Changelog](packages/npm/CHANGELOG.md) |
| [`@api-hooks/gh`](packages/gh#readme) | React hooks for GitHub REST API resources, including users, repos, issues, pull requests, commits, releases, workflows, gists, advisories, and mutations. | [README](packages/gh#readme) · [Changelog](packages/gh/CHANGELOG.md) |
| [`@api-hooks/bp`](packages/bp#readme) | React hooks for Bundlephobia package size, version size, history, and similar-package insights. | [README](packages/bp#readme) · [Changelog](packages/bp/CHANGELOG.md) |
| [`@api-hooks/osv`](packages/osv#readme) | React hooks for OSV vulnerability lookups, single-package queries, and batch vulnerability queries. | [README](packages/osv#readme) · [Changelog](packages/osv/CHANGELOG.md) |
| [`@api-hooks/dh`](packages/dh#readme) | React hooks for Docker Hub repositories, tags, users, organizations, search, infinite pagination, and login. | [README](packages/dh#readme) · [Changelog](packages/dh/CHANGELOG.md) |
| [`@api-hooks/pypi`](packages/pypi#readme) | React hooks for PyPI project metadata, releases, versions, files, vulnerabilities, downloads, and dependency graphs. | [README](packages/pypi#readme) · [Changelog](packages/pypi/CHANGELOG.md) |
| [`@api-hooks/packagist`](packages/packagist#readme) | React hooks for Packagist package search, lists, metadata, stats, advisories, global statistics, and authenticated package mutations. | [README](packages/packagist#readme) · [Changelog](packages/packagist/CHANGELOG.md) |
| [`@api-hooks/maven`](packages/maven#readme) | React hooks for Maven Central artifact search, suggestions, and version metadata, with infinite pagination. | [README](packages/maven#readme) · [Changelog](packages/maven/CHANGELOG.md) |

## Requirements

All packages require the following peer dependencies:

| Peer dependency | Version |
| --------------- | ------- |
| `react` | `>=19.0.0` |
| `@tanstack/react-query` | `^5.0.0` |

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
