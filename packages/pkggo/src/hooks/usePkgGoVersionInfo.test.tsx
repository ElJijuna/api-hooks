import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PkgGoApiError } from 'pkggo-api-client';
import {
  mockModule,
  mockVersion,
  mockVersionInfo,
  moduleInfo,
  modulePath,
  setupPkgGoMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { usePkgGoVersionInfo } from './usePkgGoVersionInfo.js';

beforeEach(setupPkgGoMocks);

describe('usePkgGoVersionInfo', () => {
  it('returns version info', async () => {
    mockVersionInfo.mockResolvedValue(moduleInfo);

    const { result } = renderHook(() => usePkgGoVersionInfo(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(moduleInfo);
    expect(mockModule).toHaveBeenCalledWith(modulePath);
    expect(mockVersion).toHaveBeenCalledWith(version);
  });

  it('returns API errors', async () => {
    mockVersionInfo.mockRejectedValue(new PkgGoApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePkgGoVersionInfo(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PkgGoApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => usePkgGoVersionInfo(modulePath, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => usePkgGoVersionInfo(modulePath, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockVersionInfo.mockResolvedValue(moduleInfo);
    const { result } = renderHook(
      () => usePkgGoVersionInfo(modulePath, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
