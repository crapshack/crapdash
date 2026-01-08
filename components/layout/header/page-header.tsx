'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IconConfig } from "@/lib/types";
import { ICON_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryIcon } from "@/components/common/icons/category-icon";
import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  appLogo?: IconConfig;
}

function LogoThumb({ appLogo }: { appLogo?: IconConfig }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentLogoValue = appLogo?.type === ICON_TYPES.IMAGE ? appLogo.value : null;
  const hasCustomLogo = !!currentLogoValue;
  const logoSrc = hasCustomLogo ? `/api/${currentLogoValue}` : undefined;

  const fallbackLogo = (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 bg-muted/40 text-muted-foreground/80 shadow-inner">
          <CategoryIcon icon={{ type: ICON_TYPES.ICON, value: 'ImageOff' }} className="h-6 w-6" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">Failed to load logo</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="relative h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center">
      {hasCustomLogo && !loadFailed ? (
        <>
          {!isLoaded && <Skeleton className="absolute inset-0" aria-hidden />}
          <Image
            src={logoSrc!}
            alt="Custom app logo"
            fill
            className={cn("object-cover transition-opacity", !isLoaded && "opacity-0")}
            unoptimized
            onError={() => setLoadFailed(true)}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      ) : loadFailed ? (
        fallbackLogo
      ) : (
        <Image
          src="/compy.png"
          alt="Compy"
          width={56}
          height={56}
          className="object-cover"
        />
      )}
    </div>
  );
}

export function PageHeader({ title, description, children, appLogo }: PageHeaderProps) {
  const logoKey = `${appLogo?.type ?? 'none'}:${appLogo?.value ?? 'default'}`;

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/">
              <LogoThumb key={logoKey} appLogo={appLogo} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold font-mono text-gradient-title">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex items-center justify-end gap-2 md:gap-3 w-full md:w-auto">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
