import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError } from 'swiftpm-api-client';
import {
  mockPackage,
  mockPackageManifest,
  name,
  scope,
  setupSwiftPMMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useSwiftPMPackageManifest } from './useSwiftPMPackageManifest.js';

beforeEach(setupSwiftPMMocks);

const manifest = 'let package = Package(name: "swift-argument-parser")';

describe('useSwiftPMPackageManifest', () => {
  it('returns manifest contents', async () => {
    mockPackageManifest.mockResolvedValue(manifest);

    const { result } = renderHook(() => useSwiftPMPackageManifest(scope, name, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(manifest);
    expect(mockPackage).toHaveBeenCalledWith(scope, name);
    expect(mockPackageManifest).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageManifest.mockRejectedValue(new SwiftPMApiError(404, 'Not Found'));

    const { result } = renderHook(() => useSwiftPMPackageManifest(scope, name, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useSwiftPMPackageManifest(scope, name, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useSwiftPMPackageManifest(scope, name, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageManifest.mockResolvedValue(manifest);
    const { result } = renderHook(
      () => useSwiftPMPackageManifest(scope, name, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
