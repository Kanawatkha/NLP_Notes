import type { ReactNode } from 'react';

type ToastProps = { children: ReactNode; action?: ReactNode };

/** Toast chrome: white card, radius 24, whisper shadow (ex-toast in DESIGN-jobright.md). */
export function Toast({ children, action }: ToastProps) {
  return (
    <div
      role="status"
      className="toast-in type-body-sm flex items-center gap-4 rounded-lg border border-hairline bg-canvas px-4 py-3 text-ink shadow-float"
    >
      <span>{children}</span>
      {action}
    </div>
  );
}
