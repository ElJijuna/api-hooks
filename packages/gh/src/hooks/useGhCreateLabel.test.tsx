import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type CreateLabelData,
  GitHubApiError,
  GitHubClient,
  type GitHubLabel,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCreateLabel } from './useGhCreateLabel.js';

const mockCreateLabel = jest.fn<(data: CreateLabelData) => Promise<GitHubLabel>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createLabel: mockCreateLabel,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockLabel: GitHubLabel = {
  id: 1,
  name: 'bug',
  color: 'ee0701',
  description: 'Something is broken',
  url: 'https://api.github.com/repos/owner/repo/labels/bug',
  default: true,
};

const labelData: CreateLabelData = {
  name: 'bug',
  color: 'ee0701',
  description: 'Something is broken',
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateLabel', () => {
  it('returns created label on success', async () => {
    mockCreateLabel.mockResolvedValue(mockLabel);

    const { result } = renderHook(() => useGhCreateLabel('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(labelData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockLabel);
    expect(mockCreateLabel).toHaveBeenCalledWith(labelData);
  });

  it('returns error on failure', async () => {
    mockCreateLabel.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateLabel('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(labelData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateLabel('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockCreateLabel.mockResolvedValue(mockLabel);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhCreateLabel('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate(labelData);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
