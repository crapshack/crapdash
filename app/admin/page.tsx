'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Separator } from '@/components/ui/separator';
import { Plus, Home } from 'lucide-react';
import { CategoryList } from '@/components/admin/category-list';
import { ServiceList } from '@/components/admin/service-list';
import { CategoryFormModal } from '@/components/admin/category-form-modal';
import { ServiceFormModal } from '@/components/admin/service-form-modal';
import type { Category, Service } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [categoriesRes, servicesRes] = await Promise.all([
        fetch('/api/data?type=categories'),
        fetch('/api/data?type=services'),
      ]);

      if (categoriesRes.ok && servicesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const servicesData = await servicesRes.json();
        setCategories(categoriesData);
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleAddService = () => {
    setEditingService(undefined);
    setServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleCategoryModalClose = (open: boolean) => {
    setCategoryModalOpen(open);
    if (!open) {
      setEditingCategory(undefined);
    }
  };

  const handleServiceModalClose = (open: boolean) => {
    setServiceModalOpen(open);
    if (!open) {
      setEditingService(undefined);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <PageHeader
          title="Admin Dashboard"
          description="Manage categories and services"
        >
          <Button variant="outline" onClick={() => router.push('/')}>
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </PageHeader>
      </div>

      <div className="space-y-8">
        {/* Categories Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No categories yet. Create one to get started.
                </div>
              ) : (
                <CategoryList
                  categories={categories}
                  services={services}
                  onEdit={handleEditCategory}
                  onDeleted={handleRefresh}
                />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Services Section */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services</CardTitle>
                <Button onClick={handleAddService} disabled={categories.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Create a category first before adding services.
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              {services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No services yet. Add one to get started.
                </div>
              ) : (
                <ServiceList
                  services={services}
                  categories={categories}
                  onEdit={handleEditService}
                  onDeleted={handleRefresh}
                />
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={categoryModalOpen}
        onOpenChange={handleCategoryModalClose}
        category={editingCategory}
        onSuccess={handleRefresh}
      />

      <ServiceFormModal
        open={serviceModalOpen}
        onOpenChange={handleServiceModalClose}
        service={editingService}
        categories={categories}
        onSuccess={handleRefresh}
      />
    </main>
  );
}
