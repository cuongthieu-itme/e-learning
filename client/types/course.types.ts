export interface ICourse {
  _id: string;
  name: string;
  description: string;
  subject: string;
  isPublished: boolean;
  createdById: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetCoursesDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}
