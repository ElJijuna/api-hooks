import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { DockerHubApiError, DockerHubClient, type DockerHubOrganization } from 'dockerhub-api-client';
import { useDockerHubOrg } from './useDockerHubOrg.js';

const mockOrg = jest.fn<() => Promise<DockerHubOrganization>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'org').mockImplementation(mockOrg);
});

const mockData: DockerHubOrganization = {
  id: '456',
  uuid: 'def',
  orgname: 'docker',
  full_name: 'Docker',
  location: '',
  company: 'Docker Inc.',
  profile_url: '',
  date_joined: '2013-01-01T00:00:00Z',
  gravatar_url: '',
  gravatar_email: '',
  type: 'Organization',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubOrg', () => {
  it('returns data on success', async () => {
    mockOrg.mockResolvedValue(mockData);

    const { result } = renderHook(() => useDockerHubOrg('docker'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockOrg.mockRejectedValue(new DockerHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useDockerHubOrg('nonexistent-org'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when orgname is empty', () => {
    const { result } = renderHook(() => useDockerHubOrg(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockOrg).not.toHaveBeenCalled();
  });
});
