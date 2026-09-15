'use client';

import React, { useRef } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  /** Small count pill, e.g. number of open assignments. */
  badge?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}

/**
 * WAI-ARIA tablist with roving focus and arrow-key navigation.
 * Arrow direction follows the document's writing direction so RTL feels native.
 */
export function Tabs<T extends string>({
  items,
  active,
  onChange,
  label,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const isRtl = typeof document !== 'undefined' && document.dir === 'rtl';
    const current = items.findIndex((i) => i.id === active);

    let next = current;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else {
      const forward = isRtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight';
      next = (current + (forward ? 1 : -1) + items.length) % items.length;
    }

    onChange(items[next].id);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex gap-1 overflow-x-auto px-3 sm:px-5 bg-surface border-b border-line"
    >
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            id={`tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={`relative shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              selected
                ? 'text-brand-ink'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>

            {typeof item.badge === 'number' && item.badge > 0 && (
              <span className="tabular min-w-5 h-5 px-1.5 rounded-full bg-brand-tint text-brand-ink ring-1 ring-brand-ring text-[11px] font-extrabold flex items-center justify-center">
                {item.badge}
              </span>
            )}

            <span
              aria-hidden="true"
              className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors ${
                selected ? 'bg-brand-600' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
