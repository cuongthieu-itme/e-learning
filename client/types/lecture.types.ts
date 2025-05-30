import { LectureStatus } from '@/types/shared.types';

export type CreateLectureDto = {
  courseId: string;
  createdById: string;
  title: string;
  content: string;
  outline: string;
  pptxUrl?: string;
  mindmapUrl?: string;
  status?: LectureStatus;
};

export type GetLecturesDto = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

interface ICourse {
  _id: string;
  name: string;
  subject: string;
}

export interface ILecture {
  _id: string;
  courseId: string | ICourse;
  createdById: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  title: string;
  content: string;
  outline: string;
  pptxUrl?: string;
  mindmapUrl?: string;
  status: LectureStatus;
  createdAt?: string;
  updatedAt?: string;
}

