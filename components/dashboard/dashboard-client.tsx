'use client';

import { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { CategorySection } from './category-section';
import { SearchBar } from './search-bar';
import type { Category, Service } from '@/lib/types';

interface DashboardClientProps {
  categories: Category[];
  services: Service[];
}

export function DashboardClient({ categories, services }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="space-y-8">
      <PageHeader title="Crapdash">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <a href="/admin">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </a>
      </PageHeader>

      {filteredData.categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found matching your search.</p>
        </div>
      ) : (
        <div>
          {filteredData.categories.map((category) => {
            const categoryServices = filteredData.services.filter(
              (s) => s.categoryId === category.id
            );
            return (
              <CategorySection
                key={category.id}
                category={category}
                services={categoryServices}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
