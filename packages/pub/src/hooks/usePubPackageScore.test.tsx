import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError, type PubPackageScore } from 'pub-api-client';
import {
  mockPackage,
  mockPackageScore,
  packageName,
  setupPubMocks,
  wrapper,
} from '../../testUtils.js';
import { usePubPackageScore } from './usePubPackageScore.js';

beforeEach(setupPubMocks);

const score: PubPackageScore = {
  grantedPoints: 140,
  maxPoints: 150,
  likeCount: 4500,
  popularityScore: 0.99,
  lastUpdated: '2024-09-01T00:00:00Z',
};

describe('usePubPackageScore', () => {
  it('returns score data', async () => {
    mockPackageScore.mockResolvedValue(score);

    const { result } = renderHook(() => usePubPackageScore(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(score);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageScore.mockRejectedValue(new PubApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePubPackageScore(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePubPackageScore(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubPackageScore(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageScore.mockResolvedValue(score);
    const { result } = renderHook(
      () => usePubPackageScore(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
