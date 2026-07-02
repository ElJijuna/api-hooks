import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError, type NuGetAutocompleteResult } from 'nuget-api-client';
import { mockAutocomplete, setupNuGetMocks, wrapper } from '../../testUtils.js';
import { useNuGetAutocomplete } from './useNuGetAutocomplete.js';

beforeEach(setupNuGetMocks);

const autocompleteResult: NuGetAutocompleteResult = {
  totalHits: 2,
  data: ['Newtonsoft.Json', 'Newtonsoft.Json.Bson'],
};

describe('useNuGetAutocomplete', () => {
  it('returns suggestions', async () => {
    mockAutocomplete.mockResolvedValue(autocompleteResult);

    const { result } = renderHook(() => useNuGetAutocomplete({ q: 'Newtonsoft' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(autocompleteResult);
    expect(mockAutocomplete).toHaveBeenCalledWith({ q: 'Newtonsoft' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockAutocomplete.mockRejectedValue(new NuGetApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNuGetAutocomplete({ q: 'Newtonsoft' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNuGetAutocomplete({ q: 'Newtonsoft' }, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockAutocomplete).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockAutocomplete.mockResolvedValue(autocompleteResult);
    const { result } = renderHook(
      () => useNuGetAutocomplete({ q: 'Newtonsoft' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
