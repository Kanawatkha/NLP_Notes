import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Inline } from '@/content/types';
import { AnimatedTitle } from './AnimatedTitle';
import { TokenChips } from './TokenChips';

const t = (v: string): Inline => ({ t: 'text', v });

describe('AnimatedTitle', () => {
  it('keeps the title text exactly, with only the words wrapped', () => {
    const { container } = render(
      <h1>
        <AnimatedTitle nodes={[t('แนวข้อสอบ กลางภาค (Midterm Practice Exam)')]} />
      </h1>,
    );
    expect(container.textContent).toBe('แนวข้อสอบ กลางภาค (Midterm Practice Exam)');
    expect(container.querySelectorAll('.word-rise')).toHaveLength(5);
  });

  it('delays each word by 60 ms and staggers at most 12 words', () => {
    const words = Array.from({ length: 15 }, (_, i) => `w${i}`).join(' ');
    const { container } = render(<AnimatedTitle nodes={[t(words)]} />);
    const delays = Array.from(container.querySelectorAll<HTMLElement>('.word-rise')).map(
      (el) => el.style.animationDelay,
    );
    expect(delays.slice(0, 3)).toEqual(['0ms', '60ms', '120ms']);
    expect(delays[11]).toBe('660ms');
    expect(delays[12]).toBe('660ms');
    expect(delays[14]).toBe('660ms');
  });

  it('keeps bold, code and formulas whole as one word each', () => {
    const { container } = render(
      <AnimatedTitle
        nodes={[
          t('ก '),
          { t: 'strong', c: [t('ตัวหนา มาก')] },
          { t: 'math', tex: 'x', html: '<span class="katex">x</span>' },
        ]}
      />,
    );
    expect(container.querySelectorAll('.word-rise')).toHaveLength(3);
    expect(container.querySelector('strong')).toHaveTextContent('ตัวหนา มาก');
    expect(container.querySelector('.katex')).not.toBeNull();
  });
});

describe('TokenChips', () => {
  it('is decorative: hidden from assistive technology, with no text', () => {
    const { container } = render(<TokenChips />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(container.textContent).toBe('');
  });

  it('draws 8 chips that merge in three rounds into one mint chip (15 shapes)', () => {
    const { container } = render(<TokenChips />);
    const rects = Array.from(container.querySelectorAll('rect'));
    expect(rects).toHaveLength(8 + 4 + 2 + 1);
    // 14 chips merge into a wider one, and the last one only appears
    expect(container.querySelectorAll('.chip-out')).toHaveLength(14);
    expect(container.querySelectorAll('.chip-in')).toHaveLength(7);
    const final = container.querySelectorAll('.chip-final');
    expect(final).toHaveLength(1);
    expect(final[0].getAttribute('fill')).toBe('var(--color-primary)');
  });

  it('slides the two chips of a pair together by half of the gap between them', () => {
    const { container } = render(<TokenChips />);
    const [first, second] = Array.from(container.querySelectorAll<SVGRectElement>('rect'));
    expect(first.style.getPropertyValue('--dx')).toBe('10px');
    expect(second.style.getPropertyValue('--dx')).toBe('-10px');
    // the wider chip that replaces them spans both
    const merged = container.querySelectorAll<SVGRectElement>('rect')[8];
    expect(Number(merged.getAttribute('width'))).toBe(56);
    expect(Number(merged.getAttribute('x'))).toBe(10);
  });

  it('runs the three rounds one after another', () => {
    const { container } = render(<TokenChips />);
    const rects = Array.from(container.querySelectorAll<SVGRectElement>('rect'));
    const delayOut = (i: number) => rects[i].style.getPropertyValue('--delay-out');
    expect(delayOut(0)).toBe('500ms'); // leaves merge in round 1
    expect(delayOut(8)).toBe('1400ms'); // pairs merge in round 2
    expect(delayOut(12)).toBe('2300ms'); // the two wide chips merge in round 3
  });
});
