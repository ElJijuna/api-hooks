import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError } from 'swiftpm-api-client';
import {
  mockPackage,
  mockPackageLatest,
  name,
  release,
  scope,
  setupSwiftPMMocks,
  wrapper,
} from '../../testUtils.js';
import { useSwiftPMPackageLatest } from './useSwiftPMPackageLatest.js';

beforeEach(setupSwiftPMMocks);

describe('useSwiftPMPackageLatest', () => {
  it('returns the latest release metadata', async () => {
    mockPackageLatest.mockResolvedValue(release);

    const { result } = renderHook(() => useSwiftPMPackageLatest(scope, name), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(release);
    expect(mockPackage).toHaveBeenCalledWith(scope, name);
  });

  it('returns API errors', async () => {
    mockPackageLatest.mockRejectedValue(new SwiftPMApiError(404, 'Not Found'));

    const { result } = renderHook(() => useSwiftPMPackageLatest(scope, name), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useSwiftPMPackageLatest(scope, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useSwiftPMPackageLatest(scope, name, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageLatest.mockResolvedValue(release);
    const { result } = renderHook(
      () => useSwiftPMPackageLatest(scope, name, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
