/** Shared field styling so every form in the LMS looks and focuses alike. */
export const fieldBase =
  'w-full rounded-xl bg-surface text-fg text-sm ring-1 ring-line placeholder:text-fg-subtle ' +
  'focus:ring-2 focus:ring-brand-500 focus:outline-none transition-shadow disabled:opacity-60';

export const inputClass = `${fieldBase} px-3.5 py-2.5`;

/** Padded on the inline-start edge to clear a leading icon (RTL-safe). */
export const inputWithIconClass = `${fieldBase} ps-10 pe-3.5 py-2.5`;

export const selectClass = `${fieldBase} px-3.5 py-2.5 appearance-none`;

export const labelClass =
  'block text-xs font-bold text-fg mb-1.5';

export const hintClass = 'text-xs text-fg-subtle mt-1';

export const iconInFieldClass =
  'pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle';
