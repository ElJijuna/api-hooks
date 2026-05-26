import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubLabel, type UpdateLabelData } from 'gh-api-client';
import { useGhUpdateLabel } from './useGhUpdateLabel.js';

const mockUpdateLabel = jest.fn<(name: string, data: UpdateLabelData) => Promise<GitHubLabel>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      updateLabel: mockUpdateLabel,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockLabel: GitHubLabel = { id: 1, name: 'bug', color: 'ee0701', description: 'Updated', url: 'https://api.github.com/repos/owner/repo/labels/bug', default: true };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateLabel', () => {
  it('returns updated label on success', async () => {
    mockUpdateLabel.mockResolvedValue(mockLabel);

    const { result } = renderHook(() => useGhUpdateLabel('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate({ name: 'bug', data: { description: 'Updated' } }); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockLabel);
    expect(mockUpdateLabel).toHaveBeenCalledWith('bug', { description: 'Updated' });
  });

  it('returns error on failure', async () => {
    mockUpdateLabel.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateLabel('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate({ name: 'bug', data: { color: 'ff0000' } }); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateLabel('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
