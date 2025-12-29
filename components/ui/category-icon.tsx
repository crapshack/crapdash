'use client';

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name?: string;
}

// Known non-icon exports to exclude
const NON_ICONS = new Set([
  'createLucideIcon',
  'defaultAttributes', 
  'Icon',
  'icons',
]);

// Build case-insensitive lookup: lowercase -> actual PascalCase name
const iconLookup: Record<string, string> = {};
for (const key of Object.keys(LucideIcons)) {
  if (!NON_ICONS.has(key)) {
    iconLookup[key.toLowerCase()] = key;
  }
}

export function resolveIconName(name: string): string | null {
  if (!name) return null;
  return iconLookup[name.toLowerCase()] ?? null;
}

export function isValidIconName(name: string): boolean {
  return resolveIconName(name) !== null;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const resolved = name ? resolveIconName(name) : null;
  if (!resolved) return null;
  
  const Icon = LucideIcons[resolved as keyof typeof LucideIcons] as React.ComponentType<LucideProps>;
  return <Icon {...props} />;
}
