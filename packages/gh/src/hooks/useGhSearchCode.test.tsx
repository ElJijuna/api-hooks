import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubCodeResult, type GitHubPagedResponse } from 'gh-api-client';
import { useGhSearchCode } from './useGhSearchCode.js';

const mockSearchCode = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCodeResult>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchCode').mockImplementation(mockSearchCode);
});

const mockResult = { name: 'index.ts', path: 'src/index.ts', sha: 'abc123', url: '', html_url: '', repository: {} } as unknown as GitHubCodeResult;
const mockResponse: GitHubPagedResponse<GitHubCodeResult> = { values: [mockResult], hasNextPage: false, totalCount: 1 };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchCode', () => {
  it('returns data on success', async () => {
    mockSearchCode.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchCode({ q: 'addClass in:file' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(mockSearchCode).toHaveBeenCalledWith({ q: 'addClass in:file' }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockSearchCode.mockRejectedValue(new GitHubApiError(403, 'Forbidden'));
    const { result } = renderHook(() => useGhSearchCode({ q: 'addClass' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchCode({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchCode).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhSearchCode({ q: 'addClass' }, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchCode).not.toHaveBeenCalled();
  });
});
