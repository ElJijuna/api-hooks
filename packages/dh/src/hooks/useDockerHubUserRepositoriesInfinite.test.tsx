import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubRepository,
} from 'dockerhub-api-client';
import type { ReactNode } from 'react';
import { useDockerHubUserRepositoriesInfinite } from './useDockerHubUserRepositoriesInfinite.js';

const mockRepositories = jest.fn<() => Promise<DockerHubPagedResponse<DockerHubRepository>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'user').mockReturnValue({
    get: jest.fn(),
    // biome-ignore lint/suspicious/noThenProperty: intentional thenable mock
    then: jest.fn(),
    repositories: mockRepositories,
  } as ReturnType<DockerHubClient['user']>);
});

const mockPage1: DockerHubPagedResponse<DockerHubRepository> = {
  results: [{ name: 'image-a' } as DockerHubRepository],
  count: 2,
  hasNextPage: true,
  nextPage: 2,
};

const mockPage2: DockerHubPagedResponse<DockerHubRepository> = {
  results: [{ name: 'image-b' } as DockerHubRepository],
  count: 2,
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubUserRepositoriesInfinite', () => {
  it('fetches first page on mount', async () => {
    mockRepositories.mockResolvedValue(mockPage1);

    const { result } = renderHook(() => useDockerHubUserRepositoriesInfinite('johndoe'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages[0]).toEqual(mockPage1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('fetches next page on fetchNextPage', async () => {
    mockRepositories.mockResolvedValueOnce(mockPage1).mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useDockerHubUserRepositoriesInfinite('johndoe'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages.length).toBe(2));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useDockerHubUserRepositoriesInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockRepositories).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockRepositories.mockResolvedValue(mockPage1);
    const { result } = renderHook(
      () => useDockerHubUserRepositoriesInfinite('johndoe', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
