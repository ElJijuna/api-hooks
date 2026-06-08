import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  metadataResponse,
  mockPackage,
  mockPackageMetadata,
  packageName,
  setupPackagistMocks,
  wrapper,
} from '../../testUtils.js';
import { usePackagistPackageMetadata } from './usePackagistPackageMetadata.js';

beforeEach(setupPackagistMocks);

describe('usePackagistPackageMetadata', () => {
  it('returns package metadata', async () => {
    mockPackageMetadata.mockResolvedValue(metadataResponse);

    const params = { dev: true };
    const { result } = renderHook(() => usePackagistPackageMetadata(packageName, params), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(metadataResponse);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
    expect(mockPackageMetadata).toHaveBeenCalledWith(params, expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(
      () => usePackagistPackageMetadata(packageName, undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });
});
