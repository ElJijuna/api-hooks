import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  type GitHubAdvisory,
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhAdvisoriesInfinite } from './useGhAdvisoriesInfinite.js';

const mockAdvisories =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubAdvisory>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'advisories').mockImplementation(mockAdvisories);
});

const mockAdvisory = { ghsa_id: 'GHSA-1234-5678-9abc' } as unknown as GitHubAdvisory;

function makeResponse(
  hasNextPage: boolean,
  nextPage?: number,
): GitHubPagedResponse<GitHubAdvisory> {
  return { values: [mockAdvisory], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAdvisoriesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhAdvisoriesInfinite(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockAdvisories).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockAdvisories
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhAdvisoriesInfinite(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockAdvisories).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhAdvisoriesInfinite(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more pages remain', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhAdvisoriesInfinite(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes params (excluding page) to the client', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(
      () => useGhAdvisoriesInfinite({ severity: 'critical' as const, per_page: 10 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockAdvisories).toHaveBeenCalledWith(
      { severity: 'critical', per_page: 10, page: 1 },
      expect.anything(),
    );
  });

  it('returns error on failure', async () => {
    mockAdvisories.mockRejectedValue(new GitHubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useGhAdvisoriesInfinite(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhAdvisoriesInfinite(undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisories).not.toHaveBeenCalled();
  });
});
