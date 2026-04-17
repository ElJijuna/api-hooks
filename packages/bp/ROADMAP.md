# @api-hooks/bp — ROADMAP

Hooks built on [`bundlephobia-api-client`](https://www.npmjs.com/package/bundlephobia-api-client) + `@tanstack/react-query`.

---

## Package hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ [`useBpPackageSize(name, options?)`](https://github.com/ElJijuna/api-hooks/issues/48) | `client.package(name).size(signal?)` | `BundleSize` |
| ✅ [`useBpPackageVersionSize(name, version, options?)`](https://github.com/ElJijuna/api-hooks/issues/49) | `client.package(name).size(version, signal?)` | `BundleSize` |
| [`useBpPackageHistory(name, options?)`](https://github.com/ElJijuna/api-hooks/issues/50) | `client.package(name).history(signal?)` | `PackageHistory` |
| [`useBpPackageSimilar(name, options?)`](https://github.com/ElJijuna/api-hooks/issues/51) | `client.package(name).similar(signal?)` | `SimilarPackages` |
