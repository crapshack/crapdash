export const APPEARANCE_META = {
  default: { label: 'Default' },
  mono: { label: 'Mono' },
  'neo-brutalism': { label: 'Neo Brutalism' },
  perpetuity: { label: 'Perpetuity' },
} as const;

export type Appearance = keyof typeof APPEARANCE_META;

export const DEFAULT_APPEARANCE: Appearance = 'default';

export const APPEARANCES: Appearance[] = [
  DEFAULT_APPEARANCE,
  ...Object.keys(APPEARANCE_META)
    .filter((key) => key !== DEFAULT_APPEARANCE)
    .sort(),
] as Appearance[];
