import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { hasFinePointer } from '../../lib/browser/device';
import { MobileBlock } from './MobileBlock';
import { MobileBlockPage } from './MobileBlock.page';

vi.mock('../../lib/browser/device', () => ({ hasFinePointer: vi.fn() }));

const mobileBlockPage = new MobileBlockPage();

describe('MobileBlock', () => {
  it('stays hidden on a computer', () => {
    vi.mocked(hasFinePointer).mockReturnValue(true);
    render(<MobileBlock />);
    expect(mobileBlockPage.isShown).toBe(false);
  });

  it('covers the page on a phone', () => {
    vi.mocked(hasFinePointer).mockReturnValue(false);
    render(<MobileBlock />);
    expect(mobileBlockPage.isShown).toBe(true);
  });
});
