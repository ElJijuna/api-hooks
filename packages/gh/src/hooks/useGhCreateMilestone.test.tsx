import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type CreateMilestoneData,
  GitHubApiError,
  GitHubClient,
  type GitHubMilestone,
} from 'gh-api-client';
import { useGhCreateMilestone } from './useGhCreateMilestone.js';

const mockCreateMilestone = jest.fn<(data: CreateMilestoneData) => Promise<GitHubMilestone>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createMilestone: mockCreateMilestone,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockMilestone = {
  id: 1,
  number: 1,
  title: 'v1.0',
  state: 'open',
  description: null,
  due_on: null,
  open_issues: 0,
  closed_issues: 0,
} as unknown as GitHubMilestone;

const milestoneData: CreateMilestoneData = { title: 'v1.0' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateMilestone', () => {
  it('returns created milestone on success', async () => {
    mockCreateMilestone.mockResolvedValue(mockMilestone);

    const { result } = renderHook(() => useGhCreateMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(milestoneData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMilestone);
    expect(mockCreateMilestone).toHaveBeenCalledWith(milestoneData);
  });

  it('returns error on failure', async () => {
    mockCreateMilestone.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(milestoneData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateMilestone('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
