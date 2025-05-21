'use client';

import HandleCourseTopic from '@/components/admin/dashboard/course-topics/handle/HandleCourseTopic';

import {
  CourseTopicQueryType,
  useCourseTopicQuery,
} from '@/hooks/queries/useCourseTopic.query';

type DashboardEditCourseTopicProps = {
  courseTopicId: string;
};

const DashboardEditCourseTopic: React.FC<DashboardEditCourseTopicProps> = ({
  courseTopicId,
}) => {
  const { data, isLoading } = useCourseTopicQuery({
    type: CourseTopicQueryType.GET_ONE,
    params: { courseTopicId: courseTopicId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data || !data.courseTopic) {
    return 'Không tìm thấy chủ đề khóa học';
  }

  return <HandleCourseTopic isEdit={true} courseTopic={data.courseTopic} />;
};

export default DashboardEditCourseTopic;
