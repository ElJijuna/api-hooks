import type {
  MetadataChangesOptions,
  MetadataOptions,
  PackageListOptions,
  PackageName,
  PopularPackagesOptions,
  SearchPackagesOptions,
  SecurityAdvisoriesOptions,
} from 'php-packagist-api-client';

export const packagistQueryKeys = {
  listPackages: (options?: PackageListOptions) => ['packagist', 'listPackages', options] as const,
  popular: (options?: PopularPackagesOptions) => ['packagist', 'popular', options] as const,
  search: (options: SearchPackagesOptions) => ['packagist', 'search', options] as const,
  package: (name: PackageName | string) => ['packagist', 'package', name] as const,
  packageMetadata: (name: PackageName | string, options?: MetadataOptions) =>
    ['packagist', 'packageMetadata', name, options] as const,
  packageStats: (name: PackageName | string) => ['packagist', 'packageStats', name] as const,
  packageSecurityAdvisories: (name: PackageName | string) =>
    ['packagist', 'packageSecurityAdvisories', name] as const,
  metadataChanges: (options?: MetadataChangesOptions) =>
    ['packagist', 'metadataChanges', options] as const,
  statistics: () => ['packagist', 'statistics'] as const,
  securityAdvisories: (options: SecurityAdvisoriesOptions) =>
    ['packagist', 'securityAdvisories', options] as const,
} as const;
