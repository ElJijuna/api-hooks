import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { DockerHubApiError, DockerHubClient, type DockerHubUser } from 'dockerhub-api-client';
import type { ReactNode } from 'react';
import { useDockerHubUser } from './useDockerHubUser.js';

const mockGet = jest.fn<() => Promise<DockerHubUser>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'user').mockReturnValue({
    get: mockGet,
    // biome-ignore lint/suspicious/noThenProperty: intentional thenable mock
    then: jest.fn(),
    repositories: jest.fn(),
  } as ReturnType<DockerHubClient['user']>);
});

const mockUser: DockerHubUser = {
  id: '123',
  uuid: 'abc',
  username: 'johndoe',
  full_name: 'John Doe',
  location: '',
  company: '',
  profile_url: '',
  date_joined: '2020-01-01T00:00:00Z',
  gravatar_url: '',
  gravatar_email: '',
  type: 'User',
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubUser', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useDockerHubUser('johndoe'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new DockerHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useDockerHubUser('nonexistent'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useDockerHubUser(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useDockerHubUser('johndoe', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
