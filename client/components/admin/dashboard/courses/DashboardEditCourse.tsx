'use client';

import HandleCourse from '@/components/admin/dashboard/courses/handle/HandleCourse';

import {
  CourseQueryType,
  useCourseQuery,
} from '@/hooks/queries/useCourse.query';

type DashboardEditCourseProps = {
  courseId: string;
};

const DashboardEditCourse: React.FC<DashboardEditCourseProps> = ({
  courseId,
}) => {
  const { data, isLoading } = useCourseQuery({
    type: CourseQueryType.GET_ONE,
    params: { courseId: courseId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data || !data.course) {
    return 'Không tìm thấy khóa học';
  }

  return <HandleCourse isEdit={true} course={data.course} />;
};

export default DashboardEditCourse;
