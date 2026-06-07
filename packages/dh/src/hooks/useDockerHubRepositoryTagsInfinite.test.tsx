import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubTag,
} from 'dockerhub-api-client';
import { useDockerHubRepositoryTagsInfinite } from './useDockerHubRepositoryTagsInfinite.js';

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

const mockPage1: DockerHubPagedResponse<DockerHubTag> = {
  results: [{ name: 'latest' } as DockerHubTag],
  count: 2,
  hasNextPage: true,
  nextPage: 2,
};

const mockPage2: DockerHubPagedResponse<DockerHubTag> = {
  results: [{ name: 'stable' } as DockerHubTag],
  count: 2,
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubRepositoryTagsInfinite', () => {
  it('fetches first page on mount', async () => {
    mockTags.mockResolvedValue(mockPage1);

    const { result } = renderHook(
      () => useDockerHubRepositoryTagsInfinite('library', 'nginx'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages[0]).toEqual(mockPage1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('fetches next page on fetchNextPage', async () => {
    mockTags.mockResolvedValueOnce(mockPage1).mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(
      () => useDockerHubRepositoryTagsInfinite('library', 'nginx'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages.length).toBe(2));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(
      () => useDockerHubRepositoryTagsInfinite('library', ''),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockTags).not.toHaveBeenCalled();
  });
});
