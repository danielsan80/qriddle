import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analytics } from './analytics';

describe('analytics', () => {
  const track = vi.fn();

  beforeEach(() => {
    track.mockClear();
    window.umami = { track };
  });

  afterEach(() => {
    delete window.umami;
  });

  it('sends a step change to Umami with the step alone', () => {
    analytics.stepChanged('inner.map');

    expect(track).toHaveBeenCalledExactlyOnceWith('step-changed', {
      step: 'inner.map',
    });
  });

  it('sends a download request to Umami', () => {
    analytics.downloadRequested();

    expect(track).toHaveBeenCalledExactlyOnceWith('download-requested');
  });

  it('does nothing when Umami is blocked', () => {
    delete window.umami;

    expect(() => {
      analytics.stepChanged('inner.map');
      analytics.downloadRequested();
    }).not.toThrow();
  });
});
