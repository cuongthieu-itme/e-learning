'use client';

import { ILecture } from '@/types/lecture.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import HandleLectureForm from '@/components/admin/dashboard/lectures/forms/handle-lecture/HandleLectureForm';

type HandleLectureProps =
  | {
    isEdit?: true;
    lecture: ILecture;
  }
  | { isEdit?: false };

const HandleLecture: React.FC<HandleLectureProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, lecture: props.lecture }
    : { isEdit: false as const, lecture: undefined };

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Sửa' : 'Thêm'} bài giảng</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Sửa bài giảng'
            : 'Thêm bài giảng mới'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleLectureForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleLecture;
