import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { type SwiftIdentifiersResult, SwiftPMApiError } from 'swiftpm-api-client';
import { mockLookupIdentifiers, setupSwiftPMMocks, wrapper } from '../../testUtils.js';
import { useSwiftPMLookupIdentifiers } from './useSwiftPMLookupIdentifiers.js';

beforeEach(setupSwiftPMMocks);

const repositoryURL = 'https://github.com/apple/swift-argument-parser';
const identifiersResult: SwiftIdentifiersResult = { identifiers: ['apple.swift-argument-parser'] };

describe('useSwiftPMLookupIdentifiers', () => {
  it('returns identifiers', async () => {
    mockLookupIdentifiers.mockResolvedValue(identifiersResult);

    const { result } = renderHook(() => useSwiftPMLookupIdentifiers(repositoryURL), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(identifiersResult);
    expect(mockLookupIdentifiers).toHaveBeenCalledWith(repositoryURL, expect.anything());
  });

  it('returns API errors', async () => {
    mockLookupIdentifiers.mockRejectedValue(new SwiftPMApiError(404, 'Not Found'));

    const { result } = renderHook(() => useSwiftPMLookupIdentifiers(repositoryURL), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when repositoryURL is empty', () => {
    const { result } = renderHook(() => useSwiftPMLookupIdentifiers(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockLookupIdentifiers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useSwiftPMLookupIdentifiers(repositoryURL, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockLookupIdentifiers).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockLookupIdentifiers.mockResolvedValue(identifiersResult);
    const { result } = renderHook(
      () => useSwiftPMLookupIdentifiers(repositoryURL, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
