import { Fragment } from 'react';
import { CountUp } from '@/components/motion/CountUp';
import { Icon } from '@/components/ui/Icon';
import { HERO, UI_TEXT } from '@/config/site';
import { TokenChips } from './TokenChips';

/**
 * Pale-mint hero band (UI-SPEC.md section 3): the title, two numbers (questions and total points,
 * set in `HERO` for now) and the token-chip graphic. The title enters word by word, the numbers
 * count up (A1 to A3).
 */
export function Hero() {
  const items = [
    { icon: 'layers', value: HERO.questions, label: UI_TEXT.statQuestions },
    { icon: 'star', value: HERO.points, label: UI_TEXT.statPoints },
  ] as const;

  return (
    <section className="bg-canvas-mint">
      <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-4 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:px-6 md:py-12">
        <div>
          <h1 className="type-h1 max-w-[880px]">
            {HERO.title.split(' ').map((word, i) => (
              <Fragment key={word}>
                {i > 0 ? ' ' : null}
                <span className="word-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  {word}
                </span>
              </Fragment>
            ))}
          </h1>
          <ul className="type-body-md mt-4 flex flex-col gap-1">
            {HERO.parts.map((p) => (
              <li key={p.no}>
                ข้อ {p.no} {p.name} ({p.points} คะแนน)
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-5">
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
        </div>
        <TokenChips className="w-full max-w-[364px] justify-self-center text-ink md:w-[260px] lg:w-[300px]" />
      </div>
    </section>
  );
}
