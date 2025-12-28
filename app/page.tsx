import { getCategories, getServices } from '@/lib/db';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function Page() {
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices(),
  ]);

  return <DashboardClient categories={categories} services={services} />;
}