export enum Role {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin',
  Teacher = 'teacher',
}

export enum LectureStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface ResponseObject {
  statusCode: number;
  message?: string;
  [key: string]: any;
}
