import { describe, expect, it } from 'vitest';
import type { Inline } from '@/content/types';
import { plainText, splitNumber, texLabel, truncate } from './text';

const t = (v: string): Inline => ({ t: 'text', v });

describe('plainText and truncate', () => {
  it('joins text, code and strong, skips formulas, collapses whitespace', () => {
    const nodes: Inline[] = [
      t('ข้อ  1 '),
      { t: 'strong', c: [t('FMM')] },
      { t: 'math', tex: 'x', html: '<span/>' },
      { t: 'code', v: 'a b' },
    ];
    expect(plainText(nodes)).toBe('ข้อ 1 FMMa b');
  });

  it('truncates long text with an ellipsis', () => {
    expect(truncate('abcdef', 4)).toBe('abc…');
    expect(truncate('abc', 4)).toBe('abc');
  });
});

describe('splitNumber', () => {
  it('splits "ข้อ N" off a question title', () => {
    expect(splitNumber([t('ข้อ 3 Word Segmentation')], '3', true)).toEqual({
      label: 'ข้อ 3',
      rest: [t('Word Segmentation')],
    });
  });

  it('does not confuse ข้อ 3 with ข้อ 30', () => {
    expect(splitNumber([t('ข้อ 30 อื่น')], '3', true).label).toBeUndefined();
  });

  it('splits a dotted number off a group or an item title, with two spaces as in the content', () => {
    expect(splitNumber([t('3.1.2  FMM และ BMM')], '3.1.2', false)).toEqual({
      label: '3.1.2',
      rest: [t('FMM และ BMM')],
    });
    expect(splitNumber([t('3.1  Word Segmentation')], '3.1', false).label).toBe('3.1');
  });

  it('keeps the rest of the nodes after the split', () => {
    const math: Inline = { t: 'math', tex: 'x', html: '' };
    expect(splitNumber([t('2.1 ค่า '), math], '2.1', false).rest).toEqual([t('ค่า '), math]);
  });

  it('leaves a title alone when it does not start with the number or has none', () => {
    const nodes = [t('Word Segmentation')];
    expect(splitNumber(nodes, '3.1', false)).toEqual({ rest: nodes });
    expect(splitNumber(nodes, undefined, false)).toEqual({ rest: nodes });
  });
});

describe('texLabel', () => {
  it('reads a subscript, a power and a product as words', () => {
    expect(texLabel('d_1')).toBe('d sub 1');
    expect(texLabel('a^*')).toBe('a sup *');
    expect(texLabel('\\times\\, b_j')).toBe('times b sub j');
  });

  it('unwraps text commands and drops braces and spacing commands', () => {
    expect(texLabel('v_1(\\text{NNP})\\,a_{\\text{NNP},j}')).toBe('v sub 1(NNP) a sub NNP,j');
    expect(texLabel('c_{pos}')).toBe('c sub pos');
    expect(texLabel('\\mathbf{Ans}')).toBe('Ans');
  });
});
