import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PkgGoApiError } from 'pkggo-api-client';
import {
  mockModule,
  mockModuleLatest,
  moduleInfo,
  modulePath,
  setupPkgGoMocks,
  wrapper,
} from '../../testUtils.js';
import { usePkgGoModuleLatest } from './usePkgGoModuleLatest.js';

beforeEach(setupPkgGoMocks);

describe('usePkgGoModuleLatest', () => {
  it('returns latest module info', async () => {
    mockModuleLatest.mockResolvedValue(moduleInfo);

    const { result } = renderHook(() => usePkgGoModuleLatest(modulePath), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(moduleInfo);
    expect(mockModule).toHaveBeenCalledWith(modulePath);
  });

  it('returns API errors', async () => {
    mockModuleLatest.mockRejectedValue(new PkgGoApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePkgGoModuleLatest(modulePath), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PkgGoApiError);
  });

  it('does not fetch when modulePath is empty', () => {
    const { result } = renderHook(() => usePkgGoModuleLatest(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePkgGoModuleLatest(modulePath, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockModuleLatest.mockResolvedValue(moduleInfo);
    const { result } = renderHook(
      () => usePkgGoModuleLatest(modulePath, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
