import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';
import { buildRailTree } from './rail/treeModel';
import { REACH_OFFSET, useActiveAnchor } from './useActiveAnchor';

const entries = buildRailTree(fixtureFile(FIXTURE_MD).root);

/** Lays out fake headings: the top of each id (viewport coordinates) and the box of each question. */
function layout(tops: Record<string, number>, boxes: Record<string, [number, number]>) {
  document.body.innerHTML = '';
  for (const [id, top] of Object.entries(tops)) {
    const section = document.createElement('section');
    const h = document.createElement('h2');
    h.id = id;
    section.appendChild(h);
    document.body.appendChild(section);
    h.getBoundingClientRect = () => ({ top }) as DOMRect;
    const box = boxes[id];
    if (box) section.getBoundingClientRect = () => ({ top: box[0], height: box[1] }) as DOMRect;
  }
}

const flushFrame = async () => {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
};

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 4000,
    configurable: true,
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('useActiveAnchor', () => {
  it('starts at the first entry', () => {
    layout({}, {});
    const { result } = renderHook(() => useActiveAnchor(entries));
    expect(result.current.position).toEqual({ entryId: 'q2', questionId: 'q2' });
    expect(result.current.page).toBe(0);
  });

  it('follows the deepest heading whose top has passed the reading line', async () => {
    layout(
      {
        q2: -300,
        'i2.1': 0,
        q3: 50,
        'g3.1': REACH_OFFSET - 1,
        'i3.1.1': REACH_OFFSET + 40,
        'i3.1.2': 900,
      },
      {},
    );
    const { result } = renderHook(() => useActiveAnchor(entries));
    await flushFrame();
    expect(result.current.position).toEqual({ entryId: 'g3.1', questionId: 'q3', groupId: 'g3.1' });
  });

  it('reports progress per question from the reading line, and per page from the scroll', async () => {
    layout({ q2: -300, q3: 400 }, { q2: [-300, 1000], q3: [REACH_OFFSET + 400, 500] });
    Object.defineProperty(window, 'scrollY', { value: 1600, configurable: true });
    const { result } = renderHook(() => useActiveAnchor(entries));
    await flushFrame();
    expect(result.current.progress.q2).toBeCloseTo((REACH_OFFSET + 300) / 1000, 2);
    expect(result.current.progress.q3).toBe(0);
    expect(result.current.page).toBe(0.5); // 1600 of 3200 scrollable
  });

  it('finishes the last entry and question at the bottom of the page', async () => {
    layout({ q2: -3000, q3: -2000 }, { q2: [-3000, 1000], q3: [-2000, 3000] });
    Object.defineProperty(window, 'scrollY', { value: 3200, configurable: true });
    const { result } = renderHook(() => useActiveAnchor(entries));
    await flushFrame();
    expect(result.current.position.entryId).toBe('i3.1.2');
    expect(result.current.progress.q3).toBe(1);
    expect(result.current.page).toBe(1);
  });

  it('activate sets the position at once and pauses the spy until the scroll ends', async () => {
    layout({ q2: 0, q3: 2000 }, {});
    const { result } = renderHook(() => useActiveAnchor(entries));
    await flushFrame();
    expect(result.current.position.entryId).toBe('q2');

    act(() => result.current.activate('i3.1.1'));
    expect(result.current.position).toEqual({
      entryId: 'i3.1.1',
      questionId: 'q3',
      groupId: 'g3.1',
    });

    // a scroll while paused does not move the highlight back
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(result.current.position.entryId).toBe('i3.1.1');

    // the end of the scroll resumes tracking
    await act(async () => {
      window.dispatchEvent(new Event('scrollend'));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(result.current.position.entryId).toBe('q2');
  });

  it('ignores activate for an unknown id', () => {
    layout({}, {});
    const { result } = renderHook(() => useActiveAnchor(entries));
    act(() => result.current.activate('nope'));
    expect(result.current.position.entryId).toBe('q2');
  });
});
