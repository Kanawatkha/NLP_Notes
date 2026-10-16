import katex from 'katex';

const cache = new Map<string, string>();

/** Pre-renders TeX to HTML (plus MathML for screen readers) with KaTeX. Strict mode: any problem fails the build. */
export function renderMath(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}:${tex}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: true,
    output: 'htmlAndMathml',
    strict: 'error',
  });
  cache.set(key, html);
  return html;
}
