import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubIssue, type CreateIssueData } from 'gh-api-client';
import { useGhCreateIssue } from './useGhCreateIssue.js';

const mockCreateIssue = jest.fn<(data: CreateIssueData) => Promise<GitHubIssue>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      createIssue: mockCreateIssue,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssue = {
  id: 1,
  number: 42,
  title: 'Test issue',
  body: 'Issue body',
  state: 'open',
  html_url: 'https://github.com/owner/repo/issues/42',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  labels: [],
} as unknown as GitHubIssue;

const issueData: CreateIssueData = { title: 'Test issue', body: 'Issue body' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateIssue', () => {
  it('returns created issue on success', async () => {
    mockCreateIssue.mockResolvedValue(mockIssue);

    const { result } = renderHook(() => useGhCreateIssue('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(issueData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockIssue);
    expect(mockCreateIssue).toHaveBeenCalledWith(issueData);
  });

  it('returns error on failure', async () => {
    mockCreateIssue.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateIssue('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(issueData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateIssue('owner', 'repo'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
