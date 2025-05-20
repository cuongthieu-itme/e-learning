'use client';

import { ICourseTopic } from '@/types/course-topic.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import HandleCourseTopicForm from '@/components/admin/dashboard/course-topics/forms/handle-course-topic/HandleCourseTopicForm';

type HandleCourseTopicProps =
  | {
    isEdit?: true;
    courseTopic: ICourseTopic;
  }
  | { isEdit?: false };

const HandleCourseTopic: React.FC<HandleCourseTopicProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, courseTopic: props.courseTopic }
    : { isEdit: false as const, courseTopic: undefined };

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Sửa' : 'Thêm'} chủ đề khóa học</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Sửa chủ đề khóa học'
            : 'Thêm chủ đề khóa học'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleCourseTopicForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleCourseTopic;
