## [1.10.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.9.0...@api-hooks/gh@1.10.0) (2026-05-04)

### Features

* **npm:** add package version downloads hook (closes [#81](https://github.com/ElJijuna/api-hooks/issues/81)) ([a60b2a2](https://github.com/ElJijuna/api-hooks/commit/a60b2a2f0587d59b7ceca8e8ed9320ec1c15cdd2))

## [1.9.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.8.0...@api-hooks/gh@1.9.0) (2026-04-26)

### Features

* **npm:** extract NpmClient to shared React context ([f4cfe21](https://github.com/ElJijuna/api-hooks/commit/f4cfe216fad64b1150ea38d3ead70ce8a3eebeb9)), closes [#79](https://github.com/ElJijuna/api-hooks/issues/79)

## [1.8.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.4...@api-hooks/gh@1.8.0) (2026-04-18)

### Features

* add useGhGists in @api-hooks/gh (closes [#56](https://github.com/ElJijuna/api-hooks/issues/56)) ([4d84035](https://github.com/ElJijuna/api-hooks/commit/4d84035098260a0e88b816766fae0d808611bbca))

## [1.7.4](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.3...@api-hooks/gh@1.7.4) (2026-04-18)

### Bug Fixes

* move gh-api-client to dependencies. ([ba072a3](https://github.com/ElJijuna/api-hooks/commit/ba072a314f004c6325bbcd8cceb17d9bcc883ec4))

## [1.7.3](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.2...@api-hooks/gh@1.7.3) (2026-04-18)

### Bug Fixes

* add token prop in Gist hooks to use in application, pending others hooks. ([faa2f67](https://github.com/ElJijuna/api-hooks/commit/faa2f67e4e338736950bbd72e1b6ec97221defd9))

## [1.7.2](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.1...@api-hooks/gh@1.7.2) (2026-04-18)

### Bug Fixes

* update workflow to publish api-hooks ([755ad65](https://github.com/ElJijuna/api-hooks/commit/755ad659bb80b7f811738e987a8ecbef6a659dd8))

## [1.7.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.0...@api-hooks/gh@1.7.1) (2026-04-18)

### Bug Fixes

* update main and exports in packages jsons from all packages. ([e7c3dc7](https://github.com/ElJijuna/api-hooks/commit/e7c3dc77cc979e958a6798c6216bf6ae8a36833a))

## [1.7.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.6.0...@api-hooks/gh@1.7.0) (2026-04-17)

### Features

* **@api-hooks/osv:** add osvQueryKeys factory (closes [#70](https://github.com/ElJijuna/api-hooks/issues/70)) ([0d7595f](https://github.com/ElJijuna/api-hooks/commit/0d7595fa349b534b7773896dc1ff55a3b8efa809))
* **@api-hooks/osv:** add package skeleton (closes [#69](https://github.com/ElJijuna/api-hooks/issues/69)) ([8d52bca](https://github.com/ElJijuna/api-hooks/commit/8d52bca9fa679f80e5cca18a7cdc073db1cd84c6))
* **@api-hooks/osv:** add types re-exports (closes [#74](https://github.com/ElJijuna/api-hooks/issues/74)) ([76f116b](https://github.com/ElJijuna/api-hooks/commit/76f116b4ef1cdd8c388d37556e6726a9be9484ac))
* **@api-hooks/osv:** add useOsvQuery hook (closes [#72](https://github.com/ElJijuna/api-hooks/issues/72)) ([534a2c2](https://github.com/ElJijuna/api-hooks/commit/534a2c20c20fcf934e3f8d09e13a61593c8c5ab3))
* **@api-hooks/osv:** add useOsvQueryBatch hook (closes [#73](https://github.com/ElJijuna/api-hooks/issues/73)) ([4849b88](https://github.com/ElJijuna/api-hooks/commit/4849b88f2e610a98593acc58a42b1d579f5354d5))
* **@api-hooks/osv:** add useOsvVuln hook (closes [#71](https://github.com/ElJijuna/api-hooks/issues/71)) ([b55393b](https://github.com/ElJijuna/api-hooks/commit/b55393b0959d451d077bf6b925e48f74a878e01d))

## [1.6.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.5.0...@api-hooks/gh@1.6.0) (2026-04-17)

### Features

* **@api-hooks/gh:** add useGhCreateGist mutation hook (closes [#62](https://github.com/ElJijuna/api-hooks/issues/62)) ([16b61b2](https://github.com/ElJijuna/api-hooks/commit/16b61b23572696348d767f9ac1b395734b6afa40))
* **@api-hooks/gh:** add useGhDeleteGist mutation hook (closes [#64](https://github.com/ElJijuna/api-hooks/issues/64)) ([51462ef](https://github.com/ElJijuna/api-hooks/commit/51462ef3d7d36381a30faa7699b1e6f394fadc1d))
* **@api-hooks/gh:** add useGhGist hook (closes [#57](https://github.com/ElJijuna/api-hooks/issues/57)) ([34c0421](https://github.com/ElJijuna/api-hooks/commit/34c042124c6ad9e1fb5703e72422ff6d6ce55f6f))
* **@api-hooks/gh:** add useGhUpdateGist mutation hook closes [#63](https://github.com/ElJijuna/api-hooks/issues/63) ([4f22e79](https://github.com/ElJijuna/api-hooks/commit/4f22e79edf021c99a7bb4e74bcfba19b377291e4))

### Documentation

* update README and ROADMAP. ([5e443a9](https://github.com/ElJijuna/api-hooks/commit/5e443a9d5b637b85a2070cd7dc74e4c2a94f0796))

## [1.5.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.4.0...@api-hooks/gh@1.5.0) (2026-04-17)

### Features

* add typedoc, update .gitignore and add .npmignore per package ([#55](https://github.com/ElJijuna/api-hooks/issues/55)) ([8b65d57](https://github.com/ElJijuna/api-hooks/commit/8b65d577d7afdf8a99079088c0f7347d5662e18e))

### Documentation

* add README ([8cd657c](https://github.com/ElJijuna/api-hooks/commit/8cd657c4f1c09361e3b8ae7755eac716455c5740))

## [1.4.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.3.0...@api-hooks/gh@1.4.0) (2026-04-17)

### Features

* **bp:** implement useBpPackageHistory ([#50](https://github.com/ElJijuna/api-hooks/issues/50)) ([7b3ea2c](https://github.com/ElJijuna/api-hooks/commit/7b3ea2cd083b32fa40c0509652bdbacb39bc5cfa))
* **bp:** implement useBpPackageSimilar ([#51](https://github.com/ElJijuna/api-hooks/issues/51)) ([33ea4ba](https://github.com/ElJijuna/api-hooks/commit/33ea4ba4dff96d79a0053ddac90b20fa9bdfcd25))
* **bp:** scaffold @api-hooks/bp package and implement useBpPackageSize ([#48](https://github.com/ElJijuna/api-hooks/issues/48)) ([048bf75](https://github.com/ElJijuna/api-hooks/commit/048bf75044a6ddc5bc0f86fa45af338e749dea9b))
* implement useBpPackageVersionSize ([#49](https://github.com/ElJijuna/api-hooks/issues/49)) ([9b56796](https://github.com/ElJijuna/api-hooks/commit/9b56796d793e9441dccf2932517a3c95a519ee93))

## [1.3.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.2.0...@api-hooks/gh@1.3.0) (2026-04-16)

### Features

* implement useGhUser with signal support ([#19](https://github.com/ElJijuna/api-hooks/issues/19)) ([3f82d7a](https://github.com/ElJijuna/api-hooks/commit/3f82d7a9a5e1a167d17a89b7bf4140411f9d2a22))

## [1.2.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.1.0...@api-hooks/gh@1.2.0) (2026-04-16)

### Features

* implement useNpmMaintainerPackages ([#10](https://github.com/ElJijuna/api-hooks/issues/10)) ([721005d](https://github.com/ElJijuna/api-hooks/commit/721005d10f32831430c9558fcfbf57e0b6044990))
* implement useNpmSearch — completes @api-hooks/npm ([#11](https://github.com/ElJijuna/api-hooks/issues/11)) ([019709e](https://github.com/ElJijuna/api-hooks/commit/019709e16775d5539e5e24df113c4b1c8e401871))

### Documentation

* add REAME. ([1a1bc01](https://github.com/ElJijuna/api-hooks/commit/1a1bc01b74cef019c3bdf9fcf050a89b9a056e19))

## [1.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.0.0...@api-hooks/gh@1.1.0) (2026-04-16)

### Features

* implement useNpmMaintainer ([#9](https://github.com/ElJijuna/api-hooks/issues/9)) ([14cf2f4](https://github.com/ElJijuna/api-hooks/commit/14cf2f4412022312c181591d880f05ac016397b8))

## 1.0.0 (2026-04-16)

### Features

* **npm:** implement useNpmPackage ([#1](https://github.com/ElJijuna/api-hooks/issues/1)) ([df1d5ea](https://github.com/ElJijuna/api-hooks/commit/df1d5eafd9b9c76ec6c31ffea4c27ec7bf801505))
* **npm:** implement useNpmPackageDistTags ([#5](https://github.com/ElJijuna/api-hooks/issues/5)) ([de38b25](https://github.com/ElJijuna/api-hooks/commit/de38b2594d02a22ae156a73ebff414eccbd15611))
* **npm:** implement useNpmPackageDownloadRange ([#8](https://github.com/ElJijuna/api-hooks/issues/8)) ([c9e52e6](https://github.com/ElJijuna/api-hooks/commit/c9e52e6526ad7b353b042cbcbd012f6f006a4294))
* **npm:** implement useNpmPackageDownloads ([#7](https://github.com/ElJijuna/api-hooks/issues/7)) ([465a9ae](https://github.com/ElJijuna/api-hooks/commit/465a9ae39481523389a6692ca72614b6577c487e))
* **npm:** implement useNpmPackageLatest ([#3](https://github.com/ElJijuna/api-hooks/issues/3)) ([d81769d](https://github.com/ElJijuna/api-hooks/commit/d81769d310eb01b20945dd02a1a29fabe26899bb))
* **npm:** implement useNpmPackageMaintainers ([#6](https://github.com/ElJijuna/api-hooks/issues/6)) ([3334a14](https://github.com/ElJijuna/api-hooks/commit/3334a14aca71d5ea86b4e944aa20b85e5c139b1c))
* **npm:** implement useNpmPackageVersion ([#2](https://github.com/ElJijuna/api-hooks/issues/2)) ([c7a9a75](https://github.com/ElJijuna/api-hooks/commit/c7a9a75139dfa599d77b0a71dee4463fabb838f5))
* **npm:** implement useNpmPackageVersions ([#4](https://github.com/ElJijuna/api-hooks/issues/4)) ([08020b2](https://github.com/ElJijuna/api-hooks/commit/08020b28f180e68d4e261a82d28b8d56e4453f02))
