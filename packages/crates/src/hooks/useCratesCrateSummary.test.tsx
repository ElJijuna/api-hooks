import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { type CrateResult, CratesApiError } from 'crates-api-client';
import {
  crateName,
  crateSummary,
  crateVersion,
  mockCrate,
  mockCrateSummary,
  setupCratesMocks,
  wrapper,
} from '../../testUtils.js';
import { useCratesCrateSummary } from './useCratesCrateSummary.js';

beforeEach(setupCratesMocks);

const summaryResult: CrateResult = {
  crate: crateSummary,
  versions: [crateVersion],
  keywords: [],
  categories: [],
};

describe('useCratesCrateSummary', () => {
  it('returns crate summary', async () => {
    mockCrateSummary.mockResolvedValue(summaryResult);

    const { result } = renderHook(() => useCratesCrateSummary(crateName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(summaryResult);
    expect(mockCrate).toHaveBeenCalledWith(crateName);
  });

  it('returns API errors', async () => {
    mockCrateSummary.mockRejectedValue(new CratesApiError(404, 'Not Found'));

    const { result } = renderHook(() => useCratesCrateSummary(crateName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(CratesApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useCratesCrateSummary(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useCratesCrateSummary(crateName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockCrate).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockCrateSummary.mockResolvedValue(summaryResult);
    const { result } = renderHook(
      () => useCratesCrateSummary(crateName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
