import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { DockerHubApiError, DockerHubClient, type DockerHubRepository } from 'dockerhub-api-client';
import { useDockerHubRepository } from './useDockerHubRepository.js';

const mockGet = jest.fn<() => Promise<DockerHubRepository>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'repository').mockReturnValue({
    get: mockGet,
    then: (onfulfilled: unknown) =>
      mockGet().then(onfulfilled as Parameters<Promise<DockerHubRepository>['then']>[0]),
    tags: jest.fn(),
  } as ReturnType<DockerHubClient['repository']>);
});

const mockRepo: DockerHubRepository = {
  user: 'library',
  name: 'nginx',
  namespace: 'library',
  repository_type: 'image',
  status: 1,
  status_description: 'active',
  description: 'Official nginx image',
  is_private: false,
  is_automated: false,
  can_edit: false,
  star_count: 1000,
  pull_count: 1000000000,
  last_updated: '2024-01-01T00:00:00Z',
  date_registered: '2013-01-01T00:00:00Z',
  collaborator_count: 0,
  affiliation: '',
  hub_user: 'library',
  has_starred: false,
  full_description: '',
  permissions: { read: true, write: false, admin: false },
  media_types: [],
  content_types: [],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubRepository', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockRepo);

    const { result } = renderHook(() => useDockerHubRepository('library', 'nginx'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockRepo);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new DockerHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useDockerHubRepository('library', 'nonexistent'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when namespace is empty', () => {
    const { result } = renderHook(() => useDockerHubRepository('', 'nginx'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useDockerHubRepository('library', 'nginx', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
