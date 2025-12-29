'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SettingsIcon } from '@/components/ui/settings';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PageHeader } from '@/components/layout/page-header';
import { CategoryLayout } from './category-layout';
import { SearchBar } from './search-bar';
import { LayoutToggle } from './layout-toggle';
import { useLayout } from '@/hooks/use-layout';
import type { Category, Service, DashboardLayout } from '@/lib/types';

interface DashboardClientProps {
  categories: Category[];
  services: Service[];
  initialLayout: DashboardLayout;
}

export function DashboardClient({ categories, services, initialLayout }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { layout, setLayout } = useLayout({ initialLayout });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return { categories, services };
    }

    const query = searchQuery.toLowerCase();
    const filteredServices = services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );

    const categoryIdsWithServices = new Set(filteredServices.map((s) => s.categoryId));
    const filteredCategories = categories.filter(
      (cat) =>
        categoryIdsWithServices.has(cat.id) ||
        cat.name.toLowerCase().includes(query)
    );

    return {
      categories: filteredCategories,
      services: filteredServices,
    };
  }, [searchQuery, categories, services]);

  return (
    <>
      <PageHeader
        title="crapdash"
        >
        <SearchBar ref={searchInputRef} value={searchQuery} onChange={setSearchQuery} />
        <LayoutToggle layout={layout} onLayoutChange={setLayout} />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-lg" asChild>
              <Link href="/admin">
                <SettingsIcon size={18} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Settings</TooltipContent>
        </Tooltip>
      </PageHeader>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {filteredData.categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found matching your search.</p>
          </div>
        ) : (
          <div
            className={
              layout === 'columns'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-12'
            }
          >
            {filteredData.categories.map((category) => {
              const categoryServices = filteredData.services.filter(
                (s) => s.categoryId === category.id
              );
              return (
                <CategoryLayout
                  key={category.id}
                  category={category}
                  services={categoryServices}
                  layout={layout}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
