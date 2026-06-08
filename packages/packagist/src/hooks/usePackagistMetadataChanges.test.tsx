import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  metadataChangesResponse,
  mockMetadataChanges,
  setupPackagistMocks,
  wrapper,
} from '../../testUtils.js';
import { usePackagistMetadataChanges } from './usePackagistMetadataChanges.js';

beforeEach(setupPackagistMocks);

describe('usePackagistMetadataChanges', () => {
  it('returns metadata changes', async () => {
    mockMetadataChanges.mockResolvedValue(metadataChangesResponse);

    const params = { since: 1_700_000_000 };
    const { result } = renderHook(() => usePackagistMetadataChanges(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(metadataChangesResponse);
    expect(mockMetadataChanges).toHaveBeenCalledWith(params, expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => usePackagistMetadataChanges(undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockMetadataChanges).not.toHaveBeenCalled();
  });
});
