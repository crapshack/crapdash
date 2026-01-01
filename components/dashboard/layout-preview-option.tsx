'use client';

import { LAYOUTS, type DashboardLayout } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LayoutPreviewOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  variant: DashboardLayout;
}

export function LayoutPreviewOption({
  label,
  selected,
  onSelect,
  variant,
}: LayoutPreviewOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground'
      )}
    >
      <div className="text-xs font-medium">{label}</div>
      <div className="rounded-md border bg-muted/40 p-2">
        {variant === LAYOUTS.ROWS ? <RowsPreview /> : <ColumnsPreview />}
      </div>
    </button>
  );
}

function RowsPreview() {
  return (
    <div className="flex flex-col gap-3">
      <RowsCategory chips={3} />
      <Divider />
      <RowsCategory chips={2} />
    </div>
  );
}

function RowsCategory({ chips }: { chips: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2.5 w-14 rounded-sm bg-border/80" />
      <div className={cn('grid gap-1', chips === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {Array.from({ length: chips }).map((_, i) => (
          <div key={i} className="h-2.5 rounded-sm bg-muted-foreground/30" />
        ))}
      </div>
    </div>
  );
}

function ColumnsPreview() {
  return (
    <div className="grid w-full grid-cols-2 gap-1">
      <ColumnTile chipWidths={['w-full', 'w-full', 'w-full']} />
      <ColumnTile chipWidths={['w-full', 'w-full']} />
    </div>
  );
}

function ColumnTile({ chipWidths }: { chipWidths: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-sm border border-border/70 bg-background/80 p-1">
      <div className="h-2 w-full rounded-sm bg-border/80" />
      <div className="flex flex-col gap-1">
        {chipWidths.map((width, i) => (
          <div key={i} className={cn('h-2.5 rounded-sm bg-muted-foreground/30', width)} />
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border/70" />;
}
