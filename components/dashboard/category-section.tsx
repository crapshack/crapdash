import { ServiceCard } from './service-card';
import { CategoryIcon } from '@/components/ui/category-icon';
import type { Category, Service } from '@/lib/types';

interface CategorySectionProps {
  category: Category;
  services: Service[];
}

export function CategorySection({ category, services }: CategorySectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
        <CategoryIcon name={category.icon} className="h-5 w-5" />
        {category.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
