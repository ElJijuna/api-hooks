import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError } from 'maven-api-client';
import {
  artifactId,
  groupId,
  mockArtifact,
  mockArtifactVersion,
  setupMavenMocks,
  version,
  versionDoc,
  wrapper,
} from '../../testUtils.js';
import { useMavenArtifactVersion } from './useMavenArtifactVersion.js';

beforeEach(setupMavenMocks);

describe('useMavenArtifactVersion', () => {
  it('returns version metadata', async () => {
    mockArtifactVersion.mockResolvedValue(versionDoc);

    const { result } = renderHook(() => useMavenArtifactVersion(groupId, artifactId, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(versionDoc);
    expect(mockArtifact).toHaveBeenCalledWith(groupId, artifactId);
    expect(mockArtifactVersion).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockArtifactVersion.mockRejectedValue(new MavenApiError(404, 'Not Found'));

    const { result } = renderHook(() => useMavenArtifactVersion(groupId, artifactId, version), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useMavenArtifactVersion(groupId, artifactId, ''), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenArtifactVersion(groupId, artifactId, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockArtifactVersion.mockResolvedValue(versionDoc);
    const { result } = renderHook(
      () =>
        useMavenArtifactVersion(groupId, artifactId, version, {
          queryOptions: { staleTime: 0 },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
