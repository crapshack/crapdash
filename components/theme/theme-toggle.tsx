'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEMES, THEME_META } from './theme-config';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const LightIcon = THEME_META.light.icon;
  const DarkIcon = THEME_META.dark.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-lg">
          <LightIcon size={18} className="dark:hidden" />
          <DarkIcon size={18} className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {THEMES.map((t) => {
            const { icon: Icon, label } = THEME_META[t];
            return (
              <DropdownMenuRadioItem key={t} value={t}>
                <Icon size={14} />
                {label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
