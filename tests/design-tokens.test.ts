// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const design = readFileSync(join(root, 'DESIGN-jobright.md'), 'utf8');
const css = readFileSync(join(root, 'src/styles/index.css'), 'utf8');

/** Reads the `key: value` pairs of one top-level block of the DESIGN front matter. */
function frontMatterBlock(name: string): Record<string, string> {
  const front = design.split(/^---$/m)[1];
  const lines = front.split('\n');
  const start = lines.findIndex((l) => l === `${name}:`);
  const out: Record<string, string> = {};
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith('  ')) break;
    const m = /^ {2}([\w-]+): "?([^"]+?)"?$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/** Reads the custom properties declared in the @theme block of index.css. */
function themeVars(): Record<string, string> {
  const theme = /@theme\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '';
  const out: Record<string, string> = {};
  for (const m of theme.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('design tokens follow DESIGN-jobright.md', () => {
  const vars = themeVars();

  it('has every color of the design file with the same value', () => {
    const colors = frontMatterBlock('colors');
    expect(Object.keys(colors).length).toBeGreaterThanOrEqual(9);
    for (const [name, value] of Object.entries(colors)) {
      expect(vars[`--color-${name}`], name).toBe(value);
    }
  });

  it('has every radius of the design file with the same value', () => {
    const rounded = frontMatterBlock('rounded');
    for (const [name, value] of Object.entries(rounded)) {
      expect(vars[`--radius-${name}`], name).toBe(value);
    }
  });

  it('has the section spacing of the design file', () => {
    expect(vars['--spacing-section']).toBe(frontMatterBlock('spacing').section);
  });

  it('uses the design fonts first and falls back to Noto Sans Thai for Thai', () => {
    expect(vars['--font-display']).toMatch(/^'Titillium Web', 'Noto Sans Thai'/);
    expect(vars['--font-sans']).toMatch(/^'Inter', 'Noto Sans Thai'/);
  });

  it('switches the default Tailwind palette off, so only design colors exist', () => {
    expect(css).toContain('--color-*: initial;');
  });
});

describe('contrast pairings of UI-SPEC.md section 12', () => {
  const c = frontMatterBlock('colors');
  const aa = 4.5;

  it('keeps every text pairing at WCAG AA or better', () => {
    expect(contrast(c.ink, c.canvas)).toBeGreaterThanOrEqual(aa);
    expect(contrast(c.ink, c['canvas-mint'])).toBeGreaterThanOrEqual(aa);
    expect(contrast(c.ink, c.primary)).toBeGreaterThanOrEqual(aa);
    expect(contrast(c.ink, c['surface-soft'])).toBeGreaterThanOrEqual(aa);
    expect(contrast(c['on-dark'], c.ink)).toBeGreaterThanOrEqual(aa);
    expect(contrast(c.primary, c.ink)).toBeGreaterThanOrEqual(aa);
  });

  it('documents the pairings that must never carry text or state alone', () => {
    // mint on white and muted on white fail, which is why the rules in UI-SPEC.md section 1 exist
    expect(contrast(c.primary, c.canvas)).toBeLessThan(3);
    expect(contrast(c.muted, c.canvas)).toBeLessThan(aa);
  });
});
