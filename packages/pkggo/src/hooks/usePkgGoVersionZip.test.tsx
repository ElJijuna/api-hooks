import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PkgGoApiError } from 'pkggo-api-client';
import {
  mockModule,
  mockVersion,
  mockVersionZip,
  modulePath,
  setupPkgGoMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { usePkgGoVersionZip } from './usePkgGoVersionZip.js';

beforeEach(setupPkgGoMocks);

const zipBytes = new ArrayBuffer(8);

describe('usePkgGoVersionZip', () => {
  it('returns zip archive bytes', async () => {
    mockVersionZip.mockResolvedValue(zipBytes);

    const { result } = renderHook(() => usePkgGoVersionZip(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(zipBytes);
    expect(mockModule).toHaveBeenCalledWith(modulePath);
    expect(mockVersion).toHaveBeenCalledWith(version);
  });

  it('returns API errors', async () => {
    mockVersionZip.mockRejectedValue(new PkgGoApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePkgGoVersionZip(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PkgGoApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => usePkgGoVersionZip(modulePath, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => usePkgGoVersionZip(modulePath, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockVersionZip.mockResolvedValue(zipBytes);
    const { result } = renderHook(
      () => usePkgGoVersionZip(modulePath, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
