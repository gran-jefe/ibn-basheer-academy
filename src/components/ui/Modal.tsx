'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Rendered in the brand header bar. */
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Tailwind max-width class for the dialog shell. */
  size?: 'md' | 'lg' | 'xl';
  closeLabel?: string;
  children: React.ReactNode;
  /** Sticky footer, e.g. primary form actions. */
  footer?: React.ReactNode;
}

const SIZES = {
  md: 'max-w-xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
} as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog shell shared by every portal.
 * Handles Escape, backdrop dismissal, focus trap + restore, and scroll lock —
 * none of which the individual modals were doing for themselves.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  closeLabel = 'Close',
  children,
  footer,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the dialog without yanking the page around.
    const raf = requestAnimationFrame(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
      target?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-brand-950/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        // Only dismiss on a press that both starts and ends on the backdrop.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`${SIZES[size]} w-full bg-surface shadow-2xl ring-1 ring-line rounded-t-3xl sm:rounded-3xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-pop-in outline-none`}
      >
        {/* Header */}
        <div className="shrink-0 bg-brand-800 text-white px-5 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-accent-300">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg leading-tight truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-brand-100/80 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="shrink-0 -me-1 -mt-1 p-2 rounded-lg text-brand-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-px shrink-0 rule-brass" aria-hidden="true" />

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-paper">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-line bg-surface px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
