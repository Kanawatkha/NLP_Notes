import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FIXTURE_MD, fixtureFile } from '@/test/fixture';
import { ProgressRing } from './ProgressRing';
import { RailTree } from './RailTree';
import { buildRailTree, flattenRail, positionOf } from './treeModel';

const entries = buildRailTree(fixtureFile(FIXTURE_MD).root);
const flat = flattenRail(entries);

const setup = (entryId: string, progress: Record<string, number> = {}, onSelect = vi.fn()) => {
  const entry = flat.find((e) => e.id === entryId);
  if (!entry) throw new Error(`no entry ${entryId}`);
  render(
    <RailTree
      entries={entries}
      position={positionOf(entry)}
      progress={progress}
      onSelect={onSelect}
    />,
  );
  return onSelect;
};

describe('buildRailTree', () => {
  it('lists questions, then groups or items, then the items of a group', () => {
    expect(entries.map((e) => [e.id, e.kind])).toEqual([
      ['q2', 'question'],
      ['q3', 'question'],
    ]);
    expect(entries[0].children.map((e) => [e.id, e.kind])).toEqual([['i2.1', 'item']]);
    expect(entries[1].children.map((e) => [e.id, e.kind])).toEqual([['g3.1', 'group']]);
    expect(entries[1].children[0].children.map((e) => e.id)).toEqual(['i3.1.1', 'i3.1.2']);
  });

  it('keeps the heading text as the label and remembers the question and group of each entry', () => {
    expect(entries[0].label).toBe('ข้อ 2 Tokenization');
    const item = flat.find((e) => e.id === 'i3.1.2');
    expect(item).toMatchObject({ questionId: 'q3', groupId: 'g3.1', label: '3.1.2 อีกข้อ' });
    expect(flat.find((e) => e.id === 'i2.1')?.groupId).toBeUndefined();
    expect(flat.map((e) => e.id)).toEqual(['q2', 'i2.1', 'q3', 'g3.1', 'i3.1.1', 'i3.1.2']);
  });

  it('truncates a long label', () => {
    const long = fixtureFile(`# T\n\n## ข้อ 2 ${'ก'.repeat(80)}\n\n### 2.1  ข\n\nx\n`);
    expect(buildRailTree(long.root)[0].label.length).toBeLessThanOrEqual(44);
  });
});

describe('RailTree', () => {
  it('marks the current entry with aria-current="location" and no other', () => {
    setup('i3.1.1');
    const current = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-current') === 'location');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('3.1.1 จับคำ');
  });

  it('expands only the question and the group that hold the reading position', () => {
    const { container } = render(
      <RailTree
        entries={entries}
        position={positionOf(flat.find((e) => e.id === 'i3.1.1')!)}
        progress={{}}
        onSelect={() => {}}
      />,
    );
    const folded = Array.from(container.querySelectorAll('[inert]'));
    // q2 is folded (its item is inert), q3 and g3.1 are open
    expect(folded).toHaveLength(1);
    expect(within(folded[0] as HTMLElement).getByText('2.1 Token และ Type')).toBeInTheDocument();
  });

  it('folds the items of a group while the reader is elsewhere in the question', () => {
    const { container } = render(
      <RailTree
        entries={entries}
        position={positionOf(flat.find((e) => e.id === 'q3')!)}
        progress={{}}
        onSelect={() => {}}
      />,
    );
    // q2 folded, q3 open (its group is shown), the group itself folded
    const folded = Array.from(container.querySelectorAll('[inert]'));
    expect(folded).toHaveLength(2);
    expect(within(folded[1] as HTMLElement).getByText('3.1.1 จับคำ')).toBeInTheDocument();
  });

  it('calls onSelect with the id of the pressed entry', () => {
    const onSelect = setup('q2');
    fireEvent.click(screen.getByRole('button', { name: /ข้อ 3 Word Segmentation/ }));
    expect(onSelect).toHaveBeenCalledWith('q3');
  });

  it('shows a progress ring on every question and on nothing else', () => {
    const { container } = render(
      <RailTree
        entries={entries}
        position={positionOf(flat[0])}
        progress={{ q2: 0.5, q3: 1 }}
        onSelect={() => {}}
      />,
    );
    expect(container.querySelectorAll('svg')).toHaveLength(2);
    expect(container.querySelectorAll('svg[data-complete]')).toHaveLength(1);
  });
});

describe('ProgressRing', () => {
  it('draws the track and a partly filled arc below 1, and a mint disc with a check at 1', () => {
    const part = render(<ProgressRing value={0.25} />);
    expect(part.container.querySelectorAll('circle')).toHaveLength(2);
    const arc = part.container.querySelectorAll('circle')[1];
    const full = Number(arc.getAttribute('stroke-dasharray'));
    expect(Number(arc.getAttribute('stroke-dashoffset'))).toBeCloseTo(full * 0.75, 3);
    expect(part.container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    part.unmount();

    const done = render(<ProgressRing value={1} />);
    expect(done.container.querySelector('svg')).toHaveAttribute('data-complete');
    expect(done.container.querySelector('circle')).toHaveClass('fill-primary');
    expect(done.container.querySelector('path')).not.toBeNull();
  });
});
