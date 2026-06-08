import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { DockerHubApiError, DockerHubClient } from 'dockerhub-api-client';
import type { ReactNode } from 'react';
import { useDockerHubLogin } from './useDockerHubLogin.js';

const mockLogin = jest.fn<() => Promise<string>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'login').mockImplementation(mockLogin);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubLogin', () => {
  it('returns token on success', async () => {
    mockLogin.mockResolvedValue('jwt-token-abc');

    const { result } = renderHook(() => useDockerHubLogin(), { wrapper });

    act(() => {
      result.current.mutate({ username: 'johndoe', password: 'secret' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe('jwt-token-abc');
  });

  it('returns error on 401', async () => {
    mockLogin.mockRejectedValue(new DockerHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useDockerHubLogin(), { wrapper });

    act(() => {
      result.current.mutate({ username: 'johndoe', password: 'wrong' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });
});
