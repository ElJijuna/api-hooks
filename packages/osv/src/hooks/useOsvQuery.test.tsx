import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OsvClient, OsvApiError, type OsvQueryParams, type OsvQueryResult } from 'osv-api-client';
import { useOsvQuery } from './useOsvQuery.js';

const mockQuery = jest.fn<() => Promise<OsvQueryResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(OsvClient.prototype, 'query').mockImplementation(mockQuery);
});

const params: OsvQueryParams = {
  package: { name: 'lodash', ecosystem: 'npm' },
  version: '4.17.20',
};

const mockResult: OsvQueryResult = {
  vulns: [
    { id: 'GHSA-jfh8-c2jp-hdp8', published: '2021-01-01T00:00:00Z', modified: '2023-01-01T00:00:00Z' },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useOsvQuery', () => {
  it('returns data on success', async () => {
    mockQuery.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useOsvQuery(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockQuery.mockRejectedValue(new OsvApiError(400, 'Bad Request'));

    const { result } = renderHook(() => useOsvQuery(params), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(OsvApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useOsvQuery(params, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
