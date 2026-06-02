import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmOrgMembers } from 'npmjs-api-client';
import { useNpmOrgMembers } from './useNpmOrgMembers.js';

const mockMembers = jest.fn<() => Promise<NpmOrgMembers>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'org')
    .mockReturnValue({ members: mockMembers } as ReturnType<NpmClient['org']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmOrgMembers', () => {
  it('returns org members', async () => {
    const data: NpmOrgMembers = { pilmee: 'owner' };
    mockMembers.mockResolvedValue(data);

    const { result } = renderHook(() => useNpmOrgMembers('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(data);
    expect(NpmClient.prototype.org).toHaveBeenCalledWith('npmcli');
    expect(mockMembers).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockMembers.mockRejectedValue(new NpmApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useNpmOrgMembers('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when org is empty', () => {
    const { result } = renderHook(() => useNpmOrgMembers(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockMembers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmOrgMembers('npmcli', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockMembers).not.toHaveBeenCalled();
  });
});
