import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, IssueResource, type GitHubIssue } from 'gh-api-client';
import { useGhUpdateIssue } from './useGhUpdateIssue.js';

type UpdateIssueData = Parameters<IssueResource['update']>[0];

const mockUpdate = jest.fn<(data: UpdateIssueData) => Promise<GitHubIssue>>();
const mockIssue = jest.fn().mockReturnValue({ update: mockUpdate });

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      issue: mockIssue,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockGhIssue = { id: 1, number: 42, title: 'Updated', state: 'closed', body: '', labels: [], html_url: '' } as unknown as GitHubIssue;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateIssue', () => {
  it('returns updated issue on success', async () => {
    mockUpdate.mockResolvedValue(mockGhIssue);

    const { result } = renderHook(() => useGhUpdateIssue('owner', 'repo', 42), { wrapper });

    act(() => { result.current.mutate({ state: 'closed' }); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGhIssue);
    expect(mockIssue).toHaveBeenCalledWith(42);
    expect(mockUpdate).toHaveBeenCalledWith({ state: 'closed' });
  });

  it('returns error on failure', async () => {
    mockUpdate.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateIssue('owner', 'repo', 42), { wrapper });

    act(() => { result.current.mutate({ title: 'New title' }); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateIssue('owner', 'repo', 42), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
