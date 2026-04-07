import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOuterTextBoxes } from './useOuterTextBoxes';
import { readState, mergeState } from '../lib/browser/urlState';
import type { TextBox } from '../components/SvgTextEditor';

vi.mock('../lib/browser/urlState', () => ({
  readState: vi.fn().mockReturnValue({}),
  mergeState: vi.fn(),
}));

const frontBox: TextBox = {
  id: '1',
  x: 10,
  y: 20,
  text: 'hi',
  fontSize: 8,
  face: 'front',
};
const centerBox: TextBox = {
  id: '2',
  x: 30,
  y: 40,
  text: 'yo',
  fontSize: 8,
  face: 'center',
};

describe('useOuterTextBoxes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readState).mockReturnValue({});
  });

  it('returns only boxes matching the given face', () => {
    vi.mocked(readState).mockReturnValue({ textBoxes: [frontBox, centerBox] });

    const { result } = renderHook(() => useOuterTextBoxes('front'));

    expect(result.current[0]).toEqual([frontBox]);
  });

  it('merges textBoxes to URL state on change', () => {
    const { result } = renderHook(() => useOuterTextBoxes('front'));

    act(() => result.current[1]([frontBox]));

    expect(mergeState).toHaveBeenCalledWith(
      { textBoxes: [frontBox] },
      'replace',
    );
  });

  it('preserves boxes from other faces when updating', () => {
    vi.mocked(readState).mockReturnValue({ textBoxes: [centerBox] });

    const { result } = renderHook(() => useOuterTextBoxes('front'));

    act(() => result.current[1]([frontBox]));

    expect(mergeState).toHaveBeenCalledWith(
      { textBoxes: [centerBox, frontBox] },
      'replace',
    );
  });
});
