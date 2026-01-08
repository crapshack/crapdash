'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IconConfig } from "@/lib/types";
import { ICON_TYPES } from "@/lib/types";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  appLogo?: IconConfig;
}

export function PageHeader({ title, description, children, appLogo }: PageHeaderProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const hasCustomLogo = appLogo?.type === ICON_TYPES.IMAGE && !logoFailed;
  const logoSrc = hasCustomLogo ? `/api/${appLogo.value}` : undefined;

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center">
                {hasCustomLogo ? (
                  <Image
                    src={logoSrc!}
                    alt="App logo"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setLogoFailed(true)}
                  />
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
