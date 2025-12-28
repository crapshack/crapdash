import { getCategories, getServices } from '@/lib/db';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function Page() {
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <DashboardClient categories={categories} services={services} />
    </main>
  );
}