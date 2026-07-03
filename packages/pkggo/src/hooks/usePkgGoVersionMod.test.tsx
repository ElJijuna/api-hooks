import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PkgGoApiError } from 'pkggo-api-client';
import {
  mockModule,
  mockVersion,
  mockVersionMod,
  modulePath,
  setupPkgGoMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { usePkgGoVersionMod } from './usePkgGoVersionMod.js';

beforeEach(setupPkgGoMocks);

const modContents = 'module golang.org/x/mod\n\ngo 1.21\n';

describe('usePkgGoVersionMod', () => {
  it('returns go.mod contents', async () => {
    mockVersionMod.mockResolvedValue(modContents);

    const { result } = renderHook(() => usePkgGoVersionMod(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(modContents);
    expect(mockModule).toHaveBeenCalledWith(modulePath);
    expect(mockVersion).toHaveBeenCalledWith(version);
  });

  it('returns API errors', async () => {
    mockVersionMod.mockRejectedValue(new PkgGoApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePkgGoVersionMod(modulePath, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PkgGoApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => usePkgGoVersionMod(modulePath, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => usePkgGoVersionMod(modulePath, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockModule).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockVersionMod.mockResolvedValue(modContents);
    const { result } = renderHook(
      () => usePkgGoVersionMod(modulePath, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
