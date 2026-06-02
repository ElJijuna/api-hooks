import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  NpmApiError,
  type NpmAuditPayload,
  type NpmAuditResult,
  NpmClient,
} from 'npmjs-api-client';
import { useNpmAudit } from './useNpmAudit.js';

const mockAudit = jest.fn<() => Promise<NpmAuditResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'audit')
    .mockImplementation(mockAudit as typeof NpmClient.prototype.audit);
});

const payload: NpmAuditPayload = {
  name: 'my-app',
  version: '1.0.0',
  requires: { lodash: '^4.17.11' },
  dependencies: {
    lodash: { version: '4.17.11', integrity: 'sha512-abc123' },
  },
};

const mockData: NpmAuditResult = {
  actions: [],
  advisories: {},
  muted: [],
  metadata: {
    vulnerabilities: { info: 0, low: 0, moderate: 1, high: 0, critical: 0 },
    dependencies: 1,
    devDependencies: 0,
    optionalDependencies: 0,
    totalDependencies: 1,
  },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmAudit', () => {
  it('returns data on successful mutation', async () => {
    mockAudit.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmAudit(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockAudit).toHaveBeenCalledWith(payload);
  });

  it('returns error on failure', async () => {
    mockAudit.mockRejectedValue(new NpmApiError(400, 'Bad Request'));

    const { result } = renderHook(() => useNpmAudit(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useNpmAudit(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(mockAudit).not.toHaveBeenCalled();
  });
});
