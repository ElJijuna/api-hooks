import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { CratesApiError } from 'crates-api-client';
import {
  crateName,
  crateVersion,
  mockCrate,
  mockCrateVersions,
  setupCratesMocks,
  wrapper,
} from '../../testUtils.js';
import { useCratesCrateVersions } from './useCratesCrateVersions.js';

beforeEach(setupCratesMocks);

describe('useCratesCrateVersions', () => {
  it('returns the version list', async () => {
    mockCrateVersions.mockResolvedValue([crateVersion]);

    const { result } = renderHook(() => useCratesCrateVersions(crateName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([crateVersion]);
    expect(mockCrate).toHaveBeenCalledWith(crateName);
  });

  it('returns API errors', async () => {
    mockCrateVersions.mockRejectedValue(new CratesApiError(404, 'Not Found'));

    const { result } = renderHook(() => useCratesCrateVersions(crateName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(CratesApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useCratesCrateVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useCratesCrateVersions(crateName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockCrateVersions.mockResolvedValue([crateVersion]);
    const { result } = renderHook(
      () => useCratesCrateVersions(crateName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
