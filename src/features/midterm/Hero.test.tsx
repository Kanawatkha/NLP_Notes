import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UI_TEXT } from '@/config/site';
import { FIXTURE_MD, fixtureFile, fixtureMeta } from '@/test/fixture';
import { Hero } from './Hero';
import { MidtermOutline } from './MidtermOutline';

const file = fixtureFile(FIXTURE_MD);
const meta = fixtureMeta(file);

describe('Hero', () => {
  it('shows the title of the file and the numbers computed from the content', () => {
    render(<Hero meta={meta} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'แนวข้อสอบทดสอบ (Test Exam)',
    );
    expect(screen.getByText(UI_TEXT.statQuestions).previousSibling).toHaveTextContent('2');
    expect(screen.getByText(UI_TEXT.statItems).previousSibling).toHaveTextContent('3');
    expect(screen.getByText(UI_TEXT.statExamples).previousSibling).toHaveTextContent('3');
    expect(screen.getByText(UI_TEXT.statPoints).previousSibling).toHaveTextContent('12');
  });

  it('leaves out the total points when no question states its points', () => {
    render(<Hero meta={{ ...meta, stats: { ...meta.stats, totalPoints: 0 } }} />);
    expect(screen.queryByText(UI_TEXT.statPoints)).toBeNull();
  });

  it('has no start button when there is no question to jump to', () => {
    const { firstQuestionId: _unused, ...rest } = meta;
    void _unused;
    render(<Hero meta={rest} />);
    expect(screen.queryByRole('button', { name: UI_TEXT.startExam })).toBeNull();
  });

  it('jumps to the first question from the button', () => {
    render(
      <>
        <Hero meta={meta} />
        <MidtermOutline file={file} mountAll />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: UI_TEXT.startExam }));
    expect(document.getElementById('q2')).toHaveFocus();
  });
});

describe('the meta file', () => {
  it('is what the content build writes: id, title, numbers, first question', () => {
    expect(meta).toMatchObject({
      id: 'midterm',
      stats: { questions: 2, groups: 1, items: 3, examples: 3, totalPoints: 12 },
      firstQuestionId: 'q2',
    });
  });
});
