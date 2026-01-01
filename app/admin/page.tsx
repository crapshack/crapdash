import { getCategories, getServices } from '@/lib/db';
import { AdminClient } from '@/components/admin/admin-client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices(),
  ]);

  return <AdminClient categories={categories} services={services} />;
}
