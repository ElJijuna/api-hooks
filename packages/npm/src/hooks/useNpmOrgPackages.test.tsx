import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmOrgPackages } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmOrgPackages } from './useNpmOrgPackages.js';

const mockPackages = jest.fn<() => Promise<NpmOrgPackages>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'org')
    .mockReturnValue({ packages: mockPackages } as ReturnType<NpmClient['org']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmOrgPackages', () => {
  it('returns org package access', async () => {
    const data: NpmOrgPackages = { '@npmcli/arborist': 'read-write' };
    mockPackages.mockResolvedValue(data);

    const { result } = renderHook(() => useNpmOrgPackages('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(data);
    expect(NpmClient.prototype.org).toHaveBeenCalledWith('npmcli');
    expect(mockPackages).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockPackages.mockRejectedValue(new NpmApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useNpmOrgPackages('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when org is empty', () => {
    const { result } = renderHook(() => useNpmOrgPackages(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmOrgPackages('npmcli', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });
});
