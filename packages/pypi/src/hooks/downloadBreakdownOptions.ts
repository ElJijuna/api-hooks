import type { PyPIDownloadParams } from 'pypi-api-client';
import type { UsePyPIQueryOptions } from './options.js';

export interface UsePyPIDownloadBreakdownOptions extends UsePyPIQueryOptions {
  params?: PyPIDownloadParams;
}
