'use client';

import { ICourse } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import HandleCourseForm from '../forms/handle-course/HandleCourseForm';

type HandleCourseProps =
  | {
    isEdit?: true;
    course: ICourse;
  }
  | { isEdit?: false };

const HandleCourse: React.FC<HandleCourseProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, course: props.course }
    : { isEdit: false as const, course: undefined };

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Sửa' : 'Thêm'} khóa học</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Sửa khóa học'
            : 'Thêm khóa học'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleCourseForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleCourse;
