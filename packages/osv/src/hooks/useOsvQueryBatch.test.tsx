import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OsvClient, OsvApiError, type OsvBatchQuery, type OsvBatchQueryResult } from 'osv-api-client';
import { useOsvQueryBatch } from './useOsvQueryBatch.js';

const mockQueryBatch = jest.fn<() => Promise<OsvBatchQueryResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(OsvClient.prototype, 'queryBatch').mockImplementation(mockQueryBatch);
});

const queries: OsvBatchQuery[] = [
  { package: { name: 'lodash', ecosystem: 'npm' }, version: '4.17.20' },
  { package: { name: 'express', ecosystem: 'npm' }, version: '4.18.0' },
];

const mockResult: OsvBatchQueryResult = {
  results: [
    { vulns: [{ id: 'GHSA-jfh8-c2jp-hdp8', published: '2021-01-01T00:00:00Z', modified: '2023-01-01T00:00:00Z' }] },
    { vulns: [] },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useOsvQueryBatch', () => {
  it('returns data on success', async () => {
    mockQueryBatch.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useOsvQueryBatch(queries), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockQueryBatch.mockRejectedValue(new OsvApiError(400, 'Bad Request'));

    const { result } = renderHook(() => useOsvQueryBatch(queries), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(OsvApiError);
  });

  it('does not fetch when queries is empty', () => {
    const { result } = renderHook(() => useOsvQueryBatch([]), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockQueryBatch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useOsvQueryBatch(queries, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockQueryBatch).not.toHaveBeenCalled();
  });
});
