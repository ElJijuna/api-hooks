import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError } from 'swiftpm-api-client';
import {
  mockPackage,
  mockPackageRelease,
  name,
  release,
  scope,
  setupSwiftPMMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useSwiftPMPackageRelease } from './useSwiftPMPackageRelease.js';

beforeEach(setupSwiftPMMocks);

describe('useSwiftPMPackageRelease', () => {
  it('returns release metadata', async () => {
    mockPackageRelease.mockResolvedValue(release);

    const { result } = renderHook(() => useSwiftPMPackageRelease(scope, name, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(release);
    expect(mockPackage).toHaveBeenCalledWith(scope, name);
    expect(mockPackageRelease).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageRelease.mockRejectedValue(new SwiftPMApiError(404, 'Not Found'));

    const { result } = renderHook(() => useSwiftPMPackageRelease(scope, name, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useSwiftPMPackageRelease(scope, name, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useSwiftPMPackageRelease(scope, name, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageRelease.mockResolvedValue(release);
    const { result } = renderHook(
      () => useSwiftPMPackageRelease(scope, name, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
