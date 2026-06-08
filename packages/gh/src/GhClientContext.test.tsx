import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { GhClientProvider, useGhClient } from './GhClientContext.js';

const providerOptions = { token: 'ghp_test' };

function wrapper({ children }: { children: ReactNode }) {
  return <GhClientProvider options={providerOptions}>{children}</GhClientProvider>;
}

function wrapperWithClient({ children }: { children: ReactNode }) {
  const client = new GitHubClient({ token: 'ghp_custom' });
  return <GhClientProvider client={client}>{children}</GhClientProvider>;
}

describe('GhClientProvider / useGhClient', () => {
  it('returns a GitHubClient instance from context', () => {
    const { result } = renderHook(() => useGhClient(), { wrapper });
    expect(result.current).toBeInstanceOf(GitHubClient);
  });

  it('returns the same instance across renders', () => {
    const { result, rerender } = renderHook(() => useGhClient(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('accepts a pre-configured client instance', () => {
    const { result } = renderHook(() => useGhClient(), { wrapper: wrapperWithClient });
    expect(result.current).toBeInstanceOf(GitHubClient);
  });

  it('returns a default GitHubClient when no provider is present', () => {
    const { result } = renderHook(() => useGhClient());
    expect(result.current).toBeInstanceOf(GitHubClient);
  });
});
