import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubCodeResult,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhSearchCodeInfinite } from './useGhSearchCodeInfinite.js';

const mockSearchCode =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCodeResult>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchCode').mockImplementation(mockSearchCode);
});

const mockResult = {
  name: 'index.ts',
  path: 'src/index.ts',
  sha: 'abc123',
  url: '',
  html_url: '',
  repository: {},
} as unknown as GitHubCodeResult;
const mockResponse: GitHubPagedResponse<GitHubCodeResult> = {
  values: [mockResult],
  hasNextPage: false,
  totalCount: 1,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchCodeInfinite', () => {
  it('returns data on success', async () => {
    mockSearchCode.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchCodeInfinite({ q: 'addClass in:file' }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
  });

  it('returns error on failure', async () => {
    mockSearchCode.mockRejectedValue(new GitHubApiError(403, 'Forbidden'));
    const { result } = renderHook(() => useGhSearchCodeInfinite({ q: 'addClass' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchCodeInfinite({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchCode).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhSearchCodeInfinite({ q: 'addClass' }, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchCode).not.toHaveBeenCalled();
  });
});
