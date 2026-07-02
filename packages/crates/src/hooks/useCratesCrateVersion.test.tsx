import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { CratesApiError } from 'crates-api-client';
import {
  crateName,
  crateVersion,
  mockCrate,
  mockCrateVersion,
  setupCratesMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useCratesCrateVersion } from './useCratesCrateVersion.js';

beforeEach(setupCratesMocks);

describe('useCratesCrateVersion', () => {
  it('returns version metadata', async () => {
    mockCrateVersion.mockResolvedValue(crateVersion);

    const { result } = renderHook(() => useCratesCrateVersion(crateName, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(crateVersion);
    expect(mockCrate).toHaveBeenCalledWith(crateName);
    expect(mockCrateVersion).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockCrateVersion.mockRejectedValue(new CratesApiError(404, 'Not Found'));

    const { result } = renderHook(() => useCratesCrateVersion(crateName, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(CratesApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useCratesCrateVersion(crateName, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useCratesCrateVersion(crateName, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockCrateVersion.mockResolvedValue(crateVersion);
    const { result } = renderHook(
      () => useCratesCrateVersion(crateName, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
