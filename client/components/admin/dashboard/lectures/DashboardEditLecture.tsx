'use client';

import HandleLecture from '@/components/admin/dashboard/lectures/handle/HandleLecture';

import {
  LectureQueryType,
  useLectureQuery,
} from '@/hooks/queries/useLecture.query';

type DashboardEditLectureProps = {
  lectureId: string;
};

const DashboardEditLecture: React.FC<DashboardEditLectureProps> = ({
  lectureId,
}) => {
  const { data, isLoading } = useLectureQuery({
    type: LectureQueryType.GET_ONE,
    params: { lectureId: lectureId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data || !data.lecture) {
    return 'Không tìm thấy bài giảng';
  }

  return <HandleLecture isEdit={true} lecture={data.lecture} />;
};

export default DashboardEditLecture;
