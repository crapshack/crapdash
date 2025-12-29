'use client';

import { useState, useCallback } from 'react';
import { setCookie } from '@/lib/utils';
import { LAYOUT_COOKIE_NAME, DEFAULT_LAYOUT, type DashboardLayout } from '@/lib/types';

const STORAGE_KEY = LAYOUT_COOKIE_NAME;

interface UseLayoutOptions {
  initialLayout?: DashboardLayout;
}

export function useLayout({ initialLayout }: UseLayoutOptions = {}) {
  const [layout, setLayoutState] = useState<DashboardLayout>(initialLayout ?? DEFAULT_LAYOUT);

  const setLayout = useCallback((newLayout: DashboardLayout) => {
    setLayoutState(newLayout);
    localStorage.setItem(STORAGE_KEY, newLayout);
    setCookie(LAYOUT_COOKIE_NAME, newLayout);
  }, []);

  return { layout, setLayout };
}
