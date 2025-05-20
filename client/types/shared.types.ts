export enum Role {
  User = 'user',
  Admin = 'admin',
  Teacher = 'teacher',
}

export enum LectureStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
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

export type ServerResponse<T = any> = T & {
  statusCode: number;
  message: string;
};
