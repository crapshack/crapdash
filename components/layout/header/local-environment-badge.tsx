"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  readLocalBuildMetadata,
  type LocalBuildMetadata,
} from "@/lib/local-build-metadata";

const HOVER_OPEN_DELAY_MS = 200;
const HOVER_CLOSE_DELAY_MS = 150;

export function LocalEnvironmentBadge() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DevelopmentBadge metadata={readLocalBuildMetadata()} />;
}

function DevelopmentBadge({ metadata }: { metadata: LocalBuildMetadata }) {
  const [open, setOpen] = React.useState(false);
  const openSource = React.useRef<"explicit" | "hover" | null>(null);
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);
  const closingFromHover = React.useRef(false);

  React.useEffect(
    () => () => {
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current);
      }
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    },
    []
  );

  function clearTimers() {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openOnHover(event: React.PointerEvent) {
    if (event.pointerType === "touch" || openSource.current === "explicit") {
      return;
    }

    clearTimers();
    openTimer.current = window.setTimeout(() => {
      openSource.current = "hover";
      setOpen(true);
    }, HOVER_OPEN_DELAY_MS);
  }

  function closeAfterHover() {
    clearTimers();

    if (openSource.current !== "hover") {
      return;
    }

    closeTimer.current = window.setTimeout(() => {
      closingFromHover.current = true;
      openSource.current = null;
      setOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }

  function changeOpen(nextOpen: boolean) {
    clearTimers();

    if (nextOpen) {
      openSource.current ??= "explicit";
    } else {
      closingFromHover.current = openSource.current === "hover";
      openSource.current = null;
    }

    setOpen(nextOpen);
  }

  function pinHoveredPopover(event: React.MouseEvent) {
    if (open && openSource.current === "hover") {
      event.preventDefault();
      clearTimers();
      openSource.current = "explicit";
    }
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <Badge asChild variant="outline" className="max-w-28 rounded-sm font-mono">
        <PopoverTrigger
          type="button"
          aria-label="Local development environment. Show build details"
          onClick={pinHoveredPopover}
          onPointerEnter={openOnHover}
          onPointerLeave={closeAfterHover}
        >
          <span className="truncate">LOCAL</span>
        </PopoverTrigger>
      </Badge>
      <PopoverContent
        aria-label="Build details"
        align="start"
        sideOffset={8}
        collisionPadding={16}
        className="w-[min(23rem,calc(100vw-2rem))] p-3 font-mono"
        onPointerEnter={clearTimers}
        onPointerLeave={closeAfterHover}
        onOpenAutoFocus={(event) => {
          if (openSource.current === "hover") {
            event.preventDefault();
          }
        }}
        onCloseAutoFocus={(event) => {
          if (closingFromHover.current) {
            event.preventDefault();
            closingFromHover.current = false;
          }
        }}
      >
        <LocalBuildDetails metadata={metadata} />
      </PopoverContent>
    </Popover>
  );
}

export function LocalBuildDetails({ metadata }: { metadata: LocalBuildMetadata }) {
  const builtAt = new Date(metadata.builtAt);
  const builtAtLabel = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(builtAt);
  const relativeBuiltAt = formatRelativeTime(builtAt, new Date());

  return (
    <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs leading-5">
      <BuildDetail label="BRANCH" title={metadata.branch}>
        {metadata.branch}
      </BuildDetail>
      <BuildDetail label="COMMIT" title={metadata.commitSha}>
        {metadata.commitSha.slice(0, 8)}
        {metadata.dirty ? <span className="text-muted-foreground"> (dirty)</span> : null}
      </BuildDetail>
      <BuildDetail label="MESSAGE" title={metadata.commitSubject}>
        {metadata.commitSubject}
      </BuildDetail>
      <BuildDetail label="BUILT" title={builtAtLabel}>
        <time dateTime={metadata.builtAt}>
          {builtAtLabel} · {relativeBuiltAt}
        </time>
      </BuildDetail>
    </dl>
  );
}

function BuildDetail({
  children,
  label,
  title,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
}) {
  return (
    <>
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate" title={title}>
        {children}
      </dd>
    </>
  );
}

function formatRelativeTime(date: Date, now: Date) {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < 60) {
    return formatter.format(seconds, "second");
  }
  if (absoluteSeconds < 60 * 60) {
    return formatter.format(Math.round(seconds / 60), "minute");
  }
  if (absoluteSeconds < 60 * 60 * 24) {
    return formatter.format(Math.round(seconds / (60 * 60)), "hour");
  }

  return formatter.format(Math.round(seconds / (60 * 60 * 24)), "day");
}
