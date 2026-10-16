import { CountUp } from '@/components/motion/CountUp';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { UI_TEXT } from '@/config/site';
import type { PageMeta } from '@/content/types';
import { jumpTo } from '@/lib/jumpTo';
import { AnimatedTitle } from './AnimatedTitle';
import { TokenChips } from './TokenChips';

type HeroProps = { meta: PageMeta };

/**
 * Pale-mint hero band (UI-SPEC.md section 3): the title of the Markdown file, the numbers computed
 * from the content (they come in a small file of their own, so the hero is painted before the
 * content has loaded), one button that jumps to the first question, and the token-chip graphic.
 * The title enters word by word, the numbers count up (A1 to A3).
 */
export function Hero({ meta }: HeroProps) {
  const { stats, firstQuestionId } = meta;
  const items: { icon: IconName; value: number; label: string }[] = [
    { icon: 'layers', value: stats.questions, label: UI_TEXT.statQuestions },
    { icon: 'list', value: stats.items, label: UI_TEXT.statItems },
    { icon: 'pencil', value: stats.examples, label: UI_TEXT.statExamples },
  ];
  if (stats.totalPoints > 0) {
    items.push({ icon: 'star', value: stats.totalPoints, label: UI_TEXT.statPoints });
  }

  return (
    <section className="bg-canvas-mint">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:px-6 md:py-section">
        <div>
          <h1 className="type-h1 max-w-[880px]">
            <AnimatedTitle nodes={meta.title} />
          </h1>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
            {items.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <Icon name={s.icon} size={24} />
                <div>
                  <p className="type-h3 leading-none">
                    <CountUp value={s.value} />
                  </p>
                  <p className="type-caption mt-1">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
          {firstQuestionId ? (
            <div className="mt-8 max-w-[360px]">
              <Button onClick={() => jumpTo(firstQuestionId)}>{UI_TEXT.startExam}</Button>
            </div>
          ) : null}
        </div>
        <TokenChips className="w-full max-w-[364px] justify-self-center text-ink md:w-[320px] lg:w-[364px]" />
      </div>
    </section>
  );
}
