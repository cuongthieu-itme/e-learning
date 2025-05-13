export enum Role {
  User = 'user',
  Admin = 'admin',
  Teacher = 'teacher',
}

export type FieldType = 'text' | 'select' | 'multi';

export type CategoryField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  defaultValue?: string | number;
  description?: string;
  placeholder?: string;
};

export type Category = {
  id: number;
  parentId?: number;
  name: string;
  href?: string;
  fields?: CategoryField[];
  subcategories?: Category[];
};

export type ServerResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
};
