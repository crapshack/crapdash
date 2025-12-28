export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  categoryId: string;
  icon?: string;
  createdAt: string;
}

export interface DashboardConfig {
  categories: Category[];
  services: Service[];
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt'>;
export type ServiceFormData = Omit<Service, 'id' | 'createdAt'>;

export interface ValidationError {
  field: string;
  message: string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };
