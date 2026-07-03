import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PkgGoApiError } from 'pkggo-api-client';
import {
  mockModule,
  mockModuleVersions,
  modulePath,
  setupPkgGoMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { usePkgGoModuleVersions } from './usePkgGoModuleVersions.js';

beforeEach(setupPkgGoMocks);

describe('usePkgGoModuleVersions', () => {
  it('returns the version list', async () => {
    mockModuleVersions.mockResolvedValue([version, 'v0.36.0']);

    const { result } = renderHook(() => usePkgGoModuleVersions(modulePath), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([version, 'v0.36.0']);
    expect(mockModule).toHaveBeenCalledWith(modulePath);
  });

  it('returns API errors', async () => {
    mockModuleVersions.mockRejectedValue(new PkgGoApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePkgGoModuleVersions(modulePath), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PkgGoApiError);
  });

  it('does not fetch when modulePath is empty', () => {
    const { result } = renderHook(() => usePkgGoModuleVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePkgGoModuleVersions(modulePath, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockModuleVersions.mockResolvedValue([version]);
    const { result } = renderHook(
      () => usePkgGoModuleVersions(modulePath, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
