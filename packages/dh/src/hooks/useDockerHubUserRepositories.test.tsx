import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubApiError,
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubRepository,
} from 'dockerhub-api-client';
import { useDockerHubUserRepositories } from './useDockerHubUserRepositories.js';

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

const mockResponse: DockerHubPagedResponse<DockerHubRepository> = {
  results: [{ name: 'my-image', namespace: 'johndoe' } as DockerHubRepository],
  count: 1,
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubUserRepositories', () => {
  it('returns data on success', async () => {
    mockRepositories.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDockerHubUserRepositories('johndoe'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockRepositories.mockRejectedValue(new DockerHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useDockerHubUserRepositories('nonexistent'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useDockerHubUserRepositories(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockRepositories).not.toHaveBeenCalled();
  });
});
