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
import { useGhAdvisories } from './useGhAdvisories.js';

const mockAdvisories =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubAdvisory>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'advisories').mockImplementation(mockAdvisories);
});

const mockAdvisory = {
  ghsa_id: 'GHSA-1234-5678-9abc',
  cve_id: 'CVE-2021-44228',
} as unknown as GitHubAdvisory;
const mockResponse: GitHubPagedResponse<GitHubAdvisory> = {
  values: [mockAdvisory],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAdvisories', () => {
  it('returns data on success', async () => {
    mockAdvisories.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhAdvisories(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockAdvisories).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockAdvisories.mockResolvedValue(mockResponse);

    const params = { severity: 'critical' as const, per_page: 10 };
    const { result } = renderHook(() => useGhAdvisories(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockAdvisories).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockAdvisories.mockRejectedValue(new GitHubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useGhAdvisories(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhAdvisories(undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisories).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockAdvisories.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhAdvisories({ queryOptions: { staleTime: 0 } }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
