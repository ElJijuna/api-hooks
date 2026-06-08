import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubApiError,
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubTag,
} from 'dockerhub-api-client';
import type { ReactNode } from 'react';
import { useDockerHubRepositoryTags } from './useDockerHubRepositoryTags.js';

const mockTags = jest.fn<() => Promise<DockerHubPagedResponse<DockerHubTag>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'repository').mockReturnValue({
    get: jest.fn(),
    // biome-ignore lint/suspicious/noThenProperty: intentional thenable mock
    then: jest.fn(),
    tags: mockTags,
  } as ReturnType<DockerHubClient['repository']>);
});

const mockResponse: DockerHubPagedResponse<DockerHubTag> = {
  results: [{ name: 'latest' } as DockerHubTag],
  count: 1,
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubRepositoryTags', () => {
  it('returns data on success', async () => {
    mockTags.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDockerHubRepositoryTags('library', 'nginx'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockTags.mockRejectedValue(new DockerHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useDockerHubRepositoryTags('library', 'nonexistent'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useDockerHubRepositoryTags('library', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTags).not.toHaveBeenCalled();
  });
});
