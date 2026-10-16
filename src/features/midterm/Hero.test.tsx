import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO, UI_TEXT } from '@/config/site';
import { Hero } from './Hero';

describe('Hero', () => {
  it('shows the title and the two numbers, and nothing else to press', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Midterm Practice Exam');
    expect(screen.getByText(UI_TEXT.statQuestions).previousSibling).toHaveTextContent(
      String(HERO.questions),
    );
    expect(screen.getByText(UI_TEXT.statPoints).previousSibling).toHaveTextContent(
      String(HERO.points),
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('lists the five questions with their points, adding up to the total', () => {
    expect(HERO.parts).toHaveLength(HERO.questions);
    expect(HERO.parts.reduce((sum, p) => sum + p.points, 0)).toBe(HERO.points);
    render(<Hero />);
    expect(screen.getByText(/ข้อ 3 Word Segmentation.*\(10 คะแนน\)/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(HERO.questions);
  });
});
