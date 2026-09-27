'use client';

import React from 'react';
import Image from 'next/image';
import { ACADEMY_INFO } from '@/lib/data/academyData';

interface AcademyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  isAr?: boolean;
  subHeading?: boolean;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { px: 28, box: 'w-7 h-7' },
  sm: { px: 36, box: 'w-9 h-9' },
  md: { px: 44, box: 'w-11 h-11' },
  lg: { px: 56, box: 'w-14 h-14' },
  xl: { px: 72, box: 'w-18 h-18' },
  '2xl': { px: 96, box: 'w-24 h-24' },
};

export const AcademyLogo: React.FC<AcademyLogoProps> = ({
  size = 'md',
  showText = false,
  isAr = false,
  subHeading = false,
  className = '',
  imageClassName = '',
  priority = false,
}) => {
  const { px, box } = SIZE_MAP[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Golden rim circular emblem */}
      <div
        className={`relative ${box} shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-accent-600 via-accent-300 to-accent-600 shadow-md ring-1 ring-accent-400/40`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-brand-950 flex items-center justify-center">
          <Image
            src="/images/logo-emblem.png"
            alt={isAr ? 'شعار أكاديمية ابن بشير' : 'Ibn Basheer Academy Official Seal'}
            width={px}
            height={px}
            priority={priority}
            className={`w-full h-full object-contain ${imageClassName}`}
          />
        </div>
      </div>

      {showText && (
        <div className="min-w-0">
          <p className="font-bold font-display text-sm sm:text-base leading-tight truncate text-fg dark:text-white">
            {isAr ? 'أكاديمية ابن بشير' : 'Ibn Basheer Academy'}
          </p>
          {subHeading && (
            <p className="text-[11px] text-fg-muted dark:text-brand-200 truncate mt-0.5">
              {isAr ? ACADEMY_INFO.subHeadingAr : ACADEMY_INFO.subHeadingEn}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
